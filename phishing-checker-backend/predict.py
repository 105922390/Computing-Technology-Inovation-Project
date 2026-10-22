"""
predict.py - score a URL with the trained model. Runs fully offline (never visits the URL).

Usage (from the project root):
  python src/predict.py "paypal.com@secure-login.tk/verify"
  python src/predict.py url1 url2 url3

predict_url(url) returns a dict, so the later web app can import and reuse it.
"""
import sys
from pathlib import Path

import joblib
import pandas as pd
import shap

try:                                            # run as a script: python src/predict.py
    from features import extract_features, split_host, SUSPICIOUS_WORDS, BRANDS, SUSPICIOUS_TLDS
    from process_data import clean_url
except ImportError:                             # imported as a package: from src.predict import ...
    from features import extract_features, split_host, SUSPICIOUS_WORDS, BRANDS, SUSPICIOUS_TLDS, SHORTENERS
    from process_data import clean_url

MODEL_PATH = Path("models/classifier.joblib")
_bundle = None


def load_model():
    global _bundle
    if _bundle is None:
        _bundle = joblib.load(MODEL_PATH)
    return _bundle["model"], _bundle["features"]


def addExtraInfo(url, feature, df_value):
    """Returns usable values to explain y/n features"""
    host, at, port = split_host(url)
    lower = url.lower()
    match feature:
        case "has_ip":
            return host
        case "has_at":
            return host
        case "has_port":
            return port
        case "suspicious_tld":
            return (host.split('.')[-1])
        case "brand_not_in_domain":
            return [b for b in BRANDS if b in lower]
        case "suspicious_words":
            return [w for w in SUSPICIOUS_WORDS if w in lower]
        case "is_shortener":
            return host
    return df_value

def mapResultData(url, df, contributions, cols):
    breakdown = {}

    for feature, contrib in zip(cols, contributions):
        breakdown[feature] = {
            "value" : addExtraInfo(url, feature, df[feature][0].item()),
            "contribution" : float(contrib)
        }
    return breakdown


def predict_url(url):
    cleaned = clean_url(url)
    if cleaned is None:
        return {"url": url, "error": "Not a valid web address"}
    model, feature_cols = load_model()
    explainer = shap.TreeExplainer(model)
    f = extract_features(cleaned)

    df = pd.DataFrame([f])[feature_cols]
    result = model.predict(df)[0]
    probablility = model.predict_proba(df)[0]
    shap_details = explainer.shap_values(df)

    trust = probablility[0] * 100, 2
    confidence = probablility[result] * 100, 2
    verdict = True if result == 1 else False

    # Getting data oriented around a positive (phishing) result by using 1 (see annotation below)
    # So in later results display, contribution is towards likelyhood of phishing.
    #                                                      1]
    #                                                      |
    resultData = mapResultData(url, df, shap_details[0, :, 1], feature_cols)
    base_prob = float(explainer.expected_value[1])
    #                                          |
    #                                         [1]

    return {
        "error": None,
        "confidence": confidence, 
        "trust_score": trust, 
        "is_phish": verdict,
        "base_prob": base_prob,
        "result_data": resultData}

def main():
    if len(sys.argv) < 2:
        print('Usage: python src/predict.py "<url>" ["<url>" ...]')
        sys.exit(1)
    for url in sys.argv[1:]:
        r = predict_url(url)
        print(f"\n{r['url']}")
        if "error" in r:
            print(f"  {r['error']}")
            continue
        print(f"  Trust score: {r['trust_score']}/100  ->  {r['verdict']}")
        for reason in r["reasons"] or ["No specific red flags found"]:
            print(f"  - {reason}")


if __name__ == "__main__":
    main()
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

try:                                            # run as a script: python src/predict.py
    from features import extract_features, split_host, SUSPICIOUS_WORDS, BRANDS, SUSPICIOUS_TLDS
    from process_data import clean_url
except ImportError:                             # imported as a package: from src.predict import ...
    from src.features import extract_features, split_host, SUSPICIOUS_WORDS, BRANDS, SUSPICIOUS_TLDS
    from src.process_data import clean_url

MODEL_PATH = Path("models/classifier.joblib")
_bundle = None


def load_model():
    global _bundle
    if _bundle is None:
        _bundle = joblib.load(MODEL_PATH)
    return _bundle["model"], _bundle["features"]


def explain(url, f):
    """Plain-English reasons, pointing at the part of the URL that looks suspicious.
    These are for the user to read; the model itself uses all 18 features."""
    host, _, _ = split_host(url)
    lower = url.lower()
    reasons = []
    if f["has_ip"]:
        reasons.append(f"Uses an IP address ({host}) instead of a domain name")
    if f["has_at"]:
        reasons.append(f"Contains '@': the browser ignores everything before it, the real site is {host}")
    if f["has_port"]:
        reasons.append("Specifies an unusual port number")
    if f["suspicious_tld"]:
        reasons.append(f"Ends in .{host.split('.')[-1]}, a top-level domain often abused for phishing")
    if f["brand_not_in_domain"]:
        brands = [b for b in BRANDS if b in lower]
        reasons.append(f"Mentions {', '.join(brands)} but the site is not {brands[0]}'s own domain")
    if f["suspicious_words"]:
        words = [w for w in SUSPICIOUS_WORDS if w in lower]
        reasons.append(f"Contains login/account words: {', '.join(words)}")
    if f["is_shortener"]:
        reasons.append("Uses a link shortener, which hides the real destination")
    if f["num_hyphens_host"] >= 2:
        reasons.append(f"Domain has {f['num_hyphens_host']} hyphens, common in look-alike domains")
    if f["num_dots_host"] >= 4:
        reasons.append(f"Many subdomains ({f['num_dots_host']} dots in the host), can hide the real domain")
    if f["url_length"] > 100:
        reasons.append(f"Very long address ({f['url_length']} characters)")
    if f["digit_ratio"] > 0.2:
        reasons.append(f"{f['digit_ratio']:.0%} of the address is digits, e.g. random tokens")
    return reasons


def predict_url(url):
    cleaned = clean_url(url)
    if cleaned is None:
        return {"url": url, "error": "Not a valid web address"}
    model, feature_cols = load_model()
    f = extract_features(cleaned)
    p_phish = model.predict_proba(pd.DataFrame([f])[feature_cols])[0, 1]
    trust = round((1 - p_phish) * 100)
    verdict = "Likely phishing" if p_phish >= 0.5 else "Probably safe"
    return {"url": url, "trust_score": trust, "verdict": verdict, "reasons": explain(cleaned, f)}


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
#turns each cleaned url into numeric features
#extract_features function imported by predict.py so the model always computes features the same way
import argparse
import math
import re
from collections import Counter
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from src import feature_conversion

#TLDs heavily abused for phishing
SUSPICIOUS_TLDS = {"tk", "ml", "ga", "cf", "gq", "xyz", "top", "work", "click", "link",
                   "zip", "review", "country", "kim", "science", "party", "loan", "win"}
#words phishing pages use to look like a login or an account page
SUSPICIOUS_WORDS = ["login", "signin", "logon", "verify", "account", "update", "secure",
                    "banking", "confirm", "password", "webscr", "suspend", "unlock", "wallet"]
#brands often impersonated
BRANDS = ["paypal", "apple", "microsoft", "amazon", "netflix", "ebay", "google",
          "facebook", "instagram", "outlook", "office365", "dropbox", "chase", "wellsfargo"]
SHORTENERS = {"bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly", "adf.ly"}
IP_RE = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")


def split_host(url):
    """Return (host, has_at, has_port) from a cleaned URL with no http://."""
    netloc = re.split(r"[/?#]", url, maxsplit=1)[0]
    has_at = "@" in netloc
    #real host is after the last @
    netloc = netloc.rsplit("@", 1)[-1]                 
    host, _, port = netloc.partition(":")
    return host.lower(), has_at, port.isdigit()


def entropy(s):
    """Shannon entropy: high for random-looking strings like 'x7qk2jz9'."""
    if not s:
        return 0.0
    counts = Counter(s)
    return -sum(c / len(s) * math.log2(c / len(s)) for c in counts.values())


def extract_features(url):
    url = str(url)
    host, has_at, has_port = split_host(url)
    #everything after the host
    path = url[len(url.split("/")[0]):]
    labels = host.split(".")
    tld = labels[-1] if labels else ""
    main_domain = ".".join(labels[-2:])                
    lower = url.lower()
    brand_hits = [b for b in BRANDS if b in lower]

    return {
        "url_length": len(url),
        "host_length": len(host),
        "path_length": len(path),
        "num_dots_host": host.count("."),
        "num_hyphens_host": host.count("-"),
        "num_digits": sum(ch.isdigit() for ch in url),
        "digit_ratio": sum(ch.isdigit() for ch in url) / max(len(url), 1),
        "num_special": sum(url.count(c) for c in "@?=&%_~"),
        "path_depth": path.count("/"),
        "host_entropy": entropy(host),
        "has_ip": int(bool(IP_RE.match(host))),
        "has_at": int(has_at),
        "has_port": int(has_port),
        "suspicious_tld": int(tld in SUSPICIOUS_TLDS),
        "suspicious_words": sum(w in lower for w in SUSPICIOUS_WORDS),
        #brand appears in the url but not in the owned domain
        "brand_not_in_domain": int(any(b not in main_domain for b in brand_hits)),
        "is_shortener": int(host in SHORTENERS),
        "has_encoding": int("%" in url)
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kaggle-w-feats", required=True)
    ap.add_argument("--in", dest="inp", default="data/processed")
    ap.add_argument("--out", default="data/features")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(Path(args.inp) / "processed.csv")
    feats = pd.DataFrame(df["url"].map(extract_features).tolist())
    result = pd.concat([df[["url", "label"]], feats], axis=1)
    result.to_csv(out / "features.csv", index=False)
    print(f"extracted feature dataframe: {len(result)} rows, {feats.shape[1]} features")

    df_alt_feats = feature_conversion.main(args.kaggle_w_feats, out)

    all_df = pd.concat(df, df_alt_feats)

    train, test = train_test_split(all_df, test_size=0.2, stratify=all_df["label"], random_state=42)
    train.to_csv(out / "train_features.csv", index=False)
    test.to_csv(out / "test_features.csv", index=False)

    print("\nAverage feature values by label (train):")
    print(pd.read_csv(out / "train_features.csv").drop(columns="url")
          .groupby("label").mean().T.round(3))

if __name__ == "__main__":
    main()
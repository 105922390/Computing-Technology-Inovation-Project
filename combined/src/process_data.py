#cleans and merges the 2 url datasets used then splits them into train and test sets
import argparse
import html
import json
import re
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split


def load_hf(files):
    df = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
    return pd.DataFrame({"url": df["text"], "label": df["label"], "source": "hf"})
def load_kaggle(path):
    df = pd.read_csv(path, encoding_errors="replace")
    #drops malware and defacement entries and only keeps benign and phishing
    df = df[df["type"].isin(["benign", "phishing"])]          
    return pd.DataFrame({"url": df["url"], "label": (df["type"] == "phishing").astype(int), "source": "kaggle"})
def load_cic_decoded_qr(path):
    df = pd.read_csv(path)
    return pd.DataFrame({"url": df["url"], "label": df["label"], "source": "cic_decoded_qr"})
def load_hf_kmak(path):
    df = pd.read_csv(path)
    return pd.DataFrame({"url": df["text"], "label": df["label"], "source": "hugging_face_kmak"})

def clean_url(url):
    if not isinstance(url, str):
        return None
    #remove stray quotes and turn &amp back into &
    url = html.unescape(url.strip().strip("'\""))      
    #remove http:// https://        
    url = re.sub(r"^[a-zA-Z]+://", "", url)  
    #remove www.                   
    url = re.sub(r"^www\.", "", url, flags=re.I)                
    host, sep, rest = url.partition("/")
     #domains are case insensitive so put in lowercase but paths are not and left alone
    url = host.lower() + sep + rest               
    #removes / from end of url paypal.com/ becomes paypal.com             
    url = url.rstrip("/")                
    #drops non web addresses                       
    return url if "." in host else None                         


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--hf-files", nargs="+", required=True)
    ap.add_argument("--kaggle", required=True)
    ap.add_argument("--decoded-qr", required=True)
    ap.add_argument("--hf-kmak", required=True)
    ap.add_argument("--out", default="data/processed")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    summary = {}

    df = pd.concat([
        load_hf(args.hf_files), 
        load_kaggle(args.kaggle), 
        load_cic_decoded_qr(args.decoded_qr), 
        load_hf_kmak(args.hf_kmak)], 
        ignore_index=True)
    
    summary["loaded"] = df.groupby("source").size().to_dict()

    #raw data overview added from cleaning.py (merged from ash's original code)
    print("\n--- Raw data overview ---")
    print("Shape:", df.shape)
    df.info()
    print("\nNulls:\n", df.isnull().sum())
    print("\nLabel counts by source:\n", df.groupby(["source", "label"]).size())

    df["url"] = df["url"].map(clean_url)
    summary["dropped_invalid"] = int(df["url"].isna().sum())
    df = df.dropna(subset=["url"])

    #same urls labelled both 0 and 1 dropped

    labels_per_url = df.groupby("url")["label"].nunique()
    conflicts = labels_per_url[labels_per_url > 1].index
    summary["dropped_conflicting_labels"] = len(conflicts)
    df = df[~df["url"].isin(conflicts)]

    before = len(df)
    df = df.drop_duplicates("url")
    summary["dropped_duplicates"] = before - len(df)

    train, test = train_test_split(df, test_size=0.2, stratify=df["label"], random_state=42)
    train.to_csv(out / "train.csv", index=False)
    test.to_csv(out / "test.csv", index=False)

    summary["final_rows"] = len(df)
    summary["label_counts"] = df["label"].value_counts().sort_index().to_dict()
    summary["train_rows"], summary["test_rows"] = len(train), len(test)
    (out / "processing_summary.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
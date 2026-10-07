import argparse
import html
import json
import re
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from src import process_data, features

def main(path, out):
    ap = argparse.ArgumentParser()
    df_all = pd.read_csv(path)
    summary = {}

    cleaned = process_data.clean_data(df_all)
    df = cleaned[0]
    summary = cleaned[1]

    old_features = pd.DataFrame({"url": df["url"], "label": df["label"], "url_length": df["url_length"], "has_ip":df["has_ip"], "path_depth" : df["num_subdirs"], "suspicious_words": df["suspicious_words"], "num_special": df["special_char_count"], "num_digits": df["digits_count"], "source": "kaggle_w_feats"})
    
    feats = pd.DataFrame(df["url"].map(features.extract_features).tolist())
    new_features = pd.concat([df[["url", "label"]], feats], axis=1)

    combined = pd.DataFrame({
        "url": old_features["url"],
        "label": old_features["label"],
        "url_length": old_features["url_length"],
        "host_length": new_features["host_length"],
        "path_length": new_features["path_length"],
        "num_dots_host": new_features["num_dots_host"],
        "num_hyphens_host": new_features["num_hyphens_host"],
        "num_digits": old_features["num_digits"], 
        "digit_ratio": new_features["digit_ratio"],
        "num_special": old_features["num_special"], 
        "path_depth": old_features["path_depth"], 
        "host_entropy": new_features["host_entropy"],
        "has_ip": old_features["has_ip"],
        "has_at": new_features["has_at"],
        "has_port": new_features["has_port"],
        "suspicious_tld": new_features["suspicious_tld"],
        "suspicious_words": new_features["suspicious_words"],
        "brand_not_in_domain": new_features["brand_not_in_domain"],
        "is_shortener": new_features["is_shortener"],
        "has_encoding": new_features["has_encoding"]
        })

    (out / "existing_feats_processing_summary.json").write_text(json.dumps(summary, indent=2))
    
    return combined

if __name__ == "__main__":
    main()
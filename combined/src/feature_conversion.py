import argparse
import html
import json
import re
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from . import process_data, features

def main(path, out):
    ap = argparse.ArgumentParser()
    df_all = pd.read_csv(path)
    df_all["source"] = "kaggle_w_feats"
    summary = {}

    df, summary = process_data.clean_data(df_all)

    old_features = pd.DataFrame({"url": df["url"], "label": df["label"], "url_length": df["url_length"], "has_ip":df["has_ip"], "path_depth" : df["num_subdirs"], "suspicious_words": df["suspicious_words"], "num_special": df["special_char_count"], "num_digits": df["digits_count"], "source": "kaggle_w_feats"})
    
    feats = pd.DataFrame(df["url"].map(features.extract_features).tolist())
    old_features = old_features.reset_index(drop=True)
    feats = feats.reset_index(drop=True)

    combined = pd.DataFrame({
        "url": old_features["url"],
        "label": old_features["label"],
        "url_length": old_features["url_length"],
        "host_length": feats["host_length"],
        "path_length": feats["path_length"],
        "num_dots_host": feats["num_dots_host"],
        "num_hyphens_host": feats["num_hyphens_host"],
        "num_digits": old_features["num_digits"], 
        "digit_ratio": feats["digit_ratio"],
        "num_special": old_features["num_special"], 
        "path_depth": old_features["path_depth"], 
        "host_entropy": feats["host_entropy"],
        "has_ip": old_features["has_ip"],
        "has_at": feats["has_at"],
        "has_port": feats["has_port"],
        "suspicious_tld": feats["suspicious_tld"],
        "suspicious_words": feats["suspicious_words"],
        "brand_not_in_domain": feats["brand_not_in_domain"],
        "is_shortener": feats["is_shortener"],
        "has_encoding": feats["has_encoding"]
        })

    combined["source"] = "kaggle_w_feats"
    combined, temp = process_data.clean_data(combined)

    (out / "existing_feats_processing_summary.json").write_text(json.dumps(summary, indent=2))
    
    return combined

if __name__ == "__main__":
    main()
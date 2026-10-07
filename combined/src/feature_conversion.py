import argparse
import html
import json
import re
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from src import process_data

def load_kaggle_w_feats(path):
	df = pd.read_csv(path)
	return pd.DataFrame({"url": df["url"], "label": ["label"], "url_length": ["url_length"], "has_ip":["has_ip"], "path_depth" :["num_subdirs"], "suspicious_words":["suspicious_words"], "num_special": ["special_char_count"], "num_digits": ["digits_count"], "source": "kaggle_w_feats"})
   

def match_existing_features(df):
    df = load_kaggle_w_feats(args.kaggle_w_feats)
    df = feature_conversion.match

    return df

def main(path):
    df = load_kaggle_w_feats(path)
    summary = {}

    cleaned = process_data.clean_data(df)
    df = cleaned[0]
    summary = cleaned[1]

    df = match_existing_features(df)
    
    return df

if __name__ == "__main__":
    main()
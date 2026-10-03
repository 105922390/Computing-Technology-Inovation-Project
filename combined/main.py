#runs entire pipeline in order from process to features to eda to train to culster, however prediction is seperate
import argparse
import sys
from src import process_data, features, eda, train_classifier, cluster

RAW_ARGS = ["--hf-files", "data/raw/hf_phishing_urls/train.csv", "data/raw/hf_phishing_urls/test.csv",
            "--kaggle", "data/raw/kaggle/malicious_phish.csv", 
            "--decoded-qr", "data/raw/qr_to_url.csv",
            "--hf-kmak", "data/raw/hf_kmak.csv",
            "--out", "data/processed"]

STAGES = [
    ("process",  process_data.main,     RAW_ARGS),
    ("features", features.main,         []),
    ("eda",      eda.main,              []),
    ("train",    train_classifier.main, []),
    ("cluster",  cluster.main,          []),
]

def main():
    names = [name for name, _, _ in STAGES]
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="start", default="process", choices=names,
                    help="stage to start from (default: process)")
    start = names.index(ap.parse_args().start)

    for name, run, args in STAGES[start:]:
        print(f"\n{'=' * 20} {name} {'=' * 20}")
        sys.argv = [name] + args          
        run()
    print("\nPipeline finished. Try: python src/predict.py \"example.com/login\"")

if __name__ == "__main__":
    main()
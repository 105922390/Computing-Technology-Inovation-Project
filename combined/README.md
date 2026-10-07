Phishing URL Detection

Run all commands from the project root folder (the one with main.py)

1. Setup (conda)
conda env create -f environment.yml
conda activate phishing-url

2. Data processing
Processed data is already included in data/processed.
To make the features from it:
python src/features.py
python src/eda.py

To redo the cleaning from the raw datasets (not included, download first):
Kaggle: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset -> put malicious_phish.csv in data/raw/kaggle/
Hugging Face: python -c "from datasets import load_dataset; ds=load_dataset('alexkstern/phishing_urls'); [ds[s].to_csv(f'data/raw/hf_phishing_urls/{s}.csv', index=False) for s in ds]"
(make the folder data/raw/hf_phishing_urls first)
python src/process_data.py --hf-files data/raw/hf_phishing_urls/train.csv data/raw/hf_phishing_urls/test.csv --kaggle data/raw/kaggle/malicious_phish.csv --out data/processed

3. Training
python src/train_classifier.py
python src/cluster.py
Final model is saved to models/classifier.joblib

Or run everything at once

python main.py --from features   (from processed data)
python main.py                   (from raw data)

4. Prediction
python src/predict.py "paypal.com@secure-login.tk/verify"

Put the URL in quotes
import pandas as pd
import cv2
from pathlib import Path
import re

# converts qr codes from a given folder of pngs to a datafram of urls and saves them to a csv file

# File paths - rename as nessecary
BENIGN = "benign_qr_codes_path"
MALICIOUS = "malicious_qr_codes_path"
SAVE_PATH = "save_path/file.csv"

def get_qrcode_urls(path, label):
    detector = cv2.QRCodeDetector()
    converted = []
    for file in Path(path).glob("*.png"):
        img = cv2.imread(str(file))

        url, points, straight_qrcode = detector.detectAndDecode(img)
        # 'points' = points bordering the qr code
        # 'straight_qrcode' = a straightened version of the qr code
        converted.append({
            "label": label,
            "url": url if url else None,
            })

    df = pd.DataFrame(converted)
    return df
        

def main():
    benign_qr_urls = get_qrcode_urls(BENIGN, 0)
    malicious_qr_urls = get_qrcode_urls(MALICIOUS, 1)

    # combine decoded benign and malicious urls
    translated_urls = pd.concat([benign_qr_urls, malicious_qr_urls]).copy()
    translated_urls.to_csv(path_or_buf="SAVE_PATH", index=False)



if __name__ == "__main__":
    main()
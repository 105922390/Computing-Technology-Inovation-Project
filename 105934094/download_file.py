import pandas as pd

df = pd.read_csv("hf://datasets/Mitake/PhishingURLsANDBenignURLs/PhishBenignDataset.csv")


## Download
df.to_csv('hf_mitake.csv', index=False)

print(df.sample(10))

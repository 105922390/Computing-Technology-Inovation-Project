import pandas as pd

# df = pd.read_csv("hf://datasets/Mitake/PhishingURLsANDBenignURLs/PhishBenignDataset.csv")
df = pd.read_csv("processed.csv")
## PROCESSING

# Get rid of whitespace
df['url'] = df['url'].str.strip()

# Remove quotation marks
df["url"] = df["url"].str.strip("\'").str.strip("\"")

# df.to_csv('processed.csv', index=False)

# Remove strings in quotes
# df["url"] = df["url"].str.removeprefix('\'').str.removeprefix('\"').str.removesuffix('\'').str.removesuffix('\"')

print(df.sample(10))

# # URL Length
# df["url_length"] = df["url"].str.len()

# # Hostname
# # Strip leading http(s)://www.

# df["has_www"] = df["url"].str.contains("www")

# only_with_www = df[df["has_www"] == True]
# print(only_with_www.head(10))
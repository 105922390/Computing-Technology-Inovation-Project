import pandas as pd

df = pd.read_csv("hf://datasets/Mitake/PhishingURLsANDBenignURLs/PhishBenignDataset.csv")
# df = pd.read_csv("processed.csv")

## CLEANING

# Get rid of leading & trailing whitespace & endlines
df['url'] = df['url'].str.strip()

# Get rid of white spaces
# df["url"] = df.drop() df["url"].str.contains(" ")
df.drop(
    df.loc[df["url"].str.contains(" ", na=False)].index,
    inplace=True
)



# Remove quotation marks
df["url"] = df["url"].str.strip("\'").str.strip("\"")

# print(df.isnull().sum())

# print(df["url"].duplicated().sum())

# duplicate_rows = df["url"].duplicated(keep=False).index
# df = df.drop(duplicate_rows)

# print(duplicate_rows[["url", "label"]])


## Download
df.to_csv('processed.csv', index=False)

print(df.sample(10))

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sklearn
# import qrcode
import os

# my data set had three csvs, so I merged them together
DATA_PATH1 = "./Datasets/raw/test.csv"
DATA_PATH2 = "./Datasets/raw/train.csv"
DATA_PATH3 = "./Datasets/raw/valid.csv"
df1 = pd.read_csv(DATA_PATH1)
df2 = pd.read_csv(DATA_PATH2)
df3 = pd.read_csv(DATA_PATH3)

# combine 3 csv files
df = pd.concat([df1,df2,df3]).copy()

# overview
print(df.head(5))

print("\n---Raw Data Overveiw---")


print("Shape:", df.shape)
print(df.info())

print("\nStatistics"); print(df.describe())

print("\nCounts:"); print(df.label.value_counts())
print("\nUnique Labels:"); print(df.label.nunique())

## cleaning
print("\n---Cleaning---")

print("\nNulls:"); print(df.isnull().sum())


# Clean numeric label column (coerce, remove inf)

num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
for c in num_cols:
    df[c] = pd.to_numeric(df[c], errors="coerce")
    df[c] = df[c].replace([np.inf, -np.inf], np.nan)

# Drop rows with bad URLs 

# remove entries with empty strings
df["text"] = df["text"].str.strip()
df.drop(
    df.loc[df["text"]==""].index
    , inplace=True)

# Remove any rows with whitespace characters
df.drop(
    df.loc[df["text"].str.contains(r"\s", na=False)].index
    , inplace=True
    )

# remove any rows with Nan
df.dropna(axis=0, inplace=True)

# remove any rows with unprintable characters
df.drop(
    df.loc[df['text'].str.contains(r"[\x00-\x1F\x7F]", na=False)].index
    , inplace=True
    )

# remove any invalid web urls
# optional http or https, must have at least a domain name
valid_pattern = r"^(https?://)?[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+(/[^\s]*)?$"  
okay_rows = df["text"].str.match(valid_pattern, na=False)
df = df[okay_rows]

# remove quotation marks
# note in csv files, it may add quotation may still to escape fields like commas
# single quotes
df["text"] = df["text"].where( # set to original if;
    ~(df["text"].str.contains(r"^'.*'$", na=False)), # condition -> not surrounded by quotes
    
    df["text"]
    .str.removeprefix("'")
    .str.removesuffix("'"), # else, remove quotes
)

#double quotes
df["text"] = df["text"].where( # set to original if;
    ~(df["text"].str.contains(r'^".*"$', na=False)), # condition -> not surrounded by quotes
    
    df["text"]
    .str.removeprefix('"')
    .str.removesuffix('"'),  # else, remove quotes
)

# remove duplicate rows
df.drop_duplicates(inplace=True)

# remove duplicate URLs (some URLs are mentioned twice but have conflicting labels!)
df.drop_duplicates(subset=["text"], inplace=True, keep=False) # Don't keep any as we don't know which label is accurate

print("\nBasic completeness check (missing values):")
print(df.isna().sum().sort_values(ascending=False).head(10))

print("\nLabel distribution (counts):")
print(df['label'].value_counts())

df.reset_index(drop=True, inplace=True)

# change column name
df.rename(columns={"text":"url"}, inplace=True)


# df.to_csv(path_or_buf="./Datasets/cleaned/cleaned_phishing_urls.csv", index=False)
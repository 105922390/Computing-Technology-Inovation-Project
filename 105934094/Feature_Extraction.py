import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sklearn
# import qrcode
import os
 
DATA_PATH = "./Datasets/cleaned/cleaned_data_campbell.csv"
df = pd.read_csv(DATA_PATH)

# Url length -----
df["url_length"] = df.url.str.len()

partitioned = (
    df["url"]
        .str.removeprefix("https://")   # remove any https://
        .str.removeprefix("http://")    # or http://
        .str.partition("/")             # partition everything based on the first forward slash
)

# Get hostname -----
# first part of partition
df["hostname"] = partitioned[0].str.partition(":")[0]  # remove port

# Get path -----
df["path"] = (
    partitioned[2]          # third half of partition, after /
    .str.partition("#")[0]  # remove fragments
    .str.partition("?")[0]  # remove queries
    )


# Ip address instead of domain? -----
df["ip_instead_domain"] = (
    df["hostname"].str.match(
        r"^(https?://)?\d{1,3}(\.\d{1,3}){3}",
        na=False
))

# Get domain name from hostname -----
domain_names = (
    df["hostname"]
    .str.rsplit(".", n=2) # splits from the right, using ".", at most 2 times
    .str[-2:] # gets the last two strings in list
    .str.join(".") # re-joins the two strings with a "."
    .str.partition(":")[0]  # remove port
)
# assign only to non-ip-addresses
df["domain_name"] = domain_names.where( # set domain name if;
    ~df["ip_instead_domain"], # condition -> not an ip address
    "", # else, put empty string
)

# Get top level domain from domain name -----
top_level_domains = (
    df["domain_name"]
    .str.rsplit(".", n=1) # splits from the right, using ".", at most 1 time
    .str[1] # gets the last string in list
)
# assign only to non-ip-addresses
df["top_level_domain"] = top_level_domains.where( # set top level domain if;
    ~df["ip_instead_domain"], # condition -> not an ip address
    "", # else, put empty string
)

# Get number of sub domains  -----
    # num sub domains = segments in hostname - domain name

    # segments in hostname = num dots + 1
    # domain name = 2

    # num sub domains = (num dots + 1) - (2)
    # thus, num sub domains = num dots -1 

num_sub_domains = (
    df["hostname"]
    .str.count(r"\.") - 1 # number of dots - 1
)

# only assign to non-ip-addresses
df["num_sub_domains"] = num_sub_domains.where(
    ~df["ip_instead_domain"], # condition -> not an ip address
        0, # else, enter none it"s an ip address
)


# Has https -----
df["has_https"] = (
    df["url"].str.match(
        r"^(https://)",
        na=False
))

# Number of queries -----
df["num_queries"] = (
    df["url"]
    .str.partition("?")[2] # want queries
    .str.count(r"&") + 1 # & used to seperate queries
)

# Length of hostname -----
df["hostname_length"] = df["hostname"].str.len()

# Length of path -----
df["path_length"] = df["path"].str.len()

# Number of dashes in hostname -----
df["num_hostname_dashes"] = df["hostname"].str.count(r"-")

# Number of dashes in whole url -----
df["num_dashes"] = df["url"].str.count(r"-")

# Number of forward slashes in whole url -----
df["num_slashes"] = df["url"].str.count(r"/")

# Number of dots in whole url -----
df["num_dots"] = df["url"].str.count(r"\.")

# Number of @ in whole url -----
df["num_at"] = df["url"].str.count(r"@")

# Number of ~ in whole url -----
df["num_tilde"] = df["url"].str.count(r"~")

# Number of _ in whole url -----
df["num_underscore"] = df["url"].str.count(r"_")

# Number of % in whole url -----
df["num_percent"] = df["url"].str.count(r"%")

# Number of & in whole url -----
df["num_and"] = df["url"].str.count(r"&")

# Number of # in whole url -----
df["num_hash"] = df["url"].str.count(r"#")

# Number of numeric characters in whole url -----
df["num_numeric"] = df["url"].str.count(r"\d")

# print(df.head())

# df.to_csv(path_or_buf="./Datasets/processed/processed_data_campbell.csv", index=False)

#eda.py makes exploratory charts of the processed data
#reads *.csv and *_features.csv 
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
FIG_DIR = Path("reports/figures")
COLOURS = {0: "#4C72B0", 1: "#DD5144"}
NAMES = {0: "Benign", 1: "Phishing"}

def save(name):
    plt.tight_layout()
    plt.savefig(FIG_DIR / f"eda_{name}.png", dpi=200, bbox_inches="tight")
    plt.close()



def main():
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    # processed = pd.concat([pd.read_csv(f"data/processed/{s}.csv") for s in ("train", "test")])
    feats = pd.concat([pd.read_csv(f"data/features/{s}_features.csv") for s in ("train", "test")])

    #class balance
    counts = feats["label"].value_counts().sort_index()
    ax = counts.rename(NAMES).plot.bar(color=[COLOURS[0], COLOURS[1]], figsize=(5, 4), rot=0)
    for i, v in enumerate(counts):
        ax.text(i, v, f"{v:,}\n({v / counts.sum():.0%})", ha="center", va="bottom")
    ax.set_ylabel("Number of URLs")
    ax.set_title("Class balance after cleaning")
    ax.set_ylim(0, counts.max() * 1.2)
    save("class_balance")

    #where each class comes from
    by_source = feats.groupby(["source", "label"]).size().unstack().rename(columns=NAMES)
    ax = by_source.plot.bar(stacked=True, color=[COLOURS[0], COLOURS[1]], figsize=(5, 4), rot=0)
    ax.set_ylabel("Number of URLs")
    ax.set_title("URLs by source dataset")
    save("by_source")

    #distributions of the main numeric features
    feats = feats.drop(columns="source")
    numeric = ["host_length", "num_dots_host", "num_hyphens_host", "num_digits", "host_entropy", "path_length"]
    fig, axes = plt.subplots(2, 3, figsize=(12, 7))
    for ax, col in zip(axes.flat, numeric):
        upper = feats[col].quantile(0.99)
        for label in (0, 1):
            vals = feats.loc[feats.label == label, col].clip(upper=upper)
            ax.hist(vals, bins=30, density=True, alpha=0.55, color=COLOURS[label], label=NAMES[label])
        ax.set_title(col)
    axes.flat[0].legend()
    fig.suptitle("Feature distributions: benign vs phishing", fontsize=14)
    save("feature_distributions")


    #how often each yes/no red flag appears in each class
    flags = ["suspicious_words", "brand_not_in_domain", "has_ip", "suspicious_tld",
             "has_port", "is_shortener", "has_at", "has_encoding"]
    rates = (feats[flags].gt(0).groupby(feats.label).mean() * 100).T.rename(columns=NAMES)
    ax = rates.plot.barh(color=[COLOURS[0], COLOURS[1]], figsize=(7, 5))
    ax.set_xlabel("% of URLs with the flag")
    ax.set_title("Red-flag features by class")
    ax.invert_yaxis()
    save("red_flags")

    print("Saved:", *sorted(p.name for p in FIG_DIR.glob("eda_*.png")), sep="\n  ")
    print("\nRed-flag rates (%):\n", rates.round(1).to_string())


if __name__ == "__main__":
    main()
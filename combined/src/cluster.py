#K means clustering, reads train_features and train.csv and creates cluster_choose_k.png and cluster_profiles.png
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

FIG_DIR = Path("reports/figures")
K_RANGE = range(2, 9)
SEED = 42
def main():
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    feats = pd.read_csv("data/features/train_features.csv")
    # feats["source"] = pd.read_csv("data/processed/train.csv")["source"].values
    feature_cols = [c for c in feats.columns if c not in ("url", "label", "source")]

    #clustering within a single class (no labels)
    phish = feats[feats.label == 1].reset_index(drop=True)
    print(f"Clustering {len(phish):,} phishing URLs on {len(feature_cols)} features")



    #counts like url_length are super skewed so log1p stops a few huge urls dominating
    #scaling puts all features on the same scale for distance calculation
    X = StandardScaler().fit_transform(np.log1p(phish[feature_cols]))

    #choose amount of clusters (script tries k = 2 to 8 and picks the one with the highest silhouette score)
    rng = np.random.default_rng(SEED)
    sample = rng.choice(len(X), size=min(10_000, len(X)), replace=False)
    inertias, silhouettes = [], []
    for k in K_RANGE:
        km = KMeans(n_clusters=k, n_init=10, random_state=SEED).fit(X)
        inertias.append(km.inertia_)
        silhouettes.append(silhouette_score(X[sample], km.labels_[sample]))
        print(f"  k={k}: silhouette={silhouettes[-1]:.3f}")
    best_k = list(K_RANGE)[int(np.argmax(silhouettes))]
    print(f"Chosen k = {best_k} (highest silhouette)")




    fig, (a1, a2) = plt.subplots(1, 2, figsize=(10, 4))
    a1.plot(list(K_RANGE), inertias, "o-"); a1.set(title="Elbow (inertia)", xlabel="k")
    a2.plot(list(K_RANGE), silhouettes, "o-"); a2.set(title="Silhouette score", xlabel="k")
    a2.axvline(best_k, ls="--", c="grey")
    plt.tight_layout(); plt.savefig(FIG_DIR / "cluster_choose_k.png", dpi=200); plt.close()

    phish["cluster"] = KMeans(n_clusters=best_k, n_init=10, random_state=SEED).fit_predict(X)

    #label composition check which shows all phishing because we had to cluster within one class
    print("\nCluster sizes and label composition:")
    comp = phish.groupby("cluster").agg(size=("url", "size"), pct_phishing=("label", "mean"))
    comp["pct_phishing"] = (comp.pct_phishing * 100).round(1)
    print(comp.to_string())
    print("\nSource composition (% of each cluster):")
    print((pd.crosstab(phish.cluster, phish.source, normalize="index") * 100).round(1).to_string())


    #for every feature it takes its average from the overall phishing average and divides by standard deviation
    overall_mean, overall_std = phish[feature_cols].mean(), phish[feature_cols].std().replace(0, 1)
    profiles = (phish.groupby("cluster")[feature_cols].mean() - overall_mean) / overall_std

    for c in profiles.index:
        diffs = profiles.loc[c].sort_values(key=abs, ascending=False).head(3)
        print(f"\n=== Cluster {c}  ({comp.loc[c, 'size']:,} URLs, "
              f"{comp.loc[c, 'size'] / len(phish):.0%} of phishing) ===")
        for feat, z in diffs.items():
            direction = "HIGHER" if z > 0 else "LOWER"
            print(f"  {feat:20s} {direction} than average  "
                  f"(cluster mean {phish.loc[phish.cluster == c, feat].mean():.2f} "
                  f"vs overall {overall_mean[feat]:.2f})")
        print("  Example URLs:")
        for u in phish.loc[phish.cluster == c, "url"].sample(5, random_state=SEED):
            print("   ", u[:110])

    #heatmap of the profiles for the report
    fig, ax = plt.subplots(figsize=(11, 0.6 * best_k + 2))
    im = ax.imshow(profiles.clip(-2, 2), cmap="coolwarm", vmin=-2, vmax=2, aspect="auto")
    ax.set_xticks(range(len(feature_cols)), feature_cols, rotation=60, ha="right")
    ax.set_yticks(range(best_k), [f"Cluster {c}" for c in profiles.index])
    fig.colorbar(im, label="Std devs from phishing average")
    ax.set_title("Phishing cluster profiles (red = above average, blue = below)")
    plt.tight_layout(); plt.savefig(FIG_DIR / "cluster_profiles.png", dpi=200); plt.close()
    print("\nSaved reports/figures/cluster_choose_k.png and cluster_profiles.png")


if __name__ == "__main__":
    main()
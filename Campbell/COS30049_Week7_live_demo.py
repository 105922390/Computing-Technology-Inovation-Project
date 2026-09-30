"""
COS30049 Week 7 - live coding
Classification, DBSCAN, and the file Assignment 3 will load

HOW THIS FITS
Week 5: raw text into a feature table, by hand.
Week 6: fit a model, measure it, cluster without labels.
This week: the task Assignment 2 actually requires, plus the two pieces that
nothing else in the unit covers: Pipeline, and saving a trained model so that
your Assignment 3 web app can load it.

Run it in cells. Every printed number matches the lecture slides.

    pip install pandas numpy scikit-learn matplotlib joblib
"""

# %% ─────────────────────────────────────────────────────────────
# STEP 1  Same data as last week
# ────────────────────────────────────────────────────────────────
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ── where the plots go ───────────────────────────────────────────
# Every chart below is written to a file rather than opened in a window, so
# this runs the same way in a notebook, in a terminal, and over ssh with no
# display attached. Open the folder beside you while you teach.
import os

PLOTS = "plots"
os.makedirs(PLOTS, exist_ok=True)


def save(name, dpi=140):
    """Write the current figure to plots/ and say where it went."""
    path = os.path.join(PLOTS, name)
    plt.tight_layout()
    plt.savefig(path, dpi=dpi, bbox_inches="tight")
    plt.close()
    print("saved", path)



URL = ("https://raw.githubusercontent.com/plotly/"
       "datasets/master/winequality-red.csv")
wine = pd.read_csv(URL)
FEATURES = [c for c in wine.columns if c != "quality"]

print(wine.shape)                      # (1599, 12)
print(len(FEATURES), "features")       # 11


# %% ─────────────────────────────────────────────────────────────
# STEP 2  DBSCAN, starting with the shape K-means cannot do
# ────────────────────────────────────────────────────────────────
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN, KMeans
from sklearn.metrics import silhouette_score

Xm, _ = make_moons(n_samples=500, noise=0.08, random_state=42)
Xm = StandardScaler().fit_transform(Xm)

km_lab = KMeans(2, n_init=10, random_state=42).fit_predict(Xm)
db_lab = DBSCAN(eps=0.3, min_samples=5).fit_predict(Xm)

print(f"kmeans silhouette  {silhouette_score(Xm, km_lab):.3f}")   # 0.493
print(f"dbscan silhouette  {silhouette_score(Xm, db_lab):.3f}")   # 0.384
print("dbscan found", len(set(db_lab)) - (1 if -1 in db_lab else 0), "clusters")

fig, ax = plt.subplots(1, 2, figsize=(9, 3.5))
ax[0].scatter(Xm[:, 0], Xm[:, 1], c=km_lab, s=8, cmap="coolwarm")
ax[0].set_title("K-means: one straight cut")
ax[1].scatter(Xm[:, 0], Xm[:, 1], c=db_lab, s=8, cmap="coolwarm")
ax[1].set_title("DBSCAN: follows each arc")
save("02_moons_kmeans_vs_dbscan.png")

# K-means scores HIGHER and K-means is wrong. Silhouette rewards round compact
# clusters, so it is biased against the very shapes DBSCAN exists for.
# A metric is a tool, not a verdict.


# %% ─────────────────────────────────────────────────────────────
# STEP 3  Choosing eps without guessing
# ────────────────────────────────────────────────────────────────
from sklearn.neighbors import NearestNeighbors

nn = NearestNeighbors(n_neighbors=5).fit(Xm)
dist, _ = nn.kneighbors(Xm)

plt.plot(np.sort(dist[:, 4]))
plt.axhline(0.3, color="red", ls="--")
plt.xlabel("points, sorted by distance to their 5th neighbour")
plt.ylabel("distance")
save("03_k_distance.png")

# Most points sit close to their fifth neighbour, then the curve turns sharply
# up. That knee is where points stop being in a crowd. Read eps off it.
# Use n_neighbors equal to whatever you will pass as min_samples.


# %% ─────────────────────────────────────────────────────────────
# STEP 4  The same code on real data, where it struggles
# ────────────────────────────────────────────────────────────────
X = wine[FEATURES]
X_scaled = StandardScaler().fit_transform(X)

for eps in [1.5, 2.0, 2.5]:
    lab = DBSCAN(eps=eps, min_samples=5).fit_predict(X_scaled)
    n_clusters = len(set(lab)) - (1 if -1 in lab else 0)
    noise = list(lab).count(-1)
    print(f"eps={eps}  clusters {n_clusters}  noise {noise} ({noise/len(lab):.0%})")

# eps=1.5  clusters 3  noise 333 (21%)
# eps=2.0  clusters 3  noise 126 (8%)
# eps=2.5  clusters 3  noise  55 (3%)
#
# Eleven dimensions are sparse, so eps has to grow before anything joins up,
# and by then a fifth of the data is noise. DBSCAN shines in two or three
# dimensions. Knowing when a method does not suit your data is a finding.


# %% ─────────────────────────────────────────────────────────────
# STEP 5  Now classification. Make the target.
# ────────────────────────────────────────────────────────────────
from sklearn.model_selection import train_test_split

y = (wine["quality"] >= 6).astype(int)      # 1 = good, 0 = bad
X = wine[FEATURES]

print(y.value_counts().to_dict())           # {1: 855, 0: 744}
print(f"{y.mean():.1%} good")               # 53.5%

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=42)

print(f"train {y_train.mean():.1%} good, test {y_test.mean():.1%} good")

# stratify=y keeps the class ratio identical on both sides. Last week y was a
# number so there was nothing to balance. Now there is, and leaving it out lets
# an unlucky split under-represent one class in the test set.


# %% ─────────────────────────────────────────────────────────────
# STEP 6  Pipeline. Scaling by hand leaks the test set.
# ────────────────────────────────────────────────────────────────
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

# WRONG, and nothing warns you:
#     X_scaled = StandardScaler().fit_transform(X)     <- saw every row
#     train_test_split(X_scaled, y)                    <- too late

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)

print("accuracy", round(pipe.score(X_test, y_test), 3))

# The Pipeline fits the scaler on the training rows only, then applies those
# same numbers to the test rows. It also means predict() handles scaling for
# you, so you cannot forget it later. That matters enormously in step 12.


# %% ─────────────────────────────────────────────────────────────
# STEP 7  Four models, one loop, each inside a Pipeline
# ────────────────────────────────────────────────────────────────
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, precision_score,
                             recall_score, f1_score)

models = {
    "logistic": LogisticRegression(max_iter=1000),
    "knn":      KNeighborsClassifier(n_neighbors=5),
    "tree":     DecisionTreeClassifier(max_depth=4, random_state=42),
    "forest":   RandomForestClassifier(n_estimators=200, random_state=42),
}

fitted = {}
print(f"{'model':<10} {'acc':>6} {'prec':>6} {'rec':>6} {'F1':>6}")
for name, m in models.items():
    pipe = Pipeline([("scaler", StandardScaler()), ("model", m)])
    pipe.fit(X_train, y_train)
    fitted[name] = pipe
    p = pipe.predict(X_test)
    print(f"{name:<10} {accuracy_score(y_test, p):>6.3f} "
          f"{precision_score(y_test, p):>6.3f} "
          f"{recall_score(y_test, p):>6.3f} {f1_score(y_test, p):>6.3f}")

# Three of the four sit within 0.001 of each other on F1. That is noise, not a
# finding. Do not write that one beat another until step 9 tells you whether
# the gap is real.


# %% ─────────────────────────────────────────────────────────────
# STEP 8  Read the mistakes, not the score
# ────────────────────────────────────────────────────────────────
from sklearn.metrics import confusion_matrix, classification_report

pred = fitted["logistic"].predict(X_test)
print(confusion_matrix(y_test, pred))
print()
print(classification_report(y_test, pred, target_names=["bad", "good"]))

# [[161  62]      161 correctly called bad,   62 bad we called good
#  [ 66 191]]      66 good we called bad,    191 correctly called good
#
# Rows are the truth, columns are the prediction. Paste the whole report into
# your assignment, not a single number.


# %% ─────────────────────────────────────────────────────────────
# STEP 8b  The loss the model was actually trained on
# Lecture step 4 said classifiers train on log loss, not MSE.
# ────────────────────────────────────────────────────────────────
from sklearn.metrics import log_loss

probs = fitted["logistic"].predict_proba(X_test)[:, 1]
print("log_loss:", round(log_loss(y_test, probs), 4))      # 0.5143

# the same thing by hand, for one row
i = 0
p_correct = probs[i] if y_test.iloc[i] == 1 else 1 - probs[i]
print(f"row {i}: truth {y_test.iloc[i]}, P(good) {probs[i]:.3f}, "
      f"penalty {-np.log(p_correct):.3f}")

# and averaged over every row, which is all log_loss does
by_hand = np.mean([-np.log(pp if yy == 1 else 1 - pp)
                   for pp, yy in zip(probs, y_test)])
print("by hand:", round(by_hand, 4))                       # 0.5143

# Accuracy, precision and recall all judge the final decision.
# Log loss judges the probability behind it, which is why it is what you
# train on and not what you report.


# %% ─────────────────────────────────────────────────────────────
# STEP 8c  Make the positive class rare, and watch accuracy lie
# This is the lecture's base-rate argument, on data you already have.
# ────────────────────────────────────────────────────────────────
from sklearn.metrics import accuracy_score

for cut in [6, 7]:
    yy = (wine["quality"] >= cut).astype(int)
    a, b, ya, yb = train_test_split(X, yy, test_size=0.3,
                                    stratify=yy, random_state=42)
    pipe = Pipeline([("scaler", StandardScaler()),
                     ("model", LogisticRegression(max_iter=1000))]).fit(a, ya)
    pred = pipe.predict(b)
    print(f"cut>={cut}  positive {yy.mean():.1%}  "
          f"accuracy {accuracy_score(yb, pred):.3f}  f1 {f1_score(yb, pred):.3f}  "
          f"(all-zero baseline {1 - yb.mean():.3f})")

# cut>=6  positive 53.5%  accuracy 0.733  f1 0.749  (all-zero baseline 0.465)
# cut>=7  positive 13.6%  accuracy 0.887  f1 0.438  (all-zero baseline 0.865)
#
# Accuracy went UP and the model got much worse. At the stricter cut, saying
# bad to everything scores 0.865 by doing nothing. Your own assignment data
# looks like the second row, not the first: log anomaly is about 3 percent.


# %% ─────────────────────────────────────────────────────────────
# STEP 8d  One knob for an uneven class
# ────────────────────────────────────────────────────────────────
yy = (wine["quality"] >= 7).astype(int)
a, b, ya, yb = train_test_split(X, yy, test_size=0.3,
                                stratify=yy, random_state=42)

for cw in [None, "balanced"]:
    pipe = Pipeline([("scaler", StandardScaler()),
                     ("model", LogisticRegression(max_iter=1000,
                                                  class_weight=cw))]).fit(a, ya)
    pred = pipe.predict(b)
    print(f"class_weight={str(cw):<9} precision {precision_score(yb, pred):.3f}  "
          f"recall {recall_score(yb, pred):.3f}  f1 {f1_score(yb, pred):.3f}")

# None      precision 0.677  recall 0.323  f1 0.438
# balanced  precision 0.393  recall 0.815  f1 0.530
#
# Recall more than doubled, precision nearly halved. Same trade as moving the
# threshold, reached a different way: class_weight changes what the model
# optimises during training, the threshold changes what you do afterwards.
# Say in your report which one you used.

# %% ─────────────────────────────────────────────────────────────
# STEP 9  Was that comparison worth anything?
# ────────────────────────────────────────────────────────────────
from sklearn.model_selection import cross_val_score, StratifiedKFold

cv = StratifiedKFold(5, shuffle=True, random_state=42)

for name, m in models.items():
    pipe = Pipeline([("scaler", StandardScaler()), ("model", m)])
    s = cross_val_score(pipe, X, y, cv=cv, scoring="f1")
    print(f"{name:<10} {s.mean():.3f} +/- {s.std():.3f}    {s.round(3)}")

# logistic 0.755 +/- 0.037, and its five folds run 0.695 to 0.800.
# A spread of 0.105. Any single-split gap smaller than that means nothing.
# The forest at 0.818 is genuinely ahead. The other three are a three-way tie.


# %% ─────────────────────────────────────────────────────────────
# STEP 10  Tuning, and knowing when it did not help
# ────────────────────────────────────────────────────────────────
from sklearn.model_selection import GridSearchCV

pipe = Pipeline([("scaler", StandardScaler()),
                 ("model", RandomForestClassifier(random_state=42))])

grid = {"model__n_estimators": [100, 300],
        "model__max_depth": [None, 10]}

gs = GridSearchCV(pipe, grid, cv=3, scoring="f1", n_jobs=-1)
gs.fit(X, y)

for params, score in zip(gs.cv_results_["params"],
                         gs.cv_results_["mean_test_score"]):
    print(f"{score:.3f}   {params}")
print("\nbest:", gs.best_params_, round(gs.best_score_, 3))

# All four land within 0.006 of each other, far inside the fold-to-fold noise
# you measured in step 9. The honest conclusion is that tuning did not help
# here, and saying so is worth more than presenting 0.731 as an achievement.
#
# Note the double underscore: model__n_estimators means "the n_estimators of
# the step called model". That is how you reach inside a Pipeline.


# %% ─────────────────────────────────────────────────────────────
# STEP 11  The threshold is a decision, and it is yours
# ────────────────────────────────────────────────────────────────
probs = fitted["logistic"].predict_proba(X_test)[:, 1]

print(f"{'thr':>5} {'precision':>10} {'recall':>8}")
for t in [0.3, 0.4, 0.5, 0.6, 0.7]:
    p = (probs >= t).astype(int)
    print(f"{t:>5} {precision_score(y_test, p):>10.3f} "
          f"{recall_score(y_test, p):>8.3f}")

ts = np.arange(0.2, 0.85, 0.02)
plt.plot(ts, [precision_score(y_test, (probs >= t).astype(int)) for t in ts],
         label="precision")
plt.plot(ts, [recall_score(y_test, (probs >= t).astype(int)) for t in ts],
         label="recall")
plt.axvline(0.5, color="grey", ls="--")
plt.xlabel("decision threshold"); plt.legend()
save("11_threshold_tradeoff.png")

# The model never changed. Only the number you compare its probability against.
# predict() is exactly (predict_proba >= 0.5). If you never call
# predict_proba, you accepted a decision you never made.
#
# For your own topic: which mistake hurts your user more? That answer sets
# this number, and the report has to say so.


# %% ─────────────────────────────────────────────────────────────
# STEP 12  Save the trained pipeline. This is the Assignment 3 bridge.
# ────────────────────────────────────────────────────────────────
import joblib
import os

final = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier(n_estimators=200, random_state=42)),
])
final.fit(X_train, y_train)

joblib.dump(final, "wine_model.joblib")
print(f"model file: wine_model.joblib, {os.path.getsize('wine_model.joblib') / 1024:.0f} KB")

# Because the whole Pipeline is saved, the scaler travels with the model.
# Save the bare model instead and you must reproduce the exact scaling by hand
# inside the web app, which is where this goes wrong every single year.


# %% ─────────────────────────────────────────────────────────────
# STEP 13  Load it as your web app would
# Pretend this cell is a different file, on a different machine.
# ────────────────────────────────────────────────────────────────
model = joblib.load("wine_model.joblib")

# what a Flask or FastAPI route receives from the front end
user_input = {
    "fixed acidity": 7.4, "volatile acidity": 0.70, "citric acid": 0.00,
    "residual sugar": 1.9, "chlorides": 0.076, "free sulfur dioxide": 11.0,
    "total sulfur dioxide": 34.0, "density": 0.9978, "pH": 3.51,
    "sulphates": 0.56, "alcohol": 9.4,
}

row = pd.DataFrame([user_input])[FEATURES]      # column order must match
prob = model.predict_proba(row)[0][1]

print(f"predicted class {model.predict(row)[0]}   probability good {prob:.3f}")
print("matches the in-memory model:",
      bool((model.predict(X_test) == final.predict(X_test)).all()))

# Three things that will bite you here:
#   the file is about 5 MB, so decide deliberately whether it goes in your repo
#   the columns must match by name AND order, so build a DataFrame, not a list
#   a model saved under sklearn 1.5 may refuse to load under 1.2, so pin it


# %% ─────────────────────────────────────────────────────────────
# STEP 14  Which features did the work
# ────────────────────────────────────────────────────────────────
forest = fitted["forest"].named_steps["model"]
imp = pd.Series(forest.feature_importances_, index=FEATURES).nlargest(6)
print(imp.round(3))

imp[::-1].plot.barh()
plt.xlabel("importance")
save("14_feature_importance.png")

# Alcohol comes first, as it did in last week's regression. Two different
# models agreeing is worth reporting.
# One warning: importance means the feature was useful for splitting. It does
# not mean it causes anything. Alcohol does not make a wine good.


# %% ─────────────────────────────────────────────────────────────
# STEP 15  Recap
# ────────────────────────────────────────────────────────────────
os.remove("wine_model.joblib")          # tidy up after the demo

print("""
Classification
    the same fit / predict interface for every model
    Pipeline, so the scaler is fitted on training rows only
    confusion matrix first, single metrics second

Judging it
    cross_val_score, because one split is one number
    a gap smaller than the fold-to-fold spread is not a result
    GridSearchCV, and the discipline to report that it did not help

Deployment
    joblib.dump saves the whole Pipeline
    joblib.load in your Assignment 3 backend
    build the input as a DataFrame with the right column names

Your assignment adds the one thing this dataset skipped: turning raw input
into these columns in the first place. That was week 5.
""")
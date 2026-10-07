#train logistic regression and random forest then compare and save the better one and its eval charts
from pathlib import Path
import joblib
import matplotlib
#save charts as files
matplotlib.use("Agg")                                   
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (ConfusionMatrixDisplay, classification_report,
                             f1_score, precision_score, recall_score, accuracy_score)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

FEATURES_DIR = Path("data/features")
MODELS_DIR = Path("models")
FIG_DIR = Path("reports/figures")


def main():
    MODELS_DIR.mkdir(exist_ok=True)
    FIG_DIR.mkdir(parents=True, exist_ok=True)

    train = pd.read_csv(FEATURES_DIR / "train_features.csv")
    test = pd.read_csv(FEATURES_DIR / "test_features.csv")
    feature_cols = [c for c in train.columns if c not in ("url", "label")]
    X_train, y_train = train[feature_cols], train["label"]
    X_test, y_test = test[feature_cols], test["label"]

    

    #as theres 79% benign urls, a model can score well just by guessing benign all the time
    #so class_weight="balanced" makes each phishing mistake weighted more heavily to counteract this
    models = {
        "Logistic Regression": make_pipeline(
            StandardScaler(), LogisticRegression(max_iter=1000, class_weight="balanced")),
        "Random Forest": RandomForestClassifier(
            n_estimators=100, max_depth=20, min_samples_leaf=5,
            class_weight="balanced", n_jobs=-1, random_state=42),
    }

    results = []
    for name, model in models.items():
        print(f"\n=== {name} ===")
        model.fit(X_train, y_train)
        pred = model.predict(X_test)
        print(classification_report(y_test, pred, target_names=["benign", "phishing"], digits=3))
        results.append({"model": name,
                        "accuracy": accuracy_score(y_test, pred),
                        "precision": precision_score(y_test, pred),
                        "recall": recall_score(y_test, pred),
                        "f1": f1_score(y_test, pred)})

        ConfusionMatrixDisplay.from_predictions(y_test, pred, display_labels=["benign", "phishing"],
                                                cmap="Blues", values_format="d")
        plt.title(name)
        plt.savefig(FIG_DIR / f"confusion_{name.lower().replace(' ', '_')}.png", dpi=200, bbox_inches="tight")
        plt.close()

    comparison = pd.DataFrame(results).round(3)
    print("\n=== Comparison (phishing = positive class) ===")
    print(comparison.to_string(index=False))

    best = comparison.loc[comparison.f1.idxmax(), "model"]
    joblib.dump({"model": models[best], "features": feature_cols}, MODELS_DIR / "classifier.joblib", compress=3)
    print(f"\nSaved best model by F1: {best} -> models/classifier.joblib")

    #features the random forest relied on most
    rf = models["Random Forest"]
    imp = pd.Series(rf.feature_importances_, index=feature_cols).sort_values()
    imp.plot.barh(figsize=(7, 6), title="Random Forest feature importance")
    plt.xlabel("Importance")
    plt.savefig(FIG_DIR / "feature_importance.png", dpi=200, bbox_inches="tight")
    plt.close()
    print("\nTop 5 features:\n", imp.sort_values(ascending=False).head(5).round(3).to_string())


if __name__ == "__main__":
    main()
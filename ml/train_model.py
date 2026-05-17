import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

def train_model():
    try:
        df = pd.read_csv('synthetic_student_data.csv')
    except FileNotFoundError:
        print("synthetic_student_data.csv not found. Please run generate_data.py first.")
        return

    X = df[['topic_completion_pct', 'days_until_deadline', 'avg_mock_score', 'free_time_available']]
    y = df['daily_study_time']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    print(f"Model trained. Mean Squared Error: {mse:.2f}")

    joblib.dump(model, 'model.pkl')
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train_model()

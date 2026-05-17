import pandas as pd
import numpy as np

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    topic_completion_pct = np.random.uniform(0, 100, num_samples)
    days_until_deadline = np.random.randint(1, 180, num_samples)
    avg_mock_score = np.random.uniform(0, 100, num_samples)
    free_time_available = np.random.randint(60, 300, num_samples) # minutes
    
    # Formula for study time needed:
    raw_study_time = 150 - (topic_completion_pct * 1.0) - (avg_mock_score * 0.5) + (500 / days_until_deadline)
    # add some noise
    raw_study_time += np.random.normal(0, 10, num_samples)
    
    # ensure bounds
    daily_study_time = np.clip(raw_study_time, 15, free_time_available)
    
    df = pd.DataFrame({
        'topic_completion_pct': topic_completion_pct,
        'days_until_deadline': days_until_deadline,
        'avg_mock_score': avg_mock_score,
        'free_time_available': free_time_available,
        'daily_study_time': daily_study_time
    })
    
    df.to_csv('synthetic_student_data.csv', index=False)
    print("Generated synthetic_student_data.csv with", num_samples, "records.")

if __name__ == "__main__":
    generate_synthetic_data()

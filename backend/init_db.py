import os
import sqlite3

def init_db():
    # Database is stored in the backend directory alongside this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'iapt.db')
    
    print(f"Initializing SQLite database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    schema = """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        college VARCHAR(255),
        branch VARCHAR(100),
        year INT,
        reg_no VARCHAR(100),
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS timetable (
        timetable_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        subject VARCHAR(255),
        day VARCHAR(20),
        date DATE,
        start_time TIME,
        end_time TIME,
        location VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subjects (
        subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        subject_name VARCHAR(255),
        semester INT,
        credits INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS study_plan (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        plan_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS topics (
        topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INT,
        topic_name VARCHAR(255),
        category VARCHAR(100),
        priority VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Not Started',
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
        resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INT,
        title VARCHAR(255),
        type VARCHAR(50),
        url TEXT,
        added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mock_tests (
        mock_test_id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_name VARCHAR(255),
        difficulty VARCHAR(50),
        questions_count INT,
        duration INT
    );

    CREATE TABLE IF NOT EXISTS questions (
        question_id INTEGER PRIMARY KEY AUTOINCREMENT,
        mock_test_id INT,
        question_text TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option VARCHAR(10),
        FOREIGN KEY (mock_test_id) REFERENCES mock_tests(mock_test_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mock_test_attempts (
        attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        mock_test_id INT,
        score FLOAT,
        percentage FLOAT,
        taken_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_taken INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (mock_test_id) REFERENCES mock_tests(mock_test_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS placement_applications (
        app_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        company VARCHAR(255),
        role VARCHAR(255),
        application_date DATE,
        status VARCHAR(50),
        next_step VARCHAR(255),
        expected_date DATE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    """
    
    try:
        cursor.executescript(schema)
        conn.commit()
        print("Database schema loaded successfully!")
    except Exception as e:
        print(f"Error loading schema: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()

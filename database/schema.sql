CREATE DATABASE IF NOT EXISTS iapt_db;
USE iapt_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE timetable (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    day VARCHAR(20),
    date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject_name VARCHAR(255),
    semester INT,
    credits INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE study_plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plan_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT,
    topic_name VARCHAR(255),
    category VARCHAR(100),
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Not Started',
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT,
    title VARCHAR(255),
    type VARCHAR(50),
    url TEXT,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE mock_tests (
    mock_test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255),
    difficulty VARCHAR(50),
    questions_count INT,
    duration INT -- in minutes
);

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    mock_test_id INT,
    question_text TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_option VARCHAR(10),
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(mock_test_id) ON DELETE CASCADE
);

CREATE TABLE mock_test_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    mock_test_id INT,
    score FLOAT,
    percentage FLOAT,
    taken_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_taken INT, -- in seconds
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(mock_test_id) ON DELETE CASCADE
);

CREATE TABLE placement_applications (
    app_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company VARCHAR(255),
    role VARCHAR(255),
    application_date DATE,
    status VARCHAR(50),
    next_step VARCHAR(255),
    expected_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

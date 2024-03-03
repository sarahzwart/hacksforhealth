CREATE TABLE therapist (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    therapist_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (therapist_id) REFERENCES therapist(id) ON DELETE CASCADE
);

CREATE TABLE HA (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    happiness INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);





CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE HA (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    happiness INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);

INSERT INTO HA (patient_id, happiness, created_at) VALUES
(1, ROUND((RANDOM() * 4) + 1), '2024-02-20'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-21'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-22'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-23'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-24'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-25'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-26'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-27'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-28'),
(1, ROUND((RANDOM() * 4) + 1), '2024-02-29'),
(1, ROUND((RANDOM() * 4) + 1), '2024-03-01'),
-- Add more rows as needed
(1, ROUND((RANDOM() * 4) + 1), '2024-03-02'),
(1, ROUND((RANDOM() * 4) + 1), '2024-03-03');
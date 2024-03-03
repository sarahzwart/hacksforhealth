CREATE TABLE therapist (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE patient (
    PID INT PRIMARY KEY NOT NULL,
    TherapistID INT REFERENCES therapist(id) NOT NULL,
    Pass VARCHAR(255) NOT NULL,
    Username VARCHAR(255) NOT NULL UNIQUE,
    HAKey INT NOT NULL
);

CREATE TABLE ha (
    HA_ID INT PRIMARY KEY NOT NULL,
    PatientID INT REFERENCES patient(PID) NOT NULL,
    Vals INT,
    Date DATE
);

ALTER TABLE patient
ADD CONSTRAINT constrain1 FOREIGN KEY (HAKey) REFERENCES ha(HA_ID)

INSERT INTO therapist (id, username, password, PatientIDs) VALUES (94028, 'Steve', 'Jobs', ARRAY[382, 5]);

INSERT INTO patient (PID, TherapistID, username, Pass, HAKey) VALUES (382, 94028, 'Hello', 'Hi', 4839);

INSERT INTO ha (HA_ID, PatientID, Vals, Date) VALUES (4839, 382, ARRAY[5, 4, 3], ARRAY['1994-10-27'::date, '1994-10-28'::date, '1994-10-29'::date])
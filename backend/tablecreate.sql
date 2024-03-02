CREATE TABLE therapist (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PatientIDs INT[]
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
    Vals INT[],
    Date DATE[]
);

ALTER TABLE patient
ADD CONSTRAINT constrain1 FOREIGN KEY (HAKey) REFERENCES ha(HA_ID)

CREATE TABLE Appointments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  scheduleId INT NOT NULL,
  countryISO CHAR(2) NOT NULL,
  insuredId INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdBy VARCHAR(50),
  updatedBy VARCHAR(50)
);


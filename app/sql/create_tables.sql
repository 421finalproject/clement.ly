CREATE TABLE Users(
	uid INT PRIMARY KEY AUTO_INCREMENT,
	uname VARCHAR(200) UNIQUE,
	password TEXT
);
~
CREATE TABLE Task_types(
	ttid INT PRIMARY KEY AUTO_INCREMENT,
	uid INT,
	name TEXT,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE 
);
~
CREATE TABLE Tasks(
    tid INT PRIMARY KEY AUTO_INCREMENT,
 	uid INT,
	task_name TEXT,
	task_type INT,
	status INT CHECK(status >= 0 AND status <= 2),
	day_of_week INT CHECK(day_of_week >= 0 AND day_of_week <= 6),
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);

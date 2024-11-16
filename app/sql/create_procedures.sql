CREATE PROCEDURE CreateUser(IN uname VARCHAR(200), IN pass TEXT)
BEGIN
    INSERT INTO Users (uname, password) VALUES (uname, pass);
END;
~
CREATE PROCEDURE AuthenticateUser(IN uname VARCHAR(200), IN pass TEXT, OUT result INT)
BEGIN
    SELECT COUNT(*) INTO result
    FROM Users
    WHERE uname = uname AND password = pass;
END;
~
CREATE PROCEDURE CreateTaskTypeByUser(IN uid INT, IN name TEXT)
BEGIN
    INSERT INTO Task_types (uid, name) VALUES (uid, name);
END;
~
CREATE PROCEDURE GetTaskTypesByUser(IN uid INT)
BEGIN
    SELECT * FROM Task_types WHERE uid = uid;
END;
~
CREATE PROCEDURE CreateTaskByUser(IN uid INT, IN task_name TEXT, IN task_type INT, IN status INT, IN start DATETIME, IN end DATETIME)
BEGIN
    INSERT INTO Tasks (uid, task_name, task_type, status, start, end)
    VALUES (uid, task_name, task_type, status, start, end);
END;
~
CREATE PROCEDURE GetTasksByUser(IN uid INT)
BEGIN
    SELECT T.task_name, Tt.name, T.status, T.start, T.end 
    FROM Tasks T
    LEFT JOIN Task_types Tt ON T.task_type = Tt.ttid
    WHERE T.uid = uid;
END;

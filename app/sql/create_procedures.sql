CREATE PROCEDURE CreateUser(IN uname VARCHAR(200), IN pass TEXT)
BEGIN

    INSERT INTO Users (uname, password) VALUES (uname, pass);
    
END;
~
CREATE PROCEDURE AuthenticateUser(IN uname VARCHAR(200), IN pass TEXT)
BEGIN
    SELECT U.uid
    FROM Users U
    WHERE U.uname = uname AND U.password = pass;
END;
~
CREATE PROCEDURE CreateTaskTypeByUser(IN uid INT, IN name TEXT)
BEGIN
    INSERT INTO Task_types (uid, name) VALUES (uid, name);
END;
~
CREATE PROCEDURE GetTaskTypesByUser(IN uid INT)
BEGIN
    SELECT * FROM Task_types Tt WHERE Tt.uid = uid;
END;
~
CREATE PROCEDURE CreateTaskByUser(IN uid INT, IN task_name TEXT, IN task_type INT, IN status INT, IN day_of_week INT)
BEGIN
    INSERT INTO Tasks (uid, task_name, task_type, status, day_of_week)
    VALUES (uid, task_name, task_type, status, day_of_week);
END;
~
CREATE PROCEDURE GetTasksByUser(IN uid INT)
BEGIN
    SELECT T.task_name, Tt.name, T.status, T.day_of_week
    FROM Tasks T
    LEFT JOIN Task_types Tt ON T.task_type = Tt.ttid
    WHERE T.uid = uid;
END;
~
CREATE PROCEDURE DeleteTask(IN tid INT)
BEGIN
    DELETE FROM Tasks T WHERE T.tid = tid;
END;
~
CREATE PROCEDURE EditTask(IN tid INT, IN task_name TEXT, IN task_type INT, IN status INT, IN day_of_week INT)
BEGIN
    SELECT * FROM Tasks T
    WHERE T.tid = tid;
    IF task_name <> '' THEN
        UPDATE Tasks T2
        SET T2.task_name = task_name
        WHERE T2.tid = tid;
    END IF;
    IF task_type <> -1 THEN
      IF EXISTS(SELECT * FROM Task_types WHERE ttid = task_type) THEN
            UPDATE Tasks T2
            SET T2.task_type = task_type
            WHERE T2.tid = tid;
        END IF;
    END IF;
    IF status <> -1 THEN
        UPDATE Tasks T2
        SET T2.status = status
        WHERE T2.tid = tid;
    END IF;
    IF day_of_week >= 0 && day_of_week <= 6 THEN
        UPDATE Tasks T2
        SET T2.day_of_week = day_of_week
        WHERE T2.tid = tid;
    END IF;

END;
~
CREATE PROCEDURE DeleteTaskType(IN ttid INT)
BEGIN
    DELETE FROM Task_types Tt WHERE Tt.ttid = ttid;
END


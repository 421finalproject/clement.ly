CREATE TRIGGER on_user_create
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
  INSERT INTO Task_types (uid, name) VALUES (NEW.uid, 'Default');
END;
~
CREATE TRIGGER delete_used_task_type
AFTER DELETE ON Task_types
FOR EACH ROW
BEGIN
  DECLARE default_id INT;
    SELECT Tt.ttid INTO default_id
    FROM Task_types Tt
    WHERE Tt.uid = OLD.uid AND Tt.name = 'Default';
    UPDATE Tasks
    SET task_type = default_id
    WHERE task_type = OLD.ttid;
END;

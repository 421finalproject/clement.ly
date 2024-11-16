from fastapi import FastAPI
from mysql import connector
import os
import hashlib
import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from typing import Annotated

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

def get_db_connection():
    database = os.environ.get('MYSQL_DATABASE')
    user = os.environ.get('MYSQL_USER')
    password = os.environ.get('MYSQL_PASSWORD')

    # print(database, user, password)

    cnx = connector.connect(
        user=user,
        password=password,
        host='mysql',
        database=database
    )

    return cnx

user_table = """
CREATE TABLE Users(
	uid INT PRIMARY KEY AUTO_INCREMENT,
	uname VARCHAR(200) UNIQUE,
	password TEXT
);
"""

task_type_table = """
CREATE TABLE Task_types(
	ttid INT PRIMARY KEY AUTO_INCREMENT,
	uid INT,
	name TEXT,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE 
)
"""

task_table = """
CREATE TABLE Tasks(
    tid INT PRIMARY KEY AUTO_INCREMENT,
 	uid INT,
	task_name TEXT,
	task_type INT,
	status INT,
	start DATETIME,
	end DATETIME,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
	FOREIGN KEY (task_type) REFERENCES Task_types(ttid) ON DELETE CASCADE
)
"""

@app.get("/show_tables")
async def show_tables():
    cnx = get_db_connection()

    cursor = cnx.cursor()
    cursor.execute("SHOW TABLES;")
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}

@app.post("/create_tables")
async def create_tables():
    cnx = get_db_connection()

    cursor = cnx.cursor()
    cursor.execute(user_table)
    cursor.execute(task_type_table)
    cursor.execute(task_table)
    cnx.commit()
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}

@app.post("/delete_tables")
async def delete_tables():
    cnx = get_db_connection()

    cursor = cnx.cursor()
    cursor.execute("DROP TABLE Tasks")
    cursor.execute("DROP TABLE Task_types")
    cursor.execute("DROP TABLE Users")
    cnx.commit()
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}

create_user_sql = """
INSERT INTO Users(uname, password) VALUES (%s, %s)
"""
@app.post("/create_user")
async def create_user(username: Annotated[str, Body()], password: Annotated[str, Body()]):
    hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

    cnx = get_db_connection()
    try:
        cursor = cnx.cursor()
        cursor.execute(create_user_sql, (username, hash))
    except Exception as e:
        cnx.rollback()
        print(e.with_traceback())
    finally:
        cnx.commit()
        cnx.close()

auth_user_sql = """ 
SELECT * FROM Users U WHERE U.uname = %s AND U.password = %s
"""
@app.post("/auth_user")
async def create_user(username = Body(), password = Body()) -> bool:
    hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.execute(auth_user_sql, (username, hash))
    ret = cursor.fetchall()

    cnx.close()

    return ret


@app.get("/get_users")
async def get_users():
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM Users")
    ret = cursor.fetchall()

    cnx.commit()
    cnx.close()

    return ret


create_task_type_by_user_sql = """ 
INSERT INTO Task_types(uid, name) VALUES (%s, %s)
"""

@app.post("/create_task_type_by_user")
async def create_task_type_by_user(uid = Body(), name = Body()):
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.execute(create_task_type_by_user_sql, (uid, name))
    except Exception as e:
        cnx.rollback()
        print(e.with_traceback())
    finally:
        cnx.commit()
        cnx.close()

@app.get("/get_task_type_by_user")
async def get_task_type_by_user(uid: int):
    cnx = get_db_connection()

    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM Task_types tt WHERE tt.uid = %s", (uid,))
    ret = cursor.fetchall()

    cnx.commit()
    cnx.close()

    return ret

"""
 	uid INT,
	task_name TEXT,
	task_type INT,
	status INT,
	start DATETIME,
	end DATETIME,
	"""


create_task_by_user_sql = """ 
INSERT INTO Tasks(uid, task_name, task_type, status, start, end) VALUES (%s, %s, %s, %s, %s, %s)
"""

@app.post("/create_task_by_user")
async def create_task_by_user(uid: int, task_name: str, task_type: int, status: int, start: str, end: str):
    cnx = get_db_connection()

    start_datetime = datetime.datetime.fromisoformat(start)
    start_str = start_datetime.strftime("%Y-%m-%d %H:%M:%S")
    end_datetime = datetime.datetime.fromisoformat(end)
    end_str = end_datetime.strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor = cnx.cursor()
        cursor.execute(create_task_by_user_sql, (uid, task_name, task_type, status, start_str, end_str))
    except Exception as e:
        cnx.rollback()
        print(e.with_traceback())
    finally:
        cnx.commit()
        cnx.close()


get_tasks_by_user_sql = """ 
SELECT T.task_name, Tt.name, T.status, T.start, T.end FROM 
Tasks T 
LEFT JOIN
Task_types Tt
ON T.task_type = Tt.ttid
WHERE T.uid = %s
"""

@app.get("/get_tasks_by_user")
async def get_tasks_by_user(uid: int):
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.execute(get_tasks_by_user_sql, (uid,))
    ret = cursor.fetchall()

    cnx.commit()
    cnx.close()

    return ret
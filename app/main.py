from fastapi import FastAPI
from mysql import connector
import os
import hashlib
import datetime

app = FastAPI()


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
    with open("/code/app/sql/create_tables.sql", "r") as f:
        sqls = ("".join(f.readlines())).split("~")
        for sql in sqls:
            print(sql)
            cursor.execute(sql)

    cnx.commit()

    with open("/code/app/sql/create_procedures.sql", "r") as f:
        sqls = ("".join(f.readlines())).split("~")
        for sql in sqls:
            print(sql)
            cursor.execute(sql)

    cnx.commit()
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}

@app.post("/delete_tables")
async def delete_tables():
    cnx = get_db_connection()

    cursor = cnx.cursor()
    cursor.execute("DROP TABLE IF EXISTS Tasks")
    cursor.execute("DROP TABLE IF EXISTS Task_types")
    cursor.execute("DROP TABLE IF EXISTS Users")
    cnx.commit()
    cursor.execute("DROP PROCEDURE IF EXISTS CreateUser")
    cursor.execute("DROP PROCEDURE IF EXISTS AuthenticateUser")
    cursor.execute("DROP PROCEDURE IF EXISTS CreateTaskTypeByUser")
    cursor.execute("DROP PROCEDURE IF EXISTS GetTaskTypesByUser")
    cursor.execute("DROP PROCEDURE IF EXISTS CreateTaskByUser")
    cursor.execute("DROP PROCEDURE IF EXISTS GetTasksByUser")
    cnx.commit()
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}


@app.post("/create_user")
async def create_user(username: str, password: str):
    hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.callproc('CreateUser', (username, hash))
        cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    finally:
        cnx.close()


@app.post("/auth_user")
async def create_user(username: str, password: str) -> bool:
    hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        result = 0
        cursor.callproc('AuthenticateUser', (username, hash, result))
        cursor.execute('SELECT @result;')
        result = cursor.fetchone()
        return result[0] > 0
    except Exception as e:
        print(e)
        return False
    finally:
        cnx.close()


@app.get("/get_users")
async def get_users():
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM Users")
    ret = cursor.fetchall()

    cnx.commit()
    cnx.close()

    return ret


@app.post("/create_task_type_by_user")
async def create_task_type_by_user(uid: int, name: str):
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.callproc('CreateTaskTypeByUser', (uid, name))
        cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    finally:
        cnx.close()


@app.get("/get_task_type_by_user")
async def get_task_type_by_user(uid: int):
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.callproc('GetTaskTypesByUser', (uid))
        result = cursor.fetchall()
        return result
    finally:
        cnx.close()

"""
 	uid INT,
	task_name TEXT,
	task_type INT,
	status INT,
	start DATETIME,
	end DATETIME,
	"""


@app.post("/create_task_by_user")
async def create_task_by_user(uid: int, task_name: str, task_type: int, status: int, start: str, end: str):
    start_datetime = datetime.datetime.fromisoformat(start)
    end_datetime = datetime.datetime.fromisoformat(end)

    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.callproc(
            'CreateTaskByUser',
            (uid, task_name, task_type, status, start_datetime, end_datetime)
        )
        cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    finally:
        cnx.close()


@app.get("/get_tasks_by_user")
async def get_tasks_by_user(uid: int):
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        cursor.callproc('GetTasksByUser', (uid,))
        result = cursor.fetchall()
        return result
    finally:
        cnx.close()
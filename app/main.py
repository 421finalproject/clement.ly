from fastapi import FastAPI
from mysql import connector
import os
import hashlib
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Union

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

    with open("/code/app/sql/create_triggers.sql", "r") as f:
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
    cursor.execute("DROP PROCEDURE IF EXISTS DeleteTask")
    cursor.execute("DROP PROCEDURE IF EXISTS EditTask")
    cursor.execute("DROP PROCEDURE IF EXISTS DeleteTaskType")
    cnx.commit()
    cursor.execute("DROP TRIGGER IF EXISTS on_user_create")
    cursor.execute("DROP TRIGGER IF EXISTS delete_used_task_type")
    cnx.commit()
    ret = cursor.fetchall()

    cnx.close()
    return {"message": f"{ret}"}


@app.post("/create_user")
async def create_user(username: str = Body(), password: str = Body()):
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
async def auth_user(username: str, password: str) -> bool:
    hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    cnx = get_db_connection()

    try:
        cursor = cnx.cursor()
        result = 0
        cursor.execute('CALL AuthenticateUser(%s, %s)', (username, hash))
        result = cursor.fetchall()
        print(result)
        #result = cursor.fetchall()

        if result:
          user_data = {}
          user_data["uid"] = result[0]
          return JSONResponse(content=user_data)
        else:
          return JSONResponse(content=False)

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
async def create_task_type_by_user(uid: int = Body(), name: str = Body()):
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

    cursor = cnx.cursor()
    cursor.execute('CALL GetTaskTypesByUser(%s)', (uid,))
    result = cursor.fetchall()
    cnx.close()
    return result


@app.post("/create_task_by_user")
async def create_task_by_user(uid: int = Body(), task_name: str = Body(), task_type: int = Body(), status: int = Body(), day_of_week: int = Body()):
    cnx = get_db_connection()
    try:
        cursor = cnx.cursor()
        cursor.callproc(
            'CreateTaskByUser',
            (uid, task_name, task_type, status, day_of_week)
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

    cursor = cnx.cursor()
    cursor.execute('CALL GetTasksByUser(%s)', (uid,))
    result = cursor.fetchall()
    print(result)
    cnx.close()

    return result

@app.post("/delete_task")
async def delete_task(tid: int):
    cnx = get_db_connection()
    try:
      cursor = cnx.cursor()
      cursor.execute('CALL DeleteTask(%s)', (tid,))
      cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    cnx.close()


@app.post("/edit_task")
async def edit_task(tid: int,
                    task_name: str,
                    task_type: Union[int, str], #URL request will have empty string if no value
                    status: Union[int, str],
                    day_of_week: Union[int, str]):
    cnx = get_db_connection()
    # set defaults (mysql connector has issue with typical default parameter
    #   Python syntax)
    if not task_name:
        task_name = ''
    if not task_type:
        task_type = -1
    if not status:
        status = -1
    if not day_of_week:
        day_of_week = -1
    try:
      cursor = cnx.cursor()
      cursor.callproc('EditTask', (tid, task_name, task_type, status, day_of_week))
      cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    cnx.close()

@app.post("/delete_task_type")
async def delete_task_type(ttid: int):
    cnx = get_db_connection()
    try:
      cursor = cnx.cursor()
      cursor.callproc('DeleteTaskType', (ttid,))
      cnx.commit()
    except Exception as e:
        cnx.rollback()
        print(e)
    cnx.close()

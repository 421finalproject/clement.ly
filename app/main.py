from fastapi import FastAPI
from mysql import connector
import os

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

user_table = """
CREATE TABLE Users(
	uid INT PRIMARY KEY,
	uname TEXT UNIQUE,
	password TEXT
);
"""

task_type_table = """
CREATE TABLE Task_types(
	ttid INT PRIMARY KEY,
	uid INT,
	Name TEXT,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE 
)
"""

task_table = """
CREATE TABLE Tasks(
    tid INT PRIMARY KEY,
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

@app.get("/create_tables")
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


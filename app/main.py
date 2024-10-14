from fastapi import FastAPI
from pydantic import BaseModel


class Task(BaseModel):
    tid: int
    tname: str
    ttype: int 
    status: int
    start_time: int
    end_time: int
    

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


# create task, user
@app.post("/task/")
async def create_task(task: Task):
    return task


# read data for task, user
# @app.get("/")


# update task, user
# @app.put("/")


# delete task, user
# @app.delete("/")


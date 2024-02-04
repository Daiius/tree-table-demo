import pymysql
import json


import os

DATABASE_HOST_NAME = os.environ.get("DATABASE_HOST_NAME", None)
if DATABASE_HOST_NAME is None:
  raise Exception("DATABASE_HOST_NAME environment variable is not defined.")

def connect() -> pymysql.connections.Connection:

    return pymysql.connect(
        host = DATABASE_HOST_NAME,
        user = "root",
        password = "tree-table-demo-database-mysql-root-password",
        database = "tree_table_demo",
        cursorclass = pymysql.cursors.DictCursor,
        read_timeout = 5,
        write_timeout = 5
    )
    

def make_json(data) -> bytes:
    return json.dumps(data).encode('utf-8')

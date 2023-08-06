from typing import List, Dict, Tuple
import json

from flask import Flask

import pymysql


app = Flask(__name__)



def connect():
    tmp = pymysql.connect(
        host = "tree-table-demo-database",
        user = "root",
        password = "tree-table-demo-mysql-root-password",
        database ="tree_table_demo",
        cursorcalss = pymysql.cursors.DictCursor
    )
    reveal_type(tmp)

    return tmp

def make_json(data):
    return json.dumps(data).encode('utf-8')

@app.route("/processes", methods=["GET"])
def get_process_list():
    connection = connect()
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200


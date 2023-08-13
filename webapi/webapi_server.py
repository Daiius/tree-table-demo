from typing import List, Dict, Tuple
import json

from flask import Flask

import pymysql


def create_app():
    return Flask(__name__)

app = create_app()



def connect():
    return pymysql.connect(
        host = "tree-table-demo-database",
        user = "root",
        password = "tree-table-demo-mysql-root-password",
        database = "tree_table_demo",
        cursorclass = pymysql.cursors.DictCursor
    )
    

def make_json(data):
    return json.dumps(data).encode('utf-8')

@app.route("/processes", methods=["GET"])
def get_process_list():
    connection = connect()
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

if __name__ == '__main__':
    app.run()


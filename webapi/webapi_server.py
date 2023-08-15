from typing import reveal_type
import json

from flask import Flask

import pymysql

app = Flask(__name__)
reveal_type(app)

def connect(app: Flask) -> pymysql.connections.Connection:
    print("app.testing: ", app.testing)
    if app.testing:
        host = "tree-table-demo-webapi-test-database"
    else:
        host = "tree-table-demo-database"

    return pymysql.connect(
        host = host,
        user = "root",
        password = "tree-table-demo-database-mysql-root-password",
        database = "tree_table_demo",
        cursorclass = pymysql.cursors.DictCursor
    )
    

def make_json(data) -> bytes:
    return json.dumps(data).encode('utf-8')

@app.route("/processes", methods=["GET"])
def get_process_list() -> tuple[bytes, int]:
    connection = connect(app)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

if __name__ == '__main__':
    app.run()


from typing import reveal_type
import json

from flask import Flask

import pymysql

app = Flask(__name__)
reveal_type(app)

def connect(is_testing: bool) -> pymysql.connections.Connection:
    #print("app.testing: ", is_testing)
    if is_testing:
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
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

@app.route("/processes/roots", methods=["GET"])
def get_process_roots() -> tuple[bytes, int]:
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list where prev_id is NULL")
        result = cursor.fetchall()
    return make_json(result), 200

@app.route("/processes/descendants/<string:ids>", methods=["GET"])
def get_process_descendants(ids: str) -> tuple[bytes, int]:
    """
    ids: semicolon separated process ids
    """
    connection = connect(app.testing)
    ids_list = ids.split(";")
    with connection.cursor() as cursor:
        parameters_sql = ", ".join(["%s"] * len(ids_list))
        cursor.execute(f"""
            with recursive r as (
                select
                    process_id, process_type, prev_id
                from
                    process_list
                where
                    process_id in ({parameters_sql})
                union select
                    p.process_id, p.process_type, p.prev_id
                from
                    process_list as p, r
                where
                    p.prev_id = r.process_id
            )
            select
                process_id, process_type, prev_id
            from
               r 
        """,
        ids_list
        )
        result = cursor.fetchall()
    return make_json(result), 200


if __name__ == '__main__':
    app.run()


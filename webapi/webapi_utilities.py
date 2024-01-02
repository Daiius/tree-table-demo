import pymysql
import json

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
        cursorclass = pymysql.cursors.DictCursor,
        read_timeout = 5,
        write_timeout = 5
    )
    

def make_json(data) -> bytes:
    return json.dumps(data).encode('utf-8')

from typing import reveal_type
import json

from flask import (
  Flask,
  session,
  request
)

from flask_cors import CORS

import pymysql

import webapi_server_helper
from webapi_server_helper import (
  build_json,
  ProcessTreeNode
)

from flask_login import ( # type: ignore
  login_required,
  LoginManager,
  UserMixin,
  current_user,
  login_user
)

app = Flask(__name__)
cors = CORS(
  app,
  resources = {
    r"/*": {
      "origins": [
        "http://localhost",
        "http://tree-table-demo-web-server"
      ]
    }
  }
)
app.secret_key = b'this key should be really secret in the production code!!!'

login_manager = LoginManager()
login_manager.init_app(app)

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

class User(UserMixin):
    def __init__(self, user_id: str):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id: str) -> User:
    return User(user_id)
 
@app.route("/api/login", methods=["GET"])
@login_required
def get_login() -> tuple[bytes, int]:
    return make_json("you are an active user!"), 200

@app.route("/api/login", methods=['POST'])
def post_login() -> tuple[bytes, int]:
    data = json.loads(request.get_data())
    username = data["username"]
    password = data["password"]

    print(data, flush=True)

    # TODO test implementation
    if username == password:
        # login success!
        login_user(User(username))
        return make_json("login success!"), 200
    else:
        return make_json("login failed..."), 403
    
    return make_json("unexpected request type."), 500


@app.route("/api/processes", methods=["GET"])
def get_process_list() -> tuple[bytes, int]:
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

@app.route("/api/processes/roots", methods=["GET"])
def get_process_roots() -> tuple[bytes, int]:
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list where prev_id is NULL")
        result = cursor.fetchall()
    return make_json(result), 200

@app.route("/api/processes/trees/<string:ids>", methods=["GET"])
def get_process_tree(ids: str) -> tuple[bytes, int]:
    """
    ids: semicolon separated process ids
    """
    connection = connect(app.testing)
    ids_list = ids.split(";")
    result = build_json(connection, ids_list)
    return make_json(result), 200

@app.route("/api/process/<string:process_type>/<string:process_id>", methods=["PUT"])
def update_process(process_type: str, process_id: str) -> tuple[bytes, int]:
  """
    body: {
      "conditionName1": {
        "newValue1": "value",
        "oldValue1": "to detect conflict by multi user editing"
      },
      ...
    }
  """
  data = request.get_json()
  connection = connect(app.testing)
  webapi_server_helper.update_process(
    process_type = process_type,
    process_id = process_id,
    data = data,
    connection = connection
  )
  return make_json(data), 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)


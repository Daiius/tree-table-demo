from typing import reveal_type
import json

import flask
from flask import (
  Flask,
  session,
  request
)

import pymysql

import webapi_server_helper
from webapi_app import app
from webapi_utilities import (
  connect,
  make_json,
)


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

import os
WEBAPI_PORT = os.environ.get("WEBAPI_PORT", 8000)



login_manager = LoginManager()
login_manager.init_app(app)


import webapi_masters

class User(UserMixin):
    def __init__(self, user_id: str):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id: str) -> User:
    return User(user_id)
 
@app.get("/api/login")
@login_required
def get_login() -> tuple[bytes, int]:
    return make_json("you are an active user!"), 200

@app.post("/api/login")
def post_login() -> tuple[bytes, int]:
    data = json.loads(request.get_data())
    username = data["username"]
    password = data["password"]

    #print(data, flush=True)

    # TODO test implementation
    if username == password:
        # login success!
        login_user(User(username))
        return make_json("login success!"), 200
    else:
        return make_json("login failed..."), 403
    
    return make_json("unexpected request type."), 500


@app.get("/api/processes")
def get_process_list() -> tuple[bytes, int]:
    connection = connect()
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

@app.get("/api/processes/roots")
def get_process_roots() -> tuple[bytes, int]:
    connection = connect()
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list where prev_id is NULL")
        result = cursor.fetchall()
    return make_json(result), 200

@app.get("/api/processes/trees/<string:ids>")
def get_process_tree(ids: str) -> tuple[bytes, int]:
    """
    ids: semicolon separated process ids
    """
    connection = connect()
    ids_list = ids.split(";")
    result = build_json(connection, ids_list)
    return make_json(result), 200

@app.put("/api/process/<string:process_type>/<string:process_id>")
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
  connection = connect()
  webapi_server_helper.update_process(
    process_type = process_type,
    process_id = process_id,
    data = data,
    connection = connection
  )
  return make_json(data), 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=WEBAPI_PORT)


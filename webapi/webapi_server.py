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

from flask_login import ( # type: ignore
  login_required,
  LoginManager,
  UserMixin,
  current_user,
  login_user
)


login_manager = LoginManager()
login_manager.init_app(app)


import webapi_masters
import webapi_processes

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

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)



from flask import Flask
from flask_cors import CORS


app = Flask("webapi_server")
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

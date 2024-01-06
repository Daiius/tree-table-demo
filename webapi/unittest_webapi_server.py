import unittest
import json
from unittest.mock import patch, MagicMock

from webapi_server import app

class WebApiServerTest(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client  = app.test_client()
        # enable usual exception propagation,
        # not like HTTP error message by default Flask error handler.
        self.app.testing = True
        self.client.post(
          "/api/login",
          json = { "password": "test", "username": "test" }
        )

    def test_get_process_list(self) -> None:
        response = self.client.get("/api/processes")
        data = response.text
        self.assertEqual(response.status_code, 200)

    def test_get_root_processes(self) -> None:
        response = self.client.get("/api/processes/roots")
        data = response.text
        self.assertEqual(response.status_code, 200)

    def test_get_processes_trees(self) -> None: 
        response = self.client.get("/api/processes/trees/0")
        data = response.text
        self.assertEqual(response.status_code, 200)

    def test_get_login(self) -> None:
        response = self.client.get("/api/login")
        self.assertEqual(response.status_code, 200)
        data = response.text

    def test_get_master_info(self) -> None:
      response = self.client.get("/api/master-info")
      self.assertEqual(response.status_code, 200)
      data = response.text
      print(data, flush=True)
      
    def test_get_processes(self) -> None:
      response = self.client.get("/api/processes/material/0")
      self.assertEqual(response.status_code, 200)
      print(response.text, flush=True)

    def test_100_insert_process(self) -> None:
      response = self.client.put(
        "/api/process/cutting/900",
        json = {
          "conditions": {
            "tool": { "new_value": "knife", "old_value": "None" },
            "operator": { "newValue": "Charlie", "oldValue": None },
          },
          "parentId": "0"
        }
      )
      self.assertEqual(response.status_code, 200)

      response = self.client.get("/api/processes/cutting/900")
      data = json.loads(response.text)
      print(data, flush=True)
      self.assertEqual(data["900"]["conditions"]["tool"], "knife")
      self.assertEqual(data["900"]["conditions"]["operator"], "Charlie")

    def test_101_update_process(self) -> None:
      response = self.client.put(
        "/api/process/cutting/900",
        json = {
          "conditions": {
            "tool": { "new_value": "knife", "old_value": None },
          },
        }
      )

      self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()


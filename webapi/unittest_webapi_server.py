import unittest
from unittest.mock import patch, MagicMock

from webapi_server import app

class WebApiServerTest(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client  = app.test_client()
        # enable usual exception propagation,
        # not like HTTP error message by default Flask error handler.
        self.app.testing = True
        #print("self.app.testing = True")

    def test_get_process_list(self):
        response = self.client.get("/processes")
        data = response.get_json()

    def test_get_root_processes(self):
        response = self.client.get("/processes/roots")
        data = response.get_json()

    def test_get_processes_trees(self):
        response = self.client.get("/processes/trees/dummy_id0;dummy_id1;dummy_id2")
        data = response.get_json()

if __name__ == '__main__':
    unittest.main()


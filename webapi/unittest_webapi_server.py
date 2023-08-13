import unittest
from unittest.mock import patch, MagicMock

from webapi_server import app, connect

class WebApiServerTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        # enable usual exception propagation,
        # not like HTTP error message by default Flask error handler.
        self.app.testing = True

    def test_get_process_list(self):
        response = self.app.get("/processes")
        data = response.get_json()

if __name__ == '__main__':
    unittest.main()


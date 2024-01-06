
import pymysql
import typing
import flask

from webapi_app import app
from webapi_utilities import (
  connect,
  make_json,
)

@app.get("/api/master-info")
def get_master_info() -> tuple[bytes, int]:
  """
  get process and evaluation master informations,
  which contains column names of every condition/evaluation table,
  with data type, null acceptance, foreign key references (if exists)
  
  response body: {
    "conditions": {
      "material (process_type)" : {
        "variety": {
          "data_type": "varchar(20)",
          "null_ok": false,
          "selections": [
            "usual tomatoes",
            "good tomatoes",
            "great tomatoes",
            "excelent tomatoes"
          ]
        },
        "origin": {
          ...
        }
      }
    },
    "evaluations": {
      "sugar_content": {
        "data_type": "double",
        "null_ok": false,
      },
      "water_content": {
        ...
      }
    }
  }

  """
  connection = connect(app.testing)
  master_info: dict[str, typing.Any] = {}
  conditions = master_info["conditions"] = {} # assign empty dictionary and shorter name
  # build condition master information
  with connection.cursor() as cursor:
    cursor.execute("select process_type, table_name, image_color from process_master");
    condition_table_data_list = cursor.fetchall()
  # get table information for each process type...
  for condition_table_data in condition_table_data_list:
    table_name = condition_table_data["table_name"]
    condition = conditions[table_name] = {}
    with connection.cursor() as cursor:
      # TODO
      # check SQL injection possiblities...
      # concider that malformed table_name is recorded in process_master...
      cursor.execute(f"show full columns from {table_name}")
      full_columns_data_list = cursor.fetchall()
    # loop for columns
    for full_columns_data in full_columns_data_list:
      # process_id columns is not recorded here, because its obvious.
      if full_columns_data["Field"] == "process_id":
        continue
      condition[full_columns_data["Field"]] = {}
      field = condition[full_columns_data["Field"]]
      field["data_type"] = full_columns_data["Type"]
      field["null_ok"] = (full_columns_data["Null"] == "YES")
      # check if there are foreign key constraint and selections
      with connection.cursor() as cursor:
        cursor.execute(
          """
            select
              REFERENCED_TABLE_NAME,
              REFERENCED_COLUMN_NAME
            from
              information_schema.key_column_usage
            where
              table_name = %(table_name)s
              and
              column_name = %(column_name)s
          """
        , {
          "table_name": table_name,
          "column_name": full_columns_data["Field"]
        })
        key_column_usage = cursor.fetchone()
      # if there are no foreign key constraint, continue
      # otherwise, build "selections" entry for the column
      # TODO
      # this logic does not work for combined foreign keys...
      if key_column_usage is None:
        continue
      with connection.cursor() as cursor:
        cursor.execute(
          f"""
            select
              {key_column_usage['REFERENCED_COLUMN_NAME']}
            from
              {key_column_usage['REFERENCED_TABLE_NAME']}
          """
        )
        selections_list = cursor.fetchall()
      field["selections"] = [
        d[key_column_usage['REFERENCED_COLUMN_NAME']]
        for d in selections_list
      ]
  
  # build evaluation master information
  evaluations = master_info["evaluations"] = {}
  with connection.cursor() as cursor:
    cursor.execute("select table_name from evaluation_master")
    evaluation_table_name_list = cursor.fetchall()
  for evaluation_table_name in [d["table_name"] for d in evaluation_table_name_list]:
    evaluation = evaluations[evaluation_table_name] = {}
    with connection.cursor() as cursor:
      cursor.execute(f"show full columns from {evaluation_table_name}")
      full_columns_list = cursor.fetchall()
    for column_data in full_columns_list:
      evaluation["data_type"] = column_data["Type"]
      evaluation["null_ok"] = column_data["Null"]

  return make_json(master_info), 200

      


import pymysql
import flask
import itertools
import dataclasses
import pydantic
import pydantic.alias_generators
import typing
import uuid
import datetime

from webapi_utilities import (
  connect,
  make_json
)

from webapi_app import app

@app.get("/api/processes")
def get_process_list() -> tuple[bytes, int]:
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list")
        result = cursor.fetchall()
    return make_json(result), 200

@app.get("/api/processes/roots")
def get_process_roots() -> tuple[bytes, int]:
    connection = connect(app.testing)
    with connection.cursor() as cursor:
        cursor.execute("select * from process_list where prev_id is NULL")
        result = cursor.fetchall()
    return make_json(result), 200

@app.get("/api/processes/trees/<string:ids>")
def get_process_tree(ids: str) -> tuple[bytes, int]:
    """
    ids: semicolon separated process ids
    """
    connection = connect(app.testing)
    ids_list = ids.split(";")
    result = build_json(connection, ids_list)
    return make_json(result), 200



class GetProcessResultEntries(pydantic.BaseModel):
  conditions: dict[str, str|datetime.datetime]
  evaluations: dict[str, str]

class GetProcessesResultContainer(pydantic.BaseModel):
  entries: dict[str, GetProcessResultEntries]

@app.get("/api/processes/<string:process_type>/<string:process_ids>")
def get_processes(
  process_type: str,
  process_ids: str
) -> tuple[bytes, int]:
  """
  response body: {
    "process_id_0": {
      "process_type": "process_type_0",
      "conditions": {
        "condition_0": "condition_value_0",
        ...
      },
      "evaluations": {
        "evaluation_type_0": "evaluation_value_0",
        ...
      }
    },
    "process_id_1": ...
  }
  """
  result_container = GetProcessesResultContainer(entries={})
  process_id_list = process_ids.split(";")
  with connect(app.testing) as connection:
    # get process condition table name 
    with connection.cursor() as cursor:
      cursor.execute(
        "SELECT table_name FROM process_master WHERE process_type = %s",
        process_type
      )
      condition_table_name = cursor.fetchone().get("table_name")
    # get process conditions from the table
    with connection.cursor() as cursor:
      cursor.execute(
        f"""
          SELECT
            *
          FROM
            {condition_table_name}
          WHERE
            process_id in ({','.join(['%s']*len(process_id_list))})
        """,
        process_id_list
      )
      conditions_data_list = cursor.fetchall()
    for conditions_data in conditions_data_list:
      result_container.entries[conditions_data.get("process_id")] = GetProcessResultEntries(
        conditions = {
          k: v
          for k, v in conditions_data.items()
        },
        evaluations={}
      )
    # get evaluations related to specified ids
    with connection.cursor() as cursor:
      cursor.execute(
        f"""
          SELECT
            process_id,
            evaluation_type
          FROM
            evaluation_list
          WHERE
            process_id in ({','.join(['%s']*len(process_id_list))})
        """,
        process_id_list
      )
      evaluation_list_data_list = cursor.fetchall()
    if len(evaluation_list_data_list) > 0:
      evaluation_list_data_list.sort(key=lambda d: d["evaluation_type"])
      for key, group in itertools.groupby(
        evaluation_list_data_list,
        key=lambda d: d["evaluation_type"]
      ):
        # group is iterator, so consumed once accessed...
        # if it is possible to use it more than once, 
        # turning it to a list is usefull
        group_list = list(group) 
        # get evaluation table name
        with connection.cursor() as cursor:
          cursor.execute(
            "SELECT table_name FROM evaluation_master WHERE evaluation_type = %s",
            key
          )
          evaluation_table_name = cursor.fetchone()["table_name"]
        # get evaluation data grouped by evaluation type (table_name)
        related_process_id_list = [ d["process_id"] for d in group_list ]
        with connection.cursor() as cursor:
          cursor.execute(
            f"""
              SELECT
                *
              FROM
                {evaluation_table_name}
              WHERE
                process_id in (','.join(['%s'].join(related_process_id_list)))
            """,
            related_process_id_list
          )
          evaluation_data_list = cursor.fetchall()
        # write evaluation data into dictionary
        for evaluation_data in evaluation_data_list:
          # evaluation column name is same as the table name,
          # but it is only one, so getting first value as evaluation value works.
          result_container.entries[
            evaluation_data.get("process_id")
          ].evaluations[key] = next(evaluation_data.values())
        
  return make_json(result_container.entries), 200



class NewAndOldValuePair(pydantic.BaseModel):
  model_config = pydantic.ConfigDict(
    alias_generator=pydantic.alias_generators.to_snake,
    populate_by_name=True,
  )
  new_value: str = pydantic.Field(alias="newValue")
  old_value: str | None = pydantic.Field(alias="oldValue")

class InsertOrUpdateProcessData(pydantic.BaseModel):
  model_config = pydantic.ConfigDict(
    alias_generator=pydantic.alias_generators.to_snake,
    populate_by_name=True,
  )
  conditions: dict[str, NewAndOldValuePair]
  parent_id: str | None = pydantic.Field(alias="parentId")

@app.put("/api/process/<string:process_type>/<string:process_id>")
def insert_or_update_process(
  process_type: str,
  process_id: str
) -> tuple[bytes, int]:
  """
    body: {
      "conditions": {
        "conditionName1": {
          "newValue": "value",
          "oldValue": "to detect conflict by multi user editing"
        },
        ...,
      "parent_id": "parent process id for insertion"
    }
  """
  with connect(app.testing) as connection:
    # process_id format check
    #  -> commented out scince process_id is not only uuids.
    # process_id = str(uuid.UUID(process_id))
    data = InsertOrUpdateProcessData.model_validate(
      flask.request.get_json()
    )
    # check if specified process_id exists or not
    with connection.cursor() as cursor:
      cursor.execute(
        "SELECT process_id FROM process_list WHERE process_id = %s",
        process_id
      )
      process_list_data = cursor.fetchone()
    # get target table name
    with connection.cursor() as cursor:
      cursor.execute(
        "SELECT table_name FROM process_master WHERE process_type = %s",
        process_type
      )
      table_name = cursor.fetchone()["table_name"]
    # insert process_list data if there's no process_list entry
    # and insert process conditions
    connection.begin()
    with connection.cursor() as cursor:
      if process_list_data is None:
        cursor.execute(
          "INSERT process_list (process_id, process_type, prev_id) VALUE (%s, %s, %s)",
          [ process_id, process_type, data.parent_id ]
        )

      # update target table
      data.conditions["process_id"] = NewAndOldValuePair(
        new_value = process_id, old_value = None
      )
      sql_list_update_new = [f"{k} = %({k}_new)s" for k in data.conditions.keys()]
      sql_list_update_old = [f"{k} = %({k}_old)s" for k in data.conditions.keys()]
      sql_list_insert = f"({','.join([f'%({k}_new)s' for k in data.conditions.keys()])})"
      #print(sql_list, flush=True)
      sql_base = f"""
          INSERT
            {table_name}
            ({', '.join(data.conditions.keys())})
          VALUES
            {sql_list_insert}
          ON DUPLICATE KEY UPDATE
            {', '.join(sql_list_update_new)}
      """
      #    WHERE
      #      process_id = %(process_id)s
      #      AND
      #      {' AND '.join(sql_list_update_old)}
      print(sql_base, flush=True)
      sql = cursor.mogrify(
        sql_base,
        { "process_id": process_id } | {
          k + "_new" : v.new_value
          for k, v in data.conditions.items()
        } | {
          k + "_old" : v.old_value
          for k, v in data.conditions.items()
        }
      )
      print(sql, flush=True)
      cursor.execute(sql)
    connection.commit()
  return make_json(data), 200

@dataclasses.dataclass
class ProcessTreeNode:
    process_id: str
    process_type: str
    #parent: typing.Optional["ProcessTreeNode"]
    conditions: dict[str, str]
    evaluations: dict[str, dict[str, str]]
    children: list["ProcessTreeNode"]

def to_dict(obj: object, classkey=None):
    """
    convert object to dict
    reference:
    https://stackoverflow.com/questions/1036409/recursively-convert-python-object-graph-to-dictionary
    """
    #print("obj: ", obj)
    if isinstance(obj, dict):
        data = {}
        for (k,v) in obj.items():
            data[k] = to_dict(v, classkey)
        return data
    elif hasattr(obj, "_ast"):
        return to_dict(obj._ast())
    elif hasattr(obj, "__iter__") and not isinstance(obj, str):
        return [to_dict(v, classkey) for v in obj]
    elif hasattr(obj, "__dict__"):
        #print("obj, __dict__: ", obj, flush=True)
        data = dict([
            (key, to_dict(value, classkey))
            for key, value in obj.__dict__.items()
            if not callable(value) and not key.startswith('_')
        ])
        if classkey is not None and hasattr(obj, "__class__"):
            data[classkey] = obj.__class__.__name__
        return data
    else:
        return str(obj)


def _get_descendant_process_list(
    connection: pymysql.connections.Connection,
    ids_list: list[str]
) -> list[dict[str, typing.Any]]:
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
        return cursor.fetchall()

def _get_process_condition_by_table(
    connection: pymysql.connections.Connection,
    table_name: str,
    ids_list: list[str]
) -> list[dict[str, typing.Any]]:
    with connection.cursor() as cursor:
        parameters_sql = ", ".join(["%s"] * len(ids_list))
        cursor.execute(f"""
            select
                *
            from
                {table_name}
            where
                process_id in ({parameters_sql})
        """,
        ids_list
        )
        return cursor.fetchall()

def _get_evaluation_list(
    connection: pymysql.connections.Connection,
    ids_list: list[str]
) -> list[dict[str, typing.Any]]:
    with connection.cursor() as cursor:
        parameters_sql = ", ".join(["%s"] * len(ids_list))
        cursor.execute(f"""
            select
                process_id, evaluation_type
            from
                evaluation_list
            where
                process_id in ({parameters_sql})

        """,
        ids_list
        )
        return cursor.fetchall()

def _get_evaluation_by_table(
    connection: pymysql.connections.Connection,
    table_name: str,
    ids_list: list[str]
) -> list[dict[str, typing.Any]]:
    with connection.cursor() as cursor:
        parameters_sql = ", ".join(["%s"] * len(ids_list))
        cursor.execute(f"""
            select
                *
            from
                {table_name}
            where
                process_id in ({parameters_sql})
        """,
        ids_list
        )
        return cursor.fetchall()

def _process_entry_to_node(
    parent: typing.Optional[ProcessTreeNode],
    process_list_entry: dict[str, typing.Any],
    condition_entry: dict[str, typing.Any],
    evaluation_entry: dict[str, dict[str, typing.Any]]
) -> ProcessTreeNode:
    """
    convert process_list and condition entry to ProcessTreeNode.
    parent, children, evaluations entries are not initialized by this function
    """
    return ProcessTreeNode(
        process_id = process_list_entry["process_id"],
        process_type = process_list_entry["process_type"],
        #parent = parent,
        children = [],
        conditions = condition_entry,
        evaluations = evaluation_entry
    )

def _build_process_tree(
    parent: typing.Optional[ProcessTreeNode],
    list_entry: dict[str, typing.Any],
    related_process_list: list[dict[str, typing.Any]],
    condition_dict: dict[str, dict[str, typing.Any]],
    evaluation_dict: dict[str, dict[str, dict[str, typing.Any]]]
) -> ProcessTreeNode:
    
    if list_entry["process_id"] in evaluation_dict:
        evaluation_entry = evaluation_dict[list_entry["process_id"]]
    else:
        evaluation_entry = {}

    evaluation_entry
    node = _process_entry_to_node(
        parent = parent,
        process_list_entry = list_entry,
        condition_entry = condition_dict[list_entry["process_id"]],
        evaluation_entry = evaluation_entry
    )
    child_list_entries = [p for p in related_process_list if p["prev_id"] == node.process_id]
    for child_list_entry in child_list_entries:
        child = _build_process_tree(
            parent = node,
            list_entry = child_list_entry,
            related_process_list = related_process_list,
            condition_dict = condition_dict,
            evaluation_dict = evaluation_dict
        )
        node.children.append(child)

    return node

def _build_process_trees(
    related_process_list: list[dict[str, typing.Any]],
    condition_dict: dict[str, dict[str, typing.Any]],
    evaluation_dict: dict[str, dict[str, dict[str, typing.Any]]]
) -> list[ProcessTreeNode]:
    # 1.   build process tree from conditions
    # 1-1. select root nodes
    root_entries: list[dict[str, typing.Any]] = [
        p for p in related_process_list if p["prev_id"] is None
    ]
    # 1-2. construct nodes for each root node
    root_nodes: list[ProcessTreeNode] = []
    for root_entry in root_entries:
        root_nodes.append(
            _build_process_tree(
                parent = None,
                list_entry = root_entry,
                related_process_list = related_process_list,
                condition_dict = condition_dict,
                evaluation_dict = evaluation_dict
            )
        )
    return root_nodes


def build_json(
    connection: pymysql.connections.Connection,
    ids_list: list[str]
) -> list[ProcessTreeNode]:
    # First, get related process_list data 
    related_process_list = _get_descendant_process_list(connection, ids_list)
    # Second, get conditions from related tables
    # to use groupby(), list should be sorted.
    related_process_list.sort(key=lambda p: p["process_type"])
    # store condition data by dictionary using process_id as keys
    condition_dict: dict[str, dict[str, typing.Any]] = {}
    for key, group in itertools.groupby(related_process_list, key=lambda p: p["process_type"]):
        group_ids_list = [p["process_id"] for p in group]
        group_type = key
        conditions = _get_process_condition_by_table(
            connection = connection,
            table_name = group_type,
            ids_list = group_ids_list
        )
        # TODO: construct data object from dict here?
        for condition in conditions:
            condition_dict[condition["process_id"]] = condition
    # Third, get evaluations from related tables
    # to use groupby(), list should be sorted.
    related_evaluations = _get_evaluation_list(
        connection,
        [p["process_id"] for p in related_process_list]
    )
    print("related_evaluations", related_evaluations, flush=True)
    related_evaluations.sort(key=lambda e: e["evaluation_type"])
    # store evaluation data by dictionary using process_id as keys
    # e.g.: evaluation_dict[process_id][evaluation_type][evaluation_column] = value
    evaluation_dict: dict[str, dict[str, dict[str, typing.Any]]] = {}
    for key, group in itertools.groupby(related_evaluations, key=lambda e: e["evaluation_type"]):
        group_ids_list = [e["process_id"] for e in group]
        group_type = key
        evaluations = _get_evaluation_by_table(
            connection = connection,
            table_name = group_type,
            ids_list = group_ids_list
        )
        # TODO: construct data object from dict here?
        for evaluation in evaluations:
            if evaluation["process_id"] not in evaluation_dict:
                evaluation_dict[evaluation["process_id"]] = {}
            evaluation_dict[evaluation["process_id"]][key] = evaluation

    root_nodes = _build_process_trees(
        related_process_list = related_process_list,
        condition_dict = condition_dict,
        evaluation_dict = evaluation_dict
    )
        
    result = to_dict(root_nodes)
    print("result: ", result, flush=True)
    
    return result


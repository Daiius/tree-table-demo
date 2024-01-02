
import pymysql
import itertools
import dataclasses
import typing


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

def update_process(
  process_type: str,
  process_id: str,
  data: dict[str, dict[str, str]],
  connection: pymysql.connections.Connection
):
  # get target table name
  with connection.cursor() as cursor:
    cursor.execute(
      "select table_name from process_master where process_type = %s",
      process_type
    )
    table_name = cursor.fetchone()["table_name"]
  # update target table
  sql_list = [f"{k} = %s" for k in data.keys()]
  with connection.cursor() as cursor:
    cursor.execute(
      f"update {table_name} set {', '.join(sql_list)} where process_id = %s and {' and '.join(sql_list)}",
      [d["newValue"] for d in data.values()] \
      + [process_id] \
      + [d["oldValue"] for d in data.values()]
    )
  connection.commit()


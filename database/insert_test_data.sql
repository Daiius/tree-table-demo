-- insert test data

insert
  process_list
  (process_id, process_type, prev_id)
values
  ('0', 'material', null),
  ('1', 'cutting', '0'),
  ('2', 'drying', '1'),
  ('3', 'drying', '1'),
  ('4', 'drying', '1')
;

insert
  material
  (process_id, variety, origin, imported_date)
values
  ('0', 'good tomatoes', "A's farm", '2023/08/17')
;

insert
  cutting
  (process_id, tool, operator)
values
  ('1', 'knife', 'Alice')
;

insert
  drying
  (process_id, temperature, time_seconds, operator)
values
  ('2', 120, 300, 'Alice'),
  ('3', 140, 300, 'Alice'),
  ('4', 160, 300, 'Alice')
;

insert
  evaluation_list
  (process_id, evaluation_type)
values
  ('2', 'sugar_content'),
  ('2', 'water_content'),
  ('2', 'umami_content')
;

insert
  sugar_content
  (process_id, sugar_content)
values
  ('2', 0.12)
;

insert
  water_content
  (process_id, water_content)
values
  ('2', 0.34)
;

insert
  umami_content
  (process_id, umami_content)
values
  ('2', 0.56)
;


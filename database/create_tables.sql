create table process_master (
  process_type varchar(20) not null,
  table_name varchar(20) not null,
  image_color varchar(20) default 'white',
  -- we need index for foreign key reference
  unique index (process_type)
);

insert
  process_master
  (process_type, table_name, image_color)
values
  ("material", "material", "mistyrose"), 
  ("cutting", "cutting", "whitesmoke"), 
  ("drying", "drying", "bisque")
;

create table process_list (
  process_id varchar(36) not null,
  process_type varchar(20) not null,
  prev_id varchar(36) default null,
  primary key (process_id),
  -- process_type column is automatically updated
  -- when process_master is updated.
  -- however when existing process_type is tried to delete, it will be an error.
  foreign key (process_type) references process_master (process_type)
  on update cascade on delete restrict,
  -- prev_id should point to existing process_id, otherwise NULL.
  -- if an entry of process_list is deleted,
  -- descendant entries are also deleted with cascade.
  foreign key (prev_id) references process_list (process_id)
  on update cascade on delete cascade
);

create table variety_master (
  variety varchar(20) not null,
  unique key (variety)
);

insert
  variety_master
values
 ("usual tomatoes"),   
 ("good tomatoes"),    
 ("great tomatoes"),   
 ("excelent tomatoes")
;

create table origin_master (
  origin varchar(20) not null,
  unique key (origin)
);

insert
  origin_master
values
   ("A's farm"),
   ("B's farm")
;

create table material (
  process_id varchar(36) not null,
  variety varchar(20) not null,
  origin varchar(20) not null,
  imported_date date not null,
  foreign key (process_id) references process_list (process_id)
  on update cascade on delete cascade,
  foreign key (variety) references variety_master (variety)
  on update cascade on delete restrict,
  foreign key (origin) references origin_master (origin)
  on update cascade on delete restrict
);

create table operator_master (
  operator varchar(20) not null,
  unique index (operator)
);

insert
  operator_master
values
  ("Alice"), 
  ("Bob"), 
  ("Charlie")
;

create table cutting_tool_master (
  tool varchar(20) not null,
  unique index (tool)
);

insert
  cutting_tool_master
values
  ("knife"),
  ("cutting machine")
;

create table cutting (
  process_id varchar(36) not null,
  tool varchar(20) not null,
  operator varchar(20) not null,
  foreign key (process_id) references process_list (process_id)
  on update cascade on delete cascade,
  foreign key (tool) references cutting_tool_master (tool)
  on update cascade on delete restrict,
  foreign key (operator) references operator_master (operator)
  on update cascade on delete restrict
);

create table drying (
  process_id varchar(36) not null,
  temperature int unsigned not null,
  time_seconds int unsigned not null,
  operator varchar(20) not null,
  foreign key (process_id) references process_list (process_id)
  on update cascade on delete cascade,
  foreign key (operator) references operator_master (operator)
  on update cascade on delete restrict
);

create table evaluation_master (
  evaluation_type varchar(20) not null,
  table_name varchar(20) not null,
  index (evaluation_type)
);

insert
  evaluation_master
values
  ("sugar_content", "sugar_content"),
  ("water_content", "water_content"),
  ("umami_content", "umami_content")
;

create table evaluation_list (
  process_id varchar(36) not null,
  evaluation_type varchar(20) not null,
  foreign key (process_id) references process_list (process_id)
  on update cascade on delete cascade,
  foreign key (evaluation_type) references evaluation_master (evaluation_type)
  on update cascade on delete restrict,
  primary key (process_id, evaluation_type)
);

create table sugar_content (
  process_id varchar(36) not null,
  evaluation_type varchar(20) not null default "sugar_content",
  sugar_content double not null,
  foreign key (process_id, evaluation_type) references evaluation_list (process_id, evaluation_type)
  on update cascade on delete cascade
);

create table water_content (
  process_id varchar(36) not null,
  evaluation_type varchar(20) not null default "water_content",
  water_content double not null,
  foreign key (process_id, evaluation_type) references evaluation_list (process_id, evaluation_type)
  on update cascade on delete cascade
);

create table umami_content (
  process_id varchar(36) not null,
  evaluation_type varchar(20) not null default "umami_content",
  umami_content double not null,
  foreign key (process_id, evaluation_type) references evaluation_list (process_id, evaluation_type)
  on update cascade on delete cascade
);


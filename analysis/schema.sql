-- Schema for to-do application examples.

-- Projects are high-level activities made up of tasks
CREATE TABLE posts (
	Question	TEXT,
	Answers	TEXT,
	Title	TEXT,
	Tags	TEXT,
	CreationDate	DATETIME,
	Id	INTEGER PRIMARY KEY

);


CREATE TABLE doc_top_topic (
	strength	FLOAT,
	topic_id	INTEGER ,
	doc_id	INTEGER ,
	PRIMARY KEY(doc_id,topic_id)

);
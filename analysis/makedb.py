from __future__ import print_function
import argparse
import sqlite3
import os
import sys
import datetime
import helper
import dateutil.parser
import re



parser = argparse.ArgumentParser(description='Transform the dump file to a sqlite db.')
parser.add_argument('dump_path',
                    help='path of the posts.xml')
parser.add_argument('db_name',
                    help='name of the sqlite datbase')

parser.add_argument('--schema', default='analysis/schema.sql',
                    help='schema of the table')


def _parse_xml_element(item, document):
    """
    Take an xml element and update the keys in the document dictionary
    :param item:
    :param document:
    :return:
    """
    doc_id = int(document['Id'])
    item['Title'] = document['Title']
    item['Question'] = document['Body']
    item['Answers'] = ""

    # extract tags
    tags = document['Tags']
    tags = [_tag[1] for _tag in re.findall("(<(.*?)>)", tags)]
    tags = ";".join(tags)

    item['Tags'] = tags

    creation_date = dateutil.parser.parse(document['CreationDate'])

    item['CreationDate'] = creation_date
    item['Id'] = doc_id


def _format_row(element, columns_order):
    return tuple(element.get(k, "") for k in columns_order)


def parse_database(dump_path, dest_db_name, schema_filename):
    # delete existing database
    try:
        os.remove(dest_db_name)
    except OSError:
        pass

    # create database
    print ('Creating schema')

    with sqlite3.connect(dest_db_name) as conn:
        with open(schema_filename, 'rt') as f:
            schema = f.read()
            conn.executescript(schema)

        print ('Inserting initial data')

        items = {}

        columns = ['Question', 'Answers', 'Title', 'Tags', 'CreationDate', 'Id']
        for document in helper.get_xml_file_contents(dump_path):

            post_type_id = int(document['PostTypeId'].strip())

            if post_type_id == 1:  # element is a question
                doc_id = int(document['Id'])

                item = items.get(doc_id, {})

                _parse_xml_element(item, document)

                items[doc_id] = item
            else:  # answer to a post
                parent = document.get('ParentId')
                if parent is None:
                    parent = document.get('ParentID')

                # get existing element, or create an empty element
                item = items.get(parent, {'Answers': ""})
                # update the keys
                item['Answers'] += " " + document['Body']
                items[parent] = item


            if len(items)%100 ==0:
                print("\r--- Parsed %s elements"%(len(items)),end=" ")
                sys.stdout.flush()
        print()

        elements_with_id= ([item for item in items.values() if "Id" in item])
        incomplete_elements = len(items) - len(elements_with_id)
        print ("There are %s items that are incomplete" %(incomplete_elements))

        # get posts in format requeried for sql
        print ("Converting items to appropriate format")
        posts = [_format_row(elem, columns) for elem in elements_with_id]

        conn.executemany("INSERT INTO posts (Question,Answers,Title,Tags,CreationDate,Id) VALUES(?,?, ?, ?,?,?)", posts)
        print ("Inserted %s elements"%(len(posts)))



if __name__ == '__main__':
    args = parser.parse_args()
    print (args)

    parse_database(args.dump_path, args.db_name, args.schema)

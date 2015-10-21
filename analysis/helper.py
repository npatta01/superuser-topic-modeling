import xml.etree.ElementTree as ET
import re
import logging
import sqlite3

import pandas as pd
from bs4 import BeautifulSoup
import nltk
from nltk.stem.snowball import SnowballStemmer
from textblob import TextBlob
import json


def get_xml_file_as_df(xml_file_path, max_num_children=None):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    childrens = []

    for child in root:
        childrens.append(child.attrib)
        if max_num_children and len(childrens) > max_num_children:
            break

    return pd.DataFrame(childrens)


def get_xml_file_contents(xml_file_path, max_num_children=None):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    elements_seen = 0
    for child in root:
        if max_num_children is not None and elements_seen > max_num_children:
            break
        else:
            yield child.attrib
            elements_seen += 1
            # print ("%s/%s" %(elements_seen,max_num_children))


def strip_tags(html_text):
    """
    Get the text in html tags
    :param html_text:  text containing possible html tags
    :return:
    """
    try:
        soup = BeautifulSoup(html_text, "html.parser")
        cleaned_text = ''.join([e for e in soup.recursiveChildGenerator() if isinstance(e, unicode)])
        return cleaned_text
    except:
        logging.error("Failed to strip html tags for %s" % (html_text))
        return html_text


def tokenize_and_stem(text, stemmer=SnowballStemmer("english")):
    """
    tokenize and stem the passed text
    :param text:
    :return:
    """
    # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
    tokens = [word.strip() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = []
    # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
    for token in tokens:
        if re.search('[a-zA-Z]', token):
            filtered_tokens.append(token)

    if stemmer is not None:
        stems = [stemmer.stem(t) for t in filtered_tokens]
        return stems
    else:
        return filtered_tokens


def remove_stopwords(tokenized_text, stopwords=[]):
    """
    For every word in sentence, lower and reduce 
    """
    return [word for word in tokenized_text if word.lower() not in stopwords]


def filter_parts_of_speech(sentence, part_of_speech_to_keep=None):
    if part_of_speech_to_keep is None:
        return sentence
    else:
        sentence_blob = TextBlob(sentence)
        result = " ".join([res[0] for res in sentence_blob.tags if res[1] in part_of_speech_to_keep])

        return result


def save_dict_to_file(value_dict, path):
    with open(path, 'w') as fp:
        json.dump(value_dict, fp)


class Normalizer(object):
    def __init__(self, stem=False, stop_words=None, strip_html_tags=False,
                 filter_parts_of_speech=False, min_word_length=1
                 , lower_case=False
                 ):
        self.stem = stem

        self.strip_html_tags = strip_html_tags
        self.filter_parts_of_speech = filter_parts_of_speech
        self.min_word_length = min_word_length

        self.lower_case = lower_case

        # valid_pos= ["FW","NN","NNS","NNP","NNPS","VB","VBZ","VBP","VBD","VBN","VBG"]

        valid_pos = ["FW", "NN", "NNS", "NNP", "NNPS"]

        with open(stop_words) as temp_file:
            self.stopwords = [line.rstrip('\n') for line in temp_file]
            self.stopwords = set(self.stopwords)

        valid_pos_set = set(valid_pos)

        if self.stem:
            self.stemmer = SnowballStemmer("english")
        else:
            self.stemmer = None

        if filter_parts_of_speech:
            self.valid_pos_set = valid_pos_set
        else:
            self.valid_pos_set = None

    def process(self, document):
        if self.strip_html_tags:
            document = strip_tags(document)

        if self.valid_pos_set:
            document = filter_parts_of_speech(document)

        document = tokenize_and_stem(document, stemmer=self.stemmer)

        if self.lower_case:
            document = [word.lower() for word in document]

        document = remove_stopwords(document, self.stopwords)

        document = [word for word in document if len(word) > self.min_word_length]

        document = [word for word in document if word[0] != "'"]

        return document


class Post(object):
    def __init__(self, question=None, answers=None, title=None, tags=None, creation_date=None, id=None):
        self.question = question
        self.answers = answers
        self.title = title
        self.tags = tags
        self.creation_date = creation_date
        self.id = id

    @property
    def full_content(self):
        return self.title + " " + self.question + " " + self.answers


class SuperUserDatabase(object):
    def __init__(self, db):
        self.db = db

    def __iter__(self):
        with sqlite3.connect(self.db) as conn:
            cursor = conn.cursor()

            for row in cursor.execute("SELECT Question,Answers,Title, Tags,CreationDate,Id FROM posts"):
                p = Post(
                    question=row[0]
                    , answers=row[1]
                    , title=row[2]
                    , tags=row[3]
                    , creation_date=row[4]
                    , id=row[5]
                )
                yield p

    def get_post_with_id(self, id):
        with sqlite3.connect(self.db) as conn:
            cursor = conn.cursor()

            row = \
            list(cursor.execute("SELECT Question,Answers,Title, Tags,CreationDate,Id FROM posts WHERE Id=?", (id,)))[0]

            p = Post(
                question=row[0]
                , answers=row[1]
                , title=row[2]
                , tags=row[3]
                , creation_date=row[4]
                , id=row[5]
            )
            return p

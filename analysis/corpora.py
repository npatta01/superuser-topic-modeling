from __future__ import print_function
import sys

import gensim
import helper
from helper import SuperUserDatabase
import logging


class XmlCorpus(object):
    def __init__(self, dump_file, dictionary=None, clip_docs=None, normalizer=None, body_field=None):
        """
        Constructor
        :param dump_file:
        :param dictionary:
        :param clip_docs:
        :param normalizer:
        :return:
        """
        self.dump_file = dump_file

        self.clip_docs = clip_docs
        self.normalizer = normalizer
        self.documents_parsed = 0
        self.body_field = body_field

        self.dictionary = dictionary
        if dictionary is None:
            self.dictionary = gensim.corpora.Dictionary()
            self.__update_dictionary()

    def _collection_iterator(self):
        for document in helper.get_xml_file_contents(self.dump_file, self.clip_docs):
            doc_content = document[self.body_field]
            tokens = self.normalizer.process(doc_content)
            yield tokens

    def __update_dictionary(self):
        for doc_tokens in self._collection_iterator():
            self.dictionary.doc2bow(doc_tokens, allow_update=True)
            self.documents_parsed += 1

    def __iter__(self):
        print(self.clip_docs)
        for doc_tokens in self._collection_iterator():
            yield self.dictionary.doc2bow(doc_tokens)

    def __len__(self):
        return self.documents_parsed

    def finalize_dictionary(self, no_below=5, no_above=0.5):
        self.dictionary.filter_extremes(no_below, no_above)
        self.dictionary.compactify()


class SuperUserSqliteCorpus(object):
    def __init__(self, db_path, normalizer=None):
        """

        :param super_user_database_instance: str
        :return:
        """
        self.db = helper.SuperUserDatabase(db_path)
        self.documents_parsed = 0
        self.normalizer = normalizer

        self.dictionary = gensim.corpora.Dictionary()

        self.__update_dictionary()
        logging.debug("Created Dictionary")

    def _collection_iterator(self):
        docs_seen = 0
        for post in self.db:
            doc_content = post.full_content
            tokens = self.normalizer.process(doc_content)
            docs_seen += 1
            if docs_seen % 1000 == 0:
                print("\r--- Completed {:,} docs".format(docs_seen), end=' ')
                sys.stdout.flush()

            yield tokens
        print()

    def __update_dictionary(self):
        for doc_tokens in self._collection_iterator():
            self.dictionary.doc2bow(doc_tokens, allow_update=True)
            self.documents_parsed += 1

    def __iter__(self):
        for doc_tokens in self._collection_iterator():
            yield self.dictionary.doc2bow(doc_tokens)

    def __len__(self):
        return self.documents_parsed

    def finalize_dictionary(self, no_below=5, no_above=0.5):
        self.dictionary.filter_extremes(no_below, no_above)
        self.dictionary.compactify()

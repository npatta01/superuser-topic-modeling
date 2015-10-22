__author__ = 'Nidhin'

import json
import os
import copy
import random

from analysis.model_exporter import ModelExporter


class BaseDriver:
    def __init__(self, lda_model=None):
        self.lda_model = lda_model
        self.me = ModelExporter(lda_model)

    def get_all_topics(self, words_in_topic=5):
        return self.me.topics(words_in_topic)

        """
        t1=Topic(id=1,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])
        t2=Topic(id=2,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])

        return [t1,t2]
                """

    def get_topic_details(self, topic_id, num_words=10):
        return self.me.topic(topic_id=topic_id, num_words=num_words)


class CachedDriver:
    def __init__(self
                 , topics_count_path
                 ,doc_strength_path
                 ,labels_path
                 ,sample_posts_path
                 ):
        with open(topics_count_path) as data_file:
            self.topics = json.load(data_file)

        with open(doc_strength_path) as data_file:
            self.topic_docs = json.load(data_file)

        with open(labels_path) as data_file:
            self.topic_labels = json.load(data_file)


        with open(sample_posts_path) as data_file:
            self.sample_docs = json.load(data_file)


    def get_all_topics(self, words_in_topic=5):
        topics = copy.deepcopy(self.topics)
        for topic in topics:
            topic['counts'] = topic['counts'][0:words_in_topic]

        return topics

        """
        t1=Topic(id=1,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])
        t2=Topic(id=2,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])

        return [t1,t2]
                """

    def get_topic_details(self, topic_id, num_words=10):
        topic = self.topics[topic_id]
        topic = copy.deepcopy(topic)
        topic['counts'] = topic['counts'][0:num_words]
        return topic

    def get_topic_labels(self):
        return self.topic_labels

    def get_strongest_docs(self,topic_id):
        return self.topic_docs[topic_id]

    def get_sample_post(self):
        return random.choice(self.sample_docs)

    def get_topic_name(self,topic_id):
        return self.topic_labels[topic_id]['name']

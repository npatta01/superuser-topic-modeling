__author__ = 'Nidhin'

from model_exporter import ModelExporter


class BaseDriver:
    def __init__(self, lda_model=None):
        self.lda_model = lda_model
        self.me = ModelExporter(lda_model)

    def get_all_topics(self, words_in_topic=10):
        return self.me.topics(words_in_topic)

        """
        t1=Topic(id=1,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])
        t2=Topic(id=2,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])

        return [t1,t2]
                """

    def get_topic_details(self, topic_id, num_words=10):
        return self.me.topic(topic_id=topic_id, num_words=num_words)

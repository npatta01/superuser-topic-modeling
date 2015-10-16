__author__ = 'npatta01'

import gensim
import helper
import operator


class Model(object):
    def __init__(self, corpora_processor_options=None):
        self.dictionary = None
        self.lda = None
        self.num_topics = 20

        if corpora_processor_options == None:
            self.corpora_processor_options = {
                "stem": False
                , "stop_words": "../data/stopwords.txt"
                , "strip_html_tags": True
                , "filter_parts_of_speech": True
                , "min_word_length": 1
                , "lower_case": True

            }
        else:
            self.corpora_processor_option = corpora_processor_options

        self.doc_preprocesser = helper.Normalizer(**corpora_processor_options)

    def train(self, corpora, num_topics=10):
        self.dictionary = corpora.dictionary
        self.num_topics = num_topics
        self.lda = gensim.models.LdaMulticore(corpora, num_topics=num_topics,
                                              id2word=corpora.dictionary
                                              , passes=10
                                              )

        self.num_topics = self.lda.num_topics

    def load(self, model_path, dictionary_path):
        self.lda = gensim.models.LdaMulticore.load(model_path)

        self.dictionary = gensim.corpora.Dictionary.load(dictionary_path)

    def topics(self, num_words=10):
        num_topics = self.lda.num_topics
        return self.lda.show_topics(num_topics=num_topics, num_words=num_words)

    def topic(self, topic_id):
        return self.lda.show_topic(topic_id)

    def topics_for_doc(self, content):

        processed_tokens = self.doc_preprocesser.process(content)
        doc_bow = self.dictionary.doc2bow(processed_tokens)

        topic_strength = self.lda[doc_bow]

        return sorted(topic_strength, key=operator.itemgetter(1), reverse=True)

from __future__ import print_function

import sys
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
        self.num_topics = self.lda.num_topics

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

    def calculate_strongest_docs(self, corpora, max_docs=20):
        topic_strengths = []
        for i in range(self.num_topics):
            topic_strengths.append([])
        items_seen = 0
        for post in corpora:
            content = post.full_content
            id = post.id

            top_topics = self.topics_for_doc(content)
            if len(top_topics) > 0:
                top_topic = top_topics[0]
                topic_id, topic_strength = top_topic

                doc = {}
                doc['id'] = id
                doc['title'] = post.title
                doc['strength'] = topic_strength
                doc['question'] = post.question
                doc['answers'] = post.answers

                topic_strengths[topic_id].append(doc)

            items_seen += 1
            if items_seen % 1000 == 0:
                print("\r--- Completed {:,}".format(items_seen), end=' ')
                sys.stdout.flush()

        for i in range(len(topic_strengths)):
            doc_strengths = topic_strengths[i]
            # sort the doc by strength
            doc_strengths = sorted(doc_strengths, key=lambda x: x['strength'], reverse=True)

            doc_strengths = doc_strengths[:max_docs]
            topic_strengths[i] = {'topic':i ,'docs':doc_strengths}

        print()
        return topic_strengths

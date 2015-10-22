__author__ = 'Nidhin'


class Predict:
    def __init__(self, dictionary, normalizer, model):
        self.dictionary = dictionary
        self.normalizer = normalizer
        self.model = model

    def predict(self, new_document):
        doc_tokens = self.normalizer.process(new_document)

        bow = self.dictionary.doc2bow(doc_tokens)
        topic_strengths = self.model[bow]
        topic_strengths = sorted(topic_strengths, key=lambda x: x[1], reverse=True)

        topic_strengths = map(self._convert_topic_pair, topic_strengths)

        for topic in topic_strengths:
            topic['strength'] = round(topic['strength'], 2)
        return topic_strengths

    def _convert_topic_pair(self, item):
        return {'id': item[0], 'strength': item[1]}

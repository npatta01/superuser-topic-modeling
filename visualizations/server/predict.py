__author__ = 'Nidhin'


class Predict:
    def __init__(self, dictionary, normalizer, model):
        self.dictionary = dictionary
        self.normalizer = normalizer
        self.model = model

    def predict(self, new_document):
        doc_tokens = self.normalizer.process(new_document)

        bow = self.dictionary.doc2bow(doc_tokens)
        return self.model[bow]

__author__ = 'Nidhin'


class BaseModel():

    def __init__(self,model = None):
        self.model = model

    def get_all_topics(self,words_in_topic=10):
        return [{}]
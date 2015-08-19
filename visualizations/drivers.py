__author__ = 'Nidhin'

from models import Topic

class BaseDriver():

    def __init__(self,model = None):
        self.model = model

    def get_all_topics(self,words_in_topic=10):

        t1=Topic(id=1,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])
        t2=Topic(id=2,word_counts=[{'word1':5,'word2':2,'word3':1,'word4':4}])

        return [t1,t2]
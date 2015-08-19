__author__ = 'Nidhin'
import json


class BaseModel:
    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


class Topic:

    def __init__(self,id=None,name='',word_counts=[]):
        self.id=id
        self.name=name
        self.word_counts=word_counts


    def add_freq_count(self,word,count):
        self.word_counts.append({'word':word, 'count':count})

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'name': self.name,
            'word_counts': self.word_counts

        }
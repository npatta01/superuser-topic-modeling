import xml.etree.ElementTree as ET
import itertools
import pandas as pd
from BeautifulSoup import BeautifulSoup
import nltk
import re
from nltk.stem.snowball import SnowballStemmer
import gensim
import logging


def get_xml_file_as_df(xml_file_path, max_num_children=None):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    childrens = []

    for child in root:
        childrens.append(child.attrib)
        if max_num_children and len(childrens) > max_num_children:
            break

    return pd.DataFrame(childrens)


def get_xml_file_contents(xml_file_path, max_num_children=None):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    elements_seen = 0
    for child in root:
        yield child.attrib
        elements_seen += 1

        if max_num_children is not None and max_num_children > elements_seen:
            break


def strip_tags(html_text):
    """
    Get the text in html tags
    :param html_text:  text containing possible html tags
    :return:
    """
    try:
        soup = BeautifulSoup(html_text)
        cleaned_text = ''.join([e for e in soup.recursiveChildGenerator() if isinstance(e, unicode)])
        return cleaned_text
    except:
        logging.error("Failed to strip html tags for %s"%(html_text))
        return html_text



def tokenize_and_stem(text, stemmer=SnowballStemmer("english")):
    """
    tokenize and stem the passed text
    :param text:
    :return:
    """
    # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
    tokens = [word for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = []
    # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
    for token in tokens:
        if re.search('[a-zA-Z]', token):
            filtered_tokens.append(token)

    if stemmer is not None:
        stems = [stemmer.stem(t) for t in filtered_tokens]
        return stems
    else:
        return filtered_tokens


def remove_stopwords(tokenized_text, stopwords=nltk.corpus.stopwords.words('english')):
    return [word for word in tokenized_text if word not in stopwords]


class Normalizer(object):
    def __init__(self, stem=False, stopword_removal=False, strip_html_tags=False):
        self.stem = stem
        self.stopword_removal = stopword_removal
        self.strip_html_tags = strip_html_tags

        if self.stem:
            self.stemmer = SnowballStemmer("english")
        else:
            self.stemmer=None

    def process(self, document):
        if self.strip_html_tags:
            document = strip_tags(document)

        document = tokenize_and_stem(document,stemmer=self.stemmer)

        if self.stopword_removal:
            document = remove_stopwords(document)

        return document


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
        if dictionary is None:
            dictionary = gensim.corpora.Dictionary()
        self.dictionary = dictionary
        self.clip_docs = clip_docs
        self.normalizer = normalizer
        self.documents_parsed = 0
        self.body_field=body_field

    def __iter__(self):
        print (self.clip_docs)
        for document in get_xml_file_contents(self.dump_file, self.clip_docs):
            doc_content = document[self.body_field]
            tokens = self.normalizer.process(doc_content)
            yield self.dictionary.doc2bow(tokens, allow_update=True)
            self.documents_parsed += 1
            print(self.documents_parsed)

    def __len__(self):
        return self.documents_parsed

    def finalize_dictionary(self, no_below=5, no_above=0.5):
        self.dictionary.filter_extremes(no_below, no_above)
        self.dictionary.compactify()

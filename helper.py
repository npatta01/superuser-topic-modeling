import xml.etree.ElementTree as ET
import pandas as pd
from BeautifulSoup import BeautifulSoup
import nltk
import re
from nltk.stem.snowball import SnowballStemmer

def get_xml_file_as_df(xml_file_path, max_num_children=None):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    childrens = []

    for child in root:
        childrens.append(child.attrib)
        if max_num_children and len(childrens) > max_num_children:
            break

    return pd.DataFrame(childrens)


def strip_tags(html_text):

    """
    Get the text in html tags
    :param html_text:  text containing possible html tags
    :return:
    """
    soup = BeautifulSoup(html_text)
    cleaned_text = ''.join([e for e in soup.recursiveChildGenerator() if isinstance(e, unicode)])
    return cleaned_text


def tokenize_and_stem(text,stemmer=SnowballStemmer("english")):
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

def remove_stopwords(tokenized_text,stopwords = nltk.corpus.stopwords.words('english')):
    return [word for word in tokenized_text if word not in stopwords]

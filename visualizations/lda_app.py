import os

import flask
import gensim

from flask import request, Response

from server.drivers import BaseDriver, CachedDriver
from server.models import Topic
from server.predict import Predict
from analysis import helper

app = flask.Flask(__name__)

num_topics = 8
model_serialized_path = 'visualizations/artifacts/lda_topic_%s.lda' % (num_topics)
dict_path = 'visualizations/artifacts/lda.dict'
topics_count_path = 'visualizations/artifacts/topics_word_count.json'
doc_strength_path = 'visualizations/artifacts/doc_strength.json'
label_path = "visualizations/artifacts/labels.json"
sample_questions_path = "visualizations/artifacts/sample_docs.json"

options = {
    "stem": False
    , "stop_words": "data/stopwords.txt"
    , "strip_html_tags": True
    , "filter_parts_of_speech": True
    , "min_word_length": 1
    , "lower_case": True

}

ag_preprocesser = helper.Normalizer(**options)

lda_dict = gensim.corpora.dictionary.Dictionary.load(dict_path)

# driver = BaseDriver(model_serialized_path)
driver = CachedDriver(topics_count_path, doc_strength_path, label_path, sample_questions_path)

lda_model = gensim.models.LdaMulticore.load(model_serialized_path)
predictor = Predict(lda_dict, ag_preprocesser, lda_model)


@app.route('/api')
def hello_world():
    return 'Hello World!'


@app.route('/api/topics')
def topics():
    words_in_topic = int(request.args.get('words_in_topic', 10))
    all_topics = driver.get_all_topics(words_in_topic=words_in_topic)

    # data = jsonpickle.dumps(all_topics)
    # resp = Response(data, mimetype='application/json')
    # return flask.jsonify(data)
    # return resp

    res = {"res": all_topics}
    return flask.jsonify(res)


@app.route('/api/topic')
def topic():
    topic_id = int(request.args.get('topic_id', 0))
    words_in_topic = int(request.args.get('words_in_topic', 10))

    topic_detail = driver.get_topic_details(topic_id, num_words=words_in_topic)

    # data = jsonpickle.dumps(topic_detail)
    # resp = Response(data, mimetype='application/json')
    # return resp
    res = {"res": topic_detail}
    return flask.jsonify(res)


@app.route('/api/topic_docs')
def topic_docs():
    topic_id = int(request.args.get('topic_id', 0))
    docs = driver.get_strongest_docs(topic_id)
    return flask.jsonify(docs)


@app.route('/api/topic_descriptions')
def topic_descriptions():
    labels = driver.get_topic_labels()
    return flask.jsonify({'res': labels})


@app.route('/api/analyze', methods=['POST'])
def analyze_topics():
    content = request.get_json()['content']
    topics = predictor.predict(content)

    for topic in topics:
        topic['name'] = driver.get_topic_name(topic['id'])

    res = {"res": topics}
    return flask.jsonify(res)
    # return flask.jsonify(data)


@app.route('/api/sample_doc')
def sample_doc():
    data = driver.get_sample_post()

    return flask.jsonify(data)
    # return flask.jsonify(data)


@app.route('/libs/<path:path>')
def libs(path):
    path = os.path.join('libs', path)
    return app.send_static_file(path)


@app.route('/<path:path>')
def static_file(path):
    # return flask.send_from_directory('static', path,
    #                                 cache_timeout=-10)
    return app.send_static_file(path)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

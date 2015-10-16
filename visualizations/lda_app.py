import flask
import gensim
from flask import request, Response
import os
from drivers import BaseDriver
from models import Topic
from predict import Predict

from analysis import helper

app = flask.Flask(__name__)

num_topics = 20
model_serialized_path = 'visualizations/lda_topic_%s.lda' % (num_topics)

options = {
    "stem":False
    ,"stop_words":"data/stopwords.txt"
    ,"strip_html_tags":True
    ,"filter_parts_of_speech":True
    ,"min_word_length":1
    ,"lower_case":True

}

ag_preprocesser = helper.Normalizer(**options)

lda_dict=gensim.corpora.dictionary.Dictionary.load('visualizations/lda.dict')

driver = BaseDriver(model_serialized_path)

lda_model = gensim.models.LdaMulticore.load(model_serialized_path)
predictor= Predict(lda_dict,ag_preprocesser,lda_model)

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

    topic_detail = driver.get_topic_details(topic_id, words_in_topic)

    # data = jsonpickle.dumps(topic_detail)
    # resp = Response(data, mimetype='application/json')
    # return resp
    res = {"res": topic_detail}
    return flask.jsonify(res)


@app.route('/api/jsonpickle')
def jsonpcikle_topic():
    all_topics = driver.get_all_topics()
    # return json_response(to_JSON(all_topics))
    # return Response(json.dumps(all_topics), mimetype='application/json')

    topic = Topic(id=5, word_counts=None)

    resp = Response(topic, mimetype='application/json')
    # return flask.jsonify(data)
    return resp



@app.route('/libs/<path:path>')
def libs(path):
    path=os.path.join('libs',path)
    return app.send_static_file(path)


@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)



@app.route('/')
def index():
    return app.send_static_file('index.html')



if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

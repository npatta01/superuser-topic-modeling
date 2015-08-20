import json
import flask
from drivers import BaseDriver
from flask import Response
from flask_json import FlaskJSON, JsonError, json_response, as_json
import simplejson
from helper import to_JSON
from models import Topic
import jsonpickle



app = flask.Flask(__name__)
json = FlaskJSON(app)

driver = BaseDriver()


@app.route('/api')
def hello_world():
    return 'Hello World!'


@app.route('/api/topics')
def topics():
    all_topics = driver.get_all_topics()
    #return json_response(to_JSON(all_topics))
    #return Response(json.dumps(all_topics), mimetype='application/json')

    #res= {'topics':all_topics}
    #res_json = to_JSON(res)
    #return flask.jsonify(res_json)
    return jsonpickle.dumps(all_topics)


@app.route('/api/topic')
def simple_topic():
    all_topics = driver.get_all_topics()
    #return json_response(to_JSON(all_topics))
    #return Response(json.dumps(all_topics), mimetype='application/json')

    res= Topic(id=5, word_counts=None)
    #res_json = to_JSON(res)
    return flask.jsonify(res)


@app.route('/api/jsonpickle')
def jsonpcikle_topic():
    all_topics = driver.get_all_topics()
    #return json_response(to_JSON(all_topics))
    #return Response(json.dumps(all_topics), mimetype='application/json')

    res= Topic(id=5, word_counts=None)
    #res_json = to_JSON(res)
    return jsonpickle.dumps(res)

@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)

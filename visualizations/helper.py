import json


def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__

def to_JSON(obj):
    return json.dumps(obj, default=dumper)
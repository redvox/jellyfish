import json
from dotmap import DotMap
from app import config
from functools import reduce


def load_app(app_id):
    raw_app = config.rdb.get(app_id)
    if raw_app:
        return json.loads(raw_app.decode())
    return None


def get_by_list(dic, keys):
    return reduce(dict.get, keys, dic)


def get_all_apps():
    apps = config.rdb.smembers("all-services") or []
    app_list = list()
    for app in apps:
        raw_app = config.rdb.get(app)
        if raw_app:
            app_list.append(json.loads(raw_app.decode()))
    return app_list


def transform_to_display_data(apps):
    display_data = DotMap()
    for app in apps:
        display_data["all"][app["full-name"]][app["group"]][app["color"]] = app
        display_data[app["vertical"]][app["name"]][app["group"]][app["color"]] = app
    return display_data.toDict()

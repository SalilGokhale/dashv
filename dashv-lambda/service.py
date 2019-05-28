# -*- coding: utf-8 -*-
import dashv
import os
import json


def get_all(event, context):
    results = dict(dashv.dashv_backend_lambda([
        ("golang", "go"),
        ("python", "cpython"),
        ("angular", "angular"),
        ("facebook", "react"),
        ("nodejs", "node"),
        ("postgres", "postgres"),
        ("ruby", "ruby")
    ], os.environ["GITHUB_ACCESS_TOKEN"]))

    return results

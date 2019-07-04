# -*- coding: utf-8 -*-
import os
from typing import Dict, Any

import dashv


def get(event: object, context):
    result: Dict[Any, Any] = dict(dashv.get(event, os.environ["GITHUB_ACCESS_TOKEN"]))
    return result


def get_all(event, context):
    results = dict(dashv.get_all([
        ("golang", "go"),
        ("python", "cpython"),
        ("angular", "angular"),
        ("facebook", "react"),
        ("nodejs", "node"),
        ("postgres", "postgres"),
        ("ruby", "ruby")
    ], os.environ["GITHUB_ACCESS_TOKEN"]))

    return results

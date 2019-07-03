# -*- coding: utf-8 -*-
import os

import dashv


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

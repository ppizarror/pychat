#! /usr/bin/python3
# -*- coding: utf-8 -*-
"""
Connects to the server.
"""

import pymysql


class PyChatDb(object):
    """
    Database connection.
    """

    _conn: 'pymysql.Connection'

    def __init__(self) -> None:
        """
        Constructor.
        """
        self._conn = pymysql.connect(
            db='pychat',
            user='root',
            passwd='',
            host='localhost',
            charset='utf8'
        )

    def get_cursor(self) -> 'pymysql.cursors.Cursor':
        """
        Returns the connection cursor.

        :return: Cursor
        """
        return self._conn.cursor()

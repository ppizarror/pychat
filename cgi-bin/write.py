#! /usr/bin/python3
# -*- coding: utf-8 -*-
"""
Write a message tothe server.
This file is intended to be requested by AJAX.
"""

import cgi
import cgitb
import html
import codecs
import sys
import hashlib
from db import PyChatDb
import emoji

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

# Get the post data and check if the elements exists
data = cgi.FieldStorage()
if 'uname' in data and 'message' in data and 'password' in data:
    # Escape data and validate
    username = html.escape(data.getvalue('uname'))
    message = emoji.demojize(html.escape(data.getvalue('message')))
    password = html.escape(data.getvalue('password')).encode('utf-8')

    if len(username) < 4 or len(username) > 10 or \
            len(message) < 1 or len(message) > 256 or \
            len(password) < 4 or len(password) > 32:
        print('Invalid data at validatation phase')

    else:
        db = PyChatDb()
        conn, cur = db.get_conn(), db.get_cursor()

        # Calcula sha256 del password
        hash_object = hashlib.sha256(password)
        hex_dig = str(hash_object.hexdigest())

        # noinspection SqlNoDataSourceInspection
        sql = "INSERT INTO `chats` (`id`, `username`, `message`, `password`) VALUES (NULL, %s, %s, %s);"
        resultado = cur.execute(sql, (username, message, hex_dig))
        conn.commit()

        if resultado == 1:
            print('OK')
        else:
            print('Error while saving message in the database')

else:
    print('Error in query')

#! /usr/bin/python3
# -*- coding: utf-8 -*-
"""
Read messages from the server.
This file is intended to be requested by AJAX.
"""

import cgitb
import codecs
import sys
import pymysql
import json
import cgi
import html
import hashlib
import emoji
from db import PyChatDb

# Creates a connection
db = PyChatDb()
conn, cur = db.get_conn(), db.get_cursor()

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

# Get the password
data = cgi.FieldStorage()

# Check if password is defined
if 'password' in data:
    # Encodes the password
    password = html.escape(data.getvalue('password'))
    hash_object = hashlib.sha256(password.encode('utf-8'))
    hex_dig = str(hash_object.hexdigest())

    # noinspection SqlDialectInspection, SqlNoDataSourceInspection
    sql = "SELECT `username`,`message`,`date`,`id` from chats WHERE `password`=%s ORDER BY `id` DESC LIMIT 15"
    try:
        resultado = cur.execute(sql, hex_dig)
        conn.commit()
        messages = cur.fetchall()
        msg = {}
        k = 0
        for i in messages:
            msg[k] = list(i)
            msg[k][1] = emoji.emojize(msg[k][1])  # message
            msg[k][2] = msg[k][2].strftime('%d/%m/%Y %H:%M:%S')  # date
            k += 1
        print(json.dumps(msg))
    except pymysql.Error as e:
        print('Error while processing the database query')
    cur.close()

else:
    print('Error, password not defined')

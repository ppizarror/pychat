#! /usr/bin/python3
# -*- coding: utf-8 -*-
"""
Read messages from the server.
"""

import cgitb
import codecs
import sys
import pymysql
import json
import cgi
import html
import hashlib

# Da
conn = pymysql.connect(
    db='test',
    user='root',
    passwd='',
    host='localhost',
    charset='utf8')
c = conn.cursor()

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

# Obtiene el password
datos = cgi.FieldStorage()
if 'password' in datos:
    pwd = html.escape(datos.getvalue('password'))
    hash_object = hashlib.sha256(pwd.encode('utf-8'))
    hex_dig = str(hash_object.hexdigest())
    sql = "SELECT `username`,`message`,`date`,`id` from aux8pass WHERE `password`=%s ORDER BY `id` DESC LIMIT 15"
    try:
        resultado = c.execute(sql, hex_dig)
        conn.commit()
        messages = c.fetchall()
        msg = {}
        k = 0
        for i in messages:
            msg[k] = list(i)
            msg[k][2] = msg[k][2].strftime('%d/%m/%Y %H:%M:%S')
            k += 1
        print(json.dumps(msg))
    except pymysql.Error as e:
        mensaje = 'Error con base de datos: {0} {1} '.format(e.args[0], e.args[1])
    c.close()
else:
    print('ERROR, Contraseña no proporcionada')

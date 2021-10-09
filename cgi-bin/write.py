#!C:\Users\Pablo\AppData\Local\Programs\Python\Python37\python.exe
# -*- coding: utf-8 -*-

import cgi
import cgitb
import html
import codecs
import sys
import pymysql
import hashlib

# noinspection PyUnresolvedReferences
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
cgitb.enable()

print('Content-type: text/html; charset=UTF-8')
print('')

# Obtiene los datos por post
datos = cgi.FieldStorage()
if 'uname' in datos and 'message' in datos and 'password' in datos:
    n = html.escape(datos.getvalue('uname'))
    m = html.escape(datos.getvalue('message'))
    pwd = html.escape(datos.getvalue('password'))
    if len(n) < 4 or len(n) > 10 or len(m) < 1 or len(m) >= 256 or len(pwd) < 4 or len(pwd) > 32:
        print('ERROR EN DATOS USUARIO')
    else:
        conn = pymysql.connect(
            db='test',
            user='root',
            passwd='',
            host='localhost',
            charset='utf8')
        c = conn.cursor()

        # Calcula sha256 del password
        hash_object = hashlib.sha256(pwd.encode('utf-8'))
        hex_dig = str(hash_object.hexdigest())

        sql = "INSERT INTO `aux8pass` (`id`, `username`, `message`, `date`, `password`) VALUES (NULL, %s, %s, current_timestamp(), %s);"
        resultado = c.execute(sql, (n, m, hex_dig))
        conn.commit()
        if resultado == 1:
            print('OK')
        else:
            print('ERROR AL INSERTAR DB')
else:
    print('ERROR EN CONSULTA')

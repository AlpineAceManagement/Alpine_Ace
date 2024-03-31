import psycopg2 as pg2

dbname = 'geoserver'
user = 'postgres'
psw = 'jNtd2C13ka9oaPpRy1jP'
host = 'localhost'
port = '5433'  # Port auf PC nicht Standard (5433) WICHTIG auf Server ändern
schema = user


def send_sql(dbname, user, psw, host, port, sql, param=[]):
    connection = pg2.connect(' '.join(['dbname='+dbname, 'user='+user, 'password='+psw, 'host='+host, 'port='+port]))
    try:
        with connection.cursor() as curs:
            curs.execute(sql, param)
        connection.commit()  # Commit der Transaktion
        result = "Data inserted successfully"
    except Exception as e:
        connection.rollback()  # Rollback im Fehlerfall
        print("Error:", e)
        result = None
    finally:
        connection.close()
    return result


sql = f"INSERT INTO Schneehoehe (SH_Zeit, SH_Hoehe) VALUES (TIMESTAMP '2024-03-17T17:30:00Z', 224.4)"
print(sql)
result = send_sql(dbname, user, psw, host, port, sql, param=[schema])
print(result)

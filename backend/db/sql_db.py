import os
import mysql.connector
from dotenv import load_dotenv


load_dotenv()


def get_db_conn():
    """
    Establishes and returns a connection to the local MySQL database using credentials from .env file.
    If the connection fails, it raises an exception with the error details.
    """
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user="root",
            password=os.getenv("DB_PASSWORD"),
            database='shoppingassistantbot'
        )
        print("[*] Successfully connected to MySQL database.")
        return connection
    except mysql.connector.Error as err:
        print(f"CRITICAL ERROR: Failed to connect to MySQL database. Details: {err}")
        raise
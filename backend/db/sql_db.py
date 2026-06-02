import os
import mysql.connector
from dotenv import load_dotenv


load_dotenv()

def get_db_conn():
    """
    Establishes and returns a connection to the database using credentials from the environment.
    If the connection fails, it raises an exception with the error details.
    """
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),     
            user=os.getenv("DB_USER"),      
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        print("[*] Successfully connected to MySQL database.")
        return connection
    except mysql.connector.Error as err:
        print(f"CRITICAL ERROR: Failed to connect to MySQL database. Details: {err}")
        raise
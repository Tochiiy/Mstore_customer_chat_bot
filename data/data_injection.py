import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()


csv_file_path = 'data/shop-product-catalog.csv' 
data = pd.read_csv(csv_file_path)

print("Connecting to Aiven Cloud Database...")


db_connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT", 3306)),
    ssl_disabled=False
)

cursor = db_connection.cursor()
print("Connection established! Setting up table...")

create_table_sql = """
CREATE TABLE IF NOT EXISTS products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(255),
    ProductBrand VARCHAR(100),
    Gender VARCHAR(50),
    Price INT,
    Description TEXT,
    PrimaryColor VARCHAR(50)
)
"""
cursor.execute(create_table_sql)
print("Table verified. Injecting data via Raw SQL bypass...")


def format_for_sql(value):
    if pd.isna(value):
        return "NULL"

    clean_str = str(value).replace("'", "''")
    return f"'{clean_str}'"

success_count = 0

for index, row in data.iterrows():
    pid = int(row['ProductID'])
    price = int(row['Price']) if pd.notna(row['Price']) else "NULL"
    
    name = format_for_sql(row['ProductName'])
    brand = format_for_sql(row['ProductBrand'])
    gender = format_for_sql(row['Gender'])
    desc = format_for_sql(row['Description'])
    color = format_for_sql(row['PrimaryColor'])


    raw_sql = f"""
    INSERT IGNORE INTO products 
    (ProductID, ProductName, ProductBrand, Gender, Price, Description, PrimaryColor) 
    VALUES 
    ({pid}, {name}, {brand}, {gender}, {price}, {desc}, {color})
    """
    
    cursor.execute(raw_sql)
    success_count += 1

db_connection.commit()
print(f"Successfully inserted {success_count} products into the cloud database!")

cursor.close()
db_connection.close()
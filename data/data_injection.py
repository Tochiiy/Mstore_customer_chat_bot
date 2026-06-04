import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

# Load credentials from your .env file
load_dotenv()

csv_file_path = 'data/shop-product-catalog.csv' 
ssl_cert_path = 'data/ca.pem'  # Path to the certificate you just downloaded

data = pd.read_csv(csv_file_path)

print("Connecting to Aiven Cloud Database via Secured SSL...")

# Connect to the database with SSL configurations enabled
try:
    db_connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"), 
        port=int(os.getenv("DB_PORT", 18925)),
        ssl_ca=ssl_cert_path,          # Verifies the database identity using your pem file
        ssl_disabled=False             # Forces SSL to be active
    )
except mysql.connector.Error as err:
    print(f"Failed to establish an encrypted handshake: {err}")
    exit(1)

cursor = db_connection.cursor()
print("Secure connection established! Setting up table...")

# Create the table if it doesn't exist
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
print("Table verified. Preparing data for bulk injection...")

# Prepare the data list for executemany
data_to_insert = []
for index, row in data.iterrows():
    data_to_insert.append((
        int(row['ProductID']),
        row['ProductName'],
        row['ProductBrand'],
        row['Gender'],
        int(row['Price']) if pd.notna(row['Price']) else None,
        row['Description'],
        row['PrimaryColor']
    ))

# SQL Template using %s placeholders
insert_query = """
INSERT IGNORE INTO products 
(ProductID, ProductName, ProductBrand, Gender, Price, Description, PrimaryColor) 
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# Bulk execution over encrypted channel
try:
    print(f"Injecting {len(data_to_insert)} products via secure bulk execution...")
    cursor.executemany(insert_query, data_to_insert)
    
    db_connection.commit()
    print(f"Successfully inserted {cursor.rowcount} products into the cloud database!")
except mysql.connector.Error as err:
    print(f"Error during injection: {err}")
    db_connection.rollback()
finally:
    cursor.close()
    db_connection.close()
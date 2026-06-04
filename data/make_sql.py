import pandas as pd
import math

# 1. Read your CSV
data = pd.read_csv('data/shop-product-catalog.csv')

# 2. Create a new SQL file
with open('data/import_data.sql', 'w', encoding='utf-8') as f:
    
    # Write the table creation command
    f.write("""
CREATE TABLE IF NOT EXISTS products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(255),
    ProductBrand VARCHAR(100),
    Gender VARCHAR(50),
    Price INT,
    Description TEXT,
    PrimaryColor VARCHAR(50)
);\n\n""")

    # Write an INSERT command for every row in your CSV
    for index, row in data.iterrows():
        pid = int(row['ProductID'])
        
        # Clean up text to prevent SQL errors (escaping apostrophes)
        name = str(row['ProductName']).replace("'", "''") if pd.notna(row['ProductName']) else ""
        brand = str(row['ProductBrand']).replace("'", "''") if pd.notna(row['ProductBrand']) else ""
        gender = str(row['Gender']).replace("'", "''") if pd.notna(row['Gender']) else ""
        desc = str(row['Description']).replace("'", "''") if pd.notna(row['Description']) else ""
        color = str(row['PrimaryColor']).replace("'", "''") if pd.notna(row['PrimaryColor']) else ""
        
        # Handle empty prices
        price = int(row['Price']) if pd.notna(row['Price']) else "NULL"

        sql = f"INSERT IGNORE INTO products (ProductID, ProductName, ProductBrand, Gender, Price, Description, PrimaryColor) VALUES ({pid}, '{name}', '{brand}', '{gender}', {price}, '{desc}', '{color}');\n"
        f.write(sql)

print("Success! Open data/import_data.sql in VS Code.")
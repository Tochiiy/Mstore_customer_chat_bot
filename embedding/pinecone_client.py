import os
import time
import mysql.connector
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from tqdm.auto import tqdm
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

class PineconeHandler:
    def __init__(self):
        """
        Initializes our connections to Pinecone, the Embedding Model, and local MySQL DB.
        If any critical API keys are missing, it halts the script immediately to prevent silent failures.
        """
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = os.getenv("PINECONE_INDEX_NAME")

        if not self.api_key or not self.index_name:
            raise ValueError(
                "CRITICAL ERROR: Please ensure PINECONE_API_KEY and PINECONE_INDEX_NAME are set in your .env file."
            )

       
        self.pc = Pinecone(api_key=self.api_key)
        
      
        self.embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
        
       
        self.index = self._get_or_create_index()

       
        self.db_connection = mysql.connector.connect(
            host='localhost',
            user="root",
            password=os.getenv("DB_PASSWORD"),
            database='shoppingassistantbot'
        )
        
        self.cursor = self.db_connection.cursor(dictionary=True)

    def _get_or_create_index(self):
        """
        Checks if target Pinecone index exists. If not, it provisions a new serverless index.
        Because serverless indexes take a few seconds to spin up on AWS, we use a while-loop 
        to poll the status until it reports 'ready' before we try to push data to it.
        """
        # Grab a list of all existing indexes on this Pinecone account
        existing_indexes = [i.name for i in self.pc.list_indexes()]

        if self.index_name in existing_indexes:
            print(f"[*] Using existing Pinecone index: {self.index_name}")
        else:
            print(f"[*] Index '{self.index_name}' not found. Provisioning a new one...")
            
            spec = ServerlessSpec(cloud="aws", region="us-east-1")
            
            self.pc.create_index(
                name=self.index_name,
                dimension=3072,     
                metric="cosine", 
                spec=spec
            )
            
          
            while True:
                desc = self.pc.describe_index(self.index_name)
                if desc.status.ready:
                    print("[*] Pinecone index is fully provisioned and ready.")
                    break
                print("    -> Waiting for Pinecone index to be ready...")
                time.sleep(5) 

        return self.pc.Index(self.index_name)

    def sync_products_to_vector_db(self):
        """Fetches items from MySQL, batches them, embeds them, and pushes to Pinecone."""
        self.cursor.execute("SELECT * FROM products")
        products = self.cursor.fetchall()

        if not products:
            print("No products found in the MySQL 'products' table.")
            return

        print(f"Fetched {len(products)} products from MySQL. Vector sync in progress...")
        
        batch_size = 25
        
      
        for i in tqdm(range(0, len(products), batch_size)):
            batch = products[i:i + batch_size]
            
            texts_to_embed = []
            metadatas = []
            ids = []
            
            for product in batch:
                text = (
                    f"Product Name: {product['ProductName']}. "
                    f"Brand: {product['ProductBrand'] if product['ProductBrand'] else ''}. "
                    f"Gender: {product['Gender'] if product['Gender'] else ''}. "
                    f"Color: {product['PrimaryColor'] if product['PrimaryColor'] else ''}. "
                    f"Description: {product['Description'] if product['Description'] else ''}"
                )
                texts_to_embed.append(text)
                
                metadata = {
                    "ProductID": int(product['ProductID']),
                    "ProductName": str(product['ProductName']),
                    "ProductBrand": str(product['ProductBrand']) if product['ProductBrand'] else "",
                    "Gender": str(product['Gender']) if product['Gender'] else "",
                    "Price": float(product['Price']) if product['Price'] else 0.0,
                    "PrimaryColor": str(product['PrimaryColor']) if product['PrimaryColor'] else "",
                    "Description": str(product['Description']) if product['Description'] else "",
                    "text_content": text
                }
                metadatas.append(metadata)
                ids.append(str(product['ProductID']))
                
          
            vectors = self.embeddings.embed_documents(texts_to_embed)
            
         
            vectors_to_upsert = list(zip(ids, vectors, metadatas))
            
           
            self.index.upsert(vectors=vectors_to_upsert)

           
            tqdm.write("[*] Batch completed. Pausing for 15 seconds to rest API limits...")
            time.sleep(15)

        print(f"Successfully synced all vectors to Pinecone index: '{self.index_name}'!")

    def close_connections(self):
        """
        Close database connections to prevent memory leaks 
        and locked tables in the local MySQL server.
        """
        self.cursor.close()
        self.db_connection.close()


if __name__ == "__main__":
    handler = PineconeHandler()
    handler.sync_products_to_vector_db()
    handler.close_connections()
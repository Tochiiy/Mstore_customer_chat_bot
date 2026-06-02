from fastapi import FastAPI, APIRouter, HTTPException
from backend.db.sql_db import get_db_conn

router = APIRouter()

@router.get("/products")
def get_products():
    db = None
    cursor = None
    try:
        
        db = get_db_conn()
        cursor = db.cursor(dictionary=True)
        
      
        cursor.execute("SELECT * FROM products")
        
      
        products = cursor.fetchall()
        return products

    except Exception as e:
      
        print(f"Database error while fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error reading product database")
        
    finally:
      
        if cursor:
            cursor.close()
        if db:
            db.close()



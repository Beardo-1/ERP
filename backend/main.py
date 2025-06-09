from fastapi import FastAPI, HTTPException, Depends, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
from enum import Enum
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId
import json
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets

# Initialize FastAPI app
app = FastAPI(
    title="Real Estate CRM & ERP System",
    description="Comprehensive Real Estate Management Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.real_estate_erp

# Enums
class PropertyType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    LAND = "land"
    INDUSTRIAL = "industrial"

class PropertyStatus(str, Enum):
    AVAILABLE = "available"
    LEASED = "leased"
    SOLD = "sold"
    OFF_MARKET = "off_market"
    UNDER_CONTRACT = "under_contract"

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class DealStatus(str, Enum):
    PROSPECTING = "prospecting"
    QUALIFICATION = "qualification"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"
    CLOSED = "closed"
    LOST = "lost"

# Pydantic Models
class PropertyBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    property_type: PropertyType
    status: PropertyStatus
    price: float = Field(..., gt=0)
    area: float = Field(..., gt=0)  # in sq ft
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[float] = Field(None, ge=0)
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: List[str] = []
    images: List[str] = []
    year_built: Optional[int] = None
    parking_spaces: Optional[int] = Field(None, ge=0)
    lot_size: Optional[float] = None  # in acres
    hoa_fee: Optional[float] = Field(None, ge=0)
    property_tax: Optional[float] = Field(None, ge=0)
    listing_agent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Property(PropertyBase):
    id: str = Field(alias="_id")

class CustomerBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    date_of_birth: Optional[date] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = Field(None, ge=0)
    credit_score: Optional[int] = Field(None, ge=300, le=850)
    preferred_property_type: Optional[PropertyType] = None
    budget_min: Optional[float] = Field(None, ge=0)
    budget_max: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None
    lead_source: Optional[str] = None
    assigned_agent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Customer(CustomerBase):
    id: str = Field(alias="_id")

class SaleBase(BaseModel):
    property_id: str
    customer_id: str
    agent_id: str
    sale_price: float = Field(..., gt=0)
    commission_rate: float = Field(..., ge=0, le=1)  # 0-1 (0-100%)
    commission_amount: float = Field(..., ge=0)
    closing_date: date
    contract_date: date
    status: DealStatus = DealStatus.PROSPECTING
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Sale(SaleBase):
    id: str = Field(alias="_id")

class LeaseBase(BaseModel):
    property_id: str
    tenant_id: str  # customer_id
    agent_id: str
    monthly_rent: float = Field(..., gt=0)
    security_deposit: float = Field(..., ge=0)
    lease_start: date
    lease_end: date
    lease_term_months: int = Field(..., gt=0)
    utilities_included: List[str] = []
    pet_policy: Optional[str] = None
    parking_included: bool = False
    status: str = "active"  # active, expired, terminated
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Lease(LeaseBase):
    id: str = Field(alias="_id")

class FinanceRecordBase(BaseModel):
    type: str  # income, expense
    category: str  # commission, rent, maintenance, marketing, etc.
    amount: float
    description: str
    date: date
    property_id: Optional[str] = None
    customer_id: Optional[str] = None
    agent_id: Optional[str] = None
    receipt_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FinanceRecord(FinanceRecordBase):
    id: str = Field(alias="_id")

# Authentication Models
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class DashboardStats(BaseModel):
    total_properties: int
    available_properties: int
    sold_properties: int
    leased_properties: int
    total_customers: int
    active_leads: int
    monthly_revenue: float
    monthly_expenses: float
    net_profit: float
    total_sales_volume: float
    average_property_price: float
    properties_by_type: Dict[str, int]
    sales_by_month: List[Dict[str, Any]]
    top_agents: List[Dict[str, Any]]
    recent_transactions: List[Dict[str, Any]]

# Authentication Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user_from_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data

# Helper functions
def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, date):
                result[key] = value.isoformat()
            else:
                result[key] = serialize_doc(value)
        return result
    return doc

# Authentication dependency (simplified for demo)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In production, validate JWT token here
    return {"user_id": "demo_user", "role": "admin"}

# Authentication Endpoints
@app.post("/api/auth/login", response_model=Dict)
async def login(response: Response, user_credentials: UserLogin):
    # Mock authentication - in production, verify against database
    if user_credentials.username == "admin" and user_credentials.password == "admin123":
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        
        access_token = create_access_token(
            data={"sub": user_credentials.username}, 
            expires_delta=access_token_expires
        )
        refresh_token = create_access_token(
            data={"sub": user_credentials.username}, 
            expires_delta=refresh_token_expires
        )
        
        # Set secure HTTP-only cookies
        response.set_cookie(
            "access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        response.set_cookie(
            "refresh_token",
            value=f"Bearer {refresh_token}",
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400
        )
        
        return {
            "message": "Login successful",
            "user": {"username": user_credentials.username, "role": "admin"},
            "access_token": access_token,
            "token_type": "bearer"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logout successful"}

# API Routes

# Dashboard Analytics
@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        # Get basic counts
        total_properties = await db.properties.count_documents({})
        available_properties = await db.properties.count_documents({"status": "available"})
        sold_properties = await db.properties.count_documents({"status": "sold"})
        leased_properties = await db.properties.count_documents({"status": "leased"})
        total_customers = await db.customers.count_documents({})
        
        # Calculate financial metrics
        current_month = datetime.utcnow().replace(day=1)
        monthly_revenue = await db.finance_records.aggregate([
            {"$match": {"type": "income", "date": {"$gte": current_month}}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]).to_list(1)
        
        monthly_expenses = await db.finance_records.aggregate([
            {"$match": {"type": "expense", "date": {"$gte": current_month}}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]).to_list(1)
        
        revenue = monthly_revenue[0]["total"] if monthly_revenue else 0
        expenses = monthly_expenses[0]["total"] if monthly_expenses else 0
        
        # Properties by type
        properties_by_type = {}
        for prop_type in PropertyType:
            count = await db.properties.count_documents({"property_type": prop_type.value})
            properties_by_type[prop_type.value] = count
        
        # Average property price
        avg_price_result = await db.properties.aggregate([
            {"$group": {"_id": None, "avg_price": {"$avg": "$price"}}}
        ]).to_list(1)
        avg_price = avg_price_result[0]["avg_price"] if avg_price_result else 0
        
        # Total sales volume
        sales_volume_result = await db.sales.aggregate([
            {"$group": {"_id": None, "total": {"$sum": "$sale_price"}}}
        ]).to_list(1)
        sales_volume = sales_volume_result[0]["total"] if sales_volume_result else 0
        
        return DashboardStats(
            total_properties=total_properties,
            available_properties=available_properties,
            sold_properties=sold_properties,
            leased_properties=leased_properties,
            total_customers=total_customers,
            active_leads=total_customers,  # Simplified
            monthly_revenue=revenue,
            monthly_expenses=expenses,
            net_profit=revenue - expenses,
            total_sales_volume=sales_volume,
            average_property_price=avg_price,
            properties_by_type=properties_by_type,
            sales_by_month=[],  # Would implement with aggregation
            top_agents=[],  # Would implement with aggregation
            recent_transactions=[]  # Would implement with recent sales/leases
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Properties API
@app.get("/api/properties", response_model=List[Dict])
async def get_properties(
    skip: int = 0,
    limit: int = 100,
    property_type: Optional[PropertyType] = None,
    status: Optional[PropertyStatus] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    city: Optional[str] = None
):
    """Get properties with filtering"""
    query = {}
    if property_type:
        query["property_type"] = property_type.value
    if status:
        query["status"] = status.value
    if min_price or max_price:
        query["price"] = {}
        if min_price:
            query["price"]["$gte"] = min_price
        if max_price:
            query["price"]["$lte"] = max_price
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    properties = await db.properties.find(query).skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(prop) for prop in properties]

@app.post("/api/properties", response_model=Dict)
async def create_property(property_data: PropertyBase, user=Depends(get_current_user)):
    """Create a new property"""
    property_dict = property_data.dict()
    result = await db.properties.insert_one(property_dict)
    created_property = await db.properties.find_one({"_id": result.inserted_id})
    return serialize_doc(created_property)

@app.get("/api/properties/{property_id}", response_model=Dict)
async def get_property(property_id: str):
    """Get a specific property"""
    try:
        property_doc = await db.properties.find_one({"_id": ObjectId(property_id)})
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        return serialize_doc(property_doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid property ID")

@app.put("/api/properties/{property_id}", response_model=Dict)
async def update_property(property_id: str, property_data: PropertyBase, user=Depends(get_current_user)):
    """Update a property"""
    try:
        property_dict = property_data.dict()
        property_dict["updated_at"] = datetime.utcnow()
        result = await db.properties.update_one(
            {"_id": ObjectId(property_id)},
            {"$set": property_dict}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Property not found")
        updated_property = await db.properties.find_one({"_id": ObjectId(property_id)})
        return serialize_doc(updated_property)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/properties/{property_id}")
async def delete_property(property_id: str, user=Depends(get_current_user)):
    """Delete a property"""
    try:
        result = await db.properties.delete_one({"_id": ObjectId(property_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Property not found")
        return {"message": "Property deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Customers API
@app.get("/api/customers", response_model=List[Dict])
async def get_customers(skip: int = 0, limit: int = 100):
    """Get customers"""
    customers = await db.customers.find().skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(customer) for customer in customers]

@app.post("/api/customers", response_model=Dict)
async def create_customer(customer_data: CustomerBase, user=Depends(get_current_user)):
    """Create a new customer"""
    customer_dict = customer_data.dict()
    result = await db.customers.insert_one(customer_dict)
    created_customer = await db.customers.find_one({"_id": result.inserted_id})
    return serialize_doc(created_customer)

@app.get("/api/customers/{customer_id}", response_model=Dict)
async def get_customer(customer_id: str):
    """Get a specific customer"""
    try:
        customer_doc = await db.customers.find_one({"_id": ObjectId(customer_id)})
        if not customer_doc:
            raise HTTPException(status_code=404, detail="Customer not found")
        return serialize_doc(customer_doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid customer ID")

# Sales API
@app.get("/api/sales", response_model=List[Dict])
async def get_sales(skip: int = 0, limit: int = 100):
    """Get sales records"""
    sales = await db.sales.find().skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(sale) for sale in sales]

@app.post("/api/sales", response_model=Dict)
async def create_sale(sale_data: SaleBase, user=Depends(get_current_user)):
    """Create a new sale"""
    sale_dict = sale_data.dict()
    result = await db.sales.insert_one(sale_dict)
    created_sale = await db.sales.find_one({"_id": result.inserted_id})
    return serialize_doc(created_sale)

# Leases API
@app.get("/api/leases", response_model=List[Dict])
async def get_leases(skip: int = 0, limit: int = 100):
    """Get lease records"""
    leases = await db.leases.find().skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(lease) for lease in leases]

@app.post("/api/leases", response_model=Dict)
async def create_lease(lease_data: LeaseBase, user=Depends(get_current_user)):
    """Create a new lease"""
    lease_dict = lease_data.dict()
    result = await db.leases.insert_one(lease_dict)
    created_lease = await db.leases.find_one({"_id": result.inserted_id})
    return serialize_doc(created_lease)

# Finance API
@app.get("/api/finance", response_model=List[Dict])
async def get_finance_records(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    category: Optional[str] = None
):
    """Get finance records"""
    query = {}
    if type:
        query["type"] = type
    if category:
        query["category"] = category
    
    records = await db.finance_records.find(query).skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(record) for record in records]

@app.post("/api/finance", response_model=Dict)
async def create_finance_record(record_data: FinanceRecordBase, user=Depends(get_current_user)):
    """Create a new finance record"""
    record_dict = record_data.dict()
    result = await db.finance_records.insert_one(record_dict)
    created_record = await db.finance_records.find_one({"_id": result.inserted_id})
    return serialize_doc(created_record)

# Health check
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with Inventory
    inventory = relationship("Inventory", back_populates="warehouse", cascade="all, delete-orphan")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    order_no = Column(String, index=True)
    order_date = Column(String)
    customer_name = Column(String)
    correspondence_address = Column(String)
    city = Column(String)
    state = Column(String)
    shipping_address = Column(String)
    item_name = Column(String)
    hsn_code = Column(String)
    packing = Column(String)
    quantity = Column(String)
    total_quantity = Column(String)
    tax_percent = Column(String)
    tax_amt = Column(String)
    rate = Column(String)
    amount = Column(String)
    net_payable = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with Warehouse
    warehouse = relationship("Warehouse", back_populates="inventory") 
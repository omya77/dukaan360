import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
import sys
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from models import Base

# For development and standalone hosting, use absolute path to dukaan.db so working directory doesn't break it
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "dukaan.db").replace("\\", "/")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False, "timeout": 30} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

# Enable WAL (Write-Ahead Logging) mode for SQLite concurrency and crash safety
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        try:
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.execute("PRAGMA busy_timeout=5000")
        except Exception:
            pass
        finally:
            cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

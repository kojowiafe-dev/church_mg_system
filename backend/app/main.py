from fastapi import FastAPI
import database
from routers import users, authentication, event, sermon, members
from data import members as members_data, events
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


load_dotenv()
EMAIL_HOST = os.getenv("SMTP_HOST")
EMAIL_PORT = os.getenv("SMTP_PORT")
EMAIL_USERNAME = os.getenv("SMTP_USERNAME")
EMAIL_PASSWORD = os.getenv("SMTP_PASSWORD")

app = FastAPI()


app.include_router(authentication.router)
# app.include_router(admin.router)
# app.include_router(member.router)
# app.include_router(pastor.router)
app.include_router(users.router)
app.include_router(event.router)
app.include_router(sermon.router)
app.include_router(members.router)

# ------ api data ------- #
app.include_router(members_data.router)
app.include_router(events.router)



app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],
    allow_origins=["http://10.107.24.156:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()
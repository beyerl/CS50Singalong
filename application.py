import os
import re
from flask import Flask, jsonify, render_template, request

# Configure application
app = Flask(__name__)

@app.route("/")
def index():
    """Render page frame"""
    return render_template("index.html")

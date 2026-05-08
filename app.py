from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET'])
def index():
    print("HERE")
    return jsonify({"body": "Hello"})

@app.route("/register", methods=["POST"])
def register():
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    confirmedPassword = reqData['confirmedPassword']
    print(username, password, confirmedPassword)
    return("True")

@app.route("/login", methods=['POST'])
def login():
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    print(username, password)
    return("True")

app.run(host='0.0.0.0', port=8429, debug=True)
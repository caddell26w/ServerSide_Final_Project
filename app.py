from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connected backend to the tsx
@app.route("/", methods=['GET'])
def index():
    print("HERE")
    return jsonify({"body": "Hello"})

# Grab user registration information for use
@app.route("/register", methods=["POST"])
def register():
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    confirmedPassword = reqData['confirmedPassword']

    # Passwords must be strings ensure we compare values
    if str(password).strip() == str(confirmedPassword).strip():
        return jsonify({"body": "true"})
    else:
        return jsonify({"body": "false"})

# Grab user login information to confirm with database
@app.route("/login", methods=['POST'])
def login():
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    return jsonify({"body": "true"})

app.run(host='0.0.0.0', port=8429, debug=True)
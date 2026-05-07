from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connected backend to the tsx
@app.route("/", methods=['GET'])
def index():
    print("HERE")
    return jsonify({"body": "Hello"})

app.run(host='0.0.0.0', port=8429, debug=True)
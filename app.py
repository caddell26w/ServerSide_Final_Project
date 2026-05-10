from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import date
import redis
import uuid
import json

app = Flask(__name__)
CORS(app)

# R_Server = redis.StrictRedis()
# try:
#     R_Server.ping()
# except:
#     print("REDIS: Not Running -- No Streams Available")
#     R_Server = None

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

    # IF Verified
    # session_id = str(uuid.uuid4())
    # user_id = 1
    # token = {"session_id": session_id, "user_id": user_id}

    # R_Server.set(
    #     f"session:{session_id}",
    #     json.dumps(token)
    # )
    return("True")

@app.route("/changeWorkout", methods=['POST'])
def changeWorkout():
    req = request.get_json()
    reqData = req['data']
    weeklyPlan = reqData['weeklyPlan']
    sundayWorkout = weeklyPlan[0]
    mondayWorkout = weeklyPlan[1]
    tuesdayWorkout = weeklyPlan[2]
    wednesdayWorkout = weeklyPlan[3]
    thursdayWorkout = weeklyPlan[4]
    fridayWorkout = weeklyPlan[5]
    saturdayWorkout = weeklyPlan[6]
    return("True")

@app.route("/getDailyWorkout", methods=['GET'])
def getDailyWorkout():
    currentDate = date.today()
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    day = days[currentDate.weekday()]
    dayWorkout = 'Hello World'
    return jsonify({'body' : {'day' : f'{day}', 'workout' : f'{dayWorkout}'}})

@app.route("/accountSettings", methods=['GET', 'PUT'])
def accountSettings():
    if request.method == 'GET':
        user = 'apple'
        profilePicture = 'default_profile.png'
        goals = ["game", "sport"]
        friendsList = ["place", "read"]
        return jsonify({'body' : {'user' : f'{user}', 'profilePicture' : f'{profilePicture}', 'goals' : f'{goals}', 'friendsList' : f'{friendsList}'}})
    elif request.method == 'PUT':
        return("True")



app.run(host='0.0.0.0', port=8429, debug=True)
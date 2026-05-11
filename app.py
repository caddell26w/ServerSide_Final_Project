from flask import Flask, jsonify, request, make_response, Response
from flask_cors import CORS
from datetime import date
import database
import redis
import uuid
import json

app = Flask(__name__)
app.secret_key = 'supersecret'
CORS(app)
database.database_init()

R_Server = redis.StrictRedis()
try:
     R_Server.ping()
except:
     print("REDIS: Not Running -- No Streams Available")
     R_Server = None

"""
Parameter: userid
Output: a true or false that dictates whether we move on
"""
def check_session(userid) -> bool:
    pass

"""
Parameter: userid to save
Output: the cookie we send to the browser
"""
def create_session(user_id) -> Response:
    session_id = str(uuid.uuid4())
    token = {"session_id": session_id, "user_id": user_id}

    R_Server.set(
        f"session:{session_id}",
        json.dumps(token),
        ex=3600
    )
    resp = make_response()
    resp.set_cookie("session_id",session_id, max_age=3600)
    # ex and max_age = expires after an hour

    return resp

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

    usernameAvailability = database.username_check(username)
    print(usernameAvailability)
    if usernameAvailability == True: #Username Available
        # HERE
        # database.user_register(username, password)
        # Create Token
        user_id = 1 # PLACEHOLDER
        resp = create_session(user_id)

        resp.set_data("True")

        print("\nREGISTER SUCCESSFUL\n")
        return resp
    else:
        return("False")

@app.route("/login", methods=['POST'])
def login():
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    print(username, password)

    loginStatus = database.check_login(username, password)
    if loginStatus == True: #Successful Login
        print("SUCCESS")
        # IF verified
        user_id = 1 # PLACEHOLDER
        resp = create_session(user_id)

        resp.set_data("True")

        print("\nLOGIN SUCCESSFUL\n")
        return resp
    else:
        return("False")

@app.route("/changeWorkout", methods=['POST'])
def changeWorkout():
    req = request.get_json()
    reqData = req['data']
    weeklyPlan = reqData['weeklyPlan'] 
    # Verify User via Redis System
    userid = 1 #****PLACE HOLDER****
    database.update_workoutPlan(weeklyPlan[0], weeklyPlan[1], weeklyPlan[2], weeklyPlan[3], weeklyPlan[4], weeklyPlan[5], weeklyPlan[6], userid)
    return("True")

@app.route("/getDailyWorkout", methods=['GET'])
def getDailyWorkout():
    currentDate = date.today()
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    day = days[currentDate.weekday()]
    # Verify User via Redis System
    userid = 1 #****PLACE HOLDER****
    dayWorkout = database.get_workoutPlan(userid).get(f'{day.lower()}Workout')
    return jsonify({'body' : {'day' : f'{day}', 'workout' : f'{dayWorkout}'}})

@app.route("/accountSettings", methods=['GET', 'PUT'])
def accountSettings():
    if request.method == 'GET':
        #Verify User via Redis System
        userid = 1 #****PLACE HOLDER****
        user = database.get_username(userid)
        accountInfo = database.get_accountInfo(userid)
        print(accountInfo)
        profilePicture = accountInfo.get('profilePicture')
        goals = (accountInfo or {}).get('goals')
        friendsList = (accountInfo or {}).get('friendsList')
        return jsonify({'body' : {'user' : f'{user}', 'profilePicture' : f'{profilePicture}', 'goals' : f'{goals}', 'friendsList' : f'{friendsList}'}})
    elif request.method == 'PUT':
        return("True")



app.run(host='0.0.0.0', port=8429, debug=True)
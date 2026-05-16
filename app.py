from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from datetime import date
import database
import redis
import uuid
import time
import json

app = Flask(__name__)
app.secret_key = 'supersecret'
CORS(app, supports_credentials='true', origins=['http://localhost:8081', 'https://localhost', 'https://localhost:443'])
database.database_init()

R_Server = redis.StrictRedis()
try:
    R_Server.ping()
except:
    print("REDIS: Not Running -- No Streams Available")
    R_Server = None
R_Server.flushall()

@app.route("/", methods=['GET'])
def index():
    return jsonify({"body": "Hello"})

@app.route("/getUser", methods=['GET'])
def getUser():
    time.sleep(0.5)
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    user = database.get_username(user_id)

    return jsonify({'status' : 'SUCCESS', 'body' : {'user' : f'{user}'}})

@app.route("/register", methods=["POST", 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    confirmedPassword = reqData['confirmedPassword']

    usernameAvailability = database.username_check(username)
    if usernameAvailability == True: #Username Available
        database.user_register(username, password)
        # Create Token
        session_id = str(uuid.uuid4())
        user_id = database.get_userid(username)
        token = {"session_id": session_id, "user_id": user_id}

        R_Server.set(
            f"session:{session_id}",
            json.dumps(token)
        )

        res = make_response(jsonify({'message': 'Success'}))
        res.set_cookie('session_id', session_id, samesite='None', secure=True)
        return(res)
    return jsonify({'status' : 'SUCCESS', 'body': ''})

@app.route("/login", methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']

    loginStatus = database.check_login(username, password)
    if loginStatus == True: #Successful Login
        # IF Verified
        session_id = str(uuid.uuid4())
        user_id = database.get_userid(username)
        token = {"session_id": session_id, "user_id": user_id}

        R_Server.set(
            f"session:{session_id}",
            json.dumps(token)
        )

        res = make_response(jsonify({'message': 'Success'}))
        res.set_cookie('session_id', session_id, samesite='None', secure=True)
        return(res)
    else:
        print("Incorrect Password!")

@app.route("/changeWorkout", methods=['POST'])
def changeWorkout():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id

    req = request.get_json()
    reqData = req['data']
    weeklyPlan = reqData['weeklyPlan'] 
    database.update_workoutPlan(weeklyPlan[0], weeklyPlan[1], weeklyPlan[2], weeklyPlan[3], weeklyPlan[4], weeklyPlan[5], weeklyPlan[6], user_id)
    res = make_response(jsonify({'status' : 'SUCCESS', 'body': ''}))
    return res

@app.route("/getDailyWorkout", methods=['GET'])
def getDailyWorkout():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id

    currentDate = date.today()
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    day = days[currentDate.weekday()]
   
    dayWorkout = database.get_workoutPlan(user_id).get(f'{day.lower()}Workout')
    return jsonify({'status' : 'SUCCESS', 'body' : {'day' : f'{day}', 'workout' : f'{dayWorkout}'}})

@app.route("/accountSettings", methods=['GET', 'PUT'])
def accountSettings():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id

    # uses database to send client the info to be displayed
    if request.method == 'GET':
        user = database.get_username(user_id)
        accountInfo = database.get_accountInfo(user_id)
        profilePicture = accountInfo.get('profilePicture')
        goals = (accountInfo or {}).get('goals')
        friendsList = (accountInfo or {}).get('friendsList')
        if friendsList == None:
            friendsList = []
        return jsonify({'status' : 'SUCCESS', 'body' : {'user' : f'{user}', 'profilePicture' : f'{profilePicture}', 'goals' : f'{goals}', 'friendsList' : f'{friendsList}'}})
    elif request.method == 'PUT':
        return jsonify({'status' : 'SUCCESS', 'body': ''})
    
@app.route("/activeFriends", methods=['GET'])
def activeFriends():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    friendsList = database.get_friendsList(user_id)
    friendsList = ['admin']
    if friendsList == None:
        return (jsonify({'status': 'SUCCESS', 'body': {'activeFriendsList' : []}}))

    usersList = database.get_users()

    activeFriendsList = []
    
    for key in R_Server.scan_iter("session:*"):
        session_user = database.get_username(json.loads(R_Server.get(key).decode('utf-8'))['user_id'])
        if session_user in friendsList:
            activeFriendsList.append(session_user)
    return(jsonify({'status': 'SUCCESS', 'body' : {'activeFriendsList' : activeFriendsList, 'usersList' : usersList}}))

@app.route("/requestFriend", methods=['PUT'])
def requestFriend():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    req = request.get_json()
    username = req['data']['username']
    print(username)
    database.getRequest(user_id, username)
    return(jsonify({'status': 'SUCCESS', 'body':'yay'}))


@app.route("/delete", methods=['DELETE'])
def deleteAccount():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    req = request.get_json()
    reqdata = req['data']
    userName = reqdata['username']
    reqId = database.get_userid(userName)

    if reqId == user_id:

        database.delete_user(user_id)
        if token:
            res = make_response(jsonify({'message': 'success'}))
            res.delete_cookie('session_id')
            return(res)
        
    return jsonify({'status' : 'error', 'body': 'no_cookie'})

"""
Input: token from the cookie
Output: user_id according to cookie
Purpose: get the user_id for verification according to the page we're on
"""
def getUserid(token:str):
    if not token:
        return jsonify({'status' : 'ERROR', 'body' : 'No Active Session'})
    stored_ids = R_Server.get(f"session:{token}")
    if stored_ids is None:
        return jsonify({'status' : 'ERROR', 'body' : 'Current User Not Found'})
    
    ids = json.loads(stored_ids)
    user_id = ids["user_id"]
    return user_id

app.run(host='0.0.0.0', port=8429, debug=True)
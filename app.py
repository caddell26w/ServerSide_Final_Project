from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from datetime import date
import database
import redis
import uuid
import json
import os
from werkzeug.utils import secure_filename

# Connect Flask app, enable Cross-Origin Resource Sharing, and Initialize the database
app = Flask(__name__)
app.secret_key = 'supersecret'
CORS(app, supports_credentials=True, origins=['https://localhost:8081', 'https://localhost', 'https://localhost:443', 'https://localhost:8429'])
database.database_init()

# Initialize Redis Server
R_Server = redis.StrictRedis()
try:
    R_Server.ping()
except:
    print("REDIS: Not Running -- No Streams Available")
    R_Server = None
R_Server.flushall()

# Test Route
@app.route("/", methods=['GET'])
def index():
    return jsonify({"body": "Hello World"})

# Route that returns the user based of the user_id stored in cookies
@app.route("/getUser", methods=['GET'])
def getUser():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    user = database.get_username(user_id)

    return jsonify({'status' : 'SUCCESS', 'body' : {'user' : f'{user}'}})

# Route that registers users on the website
@app.route("/register", methods=["POST", 'OPTIONS'])
def register():
    # Ensures CORS gets a status ok, 200
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    req = request.get_json()
    reqData = req['data']
    username = reqData['username']
    password = reqData['password']
    confirmedPassword = reqData['confirmedPassword']
    if password != confirmedPassword:
        return jsonify({'status' : 'ERROR', 'body' : 'Passwords do not match'})

    usernameAvailability = database.username_check(username)
    if usernameAvailability == True: #Username Available
        database.user_register(username, password)
        # Create Token
        session_id = str(uuid.uuid4())
        user_id = database.get_userid(username)
        token = {"session_id": session_id, "user_id": user_id}

        # Connects Redis server to store session and user ids
        R_Server.set(
            f"session:{session_id}",
            json.dumps(token)
        )

        res = make_response(jsonify({'message': 'Success'}))
        res.set_cookie('session_id', session_id,  samesite='None', secure=True)
        return(res)
    return jsonify({'status' : 'SUCCESS', 'body': ''})

# Route to verify and login users on the website
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
        session_id = str(uuid.uuid4())
        user_id = database.get_userid(username)
        token = {"session_id": session_id, "user_id": user_id}

        R_Server.set(
            f"session:{session_id}",
            json.dumps(token)
        )

        res = make_response(jsonify({'message': 'Success'}))
        res.set_cookie('session_id', session_id,  samesite='None', secure=True)
        return(res)
    return jsonify({'status' : 'ERROR', 'body' : 'Invalid Password. Try Again.'})

# Route that updates the weekly workout plan from uncleaned user input
@app.route("/changeWorkout", methods=['POST'])
def changeWorkout():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int: # Returns Error Message if user_id does not exist
        return user_id 

    req = request.get_json()
    reqData = req['data']
    weeklyPlan = reqData['weeklyPlan'] 
    database.update_workoutPlan(weeklyPlan[0], weeklyPlan[1], weeklyPlan[2], weeklyPlan[3], weeklyPlan[4], weeklyPlan[5], weeklyPlan[6], user_id)
    res = make_response(jsonify({'status' : 'SUCCESS', 'body': ''}))
    return res

# Route that gets the current day and returns the user's workout for that day
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

# Route that gathers all account specifics on a user
@app.route("/accountSettings", methods=['GET', 'PUT'])
def accountSettings():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id

    if request.method == 'GET':
        user = database.get_username(user_id)
        accountInfo = database.get_accountInfo(user_id)
        profilePicture = accountInfo.get('profilePicture')
        goals = (accountInfo or {}).get('goals')
        friendsList = (accountInfo or {}).get('friendsList')
        if friendsList == None:
            friendsList = []
        print(goals)
        return jsonify({'status' : 'SUCCESS', 'body' : {'user' : f'{user}', 'profilePicture' : f'{profilePicture}', 'goals' : f'{goals}', 'friendsList' : f'{friendsList}'}})
    elif request.method == 'PUT':
        return jsonify({'status' : 'SUCCESS', 'body': ''})

# Route that gets all active friends and users on the website
@app.route("/activeFriends", methods=['GET'])
def activeFriends():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    friendsList = database.get_friendsList(user_id)

    usersList = database.get_users()

    if friendsList == None:
        return (jsonify({'status': 'SUCCESS', 'body': {'activeFriendsList' : [], 'usersList' : usersList}}))


    activeFriendsList = []
    
    for key in R_Server.scan_iter("session:*"):
        session_user = database.get_username(json.loads(R_Server.get(key).decode('utf-8'))['user_id'])
        if session_user in friendsList:
            activeFriendsList.append(session_user)
    return(jsonify({'status': 'SUCCESS', 'body' : {'activeFriendsList' : activeFriendsList, 'usersList' : usersList}}))

# Route that handles user's friend requests
@app.route("/request", methods=['GET','POST'])
def handleRequest():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    if request.method == 'GET':
        friendRequests = database.get_friendRequests(user_id)
        if friendRequests == []:
            friendRequests = [{"requesterUsername" : "", "requesterId" : ""}]
        return jsonify({'status' : 'SUCCESS', 'body': {'friendRequests' : friendRequests}})
    elif request.method == 'POST':
        req = request.get_json()
        friendUsername = str(req['friendUsername'])

        # prevent from requesting the same person twice
        # prevent from friending the same person twice
        checkRequests = database.get_friendRequests(database.get_userid(friendUsername)) 
        friendsIDs = database.get_friendsList(user_id)
        if str(user_id) in checkRequests or database.get_userid(friendUsername) in friendsIDs:
            return jsonify({'status' : 'SUCCESS', 'body': ''})
        
        database.add_friendRequest(user_id, friendUsername)
        return jsonify({'status' : 'SUCCESS', 'body': ''})
    else: 
        return jsonify({'status' : 'ERROR', 'body': ''})

# Route that handles the responses to user's friend requests
@app.route("/respondRequest", methods=['POST', 'OPTIONS'])
def respondRequest():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id

    req = request.get_json()
    requesterId = req['requesterId']
    response = req['response']

    # prevent from friending the same person twice
    friendsIDs = database.get_friendsList(user_id) 
    if requesterId in friendsIDs:
        return jsonify({'status' : 'SUCCESS', 'body': ''})
    
    database.respond_friendRequest(user_id, requesterId, response)
    return jsonify({'status' : 'SUCCESS', 'body': ''})


    #param: token(str) The token assigned to the user at register/login

@app.route("/addGoal", methods=['GET','POST'])
def addGoal():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    goalList = database.get_goals(user_id) # returns string of the list
    addNum = (request.get_json())['data']['addNum'] # 2 = add, 3 = remove
    print(f"\nGOALS:{goalList}")
    try:
        editGoalList = json.loads(goalList[0][0]) # grabs the list inside the string, then turn it to a python list
    except:
        editGoalList = []
        print("no need for json load")
        pass
    if request.method == 'GET':
        return (jsonify({'status': 'SUCCESS', 'body':editGoalList}))
    
    if addNum == "2":
        editGoalList.append((request.get_json())['data']['goal']) # add user goal to list
        database.update_accountInfo_goals(json.dumps(editGoalList), user_id)
    elif addNum == "3":
        if (request.get_json())['data']['goal'] in editGoalList:
            editGoalList.remove((request.get_json())['data']['goal'])
            database.update_accountInfo_goals(json.dumps(editGoalList), user_id)
    print(f"EDIT GOAL:{editGoalList}")
    return (jsonify({'status': 'SUCCESS', 'body':editGoalList}))

@app.route("/changePassword", methods=['POST'])
def changePassword():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    oldPassword = (request.get_json())['data']['oldPassword']
    newPassword = (request.get_json())['data']['newPassword']
    updateStatus = database.update_password(oldPassword,newPassword,user_id)
    successStatus = 'SUCCESS' if updateStatus == True else 'ERROR'

    return (jsonify({'status':successStatus, 'body': str(updateStatus)}))

@app.route("/sendImage", methods=['POST'])
def sendImage():
    token = request.cookies.get('session_id')
    user_id = getUserid(token)
    if type(user_id) != int:
        return user_id
    
    # to ensure the user actually sent a file
    if "file" not in request.files:
        return jsonify({'status': 'ERROR', 'body': 'No file part'})

    fileStorage = request.files["file"] # the storage
    folderUpload = os.path.join(os.path.dirname(__file__), "static/users") # path to the folder

    if fileStorage.filename == "": # ensures the user didnt just send a empty file
        return jsonify({'status': 'ERROR', 'body': 'No selected file'})
    os.makedirs(folderUpload, exist_ok=True) # creates a directory if it doesn't exist. For our case, it should exist
    file = secure_filename(fileStorage.filename) 
    final = f"{uuid.uuid4()}_{file}" # make file unique and secure
    save_path = os.path.join(folderUpload, final)
    fileStorage.save(save_path) # save it to the local folder
    database.add_general_file(user_id,final) # update sqlite3 with the filename

    return jsonify({'status': 'SUCCESS', 'body': save_path})


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

def getUserid(token:str):
    if not token:
        return jsonify({'status' : 'ERROR', 'body' : 'No Active Session'})
    stored_ids = R_Server.get(f"session:{token}")
    if stored_ids is None:
        return jsonify({'status' : 'ERROR', 'body' : 'Current User Not Found'})
    
    ids = json.loads(stored_ids)
    user_id = ids["user_id"]
    return user_id

app.run(host='0.0.0.0', port=8429, ssl_context=('localhost.pem', 'localhost-key.pem'), debug=True)
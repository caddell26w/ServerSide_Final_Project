import sqlite3, string, random, hashlib,os

def database_init():
    __db = sqlite3.connect("fitness-app.db")
    table_accounts = '''CREATE TABLE IF NOT EXISTS accounts
                        (username TEXT NOT NULL,
                        password TEXT NOT NULL,
                        salt TEXT NOT NULL)'''
    table_accountInfo = '''CREATE TABLE IF NOT EXISTS accountInfo
                        (userid INT NOT NULL,
                        profilePicture TEXT NOT NULL DEFAULT 'default_profile.png',
                        goals TEXT,
                        friendsList TEXT)'''
    table_workoutPlan = '''CREATE TABLE IF NOT EXISTS workoutPlan
                        (userid INT NOT NULL,
                        sundayWorkout TEXT DEFAULT 'sunWorkout',
                        mondayWorkout TEXT DEFAULT 'monWorkout',
                        tuesdayWorkout TEXT DEFAULT 'tueWorkout',
                        wednesdayWorkout TEXT DEFAULT 'wedWorkout',
                        thursdayWorkout TEXT DEFAULT 'thurWorkout',
                        fridayWorkout TEXT DEFAULT 'friWorkout',
                        saturdayWorkout TEXT DEFAULT 'satWorkout')'''
    table_friendRequests = '''CREATE TABLE IF NOT EXISTS friendRequests
                        (userid INT NOT NULL,
                        requesterid INT NOT NULL,
                        status TEXT NOT NULL)'''
    __db.execute(table_accounts)
    __db.execute(table_accountInfo)
    __db.execute(table_workoutPlan)
    __db.execute(table_friendRequests)
    __db.commit()

def user_register( username: str, password: str):
    def generate_salt(length: int) -> str:
        characters = string.ascii_letters + string.digits + string.punctuation
        salt = ''.join(random.choice(characters) for i in range(length))
        return salt
    salt = os.urandom(10).hex()
    salted_password = salt.encode('utf-8') + password.encode('utf-8')
    hash_object = hashlib.sha256(salted_password)
    hashed_password = hash_object.hexdigest()

    table_insert = '''INSERT INTO accounts
                      (username, password, salt) VALUES
                      (?, ?, ?)'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(table_insert, (username, hashed_password, salt))
    __db.commit()
    table_query = '''SELECT rowid from accounts
                     WHERE username = ?'''
    cursor = __db.cursor()
    for user in cursor.execute(table_query, (username,)):
        userid = user[0]
    create_accountInfo = '''INSERT INTO accountInfo
                            (userid) VALUES
                            (?)'''
    create_workoutPlan = '''INSERT INTO workoutPlan
                            (userid) VALUES
                            (?)'''
    __db.execute(create_accountInfo, (userid,))
    __db.execute(create_workoutPlan, (userid,))
    __db.commit()

def username_check(username: str) -> bool:
    table_query = '''SELECT * from accounts
                        WHERE username = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    cursor.execute(table_query, (username,))
    row = cursor.fetchall()
    if len(row) > 0:
        return False # Username Exists
    else:
        return True

def check_login(username: str, password: str) -> bool:
    table_query = '''SELECT * from accounts
                     WHERE username = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for user in cursor.execute(table_query, (username,)):
        stored_hashed_password = user[1]
        salt = user[2]
        salted_password = salt.encode('utf-8') + password.encode('utf-8')
        hash_object = hashlib.sha256(salted_password)
        new_hashed_password = hash_object.hexdigest()
        if stored_hashed_password == new_hashed_password:
            return True
        else:
            return False
    return False

def get_userid(username: str) -> int:
    table_query = '''SELECT rowid from accounts
                     WHERE username = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (username,)):
        rowid = row[0]
        return rowid
    
def get_friendRequests(userid: int) -> list:
    table_query = '''SELECT requesterid 
                     FROM friendRequests 
                     WHERE userid = ? 
                     AND status = 'pending' '''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute("PRAGMA journal_mode=WAL")
    cursor = __db.cursor()
    friendRequests = []
    cursor.execute(table_query, (userid,))
    rows = cursor.fetchall()
    for row in rows:
        friendRequests.append({
        'requesterId': row[0],
        'requesterUsername': get_username(row[0])
        })
    return friendRequests

def respond_friendRequest(user_id: int, requesterId: int, response: str):
    update_request = '''UPDATE friendRequests
                        SET status = ?
                        WHERE userid = ? AND requesterid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_request, (response, user_id, requesterId))
    if response == 'ACCEPT':
        cursor = __db.cursor()
        friendsList_query = '''SELECT friendsList
                               FROM accountInfo
                               WHERE userid = ?'''
        friendsList = []
        for row in cursor.execute(friendsList_query, (user_id,)):
            friendsList = row[0]
        if friendsList == None:
            friendsList = []
        friendsList.append(get_username(requesterId))
        update_accountInfo_friendsList(f'{friendsList}', user_id)
        friendsList = []
        for row in cursor.execute(friendsList_query, (requesterId,)):
            friendsList = row[0]
        if friendsList == None:
            friendsList = []
        friendsList.append(get_username(user_id))
        update_accountInfo_friendsList(f'{friendsList}', requesterId)
    __db.commit()

def get_friendsList(userid: int) -> list:
    table_query = '''SELECT friendsList 
                     FROM accountInfo 
                     WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute("PRAGMA journal_mode=WAL")
    cursor = __db.cursor()
    friendsList = []
    cursor.execute(table_query, (userid,))
    rows = cursor.fetchall()
    for row in rows:
        friendsList = row[0]
    return friendsList

def get_username(userid: int) -> str:
    table_query = '''SELECT username from accounts
                     WHERE rowid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        username = row[0]
        return username

def get_users() -> str:
    table_query = '''SELECT username from accounts'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute("PRAGMA journal_mode=WAL")
    cursor = __db.cursor()
    userList = []
    cursor.execute(table_query)
    rows = cursor.fetchall()
    for row in rows:
        userList.append(row[0])
    return userList

def add_friendRequest(user_id: int, friendUsername: str):
    friend_id = get_userid(friendUsername)
    insert_request = '''INSERT INTO friendRequests
                        (userid, requesterid, status) VALUES
                        (?, ?, 'pending')'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(insert_request, (friend_id, user_id))
    __db.commit()

def update_password(currentPassword: str, newPassword: str, userid: int) -> bool:
    table_query = '''SELECT * from accounts
                     WHERE rowid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        salt = row[2]
        salted_current_password = salt.encode('utf-8') + currentPassword.encode('utf-8')
        current_hash_object = hashlib.sha256(salted_current_password)
        current_hashed_password = current_hash_object.hexdigest()
        if (current_hashed_password != row[1]):
            return False
        salted_new_password = salt.encode('utf-8') + newPassword.encode('utf-8')
        new_hash_object = hashlib.sha256(salted_new_password)
        new_hashed_password = new_hash_object.hexdigest()
    update_account = '''UPDATE accounts
                     SET password = ?
                     WHERE rowid = ?'''
    __db.execute(update_account, (new_hashed_password, userid))
    __db.commit()
    return True

def update_workoutPlan(sundayWorkout: str, mondayWorkout: str, tuesdayWorkout: str, wednesdayWorkout: str, thursdayWorkout: str, fridayWorkout: str, saturdayWorkout: str, userid: int):
    update_workoutPlan = '''UPDATE workoutPlan
                            SET sundayWorkout = ?,
                            mondayWorkout = ?,
                            tuesdayWorkout = ?,
                            wednesdayWorkout = ?,
                            thursdayWorkout = ?,
                            fridayWorkout = ?,
                            saturdayWorkout = ?
                            WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_workoutPlan, (sundayWorkout, mondayWorkout, tuesdayWorkout, wednesdayWorkout, thursdayWorkout, fridayWorkout, saturdayWorkout, userid))
    __db.commit()

def get_goals(userid: int) -> str:
    getGoal = '''SELECT goals from accountInfo where userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()

    goal = cursor.execute(getGoal, (userid,)).fetchall()
    return goal

def update_accountInfo_goals(goals: str, userid: int):
    update_accountInfo = '''UPDATE accountInfo
                            SET goals = ?
                            WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_accountInfo, (goals, userid))
    __db.commit()

def update_accountInfo_friendsList(friendsList: list, userid: int):
    update_accountInfo = '''UPDATE accountInfo
                            SET friendsList = ?
                            WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_accountInfo, (friendsList, userid))
    __db.commit()

def get_accountInfo(userid: int) -> dict:
    table_query = '''SELECT * from accountInfo
                     WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        accountInfo = {'userid': row[0], 'profilePicture': row[1], 'goals': row[2], 'friendsList': row[3]}
        return accountInfo

def get_workoutPlan(userid: int) -> dict:
    table_query = '''SELECT * from workoutPlan
                     WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        workoutPlan = {'userid': row[0], 'sundayWorkout': row[1], 'mondayWorkout': row[2], 'tuesdayWorkout': row[3], 'wednesdayWorkout': row[4], 'thursdayWorkout': row[5], 'fridayWorkout': row[6], 'saturdayWorkout': row[7]}
        return workoutPlan

def add_general_file(userid: int, fileExtension:str):
    update_accountInfo = '''UPDATE accountInfo
                            SET profilePicture = ?
                            WHERE userid = ?'''
    username = get_username(userid)
    filePath = f'{fileExtension}'
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_accountInfo, (filePath, userid))
    __db.commit()
    
def delete_user(userid: int):
    delete_account = '''DELETE FROM accounts
                        WHERE rowid = ?'''
    delete_accountInfo = '''DELETE FROM accountInfo
                            WHERE userid = ?'''
    delete_workoutPlan = '''DELETE FROM workoutPlan
                            WHERE userid = ?'''
    delete_userFriends = '''DELETE FROM friends
                            WHERE userid = ?'''
    delete_Friends = '''DELETE FROM friends
                            WHERE friendid = ?'''
    delete_userRequest = '''DELETE FROM friendRequests
                            WHERE userid = ?'''
    delete_friendRequest = '''DELETE FROM friendRequests
                            WHERE requesterid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(delete_account, (userid,))
    __db.execute(delete_accountInfo, (userid,))
    __db.execute(delete_workoutPlan, (userid,))
    __db.execute(delete_userFriends, (userid,))
    __db.execute(delete_Friends, (userid,))
    __db.execute(delete_userRequest, (userid,))
    __db.execute(delete_friendRequest, (userid,))
    __db.commit()

if __name__ == '__main__':
    database_init()
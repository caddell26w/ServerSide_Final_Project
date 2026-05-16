import sqlite3, string, random, hashlib

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
    __db.execute(table_accounts)
    __db.execute(table_accountInfo)
    __db.execute(table_workoutPlan)
    __db.commit()

"""
Input: password and username
Purpose: store user's info securely in the database
"""
def user_register( username: str, password: str):
    def generate_salt(length: int) -> str:
        characters = string.ascii_letters + string.digits + string.punctuation
        salt = ''.join(random.choice(characters) for i in range(length))
        return salt
    salt = generate_salt(10)
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

"""
Input: the username the user entered into the register
Purpose: Ensure unique username to prevent confusion
"""
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

"""
Input: what the user entered for login and password
Purpose: Ensure the user had the correct login and password to prevent identity theft
"""
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

"""
Input: username
Purpose: Get the id associated with the username
"""
def get_userid(username: str) -> int:
    table_query = '''SELECT rowid from accounts
                     WHERE username = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (username,)):
        rowid = row[0]
        return rowid

"""
Input: userid
Purpose: Get the username associated with the id
"""
def get_username(userid: int) -> str:
    table_query = '''SELECT username from accounts
                     WHERE rowid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        username = row[0]
        return username

"""
Input: passwords and userid
Output: whether it worked or not
Purpose: Ensure security by ensuring hashing/salting and verification
"""
def get_users() -> str:
    table_query = '''SELECT username from accounts'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    userList = []
    for row in cursor.execute(table_query):
        userList.append(row[0])
    return userList


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
                     SET password = ?,
                     WHERE rowid = ?'''
    __db.execute(update_account, (password, userid))
    __db.commit()
    return True

"""
Input: workout plan according to user input
Purpose: Update database of the user's workout plan according to userid
"""
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

def update_accountInfo_goals(goals: str, userid: int):
    update_accountInfo = '''UPDATE accountInfo
                            SET goals = ?
                            WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(update_accountInfo, (goals, userid))
    __db.commit()

def update_accountInfo_friendsList(friendsList: str, userid: int):
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

def get_friendsList(userid: int) -> str:
    table_query = '''SELECT friendsList from accountInfo
                     WHERE userid = ?'''
    __db = sqlite3.connect("fitness-app.db")
    cursor = __db.cursor()
    for row in cursor.execute(table_query, (userid,)):
        friendsList = row[0]
        return friendsList

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
    filePath = f'{username}_avatar.{fileExtension}'
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
    __db = sqlite3.connect("fitness-app.db")
    __db.execute(delete_account, (userid,))
    __db.execute(delete_accountInfo, (userid,))
    __db.execute(delete_workoutPlan, (userid,))
    __db.commit()

if __name__ == '__main__':
    database_init()
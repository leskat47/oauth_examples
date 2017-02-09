from flask import Flask, render_template, request
# from flask_oauth import OAuth
import os


# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = os.environ["CLIENT_ID"]
GOOGLE_CLIENT_SECRET = os.environ["CLIENT_SECRET"]
SECRET_KEY = 'development key'
DEBUG = True

app = Flask(__name__)
app.debug = DEBUG
app.secret_key = "a_seeeecrit"



@app.route("/")
def index():
    return render_template("index.html")


@app.route("/tokencheck", methods=['POST'])
def tokencheck():
#     user_confirmation_data = self.request.get('data')
    user_confirm = request.form
    # print user_confirm['aud']
    # print type(GOOGLE_CLIENT_ID)
    if user_confirm["aud"] == GOOGLE_CLIENT_ID:
        print "success"
        return "success"
    else:
        return "fail"

    # try:
    #     idinfo = client.verify_id_token(token, CLIENT_ID)
    #     if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
    #         raise crypt.AppIdentityError("Wrong issuer.")
    #     if idinfo['hd'] != APPS_DOMAIN_NAME:
    #         raise crypt.AppIdentityError("Wrong hosted domain.")
    # except crypt.AppIdentityError:
    #     # Invalid token
    #     userid = idinfo['sub']


@app.route("/upload/path", methods=['POST'])
def uploadcheck():
    return "EUREKA!"


def main():
    app.run()


if __name__ == '__main__':
    main()

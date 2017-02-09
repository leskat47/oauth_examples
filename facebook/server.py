from flask import Flask, render_template
# from flask_oauth import OAuth
import os

# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
FB_APP_ID = os.environ["FB_APP_ID"]
DEBUG = True

app = Flask(__name__)
app.debug = DEBUG
app.secret_key = "a_seeeecrit"
# oauth = OAuth()


@app.route("/")
def index():
    app_id = FB_APP_ID
    return render_template("index.html", app_id=app_id)


def main():
    app.run(port=5088)


if __name__ == '__main__':
    main()

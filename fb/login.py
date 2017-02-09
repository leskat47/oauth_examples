import os
import json
client_id = os.environ['FB_APP_ID']
client_secret = os.environ['FB_APP_SECRET']
redirect_uri = 'http://localhost:5088/process_login'
token_url = 'https://graph.facebook.com/oauth/access_token'

from requests_oauthlib import OAuth2Session
from requests_oauthlib.compliance_fixes import facebook_compliance_fix
authorization_base_url = 'https://www.facebook.com/dialog/oauth'
facebook = OAuth2Session(client_id, redirect_uri=redirect_uri)
facebook = facebook_compliance_fix(facebook)


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask import Flask, render_template, request, jsonify, session, abort, redirect, url_for
from jinja2 import Undefined

app = Flask(__name__)


JINJA2_ENVIRONMENT_OPTIONS = {'undefined': Undefined}


def save_created_state(state):
    pass
def is_valid_state(state):
    return True

# Basic Routes *********************************

@app.route('/test/<user>')
def index_page(user):
    """Show index page."""

    return render_template("base.html",
                            user=user)

@app.route('/login')
def login_page():
    """Show index page."""

    authorization_url, state = facebook.authorization_url(authorization_base_url)
    print 'Please go here and authorize,', authorization_url

    return redirect(authorization_url, code=302)


@app.route('/process_login')
def process_login():

    error = request.args.get('error', '')
    if error:
        return "Error: " + error
    state = request.args.get('state', '')
    if not is_valid_state(state):
        # Uh-oh, this request wasn't started by us!
        abort(403)
    code = request.args.get('code')

    access_token = facebook.fetch_token(token_url, client_secret=client_secret,
                         authorization_response="http://localhost:5088/process_login?code="+code+"&state="+state)

    r = facebook.get('https://graph.facebook.com/me?')
    user = r.content

    user = json.loads(r.content)["name"]
    url = "/test/" + user
    return redirect(url)


if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5088, debug=True)

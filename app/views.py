"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from .forms import RegisterUser, LoginForm
from .models import UserProfile
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename


###
# Routing for your application.
###

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    '''Accepts user information and saves it to the database'''
    registerUser = RegisterUser()
    loginForm = LoginForm()
    
    if request.method == "POST":
        if registerUser.validate_on_submit():
            photo = registerUser.photo.data
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            name = registerUser.name.data
            email = registerUser.email.data
            location = registerUser.location.data
            biography = registerUser.biography.data
            username = loginForm.username.data
            password = loginForm.password.data
            
            user = UserProfile(username, password,name,email,location,biography,filename)
            db.session.add(user)
            db.session.commit()
            return jsonify({ "message":"Congratulations.... Your file was successfully uploaded",
                    "user":user })
        else:
            return jsonify({"errors": [form_errors(registerUser)]})
        
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('secure_page'))

    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        # change this to actually validate the entire form submission
        # and not just one field
        username = form.username.data
        password = form.password.data
        if username:
            # Get the username and password values from the form.
            user = UserProfile.query.filter_by(username=username).first()

            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.
            if user is not None and check_password_hash(user.password,password):
            # get user id, load into session
                remember_me = False
                if 'remember_me' in request.form:
                    remember_me = True

                login_user(user)
            # remember to flash a message to the user
                flash('Logged in successfully.','success')
                return redirect(url_for("secure_page"))  # they should be redirected to a secure-page route instead
            flash('Incorrect Username or Password','danger')
    return render_template("login.html", form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'danger')
    return redirect(url_for('home'))

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")

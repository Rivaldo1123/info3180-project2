from . import db
import datetime
from werkzeug.security import generate_password_hash


class UserProfile(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(80))
    email = db.Column(db.String(80))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(255))
    photo = db.Column(db.String(80))
    date_joined = db.Column(db.DateTime)
        
    def __init__(self,username,password,name,email,location,biography,photo):
        self.username = username
        self.password = generate_password_hash(password, method= 'pbkdf2:sha256')
        self.name = name
        self.email = email
        self.location = location
        self.biography = biography
        self.photo = photo
        self.date_joined = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

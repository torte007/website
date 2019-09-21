import json 
from flask_mail import Mail, Message
from flask import Flask, render_template, request
app = Flask(__name__)

with open("info.json", "r") as f:
    info = json.load(f)

app.config['SECRET_KEY'] = info['secretKey']
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = info['email']
app.config['MAIL_PASSWORD'] = info['password']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == "GET":
        return render_template("contact.html", form=True)
    else: 
        print(request.form)
        msg = Message('Hello', sender = 'bot.tomasort@gmail.com', recipients = ['tomasvortegar@gmail.com'])
        fname = request.form['firstname']
        lname = request.form['lastname']
        email = request.form['email']
        body = f"{fname} {lname} sent you a message through tomasortega.com\n\n\"{request.form['subject']}\"\n\nReply them at{email}"
        msg.body = body
        mail.send(msg)
        return render_template("contact.html", form=False)

@app.route('/projects')
def projects():
    # We need to read the json file and pass the list to the template
    with open('projects.json', 'r') as f: 
        projects = json.load(f) 
    return render_template("projects.html", projects=projects)

@app.route('/resume')
def resume():
    return render_template("resume.html")

@app.route('/Drumrack')
def drumrack():
    return render_template("drumrack.html")

@app.route("/games")
def games():
    return render_template("game.html")

if __name__ == "__main__":
    app.run(port=5050, debug=True)

import json 
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

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

if __name__ == "__main__":
    app.run(port=5050, debug=True)

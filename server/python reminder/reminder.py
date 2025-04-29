from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

reminders = []

@app.route('/reminders', methods=['GET'])
def get_reminders():
    return jsonify(reminders)

@app.route('/reminders', methods=['POST'])
def add_reminder():
    data = request.get_json()
    reminder = {
        'medicine': data.get('medicine'),
        'time': data.get('time'),
        'note': data.get('note', ''),
        'created_at': datetime.now().isoformat()
    }
    reminders.append(reminder)
    return jsonify(reminder), 201

if __name__ == '__main__':
    app.run(debug=True)
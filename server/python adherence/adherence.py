from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/adherence', methods=['POST'])
def analyze_adherence():
    data = request.get_json()
    taken = data.get("taken", [])
    expected = data.get("expected", [])

    missed = [med for med in expected if med not in taken]
    adherence_rate = (len(taken) / len(expected)) * 100 if expected else 0

    return jsonify({
        "adherence_rate": round(adherence_rate, 2),
        "missed_doses": missed
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
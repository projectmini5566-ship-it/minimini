from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initial Data (normally this would be in a database)
INITIAL_STUDENTS = [
    {
        'id': '1',
        'name': 'Alex Johnson',
        'rollNo': '201',
        'div': 'A',
        'marks': {'em': 85, 'ds': 92, 'dsgt': 78, 'dlca': 88, 'dbms': 70, 'os': 95},
        'nextExamDate': '2026-04-15T09:00:00Z',
    },
    {
        'id': '2',
        'name': 'Sarah Miller',
        'rollNo': '202',
        'div': 'A',
        'marks': {'em': 72, 'ds': 68, 'dsgt': 95, 'dlca': 92, 'dbms': 98, 'os': 65},
        'nextExamDate': '2026-04-16T10:00:00Z',
    },
    {
        'id': '3',
        'name': 'David Chen',
        'rollNo': '203',
        'div': 'B',
        'marks': {'em': 98, 'ds': 96, 'dsgt': 82, 'dlca': 75, 'dbms': 60, 'os': 99},
        'nextExamDate': '2026-04-15T09:00:00Z',
    },
    {
        'id': '4',
        'name': 'Emma Wilson',
        'rollNo': '204',
        'div': 'B',
        'marks': {'em': 88, 'ds': 85, 'dsgt': 88, 'dlca': 85, 'dbms': 88, 'os': 85},
        'nextExamDate': '2026-04-18T11:00:00Z',
    }
]

DEFAULT_SUBJECTS = [
    {'id': 'em', 'label': 'Engineering Maths', 'maxMarks': 100},
    {'id': 'ds', 'label': 'Data Structures', 'maxMarks': 100},
    {'id': 'dsgt', 'label': 'Discrete Structures', 'maxMarks': 100},
    {'id': 'dlca', 'label': 'Digital Logic', 'maxMarks': 100},
    {'id': 'dbms', 'label': 'Database Management', 'maxMarks': 100},
    {'id': 'os', 'label': 'Operating Systems', 'maxMarks': 100},
]

DEFAULT_SETTINGS = {
    'institutionName': 'EduPulse Academy',
    'teacherName': 'Ghadigaonkar Sir',
    'academicYear': '2025-26',
    'facultyUsername': 'ghadigaonkar sir',
    'facultyPassword': '5566',
    'facultyMobile': '9876543210'
}

# In-memory storage (resets on server restart)
data = {
    'students': INITIAL_STUDENTS,
    'subjects': DEFAULT_SUBJECTS,
    'settings': DEFAULT_SETTINGS,
    'tests': []
}

@app.route('/api/students', methods=['GET', 'POST'])
def handle_students():
    if request.method == 'POST':
        data['students'] = request.json
        return jsonify(data['students'])
    return jsonify(data['students'])

@app.route('/api/subjects', methods=['GET', 'POST'])
def handle_subjects():
    if request.method == 'POST':
        data['subjects'] = request.json
        return jsonify(data['subjects'])
    return jsonify(data['subjects'])

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    if request.method == 'POST':
        data['settings'] = request.json
        return jsonify(data['settings'])
    return jsonify(data['settings'])

@app.route('/api/tests', methods=['GET', 'POST'])
def handle_tests():
    if request.method == 'POST':
        data['tests'] = request.json
        return jsonify(data['tests'])
    return jsonify(data['tests'])

@app.route('/api/login', methods=['POST'])
def login():
    credentials = request.json
    username = credentials.get('username')
    password = credentials.get('password')
    
    settings = data['settings']
    is_username_match = username == settings['facultyUsername']
    is_mobile_match = username == settings['facultyMobile']
    is_password_match = password == settings['facultyPassword']
    
    if (is_username_match or is_mobile_match) and is_password_match:
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/clear', methods=['POST'])
def clear_data():
    data['students'] = INITIAL_STUDENTS
    data['subjects'] = DEFAULT_SUBJECTS
    data['settings'] = DEFAULT_SETTINGS
    data['tests'] = []
    return jsonify({'success': True})

if __name__ == '__main__':
    # Use port 5000 as requested, but note that for AI Studio preview
    # you might need to use port 3000.
    app.run(host='0.0.0.0', port=5000, debug=True)

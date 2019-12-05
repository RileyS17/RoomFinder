from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os, socket

# ------------Python script to run a server---------
# Init app
app = Flask(__name__)
base_dir = os.path.abspath(os.path.dirname(__file__))
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'Database/rooms.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init Database
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)

# Room Class/Model
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(10))
    building = db.Column(db.String(20))
    room = db.Column(db.String(10))
    start_t = db.Column(db.Integer)
    end_t = db.Column(db.Integer)

    def __init__(self, day, building, room, start_t, end_t):
        self.day = day
        self.building = building
        self.room =room
        self.start_t = start_t
        self.end_t = end_t

# Room Schema
class RoomSchema(ma.Schema):
    class Meta:
        fields = ('day', 'building', 'room', 'start_t', 'end_t')

# Init schema
room_schema = RoomSchema()
rooms_schema = RoomSchema(many=True)    

# Create a room
@app.route('/room', methods=['POST'])
def add_room():
    day = request.json['day']
    building = request.json['building']
    room = request.json['room']
    start_t = request.json['start_t']
    end_t = request.json['end_t']

    new_room = Room(day, building, room, start_t, end_t)
    db.session.add(new_room)
    db.session.commit()

    return room_schema.jsonify(new_room)

# Get available buildings in the table
@app.route('/buildings', methods=['GET'])
def get_buildings():
    all_rooms = Room.query.with_entities(Room.building).distinct().all()
    result = rooms_schema.dump(all_rooms)
    return jsonify(result)

# Get availble rooms and their assoscated building
@app.route('/buildings/rooms', methods=['GET'])
def get_buildings_rooms():
    all_buildings = Room.query.with_entities(Room.building).distinct().all()
    all_rooms = Room.query.with_entities(Room.building, Room.room).distinct().order_by(Room.building, Room.room).all()
    new_rows = []

    for building in all_buildings:
        rooms = []
        for room in all_rooms:
            if room[0] == building[0]:
                rooms.append(room[1])
        
        new_row = {'building': building[0], 'rooms': rooms}
        new_rows.append(new_row)

    return jsonify(new_rows)

# Get all rooms
@app.route('/rooms', methods=['GET'])
def get_rooms():
    all_rooms = Room.query.all()
    result = rooms_schema.dump(all_rooms)

    return jsonify(result)

# Get rooms with parameters
@app.route('/rooms/', methods=['GET'])
def get_rooms_with_parameter():
    day_nam = request.args.get('day')
    building_nam = request.args.get('building')
    room_num = request.args.get('room')
    cur_time = request.args.get('cur_time')
    order = request.args.getlist('order')

    filters = []
    orders = []

    if day_nam is not None:
        filters.append(Room.day==day_nam)
    if building_nam is not None:
        filters.append(Room.building==building_nam)
    if room_num is not None:
        filters.append(Room.room==room_num)
    if cur_time is not None:
        filters.append(Room.start_t <= cur_time)
        filters.append(Room.end_t >= cur_time)
    
    if order is not None:
        for order_type in order:
            if order_type == 'day':
                orders.append(Room.day)
            if order_type == 'building':
                orders.append(Room.building)
            if order_type == 'start_t':
                orders.append(Room.start_t)
    
    all_rooms = Room.query.filter(*filters).order_by(*orders).all()
    result = rooms_schema.dump(all_rooms)
    return jsonify(result)

# Delete all rooms
@app.route('/rooms', methods=['DELETE'])
def remove_rooms():
    num_rooms = Room.query.delete()
    db.session.commit()
    return str(num_rooms)

# Get the ip address of the current machine
def get_host_ip():
    host_name = socket.gethostname()
    ip_addr = socket.gethostbyname(host_name)
    return ip_addr

# Run Server
if __name__ == '__main__':
    if not os.path.isfile('Database/rooms.sqlite'):
        db.create_all()

    machine_ip = get_host_ip()
    app.run(host=machine_ip)
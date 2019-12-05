# Ontario Tech RoomFinder Server
## Setup
Install Python 3.6+
Install the needed Python libraries: Flask, SQLAlchemy, and Marshmallow

    pip install flask
    pip install flask-sqlalchemy
    pip install flask-marshmallow
    pip install marshmallow-sqlalchemy

Next start the server

    python server.py

## REST API
### POST

    http://<Server name>/room

Post must be made with a json file:

    {
        "day": <day>,               # String(10)
        "building": <building>,     # String(20)
        "room": <room>,             # String(10)
        "start_t": <start_t>,       # Integer
        "end_t": <end_t>            # Integer
    }

### GET
Endpoint for getting all the buidlings in the table (non-duplicate)

    http://<Server name>/buildings

returns a json of the buildings

    [
        {
            "building": "building_1"
        },
        {
            "building": "building_2"
        },
        {
            "building": "building_3"
        }
    ]

Endpoint for getting all the rooms in the table (non-duplicate)

    http://<Server name>/buildings/rooms

returns a json of the rooms and their associated building

    [
        {
            "building": "building_1",
            "room": "room_1"
        },
        {
            "building": "building_2",
            "room": "room_2"
        },
        {
            "building": "building_3",
            "room": "room_3"
        }
    ]

Endpoint for getting all the rooms

    http://<Server name>/rooms

return a json of all the rows in the table

    [
        {
            "day": <day>,    
            "building": <building>,  
            "room": <room>,      
            "start_t": <start_t>, 
            "end_t": <end_t>
        },
        {
            "day": <day>,    
            "building": <building>,  
            "room": <room>,      
            "start_t": <start_t>, 
            "end_t": <end_t>
        }
    ]

Endpoint for getting rooms with parameters

    http://<Server name>/rooms/?day=Monday&building=UA&room=UA1140&cur_time=1240&order=day&order=building

Parameters (Optional):
* ?day=(day)            Returns json containing all the entries that contain (day)
* ?building=(building)  Return json containing all the entries that contain (building)
* ?room=(room)          Return json containing all the entries that contain (room)
* ?cur_time=(cur_time)  Return json containing all entries with time ranges with (cur_time)

## DELETE
Delete all entries in the table

    http://<Server name>/rooms

returns an integer of the number of entries deleted


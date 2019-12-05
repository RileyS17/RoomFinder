import math, csv, os


# ---------Python script finds when rooms are vacant based on the course data-------------
# Constant variable
FILE_NAME = 'courses.csv'

class TimeSlot:
    day = ''
    building = ''
    room = ''
    time_frame = []

    def __init__(self, day, building, room):
        self.day = day
        self.building = building
        self.room = room
        self.time_frame = [1]*84 # time range[8:10 - 22:00] 10 min increments

    # Convert 24 time format to index [0-83]
    def time_to_index(self, time_format):
        hour = time_format[:-2]
        minute = time_format[-2:]
        
        index_format = int(hour)*6 + int(minute)/10 - 49
        return math.floor(index_format)

    # Convert index [0-83] to 24 time format
    def index_to_time(self, index_format):
        index_format = index_format + 49
        hour = math.floor(index_format / 6)
        minutes = math.floor(index_format % 6) * 10

        if minutes == 0:
            minutes = str(minutes) + '0'

        time_format = str(hour) + str(minutes)
        return time_format

    # Remove availability from time_frame given a time range
    def remove_availability(self, start_t, end_t):
        start_index = self.time_to_index(start_t)
        end_index = self.time_to_index(end_t)

        for i in range(start_index, end_index+1):
            self.time_frame[i] = 0 # Make them unavailable

    # Return lists for start times and end times
    # when a room is available
    def get_availability(self):
        start_list = []
        end_list = []

        for i in range(len(self.time_frame)):
            if i == 0:
                if self.time_frame[i] == 1:
                    start_list.append(i)
            else: 
                if self.time_frame[i] == 0 and self.time_frame[i-1] == 1:
                    end_list.append(i)
                elif self.time_frame[i] == 1 and self.time_frame[i-1] == 0:
                    start_list.append(i-1)
        
        if self.time_frame[83] == 1 and self.time_frame[82] == 1:
            end_list.append(83)

        for i in range(len(start_list)):
            start_list[i] = self.index_to_time(start_list[i])
            end_list[i] = self.index_to_time(end_list[i])

        return start_list, end_list

# Global variable
room_list = []

# Read csv file with course data
def csv_to_timeslot(file_name):
    with open(file_name, 'r') as csv_file:
        read_csv = csv.reader(csv_file)
        next(read_csv)

        for row in read_csv:
            new_timeslot = 1

            if len(row) == 5:
                s_buffer = row[3].split(':')
                start_t = s_buffer[0] + s_buffer[1]
                s_buffer = row[4].split(':')
                end_t = s_buffer[0] + s_buffer[1]

                for room in room_list:
                    if row[0] == room.day and row[1] == room.building and row[2] == room.room:
                        room.remove_availability(start_t, end_t)
                        new_timeslot = 0
                        break

                if new_timeslot == 1:
                    timeslot = TimeSlot(row[0], row[1], row[2])
                    timeslot.remove_availability(start_t, end_t)
                    room_list.append(timeslot)

# Write the times rooms are vacant to a csv file
def timeslot_to_csv(file_name):
    fields = ['Day', 'Building', 'Room', 'Start Time', 'End Time']
    rows = []

    for room in room_list:
        start_t, end_t = room.get_availability()

        for i in range(len(start_t)):
            start_t[i] = start_t[i][:-2] + ':' + start_t[i][-2:]
            end_t[i] = end_t[i][:-2] + ':' + end_t[i][-2:]
            rows.append([room.day, room.building, room.room, start_t[i], end_t[i]])
    
    with open(file_name, 'w') as csv_file:
        # Create a csv writer object
        csv_writter = csv.writer(csv_file)
        # Writing the fields
        csv_writter.writerow(fields)
        # Write the data rows
        csv_writter.writerows(rows)

if __name__ == '__main__':
    if os.path.isfile(FILE_NAME):
        csv_to_timeslot(FILE_NAME)
        timeslot_to_csv('available.csv')
        
    else:
        print('File does not exist')
        quit()
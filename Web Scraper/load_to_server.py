import requests, csv, os, sys

# -------Python script that takes the entries in a csv file and POST them to the python server--------------
# Constant variables
API_POST_ENDPOINT = '/room'
API_DELETE_ENDPOINT = '/rooms'
FILE_NAME = 'available.csv'

# Clear the server of all entries from the previous term
def delete_database(server_ip):
    requests.delete('http://'+server_ip+API_DELETE_ENDPOINT)

# POST an entry to the server
def post_to_server(payload, server_ip):
    requests.post('http://'+server_ip+API_POST_ENDPOINT, json=payload)

# Convert the csv data into json format
def csv_to_json(file_name, server_ip):
    json_file = {}

    with open(file_name, 'r') as csv_file:
        read_csv = csv.reader(csv_file, delimiter=',')
        next(read_csv)
        row_num = 0

        for row in read_csv:
            if len(row) is 5:
                #print(row)
                s_buffer = row[3].split(':')
                start_t = s_buffer[0] + s_buffer[1]
                s_buffer = row[4].split(':')
                end_t = s_buffer[0] + s_buffer[1]

                json_file = {'day': row[0],
                            'building': row[1],
                            'room': row[2],
                            'start_t': int(start_t),
                            'end_t': int(end_t)}
                
                row_num += 1
                post_to_server(json_file, server_ip) # Entry sent to be POSTed
                print('Post entry ' + str(row_num))

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Invalid number of arguments')
        quit()

    if os.path.isfile(FILE_NAME):
        delete_database(sys.argv[1])
        csv_to_json(FILE_NAME, sys.argv[1])
    else:
        print('File does not exist')
        quit()
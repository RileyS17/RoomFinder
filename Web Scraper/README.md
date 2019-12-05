# Ontario Tech website scrapper
## Requirements
* Python 3.6+
* Python modules: selenium and requests
```
    pip install selenium
    pip install requests
```
## Instructions
1. Run the web scrapper script, this will create a file called "courses.csv"
   Note: This will take a while to finish (~20-24 min)
```
    python w_scraper.py
```
2. Run the script that will find when rooms are vacant using the data from "courses.csv" and save them to file "available.csv"
```
    python find_available_time.py
```
3. Run the script that will load the entries from "available.csv" to the server
```
    python load_to_server.py <server ip>:5000
```
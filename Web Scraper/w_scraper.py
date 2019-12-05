from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException
from datetime import datetime
import csv

# -------------Python script to harvest the course data from the Ontario Tech website------------------
# Link to the "search available courses" page on the Ontario Tech website
URL_COURSE_DATABASE = 'https://ssbp.mycampus.ca/prod_uoit/bwckschd.p_disp_dyn_sched?TRM=U'

# Return term value assocated to fall, winter or spring/summer term
# based on the current month
def get_term():
    current_date = datetime.now()
    term = str(current_date.year)
    
    if current_date.month >= 9 and current_date.month <= 12:
        term += '09'
    elif current_date >= 1 and current_date <= 4:
        term += '01'
    else:
        term += '05'
    return term

# Click button element at assocated xpath
def click_button(browser, xpath):
    # Create object assign the button element
    submit_button = browser.find_element(By.XPATH, xpath)
    submit_button.click()

# Timeout functionality that terminates the script
# if the page doesn't load within a specified time
def page_wait(browser, timeout, elem_name, elem_text):
    try:
        WebDriverWait(browser, timeout).until(EC.text_to_be_present_in_element((By.CLASS_NAME, elem_name), elem_text))
    except TimeoutException:
        print("Timed out waiting for page to load")
        browser.quit()

# Select all the specified options in a list menu
def select_by_option(browser, element_id, option_list):
    # Create an object assign to list menu by element id
    select_menu = Select(browser.find_element(By.ID, element_id))
    select_menu.deselect_all()

    # Select the options in the option list
    for option in option_list:
        select_menu.select_by_value(option)

# Select all the options in a list menu
def select_all_options(browser, element_id):
    # Create an object assign to list menu by element id
    select_menu = Select(browser.find_element(By.ID, element_id))
    select_menu.deselect_all()

    # Select all the options in the list menu
    for option_index in range(len(select_menu.options)):
        select_menu.select_by_index(option_index)

# Select the current term from drop-down menu
def select_term(browser, term):
    drop_menu_name = 'p_term'
    # Create an object assign to the drop-down menu element
    term_drop_menu = Select(browser.find_element(By.NAME, drop_menu_name))
    # Select the term based on term value
    term_drop_menu.select_by_value(term)

def browse_web(web_url):
    # WebDriver arguments
    option = webdriver.ChromeOptions()
    option.add_argument('--incognito')
    option.add_argument('--ignore-certificate-errors')

    # Create instance of Chrome
    browser = webdriver.Chrome(chrome_options=option)
    browser.get(web_url)

    # Wait for Term page to load
    timeout = 20
    elem_name = 'captiontext'
    elem_text = 'Search by Term:'
    page_wait(browser, timeout, elem_name, elem_text)

    # ------Navigate Search by Term page----------
    term = get_term()
    select_term(browser, term)
    
    button_xpath = '/html/body/div/div[4]/form/input[3]'
    click_button(browser, button_xpath)

    # Wait for Class Search page to load
    timeout = 20
    elem_name = 'fieldlabeltext'
    elem_text = 'Subject:'
    page_wait(browser, timeout, elem_name, elem_text)

    # ---------Navigate Class Search page----------
    # Select all subjects
    elem_id = 'subj_id'
    select_all_options(browser, elem_id)
    
    # Select schedule types: lecture, tutorial, and lecture & lab
    elem_id = 'schd_id'
    option_list = ['LEC', 'TUT', 'L&L']
    select_by_option(browser, elem_id, option_list)
    
    # Select instructional type: in-class
    elem_id = 'insm_id'
    option_list = ['CLS']
    select_by_option(browser, elem_id, option_list)
    
    # Select North Campus
    elem_id = 'camp_id'
    option_list = ['UON']
    select_by_option(browser, elem_id, option_list)
    
    button_xpath = '/html/body/div/div[4]/form/input[13]'
    click_button(browser, button_xpath)

    # Wait for Schedule page to load
    timeout = 300   # 5 minutes
    elem_name = 'captiontext'
    elem_text = 'Sections Found'
    page_wait(browser, timeout, elem_name, elem_text)

    return browser

def parse_day_cell(cell_text):
    if cell_text == "M":
        return "Monday"
    elif cell_text == "T":
        return "Tuesday"
    elif cell_text == "W":
        return "Wednesday"
    elif cell_text == "R":
        return "Thursday"
    elif cell_text == "F":
        return "Friday"
    else:
        return "TBA"

def parse_where_cell(cell_text):
    text_list = cell_text.split()
    
    if "Science" in text_list[0]:
        return "UA", str(text_list[len(text_list)-1])
    elif "Business" in text_list[0]:
        return "UB", str(text_list[len(text_list)-1])
    elif "Software" in text_list[0]:
        return "SIRC", str(text_list[len(text_list)-1])
    elif "Simcoe" in text_list[0]:
        return "J-Building", str(text_list[len(text_list)-1])
    elif "Energy" in text_list[0]:
        return "ERC", str(text_list[len(text_list)-1])
    elif "UL" in text_list[0]:
        return "UL-Building", str(text_list[len(text_list)-1])
    else:
        return "TBA", "TBA"

def parse_time_cell(cell_text):
    if cell_text == "TBA":
        return "TBA", "TBA"

    time_list = cell_text.split("-")
    temp_string = time_list[0] + time_list[1]
    time_list = temp_string.split()

    for i in range(4):
        if time_list[i] == "pm":
            hr_min = time_list[i-1].split(":")
            
            if hr_min[0] != "12":
                hr_min[0] = str(int(hr_min[0]) + 12)
            
            time_list[i-1] = hr_min[0] + ':' + hr_min[1]

    return time_list[0], time_list[2]
        
def scrap_web(browser):
    cells = browser.find_elements(By.CLASS_NAME, 'dbdefault') # get list of elements with same class name
    day_of_the_week, building, room_number, start_time, end_time =[], [], [], [], []
    n_rows = 0
    colum_counter = 0
    end_of_row = 3

    # Parse each cell
    for cell in cells:
        if 'am - ' in cell.text or 'pm - ' in cell.text:
            colum_counter = 1

        if colum_counter == 2:
            day_of_the_week.append(parse_day_cell(cell.text))
        elif colum_counter == 3:
            temp_b, temp_r = parse_where_cell(cell.text)
            building.append(temp_b)
            room_number.append(temp_r)
        elif colum_counter == 1:
            temp_s, temp_e = parse_time_cell(cell.text)
            start_time.append(temp_s)
            end_time.append(temp_e)
        
        if colum_counter == end_of_row:
                colum_counter = 0
                n_rows += 1
                print('Parse row ' + str(n_rows) + '...' )
        elif colum_counter > 0:
                colum_counter += 1

    # Find rows with TBA
    row_index = []
    for row in range(len(day_of_the_week)):
        if (day_of_the_week[row] == "TBA" or
            building[row] == "TBA" or
            room_number[row] == "TBA" or
            start_time == "TBA" or
            end_time == "TBA"):
            row_index.append(row)

    # Remove rows with TBA
    for row in row_index:
        day_of_the_week.pop(row)
        building.pop(row)
        room_number.pop(row)
        start_time.pop(row)
        end_time.pop(row)

        for index in range(len(row_index)):
            row_index[index] -= 1

    return day_of_the_week, building, room_number, start_time, end_time

def save_to_csv(day_of_the_week, building, room_number, start_time, end_time):
    fields = ['Day', 'Building', 'Room', 'Start Time', 'End Time']
    rows = []
    file_name = 'courses.csv'

    for row in range(len(day_of_the_week)):
        rows.append([day_of_the_week[row], building[row], 
            room_number[row], start_time[row], end_time[row]])
    
    with open(file_name, 'w') as csv_file:
        # Create a csv writer object
        csv_writter = csv.writer(csv_file)
        # Writing the fields
        csv_writter.writerow(fields)
        # Write the data rows
        csv_writter.writerows(rows)

def main():
    print('Start web diving...')
    browser = browse_web(URL_COURSE_DATABASE)
    print('Web scrapping page for courses...')
    day_of_the_week, building, room_number, start_time, end_time = scrap_web(browser)
    browser.quit()
    print('Saving results to csv file')
    save_to_csv(day_of_the_week, building, room_number, start_time, end_time)

if __name__ == '__main__':
    main()

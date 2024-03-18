'''import relevant libraries'''
import requests
import csv
import datetime

'''define API-access'''
username = "alpineace_bricalli_andrea:"
password = "V95gO60fqB"
location= "46.726002,9.557748"
'''current date time'''
current_date = datetime.datetime.now()
date = current_date.strftime("%Y-%m-%d")
current_time = datetime.datetime.now()
time= current_time.strftime("%H:%M:%S")
timezone="Z"
datezone="T"
url= f"https://{username}{password}@api.meteomatics.com/{date}{datezone}{time}{timezone}/t_2m:C/{location}/json"

'''get information from weather-api'''


res = requests.get(url)
'''Check if request was successful'''
if res.status_code == 200:
    '''Parse the Json response'''
    data =res.json()
    
    
    
    
    '''Write the data to a csv-file'''
    with open("weather.csv", "a", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)
        
else: 
    print(f"Error:Unable to retrieve data from SLF API (status code {res.status_code}) ")
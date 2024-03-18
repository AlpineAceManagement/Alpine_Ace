'''import relevant libraries'''
import requests
import csv

'''define API-access'''
username = "alpineace_bricalli_andrea"
password = "V95gO60fqB"
station_code= "ROT3"
url= "https://measurement-api.slf.ch/public/api/imis/station/ROT3/measurements"

'''get information from weather-api'''

#response = requests.get(f"https://api.meteomatics.com/2024-03-15T00:00:00Z--2024-03-18T00:00:00Z:PT1H/t_2m:C/52.520551,13.461804/json")
#print(response)


res = requests.get(url)
'''Check if request was successful'''
if res.status_code == 200:
    '''Parse the Json response'''
    data =res.json()
    '''Extrct relevant info'''
    lon = data[2]
    lat = data[1]
    
    
    
    '''Write the data to a csv-file'''
    with open("snowstation.csv", "a", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([lon, lat])
        
else: 
    print(f"Error:Unable to retrieve data from SLF API (status code {res.status_code}) ")
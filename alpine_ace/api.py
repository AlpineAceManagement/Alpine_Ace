'''import relevant libraries'''
import requests
import csv

'''define API-access'''
username = "alpineace_bricalli_andrea"
password = "V95gO60fqB"
url= "https://measurement-api.slf.ch/public/api/study-plot/stations"

'''get information from weather-api'''

#response = requests.get(f"https://api.meteomatics.com/2024-03-15T00:00:00Z--2024-03-18T00:00:00Z:PT1H/t_2m:C/52.520551,13.461804/json")
#print(response)

res = requests.get(url)

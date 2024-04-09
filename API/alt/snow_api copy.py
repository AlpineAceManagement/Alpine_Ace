'''import relevant libraries'''
import requests
import csv
import time



'''define API-access'''
def get_station_data(station_code):
    url= f"https://measurement-api.slf.ch/public/api/imis/station/{station_code}/measurements"
    res = requests.get(url)
    
    if res.status_code == 200:
        '''Parse the Json response'''
        data =res.json()
        '''Extract relevant info'''
        hs = data[2]
        md = data[1]
        return hs,md

    else: 
        print(f"Error:Unable to retrieve data from SLF API (status code {res.status_code}) ")
        return None

'''Write the data to a csv-file'''
def write_to_csv(data):
    with open("snowstation.csv", "a", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)


'''main loop of program - extractin information every 0.5h'''
def main():
    station_code="ROT3"
    
    while True:
        data = get_station_data(station_code)
        
        if data:
            write_to_csv(data)
        time.sleep(30*60)
if __name__ == "__main__":
    main()







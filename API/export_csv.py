import json
import csv

# Read the JSON data from the file
with open('stations_coord_abk.json', 'r') as json_file:
    data = json.load(json_file)

# Extract only 'code', 'label', 'lon', and 'lat' fields
rows = [(item['code'], item['label'], item['lon'], item['lat']) for item in data]

# Export the extracted data to a CSV file
with open('meteo_stationen.csv', 'w', newline='') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(['Code', 'Label', 'Longitude', 'Latitude'])  # Write header
    writer.writerows(rows)  # Write rows

print('Data exported successfully to output.csv')

import requests
from bs4 import BeautifulSoup
import psycopg2

# Website URL
url = "https://www.bergfex.ch/arosa-lenzerheide/"

# Database connection details (same as before)
db_config = {
    # ...your database details
}

def scrape_arosa_lenzerheide():
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the relevant sections for lifts and pistes
    status_box = soup.find('div', class_='statusbox-skigebiet')  
    if not status_box:
        print("Status box not found - website structure may have changed.")
        return

    lift_info = status_box.find('div', class_='pistedaten').text.strip().split('/')
    open_lifts = lift_info[0]
    total_lifts = lift_info[1]

    piste_info = status_box.find('div', class_='liftdaten').text.strip().split('/')
    open_pistes_km = piste_info[0]
    total_pistes_km = piste_info[1]

    # Store the data in database
    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO ski_resorts (resort_name, open_pistes, open_anlagen, data_source, last_updated) 
                    VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                    """,
                    ("Arosa Lenzerheide", open_pistes_km, open_lifts, url)
                )
    except psycopg2.Error as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    scrape_arosa_lenzerheide()

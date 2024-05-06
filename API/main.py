import subprocess
import time

def start_script(script_name):
    """Starts a Python script in a separate process."""
    subprocess.Popen(['python', script_name])

if __name__ == '__main__':
    scripts = ['API\weather_api.py',
                'API\snow_api.py', 
                'API/avbulletins_api.py']

    for script in scripts:
        start_script(script)

    while True:
        time.sleep(60)  # Adjust the sleep time if necessary

# Download und unzip function von Martin Christen, 4040 Geoprogrammierung II
#-----------------------------------------------------------------------------------
import os
from urllib.request import urlopen
from zipfile import ZipFile
import shutil

def download(url, destfile, overwrite=False):
    print("Downloading", destfile, "from", url)

    if os.path.exists(destfile) and not overwrite:
        print("File already exists, not overwriting.")
        return

    response = urlopen(url)
    info = response.info()
    cl = info["Content-Length"]

    if cl != None:
        filesize = int(cl)
        currentsize = 0

        with open(destfile, 'wb') as f:
            while True:
                chunk = response.read(16*1024)
                currentsize += len(chunk)

                if not chunk:
                    break
                f.write(chunk)
                percent = int(100*currentsize/filesize)

                bar = "*"*(percent)
                bar += "-"*((100-percent))
                print('\r{}% done \t[{}]'.format(percent, bar), end='')
        print("")

    else:
        print("Downloading please wait... (filesize unknown)")
        with open(destfile, 'wb') as f:
            while True:
                chunk = response.read(16*1024)
                if not chunk:
                    break
                f.write(chunk)


#-----------------------------------------------------------------------------------

def unzip(source, dest):
    with ZipFile(source, 'r') as zz:
        #zz.extractall(path=dest) We don't overwrite already extracted files:
        for item in zz.infolist():
                file_path = os.path.join(dest, item.filename)
                if not os.path.exists(file_path):
                    zz.extract(item, dest)


#-----------------------------------------------------------------------------------


def copy_files_to_destination_and_delete_source(source_folder, destination_folder):
    files = os.listdir(source_folder)
    for file in files:
        source_file_path = os.path.join(source_folder, file)
        destination_file_path = os.path.join(destination_folder, file)
        shutil.copy(source_file_path, destination_file_path)
    shutil.rmtree(source_folder)  # Delete the source folder
    print("Files copied and source folder deleted successfully :)")

#-----------------------------------------------------------------------------------

url ="https://cms.geo.admin.ch/ogd/topography/DHM25_MM_ASCII_GRID.zip"
download(url, "DB_PG/ASCII_Hoehenmodell/DHM25_MM_ASCII_GRID.zip", False)
unzip("DB_PG/ASCII_Hoehenmodell/DHM25_MM_ASCII_GRID.zip", "DB_PG/ASCII_Hoehenmodell")


copy_files_to_destination_and_delete_source("DB_PG\ASCII_Hoehenmodell\ASCII_GRID_1part", "DB_PG\ASCII_Hoehenmodell")

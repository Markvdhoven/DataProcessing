# Mark van den Hoven
# 10533133
# transfer.py: verandert csv bestand in JSON bestand

import csv
import json
import os

# read csv file
with open('bevolking.csv', encoding='utf-8-sig') as csvfile:
    bevolkingsinfo = csv.reader(csvfile, delimiter=';')
    fieldnames = ()

    # add fieldnames to tuple
    for info in bevolkingsinfo:
        for i in range(len(info)):
            fieldnames += (info[i],)
        break

    # open JSON file
    jsonfile = open('bevolking.json', 'w')

    jsonfile.write('{ "data" : \n')
    jsonfile.write('[ \n')

    # read CSV file with right delimiter
    reader = csv.DictReader(csvfile, fieldnames, delimiter = ';')

    # for each row dump to JSONfile
    for count, row in enumerate(reader):
        json.dump(row, jsonfile)
        jsonfile.write(',')
        jsonfile.write('\n')

    # you have to delete the last comma yourself!

    # write end of file
    jsonfile.write('] \n')
    jsonfile.write('}')

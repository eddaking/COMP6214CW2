import csv
import sys

editFile = sys.argv[1]
postcodeIndex = int(sys.argv[2])
postcodes = {}

with open('ukpostcodes.csv') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
    	#do the thing
		postcodes[row[1]] = [row[2], row[3]]

rowNumber = 0
with open(editFile) as csvreadFile:
	reader = csv.reader(csvreadFile)
	with open("pythonScriptOutput.csv", 'w') as csvWriteFile:
		writer = csv.writer(csvWriteFile)
		for row in reader:
			outrow = row
			if rowNumber == 0:
				row.append("lat")
				row.append("lng")
			else:
				try:
					postcode = row[postcodeIndex]
					loc = postcodes[postcode]
					row.append(loc[0])
					row.append(loc[1])
				except KeyError:
					print(postcode)
				except IndexError:
					print(postcodeIndex)
				
			writer.writerow(outrow)
			rowNumber = rowNumber + 1
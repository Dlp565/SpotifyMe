from calendar import c
import sys, json
import matplotlib.pyplot as plt



def arraysum(arr):
    return sum(arr)

data = json.loads(sys.argv[1])
artists = {}
for i in range(0,10):
    currArtist = data[str(i)]['artists'][0]
    if currArtist in artists:
        artists[currArtist] = artists[currArtist] + 1
    else:
        artists[currArtist] = 1

pie, ax = plt.subplots(figsize=[10,6])
Labels = [k for k in artists.keys()]
Data   = [float(v) for v in artists.values()]
plt.pie(x = Data, labels=Labels, autopct="%.1f%%", pctdistance=0.5)
plt.savefig(sys.stdout.buffer)



sys.stdout.flush()

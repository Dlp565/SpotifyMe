from calendar import c
import sys, json
import matplotlib.pyplot as plt
import io
from PIL import Image





data = json.loads(sys.argv[1])

labels = []
sizes = []

for x,y in data.items():
    labels.append(x)
    sizes.append(y)

plt.pie(sizes,labels=labels)
plt.axis('equal')
buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
im = Image.open(buf)

print(im)

sys.stdout.flush()

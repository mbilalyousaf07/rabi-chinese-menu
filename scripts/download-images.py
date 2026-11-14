import urllib.request,io,json
from pathlib import Path
from PIL import Image,ImageOps
photos={'chicken':36388451,'rice':12984978,'noodles':24811710,'momos':8970163,'pasta':1438672,'soup':12077982,'fries':4109234,'drumsticks':37485644,'crackers':5848620}
credits=[]
for name,id in photos.items():
 url=f'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=900'
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(req,timeout=45) as response: content=response.read()
 img=Image.open(io.BytesIO(content)).convert('RGB')
 img=ImageOps.fit(img,(800,600))
 img.save(f'assets/images/{name}.webp','WEBP',quality=77)
 credits.append({'file':name+'.webp','source':f'https://www.pexels.com/photo/{id}/','download':url,'license':'https://www.pexels.com/license/'})
 print(name,Path(f'assets/images/{name}.webp').stat().st_size)
Path('data/image-credits.json').write_text(json.dumps(credits,indent=2))


"""Download the reviewed photo manifest, preserving source/license provenance."""
import hashlib,io,json,urllib.request,sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'data/image-selections.json').read_text(encoding='utf-8'))
cache=ROOT/'test-results/photo-sources';cache.mkdir(parents=True,exist_ok=True)
def download(entry):
 if entry.get('sourcePath'):
  original=ROOT/entry['sourcePath']
  small_original=ROOT/entry.get('smallSourcePath',entry['sourcePath'])
  if not original.is_file() or not small_original.is_file():
   if all((ROOT/'assets/images'/entry[key]).is_file() for key in ['file','smallFile']):
    return entry['itemId']+' (using committed images; local upload not present)'
   raise FileNotFoundError('Missing original upload: '+str(original if not original.is_file() else small_original))
 else:
  url=entry['download'];original=cache/(hashlib.sha256(url.encode()).hexdigest()+'.jpg')
 if not original.exists():
  request=urllib.request.Request(url,headers={'User-Agent':'RabiMenuLicensedPhotos/1.0'})
  with urllib.request.urlopen(request,timeout=45) as response:content=response.read()
  Image.open(io.BytesIO(content)).verify();original.write_bytes(content)
 image=ImageOps.exif_transpose(Image.open(original)).convert('RGB')
 crop=entry.get('crop')
 if crop:
  w,h=image.size;image=image.crop(tuple(int(v*(w if n%2==0 else h)) for n,v in enumerate(crop)))
 image=ImageOps.fit(image,(720,540),centering=tuple(entry.get('centering',[0.5,0.5])))
 image.save(ROOT/'assets/images'/entry['file'],'WEBP',quality=78,method=6)
 small=image.resize((360,270),Image.Resampling.LANCZOS)
 if entry.get('smallSourcePath'):
  with Image.open(small_original) as uploaded:
   small=ImageOps.fit(ImageOps.exif_transpose(uploaded).convert('RGB'),(360,270),method=Image.Resampling.LANCZOS)
 small.save(ROOT/'assets/images'/entry['smallFile'],'WEBP',quality=76,method=6)
 return entry['itemId']
failed=[]
with ThreadPoolExecutor(max_workers=3) as pool:
 futures=[(entry,pool.submit(download,entry)) for entry in manifest]
 for entry,future in futures:
  try:print('Saved',future.result(),flush=True)
  except Exception as error:failed.append(entry['itemId']);print('FAILED',entry['itemId'],str(error),flush=True)
if failed:sys.exit('Download failures: '+', '.join(failed))
print('All 46 distinct dish photographs optimized, including mobile sizes.')

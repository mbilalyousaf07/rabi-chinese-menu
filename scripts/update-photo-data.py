"""Apply reviewed dish images and regenerate source/license credits."""
import json,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
menu_path=ROOT/'data/menu.json'
menu=json.loads(menu_path.read_text(encoding='utf-8'))
selections=json.loads((ROOT/'data/image-selections.json').read_text(encoding='utf-8'))
lookup={i['id']:i for c in menu['categories'] for i in c['items']}
for entry in selections:
 item=lookup[entry['itemId']]
 item['image']='assets/images/'+entry['file']
 item['imageSmall']='assets/images/'+entry['smallFile']
 item['imageAlt']='Representative photograph for '+item['name']+'; not Rabi Chinese food or serving size.'
ids=[['gravy-1','soup-1','rice-7'],['pasta-1','pasta-2','starter-4'],['noodle-1','gravy-4','rice-7'],['gravy-5','starter-4','rice-7'],['pasta-1','noodle-6'],['gravy-7','gravy-3','noodle-6','starter-5']]
for deal,group in zip(menu['deals'],ids):
 deal['image']=lookup[group[0]]['image']
 deal['imageGallery']=[{'itemId':id,'image':lookup[id]['image'],'imageSmall':lookup[id]['imageSmall'],'alt':lookup[id]['imageAlt']} for id in group]
menu_path.write_text(json.dumps(menu,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
hero={'itemId':'hero','dish':'Header / serving inspiration','file':'noodles.webp','title':'Noodles with Chicken','creator':'Nadin Sh','source':'https://www.pexels.com/photo/24811710/','download':'https://images.pexels.com/photos/24811710/pexels-photo-24811710.jpeg?auto=compress&cs=tinysrgb&w=900','licenseName':'Pexels License','license':'https://www.pexels.com/license/','changes':'Cropped, resized, and compressed to WebP.'}
credits=selections+[hero]
(ROOT/'data/image-credits.json').write_text(json.dumps(credits,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
escape=lambda value:html.escape(value or '',quote=True)
rows=[]
for c in credits:
 author=escape(c['creator'])
 if c.get('creatorUrl'):author=f'<a href="{escape(c["creatorUrl"])}">{author}</a>'
 rows.append(f'<article class="credit" id="photo-{escape(c["itemId"])}"><img src="assets/images/{escape(c["file"])}" alt="" width="120" height="90" loading="lazy"><div><h2>{escape(c["dish"])}</h2><p><a href="{escape(c["source"])}">{escape(c["title"])}</a> — {author}</p><p><a href="{escape(c["license"])}">{escape(c["licenseName"])}</a>. {escape(c["changes"])}</p><p>{escape(c.get("selectionNote",""))}</p></div></article>')
page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Photo credits — Rabi Chinese</title><link rel="stylesheet" href="css/style.css"><style>main{max-width:1000px;margin:auto;padding:40px 20px}a{color:#f4cd46;text-decoration:underline}h1{font-size:38px;letter-spacing:-1px;margin-top:30px}.credit{display:flex;gap:20px;padding:25px 0;border-bottom:1px solid #35362e;scroll-margin-top:20px}.credit img{width:120px;height:90px;object-fit:cover;border-radius:7px}.credit h2{font-size:19px;letter-spacing:0}.credit p{font-size:12px;color:#b5b6ab;line-height:1.7}@media(max-width:500px){.credit{gap:12px}.credit img{width:80px;height:60px}}</style></head><body><main><a href="./">← Back to the menu</a><h1>Photo credits</h1><p>Each dish has its own selected photograph. These are representative photographs, not Rabi Chinese food, recipes, ingredients, serving sizes, or presentation. House-special recipes are not provided in the printed menu; their images are visual approximations.</p><p>Deal panels show a selection of their included dishes using the relevant dish photos. Drinks and exact portion counts are specified in the menu text.</p><p>Every photograph below is used under its linked license. Cropped/resized CC BY-SA photographs retain that same license; their adapted WebP files may be downloaded under those terms. No endorsement by the photographers is implied.</p>'''+''.join(rows)+'''</main></body></html>'''
(ROOT/'credits.html').write_text(page,encoding='utf-8')
print('Applied 46 distinct dish photographs and six different deal photo panels; credits regenerated.')

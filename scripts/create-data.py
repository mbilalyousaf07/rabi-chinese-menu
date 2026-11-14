import json,pathlib
root=pathlib.Path('.')
categories=[]
def category(id,name,photo,rows):
 items=[]
 for row in rows.split('\n'):
  if not row: continue
  n,p=row.rsplit('|',1); spicy=n.endswith('*'); n=n.rstrip('*')
  item={'id':id+'-'+str(len(items)+1),'name':n,'image':'assets/images/'+photo+'.webp'}
  if '/' in p:
   item['variants']=[{'label':str(s)+' pcs','price':int(v)} for s,v in zip([6,12],p.split('/'))]
  else: item['price']=int(p)
  if spicy:item['spicy']=True
  if id=='gravy':item['description']='Served with rice.'
  items.append(item)
 categories.append({'id':id,'name':name,'items':items})
category('gravy','Gravy with Rice','chicken','''Chicken Manchurian|470
Chicken Black Pepper|470
Chicken Chilli Dry*|590
Chicken Shashlik|490
Chicken Szechuan*|480
Chicken Chilli Onion*|580
Kung Pao Chicken*|580
Cashew Nut Chicken|580
Almond Chicken|580
Sweet & Sour Chicken|580
Vegetable Chicken|580
Dragon Chicken|580
Oyster Chicken|580
Lemon Chicken|580
Green Pepper Chicken|490
Honey Ginger Chicken|580
Hot Garlic Chicken*|580
Shanghai Chicken|580''')
category('rice','Only Rice','rice','''Egg Fried Rice|300
Vegetable Rice|300
Chicken Masala Rice|400
Chicken Fried Rice|400
Garlic Fried Rice|370
Spicy Szechuan Rice*|400
Plain Rice|770
Rabi Special Rice|470
Mongolian Rice|400''')
category('noodle','Noodle','noodles','''Chicken Chowmein|420
Vegetable Chowmein|390
Szechuan Chicken Chowmein*|450
Egg Chicken Chowmein|450
Singapore Chicken Chowmein|420
Rabi Special Chowmein|490''')
category('starter','Starter','momos','''Chicken Drumstick (1 pc)|170
Chicken Drumstick (3 pcs)|490
Steam Momos|370/700
Fried Momos|390/750
Manchurian Momos|470/900
Fries|200''')
category('pasta','Pasta','pasta','''Alfredo Chicken Cheese|560
Chicken Macaroni|470
Pink Cheese Pasta|560''')
category('soup','Soup','soup','''Hot & Sour Soup|250
Corn Soup|370
Egg Soup|320
Fish Cracker|200''')
# Six printed headings, not seven: keep source categories intact.
for i in categories[3]['items']:
 if i['name'].startswith('Chicken Drumstick'):i['image']='assets/images/drumsticks.webp'
 if i['name']=='Fries':i['image']='assets/images/fries.webp'
categories[5]['items'][3]['image']='assets/images/crackers.webp'
def deal(id,name,serves,price,original,photo,items):return dict(id=id,name=name,serves=serves,price=price,originalPrice=original,image='assets/images/'+photo+'.webp',items=items)
deals=[
 deal('deal-1','Deal 1: Solo Delight','1 person',790,820,'chicken',['1x Chicken Manchurian (With Rice)','1x Hot & Sour Soup','1x Regular Drink']),
 deal('pasta-lover','Pasta Lover Deal','1–2 persons',1470,1520,'pasta',['1x Alfredo Chicken Cheese Pasta','1x Chicken Macaroni','1x Fried Momos (6 pcs) OR Soup','1x Regular Drink']),
 deal('deal-2','Deal 2: Chowmein & Gravy Duo','2 persons',1060,1110,'noodles',['1x Chicken Chowmein','1x Chicken Shashlik (With Rice)','2x Regular Drinks']),
 deal('deal-3','Deal 3: Chinese & Starter Combo','2 persons',1030,1070,'momos',['1x Chicken Szechuan (With Rice)','1x Fried Momos (6 pcs)','2x Regular Drinks']),
 deal('deal-4','Deal 4: Pasta & Chowmein Combo','2 persons',1200,1250,'pasta',['1x Alfredo Chicken Cheese Pasta','1x Rabi Special Chowmein','2x Regular Drinks']),
 deal('deal-5','Deal 5: Grand Family Feast','4–5 persons',2260,2350,'chicken',['1x Kung Pao Chicken (With Rice)','1x Chicken Chilli Dry (With Rice)','1x Rabi Special Chowmein','1x Manchurian Momos (6 pcs)','1x 1.5 Liter Drink'])]
data={'restaurant':{'name':'Rabi Chinese','tagline':'Moments of Fire','address':'127-G Central Flats, Opposite UBL Bank, Faisal Town, Lahore'},'currency':'PKR','sources':['WhatsApp Image 2026-11-14 at 10.30.59 PM.jpeg','WhatsApp Image 2026-11-14 at 10.31.00 PM.jpeg'],'categories':categories,'deals':deals}
(root/'data/menu.json').write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding='utf-8')
print(sum(len(c['items']) for c in categories),'items',len(categories),'categories',len(deals),'deals')

# Preserve reviewed photography when the initial transcription is regenerated.
if (root/'data/image-selections.json').exists():
 import runpy
 runpy.run_path(str(root/'scripts/update-photo-data.py'),run_name='__main__')

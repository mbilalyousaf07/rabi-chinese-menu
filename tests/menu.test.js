import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {selectMenu,rupees,validMenu} from '../js/menu-utils.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/menu.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
test('authoritative inventory and unique ids',()=>{
 assert.equal(data.categories.length,6);assert.deepEqual(data.categories.map(c=>c.items.length),[18,9,6,6,3,4]);assert.equal(data.deals.length,6);
 const all=[...data.categories.flatMap(c=>c.items),...data.deals];assert.equal(new Set(all.map(i=>i.id)).size,52);
 assert.equal(data.categories.flatMap(c=>c.items).reduce((n,i)=>n+(i.variants?.length||1),0),49);
 assert.ok(validMenu(data));assert.equal(validMenu({categories:[],deals:[]}),false);
});
test('all transcribed prices match the source audit',()=>{
 const prices=[[470,470,590,490,480,580,580,580,580,580,580,580,580,580,490,580,580,580],[300,300,400,400,370,400,770,470,400],[420,390,450,450,420,490],[170,490,[370,700],[390,750],[470,900],200],[560,470,560],[250,370,320,200]];
 assert.deepEqual(data.categories.map(c=>c.items.map(i=>i.price??i.variants.map(v=>v.price))),prices);
 assert.deepEqual(data.deals.map(d=>[d.price,d.originalPrice]),[[790,820],[1470,1520],[1060,1110],[1030,1070],[1200,1250],[2260,2350]]);
 assert.deepEqual(data.deals.map(d=>d.items.length),[3,4,3,3,3,5]);
});
test('name search is trimmed and case insensitive and intersects category',()=>{
 assert.equal(selectMenu(data,'all',' CHICKEN CHOWMEIN ').categories.flatMap(c=>c.items).length,4);
 assert.equal(selectMenu(data,'rice','chowmein').categories.length,0);
 assert.equal(selectMenu(data,'rice','egg').categories[0].items[0].name,'Egg Fried Rice');
 assert.equal(selectMenu(data,'deals').deals.length,6);assert.equal(selectMenu(data,'deals').categories.length,0);
 assert.equal(selectMenu(data,'all','zzzz').deals.length,0);
 assert.equal(selectMenu(data,'all','').categories.flatMap(c=>c.items).length,46);
 assert.equal(selectMenu(data,'deals','family').deals[0].id,'deal-5');
});
test('PKR formatting and real local photo assets',()=>{
 assert.equal(rupees(2260),'Rs. 2,260');
 for(const i of [...data.categories.flatMap(c=>c.items),...data.deals]){assert.ok(fs.existsSync(i.image),i.image);assert.ok(fs.statSync(i.image).size>1000);}
 assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/WhatsApp Image .*\.jpe?g/i);
});

test('every dish has a distinct photograph with mobile copy and complete license credits',()=>{
 const dishes=data.categories.flatMap(c=>c.items);
 const credits=JSON.parse(fs.readFileSync('data/image-credits.json','utf8'));
 assert.equal(new Set(dishes.map(i=>i.image)).size,46);
 const hashes=dishes.map(i=>createHash('sha256').update(fs.readFileSync(i.image)).digest('hex'));
 assert.equal(new Set(hashes).size,46,'Different filenames must not hide identical image contents');
 for(const dish of dishes){
  assert.ok(fs.existsSync(dish.imageSmall));assert.match(dish.imageAlt,/Representative/);
  const credit=credits.find(c=>c.itemId===dish.id);assert.ok(credit,dish.name);
  for(const field of ['source','licenseName','creator','changes'])assert.ok(credit[field],dish.name+' '+field);
  if(credit.sourceType==='user-supplied'){
   assert.equal(credit.license,null);assert.ok(credit.sourcePath);assert.match(credit.sourceSha256,/^[a-f0-9]{64}$/);
   const uploadItemId=path=>path.split('/').at(-1).replace(/(?:-supplied-[a-f0-9]{8})?(?:-small)?\.[^.]+$/,'');
   assert.equal(uploadItemId(credit.sourcePath),dish.id);
   assert.ok(dish.image.includes(credit.sourceSha256.slice(0,8)));
   if(credit.smallSourcePath){
    assert.equal(uploadItemId(credit.smallSourcePath),dish.id);
    assert.match(credit.smallSourceSha256,/^[a-f0-9]{64}$/);
    assert.ok(dish.imageSmall.includes(credit.smallSourceSha256.slice(0,8)));
   }
  }else{
   assert.ok(credit.download);assert.match(credit.license,/^https:\/\//);
   assert.ok(!/by-nc|by-nd/.test(credit.license),'Stock images must permit commercial adaptation');
  }
 }
 assert.equal(new Set(credits.filter(c=>c.itemId!=='hero').map(c=>c.sourcePath||c.download)).size,46);
 assert.equal(new Set(data.deals.map(d=>d.imageGallery.map(i=>i.image).join('|'))).size,6);
 for(const deal of data.deals)for(const photo of deal.imageGallery){assert.ok(dishes.some(d=>d.id===photo.itemId&&d.image===photo.image));}
 assert.equal(new Set(dishes.filter(i=>/Soup$/.test(i.name)).map(i=>i.image)).size,3);
});

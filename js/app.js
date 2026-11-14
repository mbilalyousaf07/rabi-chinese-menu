import { selectMenu, rupees, validMenu } from './menu-utils.js';
const $ = id => document.getElementById(id);
let menu, active = 'all';
const el = (tag, className, text) => { const node = document.createElement(tag); if(className) node.className = className; if(text !== undefined) node.textContent = text; return node; };
function photo(item, deal) {
 const wrap = el('div','food-photo');
 const photos = item.imageGallery || [{image:item.image,imageSmall:item.imageSmall,alt:item.imageAlt}];
 if(item.imageGallery) wrap.classList.add('photo-panel','photo-panel-'+photos.length);
 photos.forEach(entry => {
  const image=el('img'); image.width=720; image.height=540; image.loading='lazy'; image.decoding='async';
  image.alt=entry.alt || `Representative photograph for ${item.name}; not the restaurant's food`;
  image.addEventListener('error',()=>{const fallback=el('div','image-fallback','\u2726');fallback.append(el('small','','Photo unavailable'));image.replaceWith(fallback);},{once:true});
  if(entry.imageSmall){image.srcset=`${entry.imageSmall} 360w, ${entry.image} 720w`;image.sizes=item.imageGallery?'(max-width: 580px) 45vw, 200px':'(max-width: 350px) 90vw, (max-width: 580px) 45vw, (max-width: 850px) 44vw, 370px';}
  image.src=entry.image || 'assets/images/unavailable.webp';wrap.append(image);
 });
 const credit=el('a','image-credit','Photo credits');credit.href=item.imageGallery?'credits.html':'credits.html#photo-'+item.id;credit.setAttribute('aria-label','Photo credits for '+item.name);wrap.append(credit);
 if(deal)wrap.append(el('span','deal-badge',`SERVES ${item.serves.toUpperCase()}`));
 return wrap;
}
function card(item, deal=false) {
 const article = el('article','food-card'); article.append(photo(item,deal));
 const body=el('div','food-body'), title=el('h4','',item.name);
 if(item.spicy){const spicy=el('span','spicy','♨');spicy.setAttribute('aria-label','Spicy');title.append(spicy);}
 body.append(title);
 if(item.description)body.append(el('p','',item.description));
 if(deal){const list=el('ul','deal-items');item.items.forEach(content=>list.append(el('li','',content)));body.append(list);}
 const price=el('div','price');
 if(item.variants){price.classList.add('variants');item.variants.forEach(v=>{const part=el('span');part.append(el('small','',v.label),document.createTextNode(rupees(v.price)));price.append(part);});}
 else {if(deal && Number.isFinite(item.originalPrice)) price.append(el('del','old-price',rupees(item.originalPrice)));price.append(document.createTextNode(rupees(item.price)));}
 body.append(price);article.append(body);return article;
}
function section(name,items,id,special=false){
 const section=el('section',special?'menu-group special':'menu-group');section.id=id;
 section.setAttribute('aria-labelledby',id+'-title');
 const heading=el('div','section-heading'),title=el('h3','',name);title.id=id+'-title';heading.append(title,el('span','count',`${items.length} ${special?'deals':'dishes'}`));section.append(heading);
 if(special)section.append(el('p','special-intro','More to share. More to savour. Explore our special deals.'));
 const grid=el('div','grid');items.forEach(item=>grid.append(card(item,special)));section.append(grid);return section;
}
function renderBranches(restaurant) {
 const branches=restaurant?.branches || [];
 if(!branches.length)return;
 $('branch-list').replaceChildren(...branches.map((branch,index)=>{
  const card=el('article','branch-card');
  card.append(el('span','branch-number',String(index+1).padStart(2,'0')),el('h3','',branch.name),el('p','branch-city',branch.city));
  if(branch.address)card.append(el('p','branch-address',branch.address));
  (branch.amenities || []).forEach(amenity=>card.append(el('span','branch-amenity',amenity)));
  return card;
 }));
}
function render(){
 if(!menu)return;
 const results=selectMenu(menu,active,$('search').value);const fragment=document.createDocumentFragment();
 // Put the dedicated deals section first, while all categories remain visible below.
 if(results.deals.length)fragment.append(section('Special Deals',results.deals,'special-deals',true));
 results.categories.forEach(c=>fragment.append(section(c.name,c.items,'category-'+c.id)));
 $('menu-content').replaceChildren(fragment);
 const count=results.categories.reduce((n,c)=>n+c.items.length,0),total=count+results.deals.length;
 $('empty').hidden=total>0;
 $('result-status').textContent=`${count} ${count===1?'dish':'dishes'} · ${results.deals.length} ${results.deals.length===1?'deal':'deals'}${$('search').value.trim()?' matching your search':''}`;
 $('clear-search').hidden=!$('search').value;
 $('categories').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===active)));
}
function reset(){active='all';$('search').value='';render();}
async function load(){
 $('load-error').hidden=true;$('result-status').textContent='Loading the menu…';
 try {
 const response=await fetch(new URL('../data/menu.json',import.meta.url));if(!response.ok)throw new Error('Menu request failed');
 const data=await response.json();if(!validMenu(data))throw new Error('Invalid menu data');menu=data;renderBranches(menu.restaurant);
 const filters=[{id:'all',name:'Full menu'},{id:'deals',name:'✦ Special Deals'},...menu.categories];
 $('categories').replaceChildren(...filters.map(c=>{const button=el('button','',c.name);button.type='button';button.dataset.category=c.id;button.addEventListener('click',()=>{active=c.id;render();});return button;}));render();
 }catch(error){$('menu-content').replaceChildren();$('categories').replaceChildren();$('empty').hidden=true;$('load-error').hidden=false;$('result-status').textContent='Menu unavailable.';console.error(error);}
}
$('search').addEventListener('input',render);
$('clear-search').addEventListener('click',()=>{$('search').value='';render();$('search').focus();});
$('reset').addEventListener('click',reset);$('retry').addEventListener('click',load);
document.querySelector('.deals-jump').addEventListener('click',()=>{active='deals';$('search').value='';render();});
const heroImage = document.querySelector('.hero-visual > img');
function heroFallback() {
 const fallback=el('div','hero-image-fallback');
 fallback.append(el('span','','?'),el('strong','','Moments of Fire'),el('small','','Photo unavailable'));
 heroImage.replaceWith(fallback);
}
heroImage.addEventListener('error',heroFallback,{once:true});
if(heroImage.complete && heroImage.naturalWidth === 0) heroFallback();
load();

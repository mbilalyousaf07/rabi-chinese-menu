const {chromium,devices}=require('@playwright/test');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/rabi-chinese-menu/')){res.writeHead(404);res.end();return;}
 const file=path.resolve(root,pathname.slice('/rabi-chinese-menu/'.length)||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/rabi-chinese-menu/`;
 const chromePath='C:/Program Files/Google/Chrome/Application/chrome.exe';
 const browser=await chromium.launch(fs.existsSync(chromePath)?{executablePath:chromePath,headless:true}:{headless:true});
 const errors=[];
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.food-card');
 assert.equal(await page.locator('.food-card').count(),52);assert.equal(await page.locator('.special .food-card').count(),6);
 assert.equal(await page.locator('.menu-group').count(),7);assert.equal(await page.locator('.branch-card').count(),2);assert.match(await page.locator('#branches').innerText(),/Faisal Town/);assert.match(await page.locator('#branches').innerText(),/Muslim Town/);assert.match(await page.locator('.special .price').last().innerText(),/Rs. 2,260/);assert.match(await page.locator('#category-starter').innerText(),/6 pcs/);
 // Force all lazy assets to load to verify every card image.
 await page.locator('img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.photo-panel').count(),6);
 const sources=await page.locator('.menu-group:not(.special) .food-photo img').evaluateAll(images=>images.map(i=>i.getAttribute('src')));
 assert.equal(new Set(sources).size,46);
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 await page.locator('#branches').screenshot({path:path.join(root,'test-results/branches.png')});
 await page.locator('#category-soup').screenshot({path:path.join(root,'test-results/soup-cards.png')});
 await page.locator('#special-deals').screenshot({path:path.join(root,'test-results/deal-panels.png')});
 await page.locator('#special-deals .food-card').last().scrollIntoViewIfNeeded();
 const grandPhotos=await page.locator('#special-deals .food-card').last().locator('img').evaluateAll(images=>images.map(i=>({loaded:i.complete&&i.naturalWidth>0,height:i.getBoundingClientRect().height})));
 assert.ok(grandPhotos.length===4&&grandPhotos.every(i=>i.loaded&&i.height>50));
 await page.locator('#special-deals .food-card').last().screenshot({path:path.join(root,'test-results/grand-deal.png')});
 await page.getByRole('button',{name:'Only Rice',exact:true}).click();assert.equal(await page.locator('.food-card').count(),9);
 await page.getByRole('searchbox').fill(' EGG ');assert.equal(await page.locator('.food-card').count(),1);assert.match(await page.locator('.food-card').innerText(),/Egg Fried Rice/);
 await page.getByRole('searchbox').fill('zzzz');await page.locator('#empty').waitFor({state:'visible'});
 await page.getByRole('button',{name:'Show the full menu'}).click();assert.equal(await page.locator('.food-card').count(),52);
 await page.getByRole('searchbox').fill('chicken');await page.getByRole('button',{name:'Clear search'}).click();assert.equal(await page.locator('.food-card').count(),52);
 await page.getByRole('link',{name:/Discover special deals/}).click();assert.equal(await page.locator('.food-card').count(),6);
 await page.getByRole('button',{name:'Full menu',exact:true}).click();
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(root,'test-results/desktop.png'),fullPage:false});
 for(const device of ['iPhone 13','Pixel 5']){
 const context=await browser.newContext({...devices[device],defaultBrowserType:undefined});const mobile=await context.newPage();
 await mobile.goto(url);await mobile.waitForSelector('.food-card');assert.equal(await mobile.locator('.food-card').count(),52);
 assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),device+' overflow');
 await mobile.getByRole('button',{name:'Pasta',exact:true}).click();assert.equal(await mobile.locator('.food-card').count(),3);
 await mobile.getByRole('button',{name:'Full menu',exact:true}).click();
 await mobile.screenshot({path:path.join(root,'test-results/'+device.replaceAll(' ','-')+'.png'),fullPage:true});await context.close();
 }
 for(const width of [320,360,390,768,1024]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow at '+width);}
 await page.goto(url);await page.waitForSelector('.food-card');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to menu');
 // Simulate broken images with a fresh context.
 const fail=await browser.newContext();const broken=await fail.newPage();await broken.route('**/*.webp',route=>route.abort());await broken.goto(url);await broken.waitForSelector('.image-fallback');await broken.waitForSelector('.hero-image-fallback');assert.match(await broken.locator('.image-fallback').first().innerText(),/Photo unavailable/);await fail.close();
 const recover=await browser.newContext();const errorPage=await recover.newPage();await errorPage.route('**/data/menu.json',route=>route.fulfill({status:503,body:'Unavailable'}));await errorPage.goto(url);await errorPage.locator('#load-error').waitFor({state:'visible'});
 await errorPage.unroute('**/data/menu.json');await errorPage.getByRole('button',{name:'Try again'}).click();await errorPage.waitForSelector('.food-card');assert.equal(await errorPage.locator('.food-card').count(),52);await recover.close();
 assert.deepEqual(errors,[]);console.log('PASS: completeness, six deals, PKR display, search, categories, reset, 7 viewport widths, iPhone/Android emulation, all local images, broken image fallback, keyboard focus, project subpath, JSON retry; zero page errors.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());

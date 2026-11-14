const {chromium,devices}=require('@playwright/test');
const fs=require('fs'),assert=require('assert/strict');
const url=process.argv[2];
if(!url||!url.startsWith('https://'))throw new Error('Pass the deployed HTTPS URL');
(async()=>{
 const local='C:/Program Files/Google/Chrome/Application/chrome.exe';
 const browser=await chromium.launch(fs.existsSync(local)?{executablePath:local}:{headless:true});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.waitForSelector('.food-card');assert.equal(await page.locator('.food-card').count(),52);
  assert.equal(await page.locator('.special .food-card').count(),6);assert.equal(await page.locator('.branch-card').count(),2);
  await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await page.locator('.photo-panel').count(),6);
  assert.equal(new Set(await page.locator('.menu-group:not(.special) .food-photo img').evaluateAll(images=>images.map(i=>i.src))).size,46);
  await page.getByRole('button',{name:'Only Rice',exact:true}).click();assert.equal(await page.locator('.food-card').count(),9);
  await page.getByRole('searchbox').fill('egg');assert.equal(await page.locator('.food-card').count(),1);
  for(const device of ['iPhone 13','Pixel 5']){
   const context=await browser.newContext(devices[device]),mobile=await context.newPage();
   await mobile.goto(url);await mobile.waitForSelector('.food-card');assert.equal(await mobile.locator('.food-card').count(),52);
   assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await context.close();
  }
  if(process.argv.includes('--qr')){
   const png=await page.request.get(new URL('assets/qr/rabi-menu.png',url).href);assert.equal(png.status(),200);assert.match(png.headers()['content-type'],/image\/png/);
   const dest=await page.request.get(new URL('assets/qr/destination.txt',url).href);assert.equal((await dest.text()).trim(),url);
  }
  assert.deepEqual(errors,[]);console.log('PASS live HTTPS: 52 menu/deal cards, six deals, 46 distinct dish photos and six deal panels, search/category filters, iPhone/Android viewport layouts'+(process.argv.includes('--qr')?', downloadable QR and destination':'')+'.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

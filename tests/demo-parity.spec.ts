import {test,expect,type Page} from '@playwright/test';

const KEY='ustogether-v1';
const profile={name:'Real Student',intro:'A saved real session',interests:['Hiking','Photography','Coffee'],classes:['COMP 1021 · L1'],avatar:{type:'Firebird',color:'#c9473d',clothes:'#709988',accessory:'Scarf',item:'Coffee',hair:'Short',skin:'#e7b58c'}};
const seed={ready:true,location:'Library',prefs:{enabled:false,interests:[]},profile,threads:{}};

async function start(page:Page,threads:Record<string,unknown>={}){
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.clock.install();await page.clock.pauseAt(Date.now()+1000);
 await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:KEY,value:{...seed,threads}});
 await page.goto('./');await page.locator('.scene-shell').waitFor();await page.evaluate(()=>document.fonts.ready);
 await expect.poll(async()=>Object.values((await stored(page)).forumStore||{}).flat().length).toBeGreaterThan(0);
 return errors;
}
async function enterDemo(page:Page){
 await page.locator('header').getByRole('button',{name:/Open profile/}).click();
 await page.getByRole('button',{name:/Demo walkthrough/}).click();
 await expect(page.locator('.phone')).toHaveAttribute('data-session','demo');
}
async function slide(page:Page,index:number,time=0){
 await page.getByRole('combobox',{name:'Demo slide',exact:true}).selectOption(String(index));
 if(time){await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(time);}
}
async function stored(page:Page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),KEY);}
async function postQuest(page:Page,title:string){
 await page.getByRole('button',{name:'Open lobby quests',exact:true}).click();
 await page.getByRole('button',{name:'Add quest',exact:true}).click();
 await page.getByLabel('Activity',{exact:true}).fill(title);
 await page.getByLabel('Meeting place',{exact:true}).fill('Library entrance');
 await page.getByLabel('When',{exact:true}).fill('Today at 6 PM');
 await page.locator('.quest-interest-picker').getByRole('button',{name:'Coffee',exact:true}).click();
 await page.getByRole('button',{name:'Post quest',exact:true}).click();
 return page.locator('.quest-card').filter({has:page.getByRole('heading',{name:title,exact:true})});
}

test('all nine demo chapters use the live forms, names, chat, quests and forums',async({page})=>{
 const errors=await start(page);
 await page.getByRole('button',{name:'Hide discussions',exact:true}).click();
 const saved=await stored(page);await enterDemo(page);
 await slide(page,0,7000);await expect(page.getByPlaceholder('Your display name')).toHaveValue('Firebird Chan');
 await expect(page.getByPlaceholder('Tell classmates about yourself')).toHaveValue('I like coastal hikes, photography, and coffee after class.');
 await slide(page,1,7200);await expect(page.getByRole('button',{name:'Accessory: Scarf',exact:true})).toHaveClass(/chosen/);await expect(page.getByRole('button',{name:'Held item: Coffee',exact:true})).toHaveClass(/chosen/);
 await slide(page,2,6500);await expect(page.locator('.interest-grid .selected')).toHaveCount(4);
 await slide(page,3,4200);await expect(page.getByRole('button',{name:'COMP 1021 lecture L1',exact:true})).toHaveAttribute('aria-pressed','true');
 await slide(page,4,11000);await expect(page.getByRole('combobox',{name:'Choose lobby or lecture',exact:true})).toHaveValue('Dorm common area');await expect(page.locator('.lobby-forum')).toBeVisible();
 await slide(page,5,2500);await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toBeVisible();
 await page.clock.runFor(2400);await expect(page.locator('.hello-pending')).toBeVisible();
 await page.getByRole('button',{name:'Pause demo animation',exact:true}).click();await page.clock.runFor(5000);await expect(page.locator('.hello-pending')).toBeVisible();await expect(page.locator('.peer-person .world-name').first()).toContainText('Unknown');
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(5000);await expect(page.locator('.world-messages p')).toHaveCount(3);await expect(page.locator('.peer-person .world-name').first()).toContainText('Noah');
 await page.clock.runFor(2700);await expect(page.getByRole('dialog',{name:'Meet Noah face to face',exact:true})).toBeVisible();await expect(page.locator('.topic-card')).toHaveCount(4);
 await slide(page,6,5000);await expect(page.locator('[data-quest-id="table-tennis"]')).toContainText(/Joined.*\+1 level/);await expect(page.locator('header')).toContainText('LV 2');
 await slide(page,7,13000);const own=page.locator('.quest-card').filter({hasText:'Your quest'});await expect(own).toHaveCount(1);await expect(own).toContainText('0/2 joined');await expect(page.locator('header')).toContainText('LV 1');
 await slide(page,8,20500);const post=page.locator('.social-post').filter({has:page.getByRole('heading',{name:'Friday coastal hike',exact:true})});await expect(post).toContainText('Anyone up for a coastal hike after class on Friday?');await expect(post).toContainText('Liked');await expect(post).toContainText('I can bring a camera. Meet at the library entrance?');
 expect(await stored(page)).toEqual(saved);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();await expect(page.locator('.profile-card h2')).toHaveText('Real Student');
 await page.locator('nav').getByRole('button',{name:'Campus',exact:true}).click();await expect(page.getByRole('button',{name:'Show discussions',exact:true})).toBeVisible();
 expect(await stored(page)).toEqual(saved);expect(errors).toEqual([]);
});

test('normal hello acceptance opens chat even when the lobby remounts',async({page})=>{
 const errors=await start(page);
 await page.getByRole('button',{name:'Meet Unknown student 1',exact:true}).click();await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Throw a hello/}).click();await page.locator('nav').getByRole('button',{name:'Chats',exact:true}).click();await expect(page.locator('.conversation-row strong')).toHaveText('Unknown');
 await page.clock.runFor(3100);await expect(page.locator('.world-chat-heading strong')).toHaveText('Noah');
 await page.getByRole('textbox',{name:'Message Noah',exact:true}).fill('What got you into hiking?');await page.getByRole('button',{name:'Send character message',exact:true}).click();await page.clock.runFor(1300);await expect(page.locator('.world-messages p')).toHaveCount(3);
 await page.getByRole('button',{name:'Meet face to face',exact:true}).click();await expect(page.locator('.topic-card')).toHaveCount(4);expect(errors).toEqual([]);
});

test('manual demo hellos stay pending while paused and resume with playback',async({page})=>{
 await start(page);await enterDemo(page);await slide(page,5);
 await page.getByRole('button',{name:'Meet Unknown student 1',exact:true}).click();await page.getByRole('button',{name:/Throw a hello/}).click();await page.clock.runFor(5000);await expect(page.locator('.hello-pending')).toBeVisible();
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(3000);await expect(page.locator('.peer-person .world-name').first()).toContainText('Noah');
});

test('demo quest invitations freeze while paused and never leak into the saved session',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await slide(page,7);
 const quest=await postQuest(page,'A demo coffee break');await quest.getByRole('button',{name:'Invite student',exact:true}).click();await page.locator('.quest-invite .setting-row').first().click();
 await page.clock.runFor(3000);await expect(page.locator('.quest-invite')).toContainText(/Accepting/);
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(1300);await expect(quest).toContainText('1/2 joined');
 await quest.getByRole('button',{name:'Invite student',exact:true}).click();await page.locator('.quest-invite .setting-row').first().click();
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();await page.clock.runFor(5000);expect(await stored(page)).toEqual(saved);
});

test('a live pending reply resumes after a demo rather than disappearing',async({page})=>{
 await start(page,{'p6-0':{status:'accepted',acceptedAt:0,messages:[{own:false,text:'Hello!'}]}});
 await page.locator('nav').getByRole('button',{name:'Chats',exact:true}).click();await page.locator('.conversation-row').click();await page.getByRole('textbox',{name:'Message',exact:true}).fill('Coffee after class?');await page.getByRole('button',{name:'Send message',exact:true}).click();
 await enterDemo(page);await page.clock.runFor(5000);expect((await stored(page)).threads['p6-0'].messages).toHaveLength(2);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();await page.clock.runFor(1300);expect((await stored(page)).threads['p6-0'].messages).toHaveLength(3);
});

for(const [width,height] of [[320,568],[390,844],[844,390],[1440,1000]]){
 test(`demo dialogs and controls fit ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});await start(page);await enterDemo(page);await slide(page,5,2500);
  const strip=await page.locator('.demo-strip').boundingBox(),dialog=await page.getByRole('dialog',{name:'Meet Unknown',exact:true}).boundingBox();expect(strip).not.toBeNull();expect(dialog).not.toBeNull();expect(dialog!.y).toBeGreaterThanOrEqual(strip!.y+strip!.height);expect(dialog!.y+dialog!.height).toBeLessThanOrEqual(height);
  const hello=page.getByRole('button',{name:/Throw a hello/});await expect(hello).toBeInViewport();await page.keyboard.press('Escape');await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}


test('normal onboarding and shared-class icebreakers use the same controls as the demo',async({page})=>{
 await page.clock.install();await page.clock.pauseAt(Date.now()+1000);await page.goto('./');
 await page.getByPlaceholder('Your display name').fill('Real Student');await page.getByPlaceholder('Tell classmates about yourself').fill('Coffee and photos after class.');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.locator('.type-options').getByRole('button',{name:/Firebird/}).click();await page.getByRole('button',{name:'Accessory: Scarf',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.locator('.interest-grid').getByRole('button',{name:/Hiking/}).click();await page.locator('.interest-grid').getByRole('button',{name:/Coffee/}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('textbox',{name:'Search courses',exact:true}).fill('COMP 1021');await page.getByRole('button',{name:'COMP 1021 lecture L1',exact:true}).click();await page.getByRole('button',{name:'Enter campus',exact:true}).click();
 await expect(page.getByRole('combobox',{name:'Choose lobby or lecture',exact:true})).toHaveValue(profile.classes[0]);await page.getByRole('button',{name:'Meet Unknown student 1',exact:true}).click();await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toBeVisible();await page.getByRole('button',{name:/Throw a hello/}).click();await page.clock.runFor(3100);
 await page.getByRole('button',{name:'Meet face to face',exact:true}).click();await expect(page.locator('.meet-topics')).toContainText(profile.classes[0]);
});

test('normal quests and forum posts match the effects demonstrated in playback',async({page})=>{
 await start(page);
 await page.getByRole('button',{name:'Open lobby quests',exact:true}).click();await page.locator('[data-quest-id="table-tennis"]').getByRole('button',{name:'Accept quest',exact:true}).click();await expect(page.locator('[data-quest-id="table-tennis"]')).toContainText(/Joined.*\+1 level/);await expect(page.locator('header')).toContainText('LV 2');await page.getByRole('button',{name:'Close lobby quests',exact:true}).click();
 const quest=await postQuest(page,'A normal coffee break');await expect(quest).toContainText('0/2 joined');await expect(page.locator('header')).toContainText('LV 2');await quest.getByRole('button',{name:'Invite student',exact:true}).click();await page.locator('.quest-invite .setting-row').first().click();await page.clock.runFor(1300);await expect(quest).toContainText('1/2 joined');await page.getByRole('button',{name:'Close lobby quests',exact:true}).click();
 await page.locator('nav').getByRole('button',{name:'Chats',exact:true}).click();await page.getByRole('tab',{name:'Forums',exact:true}).click();await page.getByRole('button',{name:'Create post',exact:true}).click();await page.getByRole('textbox',{name:'Post title',exact:true}).fill('A normal coastal hike');await page.getByRole('textbox',{name:'Post description',exact:true}).fill('Anyone up for a walk after class?');await page.getByRole('button',{name:'Post',exact:true}).click();
 const post=page.locator('.social-post').filter({has:page.getByRole('heading',{name:'A normal coastal hike',exact:true})});await post.getByRole('button',{name:/^Like/}).click();await post.getByRole('button',{name:'Show comments',exact:true}).click();await post.getByRole('textbox',{name:'Write a comment',exact:true}).fill('I can bring a camera.');await post.getByRole('button',{name:'Post comment',exact:true}).click();await expect(post).toContainText('Liked');await expect(post).toContainText('I can bring a camera.');
 const saved=await stored(page);expect(Object.values(saved.forumStore).flat().some((entry:any)=>entry.title==='A normal coastal hike')).toBe(true);
});


test('demo room-post bubbles pause with playback and replay starts cleanly',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await slide(page,4,1000);
 const bubble=page.locator('.room-post-bubble');await expect(bubble).toHaveCount(1);const text=await bubble.textContent();
 await page.getByRole('button',{name:'Pause demo animation',exact:true}).click();await page.clock.runFor(20_000);await expect(bubble).toHaveText(text!);
 await page.getByRole('button',{name:'Replay current demo slide',exact:true}).click();await expect(bubble).toHaveCount(0);await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(1000);await expect(bubble).toHaveCount(1);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();expect(await stored(page)).toEqual(saved);
});

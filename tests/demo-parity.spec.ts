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
 await page.getByRole('button',{name:/Scenario walkthrough with fictional personas/}).click();
 await expect(page.locator('.phone')).toHaveAttribute('data-session','demo');
}
async function scenario(page:Page,index:number,time=0){
 await page.getByRole('combobox',{name:'Demo scenario',exact:true}).selectOption(String(index));
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

test('the three fictional scenarios use the live quest, Meet F2F and classroom discussion controls',async({page})=>{
 const errors=await start(page);
 await page.getByRole('button',{name:'Hide discussions',exact:true}).click();
 const saved=await stored(page);await enterDemo(page);
 const toolbar=page.getByRole('region',{name:'Scenario walkthrough with fictional personas'});
 await expect(toolbar.getByRole('option')).toHaveText(['Jamie, Year 1 · Table tennis','Sam, Year 2 · Meet F2F','Alex, Year 3 · Class forum']);
 await toolbar.getByRole('button',{name:'Scenario notes',exact:true}).click();
 await expect(toolbar.getByText('Find a quest you might join. Then show what you could say when you arrive.',{exact:false})).toBeVisible();
 await expect(toolbar.getByText(/We walked through three fictional scenarios to identify what to test next/)).toBeVisible();
 await scenario(page,0,6000);
 const tennis=page.locator('[data-quest-id="table-tennis"]');
 await expect(tennis).toContainText('LG1 · Court 4');
 await expect(tennis).toContainText('Today · 6:00 PM');
 await expect(tennis.getByRole('button',{name:'Accept quest'})).toBeInViewport();
 await expect(toolbar.getByText(/^At arrival.*Mind if I join/)).toBeVisible();

 await scenario(page,1,4400);
 await expect(page.locator('[data-quest-id="study-buddy"]')).toContainText('Joined');
 await page.clock.runFor(7500);
 const meet=page.getByRole('dialog',{name:'Meet Sophie face to face',exact:true});
 await expect(meet.getByText('For COMP 1021 · L1, which Python idea has been most interesting so far?')).toBeVisible();

 await scenario(page,2,1600);
 await expect(page.locator('[data-quest-id="demo-ai-review"]')).toContainText('Compare AI lecture examples');
 await page.clock.runFor(4100);
 await expect(page.getByRole('heading',{name:'COMP 2211 · L1 Classroom'})).toBeVisible();
 await page.clock.runFor(6500);
 const post=page.locator('.social-post').filter({has:page.getByRole('heading',{name:'Which AI example should we bring?',exact:true})});
 await expect(post).toContainText('I’ll bring the spam-filter example to the meetup. Which example did everyone else pick?');
 await expect(toolbar.getByText(/^At arrival.*Which example did you pick/)).toBeVisible();

 expect(await stored(page)).toEqual(saved);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();
 await expect(page.locator('.profile-card h2')).toHaveText('Real Student');
 await page.locator('nav').getByRole('button',{name:'Campus',exact:true}).click();
 await expect(page.getByRole('button',{name:'Show discussions',exact:true})).toBeVisible();
 expect(await stored(page)).toEqual(saved);
 expect(errors).toEqual([]);
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
 await start(page);await enterDemo(page);await scenario(page,1,7500);
 await page.getByRole('button',{name:/Throw a hello/}).click();await page.clock.runFor(5000);await expect(page.locator('.hello-pending')).toBeVisible();
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(3000);await expect(page.locator('.peer-person .world-name').first()).toContainText('Sophie');
});

test('demo quest invitations freeze while paused and never leak into the saved session',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await scenario(page,0);
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
  await page.setViewportSize({width,height});await start(page);await enterDemo(page);await scenario(page,1,7500);
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


test('replaying Alex clears the reply and pauses the scenario on reduced motion',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await scenario(page,2,12000);
 const reply=page.locator('.social-comment').getByText('I’ll bring the spam-filter example to the meetup. Which example did everyone else pick?',{exact:true});await expect(reply).toBeVisible();
 await page.getByRole('button',{name:'Pause demo animation',exact:true}).click();
 await page.clock.runFor(20000);await expect(reply).toBeVisible();
 await page.getByRole('button',{name:'Replay current scenario',exact:true}).click();
 await expect(reply).toHaveCount(0);
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();
 await page.clock.runFor(9600);
 await expect(page.getByRole('textbox',{name:'Write a comment'})).toHaveValue(/spam-filter example/);
 await expect(reply).toHaveCount(0);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();expect(await stored(page)).toEqual(saved);
});

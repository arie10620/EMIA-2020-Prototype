import {test,expect,type Page} from '@playwright/test';
import {demoScenarios} from '../src/demoPlayback';
import {eligible} from '../src/model';

const [sam, ,alex]=demoScenarios;
const samClassmate=eligible(sam.location)[0].name;
const alexClassmate=eligible(alex.location)[0].name;
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
async function scenario(page:Page,index:number){
 await page.getByRole('combobox',{name:'Demo scenario',exact:true}).selectOption(String(index));
}
async function playFor(page:Page,time:number){
 const play=page.getByRole('button',{name:'Play demo animation',exact:true});
 if(await play.isVisible())await play.click();
 await page.clock.runFor(time);
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

test('the two-minute walkthrough autoplays Sam, Jamie and Alex and loops back to Sam',async({page})=>{
 const errors=await start(page);
 await page.getByRole('button',{name:'Hide discussions',exact:true}).click();
 const saved=await stored(page);
 await enterDemo(page);
 const toolbar=page.getByRole('region',{name:'Scenario walkthrough with fictional personas'});
 const chooser=toolbar.getByRole('combobox',{name:'Demo scenario'});
 await expect(chooser.getByRole('option')).toHaveText([
  'Sam, Year 2 · Project groupmate','Jamie, Year 1 · Table-tennis quest','Alex, Year 3 · Homework and classmates',
 ]);
 await expect(toolbar.getByRole('progressbar').locator('span')).toHaveCount(1);
 await expect(toolbar.getByText('Scenario notes')).toHaveCount(0);
 await playFor(page,7400);
 await expect(page.locator('nav').getByRole('button',{name:'Chats',exact:true})).toHaveClass(/active/);
 await expect(page.locator('.conversation-row strong')).toHaveText(samClassmate);
 await page.clock.runFor(31100);
 await expect(page.getByRole('dialog',{name:`Meet ${samClassmate} face to face`,exact:true})).toContainText('campus problem');
 await expect(page.getByText('Hey, are you in EMIA 2020 too?',{exact:true})).toBeVisible();
 await expect(page.getByText('Sounds good! See you outside the classroom.',{exact:true})).toBeVisible();

 await page.clock.runFor(9900);
 await expect(chooser).toHaveValue('1');
 await expect(page.getByRole('button',{name:/New quest for your interests.*Table tennis doubles/})).toBeVisible();
 await page.clock.runFor(3300);
 const tennis=page.locator('[data-quest-id="table-tennis"]');
 await expect(tennis).toContainText('LG1 · Court 4');
 await expect(tennis).toContainText('Today · 6:00 PM');
 await page.clock.runFor(6500);
 await expect(tennis).toContainText(/Joined.*\+1 level/);

 await page.clock.runFor(12300);
 await expect(chooser).toHaveValue('2');
 await expect(page.getByRole('textbox',{name:'Post title'})).toHaveValue('Stuck on Q3');
 await expect(page.getByRole('textbox',{name:'Post description'})).toHaveValue(/^How do/);
 await page.clock.runFor(15200);
 const post=page.locator('.social-post').filter({has:page.getByRole('heading',{name:'Stuck on Q3'})});
 await expect(post.locator('.social-comment').first()).toContainText(alexClassmate);
 await expect(post).toContainText('That worked, thanks!');
 await expect(post.locator('.social-comment').last()).toContainText('I’ll be in lecture tomorrow');
 await page.clock.runFor(27200);
 await expect(page.getByRole('dialog',{name:`Meet ${alexClassmate} face to face`,exact:true})).toBeVisible();
 await expect(page.getByText('Sure! I’ll save you a seat.',{exact:true})).toBeVisible();
 await page.clock.runFor(4800);
 await expect(page.locator('.world-chat-heading strong')).toHaveText(alexClassmate);
 await page.clock.runFor(2900);
 await expect(chooser).toHaveValue('0');

 expect(await stored(page)).toEqual(saved);
 await toolbar.getByRole('button',{name:'Exit demo walkthrough'}).click();
 await expect(page.locator('.profile-card h2')).toHaveText('Real Student');
 await page.locator('nav').getByRole('button',{name:'Campus',exact:true}).click();
 await expect(page.getByRole('button',{name:'Show discussions',exact:true})).toBeVisible();
 expect(await stored(page)).toEqual(saved);
 expect(errors).toEqual([]);
});


test('the next arrow cycles through personas and preserves playback state',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await start(page);await enterDemo(page);
 const chooser=page.getByRole('combobox',{name:'Demo scenario'});
 const next=page.getByRole('button',{name:'Next persona',exact:true});
 await expect(next).toBeInViewport();
 await next.click();
 await expect(chooser).toHaveValue('1');
 await expect(page.getByRole('button',{name:'Play demo animation',exact:true})).toBeVisible();
 await playFor(page,800);
 await next.click();
 await expect(chooser).toHaveValue('2');
 await expect(page.getByRole('button',{name:'Pause demo animation',exact:true})).toBeVisible();
 await expect(page.getByRole('progressbar',{name:'Alex walkthrough progress'})).toHaveAttribute('aria-valuenow','0');
 await next.click();
 await expect(chooser).toHaveValue('0');
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
 await start(page);await enterDemo(page);await playFor(page,2100);
 await page.getByRole('button',{name:/Throw a hello/}).click();await page.clock.runFor(5000);await expect(page.locator('.hello-pending')).toBeVisible();
 await page.getByRole('button',{name:'Play demo animation',exact:true}).click();await page.clock.runFor(3000);await expect(page.locator('.peer-person .world-name').first()).toContainText(samClassmate);
});

test('demo quest invitations freeze while paused and never leak into the saved session',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await scenario(page,1);
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
  await page.setViewportSize({width,height});await start(page);await enterDemo(page);await playFor(page,2100);
  const strip=await page.locator('.demo-strip').boundingBox(),dialog=await page.getByRole('dialog',{name:'Meet Unknown',exact:true}).boundingBox();expect(strip).not.toBeNull();expect(dialog).not.toBeNull();expect(dialog!.y).toBeGreaterThanOrEqual(strip!.y+strip!.height);expect(dialog!.y+dialog!.height).toBeLessThanOrEqual(height);
  const hello=page.getByRole('button',{name:/Throw a hello/});await expect(hello).toBeInViewport();await page.keyboard.press('Escape');await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}


test('desktop shows the persona beside a focus-trapped phone dialog from 1024px',async({page})=>{
 await page.setViewportSize({width:1023,height:800});
 await start(page);
 const phone=page.locator('.phone'),panel=page.locator('.demo-scenario-panel');
 await expect(panel).toHaveCount(0);
 await enterDemo(page);
 await expect(panel).toBeHidden();
 await page.setViewportSize({width:1024,height:800});
 await expect(panel.getByRole('heading',{name:'Find a project groupmate'})).toBeVisible();
 await scenario(page,1);
 await expect(panel.getByRole('heading',{name:'Meet through a shared activity'})).toBeVisible();
 await playFor(page,8000);
 const quests=phone.getByRole('dialog',{name:'Lobby quests',exact:true});
 await expect(quests).toBeVisible();
 const [profileBox,phoneBox,dialogBox]=await Promise.all([panel.boundingBox(),phone.boundingBox(),quests.boundingBox()]);
 expect(profileBox!.x+profileBox!.width).toBeLessThan(phoneBox!.x);
 expect(dialogBox!.x).toBeGreaterThanOrEqual(phoneBox!.x);
 expect(dialogBox!.x+dialogBox!.width).toBeLessThanOrEqual(phoneBox!.x+phoneBox!.width);
 expect(dialogBox!.y+dialogBox!.height).toBeLessThanOrEqual(800);

 const close=quests.getByRole('button',{name:'Close lobby quests'});
 await expect(close).toBeFocused();
 await panel.getByRole('heading',{name:'Scenario goal'}).click();
 await expect(phone).toHaveAttribute('data-demo-playing','true');
 await expect(close).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 await expect(quests.getByRole('button',{name:'Accept quest'}).last()).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(close).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(quests).toHaveCount(0);
 await expect(phone).toHaveAttribute('data-demo-playing','false');

 await scenario(page,2);
 await expect(panel.getByRole('heading',{name:'A homework question can start a friendship'})).toBeVisible();
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();
 await expect(panel).toHaveCount(0);
 await expect(phone).toHaveAttribute('data-session','live');
});


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


test('Sam types progressively, pauses mid-draft, and starts cleanly on replay',async({page})=>{
 await start(page);const saved=await stored(page);await enterDemo(page);await playFor(page,10400);
 const draft=page.getByRole('textbox',{name:'Message',exact:true});
 await expect(draft).toHaveValue(/^Hey, a/);
 await page.getByRole('button',{name:'Pause demo animation',exact:true}).click();
 await expect(page.getByRole('button',{name:'Play demo animation',exact:true})).toBeVisible();
 await page.clock.runFor(100);
 const partial=await draft.inputValue();
 expect(partial).not.toContain('EMIA 2020 too?');
 await page.clock.runFor(3000);
 await expect(draft).toHaveValue(partial);
 await playFor(page,3900);
 await expect(page.getByText('Hey, are you in EMIA 2020 too?',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Replay current persona',exact:true}).click();
 await playFor(page,1200);
 await expect(page.getByRole('dialog',{name:'Meet Unknown',exact:true})).toBeVisible();
 await expect(draft).toHaveCount(0);
 await page.getByRole('button',{name:'Exit demo walkthrough',exact:true}).click();expect(await stored(page)).toEqual(saved);
});

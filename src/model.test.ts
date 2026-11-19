import {demoFixture,demoTitles} from './demoPlayback.ts';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {courses,interests,demo,eligible,recommended,shared,reply,peerName,advanceHellos,pathTo,walkable,obstacles,roomPositions} from './model.ts';
import {initialGame,joinQuest,createQuest,questFull} from './quests.ts';
import {matchingQuests} from './alerts.ts';
test('Quest alerts match interests, respect class sections, and exclude own or full quests',()=>{const base={id:'alert',lobby:'COMP 1021 · L1',hostId:'p0-0',hostName:'Sophie',title:'Photo walk',place:'Sundial',when:'Today',details:'',capacity:2,participants:[],interests:['Photography']};const prefs={enabled:true,interests:['Photography']};assert.equal(matchingQuests([base],prefs,['COMP 1021 · L1']).length,1);assert.equal(matchingQuests([base],prefs,['COMP 1021 · L2']).length,0);assert.equal(matchingQuests([{...base,lobby:'Library'}],prefs,[]).length,1);assert.equal(matchingQuests([{...base,hostId:'you'}],prefs,['COMP 1021 · L1']).length,0);assert.equal(matchingQuests([{...base,participants:['a','b']}],prefs,['COMP 1021 · L1']).length,0);assert.equal(matchingQuests([base],{...prefs,enabled:false},['COMP 1021 · L1']).length,0);assert.equal(matchingQuests([base],{enabled:true,interests:['Cooking']},['COMP 1021 · L1']).length,0);});
test('Additional sample courses preserve existing library presence IDs',()=>{assert.equal(eligible('Library')[0].id,'p6-0');assert.equal(eligible('Dorm common area')[0].id,'p7-0');assert.equal(eligible('COMP 2011 · L3').length,4);});
test('Joining awards a level exactly once and locks a fulfilled quest',()=>{const game=joinQuest(initialGame,'table-tennis');assert.equal(game.joined.length,1);assert.ok(questFull(game.quests.find(q=>q.id==='table-tennis')!));assert.equal(joinQuest(game,'table-tennis'),game);assert.equal(joinQuest(game,'table-tennis','another-student'),game);assert.equal(initialGame.joined.length,0);});
test('User-created quests preserve the requested capacity and do not reward the host',()=>{const quest={id:'new-quest',lobby:'Library',hostId:'you',hostName:'Jamie',title:'Table tennis',place:'LG1 Court 4',when:'Today at 6',details:'',capacity:2,participants:[]};let game=createQuest(initialGame,quest);assert.equal(game.quests[0].participants.length,0);assert.equal(joinQuest(game,quest.id),game);game=joinQuest(game,quest.id,'peer-a');assert.equal(questFull(game.quests[0]),false);game=joinQuest(game,quest.id,'peer-b');assert.equal(questFull(game.quests[0]),true);assert.equal(joinQuest(game,quest.id,'peer-c'),game);assert.equal(game.joined.length,0);assert.equal(createQuest(game,{...quest,id:'invalid',capacity:0}),game);});
test('Every section has isolated presence and three eligible recommendations',()=>{for(const course of courses)for(const section of course.sections){const lobby=`${course.code} · ${section}`;const present=eligible(lobby);assert.equal(present.length,4);assert.ok(present.every(p=>p.lobby===lobby));const other=eligible(`${course.code} · ${section==='L1'?'L2':'L1'}`);assert.ok(!present.some(p=>other.some(q=>q.id===p.id)));assert.equal(recommended(demo,lobby).length,3);}});
test('Library and common area have separate presence, including Firebirds',()=>{const lib=eligible('Library'),dorm=eligible('Dorm common area');assert.equal(lib.length,4);assert.equal(dorm.length,4);assert.ok(lib.some(p=>p.avatar.type==='Firebird'));assert.ok(!lib.some(p=>dorm.some(q=>q.id===p.id)));});
test('Recommendations are deterministic and ordered by actual interest overlap',()=>{const ranked=recommended(demo,'Library');assert.deepEqual(ranked,recommended(demo,'Library'));assert.ok(shared(demo,ranked[0]).length>=shared(demo,ranked[1]).length);const changed={...demo,interests:['Anime','Cooking','Jazz']};assert.notEqual(recommended(changed,'Library')[0].id,ranked[0].id);});
test('Movement routes around furniture and rejects obstacles and outside targets',()=>{for(const obs of Object.values(obstacles)){const path=pathTo({x:3,y:4.8},{x:.6,y:5.6},obs);assert.ok(path.length>0);assert.ok(path.every(p=>walkable(p,obs)));assert.deepEqual(pathTo({x:3,y:4.8},{x:-2,y:3},obs),[]);const o=obs[0];assert.deepEqual(pathTo({x:3,y:4.8},{x:o.x+.3,y:o.y+.3},obs),[]);}});
test('Scripted responses follow topics with a friendly fallback',()=>{assert.match(reply('hiking'),/trail/);assert.match(reply('photography'),/photos/);assert.match(reply('coffee'),/coffee/);assert.match(reply('something unique'),/glad you said hello/);});

test('Every redesigned room keeps player and peer spawn positions clear of furniture',()=>{for(const kind of ['Classroom','Library','Dorm'] as const){assert.ok(walkable({x:3,y:4.8},obstacles[kind]),kind+' user spawn');for(const pos of roomPositions[kind])assert.ok(walkable(pos,obstacles[kind]),kind+' peer spawn '+JSON.stringify(pos));}});

test('Demo replay fixtures isolate quest, profile, class, and conversation progress',()=>{const first=demoFixture(6,initialGame);const next=joinQuest(first.game,'table-tennis');assert.equal(next.joined.length,1);assert.equal(initialGame.joined.length,0);first.profile.name='Changed in demo';first.profile.classes.push('COMP 2011 · L3');first.threads['example']={status:'accepted',acceptedAt:0,messages:[{text:'Demo only',own:true}]};const replay=demoFixture(6,initialGame);assert.equal(replay.profile.name,'Firebird Chan');assert.deepEqual(replay.profile.classes,['COMP 1021 · L1']);assert.deepEqual(replay.threads,{});assert.equal(replay.game.joined.length,0);assert.equal(replay.game.quests.find(q=>q.id==='table-tennis')!.participants.length,2);});

test('The demo keeps Firebird Chan and the scarf across every feature and uses one introduction/chat chapter',()=>{for(let slide=1;slide<demoTitles.length;slide++){const fixture=demoFixture(slide,initialGame);assert.equal(fixture.profile.name,'Firebird Chan');assert.equal(fixture.profile.avatar.type,'Firebird');assert.equal(fixture.profile.avatar.accessory,'Scarf');}assert.equal(demoTitles.length,9);assert.equal(demoTitles[5],'Introduction & Chat');});

import {availableForums,canAccessForum,addForumPost,addForumReply,meetingTopics,toggleForumLike,forumFeed,communityName} from './forums.ts';
import {demoEvents,demoDurations} from './demoPlayback.ts';
test('Forums are limited to selected interests and exact lecture sections',()=>{const p={...demo,interests:['Hiking','Hiking'],classes:['COMP 1021 · L1']};assert.equal(availableForums(p).length,2);assert.ok(canAccessForum(p,'interest:Hiking'));assert.ok(canAccessForum(p,'class:COMP 1021 · L1'));assert.equal(canAccessForum(p,'class:COMP 1021 · L2'),false);assert.equal(canAccessForum(p,'interest:Cooking'),false);assert.deepEqual(availableForums({...p,interests:[],classes:[]}),[]);});
test('Forum posting and replies lose access as soon as membership is removed',()=>{const p={...demo,interests:['Hiking'],classes:[]},forum=availableForums(p)[0],post={id:'one',title:'Weekend hike',text:'Who is coming?',author:p.name,replies:[]};const store=addForumPost({},p,forum,post);assert.equal(store[forum.id].length,1);const replied=addForumReply(store,p,forum.id,post.id,'Count me in');assert.equal(replied[forum.id][0].replies[0].author,p.name);const removed={...p,interests:[]};assert.equal(addForumPost(store,removed,forum,post),store);assert.equal(addForumReply(store,removed,forum.id,post.id,'No access'),store);assert.equal(addForumPost(store,p,forum,{...post,text:' '}),store);});
test('Face to face topics reflect shared interests and provide fallback topics',()=>{const p=eligible('Library')[0];const profile={...demo,interests:[p.interests[0]]};assert.ok(meetingTopics(profile,p)[0].includes(p.interests[0].toLowerCase()));assert.ok(meetingTopics({...demo,interests:[],classes:[]},p).length>=2);});
test('Every demo chapter has a complete looping timeline and the shared forum post flow',()=>{assert.equal(demoTitles.length,demoDurations.length);for(let i=0;i<demoTitles.length;i++){assert.ok(demoEvents(i).length);assert.ok(demoEvents(i).every(e=>e.at<demoDurations[i]));}assert.ok(demoEvents(5).some(e=>e.action==='meet'));assert.ok(demoEvents(8).some(e=>e.action==='forum-post'));});

test('Titled posts preserve descriptions and likes toggle once per member',()=>{const profile={...demo,interests:['Hiking']},forum=availableForums(profile)[0],post={id:'social',title:'Friday hike',text:'A hike this Friday?',author:profile.name,replies:[]};const store=addForumPost({},profile,forum,post);assert.equal(store[forum.id][0].title,'Friday hike');assert.equal(store[forum.id][0].text,post.text);assert.equal(addForumPost(store,profile,forum,{...post,title:' '}),store);const liked=toggleForumLike(store,profile,forum.id,post.id);assert.deepEqual(liked[forum.id][0].likedBy,['you']);assert.deepEqual(toggleForumLike(liked,profile,forum.id,post.id)[forum.id][0].likedBy,[]);assert.equal(toggleForumLike(store,{...profile,interests:[]},forum.id,post.id),store);assert.equal(toggleForumLike(store,profile,forum.id,'missing'),store);assert.equal(store[forum.id][0].likedBy,undefined);});
test('Forums demo shows the same post, like, and comment flow',()=>{const actions=demoEvents(8).map(e=>e.action);for(const action of ['forum-post','forum-like','forum-comments','forum-comment-post'])assert.ok(actions.includes(action as typeof actions[number]));assert.equal(actions.includes('forum-title' as typeof actions[number]),true);});

test('Community feed combines only joined Circles and exact Classrooms, newest first',()=>{const profile={...demo,interests:['Hiking'],classes:['COMP 1021 ? L1']};const make=(id:string,createdAt:number)=>({id,text:id,author:'Sam',createdAt,replies:[]});const store={'interest:Hiking':[make('hike',10)],'class:COMP 1021 ? L1':[make('lecture',20)],'class:COMP 1021 ? L2':[make('other-section',30)],'interest:Cooking':[make('cooking',40)]};assert.deepEqual(forumFeed(profile,store).map(e=>e.post.id),['lecture','hike']);assert.deepEqual(forumFeed(profile,store,'interest:Hiking').map(e=>e.post.id),['hike']);assert.deepEqual(forumFeed(profile,store,'interest:Cooking'),[]);assert.equal(communityName(availableForums(profile)[0]),'Hiking Circle');assert.equal(communityName(availableForums(profile)[1]),'COMP 1021 ? L1 Classroom');});


import {roomAnnouncement,ROOM_POST_LIFETIME,type ForumStore} from './forums.ts';
test('Room posts link the latest present author to the original accessible thread and expire',()=>{
 const profile={...demo,interests:['Hiking'],classes:['COMP 1021 L1']},present=eligible('Library'),now=100_000;
 const post={id:'room-post',title:'Walk after studying?',text:'Anyone coming?',author:present[0].name,authorId:present[0].id,room:'Library',createdAt:now-1000,replies:[]};
 const store:ForumStore={'interest:Hiking':[post]};
 const announcement=roomAnnouncement(profile,store,'Library',present,now)!;
 assert.equal(announcement.post,post);assert.equal(announcement.forum.id,'interest:Hiking');assert.equal(announcement.authorId,present[0].id);
 assert.equal(roomAnnouncement(profile,store,'Dorm common area',present,now),null);
 assert.equal(roomAnnouncement(profile,store,'Library',[],now),null);
 assert.equal(roomAnnouncement({...profile,interests:[]},store,'Library',present,now),null);
 assert.equal(roomAnnouncement(profile,store,'Library',present,post.createdAt+ROOM_POST_LIFETIME),null);
 assert.equal(roomAnnouncement(profile,store,'Library',present,post.createdAt-1),null);
 const own={...post,id:'own',authorId:'you',createdAt:now};
 assert.equal(roomAnnouncement({...profile,name:'Renamed'}, {'interest:Hiking':[post,own]},'Library',present,now)?.post.id,'own');
});
test('Classroom announcements stay in the exact lecture and unplaced interest posts stay in the forum',()=>{
 const profile={...demo,interests:['Hiking'],classes:['COMP 1021 L1','COMP 1021 L2']},now=100_000;
 const post={id:'class-post',title:'Question',text:'Can someone explain?',author:profile.name,authorId:'you',createdAt:now,replies:[]};
 const store={'class:COMP 1021 L1':[post]};
 assert.equal(roomAnnouncement(profile,store,'COMP 1021 L1',[],now)?.post.id,post.id);
 assert.equal(roomAnnouncement(profile,store,'COMP 1021 L2',[],now),null);
 assert.equal(roomAnnouncement(profile,{'class:COMP 1021 L1':[{...post,room:'Library'}]},'Library',[],now),null);
 assert.equal(roomAnnouncement(profile,{'interest:Hiking':[post]},'Library',[],now),null);
});


import {seedRoomPosts,simulateRoomPost,MAX_SIMULATED_ROOM_POSTS} from './forums.ts';
test('Fictional room history seeds once, preserves real threads, and does not trigger stale bubbles',()=>{
 const now=100_000,profile={...demo,interests:['Hiking']},present=eligible('Library');
 const own={id:'real',title:'My plans',text:'A real local post',author:profile.name,authorId:'you',replies:[{author:'Sam',text:'Joining!'}]};
 const original={'interest:Hiking':[own]};
 const seeded=seedRoomPosts(original,profile,'Library',present,now);
 assert.equal(Object.values(seeded).flat().filter(p=>p.simulated).length,3);
 assert.equal(seeded['interest:Hiking'].find(p=>p.id==='real'),own);
 assert.equal(seedRoomPosts(seeded,profile,'Library',present,now),seeded);
 assert.equal(roomAnnouncement(profile,seeded,'Library',present,now),null);
 assert.equal(original['interest:Hiking'].length,1);
});
test('Random fictional posts use present students, respect sections, and have a finite history',()=>{
 const now=100_000,profile={...demo,interests:['Hiking','Photography']},present=eligible('Library');
 let store:ForumStore={};
 for(let i=0;i<30;i++)store=simulateRoomPost(store,profile,'Library',present,now+i,()=>0);
 const posts=Object.values(store).flat();
 assert.equal(posts.length,MAX_SIMULATED_ROOM_POSTS);
 assert.equal(new Set(posts.map(p=>p.id)).size,posts.length);
 assert.ok(posts.every(p=>p.simulated&&p.room==='Library'&&present.some(peer=>peer.id===p.authorId)));
 assert.equal(simulateRoomPost(store,profile,'Library',present,now+100,()=>0),store);
 const section=profile.classes[0],classStore=simulateRoomPost({},profile,section,eligible(section),now,()=>0);
 assert.deepEqual(Object.keys(classStore),[`class:${section}`]);
 assert.ok(roomAnnouncement(profile,classStore,section,eligible(section),now));
 assert.equal(roomAnnouncement(profile,classStore,'Library',present,now),null);
 const empty={};assert.equal(simulateRoomPost(empty,{...profile,interests:[],classes:[]},'Library',present,now),empty);
 assert.equal(simulateRoomPost(empty,profile,'Library',[],now),empty);
});
test('Lobby walkthrough includes fictional room posts across its location changes',()=>{
 const actions=demoEvents(4);assert.equal(actions.filter(event=>event.action==='room-post').length,3);
});


test('Face to face keeps the shared class alongside many shared interests and respects exact sections',()=>{
 const peer=eligible(demo.classes[0])[0];
 const profile={...demo,interests:[...peer.interests]};
 const topics=meetingTopics(profile,peer);
 assert.equal(topics.length,4);
 assert.ok(topics.some(topic=>topic.includes(peer.lobby)));
 assert.ok(topics.some(topic=>topic.includes(peer.interests[0].toLowerCase())));
 const otherSection={...profile,classes:[peer.lobby.replace('L1','L2')]};
 assert.ok(!meetingTopics(otherSection,peer).some(topic=>topic.includes(peer.lobby)));
 const classOnly=meetingTopics({...profile,interests:[]},peer);
 assert.ok(classOnly.some(topic=>topic.includes(peer.lobby)));
});


test('Student names depend only on accepted hellos, not opening a profile or a pending invitation',()=>{
 const peer=eligible('Library')[0];
 assert.equal(peerName(peer),'Unknown');
 assert.equal(peerName(peer,{status:'pending',acceptedAt:0,messages:[]}),'Unknown');
 assert.equal(peerName({...peer},undefined),'Unknown');
 const accepted={status:'accepted' as const,acceptedAt:Date.now(),messages:[]};
 assert.equal(peerName(peer,accepted),peer.name);
 assert.equal(peerName(peer,JSON.parse(JSON.stringify(accepted))),peer.name);
 assert.equal(peerName(eligible('Library')[1]),'Unknown');
});


test('Hello acceptance is identical for live and presentation clocks and freezes while paused',()=>{
 const pending={one:{status:'pending' as const,acceptedAt:2700,messages:[]}};
 assert.equal(advanceHellos(pending,2699),pending);
 assert.equal(advanceHellos(pending,5000,true),pending);
 const accepted=advanceHellos(pending,2700);
 assert.equal(accepted.one.status,'accepted');
 assert.equal(accepted.one.messages.length,1);
 assert.equal(advanceHellos(accepted,6000),accepted);
 assert.equal(pending.one.status,'pending');
 const epoch=Date.now();
 const live=advanceHellos({one:{...pending.one,acceptedAt:epoch+2700}},epoch+2700);
 assert.deepEqual(live.one.messages,accepted.one.messages);
});


import {conversationGroups,conversationSuggestions,conversationReply} from './conversations.ts';
import {interestPresets,coursePresets,generalPresets} from './conversationPresets.ts';

test('Every selectable interest and course has four distinct preset conversations and matching replies',()=>{
 assert.deepEqual(Object.keys(interestPresets).sort(),[...interests].sort());
 assert.deepEqual(Object.keys(coursePresets).sort(),courses.map(course=>course.code).sort());
 for(const [interest,presets] of Object.entries(interestPresets)){
  assert.equal(presets.length,4,interest);
  assert.equal(new Set(presets.map(([question])=>question)).size,4,interest);
  for(const [question,answer] of presets)assert.equal(conversationReply(question),answer,interest);
 }
 for(const course of courses){
  const section=`${course.code} \u00b7 L1`,peer={...eligible('Library')[0],lobby:section};
  const profile={...demo,classes:[section]},group=conversationGroups(profile,peer).find(group=>group.kind==='class')!;
  assert.equal(group.prompts.length,4,course.code);
  for(const prompt of group.prompts){assert.ok(prompt.question.includes(section));assert.equal(conversationReply(prompt.question,profile,peer),prompt.answer);}
 }
 assert.equal(Object.values(generalPresets).flat().length,16);
});

test('Suggestion sets rotate, keep a shared class visible, and never label unrelated interests or sections as shared',()=>{
 const peer=eligible(demo.classes[0])[0],profile={...demo,interests:[...peer.interests]};
 const first=conversationSuggestions(profile,peer),next=conversationSuggestions(profile,peer,1);
 assert.equal(first.length,4);assert.equal(next.length,4);
 assert.ok(first.some(prompt=>prompt.question.includes(peer.lobby)));
 assert.ok(next.every((prompt,index)=>prompt.question!==first[index].question));
 const groups=conversationGroups({...profile,interests:['Swimming'],classes:[]},peer);
 assert.ok(!groups.some(group=>group.shared));assert.ok(!groups.some(group=>group.kind==='class'));
 assert.equal(conversationSuggestions({...profile,interests:[],classes:[]},peer).length,4);
 assert.ok(groups.some(group=>group.label==='Swimming'&&!group.shared));
});

test('Preset replies distinguish related topics and do not treat parts of unrelated words as interests',()=>{
 assert.equal(reply('A board game sounds good'),interestPresets['Board games'][0][1]);
 assert.equal(reply('I enjoy jazz music'),interestPresets.Jazz[0][1]);
 assert.equal(reply('A caf\u00e9 break?'),interestPresets.Coffee[0][1]);
 assert.equal(reply('Let us talk about education'),reply('something unique'));
});

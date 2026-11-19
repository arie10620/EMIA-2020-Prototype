import {advanceHellos,demo,eligible,type Thread} from './model.ts';
import {addForumPost,addForumReply,type ForumStore} from './forums.ts';
import {joinQuest,type Quest} from './quests.ts';
import type {Game} from './quests';

export const walkthroughTitle = 'Scenario walkthrough with fictional personas';
export const alexThread = 'demo-alex-homework';
export const tableTennisId = 'table-tennis';
export const demoReplyDelay = 1800;
export const helloDelay = 2700;
const designClass = 'EMIA 2020 · L1';
const programmingClass = 'COMP 1021 · L1';

type DraftAction = 'chat-draft'|'forum-title'|'forum-body'|'forum-draft';
type DemoEvent =
 | {at:number;action:'introduction'|'hello'|'chats'|'open-chat'|'meet'|'classroom'|'quest-notification'|'open-alert'|'focus-quest'|'accept-quest'|'forum-compose'|'forum-publish'|'forum-open'|'forum-reply'}
 | {at:number;action:DraftAction|'classmate-reply';text:string}
 | {at:number;action:'chat-send';reply:string};

export type Scenario = {
 name:string;
 year:number;
 title:string;
 headline:string;
 bio:string;
 traits:string[];
 goal:string;
 highlights:string[];
 location:string;
 interests:string[];
 duration:number;
 events:DemoEvent[];
};

function typeDraft(action:DraftAction,text:string,start:number):DemoEvent[] {
 let at=start,draft='';
 return Array.from(text,(character,index)=>{
  draft+=character;
  const cue:DemoEvent={at,action,text:draft};
  at+=/[.!?]/.test(character)?120:character===' '||index%8===6?75:35;
  return cue;
 });
}

export const demoScenarios:Scenario[] = [
 {
  name:'Sam',year:2,title:'Project groupmate',headline:'Find a project groupmate',
  bio:'Sam needs a groupmate for a cross-disciplinary design project.',
  traits:['EMIA 2020','Cross-Disciplinary Design Thinking'],
  goal:'Compare ideas with a classmate online and arrange to meet before lecture.',
  highlights:['Send a hello to a classmate','Talk about the project in Chats','Find an opener in Meet F2F'],
  location:designClass,interests:['Design'],duration:45000,
  events:[
   {at:1200,action:'introduction'},{at:3200,action:'hello'},{at:6800,action:'chats'},{at:8300,action:'open-chat'},
   ...typeDraft('chat-draft','Hey, are you in EMIA 2020 too?',9500),
   {at:11200,action:'chat-send',reply:'Yeah! Still looking for a group too.'},
   ...typeDraft('chat-draft','Want to design something for campus?',17500),
   {at:19500,action:'chat-send',reply:'I’m in. Maybe we could make campus signs easier to follow.'},
   ...typeDraft('chat-draft','Meet before lecture to sketch ideas?',26800),
   {at:28800,action:'chat-send',reply:'Sounds good! See you outside the classroom.'},
   {at:37500,action:'meet'},
  ],
 },
 {
  name:'Alex',year:3,title:'Homework and classmates',headline:'A homework question can start a friendship',
  bio:'Alex is open to meeting classmates and rarely checks campus apps. A stuck homework question gives Alex a reason to try the class forum.',
  traits:['COMP 1021','Python homework'],
  goal:'Get unstuck, thank the classmate who helped, and meet in the next lecture.',
  highlights:['Ask a homework question in the class forum','Send a hello to the classmate who replies','Keep talking in Chats and meet in class'],
  location:programmingClass,interests:['Programming'],duration:55000,
  events:[
   {at:1300,action:'forum-compose'},
   ...typeDraft('forum-title','Stuck on Q3',2300),
   ...typeDraft('forum-body','How do I loop through a list?',4600),
   {at:6450,action:'forum-publish'},{at:10600,action:'forum-open'},
   {at:12600,action:'classmate-reply',text:'Try a for loop over the list. No index needed.'},
   ...typeDraft('forum-draft','That worked, thanks!',14700),
   {at:16000,action:'forum-reply'},
   {at:19400,action:'classmate-reply',text:'Nice! I’ll be in lecture tomorrow if you want to compare notes.'},
   {at:21800,action:'introduction'},{at:23500,action:'hello'},{at:27000,action:'chats'},{at:28200,action:'open-chat'},
   ...typeDraft('chat-draft','Thanks for helping on Q3!',29600),
   {at:31100,action:'chat-send',reply:'Anytime! That one took me a while too.'},
   ...typeDraft('chat-draft','Want to sit together in lecture?',37400),
   {at:39200,action:'chat-send',reply:'Sure! I’ll save you a seat.'},
   {at:46700,action:'meet'},{at:51600,action:'classroom'},
  ],
 },
 {
  name:'Jamie',year:1,title:'Table-tennis quest',headline:'Meet through a shared activity',
  bio:'Jamie enjoys table tennis and worries about interrupting a group that already knows each other.',
  traits:['Table tennis','New to campus'],
  goal:'Find a casual meetup and accept a quest with an open spot.',
  highlights:['Receive a matching quest notification','Check the time and venue','Accept the table-tennis quest'],
  location:'Library',interests:['Table tennis'],duration:20000,
  events:[
   {at:2400,action:'quest-notification'},{at:6500,action:'open-alert'},
   {at:7200,action:'focus-quest'},{at:12800,action:'accept-quest'},
  ],
 },
];

export function demoFixture(scenario:Scenario,game:Game) {
 const {name,bio,interests,location} = scenario;
 const profile={...demo,name,intro:bio,interests:[...interests],classes:location==='Library'?[]:[location],avatar:{...demo.avatar}};
 const seededGame=structuredClone(game);
 const notification=location==='Library'?seededGame.quests.find(quest=>quest.id===tableTennisId):undefined;
 if(notification)seededGame.quests=seededGame.quests.filter(quest=>quest.id!==tableTennisId);
 return {profile,location,game:seededGame,notification};
}
export type ForumDraft = {title:string;body:string;reply:string};

export function demoFrame(scenario:Scenario,game:Game,time:number,epoch:number) {
 const seed=demoFixture(scenario,game);
 const target=eligible(seed.location)[0];
 const community={id:`class:${seed.location}`,kind:'class' as const,name:seed.location};
 const forumDraft:ForumDraft={title:'',body:'',reply:''};
 let threads:Record<string,Thread>={},forumStore:ForumStore={},draft='';
 let view:'campus'|'intro'|'world-chat'|'chat-list'|'chat'|'meet'|'quests'|'compose'|'thread'='campus';
 let alert:Quest|null=null,alertRead=false,focusQuest=false,flashUntil=0,orbUntil=0;
 let pendingReply:{at:number;text:string}|null=null;

 function settle(at:number) {
  const pending=threads[target.id]?.status==='pending';
  threads=advanceHellos(threads,at);
  if(pending&&threads[target.id]?.status==='accepted')view='world-chat';
  if(pendingReply&&pendingReply.at<=at){
   threads[target.id].messages.push({text:pendingReply.text,own:false});
   pendingReply=null;
  }
 }

 for(const cue of scenario.events){
  if(cue.at>time)break;
  // Cues run on the walkthrough's 100 ms clock.
  const at=Math.ceil(cue.at/100)*100;
  if(at>time)break;
  settle(at);
  switch(cue.action){
   case 'introduction':view='intro';break;
   case 'hello':threads[target.id]={status:'pending',acceptedAt:at+helloDelay,messages:[]};orbUntil=at+1000;view='campus';break;
   case 'chats':view='chat-list';break;
   case 'open-chat':view='chat';break;
   case 'chat-draft':draft=cue.text;break;
   case 'chat-send':
    threads[target.id].messages.push({text:draft,own:true});
    pendingReply={at:at+demoReplyDelay,text:cue.reply};
    draft='';
    break;
   case 'meet':view='meet';break;
   case 'classroom':view='world-chat';break;
   case 'quest-notification':
    if(seed.notification){
     alert=seed.notification;
     seed.game.quests.unshift(seed.notification);
    }
    break;
   case 'open-alert':alert=null;alertRead=true;view='quests';break;
   case 'focus-quest':focusQuest=true;break;
   case 'accept-quest':seed.game=joinQuest(seed.game,tableTennisId);flashUntil=at+2800;break;
   case 'forum-compose':view='compose';break;
   case 'forum-title':forumDraft.title=cue.text;break;
   case 'forum-body':forumDraft.body=cue.text;break;
   case 'forum-publish':
    forumStore=addForumPost(forumStore,seed.profile,community,{id:alexThread,title:forumDraft.title,text:forumDraft.body,author:seed.profile.name,authorId:'you',room:seed.location,createdAt:epoch+at,likedBy:[],replies:[]});
    view='campus';
    break;
   case 'forum-open':view='thread';break;
   case 'forum-draft':forumDraft.reply=cue.text;break;
   case 'forum-reply':
    forumStore=addForumReply(forumStore,seed.profile,community.id,alexThread,forumDraft.reply);
    forumDraft.reply='';
    break;
   case 'classmate-reply':
    forumStore=addForumReply(forumStore,{...seed.profile,name:target.name},community.id,alexThread,cue.text);
    break;
  }
 }
 settle(time);
 return {...seed,target,view,threads,forumStore,forumDraft,draft,alert,alertRead,focusQuest,
  orbUntil,flashUntil,pendingReply};
}

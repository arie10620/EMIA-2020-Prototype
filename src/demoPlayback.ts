import {demo} from './model.ts';
import type {Game} from './quests';

export const walkthroughTitle = 'Scenario walkthrough with fictional personas';
export const alexThread = 'demo-alex-homework';
export const tableTennisId = 'table-tennis';
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
  at+=/[.!?]/.test(character)?220:character===' '||index%8===6?120:70;
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
   {at:12800,action:'chat-send',reply:'Yeah! Still looking for a group too.'},
   ...typeDraft('chat-draft','Want to design something for campus?',17500),
   {at:21100,action:'chat-send',reply:'I’m in. Maybe we could make campus signs easier to follow.'},
   ...typeDraft('chat-draft','Meet before lecture to sketch ideas?',26800),
   {at:30500,action:'chat-send',reply:'Sounds good! See you outside the classroom.'},
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
   {at:7800,action:'forum-publish'},{at:10600,action:'forum-open'},
   {at:12600,action:'classmate-reply',text:'Try a for loop over the list. No index needed.'},
   ...typeDraft('forum-draft','That worked, thanks!',14700),
   {at:17000,action:'forum-reply'},
   {at:19400,action:'classmate-reply',text:'Nice! I’ll be in lecture tomorrow if you want to compare notes.'},
   {at:21800,action:'introduction'},{at:23500,action:'hello'},{at:27000,action:'chats'},{at:28200,action:'open-chat'},
   ...typeDraft('chat-draft','Thanks for helping on Q3!',29600),
   {at:32500,action:'chat-send',reply:'Anytime! That one took me a while too.'},
   ...typeDraft('chat-draft','Want to sit together in lecture?',37400),
   {at:41000,action:'chat-send',reply:'Sure! I’ll save you a seat.'},
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

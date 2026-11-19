import {demo} from './model.ts';
import type {Profile,Thread} from './model.ts';
import type {Game,Quest} from './quests';
import type {ForumStore} from './forums';

export const walkthroughTitle = 'Scenario walkthrough with fictional personas';
export const walkthroughTask = 'Find a quest you might join. Then show what you could say when you arrive.';
export const walkthroughTakeaway = 'We walked through three fictional scenarios to identify what to test next: whether students can find a meetup they’d join, whether the suggested openers feel natural, and whether the forum gives them a reason to return.';

type DemoEvent =
 | {at:number;action:'quests'|'close-quests'|'students'|'introduction'|'hello'|'meet'|'class-forum'|'forum-thread'|'forum-reply'}
 | {at:number;action:'focus-quest'|'accept-quest';questId:string}
 | {at:number;action:'forum-draft';text:string};

type Scenario = {
 name:string;
 year:number;
 title:string;
 setup:string;
 hypothesis:string;
 testQuestion:string;
 opener:string;
 openerAt:number;
 location:string;
 interests:string[];
 duration:number;
 events:DemoEvent[];
};

const pythonClass = 'COMP 1021 · L1';
const aiClass = 'COMP 2211 · L1';
export const alexThread = 'demo-alex-class-discussion';
const alexQuest:Quest = {
 id:'demo-ai-review',lobby:aiClass,hostId:'p11-0',hostName:'Ivy',
 title:'Compare AI lecture examples',place:'Library · Learning Commons',when:'Today · 5:00 PM',
 details:'Bring one example from the lecture you’d like to go over.',capacity:3,participants:[],interests:['Programming'],
};

export const demoScenarios:Scenario[] = [
 {
  name:'Jamie',year:1,title:'Table tennis',
  setup:'Jamie wants to meet classmates but worries about interrupting a group. Jamie checks the time and venue for a table-tennis quest.',
  hypothesis:'A shared activity gives Jamie a reason to turn up. Jamie might still hesitate if it’s unclear whether the others already know one another.',
  testQuestion:'Can students find a meetup they’d join, and can they tell whether newcomers are welcome?',
  opener:'Hi, I’m Jamie. Is this the table-tennis group? Mind if I join?',
  openerAt:5500,location:'Library',interests:['Table tennis'],duration:16000,
  events:[{at:700,action:'quests'},{at:2300,action:'focus-quest',questId:'table-tennis'}],
 },
 {
  name:'Sam',year:2,title:'Meet F2F',
  setup:'Sam wants a study partner from the same lecture. Sam finds a Python practice quest and opens Meet F2F for something to say.',
  hypothesis:'A prompt tied to a shared lecture could give Sam a specific way to start the conversation.',
  testQuestion:'Would students feel comfortable saying a suggested shared-class opener out loud?',
  opener:'For COMP 1021 · L1, which Python idea has been most interesting so far?',
  openerAt:11600,location:pythonClass,interests:['Programming'],duration:22000,
  events:[
   {at:700,action:'quests'},{at:3800,action:'accept-quest',questId:'study-buddy'},{at:5200,action:'close-quests'},
   {at:6100,action:'students'},{at:7300,action:'introduction'},{at:8600,action:'hello'},{at:11600,action:'meet'},
  ],
 },
 {
  name:'Alex',year:3,title:'Class forum',
  setup:'Alex is open to meeting people but rarely checks campus apps. Alex finds an AI lecture meetup and browses the classroom forum for a discussion worth replying to.',
  hypothesis:'The forum gives Alex a way into a group conversation before approaching anyone individually.',
  testQuestion:'Does following a classroom discussion give students a reason to open USTogether again?',
  opener:'I’ll bring the spam-filter example. Which example did you pick?',
  openerAt:10500,location:aiClass,interests:['Programming'],duration:22000,
  events:[
   {at:700,action:'quests'},{at:3700,action:'close-quests'},{at:4700,action:'class-forum'},
   {at:7300,action:'forum-thread'},{at:9300,action:'forum-draft',text:'I’ll bring the spam-filter example to the meetup. Which example did everyone else pick?'},
   {at:11500,action:'forum-reply'},
  ],
 },
];

export function demoFixture(scenario:Scenario,game:Game,now:number) {
 const {name,setup,interests,location} = scenario;
 const profile:Profile = {...demo,name,intro:setup,interests:[...interests],classes:location==='Library'?[]:[location],avatar:{...demo.avatar}};
 const seededGame = structuredClone(game);
 const forumStore:ForumStore = {};
 if (location===aiClass) {
  seededGame.quests.unshift(structuredClone(alexQuest));
  forumStore[`class:${aiClass}`] = [{
   id:alexThread,title:'Which AI example should we bring?',
   text:'For the lecture review meetup, I’m bringing the recommendation example. What would you like to compare?',
   author:alexQuest.hostName,authorId:alexQuest.hostId,room:location,simulated:true,createdAt:now-60000,replies:[],
  }];
 }
 return {profile,location,game:seededGame,threads:{} as Record<string,Thread>,forumStore};
}

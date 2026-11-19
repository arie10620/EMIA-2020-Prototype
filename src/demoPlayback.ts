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

type StepView =
 | {kind:'quests';focusQuest?:string}
 | {kind:'students'|'meet';joinedQuest:string}
 | {kind:'forum';thread?:string};

type ScenarioStep = {label:string;startsOn:DemoEvent['action']|'arrival';view:StepView};

export type Scenario = {
 name:string;
 year:number;
 title:string;
 headline:string;
 bio:string;
 traits:string[];
 goal:string;
 steps:[ScenarioStep,ScenarioStep,ScenarioStep];
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

function typeForumReply(text:string,start:number):DemoEvent[] {
 let at=start,draft='';
 const characters:DemoEvent[]=Array.from(text,(character,index)=>{
  draft+=character;
  const cue:DemoEvent={at,action:'forum-draft',text:draft};
  // Keep cues on the playback clock and pause briefly at word and sentence breaks.
  at+=/[.!?]/.test(character)?400:character===' '||index%7===5?200:100;
  return cue;
 });
 return [...characters,{at:at+700,action:'forum-reply'}];
}

export const demoScenarios:Scenario[] = [
 {
  name:'Jamie',year:1,title:'Table tennis',headline:'Meet through a shared activity',
  bio:'Jamie enjoys table tennis and worries about interrupting a group that already knows each other.',
  traits:['Table tennis','New to campus'],
  goal:'Find a casual meetup with classmates and think of something to say on arrival.',
  steps:[
   {label:'Open the quest board',startsOn:'quests',view:{kind:'quests'}},
   {label:'Check the time and venue',startsOn:'focus-quest',view:{kind:'quests',focusQuest:'table-tennis'}},
   {label:'Try an arrival opener',startsOn:'arrival',view:{kind:'quests',focusQuest:'table-tennis'}},
  ],
  setup:'Jamie wants to meet classmates but worries about interrupting a group. Jamie checks the time and venue for a table-tennis quest.',
  hypothesis:'A shared activity gives Jamie a reason to turn up. Jamie might still hesitate if it’s unclear whether the others already know one another.',
  testQuestion:'Can students find a meetup they’d join, and can they tell whether newcomers are welcome?',
  opener:'Hi, I’m Jamie. Is this the table-tennis group? Mind if I join?',
  openerAt:5500,location:'Library',interests:['Table tennis'],duration:16000,
  events:[{at:700,action:'quests'},{at:2300,action:'focus-quest',questId:'table-tennis'}],
 },
 {
  name:'Sam',year:2,title:'Meet F2F',headline:'Start with a shared class',
  bio:'Sam wants to connect with someone from the same programming lecture.',
  traits:['Programming','COMP 1021 · L1'],
  goal:'Find a study partner and get a class-specific opener for meeting in person.',
  steps:[
   {label:'Join Python practice',startsOn:'quests',view:{kind:'quests'}},
   {label:'Say hello to a classmate',startsOn:'students',view:{kind:'students',joinedQuest:'study-buddy'}},
   {label:'Open Meet F2F',startsOn:'meet',view:{kind:'meet',joinedQuest:'study-buddy'}},
  ],
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
  name:'Alex',year:3,title:'Class forum',headline:'Join the conversation in the forum',
  bio:'Alex is open to meeting classmates and rarely checks campus apps.',
  traits:['AI coursework','COMP 2211 · L1'],
  goal:'Find a class meetup and join a group conversation before meeting in person.',
  steps:[
   {label:'Find the lecture meetup',startsOn:'quests',view:{kind:'quests'}},
   {label:'Open the classroom discussion',startsOn:'class-forum',view:{kind:'forum'}},
   {label:'Reply to the thread',startsOn:'forum-thread',view:{kind:'forum',thread:alexThread}},
  ],
  setup:'Alex is open to meeting people but rarely checks campus apps. Alex finds an AI lecture meetup and browses the classroom forum for a discussion worth replying to.',
  hypothesis:'The forum gives Alex a way into a group conversation before approaching anyone individually.',
  testQuestion:'Does following a classroom discussion give students a reason to open USTogether again?',
  opener:'I’ll bring the spam-filter example. Which example did you pick?',
  openerAt:10500,location:aiClass,interests:['Programming'],duration:30000,
  events:[
   {at:700,action:'quests'},{at:3700,action:'close-quests'},{at:4700,action:'class-forum'},
   {at:7300,action:'forum-thread'},
   ...typeForumReply('I’ll bring the spam-filter example to the meetup. Which example did everyone else pick?',9300),
  ],
 },
];

export function stepStart(scenario:Scenario,step:ScenarioStep) {
 return step.startsOn==='arrival'
  ? scenario.openerAt
  : scenario.events.find(event=>event.action===step.startsOn)!.at;
}

export function demoPlaybackRange(scenario:Scenario,selectedStep?:number) {
 if(selectedStep===undefined)return {start:0,end:scenario.duration};
 const nextStep=scenario.steps[selectedStep+1];
 return {
  start:stepStart(scenario,scenario.steps[selectedStep]),
  end:nextStep?stepStart(scenario,nextStep):scenario.duration,
 };
}

export function currentDemoStep(scenario:Scenario,time:number) {
 return scenario.steps.reduce((active,step,index)=>time>=stepStart(scenario,step)?index:active,0);
}

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

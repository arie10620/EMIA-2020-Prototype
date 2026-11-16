import type {Profile,Thread} from './model';
import type {Game} from './quests';
export type DemoEvent={at:number;action:'name'|'intro'|'avatar'|'accessory'|'item'|'interest'|'search'|'class'|'location'|'move'|'students'|'introduction'|'hello'|'message'|'quests'|'accept'|'quest-open'|'quest-title'|'quest-place'|'quest-when'|'quest-capacity'|'quest-interest'|'quest-details'|'quest-post';value?:string};
export const demoTitles=['Profile','Avatar','Interests','Classes','Lobby','Introduction & Chat','Join a quest','Add a quest'];
export const demoDurations=[10000,10000,10000,10000,14000,14000,10000,18000];
const sample:Profile={name:'Firebird Chan',intro:'I like coastal hikes, photography, and coffee after class.',interests:['Hiking','Photography','Coffee','Cozy games'],classes:['COMP 1021 · L1'],avatar:{type:'Firebird',color:'#c9473d',clothes:'#709988',accessory:'Scarf',item:'Coffee',hair:'Short',skin:'#e7b58c'}};
export function demoFixture(slide:number,game:Game){const profile=structuredClone(sample);if(slide===0){profile.name='';profile.intro='';}if(slide===2)profile.interests=[];if(slide===3)profile.classes=[];return {profile,ready:slide>=4,step:Math.min(slide,3),location:slide>=5?'Library':'COMP 1021 · L1',threads:{} as Record<string,Thread>,game:structuredClone(game)};}
const type=(action:'name'|'intro'|'search'|'quest-title'|'quest-place'|'quest-when'|'quest-details',text:string,start:number,spacing:number):DemoEvent[]=>Array.from(text,(_,i)=>({at:start+i*spacing,action,value:text.slice(0,i+1)}));
export function demoEvents(slide:number):DemoEvent[]{const events:DemoEvent[][]=[
 [...type('name',sample.name,500,160),...type('intro',sample.intro,1700,45)],
 [{at:900,action:'avatar',value:'Firebird'},{at:2200,action:'accessory',value:'Scarf'},{at:4200,action:'item',value:'Book'},{at:6800,action:'item',value:'Coffee'}],
 [{at:1000,action:'interest',value:'Hiking'},{at:2500,action:'interest',value:'Photography'},{at:4000,action:'interest',value:'Coffee'},{at:6000,action:'interest',value:'Cozy games'}],
 [...type('search','COMP 1021',500,180),{at:3600,action:'class',value:'COMP 1021 · L1'}],
 [{at:1200,action:'move'},{at:4000,action:'location',value:'Library'},{at:5500,action:'move'},{at:8500,action:'location',value:'Dorm common area'},{at:10000,action:'move'}],
 [{at:700,action:'students'},{at:2200,action:'introduction'},{at:4200,action:'hello'},{at:8500,action:'message',value:'What got you into hiking?'}],
 [{at:1000,action:'quests'},{at:4000,action:'accept',value:'table-tennis'}],
 [{at:600,action:'quests'},{at:1400,action:'quest-open'},...type('quest-title','Table tennis doubles',2200,85),...type('quest-place','LG1 Court 4',4300,90),...type('quest-when','Today at 6 PM',5800,75),{at:7100,action:'quest-capacity',value:'2'},{at:7800,action:'quest-interest',value:'Table tennis'},...type('quest-details','Bring your racket. All levels welcome.',8400,45),{at:12000,action:'quest-post'}]
 ];return events[slide];}

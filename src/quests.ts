export type Quest={id:string;lobby:string;hostId:string;hostName:string;title:string;place:string;when:string;details:string;capacity:number;participants:string[];interests?:string[]};
export type Game={quests:Quest[];joined:string[]};
export const initialGame:Game={joined:[],quests:[
 {id:'sunset-photo',lobby:'Library',hostId:'p6-0',hostName:'Noah',title:'Sunset photo walk',place:'Sundial · Seafront',when:'Today · 5:30 PM',details:'Bring a camera or your phone.',capacity:3,participants:[],interests:['Photography','Hiking']},
 {id:'table-tennis',lobby:'Library',hostId:'p6-1',hostName:'Luna',title:'Table tennis doubles',place:'LG1 · Court 4',when:'Today · 6:00 PM',details:'All levels welcome. Bring your racket if you have one.',capacity:3,participants:['p6-0','p6-2']},
 {id:'study-buddy',lobby:'COMP 1021 · L1',hostId:'p0-0',hostName:'Sophie',title:'Practice Python together',place:'Library · Learning Commons',when:'Today · 4:30 PM',details:'Work through this week’s exercises together.',capacity:2,participants:['p0-2']},
 {id:'board-games',lobby:'Dorm common area',hostId:'p7-1',hostName:'Finn',title:'Board game night',place:'Common room · Big table',when:'Tonight · 8:00 PM',details:'I’ll bring the games. You bring your favorite snack.',capacity:4,participants:['p7-0'],interests:['Board games']}
]};
export const questFull=(q:Quest)=>q.participants.length>=q.capacity;
export function joinQuest(game:Game,id:string,participant='you'):Game {
 const quest=game.quests.find(q=>q.id===id);
 if(!quest||questFull(quest)||quest.hostId===participant||quest.participants.includes(participant)||(participant==='you'&&game.joined.includes(id)))return game;
 return {quests:game.quests.map(q=>q.id===id?{...q,participants:[...q.participants,participant]}:q),joined:participant==='you'?[...game.joined,id]:game.joined};
}
export function createQuest(game:Game,quest:Quest):Game {
 if(!quest.title.trim()||!quest.place.trim()||!quest.when.trim()||!Number.isInteger(quest.capacity)||quest.capacity<1||quest.capacity>12||game.quests.some(q=>q.id===quest.id))return game;
 return {...game,quests:[{...quest,participants:[]},...game.quests]};
}

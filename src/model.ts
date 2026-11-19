export type AvatarData={type:string;color:string;clothes:string;accessory:string;item:string;hair:string;skin:string};
export type Profile={name:string;intro:string;interests:string[];classes:string[];avatar:AvatarData};
export type Peer={id:string;name:string;intro:string;interests:string[];lobby:string;level?:number;avatar:AvatarData};
export type Message={text:string;own:boolean};
export type Thread={status:'pending'|'accepted';acceptedAt:number;messages:Message[]};
export const interests=['Hiking','Photography','Badminton','Cats','Cooking','Anime','Cozy games','RPGs','Indie music','Jazz','Sci-fi films','Bouldering','Coffee','Baking','Board games','Running','Table tennis','Programming','Design','Swimming'];
export const courses=[{code:'COMP 1021',title:'Introduction to Computer Science',sections:['L1','L2']},{code:'LANG 1403',title:'Academic English',sections:['L1','L2']},{code:'MATH 1013',title:'Calculus IB',sections:['L1','L2']},{code:'COMP 2011',title:'Programming with C++',sections:['L1','L2','L3']},{code:'COMP 2211',title:'Exploring Artificial Intelligence',sections:['L1','L2']},{code:'ISOM 1700',title:'Critical Issues in Business Operations',sections:['L1','L2']},{code:'MARK 2120',title:'Marketing Management',sections:['L1','L2']},{code:'PHYS 1112',title:'General Physics I',sections:['L1','L2']},{code:'HUMA 1000',title:'Cultures and Values',sections:['L1','L2','L3']}];
export const defaultAvatar:AvatarData={type:'Human',color:'#d79a62',clothes:'#709988',accessory:'None',item:'Coffee',hair:'Short',skin:'#e7b58c'};
export const demo:Profile={name:'Firebird Chan',intro:'Here for good views, better coffee, and new friends.',interests:['Hiking','Photography','Coffee','Cozy games'],classes:['COMP 1021 · L1'],avatar:{...defaultAvatar,type:'Firebird',color:'#c9473d',accessory:'Scarf'}};
const names=['Sophie','Kai','Milo','Chloe','Theo','Aria','Noah','Luna','Ethan','Ivy','Finn','Zoe'];
const bios=['Collecting sunsets and questionable coffee opinions.','Always up for a trail with a sea view.','Side quest: find the best study snack.','One more chapter, then I promise I’ll study.'];
const topics=[['Photography','Coffee','Indie music','Hiking'],['Hiking','Badminton','RPGs','Photography'],['Cozy games','Cats','Coffee','Baking'],['Anime','Sci-fi films','Cooking','Jazz']];
const lobbies=[...courses.slice(0,3).flatMap(c=>c.sections.map(s=>`${c.code} · ${s}`)),'Library','Dorm common area',...courses.slice(3).flatMap(c=>c.sections.map(s=>`${c.code} · ${s}`))];
export const peers:Peer[]=lobbies.flatMap((lobby,li)=>Array.from({length:4},(_,i)=>({id:`p${li}-${i}`,name:names[(li*3+i)%names.length],intro:bios[i],interests:topics[i],lobby,level:2+i*2+li%4,avatar:{...defaultAvatar,type:['Cat','Firebird','Human','Dog'][i],color:['#dfa36c','#c9473d','#715e4d','#c4ab86'][i],clothes:['#799b86','#d48b60','#849bba','#bb8da4'][i],accessory:i===0?'Glasses':i===1?'Scarf':'None',item:i===0?'Camera':i===2?'Book':'None'}})));
export const eligible=(lobby:string)=>peers.filter(p=>p.lobby===lobby);
export const peerName=(peer:Peer,thread?:Thread)=>thread?.status==='accepted'?peer.name:'Unknown';
export const shared=(p:Profile,peer:Peer)=>p.interests.filter(i=>peer.interests.includes(i));
export const recommended=(p:Profile,lobby:string)=>eligible(lobby).sort((a,b)=>shared(p,b).length-shared(p,a).length||a.id.localeCompare(b.id)).slice(0,3);
export const starters=(p:Profile,peer:Peer)=>{const s=shared(p,peer);return s.length?s.slice(0,3).map(i=>`What got you into ${i.toLowerCase()}?`):[`How are you finding ${peer.lobby}?`];};
export function reply(text:string){const s=text.toLowerCase();if(/hik|trail/.test(s))return 'The coastal trail is my favorite! Want to try a short sunset hike after class?';if(/photo|camera/.test(s))return 'I started taking photos around the sundial. The light by the sea is so good near sunset!';if(/coffee|café/.test(s))return 'A coffee break sounds perfect. Shall we meet by the library after class?';if(/game|rpg/.test(s))return 'I love a cozy co-op game after a long day. What have you been playing lately?';if(/cat/.test(s))return 'Cats immediately make my day better. I have an entire folder of campus cat photos!';if(/anime|film/.test(s))return 'Always looking for something new to watch! What would you recommend?';if(/cook|bak|snack/.test(s))return 'I’ve been trying easy recipes between classes. We should swap our favorite snacks!';if(/music|jazz/.test(s))return 'My study playlist is mostly mellow music. Send me a favorite song?';return 'That sounds fun! I’m glad you said hello. Want to tell me a little more?';}
export const obstacles={
 Classroom:[.6,3.7].flatMap(x=>[1,2.65,4.3].map(y=>({x,y,w:1.7,h:1.0}))),
 Library:[{x:.25,y:.08,w:4.45,h:.64},{x:5,y:.6,w:.6,h:1.8},{x:.8,y:2.4,w:1.7,h:1.25},{x:3.7,y:3.8,w:1.6,h:1.65}],
 Dorm:[{x:.08,y:.18,w:.76,h:2.2},{x:.1,y:2.45,w:.72,h:.65},{x:3.85,y:1.3,w:1.7,h:.8},{x:3.8,y:3.2,w:1.1,h:.9},{x:1.1,y:3.5,w:1.2,h:1.35}]
};
export const roomPositions={
 Classroom:[{x:.35,y:3.8},{x:4.8,y:5.6},{x:3,y:1.4},{x:5.7,y:1.8}],
 Library:[{x:.45,y:3.6},{x:4.8,y:5.7},{x:3,y:1.8},{x:5.5,y:3.2}],
 Dorm:[{x:.7,y:4.8},{x:4.6,y:5.4},{x:3,y:1.3},{x:5.5,y:3.1}]
};
export type Pos={x:number;y:number};
export function walkable(p:Pos,obs:{x:number;y:number;w:number;h:number}[]){return p.x>=.3&&p.y>=.3&&p.x<=5.7&&p.y<=5.7&&!obs.some(o=>p.x>o.x-.2&&p.x<o.x+o.w+.2&&p.y>o.y-.2&&p.y<o.y+o.h+.2);}
export function pathTo(start:Pos,end:Pos,obs:{x:number;y:number;w:number;h:number}[]):Pos[]{const cell=(p:Pos)=>({x:Math.round(p.x*5),y:Math.round(p.y*5)});const s=cell(start),e=cell(end),key=(p:Pos)=>`${p.x},${p.y}`;if(!walkable(end,obs))return [];const queue=[s],seen=new Set([key(s)]),prev=new Map<string,Pos>();for(let i=0;i<queue.length;i++){const c=queue[i];if(c.x===e.x&&c.y===e.y){const result:Pos[]=[];let t=c;while(key(t)!==key(s)){result.unshift({x:t.x/5,y:t.y/5});t=prev.get(key(t))!;}return result;}for(const d of [{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1},{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]){const n={x:c.x+d.x,y:c.y+d.y};if(!seen.has(key(n))&&walkable({x:n.x/5,y:n.y/5},obs)&&(!d.x||!d.y||(walkable({x:(c.x+d.x)/5,y:c.y/5},obs)&&walkable({x:c.x/5,y:(c.y+d.y)/5},obs)))){seen.add(key(n));prev.set(key(n),c);queue.push(n);}}}return [];}

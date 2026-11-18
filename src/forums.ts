import type {Profile,Peer} from './model';
export type Forum={id:string;kind:'interest'|'class';name:string};
export type Post={id:string;title?:string;text:string;author:string;authorId?:string;room?:string;simulated?:boolean;likedBy?:string[];createdAt?:number;replies:{author:string;text:string}[]};
export type ForumStore=Record<string,Post[]>;
export function availableForums(profile:Profile):Forum[]{return [...[...new Set(profile.interests)].map(name=>({id:`interest:${name}`,kind:'interest' as const,name})),...[...new Set(profile.classes)].map(name=>({id:`class:${name}`,kind:'class' as const,name}))];}
export function canAccessForum(profile:Profile,id:string){return availableForums(profile).some(f=>f.id===id);}
export function addForumPost(store:ForumStore,profile:Profile,forum:Forum,post:Post){if(!canAccessForum(profile,forum.id)||!post.title?.trim()||!post.text.trim())return store;return {...store,[forum.id]:[post,...(store[forum.id]||[])]};}
export function addForumReply(store:ForumStore,profile:Profile,id:string,postId:string,text:string){if(!canAccessForum(profile,id)||!text.trim())return store;return {...store,[id]:(store[id]||[]).map(p=>p.id===postId?{...p,replies:[...p.replies,{author:profile.name,text:text.trim()}]}:p)};}
export function meetingTopics(profile:Profile,peer:Peer){const overlap=profile.interests.filter(i=>peer.interests.includes(i));return [...overlap.map(i=>`You both enjoy ${i.toLowerCase()}. How did you first get into it?`),...(profile.classes.includes(peer.lobby)?[`What part of ${peer.lobby} are you finding most interesting?`]:[]),`What is your favourite spot on campus for a break?`,`What would you like to try together this semester?`].slice(0,4);}

export function toggleForumLike(store:ForumStore,profile:Profile,id:string,postId:string){if(!canAccessForum(profile,id)||!store[id]?.some(p=>p.id===postId))return store;return {...store,[id]:store[id].map(p=>p.id===postId?{...p,likedBy:(p.likedBy||[]).includes('you')?(p.likedBy||[]).filter(v=>v!=='you'):[...(p.likedBy||[]),'you']}:p)};}

export function communityName(forum:Forum){return forum.kind==='interest'?`${forum.name} Circle`:`${forum.name} Classroom`;}
export function forumFeed(profile:Profile,store:ForumStore,selected:string|null=null){return availableForums(profile).filter(f=>!selected||f.id===selected).flatMap(forum=>(store[forum.id]||[]).map(post=>({forum,post}))).sort((a,b)=>(b.post.createdAt||0)-(a.post.createdAt||0));}

export type RoomAnnouncement={forum:Forum;post:Post;authorId:string};
export const ROOM_POST_LIFETIME=15_000;
// The room bubble is a temporary link to an existing thread, never a second message.
export function roomAnnouncement(profile:Profile,store:ForumStore,location:string,present:Peer[],now=Date.now()):RoomAnnouncement|null{
 for(const entry of forumFeed(profile,store)){
  const {post,forum}=entry,room=post.room||(forum.kind==='class'?forum.name:null);
  if(room!==location||(forum.kind==='class'&&forum.name!==location)||!post.createdAt||post.createdAt>now||now-post.createdAt>=ROOM_POST_LIFETIME)continue;
  if(post.authorId==='you'||present.some(peer=>peer.id===post.authorId))return {...entry,authorId:post.authorId!};
 }
 return null;
}

export const MAX_SIMULATED_ROOM_POSTS=8;
// A finite pool keeps the local demo lively without endlessly filling the forum.
export function simulateRoomPost(store:ForumStore,profile:Profile,location:string,present:Peer[],now=Date.now(),random:()=>number=Math.random):ForumStore{
 const forums=availableForums(profile).filter(f=>profile.classes.includes(location)?f.id===`class:${location}`:f.kind==='interest');
 if(!forums.length||!present.length)return store;
 const existing=Object.values(store).flat().filter(p=>p.simulated&&p.room===location);
 if(existing.length>=MAX_SIMULATED_ROOM_POSTS)return store;
 const pick=<T,>(items:T[])=>items[Math.min(items.length-1,Math.max(0,Math.floor(random()*items.length)))];
 const choices=forums.flatMap(forum=>{
  const samples=forum.kind==='class'?[
   ['Notes swap','Did anyone catch the last example? Happy to compare notes after class.'],
   ['Study buddy?','Anyone want to work through the practice questions together?'],
   ['Quick question','Which part of today\'s lecture did you find most interesting?'],
   ['Before the next lecture','I am reviewing this week\'s material. Anyone joining?'],
   ['Coffee after class','Taking a short coffee break after this. Who is coming?'],
   ['Revision tips','What is your favourite way to revise for this course?']
  ]:[
   [`${forum.name} break?`, `Anyone here into ${forum.name.toLowerCase()}? Let us chat during a study break.`],
   [`New to ${forum.name.toLowerCase()}`, `What would you recommend to someone getting into ${forum.name.toLowerCase()}?`],
   ['After studying', `Anyone from the ${forum.name} Circle free to hang out later?`],
   ['Share a favourite', `What is your favourite thing about ${forum.name.toLowerCase()}?`],
   ['Weekend plans', `Thinking about a ${forum.name.toLowerCase()} meetup this weekend. Any ideas?`],
   ['Taking a break', location==='Library'?'Heading downstairs for a snack. Anyone need a study break?':'Taking a break in the common room. Anyone want to join?']
  ];
  return samples.filter(([title,text])=>!existing.some(p=>p.title===title&&p.text===text)).map(([title,text])=>({forum,title,text}));
 });
 if(!choices.length)return store;
 const {forum,title,text}=pick(choices),matching=present.filter(peer=>forum.kind==='class'||peer.interests.includes(forum.name)),author=pick(matching.length?matching:present);
 const other=present.find(peer=>peer.id!==author.id);
 const post:Post={id:`simulated-room:${location}:${existing.length}`,title,text,author:author.name,authorId:author.id,room:location,simulated:true,createdAt:now,likedBy:[],replies:other&&random()<.4?[{author:other.name,text:forum.kind==='class'?'I would be happy to compare notes!':'Sounds good, count me in!'}]:[]};
 return addForumPost(store,profile,forum,post);
}
export function seedRoomPosts(store:ForumStore,profile:Profile,location:string,present:Peer[],now=Date.now()):ForumStore{
 if(Object.values(store).some(posts=>posts.some(post=>post.simulated&&post.room===location)))return store;
 let seeded=store;
 for(let i=0;i<3;i++)seeded=simulateRoomPost(seeded,profile,location,present,now-60_000-i*10_000);
 return seeded;
}

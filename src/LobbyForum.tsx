import {BookOpen,ChevronRight,MessageCircle,Plus,Network,X} from 'lucide-react';
import {availableForums,communityName,forumFeed,type ForumStore} from './forums';
import type {Profile} from './model';

export default function LobbyForum({location,profile,store,onOpen,onEdit,hidden,onToggle}:{location:string;profile:Profile;store:ForumStore;onOpen:(community:string|null,post?:string,compose?:boolean)=>void;onEdit:(step:number)=>void;hidden:boolean;onToggle:()=>void}){
 const classroom=profile.classes.includes(location),community=classroom?`class:${location}`:null;
 const forums=availableForums(profile),posts=forumFeed(profile,store,community).slice(0,1);
 if(hidden)return <div className="lobby-forum-collapsed"><button onClick={onToggle} aria-expanded={false} aria-controls="lobby-discussion-preview">{classroom?<BookOpen size={13}/>:<Network size={13}/>}Show discussions</button></div>;
 return <section id="lobby-discussion-preview" className="lobby-forum" aria-label={classroom?'Classroom discussions':'Your communities'}>
  <div className="lobby-forum-heading"><span>{classroom?<BookOpen size={15}/>:<Network size={15}/>}<strong>{classroom?'Classroom discussions':'Your communities'}</strong></span><div className="lobby-forum-actions">{forums.length>0&&<><button onClick={()=>onOpen(community)}>View all<ChevronRight size={14}/></button><button title="Create post" aria-label={classroom?'Post to classroom':'Post to a community'} onClick={()=>onOpen(community,undefined,true)}><Plus size={15}/></button></>}<button onClick={onToggle} title="Hide discussions" aria-label="Hide discussions" aria-expanded={true} aria-controls="lobby-discussion-preview"><X size={15}/></button></div></div>
  {posts.length>0?<div className="lobby-forum-posts">{posts.map(({post,forum})=><button key={`${forum.id}:${post.id}`} className="lobby-forum-post" onClick={()=>onOpen(forum.id,post.id)}><span><strong>{post.title||post.text}</strong><small>{classroom?post.author:communityName(forum)}</small></span><span className="lobby-forum-replies"><MessageCircle size={12}/>{post.replies.length}<span className="sr-only"> replies</span></span></button>)}</div>:<p className="lobby-forum-empty">{forums.length?(classroom?'Ask a question or find a study buddy in your section.':'Start a conversation in one of your interest circles.'):'Choose interests or classes to find your communities.'}</p>}
  {!forums.length&&<button className="lobby-forum-compose" onClick={()=>onEdit(2)}><Plus size={14}/>Choose interests</button>}
 </section>;
}

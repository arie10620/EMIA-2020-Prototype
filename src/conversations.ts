import type {Profile,Peer} from './model';
import {interestPresets,coursePresets,generalPresets,type Preset} from './conversationPresets.ts';

export type ConversationPrompt={id:string;question:string;answer:string};
export type ConversationGroup={id:string;label:string;kind:'interest'|'class'|'general';shared:boolean;prompts:ConversationPrompt[]};
const prompts=(id:string,presets:readonly Preset[],section='')=>presets.map(([question,answer],index)=>({id:`${id}:${index}`,question:question.replaceAll('{class}',section),answer}));

export function conversationGroups(profile:Profile,peer:Peer):ConversationGroup[]{
 const overlap=[...new Set(profile.interests.filter(interest=>peer.interests.includes(interest)))];
 const interests=[...overlap,...Object.keys(interestPresets).filter(interest=>!overlap.includes(interest))].map(label=>({id:`interest:${label}`,label,kind:'interest' as const,shared:overlap.includes(label),prompts:prompts(`interest:${label}`,interestPresets[label]||[[`What got you into ${label.toLowerCase()}?`,'What do you enjoy most about it?']])}));
 const code=Object.keys(coursePresets).find(code=>peer.lobby.startsWith(`${code} `));
 const classes:ConversationGroup[]=profile.classes.includes(peer.lobby)&&code?[{id:`class:${peer.lobby}`,label:peer.lobby,kind:'class',shared:true,prompts:prompts(`class:${peer.lobby}`,coursePresets[code],peer.lobby)}]:[];
 const general=Object.entries(generalPresets).map(([label,presets])=>({id:`general:${label}`,label,kind:'general' as const,shared:false,prompts:prompts(`general:${label}`,presets)}));
 return [...interests.filter(group=>group.shared),...classes,...general,...interests.filter(group=>!group.shared)];
}

export function conversationSuggestions(profile:Profile,peer:Peer,round=0):ConversationPrompt[]{
 const groups=conversationGroups(profile,peer),classes=groups.filter(group=>group.kind==='class');
 const interests=groups.filter(group=>group.kind==='interest'&&group.shared).slice(0,classes.length?3:4);
 const selected=[...interests,...classes];
 for(const group of groups.filter(group=>group.kind==='general')){if(selected.length>=4)break;selected.push(group);}
 return selected.map(group=>group.prompts[((round%group.prompts.length)+group.prompts.length)%group.prompts.length]);
}

const normalize=(value:string)=>value.toLowerCase().replace(/[\u2018\u2019]/g,"'").replace(/\s+/g,' ').trim();
const aliases:Record<string,RegExp>={
 Hiking:/\b(hik\w*|trail)\b/i,Photography:/\b(photo\w*|camera)\b/i,Badminton:/\b(badminton|shuttlecock)\b/i,Cats:/\b(cat|cats|kitten|kittens)\b/i,Cooking:/\b(cook\w*|recipe|recipes)\b/i,Anime:/\banime\b/i,
 'Cozy games':/\b(cozy|co-op|game|games)\b/i,RPGs:/\brpgs?\b/i,'Indie music':/\b(indie|music|song|playlist)\b/i,Jazz:/\bjazz\b/i,'Sci-fi films':/\b(sci-fi|science fiction|film|films)\b/i,
 Bouldering:/\b(boulder\w*|climb\w*)\b/i,Coffee:/\bcoffee\b|\bcaf[e\u00e9](?![a-z])/i,Baking:/\b(bak\w*|cookies)\b/i,'Board games':/\b(board game\w*|tabletop)\b/i,Running:/\b(run|running|jog\w*)\b/i,'Table tennis':/\b(table tennis|ping[- ]pong)\b/i,Programming:/\b(program\w*|coding|code|debug\w*)\b/i,Design:/\b(design\w*|sketch\w*)\b/i,Swimming:/\b(swim\w*|pool)\b/i,
};

export function conversationReply(text:string,profile?:Profile,peer?:Peer):string{
 const normalized=normalize(text);
 const candidates=[...Object.values(interestPresets).flat(),...Object.values(generalPresets).flat()];
 const exact=candidates.find(([question])=>normalize(question)===normalized);
 if(exact)return exact[1];
 if(profile&&peer){const contextual=conversationGroups(profile,peer).flatMap(group=>group.prompts).find(prompt=>normalize(prompt.question)===normalized);if(contextual)return contextual.answer;}
 const course=Object.keys(coursePresets).find(code=>normalized.includes(code.toLowerCase()));
 if(course)return coursePresets[course][0][1];
 // Check specific multiword topics before broader terms such as games or music.
 const order=['Table tennis','Board games','RPGs','Jazz','Baking',...Object.keys(aliases).filter(key=>!['Table tennis','Board games','RPGs','Jazz','Baking'].includes(key))];
 const interest=order.find(key=>aliases[key].test(text));
 if(interest)return interestPresets[interest][0][1];
 return "That sounds fun! I'm glad you said hello. Want to tell me a little more?";
}

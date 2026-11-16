import type {Quest} from './quests';
export type AlertPreferences={enabled:boolean;interests:string[]};
export function questInterests(q:Quest):string[]{if(q.interests?.length)return q.interests;if(/table tennis/i.test(q.title))return ['Table tennis'];if(/python/i.test(q.title))return ['Programming'];if(/board game/i.test(q.title))return ['Board games'];return [];}
export function matchingQuests(quests:Quest[],prefs:AlertPreferences,classes:string[]){return prefs.enabled?quests.filter(q=>q.hostId!=='you'&&q.participants.length<q.capacity&&!q.participants.includes('you')&&(q.lobby==='Library'||q.lobby==='Dorm common area'||classes.includes(q.lobby))&&questInterests(q).some(i=>prefs.interests.includes(i))):[];}

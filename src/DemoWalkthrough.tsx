import {useLayoutEffect,useRef} from 'react';
import {Pause,Play,RotateCcw,X} from 'lucide-react';
import {demoScenarios,walkthroughTitle} from './demoPlayback';

type Props = {
 index:number;
 time:number;
 playing:boolean;
 onSelect:(index:number)=>void;
 onPlay:(playing:boolean)=>void;
 onReplay:()=>void;
 onExit:()=>void;
};

export default function DemoWalkthrough({index,time,playing,onSelect,onPlay,onReplay,onExit}:Props) {
 const scenario=demoScenarios[index];
 const strip=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const toolbar=strip.current!;
  const phone=toolbar.parentElement!;
  const measure=()=>phone.style.setProperty('--demo-content-top',`${toolbar.offsetTop+toolbar.offsetHeight+8}px`);
  const observer=new ResizeObserver(measure);
  observer.observe(toolbar);
  observer.observe(phone);
  measure();
  return ()=>{observer.disconnect();phone.style.removeProperty('--demo-content-top');};
 },[]);
 return <div ref={strip} className="demo-strip" role="region" aria-label={walkthroughTitle}>
  <div className="demo-strip-top">
   <strong>{walkthroughTitle}</strong>
   <button aria-label="Exit demo walkthrough" onClick={onExit}><X size={17}/></button>
  </div>
  <div className="demo-strip-controls">
   <select aria-label="Demo scenario" value={index} onChange={event=>onSelect(Number(event.target.value))}>
    {demoScenarios.map(({name,year,title},i)=><option value={i} key={name}>{name}, Year {year} · {title}</option>)}
   </select>
   <button aria-label={playing?'Pause demo animation':'Play demo animation'} onClick={()=>onPlay(!playing)}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>
   <button aria-label="Replay current persona" onClick={onReplay}><RotateCcw size={17}/></button>
  </div>
  <div className="demo-loop-track" role="progressbar" aria-label={`${scenario.name} walkthrough progress`} aria-valuemin={0} aria-valuemax={scenario.duration} aria-valuenow={time}>
   <span style={{width:`${Math.min(100,time/scenario.duration*100)}%`}}/>
  </div>
 </div>;
}

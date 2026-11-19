import {useLayoutEffect,useRef,type CSSProperties,type PointerEvent} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play,RotateCcw,X} from 'lucide-react';
import {demoScenarios,walkthroughTitle} from './demoPlayback';

type Props = {
 index:number;
 time:number;
 playing:boolean;
 scrubbing:boolean;
 onScrub:(scrubbing:boolean)=>void;
 onSeek:(time:number)=>void;
 onSelect:(index:number)=>void;
 onPlay:(playing:boolean)=>void;
 onReplay:()=>void;
 onExit:()=>void;
};

export default function DemoWalkthrough({index,time,playing,scrubbing,onScrub,onSeek,onSelect,onPlay,onReplay,onExit}:Props) {
 const scenario=demoScenarios[index];
 const strip=useRef<HTMLDivElement>(null);
 const value=Math.min(time,scenario.duration);
 const progress=`${value/scenario.duration*100}%`;
 const seekAtPointer=(event:PointerEvent<HTMLInputElement>)=>{
  const {left,width}=event.currentTarget.getBoundingClientRect();
  const fraction=Math.max(0,Math.min(1,(event.clientX-left)/width));
  const next=Math.round(fraction*scenario.duration/100)*100;
  if(next!==value)onSeek(next);
 };
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
   <button aria-label="Previous persona" title="Previous persona" onClick={()=>onSelect((index+demoScenarios.length-1)%demoScenarios.length)}><ArrowLeft size={17}/></button>
   <select aria-label="Demo scenario" value={index} onChange={event=>onSelect(Number(event.target.value))}>
    {demoScenarios.map(({name,year,title},i)=><option value={i} key={name}>{name}, Year {year} · {title}</option>)}
   </select>
   <button aria-label={playing?'Pause demo animation':'Play demo animation'} onClick={()=>onPlay(!playing)}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>
   <button aria-label="Replay current persona" onClick={onReplay}><RotateCcw size={17}/></button>
   <button aria-label="Next persona" title="Next persona" onClick={()=>onSelect((index+1)%demoScenarios.length)}><ArrowRight size={17}/></button>
  </div>
  <div className="demo-loop-track" data-scrubbing={scrubbing} style={{'--demo-progress':progress} as CSSProperties}>
   <div className="demo-loop-rail" aria-hidden="true"><span/></div>
   <span className="demo-loop-handle" aria-hidden="true"/>
   <input className="demo-scrubber" data-keep-focus type="range" min={0} max={scenario.duration} step={100} value={value}
    aria-label={`${scenario.name} walkthrough progress`}
    aria-valuetext={`${Math.floor(value/1000)} of ${scenario.duration/1000} seconds`}
    onPointerDown={event=>{
     if(event.button!==0||!event.isPrimary)return;
     event.preventDefault();
     event.currentTarget.focus({preventScroll:true});
     event.currentTarget.setPointerCapture(event.pointerId);
     onScrub(true);
     seekAtPointer(event);
    }}
    onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))seekAtPointer(event);}}
    onPointerUp={()=>onScrub(false)}
    onPointerCancel={()=>onScrub(false)}
    onLostPointerCapture={()=>onScrub(false)}
    onChange={event=>onSeek(event.currentTarget.valueAsNumber)}
   />
  </div>
 </div>;
}

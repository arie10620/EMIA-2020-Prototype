import {useLayoutEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play,RotateCcw,X} from 'lucide-react';
import {demoScenarios,walkthroughTitle,walkthroughTask,walkthroughTakeaway} from './demoPlayback';

type Props = {
 index:number;
 time:number;
 playing:boolean;
 loop:number;
 currentStep:number;
 selectedStep?:number;
 range:{start:number;end:number};
 onStep:(index?:number)=>void;
 onSelect:(index:number)=>void;
 onPlay:(playing:boolean)=>void;
 onReplay:()=>void;
 onExit:()=>void;
};

export default function DemoWalkthrough({index,time,playing,loop,currentStep,selectedStep,range,onStep,onSelect,onPlay,onReplay,onExit}:Props) {
 const scenario = demoScenarios[index];
 const strip = useRef<HTMLDivElement>(null);
 const [notes,setNotes] = useState(false);
 useLayoutEffect(()=>{
  const toolbar = strip.current!;
  const phone = toolbar.parentElement!;
  const measure = ()=>phone.style.setProperty('--demo-content-top',`${toolbar.offsetTop+toolbar.offsetHeight+8}px`);
  const observer = new ResizeObserver(measure);
  observer.observe(toolbar);
  observer.observe(phone);
  measure();
  return ()=>{observer.disconnect();phone.style.removeProperty('--demo-content-top');};
 },[]);
 const select = (next:number)=>{setNotes(false);onSelect(next);};
 return <div ref={strip} className="demo-strip" role="region" aria-label={walkthroughTitle}>
  <div className="demo-strip-top">
   <strong>{walkthroughTitle}</strong>
   <button aria-label="Exit demo walkthrough" onClick={onExit}><X size={17}/></button>
  </div>
  <div className="demo-strip-controls">
   <button aria-label="Previous scenario" disabled={index===0} onClick={()=>select(index-1)}><ArrowLeft size={17}/></button>
   <select aria-label="Demo scenario" value={index} onChange={event=>select(Number(event.target.value))}>
    {demoScenarios.map(({name,year,title},i)=><option value={i} key={name}>{name}, Year {year} · {title}</option>)}
   </select>
   <button aria-label={playing?'Pause demo animation':'Play demo animation'} onClick={()=>{setNotes(false);onPlay(!playing);}}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>
   <button aria-label={selectedStep===undefined?"Replay current scenario":"Replay current step"} onClick={()=>{setNotes(false);onReplay();}}><RotateCcw size={17}/></button>
   <button aria-label="Next scenario" disabled={index===demoScenarios.length-1} onClick={()=>select(index+1)}><ArrowRight size={17}/></button>
  </div>
  <div className="demo-walkthrough-status">
   <div className="demo-step-controls" role="group" aria-label="Walkthrough steps">
    <button aria-label="Full walkthrough" aria-pressed={selectedStep===undefined} onClick={()=>{setNotes(false);onStep();}}>Full</button>
    {scenario.steps.map((step,i)=><button key={step.label} aria-label={`Step ${i+1}: ${step.label}`} aria-current={currentStep===i?'step':undefined} aria-pressed={selectedStep===i} onClick={()=>{setNotes(false);onStep(i);}}>{i+1}</button>)}
   </div>
   <span>{playing?'Playing':'Paused'} · Loop {loop}</span>
   <button aria-expanded={notes} aria-controls="demo-scenario-notes" onClick={()=>{if(!notes)onPlay(false);setNotes(!notes);}}>Scenario notes</button>
  </div>
  <div className="demo-loop-track" role="progressbar" aria-label={selectedStep===undefined?"Scenario loop progress":"Step loop progress"} aria-valuemin={range.start} aria-valuemax={range.end} aria-valuenow={time}>
   <span style={{width:`${(time-range.start)/(range.end-range.start)*100}%`}}/>
  </div>
  <div aria-live="polite">
   {time>=scenario.openerAt&&<p className="demo-arrival"><strong>At arrival</strong> “{scenario.opener}”</p>}
  </div>
  <section hidden={!notes} id="demo-scenario-notes" className="demo-scenario-notes" aria-label="Scenario notes" tabIndex={0}>
   <p><strong>Shared task</strong> “{walkthroughTask}”</p>
   <p>{scenario.setup}</p>
   <p>{scenario.hypothesis}</p>
   <p><strong>Test with real students</strong> {scenario.testQuestion}</p>
   <p><strong>Example arrival opener</strong> “{scenario.opener}”</p>
   <p><strong>Presentation takeaway</strong> “{walkthroughTakeaway}”</p>
  </section>
 </div>;
}

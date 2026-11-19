import type {Scenario} from './demoPlayback';

export default function DemoScenarioPanel({scenario,current,onStep}:{scenario:Scenario;current:number;onStep:(index:number)=>void}) {
 return <aside
  className="demo-scenario-panel"
  aria-label="User scenario and profile"
  onPointerDown={event=>{
   // A click beside the phone should leave focus inside an open dialog.
   if(event.button===0&&document.activeElement?.closest('[role="dialog"][aria-modal="true"]'))event.preventDefault();
  }}
 >
  <div className="demo-persona">
   <h1>{scenario.headline}</h1>
   <p className="demo-persona-type">{scenario.name} · Year {scenario.year}</p>
   <p className="demo-persona-bio">{scenario.bio}</p>
   <p className="demo-persona-traits">{scenario.traits.join(' · ')}</p>
  </div>

  <div className="demo-scenario-goal">
   <h2>Scenario goal</h2>
   <p>{scenario.goal}</p>
  </div>

  <div className="demo-scenario-steps">
   <h2>Walkthrough steps</h2>
   <ol>
    {scenario.steps.map((step,index)=><li key={step.label} aria-current={current===index?'step':undefined}><button onClick={()=>onStep(index)}>{step.label}</button></li>)}
   </ol>
  </div>
 </aside>;
}

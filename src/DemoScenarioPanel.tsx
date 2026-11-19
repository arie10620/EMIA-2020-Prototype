import type {Scenario} from './demoPlayback';

export default function DemoScenarioPanel({scenario,time}:{scenario:Scenario;time:number}) {
 const current = scenario.steps.reduce((active,step,index)=>{
  const start = step.startsOn==='arrival'
   ? scenario.openerAt
   : scenario.events.find(event=>event.action===step.startsOn)?.at;
  return start!==undefined&&time>=start ? index : active;
 },0);

 return <aside
  className="demo-scenario-panel"
  aria-label="User scenario and profile"
  onPointerDown={event=>{
   // A click beside the phone should leave focus inside an open dialog.
   if(event.button===0&&document.activeElement?.closest('[role="dialog"][aria-modal="true"]'))event.preventDefault();
  }}
 >
  <div className="demo-persona">
   <p className="demo-persona-type">Fictional student profile</p>
   <h1>{scenario.name} <span>Year {scenario.year}</span></h1>
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
    {scenario.steps.map((step,index)=><li key={step.label} aria-current={current===index?'step':undefined}>{step.label}</li>)}
   </ol>
  </div>
 </aside>;
}

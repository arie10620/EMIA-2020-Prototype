export const project=(x:number,y:number,z=0)=>({x:250+(x-y)*34,y:105+(x+y)*18-z});
const poly=(a:number[][])=>a.map(([x,y,z])=>{const p=project(x,y,z||0);return `${p.x},${p.y}`}).join(' ');
function Box({x,y,w,d,h,color,z=0}:{x:number;y:number;w:number;d:number;h:number;color:string;z?:number}){return <g><polygon points={poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])} fill={color}/><polygon points={poly([[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x,y+d,z]])} fill={color} filter="url(#shade)"/><polygon points={poly([[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x+w,y,z]])} fill={color} filter="url(#dark)"/></g>}
function Plant({x,y}:{x:number;y:number}){const p=project(x+.15,y+.15,18);return <g><Box x={x} y={y} w={.3} d={.3} h={14} color="#bb835c"/><path d={`M${p.x} ${p.y}v-25m0 10-10-9m10 4 11-15`} stroke="#698367" strokeWidth="4"/><rect x={p.x-12} y={p.y-29} width="10" height="13" fill="#88a36f"/><rect x={p.x+3} y={p.y-36} width="10" height="17" fill="#759761"/></g>}
function Window({x,w=1.2}:{x:number;w?:number}){return <g><polygon points={poly([[x,0,32],[x+w,0,32],[x+w,0,80],[x,0,80]])} fill="#9fcbd2" stroke="#faf4de" strokeWidth="4"/><polygon points={poly([[x,0,33],[x+w,0,33],[x+w,0,57],[x,0,54]])} fill="#afd6cc"/><polygon points={poly([[x,0,45],[x+w,0,45],[x+w,0,48],[x,0,48]])} fill="#dfefdc"/><path d={`M${project(x+w/2,0,33).x} ${project(x+w/2,0,33).y}V${project(x+w/2,0,80).y}`} stroke="#f9edcd" strokeWidth="3"/></g>}
function Bookshelf({x,y,w=4.4,d=.5,h=87}:{x:number;y:number;w?:number;d?:number;h?:number}){return <g data-room-prop="bookshelf"><Box x={x} y={y} w={w} d={d} h={h} color="#936a48"/>{[6,26,46,66].map((z,row)=><g key={z}><Box x={x+.08} y={y+d-.04} w={w-.16} d={.14} h={2} z={z} color="#d0a478"/>{Array.from({length:Math.floor(w/.2)-1},(_,i)=><Box key={i} x={x+.12+i*.2} y={y+d-.02} w={.14} d={.12} h={11+(i+row)%4*2} z={z+2} color={['#718b78','#bc7d62','#d1b370','#889ead','#aa8a9d','#c9bea0'][(i+row*2)%6]}/>)}</g>)}<Box x={x} y={y+d} w={.09} d={.14} h={h} color="#bd9366"/><Box x={x+w-.09} y={y+d} w={.09} d={.14} h={h} color="#bd9366"/></g>}
function Chair({x,y,color='#8a9a9f'}:{x:number;y:number;color?:string}){return <g><Box x={x} y={y} w={.42} d={.4} h={13} color={color}/><Box x={x} y={y+.32} w={.42} d={.08} h={26} color={color}/><Box x={x+.06} y={y+.06} w={.07} d={.07} h={7} color="#6e7870"/></g>}
function Desk({x,y,w=1.7,d=.55}:{x:number;y:number;w?:number;d?:number}){return <g data-room-prop="classroom-desk"><Box x={x+.08} y={y+.1} w={.08} d={.4} h={21} color="#a7aaa0"/><Box x={x+w-.16} y={y+.1} w={.08} d={.4} h={21} color="#a7aaa0"/><Box x={x} y={y} w={w} d={d} h={3} z={21} color="#e1c79e"/><Box x={x+.12} y={y+d-.08} w={w-.24} d={.06} h={13} z={4} color="#cccbb8"/><polygon points={poly([[x+.3,y+.12,25],[x+.7,y+.12,25],[x+.7,y+.38,25],[x+.3,y+.38,25]])} fill="#fffae7"/></g>}
export default function RoomArt({kind}:{kind:'Classroom'|'Library'|'Dorm'}){const classroom=kind==='Classroom',library=kind==='Library';return <g data-room={kind}>
<defs><filter id="shade"><feComponentTransfer><feFuncR type="linear" slope=".88"/><feFuncG type="linear" slope=".88"/><feFuncB type="linear" slope=".88"/></feComponentTransfer></filter><filter id="dark"><feComponentTransfer><feFuncR type="linear" slope=".74"/><feFuncG type="linear" slope=".74"/><feFuncB type="linear" slope=".74"/></feComponentTransfer></filter><linearGradient id="sea" x2="0" y2="1"><stop stopColor="#a4ccd3"/><stop offset="1" stopColor="#d4e4d0"/></linearGradient></defs>
<ellipse cx="250" cy="340" rx="210" ry="25" fill="#81947a" opacity=".12"/>
<path d="M8 114 250 0l242 114-242 125Z" fill="url(#sea)"/><path d="m20 106 47-16 27 3 43-23 29 2 39-15 29 6 44-5 37 15 34-2 57 23 35 7 36 18-227 107Z" fill="#7ca995" opacity=".38"/><g stroke="#eff9ed" strokeWidth="2" opacity=".75"><path d="m39 112 27-7m328 7 40 9M311 36l38 12M128 57l31-3"/></g>
<polygon points={poly([[0,0],[6,0],[6,6],[0,6]])} fill={classroom?'#d6dbd5':library?'#d9ba8d':'#bb8f6c'}/><polygon points={poly([[0,6],[6,6],[6,6,-13],[0,6,-13]])} fill={classroom?'#a4b4af':'#a27d57'}/><polygon points={poly([[6,0],[6,6],[6,6,-13],[6,0,-13]])} fill={classroom?'#b7c3b8':'#b48b61'}/>
{Array.from({length:13},(_,i)=><g key={i} stroke={classroom?'#c1ccc4':library?'#c7a371':'#a87b56'} strokeWidth=".7"><line x1={project(0,i/2).x} y1={project(0,i/2).y} x2={project(6,i/2).x} y2={project(6,i/2).y}/>{classroom&&<line x1={project(i/2,0).x} y1={project(i/2,0).y} x2={project(i/2,6).x} y2={project(i/2,6).y}/>}</g>)}
<polygon points={poly([[0,0],[0,6],[0,6,94],[0,0,94]])} fill={classroom?'#d9e3de':library?'#e0c99e':'#dfdcca'}/><polygon points={poly([[0,0],[6,0],[6,0,94],[0,0,94]])} fill={classroom?'#edf0e4':library?'#ead9b8':'#f4e8ce'}/>
{classroom?<g data-room-theme="lecture-hall">
 {[.3,1.7,3.1,4.5].map(x=><Window key={x} x={x} w={1.2}/>)}
 <polygon points={poly([[0,.5,35],[0,3.6,35],[0,3.6,83],[0,.5,83]])} fill="#f8f8e8" stroke="#8eaaa1" strokeWidth="3"/><polygon points={poly([[0,.75,45],[0,3.3,45],[0,3.3,74],[0,.75,74]])} fill="#bdd1cb"/><text x="175" y="92" transform="rotate(-28 175 92)" fontSize="9" fill="#58786d">COMP · LECTURE</text>
 <Box x={.25} y={.1} w={.8} d={.4} h={29} color="#91aaa1"/>
 {[1,2.65,4.3].map(y=><g key={y}>{[.6,3.7].map(x=><g key={x}><Chair x={x+.3} y={y+.65}/><Chair x={x+1} y={y+.65}/><Desk x={x} y={y}/></g>)}</g>)}
 <Plant x={5.5} y={.15}/>
 </g>:library?<g data-room-theme="reading-library">
 <Bookshelf x={.25} y={.08} w={4.45}/><Window x={4.9} w={.85}/>
 <polygon points={poly([[0,.5,37],[0,2.8,37],[0,2.8,83],[0,.5,83]])} fill="#b9d7c5" stroke="#c6ad83" strokeWidth="4"/>
 <Box x={5} y={.6} w={.5} d={1.8} h={72} color="#9a7350"/>{[14,34,54].map(z=><g key={z}>{Array.from({length:7},(_,i)=><Box key={i} x={5.5} y={.7+i*.23} w={.08} d={.15} h={12+(i%3)*2} z={z} color={['#8ba98c','#b88967','#bcab76','#8ca3b2'][i%4]}/>)}</g>)}
 <Chair x={.9} y={3.55} color="#a76f7b"/><Chair x={1.7} y={3.55} color="#a76f7b"/><Chair x={1.3} y={1.8} color="#a76f7b"/>
 <Desk x={.8} y={2.4} w={1.7} d={1}/><Box x={1.4} y={2.7} w={.45} d={.3} h={3} z={25} color="#7a9e8a"/>
 <Chair x={3.85} y={5.05} color="#a76f7b"/><Chair x={4.65} y={5.05} color="#a76f7b"/><Desk x={3.7} y={3.8} w={1.6} d={1.1}/>
 <Box x={4.1} y={4} w={.5} d={.3} h={3} z={25} color="#9a879d"/><Box x={4.45} y={4.4} w={.35} d={.2} h={4} z={25} color="#c8a46a"/>
 <text x="165" y="113" transform="rotate(-28 165 113)" fontSize="9" fill="#71896a">QUIET STUDY</text><Plant x={.2} y={5.35}/>
 </g>:<g data-room-theme="dorm-kitchen-lounge">
 <Window x={.4} w={1.6}/><Window x={2.2} w={1.6}/>
 <polygon points={poly([[0,.2,0],[0,2.9,0],[0,2.9,48],[0,.2,48]])} fill="#e8eddf"/>
 <g data-room-prop="kitchen"><Box x={.1} y={.2} w={.7} d={2.15} h={29} color="#8ca99d"/><Box x={.08} y={.18} w={.76} d={2.2} h={3} z={29} color="#f0e5c9"/>
 <polygon points={poly([[.23,.4,33],[.65,.4,33],[.65,.95,33],[.23,.95,33]])} fill="#b6c8c2" stroke="#7f958e" strokeWidth="2"/><path d={`M${project(.45,.55,34).x} ${project(.45,.55,34).y}v-10h5`} fill="none" stroke="#6c8984" strokeWidth="2"/>
 <polygon points={poly([[.2,1.45,33],[.67,1.45,33],[.67,2.02,33],[.2,2.02,33]])} fill="#4b5c59"/>{[1.58,1.87].map(y=><ellipse key={y} cx={project(.43,y,34).x} cy={project(.43,y,34).y} rx="4" ry="2" fill="#a8b7aa"/>)}
 <Box x={.1} y={2.45} w={.7} d={.65} h={66} color="#e0e3d6"/><Box x={.81} y={2.5} w={.02} d={.5} h={2} z={38} color="#a5b4a3"/><Box x={.82} y={2.55} w={.02} d={.06} h={12} z={17} color="#8b9d8b"/>
 </g>
 <polygon points={poly([[3.2,2.7],[5.6,2.7],[5.6,5.25],[3.2,5.25]])} fill="#d3b897" stroke="#e4ccab" strokeWidth="3"/>
 <Box x={3.85} y={1.3} w={1.7} d={.8} h={20} color="#90b1a1"/><Box x={3.85} y={1.3} w={1.7} d={.16} h={37} color="#9bbdab"/><Box x={3.85} y={1.3} w={.16} d={.8} h={29} color="#9bbdab"/><Box x={5.39} y={1.3} w={.16} d={.8} h={29} color="#9bbdab"/>
 <Box x={3.8} y={3.2} w={1.1} d={.9} h={12} color="#b58961"/><Box x={4.1} y={3.4} w={.3} d={.25} h={2} z={12} color="#f7e4bb"/>
 <Chair x={1.1} y={4.6} color="#93b1b0"/><Chair x={2.1} y={3.8} color="#93b1b0"/><Desk x={1.1} y={3.5} w={1.2} d={.9}/>
 <polygon points={poly([[4.3,0,39],[5.65,0,39],[5.65,0,72],[4.3,0,72]])} fill="#566c68" stroke="#ceb491" strokeWidth="4"/><polygon points={poly([[4.43,0,44],[5.5,0,44],[5.5,0,65],[4.43,0,65]])} fill="#88aaa1"/>
 <polygon points={poly([[0,3.65,53],[0,5.3,53],[0,5.3,85],[0,3.65,85]])} fill="#c0a17a" stroke="#f0ddba" strokeWidth="3"/>{[3.85,4.45,4.9].map(y=><polygon key={y} points={poly([[0,y,60],[0,y+.3,60],[0,y+.3,77],[0,y,77]])} fill="#f5ead0"/>)}<Plant x={5.45} y={5.35}/>
 </g>}
<g transform="translate(445 179)"><path d="M-12 20h24v6h-24M-8 15h16v5H-8" fill="#cab694"/><path d="m-7 14 11-27 10-4-8 16 9 5-16 3-3 8Z" fill="#b95d4a"/></g><g transform="translate(55 188)"><ellipse cy="12" rx="15" ry="7" fill="#b5a386"/><path d="M-10 9 2-14 12-2 3 14Z" fill="#c6a16d"/><path d="M-6 8 2-8 7-1 1 10Z" fill="#edcf97"/></g>
</g>;}

import type {AvatarData} from './model';
export default function Avatar({data,size=64}:{data:AvatarData;size?:number}){
 const a=data,pet=a.type==='Cat'||a.type==='Dog',cat=a.type==='Cat';
 return <svg width={size} height={size} viewBox="0 0 72 76" role="img" aria-label={`${a.type} avatar`} shapeRendering="crispEdges" className={`avatar-art avatar-${a.type.toLowerCase()}`}>
 <ellipse cx="36" cy="69" rx={pet?26:19} ry="3" fill="#344a3422"/>
 <g className="avatar-body">
 {pet?<>
   <path d={cat?'M17 50H9V32h6v12h8v9h-6Z':'M19 46H8V35h6v6h10v8Z'} fill={a.color}/>
   <path d="M16 40h34v22H16zM12 45h8v12h-8" fill={a.color}/>
   <path className="leg leg-back" d="M17 56h7v12H14v-5h3m15-7h6v12h-9v-5h3" fill={a.color}/>
   <path className="leg leg-front" d="M41 55h7v13H38v-5h3m10-9h6v14h-9v-5h3" fill={a.color}/>
   <path d="M35 25h25v29H35zM31 33h5v13h-5m24-5h9v11H53" fill={a.color}/>
   {cat?<><path d="M34 28V16l11 11m6 0 10-12v20" fill={a.color}/><path d="M37 26v-5l5 5m13 0 3-5v7" fill="#e8b3a0"/></>:<><path d="M30 24h10v23H30M56 24h10v22H56" fill="#795f49"/><path d="M36 27h18v6H36" fill="#eed7b0"/></>}
   <path d="M42 44h16v10H42z" fill="#f6e1bb"/><path d="M50 43h6v4h-6" fill="#644e43"/>
   <path d="M40 35h4v5h-4m12-5h4v5h-4" fill="#35443d"/>
   <path d="M26 40h7v21h-7M19 45h23v6H19" fill={a.clothes}/>
   {cat&&<path d="M29 31h9v1h-9m-1 12h11v1H28m31-7h9v1h-9m0 6h10v1H59" fill="#806b52"/>}
 </>:a.type==='Firebird'?<>
   <path className="firebird-tail" d="M27 56 23 69l11-5 3 8 6-14Z" fill="#ad4039"/>
   <path className="leg leg-back" d="M22 61h11v8H18v-4h4" fill="#d6ac58"/><path className="leg leg-front" d="M42 61h11v8H38v-4h4" fill="#d6ac58"/>
   <path className="firebird-wing left-wing" d="M15 32H8v5H3v11h5v9h11l6-17Z" fill={a.color}/><path className="firebird-wing right-wing" d="M55 32h9v5h5v11h-5v9H53l-7-17Z" fill={a.color}/>
   <path d="M25 17h22v5h8v7h5v22h-4v8h-8v5H24v-5h-8v-8h-4V32h5v-9h8Z" fill={a.color}/>
   <path d="M28 19 25 9l3-6-1-3 9 6-1 11 5-6 3 7 5-6-2 12Z" fill="#e3aa4f"/>
   <path d="M28 23h8v3h-8M45 25h5v2h-5" fill="#ef8570" opacity=".6"/>
   <path d="M25 40h22v4h6v11h-5v5H24v-5h-5V45h6Z" fill="#fff1d4"/>
   <path d="M22 27h9v3h3v12H21V31h1m20-4h9v4h2v11H40V30h2" fill="#f8f3e1"/>
   <path d="M24 30h7v11h-9v-7h2m19-4h7v4h2v7h-11v-7h2" fill="#41666b"/>
   <path d="M25 31h5v9h-7v-7h2m19-2h5v2h2v7h-8v-7h1" fill="#293b3a"/>
   <path d="M24 30h4v4h-4m19-4h4v4h-4" fill="#fffdf1"/>
   <path d="m31 40 5-4 6 4-6 5Z" fill="#e2a24d"/>
   <path d="M9 43h4v9H9m52-9h3v9h-3" fill="#9f3b36" opacity=".5"/>
 </>:<>
   <path className="leg leg-back" d="M25 53h8v15H22v-5h3" fill="#575c60"/><path className="leg leg-front" d="M39 53h8v15H36v-5h3" fill="#575c60"/>
   <path d="M21 38h29v22H21zM15 43h6v13h-6m35-13h6v13h-6" fill={a.clothes}/>
   <path d="M20 15h30v28H20zM16 22h4v15h-4m34-15h4v15h-4" fill={a.skin}/>
   <path d={a.hair==='Long'?'M16 12h38v35h-7V23H24v24h-8Z':a.hair==='Curly'?'M16 16h5v-6h9V7h14v5h9v14H42v-6H27v9H16Z':'M19 12h32v13H35v-5H19Z'} fill={a.color}/>
   <path d="M27 27h4v5h-4m13-5h4v5h-4" fill="#36433c"/>
 </>}
 <g transform={pet?'translate(13 8)':'translate(3 3)'}>
 {a.accessory==='Glasses'&&<path d="M20 21h12v11H20zm15 0h12v11H35zM32 25h3" fill="none" stroke="#455851" strokeWidth="2"/>}
 {a.accessory==='Scarf'&&<path d="M17 36h30v7H32v11h-7V43h-8" fill="#d36f51"/>}
 {a.accessory==='Flower'&&<><path d="M45 10h5v17h-5" fill="#799b68"/><path d="M40 9h15v8H40m4-4h7v17h-7" fill="#f3c25f"/></>}
 </g>
 <g transform={pet?'translate(-31 10)':'translate(3 3)'}>
 {a.item==='Coffee'&&<><path d="M44 43h12v14H44z" fill="#faf0d6"/><path d="M43 41h14v4H43" fill="#6e8676"/></>}
 {a.item==='Book'&&<path d="M41 42h16v17H41zM44 44h2v13h-2" fill="#cf936c"/>}
 {a.item==='Camera'&&<><path d="M39 44h19v13H39z" fill="#51615c"/><path d="M45 46h9v9h-9" fill="#b4cdca"/></>}
 </g></g></svg>;
}

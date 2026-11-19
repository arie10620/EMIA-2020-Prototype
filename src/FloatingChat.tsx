import {useEffect,useState,type ReactNode,type RefObject} from 'react';
import {createPortal} from 'react-dom';
type Layout={host:HTMLElement;left:number;top:number;width:number;height:number;pointer:number|null};
export default function FloatingChat({scene,anchor,children,zoom=1}:{scene:RefObject<HTMLDivElement|null>;anchor:{x:number;y:number};children:ReactNode;zoom?:number}){
 const [layout,setLayout]=useState<Layout|null>(null);
 useEffect(()=>{const element=scene.current,host=element?.closest<HTMLElement>('.phone');if(!element||!host)return;
  const measure=()=>{
   const room=element.getBoundingClientRect(),phone=host.getBoundingClientRect(),style=getComputedStyle(host);
   const originX=phone.left+host.clientLeft,originY=phone.top+host.clientTop;
   const header=host.querySelector('.demo-strip')||host.querySelector('header'),nav=host.querySelector('nav')?.getBoundingClientRect();
   const minTop=(header?.getBoundingClientRect().bottom||originY)-originY+8;
   const viewport=window.visualViewport,visibleBottom=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
   const rail=!!nav&&nav.width<host.clientWidth/2&&nav.height>nav.width;
   const insetLeft=parseFloat(style.paddingLeft)||0,insetRight=parseFloat(style.paddingRight)||0,insetBottom=parseFloat(style.paddingBottom)||0;
   const right=rail?nav!.left-originX:host.clientWidth-insetRight;
   const bottom=Math.min(nav&&!rail?nav.top:phone.bottom-insetBottom,visibleBottom)-originY-8;
   const mobile=window.matchMedia('(max-width:600px), (pointer:coarse) and (max-width:1000px) and (max-height:600px)').matches;
   const height=Math.min(mobile?260:220,Math.max(0,bottom-minTop)),width=Math.min(mobile?320:280,right-insetLeft-24);
   const x=room.left+anchor.x/500*room.width-originX,y=room.top+anchor.y/390*room.height-originY;
   const left=Math.max(insetLeft+12,Math.min(right-width-12,x-width/2)),top=Math.max(minTop,Math.min(bottom-height,y-100-height));
   setLayout({host,left,top,width,height,pointer:top+height<=y-65?Math.max(16,Math.min(width-24,x-left-8)):null});
  };
  measure();const observer=new ResizeObserver(measure);observer.observe(host);observer.observe(element);window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);window.visualViewport?.addEventListener('resize',measure);window.visualViewport?.addEventListener('scroll',measure);
  return()=>{observer.disconnect();window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);window.visualViewport?.removeEventListener('resize',measure);window.visualViewport?.removeEventListener('scroll',measure);};
 },[scene,anchor.x,anchor.y,zoom]);
 return layout?createPortal(<div className="world-chat-anchor" style={{left:layout.left,top:layout.top,width:layout.width,height:layout.height}}>{children}{layout.pointer!==null&&<span className="chat-pointer" style={{left:layout.pointer}}/>}</div>,layout.host):null;
}

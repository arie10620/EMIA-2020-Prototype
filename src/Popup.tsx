import {useEffect,useRef,type ReactNode,type RefObject} from 'react';
import {X} from 'lucide-react';

export function useDialogFocus(panel:RefObject<HTMLElement|null>,close:RefObject<HTMLButtonElement|null>,onClose:()=>void,open=true){
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement as HTMLElement|null;
  if(!previous?.hasAttribute('data-keep-focus'))close.current?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();closeRef.current();return;}
   if(event.key!=='Tab')return;
   const all=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')||[]).filter(element=>element.getClientRects().length>0);
   const first=all[0],last=all.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  };
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus();};
 },[open,panel,close]);
}

export default function Popup({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 const panel=useRef<HTMLElement>(null),close=useRef<HTMLButtonElement>(null);
 useDialogFocus(panel,close,onClose);
 return <div className="popup-backdrop" onClick={onClose}><section ref={panel} className="popup-panel" role="dialog" aria-label={title} aria-modal="true" onClick={e=>e.stopPropagation()}><div className="popup-heading"><h2>{title}</h2><button ref={close} className="icon-button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><X size={20}/></button></div><div className="popup-scroll">{children}</div></section></div>;
}

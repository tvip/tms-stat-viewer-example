import{g as b,a as _e,bx as te,m as C,h as G,ag as ae,s as ke,U as Ie,u as P,c as s,p as x,aO as ne,aP as ie,e as A,by as se,M as p,aV as Ve,O as Ce,P as Ae,S as J,A as Pe,B,r as xe,Y as U,bn as Te,a7 as we,H as Be,w as W,an as re,ad as q,$ as ze,z as Re,v as $e,aN as N,ah as z,aj as K,au as Le,d as le,N as oe,av as ue,T as de,aG as ce,ao as ve,aH as Ne,ae as M,W as E,aK as ge,K as Ee,L as Oe,a$ as je,bg as Fe,bh as De,aF as He,al as Ue,Q as We,R as qe,b0 as Me,bi as Ge,bj as pe,aJ as Je,b1 as Ke,bz as Ye,bq as me}from"./index-1c22fdc0.js";function Y(e){let r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"div",a=arguments.length>2?arguments[2]:void 0;return b()({name:a??_e(te(e.replace(/__/g,"-"))),props:{tag:{type:String,default:r},...C()},setup(t,c){let{slots:d}=c;return()=>{var n;return G(t.tag,{class:[e,t.class],style:t.style},(n=d.default)==null?void 0:n.call(d))}}})}const gt=ae("app",{state:()=>({theme:"light",token:null,target:"",locale:"en"}),actions:{logout(){this.target="",this.token=null,ke.replace({name:"login"})},setToken(e){this.token=e},setLocale(e){this.locale=e},setTarget(e){this.target=e},setTheme(e){this.theme=e}},persist:{debug:!0}});var Qe=(e=>(e[e.info=0]="info",e[e.warning=1]="warning",e[e.debug=2]="debug",e))(Qe||{});const mt=ae("logStore",{state:()=>({logs:[]}),actions:{erase(){this.logs=[]},addLog(e,r=0){this.logs.unshift({date:new Date,message:e,level:r})}}});const Xe=b()({name:"VCardActions",props:C(),setup(e,r){let{slots:a}=r;return Ie({VBtn:{slim:!0,variant:"text"}}),P(()=>{var t;return s("div",{class:["v-card-actions",e.class],style:e.style},[(t=a.default)==null?void 0:t.call(a)])}),{}}}),Ze=Y("v-card-subtitle"),et=Y("v-card-title");function tt(e){return{aspectStyles:A(()=>{const r=Number(e.aspectRatio);return r?{paddingBottom:String(1/r*100)+"%"}:void 0})}}const fe=x({aspectRatio:[String,Number],contentClass:String,inline:Boolean,...C(),...ne()},"VResponsive"),Z=b()({name:"VResponsive",props:fe(),setup(e,r){let{slots:a}=r;const{aspectStyles:t}=tt(e),{dimensionStyles:c}=ie(e);return P(()=>{var d;return s("div",{class:["v-responsive",{"v-responsive--inline":e.inline},e.class],style:[c.value,e.style]},[s("div",{class:"v-responsive__sizer",style:t.value},null),(d=a.additional)==null?void 0:d.call(a),a.default&&s("div",{class:["v-responsive__content",e.contentClass]},[a.default()])])}),{}}});function at(e,r){if(!se)return;const a=r.modifiers||{},t=r.value,{handler:c,options:d}=typeof t=="object"?t:{handler:t,options:{}},n=new IntersectionObserver(function(){var m;let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],g=arguments.length>1?arguments[1]:void 0;const o=(m=e._observe)==null?void 0:m[r.instance.$.uid];if(!o)return;const l=i.some(h=>h.isIntersecting);c&&(!a.quiet||o.init)&&(!a.once||l||o.init)&&c(l,i,g),l&&a.once?ye(e,r):o.init=!0},d);e._observe=Object(e._observe),e._observe[r.instance.$.uid]={init:!1,observer:n},n.observe(e)}function ye(e,r){var t;const a=(t=e._observe)==null?void 0:t[r.instance.$.uid];a&&(a.observer.unobserve(e),delete e._observe[r.instance.$.uid])}const nt={mounted:at,unmounted:ye},it=nt,st=x({alt:String,cover:Boolean,color:String,draggable:{type:[Boolean,String],default:void 0},eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},sizes:String,src:{type:[String,Object],default:""},crossorigin:String,referrerpolicy:String,srcset:String,position:String,...fe(),...C(),...p(),...Ve()},"VImg"),he=b()({name:"VImg",directives:{intersect:it},props:st(),emits:{loadstart:e=>!0,load:e=>!0,error:e=>!0},setup(e,r){let{emit:a,slots:t}=r;const{backgroundColorClasses:c,backgroundColorStyles:d}=Ce(Ae(e,"color")),{roundedClasses:n}=J(e),i=Pe("VImg"),g=B(""),o=xe(),l=B(e.eager?"loading":"idle"),m=B(),h=B(),f=A(()=>e.src&&typeof e.src=="object"?{src:e.src.src,srcset:e.srcset||e.src.srcset,lazySrc:e.lazySrc||e.src.lazySrc,aspect:Number(e.aspectRatio||e.src.aspect||0)}:{src:e.src,srcset:e.srcset,lazySrc:e.lazySrc,aspect:Number(e.aspectRatio||0)}),_=A(()=>f.value.aspect||m.value/h.value||0);U(()=>e.src,()=>{T(l.value!=="idle")}),U(_,(u,v)=>{!u&&v&&o.value&&V(o.value)}),Te(()=>T());function T(u){if(!(e.eager&&u)&&!(se&&!u&&!e.eager)){if(l.value="loading",f.value.lazySrc){const v=new Image;v.src=f.value.lazySrc,V(v,null)}f.value.src&&we(()=>{var v;a("loadstart",((v=o.value)==null?void 0:v.currentSrc)||f.value.src),setTimeout(()=>{var S;if(!i.isUnmounted)if((S=o.value)!=null&&S.complete){if(o.value.naturalWidth||R(),l.value==="error")return;_.value||V(o.value,null),l.value==="loading"&&k()}else _.value||V(o.value),I()})})}}function k(){var u;i.isUnmounted||(I(),V(o.value),l.value="loaded",a("load",((u=o.value)==null?void 0:u.currentSrc)||f.value.src))}function R(){var u;i.isUnmounted||(l.value="error",a("error",((u=o.value)==null?void 0:u.currentSrc)||f.value.src))}function I(){const u=o.value;u&&(g.value=u.currentSrc||u.src)}let w=-1;Be(()=>{clearTimeout(w)});function V(u){let v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:100;const S=()=>{if(clearTimeout(w),i.isUnmounted)return;const{naturalHeight:Q,naturalWidth:X}=u;Q||X?(m.value=X,h.value=Q):!u.complete&&l.value==="loading"&&v!=null?w=window.setTimeout(S,v):(u.currentSrc.endsWith(".svg")||u.currentSrc.startsWith("data:image/svg+xml"))&&(m.value=1,h.value=1)};S()}const $=A(()=>({"v-img__img--cover":e.cover,"v-img__img--contain":!e.cover})),O=()=>{var S;if(!f.value.src||l.value==="idle")return null;const u=s("img",{class:["v-img__img",$.value],style:{objectPosition:e.position},src:f.value.src,srcset:f.value.srcset,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable,sizes:e.sizes,ref:o,onLoad:k,onError:R},null),v=(S=t.sources)==null?void 0:S.call(t);return s(N,{transition:e.transition,appear:!0},{default:()=>[W(v?s("picture",{class:"v-img__picture"},[v,u]):u,[[$e,l.value==="loaded"]])]})},j=()=>s(N,{transition:e.transition},{default:()=>[f.value.lazySrc&&l.value!=="loaded"&&s("img",{class:["v-img__img","v-img__img--preload",$.value],style:{objectPosition:e.position},src:f.value.lazySrc,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable},null)]}),F=()=>t.placeholder?s(N,{transition:e.transition,appear:!0},{default:()=>[(l.value==="loading"||l.value==="error"&&!t.error)&&s("div",{class:"v-img__placeholder"},[t.placeholder()])]}):null,D=()=>t.error?s(N,{transition:e.transition,appear:!0},{default:()=>[l.value==="error"&&s("div",{class:"v-img__error"},[t.error()])]}):null,H=()=>e.gradient?s("div",{class:"v-img__gradient",style:{backgroundImage:`linear-gradient(${e.gradient})`}},null):null,L=B(!1);{const u=U(_,v=>{v&&(requestAnimationFrame(()=>{requestAnimationFrame(()=>{L.value=!0})}),u())})}return P(()=>{const u=Z.filterProps(e);return W(s(Z,ze({class:["v-img",{"v-img--booting":!L.value},c.value,n.value,e.class],style:[{width:Re(e.width==="auto"?m.value:e.width)},d.value,e.style]},u,{aspectRatio:_.value,"aria-label":e.alt,role:e.alt?"img":void 0}),{additional:()=>s(q,null,[s(O,null,null),s(j,null,null),s(H,null,null),s(F,null,null),s(D,null,null)]),default:t.default}),[[re("intersect"),{handler:T,options:e.options},null,{once:!0}]])}),{currentSrc:g,image:o,state:l,naturalWidth:m,naturalHeight:h}}}),rt=x({start:Boolean,end:Boolean,icon:z,image:String,text:String,...C(),...K(),...p(),...Le(),...le(),...oe(),...ue({variant:"flat"})},"VAvatar"),ee=b()({name:"VAvatar",props:rt(),setup(e,r){let{slots:a}=r;const{themeClasses:t}=de(e),{colorClasses:c,colorStyles:d,variantClasses:n}=ce(e),{densityClasses:i}=ve(e),{roundedClasses:g}=J(e),{sizeClasses:o,sizeStyles:l}=Ne(e);return P(()=>s(e.tag,{class:["v-avatar",{"v-avatar--start":e.start,"v-avatar--end":e.end},t.value,c.value,i.value,g.value,o.value,n.value,e.class],style:[d.value,l.value,e.style]},{default:()=>[a.default?s(E,{key:"content-defaults",defaults:{VImg:{cover:!0,image:e.image},VIcon:{icon:e.icon}}},{default:()=>[a.default()]}):e.image?s(he,{key:"image",src:e.image,alt:"",cover:!0},null):e.icon?s(M,{key:"icon",icon:e.icon},null):e.text,ge(!1,"v-avatar")]})),{}}}),lt=x({appendAvatar:String,appendIcon:z,prependAvatar:String,prependIcon:z,subtitle:[String,Number],title:[String,Number],...C(),...K()},"VCardItem"),ot=b()({name:"VCardItem",props:lt(),setup(e,r){let{slots:a}=r;return P(()=>{var o;const t=!!(e.prependAvatar||e.prependIcon),c=!!(t||a.prepend),d=!!(e.appendAvatar||e.appendIcon),n=!!(d||a.append),i=!!(e.title!=null||a.title),g=!!(e.subtitle!=null||a.subtitle);return s("div",{class:["v-card-item",e.class],style:e.style},[c&&s("div",{key:"prepend",class:"v-card-item__prepend"},[a.prepend?s(E,{key:"prepend-defaults",disabled:!t,defaults:{VAvatar:{density:e.density,image:e.prependAvatar},VIcon:{density:e.density,icon:e.prependIcon}}},a.prepend):s(q,null,[e.prependAvatar&&s(ee,{key:"prepend-avatar",density:e.density,image:e.prependAvatar},null),e.prependIcon&&s(M,{key:"prepend-icon",density:e.density,icon:e.prependIcon},null)])]),s("div",{class:"v-card-item__content"},[i&&s(et,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),g&&s(Ze,{key:"subtitle"},{default:()=>{var l;return[((l=a.subtitle)==null?void 0:l.call(a))??e.subtitle]}}),(o=a.default)==null?void 0:o.call(a)]),n&&s("div",{key:"append",class:"v-card-item__append"},[a.append?s(E,{key:"append-defaults",disabled:!d,defaults:{VAvatar:{density:e.density,image:e.appendAvatar},VIcon:{density:e.density,icon:e.appendIcon}}},a.append):s(q,null,[e.appendIcon&&s(M,{key:"append-icon",density:e.density,icon:e.appendIcon},null),e.appendAvatar&&s(ee,{key:"append-avatar",density:e.density,image:e.appendAvatar},null)])])])}),{}}}),ut=Y("v-card-text"),dt=x({appendAvatar:String,appendIcon:z,disabled:Boolean,flat:Boolean,hover:Boolean,image:String,link:{type:Boolean,default:void 0},prependAvatar:String,prependIcon:z,ripple:{type:[Boolean,Object],default:!0},subtitle:[String,Number],text:[String,Number],title:[String,Number],...Ee(),...C(),...K(),...ne(),...Oe(),...je(),...Fe(),...De(),...p(),...He(),...le(),...oe(),...ue({variant:"elevated"})},"VCard"),ft=b()({name:"VCard",directives:{Ripple:Ue},props:dt(),setup(e,r){let{attrs:a,slots:t}=r;const{themeClasses:c}=de(e),{borderClasses:d}=We(e),{colorClasses:n,colorStyles:i,variantClasses:g}=ce(e),{densityClasses:o}=ve(e),{dimensionStyles:l}=ie(e),{elevationClasses:m}=qe(e),{loaderClasses:h}=Me(e),{locationStyles:f}=Ge(e),{positionClasses:_}=pe(e),{roundedClasses:T}=J(e),k=Je(e,a),R=A(()=>e.link!==!1&&k.isLink.value),I=A(()=>!e.disabled&&e.link!==!1&&(e.link||k.isClickable.value));return P(()=>{const w=R.value?"a":e.tag,V=!!(t.title||e.title!=null),$=!!(t.subtitle||e.subtitle!=null),O=V||$,j=!!(t.append||e.appendAvatar||e.appendIcon),F=!!(t.prepend||e.prependAvatar||e.prependIcon),D=!!(t.image||e.image),H=O||F||j,L=!!(t.text||e.text!=null);return W(s(w,{class:["v-card",{"v-card--disabled":e.disabled,"v-card--flat":e.flat,"v-card--hover":e.hover&&!(e.disabled||e.flat),"v-card--link":I.value},c.value,d.value,n.value,o.value,m.value,h.value,_.value,T.value,g.value,e.class],style:[i.value,l.value,f.value,e.style],href:k.href.value,onClick:I.value&&k.navigate,tabindex:e.disabled?-1:void 0},{default:()=>{var u;return[D&&s("div",{key:"image",class:"v-card__image"},[t.image?s(E,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},t.image):s(he,{key:"image-img",cover:!0,src:e.image},null)]),s(Ke,{name:"v-card",active:!!e.loading,color:typeof e.loading=="boolean"?void 0:e.loading},{default:t.loader}),H&&s(ot,{key:"item",prependAvatar:e.prependAvatar,prependIcon:e.prependIcon,title:e.title,subtitle:e.subtitle,appendAvatar:e.appendAvatar,appendIcon:e.appendIcon},{default:t.item,prepend:t.prepend,title:t.title,subtitle:t.subtitle,append:t.append}),L&&s(ut,{key:"text"},{default:()=>{var v;return[((v=t.text)==null?void 0:v.call(t))??e.text]}}),(u=t.default)==null?void 0:u.call(t),t.actions&&s(Xe,null,{default:t.actions}),ge(I.value,"v-card")]}}),[[re("ripple"),I.value&&e.ripple]])}),{}}});const ct=x({disabled:Boolean,group:Boolean,hideOnLeave:Boolean,leaveAbsolute:Boolean,mode:String,origin:String},"transition");function y(e,r,a){return b()({name:e,props:ct({mode:a,origin:r}),setup(t,c){let{slots:d}=c;const n={onBeforeEnter(i){t.origin&&(i.style.transformOrigin=t.origin)},onLeave(i){if(t.leaveAbsolute){const{offsetTop:g,offsetLeft:o,offsetWidth:l,offsetHeight:m}=i;i._transitionInitialStyles={position:i.style.position,top:i.style.top,left:i.style.left,width:i.style.width,height:i.style.height},i.style.position="absolute",i.style.top=`${g}px`,i.style.left=`${o}px`,i.style.width=`${l}px`,i.style.height=`${m}px`}t.hideOnLeave&&i.style.setProperty("display","none","important")},onAfterLeave(i){if(t.leaveAbsolute&&(i!=null&&i._transitionInitialStyles)){const{position:g,top:o,left:l,width:m,height:h}=i._transitionInitialStyles;delete i._transitionInitialStyles,i.style.position=g||"",i.style.top=o||"",i.style.left=l||"",i.style.width=m||"",i.style.height=h||""}}};return()=>{const i=t.group?Ye:me;return G(i,{name:t.disabled?"":e,css:!t.disabled,...t.group?void 0:{mode:t.mode},...t.disabled?{}:n},d.default)}}})}function be(e,r){let a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"in-out";return b()({name:e,props:{mode:{type:String,default:a},disabled:Boolean},setup(t,c){let{slots:d}=c;return()=>G(me,{name:t.disabled?"":e,css:!t.disabled,...t.disabled?{}:r},d.default)}})}function Se(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";const a=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1)?"width":"height",t=te(`offset-${a}`);return{onBeforeEnter(n){n._parent=n.parentNode,n._initialStyle={transition:n.style.transition,overflow:n.style.overflow,[a]:n.style[a]}},onEnter(n){const i=n._initialStyle;n.style.setProperty("transition","none","important"),n.style.overflow="hidden";const g=`${n[t]}px`;n.style[a]="0",n.offsetHeight,n.style.transition=i.transition,e&&n._parent&&n._parent.classList.add(e),requestAnimationFrame(()=>{n.style[a]=g})},onAfterEnter:d,onEnterCancelled:d,onLeave(n){n._initialStyle={transition:"",overflow:n.style.overflow,[a]:n.style[a]},n.style.overflow="hidden",n.style[a]=`${n[t]}px`,n.offsetHeight,requestAnimationFrame(()=>n.style[a]="0")},onAfterLeave:c,onLeaveCancelled:c};function c(n){e&&n._parent&&n._parent.classList.remove(e),d(n)}function d(n){const i=n._initialStyle[a];n.style.overflow=n._initialStyle.overflow,i!=null&&(n.style[a]=i),delete n._initialStyle}}y("fab-transition","center center","out-in");y("dialog-bottom-transition");y("dialog-top-transition");const yt=y("fade-transition"),ht=y("scale-transition");y("scroll-x-transition");y("scroll-x-reverse-transition");y("scroll-y-transition");y("scroll-y-reverse-transition");y("slide-x-transition");y("slide-x-reverse-transition");const bt=y("slide-y-transition");y("slide-y-reverse-transition");const St=be("expand-transition",Se()),_t=be("expand-x-transition",Se("",!0));export{it as I,Qe as L,ft as V,et as a,ut as b,Ze as c,he as d,St as e,mt as f,Xe as g,Y as h,yt as i,_t as j,ee as k,ht as l,bt as m,gt as u};

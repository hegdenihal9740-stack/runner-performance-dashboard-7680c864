// @ts-nocheck
import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, useInView, MotionConfig } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Menu, X, ChevronDown, Check, Zap, ShieldCheck, Globe2, Layers3, Workflow, BarChart3, Users, Boxes, Wallet, Truck, FileText, LockKeyhole, GraduationCap, ShoppingBag, Rocket, Play, Sparkles, Plus, Minus, Phone, MapPin, Github, Linkedin, Twitter, Search, CalendarDays, Mail, TrendingUp, Activity, Clock3 } from 'lucide-react'
const OrbitalScene = React.lazy(() => import('./OrbitalScene'))
const ModuleScene = React.lazy(() => import('./ModuleScenes'))
import ModuleWorkspace from './ModuleWorkspace'
import IndustryWorkspace from './IndustryWorkspace'
import IntroLoader from './IntroLoader'
import { Button } from '@/components/ui/button'
function ClientModuleScene({index,paused}){const ref=React.useRef(null);const inView=useInView(ref,{margin:'120px'});const [mounted,setMounted]=useState(false);React.useEffect(()=>setMounted(true),[]);return <div ref={ref} className="mf-scene" aria-hidden="true">{mounted&&<React.Suspense fallback={null}><ModuleScene index={index} paused={paused||!inView} sparkles={false} distance={5.8} className="mf-canvas"/></React.Suspense>}</div>}
function ClientOrbitalScene(){const [mounted,setMounted]=useState(false);React.useEffect(()=>setMounted(true),[]);if(!mounted)return <div className="orbital-canvas"/>;return <React.Suspense fallback={<div className="orbital-canvas"/>}><OrbitalScene/></React.Suspense>}

const modules = [
  {n:'01',name:'Sales & CRM',desc:'Keep sales activity and customer relationships connected in one shared workspace.',icon:Workflow,tag:'Customer growth',color:'blue'},
  {n:'02',name:'Inventory',desc:'Track stock across warehouses and channels with a clearer view of every movement.',icon:Boxes,tag:'Stock intelligence',color:'cyan'},
  {n:'03',name:'Marketing',desc:'Bring campaign planning and customer engagement into your connected operations.',icon:Sparkles,tag:'Customer engagement',color:'violet'},
  {n:'04',name:'Human Resources',desc:'Bring people operations and team workflows into the same business platform.',icon:Users,tag:'People operations',color:'blue'},
  {n:'05',name:'Finance',desc:'Manage financial workflows with a clear, connected view of your business.',icon:Wallet,tag:'Financial control',color:'green'},
  {n:'06',name:'Logistics',desc:'Coordinate routes, shipments and delivery operations from one place.',icon:Truck,tag:'Connected operations',color:'orange'},
  {n:'07',name:'Documents',desc:'Keep business files organised with centralised access and version history.',icon:FileText,tag:'One source of truth',color:'cyan'},
  {n:'08',name:'Compliance',desc:'Support accountable operations with audit trails and role-based permissions.',icon:ShieldCheck,tag:'Governance',color:'violet'}
]
const industries = [
  {name:'Education',desc:'Connect admissions, fees, faculty and academic administration.',icon:GraduationCap,number:'01',theme:'edu',tags:['Admissions','Fees','Faculty']},
  {name:'Startups',desc:'Build a connected operational foundation that can grow with your team.',icon:Rocket,number:'02',theme:'startup',tags:['Hiring','Billing','Growth']},
  {name:'Retail & E-commerce',desc:'Coordinate multichannel inventory, point of sale and customer relationships.',icon:ShoppingBag,number:'03',theme:'retail',tags:['Point of sale','Stock','Customers']}
]
const heroKeywordTags = [
 {label:'Finance',icon:Wallet,position:'keyword-finance'},
 {label:'Operations',icon:Workflow,position:'keyword-operations'},
 {label:'Sales',icon:TrendingUp,position:'keyword-sales'},
 {label:'HR',icon:Users,position:'keyword-hr'},
 {label:'Logistics',icon:Truck,position:'keyword-logistics'}
]
const faqs = [
  ['What is The Manager?','The Manager is an AI-powered business operating system from DevOps Manager LLP, bringing sales, inventory, HR, finance and operations into one platform.'],
  ['Which business modules are included?','The Manager brings together Sales & CRM, Inventory, Marketing, Human Resources, Finance, Logistics, Documents and Compliance.'],
  ['Can I try The Manager?','The official website advertises a 14-day premium trial. Use the enquiry form to ask the team about access.'],
  ['Can I request a product demonstration?','Yes. Use the Book a demo actions or contact DevOps Manager LLP by phone to discuss your requirements.'],
]
const ease=[.16,1,.3,1]
const easeIn=[.7,0,.84,0]
const fadeUp={hidden:{opacity:0,y:46,rotateX:16,scale:.97,filter:'blur(8px)'},show:(d=0)=>({opacity:1,y:0,rotateX:0,scale:1,filter:'blur(0px)',transition:{duration:.9,ease,delay:d}})}
function Reveal({children,className='',delay=0}) {return <motion.div className={className} style={{transformPerspective:1100,transformOrigin:'50% 100%'}} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={{once:true,amount:.14}}>{children}</motion.div>}
function useMedia(query){const [match,setMatch]=useState(false);React.useEffect(()=>{const mq=window.matchMedia(query);const f=()=>setMatch(mq.matches);f();mq.addEventListener('change',f);return()=>mq.removeEventListener('change',f)},[query]);return match}
function ScrollStage({children,className=''}){
 const ref=React.useRef(null)
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','start 0.35']})
 const p=useSpring(scrollYProgress,{stiffness:90,damping:22,mass:.4})
 const rotateX=useTransform(p,[0,1],[14,0]),scale=useTransform(p,[0,1],[.92,1]),y=useTransform(p,[0,1],[90,0]),opacity=useTransform(p,[0,.6],[.25,1])
 return <motion.div ref={ref} className={className} style={{rotateX,scale,y,opacity,transformPerspective:1400,transformOrigin:'50% 0%'}}>{children}</motion.div>
}
function TiltCard({children,className='',max=8}){
 const rx=useMotionValue(0),ry=useMotionValue(0)
 const sx=useSpring(rx,{stiffness:180,damping:18}),sy=useSpring(ry,{stiffness:180,damping:18})
 const onMove=e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();ry.set(((e.clientX-r.left)/r.width-.5)*max*2);rx.set(-((e.clientY-r.top)/r.height-.5)*max*2)}
 const reset=()=>{rx.set(0);ry.set(0)}
 return <motion.div className={`tilt-wrap ${className}`} onPointerMove={onMove} onPointerLeave={reset} style={{rotateX:sx,rotateY:sy,transformPerspective:1000}}>{children}</motion.div>
}
function Logo(){return <a href="#home" className="brand"><span className="brand-mark">M</span><span>the<span className="brand-light">manager</span></span></a>}
function Header(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false)
 React.useEffect(()=>{const f=()=>setScrolled(window.scrollY>20);window.addEventListener('scroll',f);return()=>window.removeEventListener('scroll',f)},[])
 const links=[['Platform','#platform'],['Solutions','#industries'],['Resources','#resources'],['Company','#company']]
 return <header className={`header ${scrolled?'scrolled':''}`}><div className="nav-wrap"><Logo/><nav className={`nav ${open?'nav-open':''}`}>{links.map(([l,h])=><a key={l} href={h} onClick={()=>setOpen(false)}>{l}{l==='Platform'&&<ChevronDown size={13}/>}</a>)}</nav><div className="nav-actions"><a href="#contact" className="button button-small">Book a demo <ArrowUpRight size={15}/></a></div><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open?<X/>:<Menu/>}</button></div></header>
}
function Eyebrow({children}){return <div className="eyebrow"><span className="eyebrow-dot"/>{children}</div>}
const headingParent={hidden:{},show:{transition:{staggerChildren:.12}}}
const headingChild={hidden:{opacity:0,y:30,rotateX:-40,filter:'blur(6px)'},show:{opacity:1,y:0,rotateX:0,filter:'blur(0px)',transition:{duration:.9,ease}}}
function SectionHeading({eyebrow,title,copy,center=false}){return <motion.div className={`section-heading ${center?'center':''}`} style={{perspective:900}} variants={headingParent} initial="hidden" whileInView="show" viewport={{once:true,amount:.3}}><motion.div variants={headingChild}><Eyebrow>{eyebrow}</Eyebrow></motion.div><motion.h2 variants={headingChild} style={{transformOrigin:'50% 100%'}}>{title}</motion.h2>{copy&&<motion.p variants={headingChild}>{copy}</motion.p>}</motion.div>}
function HeroKeywords(){
 const prefersReducedMotion=!!useReducedMotion()
 return <div className="hero-keyword-orbit" role="list" aria-label="Business areas">
  {heroKeywordTags.map(({label,icon:Icon,position},index)=><motion.div key={label} className={`orbit-label hero-keyword-tag ${position}`} role="listitem" initial={prefersReducedMotion?false:{opacity:0,y:12,scale:.94,filter:'blur(5px)'}} animate={{opacity:1,y:0,scale:1,filter:'blur(0px)'}} transition={{duration:prefersReducedMotion?0:.5,delay:prefersReducedMotion?0:.2+index*.1,ease:[.22,1,.36,1]}}><Icon size={14}/>{label}</motion.div>)}
 </div>
}
const dashTabs=[
  {label:'Overview',icon:BarChart3,eyebrow:'BUSINESS OVERVIEW',greeting:'Good morning, team',copy:'Here’s your business at a glance.',metrics:[['Total revenue','$284,120','12.8%'],['Orders processed','1,842','8.4%'],['Active customers','3,604','4.2%']],chart:'Revenue overview',chartMeta:'Revenue · USD',bars:[35,50,43,68,54,76,62,84,72,93,67,100,82,91,75,96,70,88,78,100,84,95,72,89]},
  {label:'Workflows',icon:Workflow,eyebrow:'WORKFLOW PULSE',greeting:'Work is in motion',copy:'A live view of work moving across your teams.',metrics:[['Open workflows','128','9.6%'],['Completed today','64','14.2%'],['Avg. cycle time','2.4 days','6.1%']],chart:'Workflow activity',chartMeta:'Completed · this month',bars:[38,45,54,48,68,58,77,64,70,82,73,91,65,84,78,95,80,74,89,96,83,100,86,92]},
  {label:'Inventory',icon:Boxes,eyebrow:'STOCK INTELLIGENCE',greeting:'Inventory is in sync',copy:'Stock signals from every location, in one view.',metrics:[['SKUs in stock','8,420','5.3%'],['Low-stock items','18','12.0%'],['Fulfilment rate','98.6%','2.8%']],chart:'Stock movement',chartMeta:'Units · this month',bars:[67,72,58,78,63,82,70,88,73,92,77,96,84,71,91,80,98,76,86,100,82,94,88,97]},
  {label:'Finance',icon:Wallet,eyebrow:'FINANCE SNAPSHOT',greeting:'Your numbers, at a glance',copy:'A clearer view of cash flow and business performance.',metrics:[['Monthly revenue','$284,120','12.8%'],['Operating costs','$92,460','3.2%'],['Net margin','32.5%','4.7%']],chart:'Cash flow',chartMeta:'Inflow · USD',bars:[35,43,52,47,63,56,70,62,76,69,84,75,92,81,73,87,79,95,84,100,88,96,82,91]},
  {label:'Team',icon:Users,eyebrow:'TEAM OVERVIEW',greeting:'Great work happens together',copy:'People operations and team momentum in one place.',metrics:[['Team members','246','6.2%'],['On track','92%','3.4%'],['Open positions','12','2 new']],chart:'Team activity',chartMeta:'Team actions · this month',bars:[42,50,48,61,57,68,63,76,69,82,72,89,80,75,92,84,96,78,90,100,86,95,83,97]}
 ]
const sceneV={hidden:{},show:{transition:{staggerChildren:.06}},exit:{opacity:0,y:-14,rotateX:8,filter:'blur(6px)',transition:{duration:.22,ease:easeIn}}}
const sceneItem={hidden:{opacity:0,y:18,filter:'blur(6px)'},show:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:.6,ease}}}
const metricV={hidden:{opacity:0,rotateX:-75,y:20},show:i=>({opacity:1,rotateX:0,y:0,transition:{type:'spring',stiffness:260,damping:20,delay:.08+i*.07}})}
const barV={hidden:{scaleY:0},show:i=>({scaleY:1,transition:{duration:.7,ease:[.34,1.56,.64,1],delay:.15+i*.018}})}
function DashboardMock({activeTab,onTab,progress}){
 const [period,setPeriod]=useState('Last 30 days')
 const current=dashTabs[activeTab]
 return <div className="dashboard">
  <div className="dash-top"><div className="dash-brand"><span className="mini-mark">M</span><b>themanager.app</b></div>
   <div className="dash-steps" aria-live="polite"><span className="dash-step-count">0{activeTab+1}<i>/ 0{dashTabs.length}</i></span><AnimatePresence mode="wait" initial={false}><motion.b key={activeTab} initial={{y:10,opacity:0,rotateX:-80}} animate={{y:0,opacity:1,rotateX:0}} exit={{y:-10,opacity:0,rotateX:80}} transition={{duration:.35,ease}}>{current.label}</motion.b></AnimatePresence></div>
   <span className="dash-live"><b/> Live workspace</span>
   <motion.div className="dash-progress" style={{scaleX:progress}}/>
  </div>
  <div className="dash-body"><aside className="dash-side" aria-label="Workspace sections"><div className="dash-avatar">M</div>{dashTabs.map(({icon:Icon,label},i)=><button type="button" className={`dash-tab ${i===activeTab?'active':''}`} key={label} onClick={()=>onTab(i)} aria-label={label} aria-pressed={i===activeTab} title={label}>{i===activeTab&&<motion.span layoutId="dash-tab-pill" className="dash-tab-pill" transition={{type:'spring',stiffness:420,damping:32}}/>}<Icon size={15}/></button>)}</aside>
   <div className="dash-main"><AnimatePresence mode="wait" initial={false}><motion.div key={activeTab} className="dash-scene" variants={sceneV} initial="hidden" animate="show" exit="exit">
    <motion.div className="dash-welcome" variants={sceneItem}><div><small>{current.eyebrow}</small><h3>{current.greeting} <span>✦</span></h3><p>{current.copy}</p></div><label className="period-select"><span className="sr-only">Reporting period</span><select value={period} onChange={event=>setPeriod(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></label></motion.div>
    <div className="metric-grid">{current.metrics.map(([label,value,change],i)=><motion.div className="metric" key={label} variants={metricV} custom={i} style={{transformPerspective:600,transformOrigin:'50% 0%'}}><small>{label}</small><strong>{value}</strong><em>↗ {change} <span>vs last month</span></em></motion.div>)}</div>
    <motion.div className="dash-chart" variants={sceneItem}><div className="chart-head"><b>{current.chart}</b><small>{current.chartMeta}</small></div><div className="chart-bars">{current.bars.map((h,i)=><motion.i key={i} variants={barV} custom={i} style={{height:`${h}%`,transformOrigin:'50% 100%'}}/>)}</div><div className="chart-labels"><span>OCT 18</span><span>OCT 25</span><span>NOV 01</span><span>NOV 08</span><span>NOV 16</span></div></motion.div>
   </motion.div></AnimatePresence></div>
  </div>
  <div className="dash-float float-one"><span className="float-icon"><Check size={15}/></span><span><b>Inventory synced</b><small>All locations updated</small></span><span className="float-check">✓</span></div>
  <div className="dash-float float-two"><span className="float-icon purple"><Zap size={15}/></span><span><b>AI insight ready</b><small>3 opportunities found</small></span></div>
 </div>
}
function Hero(){
 const ref=React.useRef(null)
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']})
 const p=useSpring(scrollYProgress,{stiffness:100,damping:24,mass:.3})
 const copyY=useTransform(p,[0,1],[0,-140]),copyO=useTransform(p,[0,.75],[1,0]),copyBlur=useTransform(p,[0,.75],['blur(0px)','blur(6px)'])
 const visY=useTransform(p,[0,1],[0,180]),visScale=useTransform(p,[0,1],[1,.74]),visRot=useTransform(p,[0,1],[0,-22])
 return <section ref={ref} className="hero" id="home"><div className="hero-grid-bg"/><div className="hero-glow"/>
  <div className="container hero-inner"><motion.div className="hero-copy" style={{y:copyY,opacity:copyO,filter:copyBlur}}>  <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.1}}><span className="release-pill"><span/> Beta release <ArrowUpRight size={13}/></span></motion.div>
  <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.8}}>Run your entire<br/><span>business, beautifully.</span></motion.h1>
  <motion.p className="hero-sub" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.35}}>One unified platform for sales, inventory, HR, finance and operations. Real-time data flows across every module, so your teams can work from one source of truth.</motion.p>
   <motion.div className="hero-buttons" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.48}}><a className="button" href="#contact">Get started <ArrowUpRight size={17}/></a><a className="button button-ghost" href="#platform"><span className="play"><Play size={12} fill="currentColor"/></span> Explore the platform</a></motion.div>
   <motion.div className="hero-proof" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}><div className="proof-avatars"><i>J</i><i>A</i><i>M</i><i>+</i></div><span>Built for ambitious teams<br/><b>Join 10,000+ teams scaling their operations.</b></span></motion.div>
  </motion.div><motion.div className="hero-visual-parallax" style={{y:visY,scale:visScale,rotateX:visRot,transformPerspective:1200}}><motion.div className="hero-visual" initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{delay:.25,duration:1}}><ClientOrbitalScene/><HeroKeywords/></motion.div></motion.div></div>
  <div className="hero-bottom"><span>BUILT FOR TEAMS THAT MOVE FORWARD</span><div className="scroll-line"/><span>SCROLL TO EXPLORE ↓</span></div>
 </section>
}
function Ticker(){return <div className="ticker"><div className="ticker-track">{['Real-time sync','AI insights','Cloud native','Bank-grade security','Multi-currency','Open API','24/7 support','Mobile first','Custom workflows','Smart automation','Global scale','Zero downtime','Real-time sync','AI insights','Cloud native','Bank-grade security','Multi-currency','Open API','24/7 support','Mobile first','Custom workflows','Smart automation','Global scale','Zero downtime'].map((x,i)=><span key={i}><i>✳</i>{x}</span>)}</div></div>}
function Platform(){
 const pinRef=React.useRef(null)
 const n=dashTabs.length
 const [active,setActive]=useState(0)
 const {scrollYProgress}=useScroll({target:pinRef,offset:['start 15%','end 85%']})
 const smooth=useSpring(scrollYProgress,{stiffness:120,damping:26,mass:.3})
 useMotionValueEvent(scrollYProgress,'change',v=>{const i=Math.max(0,Math.min(n-1,Math.floor(v*n)));setActive(prev=>prev===i?prev:i)})
 const {scrollYProgress:enter}=useScroll({target:pinRef,offset:['start end','start 30%']})
 const enterS=useSpring(enter,{stiffness:80,damping:20,mass:.5})
 const rotateX=useTransform(enterS,[0,1],[32,0]),scale=useTransform(enterS,[0,1],[.84,1]),y=useTransform(enterS,[0,1],[110,0])
 const rotateY=useTransform(smooth,[0,.5,1],[-6,0,6])
 const goTo=i=>{const el=pinRef.current;if(!el)return;const vh=window.innerHeight;const top=el.getBoundingClientRect().top+window.scrollY-vh*.15;const range=el.offsetHeight-vh*.7;window.scrollTo({top:top+range*((i+.5)/n),behavior:'smooth'})}
 return <section className="section platform-section" id="platform"><div className="container"><div className="platform-intro"><SectionHeading eyebrow="THE PLATFORM" title={<>The whole business.<br/><span className="gradient-text">Finally in sync.</span></>} copy="Every module speaks the same language. Real-time information connects sales, inventory, finance and operations without a separate integration to maintain."/></div><div ref={pinRef} className="dash-pin"><motion.div className="dash-stage" style={{rotateX,rotateY,scale,y,transformPerspective:1600,transformOrigin:'50% 0%'}}><DashboardMock activeTab={active} onTab={goTo} progress={smooth}/></motion.div><div className="dash-pin-spacer" style={{height:`${n*55}vh`}} aria-hidden="true"/></div>
  <div className="platform-bottom"><div><span className="mini-kicker">ONE CONNECTED EXPERIENCE</span><h3>Every team sees<br/>the bigger picture.</h3></div><p>When your business runs on a shared foundation, information moves with your work. Give teams the context they need to make better decisions.</p><a href="#modules" className="text-link">Explore all modules <ArrowRight size={16}/></a></div>
 </div></section>
}
const moduleAccents={blue:'#8fb0ff',cyan:'#5ee6d6',violet:'#bf9bff',green:'#6ee7a8',orange:'#ffb27a'}
function Modules(){
 const [active,setActive]=useState(0)
 const [workspaceOpen,setWorkspaceOpen]=useState(false)
 const openWorkspace=index=>{setActive(index);setWorkspaceOpen(true)}
 const closeWorkspace=React.useCallback(()=>setWorkspaceOpen(false),[])
 const rowRefs=React.useRef([])
 React.useEffect(()=>{const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(Number(e.target.dataset.index))})},{rootMargin:'-46% 0px -46% 0px'});rowRefs.current.forEach(el=>el&&io.observe(el));return()=>io.disconnect()},[])
 return <section className="section modules-section" id="modules" style={{'--mod-accent':moduleAccents[modules[active].color]}}><div className="modules-aurora" aria-hidden="true"><i/><i/><span className="modules-grid"/></div><div className="container"><SectionHeading eyebrow="CAPABILITIES" title={<>Everything you need.<br/><span className="muted-heading">Nothing you don't.</span></>} copy="Choose a module to step inside a live, interactive workspace. Explore the connected tools your team could use every day."/>
 <div className="module-layout"><div className="module-list" role="list" aria-label="Business modules">{modules.map((m,i)=>{const I=m.icon;return <motion.button type="button" key={m.name} ref={el=>{rowRefs.current[i]=el}} data-index={i} onMouseEnter={()=>setActive(i)} initial={{opacity:0,x:-40,rotateY:-25}} whileInView={{opacity:1,x:0,rotateY:0}} viewport={{once:true,amount:.5}} transition={{duration:.7,ease,delay:i*.05}} style={{transformPerspective:900,transformOrigin:'0% 50%'}} className={`module-row ${active===i?'selected':''}`} onClick={()=>openWorkspace(i)} aria-pressed={active===i}>{active===i&&<motion.span layoutId="module-active-bar" className="module-active-bar" transition={{type:'spring',stiffness:380,damping:30}}/>}<span className="module-num">{m.n}</span><span className={`module-icon ${m.color}`}><I size={19}/></span><span className="module-title">{m.name}<small>{m.tag}</small></span><ArrowUpRight className="module-arrow" size={17}/></motion.button>})}</div>
 <TiltCard className="module-feature-stage" max={6}><AnimatePresence mode="wait" initial={false}><motion.div className={`module-feature ${modules[active].color}`} key={active} style={{transformPerspective:1200}} initial={{opacity:0,rotateY:38,x:40,scale:.94,filter:'blur(8px)'}} animate={{opacity:1,rotateY:0,x:0,scale:1,filter:'blur(0px)',transition:{duration:.55,ease}}} exit={{opacity:0,rotateY:-30,x:-30,scale:.96,filter:'blur(6px)',transition:{duration:.2,ease:easeIn}}}><div className="feature-particles" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div><motion.div className={`feature-orb ${modules[active].color}`} initial={{rotateY:-180,scale:.5,opacity:0}} animate={{rotateY:0,scale:1,opacity:1}} transition={{type:'spring',stiffness:160,damping:14,delay:.05}} style={{transformPerspective:600}}>{React.createElement(modules[active].icon,{size:43,strokeWidth:1.4})}</motion.div><span className="feature-number">MODULE / {modules[active].n}</span><h3 className="feature-title" aria-label={modules[active].name}>{modules[active].name.split('').map((c,k)=><motion.span key={k} aria-hidden="true" initial={{opacity:0,y:'0.6em',rotateX:-90}} animate={{opacity:1,y:0,rotateX:0}} transition={{delay:.12+k*.028,duration:.5,ease}} style={{display:'inline-block',whiteSpace:'pre',transformOrigin:'50% 100%'}}>{c}</motion.span>)}</h3><p>{modules[active].desc}</p><button type="button" className="text-link" onClick={()=>openWorkspace(active)}>Open interactive workspace <ArrowUpRight size={16}/></button><div className="feature-lines" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></motion.div></AnimatePresence><ClientModuleScene index={active} paused={workspaceOpen}/></TiltCard></div>
 </div><AnimatePresence>{workspaceOpen&&<ModuleWorkspace modules={modules} moduleIndex={active} onSelect={setActive} onClose={closeWorkspace}/>}</AnimatePresence></section>
}
const tagParent=(d)=>({hidden:{},show:{transition:{staggerChildren:.08,delayChildren:.45+d}}})
const tagChild={hidden:{opacity:0,y:10,scale:.9},show:{opacity:1,y:0,scale:1,transition:{duration:.5,ease}}}
function IndustryCard({x,i,onOpen}){
 const I=x.icon
 const onMove=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--my',`${e.clientY-r.top}px`)}
 return <Reveal delay={i*.12}><TiltCard max={9}><a className={`industry-card ind-${x.theme}`} href="#industries" onClick={e=>{e.preventDefault();onOpen(x.theme)}} onPointerMove={onMove}>
  <span className="industry-border" aria-hidden="true"/>
  <span className="industry-spot" aria-hidden="true"/>
  <span className="industry-num" aria-hidden="true">{x.number}</span>
  <div className="industry-top"><span>{x.number} / INDUSTRY</span><span className="industry-arrow"><ArrowUpRight size={16}/></span></div>
  <motion.div className="industry-icon" animate={{y:[0,-7,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut',delay:i*.7}}><span className="industry-ring" aria-hidden="true"/><I size={27}/></motion.div>
  <h3>{x.name}</h3><p>{x.desc}</p>
  <motion.ul className="industry-tags" variants={tagParent(i*.12)} initial="hidden" whileInView="show" viewport={{once:true,amount:.4}}>{x.tags.map(t=><motion.li key={t} variants={tagChild}>{t}</motion.li>)}</motion.ul>
  <span className="industry-link">Explore solution <ArrowRight size={15}/></span>
 </a></TiltCard></Reveal>
}
function Industries(){
 const [open,setOpen]=useState(null)
 const close=React.useCallback(()=>setOpen(null),[])
 return <section className="section industries-section" id="industries"><div className="ind-backdrop" aria-hidden="true"><span className="ind-blob ind-blob-a"/><span className="ind-blob ind-blob-b"/><span className="ind-blob ind-blob-c"/><span className="ind-gridlines"/></div><ScrollStage className="container"><div className="industry-head"><SectionHeading eyebrow="BUILT FOR YOUR WORLD" title={<>Flexible by design.<br/><span className="gradient-text">Ready for your industry.</span></>} copy="Different industries. Different challenges. One connected platform that adapts to the way your organisation works."/><a href="#contact" className="text-link">Find your solution <ArrowRight size={16}/></a></div><div className="industry-grid">{industries.map((x,i)=><IndustryCard key={x.name} x={x} i={i} onOpen={setOpen}/>)}</div></ScrollStage><AnimatePresence>{open&&<IndustryWorkspace kind={open} onSelect={setOpen} onClose={close}/>}</AnimatePresence></section>
}
function Why(){
 const reducedMotion=useReducedMotion()
 const items=[['One connected source','Reduce silos with shared data across teams and departments.',Layers3],['Clarity in real time','Give decision-makers a more current view of business performance.',Zap],['Built with security in mind','Support controlled access and accountable workflows.',LockKeyhole],['Ready to grow with you','Connect more processes as your organisation evolves.',Globe2]]
 return <section className="section why-section" id="company" aria-labelledby="company-heading"><div className="container why-content">
  <div className="why-intro">
   <motion.div initial={reducedMotion?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.7,ease}}><Eyebrow>THE MANAGER DIFFERENCE</Eyebrow><h2 id="company-heading">Less complexity.<br/><span>More momentum.</span></h2></motion.div>
   <motion.div className="why-summary" initial={reducedMotion?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.7,delay:.12,ease}}><p>The Manager is an AI-powered business operating system from DevOps Manager LLP, built for companies ready to scale. Bring finance, operations, sales, HR and customer workflows together.</p><Button asChild variant="ghost" className="why-cta"><a href="#contact">Meet The Manager <ArrowUpRight size={18}/></a></Button></motion.div>
  </div>
  <div className="why-connection" aria-hidden="true"><motion.span initial={reducedMotion?false:{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:1.2,ease}}/><i/><i/><i/><i/></div>
  <div className="why-items">{items.map(([t,d,I],i)=><motion.article key={t} className={`why-item why-tone-${i}`} initial={reducedMotion?false:{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.65,delay:i*.1,ease}} whileHover={reducedMotion?undefined:{y:-6}}>
   <div className="why-item-top"><motion.span className="why-icon" whileHover={reducedMotion?undefined:{rotate:-8,scale:1.08}}><I size={25} strokeWidth={1.5}/></motion.span><span className="why-index">0{i+1}</span></div>
   <h3>{t}</h3><p>{d}</p><span className="why-item-line" aria-hidden="true"/>
  </motion.article>)}</div>
 </div></section>
}
function Process(){
 const steps=[['Discover','Understand your teams, priorities and current workflows.'],['Connect','Bring the right modules and information together.'],['Coordinate','Help teams work from shared, up-to-date context.'],['Improve','Use insights to keep refining how work gets done.']]
 return <section className="section process-section"><ScrollStage className="container"><SectionHeading eyebrow="A CLEARER WAY FORWARD" title="From disconnected to in sync." copy="A thoughtful path to bringing your business workflows together." center/><div className="process-grid">{steps.map(([t,d],i)=><Reveal key={t} delay={i*.1}><div className="process-step"><div className="process-top"><span>0{i+1}</span>{i!==3&&<motion.div className="process-connector" initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:1}} transition={{duration:1.1,ease,delay:.3+i*.15}} style={{transformOrigin:'0% 50%'}}/>}</div><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></ScrollStage></section>
}
function Trust(){
 return <section className="trust-strip"><ScrollStage className="container trust-inner"><div><span className="mini-kicker">A CONNECTED FOUNDATION</span><h3>One ecosystem.<br/><span className="gradient-text">Many possibilities.</span></h3></div><div className="trust-points"><span><Check/> Real-time workflows</span><span><Check/> Cloud-native foundation</span><span><Check/> Open API approach</span><span><Check/> Role-based access</span></div></ScrollStage></section>
}
function Resources(){
 const posts=[['GUIDE','A practical guide to connected business operations','Learn how a unified view can help teams reduce friction between everyday workflows.','01'],['INSIGHTS','From business data to better decisions','Explore why timely information matters when teams need to make confident decisions.','02'],['PRODUCT','Getting started with a modular management platform','A look at how teams can approach connected modules around their needs.','03']]
 const [selectedPost,setSelectedPost]=useState(null)
 return <section className="section resources-section" id="resources"><ScrollStage className="container"><div className="resources-head"><SectionHeading eyebrow="THE KNOWLEDGE DESK" title={<>Ideas for better<br/><span className="muted-heading">ways of working.</span></>} copy="Perspectives, practical guides and product updates for teams building what comes next."/></div><div className="resource-grid">{posts.map(([tag,title,desc,n],i)=><Reveal key={n} delay={i*.08}><TiltCard max={6}><article className="resource-card"><div className={`resource-art art-${i}`}><span>{tag} / 2026</span><div className="art-shape"><i/><i/><i/></div><b>TM<span>.</span></b></div><div className="resource-content"><span className="resource-tag">{tag} <span>·</span> 5 MIN READ</span><h3>{title}</h3><p>{desc}</p><button type="button" className="text-link" onClick={()=>setSelectedPost({tag,title,desc})}>Read article <ArrowUpRight size={15}/></button></div></article></TiltCard></Reveal>)}</div></ScrollStage><AnimatePresence>{selectedPost&&<motion.div className="article-modal" role="presentation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelectedPost(null)}><motion.div className="article-dialog" role="dialog" aria-modal="true" aria-labelledby="article-title" initial={{opacity:0,y:18,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:.98}} onClick={e=>e.stopPropagation()}><button type="button" className="article-close" aria-label="Close article preview" onClick={()=>setSelectedPost(null)}><X size={20}/></button><Eyebrow>{selectedPost.tag} / ARTICLE PREVIEW</Eyebrow><h3 id="article-title">{selectedPost.title}</h3><p>{selectedPost.desc}</p><a href="#contact" className="button" onClick={()=>setSelectedPost(null)}>Talk to our team <ArrowUpRight size={16}/></a></motion.div></motion.div>}</AnimatePresence></section>
}
function FAQ(){
 const [expanded,setExpanded]=useState(0)
 return <section className="section faq-section"><ScrollStage className="container faq-layout"><div><SectionHeading eyebrow="NEED TO KNOW" title={<>A few things,<br/><span className="muted-heading">made clearer.</span></>} copy="Have a question about The Manager? Start here, or get in touch with our team."/></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${expanded===i?'open':''}`} key={q}><button aria-expanded={expanded===i} onClick={()=>setExpanded(expanded===i?-1:i)}><span>{q}</span>{expanded===i?<Minus size={18}/>:<Plus size={18}/>}</button><AnimatePresence>{expanded===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{a}</motion.p>}</AnimatePresence></div>)}</div></ScrollStage></section>
}
function Contact(){
 const [sent,setSent]=useState(false)
 const submit=e=>{e.preventDefault();setSent(true)}
 return <section className="contact-section" id="contact"><ScrollStage className="container contact-wrap"><div className="contact-copy"><Eyebrow>YOUR NEXT CHAPTER STARTS HERE</Eyebrow><h2>Ready to manage<br/><span>better?</span></h2><p>Ask DevOps Manager LLP about The Manager, its 14-day premium trial, or a product demonstration.</p><div className="contact-details"><a href="tel:+917259108111"><Phone size={16}/> 072591 08111 <small>Call DevOps Manager LLP</small></a><a href="https://www.google.com/maps/search/?api=1&query=Old+Kent+Rd%2C+Attavar%2C+Mangaluru%2C+Karnataka+575001" target="_blank" rel="noreferrer"><MapPin size={16}/> DevOps Manager LLP <small>Old Kent Rd, Attavar, Mangaluru, Karnataka 575001</small></a></div></div><form className="contact-form" onSubmit={submit}><div className="form-top"><span>LET'S TALK</span><span className="form-step">01 — 04</span></div><h3>Tell us a little about yourself.</h3><div className="form-row"><label>Full name<input required placeholder="Your name"/></label><label>Work email<input required type="email" placeholder="you@company.com"/></label></div><div className="form-row"><label>Company<input placeholder="Company name"/></label><label>I'm interested in<select defaultValue=""><option value="" disabled>Select a module</option>{modules.map(m=><option key={m.name}>{m.name}</option>)}<option>Full platform demo</option><option>14-day premium trial</option></select></label></div><label>How can we help?<textarea rows="3" placeholder="Tell us what you're looking to improve..."/></label><button className="button form-submit" type="submit">{sent?'Request captured locally':'Request a demo or trial'} <ArrowUpRight size={16}/></button><small className="form-note">{sent?'Demo mode only: connect this form to your CRM or backend to receive enquiries.':'By submitting, you agree to be contacted about your enquiry.'}</small></form></ScrollStage></section>
}
function Footer(){
 return <footer className="footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Logo/><p>Redefining the architecture of enterprise management. Precision, scale and intelligence in one unified platform.</p><div className="socials"><a href="#contact" aria-label="LinkedIn"><Linkedin/></a><a href="#contact" aria-label="X"><Twitter/></a><a href="#contact" aria-label="GitHub"><Github/></a></div></div><div className="footer-col"><b>PLATFORM</b><a href="#modules">Modules</a><a href="#platform">Features</a><a href="#industries">Solutions</a><a href="#contact">Book a demo</a></div><div className="footer-col"><b>COMPANY</b><a href="#company">About</a><a href="#resources">Insights</a><a href="#contact">Careers</a><a href="#contact">Contact</a></div><div className="footer-col"><b>RESOURCES</b><a href="#resources">Guides</a><a href="#resources">Documentation</a><a href="#contact">API enquiries</a><a href="#contact">Support</a></div><div className="footer-col"><b>LEGAL</b><a href="#contact">Privacy</a><a href="#contact">Terms</a><a href="#contact">Security</a><a href="#contact">Cookies</a></div></div><div className="footer-bottom"><span>© 2026 The Manager. All rights reserved.</span><span>Designed for connected work <span className="footer-star">✳</span></span></div></div></footer>
}
export default function ManagerSite(){
 const [introVisible,setIntroVisible]=useState(true)
 const {scrollYProgress}=useScroll()
 const progress=useSpring(scrollYProgress,{stiffness:140,damping:28,mass:.3})
 const hideIntro=React.useCallback(()=>setIntroVisible(false),[])
 return <MotionConfig reducedMotion="user"><motion.div className="scroll-progress" style={{scaleX:progress}} aria-hidden="true"/><AnimatePresence>{introVisible&&<IntroLoader key="intro" onDone={hideIntro}/>}</AnimatePresence><Header/><main><Hero/><Ticker/><Platform/><Modules/><Industries/><Why/><Process/><Trust/><Resources/><FAQ/><Contact/></main><Footer/><a href="#home" className="back-top" aria-label="Back to top">↑</a></MotionConfig>
}
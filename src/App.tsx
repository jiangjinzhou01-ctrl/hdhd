import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDownIcon, ArrowUpRightIcon, CaretRightIcon, CheckIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { story } from './story'
import { Reveal, SceneDrift, SceneTitle } from './StoryMotion'

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

function SiteHeader() {
  return <header className="site-header"><div className="wrap masthead"><a href="#beginning" className="site-name">电话那头，今天见</a><nav aria-label="故事导航"><a href="#night-calls">回忆</a><a href="#today">今天</a><a href="#letter">写给你</a></nav></div></header>
}

function OpeningScene() {
  const scene = useRef<HTMLElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  function enter() {
    document.getElementById('night-calls')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
    document.getElementById('night-title')?.focus({ preventScroll: true })
  }
  return <section ref={scene} id="beginning" className="opening" aria-labelledby="opening-title"><div className="wrap hero-inner">
    <p className="dedication">{story.cover.address}</p>
    <h1 id="opening-title"><span>今天，</span><span className="headline-window"><motion.strong initial={reduced ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}>{story.cover.headline}</motion.strong></span></h1>
    <p className="hero-description">{story.cover.memory}</p>
    <div className="hero-actions"><motion.button className="enter-button" onClick={enter} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.96 }}>接起这段回忆<ArrowDownIcon size={17} aria-hidden="true" /></motion.button><a className="hero-letter-link" href="#letter">写给你的话<CaretRightIcon size={16} aria-hidden="true" /></a></div>
    <SceneDrift className="hero-art" target={scene} distance={44} scale={0.98}>
      <figure className="date-visual"><div className="still-media">{imageFailed ? <span className="date-fallback">10.25</span> : <motion.picture initial={reduced ? false : { scale: 1.07 }} animate={{ scale: 1 }} transition={{ duration: reduced ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}><source media="(max-width: 767px)" srcSet={asset('meeting-date-mobile.webp')} /><img src={asset('meeting-date.webp')} width="1536" height="1024" alt="10.25，见面纪念日期的银色立体排版意象。" fetchPriority="high" onError={() => setImageFailed(true)} /></motion.picture>}</div><figcaption><time dateTime={story.dateISO}>{story.date}</time><span>长沙，见面纪念</span></figcaption></figure>
    </SceneDrift>
  </div></section>
}

function NightCalls() {
  const scene = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  const [beginning, ending] = story.night.themes[selected].text.split('，')
  return <section ref={scene} id="night-calls" className="night-calls scene" aria-labelledby="night-title"><div className="wrap">
    <div className="chapter-heading"><SceneTitle id="night-title" tabIndex={-1}>{story.night.title}</SceneTitle><Reveal distance={20}><p className="body-copy"><span className="lead">{story.night.lead}</span>{story.night.body}</p></Reveal></div>
    <Reveal className="night-feature" distance={44}>
      <figure className="night-photo">{!imageFailed && <img src={asset('night-still-life.webp')} width="1536" height="1024" alt="深夜电话的静物意象，并非我们的物品实拍。" loading="lazy" onError={() => setImageFailed(true)} />}<figcaption><span>23:00</span><p>十一点了，还没聊完。</p></figcaption></figure>
      <SceneDrift className="call-memory" target={scene} distance={50}>
        <div className="theme-buttons" role="group" aria-label="回忆里的通话主题">{story.night.themes.map((theme, i) => <button key={theme.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{theme.label}</button>)}</div>
        <div className="memory-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.17 }}><span>{beginning}，</span><strong>{ending}</strong></motion.p></AnimatePresence></div>
      </SceneDrift>
    </Reveal>
  </div></section>
}

function DuoMemory() {
  const scene = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  return <section ref={scene} id="duo" className="duo-memory scene" aria-labelledby="duo-title"><div className="wrap">
    <div className="chapter-heading"><SceneTitle id="duo-title">{story.duo.title}</SceneTitle><Reveal distance={20}><p className="body-copy">{story.duo.body}</p></Reveal></div>
    <Reveal className={`duo-stage ${ready ? 'is-ready' : ''}`} distance={42}>
      <div className="duo-visual" role="group" aria-label="这段回忆里的我和你"><SceneDrift className="memory-cards" target={scene} distance={42} scale={0.9}><motion.div className="memory-card card-me" animate={{ y: ready ? 0 : -12, rotate: ready ? 0 : -7 }} transition={{ duration: reduced ? 0 : 0.25 }}><span>我</span><small>一起</small></motion.div><motion.div className="memory-card card-you" animate={{ y: ready ? 0 : 12, rotate: ready ? 0 : 7 }} transition={{ duration: reduced ? 0 : 0.25 }}><span>你</span><small>并肩</small></motion.div></SceneDrift><p className="duo-caption">一起打过的很多局</p></div>
      <div className="duo-controls"><motion.button className="ready-button" aria-pressed={ready} onClick={() => setReady(!ready)} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.96 }}>{ready ? <CheckIcon size={18} aria-hidden="true" /> : <PlusIcon size={18} aria-hidden="true" />}<span>{ready ? '再准备一次' : '一起准备'}</span></motion.button><div className="duo-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={String(ready)} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.14 }}>{ready ? story.duo.feedback : '有你在，就很熟悉。'}</motion.p></AnimatePresence></div></div>
    </Reveal>
  </div></section>
}

function SmallSurprise() {
  const reduced = useReducedMotion()
  return <motion.aside className="small-surprise" aria-label="100 元的小惊喜" initial={reduced ? false : { y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduced ? 0 : 0.8 }}><p className="surprise-amount" aria-label="100 元"><span>¥</span>100</p><div className="surprise-copy"><p>{story.surprise.body}<br />{story.surprise.feeling}</p><details><summary>那一刻的我<PlusIcon className="details-icon" size={16} aria-hidden="true" /></summary><p>{story.surprise.detail}</p></details></div></motion.aside>
}

function CitiesMeet() {
  const scene = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  return <section ref={scene} id="today" className="cities-meet scene" aria-labelledby="meeting-title"><div className="wrap">
    <div className="chapter-heading"><SceneTitle id="meeting-title">{story.meeting.title}</SceneTitle><Reveal distance={20}><p className="body-copy">{story.meeting.body}</p></Reveal></div>
    <div className="arrival-poster" role="group" aria-label="你在邵阳，我在长沙。今天，我们已经在长沙见面了。"><Reveal className="arrival-origin" distance={24}><p>你从</p><strong>邵阳</strong></Reveal><SceneDrift className="arrival-destination" target={scene} distance={56}><p>来到</p><motion.div className="city-word-window" initial={reduced ? false : 'before'} whileInView="visible" viewport={{ once: true, amount: 0.15 }}><motion.span className="city-word" variants={{ before: { y: 130 }, visible: { y: 0 } }} transition={{ duration: reduced ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}>长沙</motion.span></motion.div><p className="meeting-note">这一次，已经见到你本人。</p></SceneDrift></div>
    <SmallSurprise />
  </div></section>
}

function FinalLetter() {
  const reduced = useReducedMotion()
  const [shareMessage, setShareMessage] = useState('')
  async function share() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin).href
    try {
      if (navigator.share) { await navigator.share({ title: story.title, text: '罗琛尧，今天我们见面了。这份纪念，送给你。', url }); setShareMessage('已打开分享。') }
      else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url); setShareMessage('链接已复制，可以发给你了。') }
      else setShareMessage('请复制浏览器地址，把这份纪念分享出去。')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setShareMessage('等你想分享的时候再发。')
      else setShareMessage('暂时无法分享，请复制浏览器地址。')
    }
  }
  const [first, second] = story.blessing.split('你永远')
  const [beforeSchool, afterSchool] = first.split('娄底三中')
  return <section id="letter" className="final-letter scene" aria-labelledby="letter-title"><div className="wrap"><div className="letter-sheet"><p className="letter-intro">见面之后，还有几句话。</p><SceneTitle id="letter-title">{story.friend}，</SceneTitle><Reveal className="letter-body" distance={24} delay={0.1}>{story.letter.map(line => <p key={line}>{line}</p>)}</Reveal><div className="letter-actions"><a href="#beginning" className="text-button">再读一遍<ArrowUpRightIcon size={16} aria-hidden="true" /></a><button className="text-button" onClick={share}><ShareNetworkIcon size={17} aria-hidden="true" />分享这份回忆</button></div><p className="share-feedback" role="status">{shareMessage}</p><motion.p className="final-blessing" initial={reduced ? false : { y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: reduced ? 0 : 0.9 }}>{beforeSchool}<span className="no-break">娄底三中</span>{afterSchool}<br className="blessing-break" />你永远{second.split('best friends')[0]}<strong>best friends。</strong></motion.p></div></div></section>
}

export function App() {
  return <><a href="#night-calls" className="skip-link">跳到回忆正文</a><SiteHeader /><main id="story"><OpeningScene /><NightCalls /><DuoMemory /><CitiesMeet /><FinalLetter /></main></>
}

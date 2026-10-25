import { useEffect, useRef, useState, type RefObject, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownIcon, ArrowUpRightIcon, CheckIcon, PhoneIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { story } from './story'

function ConnectionPath({ container }: { container: RefObject<HTMLElement | null> }) {
  const [geometry, setGeometry] = useState({ d: '', width: 1, height: 1 })
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.025, 1])
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = container.current
    if (!root) return
    let frame = 0
    const measure = () => {
      const bounds = root.getBoundingClientRect()
      const points = [...root.querySelectorAll<HTMLElement>('[data-wire]')].map((node) => {
        const b = node.getBoundingClientRect()
        return { x: b.left - bounds.left + b.width / 2, y: b.top - bounds.top + b.height / 2 }
      })
      if (!points.length) return
      let d = `M ${points[0].x} ${points[0].y}`
      points.slice(1).forEach((p, i) => {
        const previous = points[i]
        const bend = Math.min((p.y - previous.y) * 0.4, 150)
        d += ` C ${previous.x} ${previous.y + bend}, ${p.x} ${p.y - bend}, ${p.x} ${p.y}`
      })
      setGeometry({ d, width: bounds.width, height: bounds.height })
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(root)
    root.querySelectorAll('section, details').forEach((node) => observer.observe(node))
    schedule()
    document.fonts.ready.then(schedule)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [container])

  return <svg className="connection-path" width={geometry.width} height={geometry.height} aria-hidden="true">
    <path d={geometry.d} stroke="var(--amber)" strokeOpacity="0.19" fill="none" strokeWidth="1.5" />
    <motion.path d={geometry.d} stroke="var(--amber)" fill="none" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: reduced ? 1 : pathLength }} />
  </svg>
}

function StoryShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  return <main ref={ref} id="story" className="story-shell relative isolate">
    <ConnectionPath container={ref} />{children}
  </main>
}

function WireMarker({ className = '' }: { className?: string }) {
  return <span data-wire className={`wire-marker ${className}`} aria-hidden="true" />
}

function OpeningScene() {
  const [entered, setEntered] = useState(false)
  const reduced = useReducedMotion()
  function enter() {
    setEntered(true)
    document.getElementById('night-calls')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
    document.getElementById('night-title')?.focus({ preventScroll: true })
  }
  return <section id="beginning" className="opening scene" aria-labelledby="opening-title">
    <header className="masthead wrap flex items-center justify-between gap-4">
      <a href="#beginning" className="site-name inline-flex items-center gap-3" aria-label="电话那头，今天见，回到开头">
        <PhoneIcon size={18} weight="regular" aria-hidden="true" /><span>电话那头，今天见</span>
      </a>
      <time className="date" dateTime={story.dateISO}>{story.date}</time>
    </header>
    <div className="opening-layout wrap">
      <div className="opening-copy">
        <p className="dedication">给罗琛尧的一份小礼物</p>
        <motion.h1 id="opening-title" animate={{ y: entered && !reduced ? -5 : 0 }} transition={{ duration: 0.2 }}>
          电话那头，<br /><span>今天见。</span>
        </motion.h1>
        <p className="opening-description">{story.opening}</p>
        <button className="enter-button" onClick={enter}>
          <span className="phone-button"><PhoneIcon size={23} weight="regular" aria-hidden="true" /><WireMarker className="opening-wire" /></span>
          <span>接起这段回忆</span><ArrowDownIcon size={19} aria-hidden="true" />
        </button>
      </div>
      <div className={`clock-art ${entered ? 'is-entered' : ''}`} aria-label="记忆里的晚上十一点">
        <div className="clock-orbit orbit-one" aria-hidden="true" />
        <div className="clock-orbit orbit-two" aria-hidden="true" />
        <div className="clock-center"><span className="clock-time">23<span className="clock-colon">:</span>00</span><span className="clock-caption">那些还没聊完的夜晚</span></div>
        <svg viewBox="0 0 500 440" className="clock-wire" aria-hidden="true"><path d="M400 68 C485 153 480 280 391 343 C319 397 233 382 218 323 C202 266 253 248 286 278 C334 324 298 430 146 438" /></svg>
        <span className="orbit-phone" aria-hidden="true"><PhoneIcon size={28} weight="regular" /></span>
      </div>
    </div>
    <div className="opening-end wrap" aria-hidden="true"><span>从电话那头</span><span className="end-rule" /><span>到今天见面</span></div>
  </section>
}

function NightCalls() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const waveform = 'M0 75 H65 C87 75 90 45 106 45 S127 105 144 105 S165 20 184 20 S205 132 224 132 S246 48 263 48 S285 96 303 96 S326 62 343 62 S364 80 385 80 H460 C481 80 481 56 497 56 S521 103 538 103 S561 27 580 27 S600 120 619 120 S642 52 660 52 S682 86 702 86 H840'
  return <section id="night-calls" className="scene night-calls" aria-labelledby="night-title">
    <div className="wrap section-wrap"><WireMarker />
      <div className="night-heading story-content">
        <h2 id="night-title" tabIndex={-1}>{story.night.title}</h2>
        <p className="body-copy"><span className="lead">{story.night.lead}</span>{story.night.body}</p>
      </div>
      <div className="call-memory story-content">
        <svg className="waveform" viewBox="0 0 840 150" fill="none" aria-hidden="true">
          <path d={waveform} stroke="var(--hairline)" strokeWidth="1.5" />
          <motion.path d={waveform} stroke="var(--amber)" strokeWidth="1.6" animate={{ pathLength: [0.34, 0.69, 1][selected] }} transition={{ duration: reduced ? 0 : 0.25 }} />
        </svg>
        <div className="theme-buttons" role="group" aria-label="回忆里的通话主题">
          {story.night.themes.map((theme, i) => <button key={theme.label} aria-pressed={selected === i} onClick={() => setSelected(i)}><span className="theme-tick" aria-hidden="true" />{theme.label}</button>)}
        </div>
        <div className="memory-response" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.12 }}>{story.night.themes[selected].text}</motion.p></AnimatePresence>
        </div>
      </div>
    </div>
  </section>
}

function DuoMemory() {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  return <section id="duo" className="scene duo-memory" aria-labelledby="duo-title">
    <div className="wrap section-wrap"><WireMarker />
      <div className="story-content duo-layout">
        <div className="duo-copy"><h2 id="duo-title">{story.duo.title}</h2><p className="body-copy">{story.duo.body}</p>
          <button className="text-button" aria-pressed={ready} onClick={() => setReady(!ready)}>{ready ? <CheckIcon size={20} aria-hidden="true" /> : <PlusIcon size={20} aria-hidden="true" />}<span>{ready ? '再准备一次' : '一起准备'}</span><ArrowUpRightIcon size={17} aria-hidden="true" /></button>
        </div>
        <div className={`duo-art ${ready ? 'is-ready' : ''}`}>
          <svg viewBox="0 0 460 300" className="duo-tracks" fill="none" aria-hidden="true">
            <path d="M0 82 H83 C130 82 130 120 181 120 H460" stroke="var(--amber)" strokeOpacity=".8" strokeWidth="1.5" />
            <path d="M0 238 H83 C130 238 130 180 181 180 H460" stroke="var(--amber)" strokeOpacity=".45" strokeWidth="1.5" />
            <path d="M355 120 V180" stroke="var(--hairline)" strokeDasharray="3 5" />
          </svg>
          <motion.div className="player player-me" animate={{ x: ready ? 35 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><span className="player-dot" /><span>我</span></motion.div>
          <motion.div className="player player-you" animate={{ x: ready ? -35 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><span className="player-dot" /><span>你</span></motion.div>
          <span className="duo-note">一起打过的很多局</span>
        </div>
        <div className="duo-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={String(ready)} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.1 }}>{ready ? story.duo.feedback : '有你在，就很熟悉。'}</motion.p></AnimatePresence></div>
      </div>
    </div>
  </section>
}

function SmallSurprise() {
  return <aside className="small-surprise" aria-label="100 元的小惊喜">
    <div className="surprise-amount" aria-label="100 元"><span>¥</span>100<span className="amount-mark" aria-hidden="true">＋</span></div>
    <div className="surprise-copy"><p>{story.surprise.body}<br />{story.surprise.feeling}</p>
      <details><summary>那一刻的我<PlusIcon className="details-icon" size={17} aria-hidden="true" /></summary><p>{story.surprise.detail}</p></details>
    </div>
  </aside>
}

function CitiesMeet() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])
  const lightOpacity = useTransform(scrollYProgress, [0, 0.65], [0, 1])
  return <section id="today" ref={ref} className="scene cities-meet" data-scene-theme="light" aria-labelledby="meeting-title">
    <motion.div className="daylight" aria-hidden="true" style={{ opacity: reduced ? 1 : lightOpacity }} />
    <div className="wrap section-wrap"><WireMarker />
      <div className="story-content">
        <div className="meeting-heading"><p className="meeting-date"><time dateTime={story.dateISO}>{story.date}</time><span>长沙</span></p><h2 id="meeting-title">{story.meeting.title}</h2><p className="body-copy"><span className="lead">{story.meeting.lead}</span>{story.meeting.body}</p></div>
        <div className="city-art" role="img" aria-label="示意连接：邵阳的你，来到长沙，和我见面。">
          <span className="city-today" aria-hidden="true">今天</span>
          <svg viewBox="0 0 1000 380" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M155 115 C300 115 295 292 493 292 C632 292 637 155 795 155" stroke="var(--ink)" strokeOpacity=".16" strokeWidth="1.5" /><motion.path d="M155 115 C300 115 295 292 493 292 C632 292 637 155 795 155" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: reduced ? 1 : pathLength }} /></svg>
          <div className="city-node city-shaoyang"><span className="city-pin" aria-hidden="true" /><span className="city-label">邵阳<span>你</span></span></div>
          <div className="city-node city-changsha"><span className="city-pin" aria-hidden="true" /><span className="city-label">长沙<span>我</span></span></div>
          <div className="meet-point"><span aria-hidden="true" /><p>长沙见。</p></div>
        </div>
        <SmallSurprise />
      </div>
    </div>
  </section>
}

function FinalLetter() {
  const [shareMessage, setShareMessage] = useState('')
  async function share() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin).href
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: '罗琛尧，这份回忆，送给你。', url })
        setShareMessage('已打开分享。')
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        setShareMessage('链接已复制，可以发给你了。')
      } else setShareMessage('请复制浏览器地址，把这份回忆分享出去。')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setShareMessage('等你想分享的时候再发。')
      else setShareMessage('暂时无法分享，请复制浏览器地址。')
    }
  }
  return <section id="letter" className="scene final-letter" data-scene-theme="light" aria-labelledby="letter-title">
    <div className="wrap section-wrap"><WireMarker />
      <div className="story-content letter-content">
        <p className="letter-intro">还有几句话，想认真对你说。</p>
        <h2 id="letter-title">罗琛尧，</h2>
        <div className="letter-body">{story.letter.map((line) => <p key={line}>{line}</p>)}</div>
        <div className="letter-actions flex flex-wrap items-center gap-x-8 gap-y-2"><a href="#beginning" className="text-button">再读一遍<ArrowUpRightIcon size={17} aria-hidden="true" /></a><button className="text-button" onClick={share}><ShareNetworkIcon size={18} aria-hidden="true" />分享这份回忆</button></div>
        <p className="share-feedback" role="status">{shareMessage}</p>
        <div className="blessing-wrap"><span data-wire className="blessing-wire" aria-hidden="true" /><span data-wire className="end-pin" aria-hidden="true" /><p className="final-blessing">{story.blessing.split('你永远')[0]}<br className="blessing-break" />你永远是我的 <strong>best friends。</strong></p></div>
      </div>
    </div>
  </section>
}

export function App() {
  return <><a href="#night-calls" className="skip-link">跳到回忆正文</a><StoryShell><OpeningScene /><NightCalls /><DuoMemory /><CitiesMeet /><FinalLetter /></StoryShell></>
}

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownIcon, ArrowUpRightIcon, CheckIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { story } from './story'

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

function OpeningScene() {
  const ref = useRef<HTMLElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 38])

  function enter() {
    document.getElementById('night-calls')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
    document.getElementById('night-title')?.focus({ preventScroll: true })
  }

  return <section ref={ref} id="beginning" className="opening" aria-labelledby="opening-title">
    {!imageFailed && <motion.div className="cover-art" style={{ y: reduced ? 0 : imageY }}>
      <picture>
        <source media="(max-width: 767px)" srcSet={asset('night-still-life-mobile.webp')} />
        <img src={asset('night-still-life.webp')} width="1536" height="1024" alt="深夜静物意象：桌上的手机，映着一束暖光。" fetchPriority="high" onError={() => setImageFailed(true)} />
      </picture>
    </motion.div>}
    <div className="cover-shade" aria-hidden="true" />
    <header className="masthead wrap">
      <a href="#beginning" className="site-name" aria-label="电话那头，今天见，回到开头">电话那头，今天见</a>
      <time dateTime={story.dateISO}>{story.date}</time>
    </header>
    <div className="opening-layout wrap">
      <div className="opening-copy">
        <p className="dedication">{story.friend}，</p>
        <h1 id="opening-title">电话那头，<br />今天见。</h1>
        <p className="opening-description">{story.opening}</p>
        <button className="enter-button" onClick={enter}>接起这段回忆<ArrowDownIcon size={18} weight="regular" aria-hidden="true" /></button>
      </div>
    </div>
    <div className="cover-footer wrap"><div className="memory-time"><span aria-label="记忆里的晚上十一点">23:00</span><p>那些还没聊完的夜晚</p></div></div>
  </section>
}

function NightCalls() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  return <section id="night-calls" className="night-calls scene" aria-labelledby="night-title">
    <div className="wrap night-layout">
      <div className="night-copy">
        <h2 id="night-title" tabIndex={-1}>{story.night.title}</h2>
        <p className="body-copy"><span className="lead">{story.night.lead}</span>{story.night.body}</p>
      </div>
      <div className="call-memory">
        <div className="theme-buttons" role="group" aria-label="回忆里的通话主题">
          {story.night.themes.map((theme, i) => <button key={theme.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{theme.label}</button>)}
        </div>
        <div className="memory-response" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={selected} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.14 }}>{story.night.themes[selected].text}</motion.p>
          </AnimatePresence>
        </div>
        <p className="memory-postscript">电话那头，一直有你。</p>
      </div>
    </div>
  </section>
}

function DuoMemory() {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  return <section id="duo" className="duo-memory scene" aria-labelledby="duo-title">
    <div className="wrap duo-layout">
      <div className="duo-visual" role="group" aria-label="这段回忆里的我和你">
        <div className={`duo-characters ${ready ? 'is-ready' : ''}`}>
          <motion.span animate={{ y: ready ? 0 : -18, x: ready ? 12 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>我</motion.span>
          <motion.span animate={{ y: ready ? 0 : 18, x: ready ? -12 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>你</motion.span>
        </div>
        <p>一起打过的很多局</p>
      </div>
      <div className="duo-copy">
        <h2 id="duo-title">{story.duo.title}</h2>
        <p className="body-copy">{story.duo.body}</p>
        <button className="ready-button" aria-pressed={ready} onClick={() => setReady(!ready)}>{ready ? <CheckIcon size={18} aria-hidden="true" /> : <PlusIcon size={18} aria-hidden="true" />}<span>{ready ? '再准备一次' : '一起准备'}</span></button>
        <div className="duo-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={String(ready)} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.12 }}>{ready ? story.duo.feedback : '有你在，就很熟悉。'}</motion.p></AnimatePresence></div>
      </div>
    </div>
  </section>
}

function SmallSurprise() {
  return <aside className="small-surprise" aria-label="100 元的小惊喜">
    <p className="surprise-amount" aria-label="100 元"><span>¥</span>100</p>
    <div className="surprise-copy"><p>{story.surprise.body}<br />{story.surprise.feeling}</p>
      <details><summary>那一刻的我<PlusIcon className="details-icon" size={16} aria-hidden="true" /></summary><p>{story.surprise.detail}</p></details>
    </div>
  </aside>
}

function CitiesMeet() {
  return <section id="today" className="cities-meet scene" data-scene-theme="light" aria-labelledby="meeting-title">
    <div className="wrap">
      <div className="meeting-date"><time dateTime={story.dateISO}>{story.date}</time><span>今天，长沙</span></div>
      <div className="meeting-content">
        <h2 id="meeting-title">{story.meeting.title}</h2>
        <p className="body-copy">{story.meeting.body}</p>
      </div>
      <div className="city-pair" role="group" aria-label="你在邵阳，我在长沙。">
        <div className="city-origin"><p>你在</p><span>邵阳</span></div>
        <div className="city-destination"><p>我在</p><span>长沙</span></div>
        <p className="meeting-note">终于，我们可以当面聊了。</p>
      </div>
      <SmallSurprise />
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
  const [first, second] = story.blessing.split('你永远')
  const [beforeSchool, afterSchool] = first.split('娄底三中')
  return <section id="letter" className="final-letter scene" data-scene-theme="light" aria-labelledby="letter-title">
    <div className="wrap letter-layout">
      <p className="letter-intro">写给你</p>
      <div className="letter-content">
        <h2 id="letter-title">{story.friend}，</h2>
        <div className="letter-body">{story.letter.map(line => <p key={line}>{line}</p>)}</div>
        <div className="letter-actions"><a href="#beginning" className="text-button">再读一遍<ArrowUpRightIcon size={16} aria-hidden="true" /></a><button className="text-button" onClick={share}><ShareNetworkIcon size={17} aria-hidden="true" />分享这份回忆</button></div>
        <p className="share-feedback" role="status">{shareMessage}</p>
        <p className="final-blessing">{beforeSchool}<span className="no-break">娄底三中</span>{afterSchool}<br className="blessing-break" />你永远{second.split('best friends')[0]}<strong>best friends。</strong></p>
      </div>
    </div>
  </section>
}

export function App() {
  return <><a href="#night-calls" className="skip-link">跳到回忆正文</a><main id="story"><OpeningScene /><NightCalls /><DuoMemory /><CitiesMeet /><FinalLetter /></main></>
}

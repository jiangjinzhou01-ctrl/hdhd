import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDownIcon, ArrowUpRightIcon, CheckIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { story } from './story'

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

function OpeningScene() {
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  function enter() {
    document.getElementById('night-calls')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
    document.getElementById('night-title')?.focus({ preventScroll: true })
  }
  return <section id="beginning" className="opening" aria-labelledby="opening-title">
    <header className="masthead wrap">
      <a href="#beginning" className="site-name" aria-label="电话那头，今天见，回到开头">电话那头，今天见</a>
      <time dateTime={story.dateISO}>{story.date}</time>
    </header>
    <div className="cover-grid wrap">
      <div className="cover-title">
        <p className="dedication">给{story.friend}</p>
        <h1 id="opening-title"><span>电话那头，</span><strong>今天见。</strong></h1>
      </div>
      <figure className={`cover-still ${imageFailed ? 'image-unavailable' : ''}`}>
        <div className="still-media">{!imageFailed && <picture>
          <source media="(max-width: 767px)" srcSet={asset('night-still-life-mobile.webp')} />
          <img src={asset('night-still-life.webp')} width="1536" height="1024" alt="深夜静物意象：桌上的手机，映着一束暖光。" fetchPriority="high" onError={() => setImageFailed(true)} />
        </picture>}</div>
        <figcaption>{imageFailed ? '电话那头，一直有你。' : '一幅深夜意象'}</figcaption>
      </figure>
      <div className="cover-time"><span aria-label="记忆里的晚上十一点">23:00</span><p>记忆里的晚上十一点</p></div>
      <div className="cover-intro"><p className="opening-description">{story.opening}</p><button className="enter-button" onClick={enter}>接起这段回忆<ArrowDownIcon size={18} aria-hidden="true" /></button></div>
    </div>
  </section>
}

function NightCalls() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const [beginning, ending] = story.night.themes[selected].text.split('，')
  return <section id="night-calls" className="night-calls scene" aria-labelledby="night-title">
    <div className="wrap call-layout">
      <h2 id="night-title" tabIndex={-1}>{story.night.title}</h2>
      <p className="body-copy night-story"><span className="lead">{story.night.lead}</span>{story.night.body}</p>
      <div className="call-memory">
        <div className="theme-buttons" role="group" aria-label="回忆里的通话主题">{story.night.themes.map((theme, i) => <button key={theme.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{theme.label}</button>)}</div>
        <div className="memory-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.14 }}><span>{beginning}，</span><strong>{ending}</strong></motion.p></AnimatePresence></div>
      </div>
    </div>
  </section>
}

function DuoMemory() {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  return <section id="duo" className="duo-memory scene" aria-labelledby="duo-title">
    <div className="wrap">
      <div className="duo-heading"><h2 id="duo-title">{story.duo.title}</h2><p className="body-copy">{story.duo.body}</p></div>
      <div className={`duo-stage ${ready ? 'is-ready' : ''}`}>
        <div className="duo-visual" role="group" aria-label="这段回忆里的我和你">
          <div className="memory-cards">
            <motion.div className="memory-card card-me" animate={{ y: ready ? 0 : -10, rotate: ready ? 0 : -5 }} transition={{ duration: reduced ? 0 : 0.2 }}><span>我</span><small>一起</small></motion.div>
            <motion.div className="memory-card card-you" animate={{ y: ready ? 0 : 10, rotate: ready ? 0 : 5 }} transition={{ duration: reduced ? 0 : 0.2 }}><span>你</span><small>并肩</small></motion.div>
          </div>
          <p className="duo-caption">一起打过的很多局</p>
        </div>
        <div className="duo-controls"><button className="ready-button" aria-pressed={ready} onClick={() => setReady(!ready)}>{ready ? <CheckIcon size={18} aria-hidden="true" /> : <PlusIcon size={18} aria-hidden="true" />}<span>{ready ? '再准备一次' : '一起准备'}</span></button>
          <div className="duo-response" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={String(ready)} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.12 }}>{ready ? story.duo.feedback : '有你在，就很熟悉。'}</motion.p></AnimatePresence></div>
        </div>
      </div>
    </div>
  </section>
}

function SmallSurprise() {
  return <aside className="small-surprise" aria-label="100 元的小惊喜">
    <p className="surprise-amount" aria-label="100 元"><span>¥</span>100</p>
    <div className="surprise-copy"><p>{story.surprise.body}<br />{story.surprise.feeling}</p><details><summary>那一刻的我<PlusIcon className="details-icon" size={16} aria-hidden="true" /></summary><p>{story.surprise.detail}</p></details></div>
  </aside>
}

function CitiesMeet() {
  return <section id="today" className="cities-meet scene" data-scene-theme="light" aria-labelledby="meeting-title">
    <div className="wrap">
      <div className="meeting-date"><time dateTime={story.dateISO}>{story.date}</time><span>今天</span></div>
      <div className="meeting-heading"><h2 id="meeting-title">{story.meeting.title}</h2><p className="body-copy">{story.meeting.body}</p></div>
      <div className="arrival-poster" role="group" aria-label="你在邵阳，我在长沙。今天，我们在长沙见。">
        <p className="arrival-origin"><span>你在</span><strong>邵阳</strong></p>
        <div className="arrival-destination"><p>我在</p><span className="city-word">长沙</span><p className="meeting-note">今天，我们可以当面聊了。</p></div>
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
      if (navigator.share) { await navigator.share({ title: story.title, text: '罗琛尧，这份回忆，送给你。', url }); setShareMessage('已打开分享。') }
      else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url); setShareMessage('链接已复制，可以发给你了。') }
      else setShareMessage('请复制浏览器地址，把这份回忆分享出去。')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setShareMessage('等你想分享的时候再发。')
      else setShareMessage('暂时无法分享，请复制浏览器地址。')
    }
  }
  const [first, second] = story.blessing.split('你永远')
  const [beforeSchool, afterSchool] = first.split('娄底三中')
  return <section id="letter" className="final-letter scene" data-scene-theme="light" aria-labelledby="letter-title"><div className="wrap"><div className="letter-sheet">
    <p className="letter-intro">写给你</p><h2 id="letter-title">{story.friend}，</h2>
    <div className="letter-body">{story.letter.map(line => <p key={line}>{line}</p>)}</div>
    <div className="letter-actions"><a href="#beginning" className="text-button">再读一遍<ArrowUpRightIcon size={16} aria-hidden="true" /></a><button className="text-button" onClick={share}><ShareNetworkIcon size={17} aria-hidden="true" />分享这份回忆</button></div><p className="share-feedback" role="status">{shareMessage}</p>
    <p className="final-blessing">{beforeSchool}<span className="no-break">娄底三中</span>{afterSchool}<br className="blessing-break" />你永远{second.split('best friends')[0]}<strong>best friends。</strong></p>
  </div></div></section>
}

export function App() {
  return <><a href="#night-calls" className="skip-link">跳到回忆正文</a><main id="story"><OpeningScene /><NightCalls /><DuoMemory /><CitiesMeet /><FinalLetter /></main></>
}

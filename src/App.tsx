import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CaretRightIcon,
  CheckIcon,
  PlusIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { story, asset, firstScene, firstTitle } from "./story";
import type { ImageAsset } from "./story-schema";
import {
  useReducedMotion,
  HeadingReveal,
  ImageTransition,
  InteractionMotion,
  MemoryCard,
  motionRhythm,
  pressMotion,
  Reveal,
  SceneDrift,
  SceneTitle,
  ScrollScene,
  SceneTransition,
} from "./StoryMotion";

function StoryImage({
  image,
  priority = false,
  onFailure,
}: {
  image: ImageAsset;
  priority?: boolean;
  onFailure: () => void;
}) {
  const theme = story.theme;
  return (
    <picture>
      {theme === "system" && image.darkMobile && (
        <source
          media="(prefers-color-scheme: dark) and (max-width: 767px)"
          srcSet={asset(image.darkMobile)}
        />
      )}
      {theme === "system" && image.dark && (
        <source
          media="(prefers-color-scheme: dark)"
          srcSet={asset(image.dark)}
        />
      )}
      {(theme === "dark" ? image.darkMobile || image.mobile : image.mobile) && (
        <source
          media="(max-width: 767px)"
          srcSet={asset(
            theme === "dark"
              ? image.darkMobile || image.mobile!
              : image.mobile!,
          )}
        />
      )}
      <img
        src={asset(theme === "dark" ? image.dark || image.src : image.src)}
        width="1536"
        height="1024"
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={onFailure}
      />
    </picture>
  );
}
function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap masthead">
        <a href="#beginning" className="site-name">
          {story.navigation.name}
        </a>
        <nav aria-label="故事导航">
          {story.night && <a href="#night-calls">{story.navigation.night}</a>}
          {story.meeting && <a href="#today">{story.navigation.meeting}</a>}
          <a href="#letter">{story.navigation.letter}</a>
        </nav>
      </div>
    </header>
  );
}

function OpeningScene() {
  const scene = useRef<HTMLElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");
  const reduced = useReducedMotion();
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const phaseRef = useRef(phase);
  function finish(focus = false) {
    controls.current?.stop();
    clearTimeout(timer.current);
    phaseRef.current = "opened";
    setPhase("opened");
    if (focus)
      document.getElementById(firstTitle)?.focus({ preventScroll: true });
  }
  useEffect(() => {
    const interrupt = () => {
      if (phaseRef.current === "opening") finish();
    };
    const key = (event: KeyboardEvent) => {
      if (
        [
          "Escape",
          "PageDown",
          "PageUp",
          "ArrowDown",
          "ArrowUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        interrupt();
    };
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", key);
      controls.current?.stop();
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (reduced && phaseRef.current === "opening") {
      document
        .getElementById(firstScene)
        ?.scrollIntoView({ behavior: "instant" });
      finish(true);
    }
  }, [reduced]);
  function enter() {
    const destination = document.getElementById(firstScene);
    if (!destination) return;
    if (reduced || phase !== "closed") {
      destination.scrollIntoView({ behavior: "instant" });
      finish(true);
      return;
    }
    phaseRef.current = "opening";
    setPhase("opening");
    // The cover gives way while the native document moves. Wheel/touch/key input cancels immediately.
    const top = destination.getBoundingClientRect().top + window.scrollY - 76;
    controls.current = animate(window.scrollY, top, {
      duration: 1.05,
      delay: 0.12,
      ease: motionRhythm.ease,
      onUpdate: (value) => window.scrollTo({ top: value, behavior: "instant" }),
      onComplete: () => finish(true),
    });
    timer.current = setTimeout(() => finish(true), 1500);
  }
  return (
    <section
      ref={scene}
      id="beginning"
      className={`opening opening-${phase}`}
      data-opening-phase={phase}
      aria-labelledby="opening-title"
    >
      <motion.div
        className="wrap hero-inner"
        animate={
          phase === "opening"
            ? { y: -26, scale: 0.975, opacity: 0.25 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: reduced ? 0 : 0.72, ease: motionRhythm.ease }}
      >
        {story.demo && <p className="demo-label">友情纪念 · 虚构演示</p>}
        <Reveal as="p" className="dedication" entry="load">
          {story.cover.address}
        </Reveal>
        <HeadingReveal
          as="h1"
          id="opening-title"
          entry="load"
          delay={motionRhythm.step}
        >
          {story.cover.headline}
        </HeadingReveal>
        <Reveal
          as="p"
          className="hero-description"
          entry="load"
          delay={motionRhythm.step * 3}
        >
          {story.cover.memory}
        </Reveal>
        <Reveal
          className="hero-actions"
          entry="load"
          delay={motionRhythm.step * 4}
        >
          <motion.button
            className="enter-button"
            onClick={enter}
            aria-busy={phase === "opening"}
            {...pressMotion(reduced)}
          >
            接起这段回忆
            <ArrowDownIcon size={17} aria-hidden="true" />
          </motion.button>
          <a className="hero-letter-link" href="#letter">
            写给你的话
            <CaretRightIcon size={16} aria-hidden="true" />
          </a>
        </Reveal>
        <SceneDrift className="hero-art" target={scene} scale={0.98}>
          <figure className="date-visual">
            <div className="still-media">
              {!story.cover.art || imageFailed ? (
                <span className="date-fallback">{story.cover.dateMark}</span>
              ) : (
                <motion.div
                  className="date-picture"
                  initial={reduced ? false : { scale: 1.07 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: reduced ? 0 : 1.2,
                    ease: motionRhythm.ease,
                  }}
                >
                  <StoryImage
                    image={story.cover.art}
                    priority
                    onFailure={() => setImageFailed(true)}
                  />
                </motion.div>
              )}
            </div>
            <Reveal
              className="date-caption"
              entry="load"
              delay={motionRhythm.step * 4}
            >
              <time dateTime={story.dateISO}>{story.date}</time>
              <span>{story.cover.location}</span>
            </Reveal>
          </figure>
        </SceneDrift>
      </motion.div>
      <div className="opening-threshold" aria-hidden="true">
        <span>{story.night?.time || story.date}</span>
        <i />
      </div>
    </section>
  );
}

function NightCalls() {
  const content = story.night!;
  const scene = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const reduced = useReducedMotion();
  const theme = content.themes[selected];
  return (
    <section
      ref={scene}
      id="night-calls"
      className="night-calls scene"
      aria-labelledby="night-title"
    >
      <div className="wrap">
        <div className="chapter-heading">
          <p className="chapter-index">01 / {story.relationship}</p>
          <SceneTitle id="night-title" tabIndex={-1}>
            {content.title}
          </SceneTitle>
          <Reveal as="p" className="body-copy" delay={motionRhythm.step}>
            <span className="lead">{content.lead}</span>
            {content.body}
          </Reveal>
        </div>
        <SceneTransition className="night-feature">
          <figure className="night-photo">
            <ScrollScene target={scene} className="night-photo-scene">
              <ImageTransition
                crop={theme.position}
                scale={selected === 1 ? 1.045 : 1}
              >
                {content.image && !imageFailed && (
                  <StoryImage
                    image={content.image}
                    onFailure={() => setImageFailed(true)}
                  />
                )}
              </ImageTransition>
            </ScrollScene>
            <figcaption>
              <span className="call-time">{content.time}</span>
              <p>{content.caption}</p>
              <InteractionMotion
                className="photo-memory-caption"
                state={selected}
              >
                {theme.caption}
              </InteractionMotion>
            </figcaption>
          </figure>
          <SceneDrift className="call-memory" target={scene} distance={16}>
            <div
              className="theme-buttons"
              role="group"
              aria-label="回忆里的通话主题"
            >
              {content.themes.map((item, i) => (
                <motion.button
                  key={i}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                  {...pressMotion(reduced)}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div
              className="memory-response"
              aria-live="polite"
              aria-atomic="true"
            >
              <InteractionMotion state={selected} className="memory-text">
                <p>
                  {theme.lines.map((line, i) =>
                    i === theme.lines.length - 1 ? (
                      <strong key={i}>{line}</strong>
                    ) : (
                      <span key={i}>{line}</span>
                    ),
                  )}
                </p>
              </InteractionMotion>
              <div className="memory-space" aria-hidden="true">
                {content.themes.map((item, i) => (
                  <p key={i}>
                    {item.lines.map((line, j) =>
                      j === item.lines.length - 1 ? (
                        <strong key={j}>{line}</strong>
                      ) : (
                        <span key={j}>{line}</span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            </div>
          </SceneDrift>
        </SceneTransition>
      </div>
    </section>
  );
}

function DuoMemory() {
  const content = story.duo!;
  const scene = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  return (
    <section
      ref={scene}
      id="duo"
      className="duo-memory scene"
      aria-labelledby="duo-title"
    >
      <div className="wrap">
        <div className="chapter-heading">
          <SceneTitle id="duo-title" tabIndex={-1}>
            {content.title}
          </SceneTitle>
          <Reveal as="p" className="body-copy">
            {content.body}
          </Reveal>
        </div>
        <SceneTransition className={`duo-stage ${ready ? "is-ready" : ""}`}>
          <div
            className="duo-visual"
            role="group"
            aria-label="这段回忆里的我和你"
          >
            <SceneDrift
              className="memory-cards"
              target={scene}
              scale={0.98}
              distance={16}
            >
              {content.people.map((person, i) => (
                <MemoryCard
                  className={`memory-card ${i === 0 ? "card-me" : "card-you"}`}
                  index={i}
                  ready={ready}
                  key={i}
                >
                  <span
                    className={
                      person.name.length > 2 ? "card-name-long" : undefined
                    }
                  >
                    {person.name}
                  </span>
                  <small>{person.caption}</small>
                </MemoryCard>
              ))}
            </SceneDrift>
            <p className="duo-caption">{content.caption}</p>
            <div className="duo-alignment" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>
          <div className="duo-controls">
            <motion.button
              className="ready-button"
              aria-pressed={ready}
              onClick={() => setReady(!ready)}
              {...pressMotion(reduced)}
            >
              {ready ? (
                <CheckIcon size={18} aria-hidden="true" />
              ) : (
                <PlusIcon size={18} aria-hidden="true" />
              )}
              <span>{ready ? "再准备一次" : "一起准备"}</span>
            </motion.button>
            <div className="duo-response" aria-live="polite" aria-atomic="true">
              <InteractionMotion state={String(ready)}>
                <p>{ready ? content.feedback : content.idle}</p>
              </InteractionMotion>
              <div className="duo-space" aria-hidden="true">
                <p>{content.feedback}</p>
                <p>{content.idle}</p>
              </div>
            </div>
          </div>
        </SceneTransition>
      </div>
    </section>
  );
}
function SmallSurprise() {
  const content = story.surprise!;
  return (
    <Reveal
      as="aside"
      className={`small-surprise ${content.mark ? "" : "surprise-prose"}`}
      aria-label={content.label}
    >
      {content.mark && <p className="surprise-amount">{content.mark}</p>}
      <div className="surprise-copy">
        <p>
          {content.body}
          <br />
          {content.feeling}
        </p>
        <details>
          <summary>
            {content.summary}
            <PlusIcon className="details-icon" size={16} aria-hidden="true" />
          </summary>
          <p>{content.detail}</p>
        </details>
      </div>
    </Reveal>
  );
}
function CitiesMeet() {
  const content = story.meeting!;
  const scene = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  return (
    <section
      ref={scene}
      id="today"
      className="cities-meet scene"
      aria-labelledby="meeting-title"
    >
      <div className="wrap">
        <div className="chapter-heading">
          <SceneTitle id="meeting-title" tabIndex={-1}>
            {content.title}
          </SceneTitle>
          <Reveal as="p" className="body-copy">
            <span className="lead">{content.lead}</span>
            {content.body}
          </Reveal>
        </div>
        <div
          className="arrival-poster"
          role="group"
          aria-label={content.lead + content.body}
        >
          <Reveal className="arrival-origin">
            <p>从</p>
            <strong>{content.origin}</strong>
          </Reveal>
          <SceneDrift
            className="arrival-destination"
            target={scene}
            distance={24}
          >
            <Reveal as="p">来到</Reveal>
            <motion.div
              className="city-word-window"
              initial={reduced ? false : "before"}
              animate={reduced ? "visible" : undefined}
              whileInView={reduced ? undefined : "visible"}
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.span
                className="city-word"
                data-city-reveal
                variants={{ before: { y: "100%" }, visible: { y: 0 } }}
                transition={{
                  duration: reduced ? 0 : 0.9,
                  ease: motionRhythm.ease,
                }}
              >
                {content.destination}
              </motion.span>
            </motion.div>
            <Reveal as="p" className="meeting-note" delay={0.18}>
              {content.note}
            </Reveal>
          </SceneDrift>
        </div>
        {story.events.length > 0 && (
          <Reveal className="event-dates">
            {story.events.map((event, i) => (
              <p key={i}>
                <time dateTime={event.dateISO}>
                  {event.dateISO.split("-").join(".")}
                </time>
                <span>{event.label}</span>
              </p>
            ))}
          </Reveal>
        )}
        {story.surprise && <SmallSurprise />}
      </div>
    </section>
  );
}
function FinalLetter() {
  const [shareMessage, setShareMessage] = useState("");
  async function share() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.share.title,
          text: story.share.text,
          url,
        });
        setShareMessage("已打开分享。");
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setShareMessage("链接已复制，可以发给你了。");
      } else setShareMessage("请复制浏览器地址，把这份纪念分享出去。");
    } catch (error) {
      setShareMessage(
        error instanceof Error && error.name === "AbortError"
          ? "等你想分享的时候再发。"
          : "暂时无法分享，请复制浏览器地址。",
      );
    }
  }
  return (
    <section
      id="letter"
      className="final-letter scene"
      aria-labelledby="letter-title"
    >
      <div className="wrap">
        <div className="letter-sheet">
          <Reveal className="letter-rule">
            <i />
            <time dateTime={story.dateISO}>{story.date}</time>
          </Reveal>
          <Reveal as="p" className="letter-intro">
            {story.letterIntro}
          </Reveal>
          <SceneTitle
            id="letter-title"
            tabIndex={-1}
          >{`${story.friend}，`}</SceneTitle>
          <div className="letter-body">
            {story.letter.map((line, i) => (
              <Reveal as="p" key={i} focus={false} distance={12}>
                {line}
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="final-blessing" focus={false} distance={14}>
            {story.blessing.map((part, i) =>
              part.emphasis ? (
                <strong key={i}>{part.text}</strong>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </Reveal>
          <Reveal className="letter-actions">
            <a href="#beginning" className="text-button">
              再读一遍
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </a>
            <button className="text-button" onClick={share}>
              <ShareNetworkIcon size={17} aria-hidden="true" />
              分享这份回忆
            </button>
          </Reveal>
          <p className="share-feedback" role="status">
            {shareMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
function WeekendNote() {
  const content = story.weekend!;
  return (
    <section
      id="weekend-note"
      className="weekend-note"
      aria-labelledby="weekend-title"
    >
      <div className="wrap">
        <Reveal className="weekend-note-card">
          <p className="weekend-date">
            <time dateTime={content.dateISO}>{content.date}</time>
          </p>
          <SceneTitle id="weekend-title">{content.title}</SceneTitle>
          <Reveal as="p" className="weekend-copy">
            {content.body}
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
export function App() {
  return (
    <>
      <a href={`#${firstScene}`} className="skip-link">
        跳到回忆正文
      </a>
      <SiteHeader />
      <main id="story">
        <OpeningScene />
        {story.night && <NightCalls />}
        {story.duo && <DuoMemory />}
        {story.meeting && <CitiesMeet />}
        {!story.meeting && story.surprise && (
          <section className="scene">
            <div className="wrap">
              <SmallSurprise />
            </div>
          </section>
        )}
        <FinalLetter />
        {story.weekend && <WeekendNote />}
      </main>
      <footer className="story-ending">
        <span aria-hidden="true" />
        <p>{story.ending}</p>
        <small>
          {story.demo
            ? "人物与经历均为虚构 · 仅作模板演示"
            : `${story.date} / ${story.relationship}`}
        </small>
      </footer>
    </>
  );
}

"use client";

import {
  type ReactNode,
  type RefObject,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const reducedQuery =
  typeof window === "undefined"
    ? null
    : window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeToMotion = (callback: () => void) => {
  if (!reducedQuery) return () => {};
  if (reducedQuery.addEventListener) {
    reducedQuery.addEventListener("change", callback);
    return () => reducedQuery.removeEventListener("change", callback);
  }
  reducedQuery.addListener(callback);
  return () => reducedQuery.removeListener(callback);
};
export function useReducedMotion() {
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    () => reducedQuery?.matches ?? true,
    () => true,
  );
  return reduced || typeof IntersectionObserver === "undefined";
}

// A single rhythm for the whole story: reveal, follow the scroll, acknowledge a tap.
export const motionRhythm = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: 0.76,
  step: 0.09,
  distance: 24,
  interaction: 0.24,
  focusDuration: 0.96,
  focusDistance: 10,
  focusEase: [0.4, 0, 0.2, 1] as const,
};
const viewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -32px 0px",
} as const;

export function storyTransition(reduced: boolean | null, delay = 0) {
  return {
    duration: reduced ? 0 : motionRhythm.duration,
    delay: reduced ? 0 : delay,
    ease: motionRhythm.ease,
  };
}

export function focusTransition(
  reduced: boolean | null,
  delay = 0,
  duration = motionRhythm.focusDuration,
) {
  return {
    ...storyTransition(reduced, delay),
    duration: reduced ? 0 : duration,
    filter: {
      duration: reduced ? 0 : duration,
      delay: reduced ? 0 : delay,
      ease: motionRhythm.focusEase,
    },
  };
}

export const sharpText = {
  y: 0,
  opacity: 1,
  scale: 1,
  filter: "blur(0px)",
  transitionEnd: { filter: "none" },
};
export function softText(blur = 4) {
  return {
    y: motionRhythm.focusDistance,
    opacity: 0,
    scale: 1.012,
    filter: `blur(${blur}px)`,
  };
}

export function pressMotion(reduced: boolean | null) {
  return {
    whileHover: reduced ? undefined : { y: -2 },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: {
      duration: reduced ? 0 : motionRhythm.interaction,
      ease: motionRhythm.ease,
    },
  };
}

type RevealProps = {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "h2" | "aside";
  className?: string;
  id?: string;
  tabIndex?: number;
  "aria-label"?: string;
  distance?: number;
  delay?: number;
  entry?: "scroll" | "load";
  focus?: boolean;
};

export function Reveal({
  children,
  as = "div",
  className,
  id,
  tabIndex,
  "aria-label": ariaLabel,
  distance = motionRhythm.distance,
  delay = 0,
  entry = "scroll",
  focus = as === "p",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const visible = focus ? sharpText : { y: 0, opacity: 1 };
  return (
    <Component
      id={id}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={className}
      data-reveal={entry}
      data-focus-reveal={focus || undefined}
      initial={
        reduced ? false : focus ? softText() : { y: distance, opacity: 0 }
      }
      animate={reduced || entry === "load" ? visible : undefined}
      whileInView={!reduced && entry === "scroll" ? visible : undefined}
      viewport={viewport}
      transition={
        focus
          ? focusTransition(reduced, delay)
          : storyTransition(reduced, delay)
      }
    >
      {children}
    </Component>
  );
}

type HeadingProps = {
  children: string;
  as?: "h1" | "h2";
  id: string;
  tabIndex?: number;
  className?: string;
  entry?: "scroll" | "load";
  delay?: number;
};

export function HeadingReveal({
  children,
  as = "h2",
  id,
  tabIndex,
  className,
  entry = "scroll",
  delay = 0,
}: HeadingProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const Line = as === "h1" ? motion.strong : motion.span;
  // Focus each line once; observe the stationary heading and release the filter
  // when sharp, so reading never retains a composited or blurred text layer.
  const lines = {
    hidden: softText(5),
    visible: (index: number) => ({
      ...sharpText,
      transition: focusTransition(reduced, delay + index * motionRhythm.step),
    }),
  };
  return (
    <Component
      id={id}
      tabIndex={tabIndex}
      className={className}
      data-text-reveal={entry}
      initial={reduced ? false : "hidden"}
      animate={reduced || entry === "load" ? "visible" : undefined}
      whileInView={!reduced && entry === "scroll" ? "visible" : undefined}
      whileFocus="visible"
      viewport={viewport}
    >
      {children.split("\n").map((line, index) => (
        <span
          className={`text-line-window${as === "h1" ? " headline-window" : ""}`}
          key={index}
        >
          <Line
            className="text-line"
            data-reveal={entry}
            data-focus-reveal
            custom={index}
            variants={lines}
          >
            {line}
          </Line>
        </span>
      ))}
    </Component>
  );
}

export function SceneTitle(
  props: Omit<HeadingProps, "as" | "entry" | "delay">,
) {
  return <HeadingReveal {...props} />;
}

export function MemoryCard({
  children,
  index,
  ready,
  className,
}: {
  children: ReactNode;
  index: number;
  ready: boolean;
  className: string;
}) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const entered = useInView(frame, { once: true, amount: 0.25 });
  const direction = index === 0 ? -1 : 1;
  const spring = {
    type: "spring" as const,
    stiffness: 190,
    damping: 27,
    mass: 0.8,
  };
  const resting = {
    x: direction * 7,
    y: direction * 8,
    rotate: direction * 4,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
  };
  const aligned = {
    x: -direction * 5,
    y: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
  };
  const variants = {
    hidden: {
      x: direction * 18,
      y: 34,
      rotate: direction * 8,
      rotateX: 0,
      rotateY: direction * 10,
      scale: 0.94,
      opacity: 0,
    },
    resting: {
      ...resting,
      transition: reduced
        ? { duration: 0 }
        : { ...spring, delay: index * motionRhythm.step },
    },
    aligned: { ...aligned, transition: reduced ? { duration: 0 } : spring },
  };
  const pose = ready ? aligned : resting;
  return (
    <div className="memory-card-frame" ref={reduced ? undefined : frame}>
      <motion.div
        className={className}
        data-memory-card
        initial={reduced ? false : "hidden"}
        animate={
          reduced || entered ? (ready ? "aligned" : "resting") : "hidden"
        }
        variants={variants}
        whileHover={
          reduced
            ? undefined
            : {
                y: pose.y - 4,
                rotate: direction * 2,
                rotateX: 2,
                rotateY: -direction * 3,
                scale: 1.015,
              }
        }
        transition={reduced ? { duration: 0 } : spring}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SceneDrift({
  children,
  className,
  target,
  distance = 32,
  scale = 1,
}: {
  children: ReactNode;
  className?: string;
  target: RefObject<HTMLElement | null>;
  distance?: number;
  scale?: number;
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const position = useTransform(
    scrollYProgress,
    [0, 0.42, 1],
    [distance, 0, -distance * 0.45],
  );
  const y = useSpring(position, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      className={className}
      data-scroll-drift
      style={{ y: reduced ? 0 : y }}
      initial={reduced ? false : { scale }}
      whileInView={reduced ? undefined : { scale: 1 }}
      viewport={viewport}
      transition={storyTransition(reduced)}
    >
      {children}
    </motion.div>
  );
}

// These primitives share the same timing but serve distinct narrative jobs.
export function FocusReveal(props: RevealProps) {
  return <Reveal {...props} focus />;
}
export function SceneTransition({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`scene-transition ${className}`} distance={16}>
      {children}
    </Reveal>
  );
}
export function InteractionMotion({
  children,
  state,
  className,
}: {
  children: ReactNode;
  state: string | number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={state}
      className={className}
      data-interaction-motion
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...storyTransition(reduced), duration: reduced ? 0 : 0.32 }}
    >
      {children}
    </motion.div>
  );
}
export function ImageTransition({
  children,
  crop = "70% center",
  scale = 1,
}: {
  children: ReactNode;
  crop?: string;
  scale?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="image-transition"
      data-image-transition
      animate={{ objectPosition: crop, scale }}
      transition={{ duration: reduced ? 0 : 0.7, ease: motionRhythm.ease }}
    >
      {children}
    </motion.div>
  );
}
export function ScrollScene({
  children,
  target,
  className,
}: {
  children: ReactNode;
  target: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const position = useTransform(scrollYProgress, [0, 0.5, 1], [36, 0, -22]);
  const y = useSpring(position, { stiffness: 120, damping: 28, mass: 0.4 });
  const size = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.015]);
  const scale = useSpring(size, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      className={className}
      data-scroll-scene
      style={reduced ? undefined : { y, scale }}
    >
      {children}
    </motion.div>
  );
}
export function ReducedMotionFallback({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  return useReducedMotion() ? fallback : children;
}

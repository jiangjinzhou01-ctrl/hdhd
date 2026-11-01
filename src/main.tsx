import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { App } from "./App";
import "./tokens.css";
import "./style.css";

const staticMotion = typeof IntersectionObserver === "undefined";
if (staticMotion) document.documentElement.dataset.motion = "static";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion={staticMotion ? "always" : "user"}>
      <App />
    </MotionConfig>
  </StrictMode>,
);

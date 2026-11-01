import selected from "virtual:story";
import { validateStory } from "./story-schema";
export const story = validateStory(selected);
export const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;
export const firstScene = story.night
  ? "night-calls"
  : story.duo
    ? "duo"
    : story.meeting
      ? "today"
      : "letter";
export const firstTitle = story.night
  ? "night-title"
  : story.duo
    ? "duo-title"
    : story.meeting
      ? "meeting-title"
      : "letter-title";

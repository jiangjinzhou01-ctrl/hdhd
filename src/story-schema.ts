export type ImageAsset = {
  src: string;
  mobile?: string;
  dark?: string;
  darkMobile?: string;
  alt: string;
};
export type StoryConfig = {
  id: string;
  title: string;
  friend: string;
  relationship: string;
  date: string;
  dateISO: string;
  opening: string;
  theme: "system" | "light" | "dark";
  demo: boolean;
  navigation: { name: string; night: string; meeting: string; letter: string };
  cover: {
    address: string;
    headline: string;
    memory: string;
    dateMark: string;
    location: string;
    art?: ImageAsset;
    gift?: string;
    caption?: string;
  };
  night?: {
    title: string;
    lead: string;
    body: string;
    time: string;
    caption: string;
    image?: ImageAsset;
    themes: {
      label: string;
      lines: string[];
      position?: string;
      caption: string;
    }[];
  };
  duo?: {
    title: string;
    body: string;
    people: [
      { name: string; caption: string },
      { name: string; caption: string },
    ];
    caption: string;
    idle: string;
    feedback: string;
  };
  meeting?: {
    title: string;
    lead: string;
    body: string;
    origin: string;
    destination: string;
    note: string;
  };
  surprise?: {
    label: string;
    mark?: string;
    body: string;
    feeling: string;
    summary: string;
    detail: string;
  };
  letterIntro: string;
  letter: string[];
  blessing: { text: string; emphasis?: boolean }[];
  weekend?: { date: string; dateISO: string; title: string; body: string };
  share: { title: string; text: string; image?: string };
  ending: string;
  events: { dateISO: string; label: string }[];
};

// Validate untrusted customer JSON before Vite imports it. Empty optional scenes are omitted.
export function validateStory(input: unknown): StoryConfig {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("story: expected object");
  const data = JSON.parse(JSON.stringify(input)) as Record<string, any>;
  const errors: string[] = [];
  const object = (v: unknown): v is Record<string, any> =>
    !!v && typeof v === "object" && !Array.isArray(v);
  function text(value: unknown, path: string) {
    if (typeof value !== "string" || !value.trim())
      errors.push(`${path}: expected non-empty text`);
    else if (value.length > 12000)
      errors.push(`${path}: exceeds 12000 characters`);
  }
  function fields(value: unknown, keys: string[], path: string) {
    if (!object(value)) {
      errors.push(`${path}: expected object`);
      return;
    }
    keys.forEach((key) => text(value[key], `${path}.${key}`));
  }
  function date(value: unknown, path: string) {
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      errors.push(`${path}: invalid ISO date`);
  }
  function media(value: unknown, path: string) {
    if (value == null) return;
    fields(value, ["src", "alt"], path);
    if (object(value))
      for (const key of ["src", "mobile", "dark", "darkMobile"])
        if (
          value[key] !== undefined &&
          (typeof value[key] !== "string" ||
            !/^[\w\-./]+$/.test(value[key]) ||
            value[key].includes("..") ||
            value[key].startsWith("/"))
        )
          errors.push(`${path}.${key}: use a relative authorized asset path`);
  }
  if (!object(input)) throw Error("story: expected object");
  fields(
    data,
    [
      "id",
      "title",
      "friend",
      "relationship",
      "date",
      "dateISO",
      "opening",
      "letterIntro",
      "ending",
    ],
    "story",
  );
  date(data.dateISO, "dateISO");
  if (!/^[a-z0-9-]+$/.test(data.id))
    errors.push("id: use lowercase letters, digits and hyphens");
  if (!["system", "light", "dark"].includes(data.theme))
    errors.push("theme: expected system, light or dark");
  if (typeof data.demo !== "boolean") errors.push("demo: expected boolean");
  fields(data.navigation, ["name", "night", "meeting", "letter"], "navigation");
  fields(
    data.cover,
    ["address", "headline", "memory", "dateMark", "location"],
    "cover",
  );
  media(data.cover?.art, "cover.art");
  for (const key of ["night", "duo", "meeting", "surprise", "weekend"]) {
    if (
      data[key] === null ||
      (object(data[key]) && !Object.keys(data[key]).length)
    )
      delete data[key];
  }
  if (data.night !== undefined) {
    fields(data.night, ["title", "lead", "body", "time", "caption"], "night");
    media(data.night?.image, "night.image");
    if (!Array.isArray(data.night?.themes))
      errors.push("night.themes: expected array");
    else if (!data.night.themes.length) delete data.night;
    else
      data.night.themes.forEach((theme: any, i: number) => {
        fields(theme, ["label", "caption"], `night.themes.${i}`);
        if (!Array.isArray(theme?.lines) || !theme.lines.length)
          errors.push(`night.themes.${i}.lines: expected text array`);
        else
          theme.lines.forEach((line: unknown) =>
            text(line, `night.themes.${i}.lines`),
          );
        if (
          theme?.position !== undefined &&
          !/^\d{1,3}% (center|\d{1,3}%)$/.test(theme.position)
        )
          errors.push(`night.themes.${i}.position: invalid crop`);
      });
  }
  if (data.duo !== undefined) {
    fields(data.duo, ["title", "body", "caption", "idle", "feedback"], "duo");
    if (!Array.isArray(data.duo?.people) || data.duo.people.length !== 2)
      errors.push("duo.people: expected two people");
    else
      data.duo.people.forEach((p: unknown, i: number) =>
        fields(p, ["name", "caption"], `duo.people.${i}`),
      );
  }
  if (data.meeting !== undefined)
    fields(
      data.meeting,
      ["title", "lead", "body", "origin", "destination", "note"],
      "meeting",
    );
  if (data.surprise !== undefined)
    fields(
      data.surprise,
      ["label", "body", "feeling", "summary", "detail"],
      "surprise",
    );
  if (data.surprise?.mark !== undefined) {
    if (data.surprise.mark === "") delete data.surprise.mark;
    else text(data.surprise.mark, "surprise.mark");
  }
  if (data.weekend !== undefined) {
    fields(data.weekend, ["date", "dateISO", "title", "body"], "weekend");
    date(data.weekend?.dateISO, "weekend.dateISO");
  }
  if (!Array.isArray(data.letter)) errors.push("letter: expected array");
  else {
    data.letter = data.letter.filter(
      (p: unknown) => typeof p !== "string" || p.trim(),
    );
    data.letter.forEach((p: unknown) => text(p, "letter"));
  }
  if (!Array.isArray(data.blessing) || !data.blessing.length)
    errors.push("blessing: expected text segments");
  else
    data.blessing.forEach((p: any) => {
      fields(p, ["text"], "blessing");
      if (p?.emphasis !== undefined && typeof p.emphasis !== "boolean")
        errors.push("blessing.emphasis: expected boolean");
    });
  fields(data.share, ["title", "text"], "share");
  if (data.share?.image)
    media({ src: data.share.image, alt: "share" }, "share.image");
  if (!Array.isArray(data.events)) errors.push("events: expected array");
  else
    data.events.forEach((e: any) => {
      fields(e, ["label", "dateISO"], "events");
      date(e?.dateISO, "events.dateISO");
    });
  if (errors.length)
    throw Error(`Invalid story configuration:\n${errors.join("\n")}`);
  return data as StoryConfig;
}

// A Daily Walk episode: an audio-led reel where Scripture rises on screen,
// is read once, then held still while a conversational voice reflects on it.
// Source scripts live in content/daily-walk/*.md.

export type WalkBeat =
  | {
      kind: "title";
      id: string;
      image: string;
      eyebrow: string;
      title: string;
      say: string;
    }
  | {
      kind: "verse";
      id: string;
      image: string;
      reference: string;
      text: string;
      /** Exact substring of `text` that turns gold while the voice reflects. */
      highlight: string;
      /** The reflection spoken after the verse is read. */
      say: string;
    }
  | {
      kind: "practice";
      id: string;
      image: string;
      label: string;
      card: string;
      say: string;
    }
  | {
      kind: "prayer";
      id: string;
      image: string;
      intro: string;
      /** Each line rises on screen as it is prayed. */
      lines: string[];
    }
  | {
      kind: "close";
      id: string;
      image: string;
      lines: string[];
      say: string;
    };

export interface WalkEpisode {
  slug: string;
  /** Folder under /public holding the narration clips and timing.json. */
  audioDir: string;
  /** Short line shown on the home card once the episode is finished. */
  practice: string;
  beats: WalkBeat[];
}

/** One narration clip: the file stem (without .mp3) and what is spoken. */
export interface WalkClip {
  name: string;
  text: string;
}

/** Every clip an episode needs, in playback order. */
export function episodeClips(episode: WalkEpisode): WalkClip[] {
  return episode.beats.flatMap((beat): WalkClip[] => {
    switch (beat.kind) {
      case "verse":
        return [
          { name: `${beat.id}-read`, text: beat.text },
          { name: `${beat.id}-say`, text: beat.say },
        ];
      case "prayer":
        return [
          { name: `${beat.id}-intro`, text: beat.intro },
          ...beat.lines.map((line, i) => ({ name: `${beat.id}-line${i + 1}`, text: line })),
        ];
      default:
        return [{ name: `${beat.id}-say`, text: beat.say }];
    }
  });
}

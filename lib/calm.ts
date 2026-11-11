/**
 * Calm me: a feeling, then one short practice matched to it.
 * Prayers and lines are original. Verse references point at the Berean Standard Bible.
 */

export type FeelingId = "anxious" | "overwhelmed" | "sad" | "angry" | "afraid" | "awake";
export type PracticeId = "prayer" | "breathe" | "music" | "speak";

export type Feeling = {
  id: FeelingId;
  label: string;
  /** One sentence that names the feeling without explaining it away. */
  line: string;
  /** Pitch of the ambient bed, in hertz. */
  tone: number;
  prayer: { text: string; reference: string };
  /** What the box-breathing minute is for, in this feeling. */
  breathe: string;
  /** A soft name for the wordless sound. */
  sound: string;
  /** Spoken steps. The last one is the line to repeat. */
  task: { intro: string; steps: string[]; reference: string };
};

export const PRACTICES: { id: PracticeId; title: string; note: string }[] = [
  { id: "prayer", title: "Say a quick prayer", note: "A few lines you can say as they are." },
  { id: "breathe", title: "5 min box breathing", note: "In, hold, out, hold. Four counts each." },
  { id: "music", title: "Ambient music", note: "A soft tone to sit with. No words." },
  { id: "speak", title: "Say it aloud", note: "A short line to speak until it settles." },
];

export const FEELINGS: Feeling[] = [
  {
    id: "anxious",
    label: "Anxious",
    line: "Your mind is ahead of your body. Give it one thing to do.",
    tone: 196,
    prayer: {
      text: "Father, I am anxious, and I am telling You the truth about it. I hand You what I cannot hold. Guard my heart and my mind, and let Your peace be louder than the next thought. Amen.",
      reference: "Philippians 4:6–7",
    },
    breathe: "Count the square. The worry can wait until the five minutes are done.",
    sound: "A warm, steady tone.",
    task: {
      intro: "Say each line once, out loud if you can. Then stay with the last one.",
      steps: [
        "Name the worry in one sentence.",
        "Open both hands on your lap.",
        "Say: I cast this on You, because You care for me.",
      ],
      reference: "1 Peter 5:7",
    },
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    line: "Too many things are asking at once. You only need the next small one.",
    tone: 174,
    prayer: {
      text: "Lord, the list is longer than my strength. I am not asking to finish it. I am asking for enough for this hour. Quiet what is not mine to carry, and show me the one next thing. Amen.",
      reference: "Matthew 11:28",
    },
    breathe: "Four sides, nothing else. The list stays where you left it.",
    sound: "A lower tone, with room around it.",
    task: {
      intro: "Do these in order. Stop when the last line has been said three times.",
      steps: [
        "Put one hand on the table. That is the only task in front of you.",
        "Say: I do not have to hold all of this today.",
        "Say: Your grace is enough for this hour.",
      ],
      reference: "2 Corinthians 12:9",
    },
  },
  {
    id: "sad",
    label: "Sad",
    line: "Sadness does not need a fix before it can be sat with.",
    tone: 164,
    prayer: {
      text: "God, I am sad, and I am not dressing it up. Be near while this is heavy. Keep me from pretending I am fine, and from deciding this is the end of the story. Amen.",
      reference: "Psalm 34:18",
    },
    breathe: "Let the out-breath be the long side. You do not have to cheer up to finish.",
    sound: "A soft, low tone.",
    task: {
      intro: "Say these slowly. Leave a pause after each one.",
      steps: [
        "Say: This sadness is real, and I am not alone in it.",
        "Put a hand on your chest for one breath.",
        "Say: The Lord is close to the brokenhearted.",
      ],
      reference: "Psalm 34:18",
    },
  },
  {
    id: "angry",
    label: "Angry",
    line: "Anger is information. It does not have to be the next thing you do.",
    tone: 146,
    prayer: {
      text: "Lord, I am angry, and I will not pretend otherwise. Keep me from saying the sharp thing. Hold what was unfair. Give me a quiet mouth until I can tell the truth without harm. Amen.",
      reference: "James 1:19–20",
    },
    breathe: "The hold is the pause you did not get. Use all four sides before you answer anyone.",
    sound: "A grounded tone, slow underneath.",
    task: {
      intro: "Stay with your feet on the floor. Say the lines before you pick up the phone.",
      steps: [
        "Unclench your jaw. Drop your shoulders.",
        "Say: I can be slow to speak.",
        "Say: This anger is not the last word.",
      ],
      reference: "James 1:19",
    },
  },
  {
    id: "afraid",
    label: "Afraid",
    line: "Fear wants a prediction. You can give it a sentence instead.",
    tone: 220,
    prayer: {
      text: "Father, I am afraid of what I cannot see coming. You are not surprised by it. Stay nearer than the fear. When I imagine the worst, bring me back to this minute, where You already are. Amen.",
      reference: "Isaiah 41:10",
    },
    breathe: "Fear speeds the breath up. The square slows it to one count at a time.",
    sound: "A clear, quiet tone.",
    task: {
      intro: "Look at one still thing in the room, then say the lines.",
      steps: [
        "Name what you are afraid of, in a few words.",
        "Say: I do not have to solve it in order to be kept.",
        "Say: I am not alone in this.",
      ],
      reference: "Isaiah 41:10",
    },
  },
  {
    id: "awake",
    label: "Can't sleep",
    line: "The day is still talking. You can set it down without finishing it.",
    tone: 130,
    prayer: {
      text: "Lord, the day is over and I am still carrying it. I lie down now. Take the unfinished things. Watch what I cannot watch, and let sleep be a gift rather than a job. Amen.",
      reference: "Psalm 4:8",
    },
    breathe: "Dim the screen if you can. Follow the square until your eyes want to close.",
    sound: "A very low tone, like a dark room.",
    task: {
      intro: "Say these lying down. You do not need to sit up.",
      steps: [
        "Say: The day is finished, even if I am not.",
        "Let your hands rest open on the blanket.",
        "Say: I will lie down and sleep in peace.",
      ],
      reference: "Psalm 4:8",
    },
  },
];

export function getFeeling(id: string | null | undefined): Feeling | undefined {
  return FEELINGS.find((feeling) => feeling.id === id);
}

export function practiceMeta(id: PracticeId) {
  const practice = PRACTICES.find((item) => item.id === id);
  if (!practice) throw new Error(`Unknown calm practice "${id}"`);
  return practice;
}

import type { SleepChapterPlan } from "./genesis";

/**
 * Philippians for Walk and Sleep: Paul's letter of joy, written under guard in Rome. It is
 * a letter rather than a story, so the paintings are Paul at his writing, the church at
 * Philippi, and quiet scenes for its images (running a race, a drink offering, stars in
 * the night). Paul is a balding, grey-bearded man in a plain wool tunic. Christ is never
 * painted, and verses on the cross are shown as light and landscape, never as a cross.
 */
const PAUL = "the apostle Paul, a short balding man with a grey beard, in a plain brown wool tunic and cloak";
const ROOM = "a modest rented room in ancient Rome with plastered walls, a small window and an oil lamp";
const PHILIPPI = "Philippi, a small Roman colony town in Macedonia with a stone forum and colonnades, hills behind";

export const PHILIPPIANS_PLANS: SleepChapterPlan[] = [
  {
    chapter: 1,
    title: "To Live Is Christ",
    headings: { 1: "Greetings from Paul and Timothy", 3: "Thanksgiving and Prayer", 12: "Paul's Chains Advance the Gospel", 18: "To Live Is Christ", 27: "Worthy of the Gospel" },
    scenes: [
      { from: 1, prompt: `${PAUL}, seated at a small wooden table in ${ROOM} at night, a light iron chain on his wrist, dictating a letter to a young man who writes on a sheet of papyrus, lamplight on their faces.` },
      { from: 3, prompt: `The town of ${PHILIPPI} at evening, lamps being lit in the houses, a small group of believers gathered in a courtyard in the distance.` },
      { from: 12, prompt: `A Roman soldier in a plain red tunic and leather armour standing guard at the doorway of ${ROOM}, listening, while ${PAUL} sits reading by lamplight, seen from across the room.` },
      { from: 21, prompt: "A quiet hilltop at sunrise overlooking the sea, an old road winding down toward a harbour, golden light breaking through the clouds; no people." },
      { from: 27, prompt: "A small group of men and women in plain wool standing close together on a hillside path at dawn, seen from behind, looking toward the light." },
    ],
  },
  {
    chapter: 2,
    title: "The Mind of Christ",
    headings: { 1: "One in Christ", 5: "The Mind of Christ", 12: "Lights in the World", 19: "Timothy and Epaphroditus" },
    scenes: [
      { from: 1, prompt: "A shared evening meal in a simple courtyard in Philippi, a few believers breaking bread together at a long low table by lamplight, seen from a little way off." },
      { from: 5, prompt: "A simple clay basin of water and a folded linen towel on a stone floor beside an open door, soft golden morning light streaming in; no people." },
      { from: 9, prompt: "Brilliant golden light breaking through the clouds over the whole earth at dawn, mountains, sea and valleys below lit up; no people." },
      { from: 14, prompt: "A dark valley at night with a scattering of small lamps glowing in the windows of houses, like stars on the earth beneath a starry sky; no people visible." },
      { from: 17, prompt: "Wine being poured from a clay jug in a thin stream onto a stone altar at dusk, golden light, smoke rising softly; only hands visible." },
      { from: 19, prompt: "Two travellers in wool cloaks setting out on a Roman road paved with stone at sunrise, a letter tied in a leather pouch, seen from behind." },
    ],
  },
  {
    chapter: 3,
    title: "Pressing On toward the Goal",
    headings: { 1: "Righteousness through Faith in Christ", 12: "Pressing on toward the Goal", 17: "Citizenship in Heaven" },
    scenes: [
      { from: 1, prompt: `${PAUL}, sitting by a small window in ${ROOM} in the evening, a scroll unrolled on his knees, its writing faint and too small to read, deep in thought.` },
      { from: 7, prompt: "A heap of costly things set aside on a rough wooden table, a gold ring, an embroidered sash and fine scrolls, in dim lamplight beside an open door to the night; no people." },
      { from: 12, prompt: "An ancient stone running track in a stadium at sunrise, the finishing post far ahead in golden light, a lone runner far down the track, seen from behind." },
      { from: 17, prompt: "A wide night sky over the hills of Macedonia, the Milky Way bright overhead, a small town's lights below; no people." },
    ],
  },
  {
    chapter: 4,
    title: "The Peace of God",
    headings: { 1: "Exhortations to the Philippians", 4: "Rejoice in the Lord", 10: "The Generosity of the Philippians", 21: "Final Greetings" },
    scenes: [
      { from: 1, prompt: "Two women in plain wool head coverings sitting together on a bench in a Philippi courtyard at evening, their hands clasped in reconciliation, seen from a little way off." },
      { from: 4, prompt: "A still lake at dawn surrounded by quiet hills, mist on the water, perfect calm and peace; no people." },
      { from: 8, prompt: "A garden at golden evening, lilies and olive trees, a small fountain, everything lovely and still; no people." },
      { from: 10, prompt: `${PAUL}, opening a small wooden chest of gifts by lamplight in ${ROOM}, coins, bread and a folded wool cloak inside, a travelling man in a dusty cloak resting nearby.` },
      { from: 21, prompt: `A finished letter rolled and sealed with wax on a wooden table in ${ROOM} at night, beside a pen and an oil lamp burning low; no people.` },
    ],
  },
];

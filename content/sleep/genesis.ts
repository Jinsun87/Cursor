/**
 * Sleep chapters for Genesis: a short title, section headings (Lampstand's
 * own, placed at the verse where each section begins) and three or four
 * paintings, each shown from its starting verse until the next one.
 *
 * Scripture itself comes from data/bsb.txt; nothing here changes the text.
 * Used by scripts/sleep-chapter.ts.
 */
export type SleepScene = { from: number; prompt: string };
export type SleepChapterPlan = {
  chapter: number;
  title: string;
  headings: Record<number, string>;
  scenes: SleepScene[];
};

/** Added to every prompt: the Genesis 1 look, kept calm and dark for night listening. */
export const NIGHT_STYLE =
  "Vertical 9:16 composition. Dramatic classical oil painting, chiaroscuro, deep night palette with warm gold light, " +
  "calm and still, reverent, soft edges, Rembrandt and Caravaggio inspired, museum quality. " +
  "Show people only if the scene names them; then few, clothed modestly in simple ancient garments, seen at a distance or from behind. God is shown only as light. " +
  "Full-bleed painting with no frame or border. No halos, no crosses. No text, no captions, no watermarks, no modern elements.";

export const GENESIS_PLANS: SleepChapterPlan[] = [
  {
    chapter: 2,
    title: "The Garden in Eden",
    headings: { 1: "The Seventh Day", 4: "The Man in the Garden", 18: "The Woman" },
    scenes: [
      { from: 1, prompt: "The newly made earth resting at dusk on the seventh day: still hills, a quiet sea, the first stars appearing, soft golden glow on the horizon, perfect peace. No people anywhere." },
      { from: 8, prompt: "The Garden in Eden at evening: ancient trees, a river dividing into four streams, the tree of life glowing faintly at the centre, mist over the water. The garden is empty: no people." },
      { from: 15, prompt: "A lone man walking among the trees of the garden at twilight, tending the ground, animals resting nearby in the long grass, gentle gold light through leaves." },
      { from: 21, prompt: "A man and a woman standing together in the garden at night, seen from behind, looking out over the river beneath a vast sky of stars." },
    ],
  },
  {
    chapter: 3,
    title: "The Fall",
    headings: { 1: "The Serpent's Deception", 8: "God Calls to the Man", 20: "Out of the Garden" },
    scenes: [
      { from: 1, prompt: "A serpent coiled in the branches of a great tree heavy with fruit, in the dim gold light of late evening, shadows gathering in the garden." },
      { from: 8, prompt: "The garden in the cool of the evening, a soft light moving among the trees, two small figures hiding in the shadows of the undergrowth." },
      { from: 22, prompt: "The eastern edge of the garden at night, an open wild boundary of trees with no gate or arch: two great winged cherubim of light standing guard, and between them a single long sword-shaped blade of fire whirling in a circle, lighting the mist; two small distant figures walking away into the dark plain." },
    ],
  },
  {
    chapter: 4,
    title: "Cain and Abel",
    headings: { 1: "Cain and Abel", 9: "Cain Sent Away", 17: "The Line of Cain", 25: "Seth" },
    scenes: [
      { from: 1, prompt: "Two stone altars on a hillside at sunset, one with grain and fruit, one with a lamb; smoke from one rising straight to the sky, from the other drifting low." },
      { from: 9, prompt: "A lone wanderer crossing a barren, dusty plain under a dark sky, a faint moon, the land east of Eden empty and quiet." },
      { from: 17, prompt: "An ancient settlement at night: the first small city, mud-brick houses, a forge glowing, a lyre and a flute resting by a fire." },
      { from: 25, prompt: "Eve, an older woman in plain earth-brown and undyed garments with grey in her hair, holding her newborn son Seth inside a rough hide tent, a small clay oil lamp, Adam beside her with weathered hands; an ancient nomadic family at night, not a nativity scene." },
    ],
  },
  {
    chapter: 5,
    title: "From Adam to Noah",
    headings: { 1: "The Line of Adam" },
    scenes: [
      { from: 1, prompt: "Generations of ancient people gathered around campfires across a wide valley under a starry sky, small lights stretching into the distance." },
      { from: 21, prompt: "An old man walking alone up a hill path toward a soft radiant light in the sky, as if walking with God, the path glowing gold at dusk." },
      { from: 28, prompt: "An aged father resting his hand on the shoulder of his young son at the edge of ploughed fields at evening, hopeful golden light on the land." },
    ],
  },
  {
    chapter: 6,
    title: "Noah Builds the Ark",
    headings: { 1: "The Wickedness of Mankind", 9: "Noah's Ark" },
    scenes: [
      { from: 1, prompt: "A brooding storm gathering over a sprawling ancient city at dusk, dark clouds, faint lights in the streets, a heavy, sorrowful sky." },
      { from: 9, prompt: "Noah working by lamplight on the great wooden frame of the ark, enormous timber ribs rising into the night, his sons carrying beams." },
      { from: 18, prompt: "The finished ark standing on dry land at twilight, pairs of animals approaching across the plain, birds circling overhead, a calm gold sky." },
    ],
  },
  {
    chapter: 7,
    title: "The Flood",
    headings: { 1: "The Flood" },
    scenes: [
      { from: 1, prompt: "Animals walking two by two up a ramp into the ark under a grey evening sky, the first heavy drops of rain beginning to fall." },
      { from: 11, prompt: "The fountains of the deep bursting open, torrents of rain over dark rising water, the ark lifted on the swell, lightning far away." },
      { from: 17, prompt: "The ark alone on a vast, calm, endless sea under the moon, no land anywhere, only water and stars reflected in it, deep stillness." },
    ],
  },
  {
    chapter: 8,
    title: "The Waters Recede",
    headings: { 1: "The Flood Recedes", 20: "God's Promise to Noah" },
    scenes: [
      { from: 1, prompt: "The ark resting on the mountains of Ararat as the waters slowly drain away, a wind moving over the water, mountain peaks emerging at dawn." },
      { from: 6, prompt: "A white dove returning to the ark at evening with a fresh olive leaf in its beak, Noah's hand reaching out of the window to bring it in." },
      { from: 20, prompt: "A stone altar on a quiet hilltop after the flood, smoke rising into a soft morning sky, Noah and his family kneeling, the washed earth green below." },
    ],
  },
  {
    chapter: 9,
    title: "The Rainbow",
    headings: { 1: "God's Covenant with Noah", 18: "Noah's Sons" },
    scenes: [
      { from: 1, prompt: "Noah's family walking out into a renewed land at sunrise, fresh grass, flocks scattering across the hills, clear washed air." },
      { from: 12, prompt: "A great soft rainbow arching over dark mountains and a still valley after rain, gold light breaking through the clouds, a family watching from afar." },
      { from: 20, prompt: "A hillside vineyard at dusk with a simple tent among the vines, lamplight in the doorway, the valley quiet below." },
    ],
  },
  {
    chapter: 10,
    title: "The Nations",
    headings: { 1: "The Table of Nations" },
    scenes: [
      { from: 1, prompt: "Caravans of families setting out in many directions across a wide land at dawn, camels and flocks, paths spreading toward distant mountains and seas." },
      { from: 8, prompt: "The ancient cities of Mesopotamia rising beside a great river at night, ziggurats and walls lit by fires, a hunter's silhouette on a ridge." },
      { from: 15, prompt: "Coastlands and islands at dusk with small ships and harbour lights, peoples settling along the shores of a calm sea, stars overhead." },
    ],
  },
];

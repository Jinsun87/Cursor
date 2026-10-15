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
  {
    chapter: 11,
    title: "The Tower of Babel",
    headings: { 1: "The Tower of Babel", 10: "From Shem to Abram", 27: "Terah's Family" },
    scenes: [
      { from: 1, prompt: "Crowds of ancient builders making bricks and raising an enormous unfinished tower on the plain of Shinar at dusk, kilns glowing, ramps and scaffolds against a darkening sky." },
      { from: 5, prompt: "The great tower standing half-built and abandoned under a vast night sky, a soft light descending from above, small groups of people walking away in different directions." },
      { from: 10, prompt: "Generations of a family travelling slowly across a wide land by moonlight, tents and campfires spreading across the hills, an old man leading the way." },
      { from: 27, prompt: "A family caravan leaving the walled city of Ur at dawn, ziggurat behind them, camels and flocks heading north along the river toward Haran." },
    ],
  },
  {
    chapter: 12,
    title: "The Call of Abram",
    headings: { 1: "The Call of Abram", 10: "Abram in Egypt" },
    scenes: [
      { from: 1, prompt: "An elderly man standing alone outside his tent in Haran at night, looking up at a sky full of stars, a soft light resting on him, his household asleep." },
      { from: 4, prompt: "A long caravan setting out across open country at sunrise, camels, flocks and servants, an old man and his wife at the front, the road leading toward distant hills." },
      { from: 7, prompt: "A simple stone altar beneath a great old oak tree at Shechem in the evening, smoke rising gently, the man kneeling, the land of Canaan spread out beyond." },
      { from: 10, prompt: "A caravan arriving at the green banks of the Nile in Egypt during a famine, palms and fields, distant pyramids and a royal city in the warm evening haze." },
    ],
  },
  {
    chapter: 13,
    title: "Abram and Lot Part Ways",
    headings: { 1: "Abram and Lot Separate", 14: "God's Promise to Abram" },
    scenes: [
      { from: 1, prompt: "Two large camps of tents and crowded herds of sheep and cattle sharing one dry hillside at dusk, herdsmen arguing at a well, dust in the air." },
      { from: 10, prompt: "A younger man on a ridge at evening looking down at the lush, well-watered plain of the Jordan, green as a garden, distant cities glinting in the low sun." },
      { from: 14, prompt: "An old man standing on a high hill at twilight looking out over the whole land in every direction, north, south, east and west, under the first stars." },
      { from: 18, prompt: "Tents pitched among the great oaks of Mamre near Hebron at night, a small stone altar with a faint fire, peace over the camp." },
    ],
  },
  {
    chapter: 14,
    title: "Abram Rescues Lot",
    headings: { 1: "The War of the Kings", 13: "Abram Rescues Lot", 17: "Melchizedek Blesses Abram" },
    scenes: [
      { from: 1, prompt: "Ancient armies with banners camped across the Valley of Siddim at dusk, dark tar pits among the rocks, the Salt Sea pale in the distance." },
      { from: 13, prompt: "A band of men moving swiftly through hill country at night with shaded torches, an old leader at their head, a starlit sky above." },
      { from: 18, prompt: "A round loaf of bread and a plain clay cup of wine set on a flat stone on a hillside at sunset, the stone walls of Salem on the ridge behind; a still life with no people." },
    ],
  },
  {
    chapter: 15,
    title: "The Covenant with Abram",
    headings: { 1: "God's Covenant with Abram" },
    scenes: [
      { from: 1, prompt: "An old man sitting at the door of his tent at night, lamp beside him, a soft light filling the space as if he is listening to a voice." },
      { from: 5, prompt: "The old man standing outside under an immense, brilliant night sky full of countless stars, the Milky Way stretching overhead, looking up in wonder." },
      { from: 9, prompt: "Animals laid out in two rows on a dry hillside at evening, a man keeping watch and waving away birds of prey, the sun sinking low." },
      { from: 17, prompt: "Deep darkness over the hills, a smoking firepot and a flaming torch moving between the two rows, their glow the only light in the night." },
    ],
  },
  {
    chapter: 16,
    title: "Hagar and Ishmael",
    headings: { 1: "Sarai and Hagar", 7: "The God Who Sees Me", 15: "The Birth of Ishmael" },
    scenes: [
      { from: 1, prompt: "Inside a large tent at evening, an older woman and a young Egyptian servant woman in quiet tension, a lamp between them, the old man standing apart." },
      { from: 7, prompt: "A young woman alone beside a spring in the desert on the road to Shur, a gentle light standing near her, the wilderness wide and empty around." },
      { from: 15, prompt: "A goat-hair nomad tent at night seen from outside, warm lamplight glowing through its open flap, a small cooking fire and sleeping sheep nearby under many stars; no people visible." },
    ],
  },
  {
    chapter: 17,
    title: "Abraham, Father of Nations",
    headings: { 1: "The Covenant of Circumcision", 15: "Isaac Promised", 23: "Abraham Obeys" },
    scenes: [
      { from: 1, prompt: "A very old man lying face down on the ground outside his tent at dawn, a radiant light before him, the sky turning gold." },
      { from: 15, prompt: "The very old man sitting by his tent at dusk, smiling quietly to himself, his elderly wife resting nearby, stars appearing over the hills." },
      { from: 23, prompt: "A large peaceful camp at evening, tents and fires, the household gathered and still, the old man standing among them." },
    ],
  },
  {
    chapter: 18,
    title: "Three Visitors",
    headings: { 1: "The Three Visitors", 16: "Abraham Pleads for Sodom" },
    scenes: [
      { from: 1, prompt: "Three travellers standing near the great oaks of Mamre in the heat of the day, an old man running from his tent to greet them and bowing low." },
      { from: 6, prompt: "A simple meal of bread, curds and roast meat set under the shade of a great tree, the three guests seated, the old man standing by to serve." },
      { from: 10, prompt: "An elderly woman listening at the doorway of a tent, half hidden in shadow, a hand over her mouth, the guests outside in sunlight." },
      { from: 22, prompt: "An old man standing alone on a hilltop at dusk, looking toward the distant cities of the plain, pleading quietly, a soft light before him." },
    ],
  },
  {
    chapter: 19,
    title: "Sodom and Gomorrah",
    headings: { 1: "Two Angels Visit Lot", 15: "The Escape from Sodom", 30: "Lot in the Mountains" },
    scenes: [
      { from: 1, prompt: "Two travellers in pale cloaks arriving at the gate of an ancient city at evening, a man rising from his seat at the gate to greet them, torches lit on the walls." },
      { from: 15, prompt: "Two figures of light leading a man, his wife and two daughters by the hand out of a city before dawn, hurrying toward the hills." },
      { from: 24, prompt: "Distant cities on the plain burning under a dark sky, smoke rising like a furnace, seen from far away in the hills, a small pale pillar on the road behind." },
      { from: 30, prompt: "An empty mountain cave above the plain at night, a small fire inside, desolate hills under a dim moon." },
    ],
  },
  {
    chapter: 20,
    title: "Abraham and Abimelech",
    headings: { 1: "Abraham and Abimelech" },
    scenes: [
      { from: 1, prompt: "A nomad camp of tents settling near the town of Gerar in the dry Negev at dusk, a small royal residence in the distance." },
      { from: 3, prompt: "A king asleep on his bed in a dark room, a soft light filling the room as he dreams, his face troubled." },
      { from: 14, prompt: "The king at dawn giving sheep, cattle and servants to the old man, silver set before them, both standing at peace." },
      { from: 17, prompt: "The old man praying with lifted hands at sunrise, the king's household gathered behind him in gentle morning light." },
    ],
  },
];

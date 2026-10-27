/**
 * Sleep chapters for Genesis: a short title, section headings (Lampstand's
 * own, placed at the verse where each section begins) and three or four
 * paintings, each shown from its starting verse until the next one.
 *
 * Scripture itself comes from data/bsb.txt; nothing here changes the text.
 * Used by scripts/sleep-chapter.ts.
 */
export type SleepScene = {
  from: number;
  prompt: string;
  /** Characters in the scene whose sheet (content/sleep/characters/<name>.jpg) the painting follows. */
  cast?: string[];
};
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
  "Patriarchs and their families are weathered Near Eastern nomads in earth-toned wool; no figure resembles Jesus or the Virgin Mary, no one wears a white or red robe as the centre of the picture, and no light glows around anyone's head. " +
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
  {
    chapter: 21,
    title: "The Birth of Isaac",
    headings: { 1: "The Birth of Isaac", 8: "Hagar and Ishmael Sent Away", 22: "The Covenant at Beersheba" },
    scenes: [
      { from: 1, prompt: "An old woman with grey hair standing alone at the door of a goat-hair tent at sunrise, her face bright with laughter and joy, the wide Negev hills behind her." },
      { from: 8, prompt: "A feast at evening outside nomad tents, lamps and a cooking fire, guests seated on rugs around bread and roast meat, seen from a little distance." },
      { from: 14, prompt: "A young Egyptian woman walking alone into the dry wilderness of Beersheba at dawn with a water skin and a little bread on her shoulder, a boy beside her, long shadows on the sand." },
      { from: 17, prompt: "A hidden well of clear water in the desert wilderness at dusk, a stone rim, a water skin lying beside it, soft light on the water; no people." },
      { from: 33, prompt: "A young tamarisk tree newly planted beside a stone well at Beersheba under a calm evening sky, sheep resting nearby; no people." },
    ],
  },
  {
    chapter: 22,
    title: "The Offering of Isaac",
    headings: { 1: "The Offering of Isaac", 20: "The Sons of Nahor" },
    scenes: [
      { from: 3, prompt: "An old man and a youth walking at dawn along a rocky path toward distant mountains, a donkey carrying a bundle of wood, two servants behind." },
      { from: 6, prompt: "A father and his son walking together up a mountain path seen from behind, the son carrying a bundle of wood, the father with a small fire pot, quiet evening light." },
      { from: 13, prompt: "A ram caught by its horns in a thicket on a mountaintop at sunrise, a rough stone altar nearby, golden morning light; no people." },
      { from: 17, prompt: "Countless stars over a quiet seashore at night, waves on endless sand, a sense of a promise; no people." },
    ],
  },
  {
    chapter: 23,
    title: "The Death of Sarah",
    headings: { 1: "The Death and Burial of Sarah" },
    scenes: [
      { from: 1, prompt: "A goat-hair tent at Hebron at night with a single clay lamp burning inside, a quiet mourning stillness, oak trees under the stars; no people visible." },
      { from: 3, prompt: "An old man bowing respectfully before the elders seated at the stone gate of the ancient town of Hebron, evening light." },
      { from: 17, prompt: "The mouth of a cave at the edge of a field with trees around it at Machpelah, near Mamre, in soft dusk light; no people." },
    ],
  },
  {
    chapter: 24,
    title: "A Bride for Isaac",
    headings: { 1: "A Bride for Isaac", 10: "Rebekah at the Well", 62: "Isaac Marries Rebekah" },
    scenes: [
      { from: 10, prompt: "An old servant setting out at dawn leading a line of ten camels laden with gifts across the desert toward distant hills." },
      { from: 11, prompt: "Camels kneeling beside a stone well outside an ancient town at evening, an old servant standing with his hands lifted in prayer." },
      { from: 15, prompt: "A young woman carrying a clay water jar on her shoulder at a spring at evening, modestly dressed, camels kneeling nearby, warm golden light." },
      { from: 28, prompt: "A family household gathered by lamplight in a courtyard at night, a brother greeting an old travelling servant, camels resting by the wall." },
      { from: 63, prompt: "A young man walking alone in an open field at evening, looking up as a line of camels approaches in the distance under a soft sky." },
    ],
  },
  {
    chapter: 25,
    title: "Jacob and Esau",
    headings: { 1: "Abraham and Keturah", 7: "The Death of Abraham", 12: "The Descendants of Ishmael", 19: "The Births of Jacob and Esau", 27: "Esau Sells His Birthright" },
    scenes: [
      { from: 1, prompt: "An old man sitting at the door of his tent at evening watching many grandchildren and flocks across a wide valley, peaceful sunset." },
      { from: 7, prompt: "Two grown brothers standing quietly together at the mouth of a burial cave in a field at dusk, their heads bowed." },
      { from: 12, prompt: "Twelve nomad tribal camps spread across the desert from horizon to horizon at twilight, cooking fires glowing; seen from far away." },
      { from: 27, prompt: "A rugged hunter in skins returning from the field, tired, and a quiet young man stirring a pot of red lentil stew over a fire beside the tents at evening." },
    ],
  },
  {
    chapter: 26,
    title: "Isaac and Abimelech",
    headings: { 1: "God's Promise to Isaac", 7: "Isaac and Abimelech", 12: "Isaac Prospers", 23: "The Covenant at Beersheba", 34: "Esau's Wives" },
    scenes: [
      { from: 1, prompt: "A grey-bearded man in his prime standing alone on a dry hillside near Gerar at dusk during a famine, cracked earth, a soft light breaking through clouds above him." },
      { from: 12, prompt: "Golden fields of barley ripe for harvest in the land of Gerar at sunset, sheaves stacked high, flocks and herds grazing beyond, a nomad camp at the edge." },
      { from: 18, prompt: "Herdsmen at dusk reopening an old stone well in a dry valley, water glinting below, camels and goats waiting nearby." },
      { from: 26, prompt: "A Philistine king in a tall plumed headdress and armour, with his army commander, sharing a feast with a grey-bearded nomad chief outside tents at night, seen from a little distance, lamps and a fire, an oath of peace." },
      { from: 32, prompt: "A newly dug well brimming with water at Beersheba at sunrise, servants gathered gladly around it, the desert glowing gold." },
    ],
  },
  {
    chapter: 27,
    title: "Jacob and the Blessing",
    headings: { 1: "Jacob Steals Esau's Blessing", 30: "Esau's Lost Blessing", 41: "Jacob Flees from Esau" },
    scenes: [
      { from: 1, prompt: "A very old blind man resting on a cushioned bed inside a dim lamplit tent, his rugged hunter son with a bow standing at the entrance listening." },
      { from: 18, prompt: "A smooth-skinned young man in goatskin-covered sleeves offering a dish of savory stew to an old blind father in a lamplit tent." },
      { from: 30, prompt: "A rugged hunter in skins standing in the tent doorway holding a dish of game, his face full of grief, the old father seated trembling." },
      { from: 41, prompt: "A young man leaving a nomad camp alone before dawn with a staff and a small bundle, his mother watching from a tent door far behind." },
    ],
  },
  {
    chapter: 28,
    title: "Jacob's Ladder",
    headings: { 1: "Jacob Sent to Paddan-aram", 6: "Esau Marries Mahalath", 10: "Jacob's Ladder" },
    scenes: [
      { from: 1, prompt: "An old father with his hand raised in blessing over his kneeling younger son outside a tent at dawn, a staff and travel bundle beside the young man." },
      { from: 10, prompt: "A lone young traveller walking through rocky hill country at sunset with a staff, the road winding north into the distance." },
      { from: 12, prompt: "A young man asleep on the ground with his head on a stone under a starry night, a great stairway of soft golden light rising from the earth into the sky, faint figures of light ascending and descending it." },
      { from: 18, prompt: "A stone pillar set upright on a rocky hilltop at sunrise, oil glistening on its top, a staff leaning against it; no people." },
    ],
  },
  {
    chapter: 29,
    title: "Jacob Meets Rachel",
    headings: { 1: "Jacob Meets Rachel", 15: "Jacob Marries Leah and Rachel", 31: "Jacob's Children" },
    scenes: [
      { from: 1, prompt: "A well in an open field with a large stone over its mouth, three flocks of sheep lying beside it, shepherds resting, warm late-afternoon light." },
      { from: 9, prompt: "A young shepherdess in simple wool clothing leading her father's sheep toward a stone well at evening, a traveller rolling the heavy stone from the well's mouth." },
      { from: 15, prompt: "A young man tending large flocks of sheep in the hill country of Haran, seen at golden evening under a wide sky." },
      { from: 31, prompt: "A quiet nomad camp of several tents at night, lamps glowing in each tent, small sandals at a doorway, stars above; no people visible." },
    ],
  },
  {
    chapter: 30,
    title: "Jacob's Family Grows",
    headings: { 1: "The Children of Jacob", 25: "Jacob's Flocks Increase" },
    scenes: [
      { from: 1, prompt: "A large nomad camp of goat-hair tents in the land of Haran at dusk, small clay jars and baskets by the tent doors, cooking fires; no people close up." },
      { from: 14, prompt: "Mandrake plants with small yellow fruit growing at the edge of a wheat field at harvest time, golden evening light; no people." },
      { from: 25, prompt: "A shepherd at evening setting peeled branches with white stripes in the stone watering troughs, flocks gathering to drink." },
      { from: 37, prompt: "Great flocks of speckled and spotted goats and dark sheep spread across the hills of Haran at sunset, a prosperous camp with camels and donkeys." },
    ],
  },
  {
    chapter: 31,
    title: "Jacob Flees from Laban",
    headings: { 1: "Jacob Flees from Laban", 22: "Laban Pursues Jacob", 43: "Jacob's Covenant with Laban" },
    scenes: [
      { from: 1, prompt: "A shepherd speaking quietly with two women out in the open field among his flocks at evening, the camp far behind." },
      { from: 17, prompt: "A long caravan of camels carrying families and herds of livestock crossing a wide river at night under moonlight, heading west." },
      { from: 22, prompt: "A band of men on camels riding hard across the desert by moonlight, dust trailing behind them, the mountains of Gilead ahead." },
      { from: 33, prompt: "Inside a lamplit goat-hair tent, a camel saddle draped with a striped rug, baskets, rolled carpets and clay jars turned over as if searched; no people visible." },
      { from: 45, prompt: "A heap of stones and a single standing stone on a hilltop in Gilead at dawn, two camps of tents on either side below; a covenant of peace." },
    ],
  },
  {
    chapter: 32,
    title: "Jacob Wrestles with God",
    headings: { 1: "Jacob Prepares to Meet Esau", 22: "Jacob Wrestles with God" },
    scenes: [
      { from: 1, prompt: "A nomad caravan camped on a hillside at dusk, faint figures of light standing on the far ridge like a camp of angels, the travellers looking up in awe." },
      { from: 9, prompt: "A grey-haired old shepherd seen from behind, kneeling alone in prayer on a rocky slope above his sleeping camp at night, small against the stars." },
      { from: 13, prompt: "Herds of goats, sheep, camels, cows and donkeys sent ahead in separate droves across a valley at sunrise, servants driving each drove with gaps between them." },
      { from: 22, prompt: "The ford of the Jabbok river at night seen from far away, a small lone figure of an old shepherd at the water's edge after his family has crossed, dark hills and the river glinting under the moon." },
      { from: 31, prompt: "The first rays of sunrise over the ford of the Jabbok, a man walking away with a limp, leaning on his staff, golden light ahead of him." },
    ],
  },
  {
    chapter: 33,
    title: "Jacob Meets Esau",
    headings: { 1: "Jacob Meets Esau", 18: "Jacob Settles in Shechem" },
    scenes: [
      { from: 1, prompt: "A man bowing low to the ground as his brother approaches with four hundred men in the distance, a family waiting behind the bowing man, morning light." },
      { from: 4, prompt: "Two grown brothers embracing in an open field at morning, weeping, one rugged in skins and one in a traveller's cloak, their companions watching from a distance." },
      { from: 17, prompt: "A simple house and shelters for livestock built at Succoth beside a river at evening, a peaceful settled camp." },
      { from: 18, prompt: "A stone altar in an open field outside the walled town of Shechem at sunset, tents pitched nearby; no people close up." },
    ],
  },
  {
    chapter: 34,
    title: "Dinah and the Shechemites",
    headings: { 1: "Dinah and the Shechemites" },
    scenes: [
      { from: 1, prompt: "The walled Canaanite town of Shechem seen from the hills at dusk, a nomad camp of tents in the valley below; no people close up." },
      { from: 5, prompt: "A father sitting alone and silent at the door of his tent at night, a single lamp beside him, his head bowed in sorrow." },
      { from: 25, prompt: "Smoke rising from a distant walled town at dawn seen from far across empty fields, a grey and sorrowful sky; no people." },
      { from: 30, prompt: "A troubled old man standing at his tent door at night facing two of his sons whose backs are turned, a lamp between them." },
    ],
  },
  {
    chapter: 35,
    title: "Jacob Returns to Bethel",
    headings: { 1: "Jacob Returns to Bethel", 16: "The Death of Rachel", 23: "The Sons of Jacob", 27: "The Death of Isaac" },
    scenes: [
      { from: 1, prompt: "A family burying small carved idols and earrings under a great oak tree at dusk before setting out on a journey." },
      { from: 6, prompt: "A rough stone altar on the hilltop at Bethel at sunrise, a standing stone beside it shining with poured oil; no people close up." },
      { from: 16, prompt: "A single stone pillar beside the road to Bethlehem at dusk, wildflowers at its foot, the road leading on into gentle hills; no people." },
      { from: 23, prompt: "Twelve young men of different ages standing together in a field at golden evening with their flocks, seen from a little distance." },
      { from: 27, prompt: "Two older brothers, one rugged in skins and one in a shepherd's cloak, standing side by side at a cave tomb at Hebron at dusk, heads bowed." },
    ],
  },
  {
    chapter: 36,
    title: "The Descendants of Esau",
    headings: { 1: "The Descendants of Esau", 20: "The Descendants of Seir", 31: "The Kings of Edom" },
    scenes: [
      { from: 1, prompt: "A large caravan of camels, herds and households moving away across the desert toward the red mountains of Seir at sunset." },
      { from: 9, prompt: "The red sandstone mountains of Edom at dusk, many tribal camps with fires glowing in the valleys below; seen from far away." },
      { from: 20, prompt: "Hot springs steaming in a desert valley at twilight, donkeys grazing nearby, rocky red cliffs; no people close up." },
      { from: 31, prompt: "An ancient stone city on a red mountain ridge of Edom under a sky full of stars, a royal hall lit by torches; no people close up." },
    ],
  },
  {
    chapter: 37,
    title: "Joseph's Dreams",
    headings: { 1: "Joseph's Dreams", 12: "Joseph Sold by His Brothers" },
    scenes: [
      { from: 1, prompt: "A teenage shepherd boy in a richly ornamented long robe of many colours standing among flocks at evening, his older brothers in plain wool watching him coldly from a distance." },
      { from: 5, prompt: "A dreamlike wheat field at night, sheaves of grain bowing in a circle around one upright sheaf, a bright sun, a pale moon and eleven stars in the sky above; no people." },
      { from: 23, prompt: "An empty dry cistern in the desert at dusk, a torn robe of many colours lying on the stones beside it; no people." },
      { from: 28, prompt: "A caravan of traders with camels laden with spices and balm heading south toward Egypt at dusk, seen from far away across the desert." },
      { from: 34, prompt: "An old father with a grey beard weeping in a lamplit tent at night, holding a torn robe of many colours to his chest." },
    ],
  },
  {
    chapter: 38,
    title: "Judah and Tamar",
    headings: { 1: "Judah and Tamar" },
    scenes: [
      { from: 1, prompt: "A man leaving his brothers' camp alone, walking down toward the hills of Adullam at dusk with his staff." },
      { from: 12, prompt: "Sheep-shearing time on the hillsides of Timnah at sunset, great flocks gathered by stone pens, shepherds at work in the distance." },
      { from: 18, prompt: "A shepherd's staff, a carved cylinder seal and its cord resting on a flat stone by a quiet roadside at twilight; no people." },
    ],
  },
  {
    chapter: 39,
    title: "Joseph in Egypt",
    headings: { 1: "Joseph and Potiphar", 20: "Joseph in Prison" },
    scenes: [
      { from: 1, prompt: "A young clean-shaven Hebrew steward in pleated Egyptian linen and a short black Egyptian wig directing servants in the columned courtyard of a grand Egyptian house at evening, lamps being lit." },
      { from: 11, prompt: "A linen cloak lying on the polished floor of an empty Egyptian hall at night, painted columns and a single burning lamp; no people." },
      { from: 20, prompt: "A dark stone prison in Egypt at night, a young clean-shaven Hebrew man in a plain linen kilt carrying a lamp and bread to other prisoners, the jailer watching kindly from the doorway." },
    ],
  },
  {
    chapter: 40,
    title: "The Cupbearer and the Baker",
    headings: { 1: "The Cupbearer and the Baker" },
    scenes: [
      { from: 1, prompt: "Two troubled Egyptian royal officials sitting in a dim prison cell at dawn, a young clean-shaven Hebrew man in a linen kilt kneeling to ask them what is wrong." },
      { from: 9, prompt: "A dreamlike vine with three branches budding, blossoming and hanging with ripe grape clusters, a golden Egyptian cup beneath them, soft night light; no people." },
      { from: 16, prompt: "Three woven baskets of bread stacked on a stone ledge under a pale sky, birds circling above; no people." },
      { from: 20, prompt: "Pharaoh's birthday feast in a torchlit Egyptian hall, a cupbearer bowing as he offers a golden cup to the king on his throne." },
    ],
  },
  {
    chapter: 41,
    title: "Joseph Interprets Pharaoh's Dreams",
    headings: { 1: "Pharaoh's Dreams", 14: "Joseph Interprets the Dreams", 37: "Joseph Rules Egypt" },
    scenes: [
      { from: 1, prompt: "A dreamlike riverbank of the Nile at dusk, seven sleek cattle grazing in the reeds and seven gaunt cattle coming up from the river behind them; no people." },
      { from: 14, prompt: "A young clean-shaven Hebrew man, freshly shaved in pleated Egyptian linen, standing before Pharaoh on his throne in a vast torchlit hall of painted columns." },
      { from: 41, prompt: "A young Egyptian governor in pleated linen with a broad gold-and-lapis collar and a black Egyptian wig riding in a chariot through an Egyptian city at sunset, crowds bowing." },
      { from: 47, prompt: "Great mud-brick granaries along the Nile overflowing with grain at sunset, workers carrying baskets of wheat, the river glowing gold." },
    ],
  },
  {
    chapter: 42,
    title: "Joseph's Brothers Go to Egypt",
    headings: { 1: "Joseph's Brothers Go to Egypt", 29: "The Brothers Return to Canaan" },
    scenes: [
      { from: 1, prompt: "Ten bearded shepherd brothers with donkeys setting out at dawn across the desert from Canaan toward Egypt." },
      { from: 6, prompt: "Ten weary shepherd brothers bowing to the ground before an Egyptian governor in pleated linen, a gold collar and a black Egyptian wig, seated on a dais beside the granaries." },
      { from: 27, prompt: "A desert lodging place at night lit by a small fire, a donkey loaded with sacks of grain, an opened sack with silver glinting at its mouth." },
      { from: 36, prompt: "An old grey-bearded father at his tent door at night, his arm around his youngest son, refusing to let him go, a lamp beside them." },
    ],
  },
  {
    chapter: 43,
    title: "The Second Journey to Egypt",
    headings: { 1: "The Second Journey to Egypt", 16: "Joseph Welcomes His Brothers" },
    scenes: [
      { from: 1, prompt: "Parched fields and empty grain jars outside a nomad camp in a time of famine, dry hills under a hazy evening sky; no people close up." },
      { from: 15, prompt: "Eleven shepherd brothers with donkeys carrying gifts of balm, honey, spices and almonds arriving at the gates of a grand Egyptian house at noon." },
      { from: 30, prompt: "An Egyptian governor in pleated linen and a black Egyptian wig weeping alone in a private chamber, his face in his hands, lamplight on painted walls." },
      { from: 32, prompt: "A banquet in a torchlit Egyptian hall, eleven shepherd brothers seated in a row from oldest to youngest, astonished, servants carrying dishes." },
    ],
  },
  {
    chapter: 44,
    title: "Joseph's Silver Cup",
    headings: { 1: "Joseph's Silver Cup", 18: "Judah Pleads for Benjamin" },
    scenes: [
      { from: 1, prompt: "An Egyptian steward by lamplight at night quietly placing a silver cup into the mouth of a sack of grain among loaded sacks; no faces seen." },
      { from: 12, prompt: "A silver cup lying in spilled grain on a desert road at dawn, an open sack beside a donkey, brothers' torn cloaks on the ground." },
      { from: 18, prompt: "A bearded shepherd stepping forward and pleading earnestly before an Egyptian governor in a torchlit hall, his brothers kneeling behind him." },
    ],
  },
  {
    chapter: 45,
    title: "Joseph Reveals His Identity",
    headings: { 1: "Joseph Reveals His Identity", 16: "Pharaoh Invites Jacob to Egypt" },
    scenes: [
      { from: 1, prompt: "An Egyptian governor in pleated linen and a black Egyptian wig weeping as he embraces a young shepherd, the other shepherd brothers standing amazed in a torchlit hall." },
      { from: 16, prompt: "Egyptian wooden carts loaded with grain, bread and provisions, and donkeys carrying goods, setting off across the desert toward Canaan at sunrise." },
      { from: 25, prompt: "Egyptian carts arriving at a nomad camp in Canaan at dusk, an old grey-bearded father rising from his seat at the tent door in astonishment." },
    ],
  },
  {
    chapter: 46,
    title: "Jacob Goes to Egypt",
    headings: { 1: "Jacob Goes to Egypt", 8: "The Family of Jacob", 28: "Jacob Arrives in Goshen" },
    scenes: [
      { from: 1, prompt: "An old grey-bearded man offering a sacrifice on a stone altar at Beersheba at night, a soft light in the sky above him, his camp sleeping nearby." },
      { from: 5, prompt: "A great caravan of Egyptian carts, families, flocks and herds moving south across the desert toward Egypt at golden evening, seen from far away." },
      { from: 29, prompt: "An Egyptian governor in pleated linen and a gold collar stepping down from his chariot to embrace an old grey-bearded shepherd father in the green land of Goshen at sunset." },
    ],
  },
  {
    chapter: 47,
    title: "Jacob Settles in Goshen",
    headings: { 1: "Jacob Settles in Goshen", 13: "The Famine Continues", 27: "Israel's Last Request" },
    scenes: [
      { from: 1, prompt: "Five shepherd brothers standing respectfully before Pharaoh on his throne in a torchlit hall, an Egyptian governor beside them." },
      { from: 7, prompt: "A very old grey-bearded shepherd raising his hand in blessing over Pharaoh in a columned Egyptian hall, soft lamplight." },
      { from: 13, prompt: "Egyptians bringing horses, flocks and cattle to the granaries in exchange for grain during a famine, dusty sunlight, long lines at dusk." },
      { from: 27, prompt: "The green pastures of Goshen by a branch of the Nile at evening, flocks grazing, tents and simple houses of a settled family." },
    ],
  },
  {
    chapter: 48,
    title: "Jacob Blesses Ephraim and Manasseh",
    headings: { 1: "Jacob Blesses Ephraim and Manasseh" },
    scenes: [
      { from: 1, prompt: "A very old grey-bearded man sitting up on his bed by lamplight, a man in Egyptian linen and two young boys entering the room." },
      { from: 13, prompt: "A very old man on his bed crossing his arms to lay his right hand on the younger boy's head and his left hand on the older boy's head, in warm lamplight." },
      { from: 21, prompt: "An old man's weathered hand resting on his grown son's arm beside a bed at night, a single lamp burning low; faces not shown." },
    ],
  },
  {
    chapter: 49,
    title: "Jacob Blesses His Sons",
    headings: { 1: "Jacob Blesses His Sons", 29: "The Death of Jacob" },
    scenes: [
      { from: 1, prompt: "A very old grey-bearded man sitting up on his bed, twelve grown sons gathered around him by lamplight at night, listening." },
      { from: 8, prompt: "A lion resting on a rocky hilltop at dusk, a vine heavy with grapes growing over the rocks below; no people." },
      { from: 22, prompt: "A fruitful vine growing beside a spring, its branches climbing over an old stone wall in soft evening light; no people." },
      { from: 33, prompt: "An empty bed in a quiet Egyptian room at night, a single lamp burning low beside it, a folded shepherd's cloak and staff at its foot; no people." },
    ],
  },
  {
    chapter: 50,
    title: "The Death of Joseph",
    headings: { 1: "The Burial of Jacob", 15: "Joseph Reassures His Brothers", 22: "The Death of Joseph" },
    scenes: [
      { from: 7, prompt: "A great funeral procession of chariots, horsemen and mourners travelling from Egypt toward the hills of Canaan at dusk, seen from far away." },
      { from: 15, prompt: "Grey-haired shepherd brothers bowing before an Egyptian governor in pleated linen, who reaches out his hands to raise them up, warm lamplight." },
      { from: 22, prompt: "A very old man in Egyptian linen sitting by the Nile at sunset, his grandchildren and great-grandchildren gathered around him." },
      { from: 26, prompt: "A wooden coffin resting in a quiet Egyptian chamber lit by one lamp, palm leaves laid upon it; no people." },
    ],
  },
];

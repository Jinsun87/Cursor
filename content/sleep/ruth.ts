import type { SleepChapterPlan } from "./genesis";

/**
 * Ruth for Walk and Sleep: a quiet harvest story, so mostly fields, roads and lamplit
 * rooms at evening. Naomi is an older Israelite widow and Ruth a young Moabite woman,
 * both in plain wool with head coverings; Boaz is a grey-bearded landowner. The deaths
 * in chapter 1 are never shown, only the empty road and the graves' quiet hillside.
 */
const NAOMI = "Naomi, an older Israelite widow with a lined face, in a plain dark wool dress and head covering";
const RUTH = "Ruth, a young Moabite woman with dark braided hair under a simple head covering, in a plain undyed wool dress";
const BOAZ = "Boaz, a dignified grey-bearded landowner in a brown wool cloak";

export const RUTH_PLANS: SleepChapterPlan[] = [
  {
    chapter: 1,
    title: "Naomi and Ruth",
    headings: { 1: "Naomi Widowed", 6: "Ruth's Loyalty to Naomi", 19: "Naomi and Ruth Return" },
    scenes: [
      { from: 1, prompt: "Cracked dry fields around the small hill town of Bethlehem in a time of famine, at dusk; a man, his wife and two sons walking away down the road toward the hills of Moab, small in the distance." },
      { from: 3, prompt: "Three small stone-heaped graves on a quiet hillside in the land of Moab at evening, wild grass moving in the wind; no people." },
      { from: 6, prompt: `${NAOMI} and two young women setting out at dawn on a dusty road leading west out of Moab, seen from behind, bundles on their shoulders.` },
      { from: 14, prompt: `${RUTH} holding the hands of ${NAOMI} on the road at sunset while a third young woman walks away alone in the far distance, back toward Moab.` },
      { from: 19, prompt: "The stone gate of Bethlehem at golden evening, barley fields ripening around the town, two women in plain wool arriving on the road, seen from behind." },
    ],
  },
  {
    chapter: 2,
    title: "Ruth Meets Boaz",
    headings: { 1: "Ruth Gleans in the Field of Boaz", 17: "Ruth Reports to Naomi" },
    scenes: [
      { from: 1, prompt: "Golden barley fields outside Bethlehem in early morning light, harvesters with sickles working in a line in the distance, sheaves standing in rows." },
      { from: 3, prompt: `${RUTH} bending to gather fallen stalks of barley behind the harvesters in a golden field, seen from the side, the morning sun low behind her.` },
      { from: 8, prompt: `${BOAZ} standing in his barley field speaking kindly to ${RUTH}, who bows her head, harvesters resting in the shade of a tree behind them.` },
      { from: 14, prompt: "Harvesters sitting together on the edge of a barley field at midday under a large tree, bread and a bowl of sauce passed between them, roasted grain on a cloth, seen from a little way off." },
      { from: 17, prompt: `${RUTH} beating out barley with a stick on a flat stone at dusk at the edge of the field, a small heap of grain beside her.` },
      { from: 18, prompt: `A small lamplit room in Bethlehem at night, ${NAOMI} and ${RUTH} sitting together beside a basket full of barley, warm light on their faces.` },
    ],
  },
  {
    chapter: 3,
    title: "Ruth at the Threshing Floor",
    headings: { 1: "Ruth's Redemption Assured" },
    scenes: [
      { from: 1, prompt: `${NAOMI} speaking quietly with ${RUTH} by an oil lamp in a small stone house at evening, a folded shawl and a little jar of perfume on the table.` },
      { from: 6, prompt: "A threshing floor of beaten earth on a hill outside Bethlehem at night, great heaps of winnowed barley glowing under the moon and stars, the town's lights far off; no people close up." },
      { from: 8, prompt: `A threshing floor at midnight under the stars, ${BOAZ} sitting up beside a heap of grain, and a young woman in a plain head covering kneeling modestly at a respectful distance, moonlight on the grain.` },
      { from: 14, prompt: `The first grey light before dawn over the threshing floor, ${RUTH} walking away toward the town with a shawl full of barley carried on her shoulder, seen from behind.` },
      { from: 16, prompt: "A small stone house in Bethlehem at sunrise, a shawl of barley set down by the open door, morning light falling across the floor; no people." },
    ],
  },
  {
    chapter: 4,
    title: "Boaz Redeems Ruth",
    headings: { 1: "Boaz Redeems Ruth", 13: "The Birth of Obed", 18: "The Genealogy of David" },
    scenes: [
      { from: 1, prompt: `The stone gate of Bethlehem in the morning, ${BOAZ} seated on a stone bench with ten grey-bearded elders in plain robes seated around him, townspeople watching in the background.` },
      { from: 7, prompt: "A man's hand passing a single worn leather sandal to another man's hand at the town gate, morning light, elders' robes behind; only hands and the sandal visible." },
      { from: 13, prompt: "A wedding feast at evening in a courtyard in Bethlehem, lamps hung from a fig tree, guests in plain wool gathered around tables of bread and wine, seen from a little way off." },
      { from: 16, prompt: `${NAOMI} sitting by a lamplit window holding a newborn baby wrapped in cloth on her lap, her face full of quiet joy, neighbour women smiling in the doorway.` },
      { from: 18, prompt: "The hills of Bethlehem at night under a vast sky of stars, a shepherd's fire on a far slope and a small flock resting nearby; no people close up." },
    ],
  },
];

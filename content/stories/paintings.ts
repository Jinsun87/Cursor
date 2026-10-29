/**
 * Paintings for the story episodes, one entry per section of each script (in order, from
 * "Settling in" to "Closing"). An entry is either an existing painting's path, reused from
 * the Bible chapters, or "new:<id>", painted by scripts/story-paint.ts from `paint[id]` into
 * public/images/story/<slug>/<id>.jpg. Until a new one is painted, `fallback` shows instead.
 * Rules as for the chapter paintings: God only as light; Jesus from the character sheet,
 * at a distance or from behind, no halo; nothing frightening; no text.
 */
export type StoryArt = {
  /** NIGHT_STYLE (Old Testament) or GOSPEL_STYLE (when Jesus may appear). */
  style: "night" | "gospel";
  fallback: string;
  sections: string[];
  paint?: Record<string, { prompt: string; cast?: string[] }>;
};

const NIGHT_HILLS = "/images/sleep/ruth-4/s5.jpg";
const ARK_AT_NIGHT = "/images/sleep/genesis-7/s3.jpg";

export const STORY_ART: Record<string, StoryArt> = {
  sarah: {
    style: "night",
    fallback: "/images/sleep/genesis-15/s2.jpg",
    sections: [
      "/images/sleep/genesis-15/s2.jpg",
      "/images/sleep/genesis-11/s4.jpg",
      "/images/sleep/genesis-12/s4.jpg",
      "/images/sleep/genesis-16/s1.jpg",
      "/images/sleep/genesis-17/s2.jpg",
      "/images/sleep/genesis-18/s3.jpg",
      "/images/sleep/genesis-20/s1.jpg",
      "/images/sleep/genesis-21/s1.jpg",
      "/images/sleep/genesis-21/s4.jpg",
      "/images/sleep/genesis-23/s3.jpg",
      "/images/sleep/genesis-17/s3.jpg",
      "/images/sleep/genesis-15/s2.jpg",
    ],
  },
  ruth: {
    style: "night",
    fallback: NIGHT_HILLS,
    sections: [
      "/images/sleep/ruth-4/s5.jpg",
      "/images/sleep/ruth-1/s1.jpg",
      "/images/sleep/ruth-1/s4.jpg",
      "/images/sleep/ruth-1/s5.jpg",
      "/images/sleep/ruth-2/s3.jpg",
      "/images/sleep/ruth-2/s6.jpg",
      "/images/sleep/ruth-3/s3.jpg",
      "/images/sleep/ruth-4/s2.jpg",
      "/images/sleep/ruth-4/s4.jpg",
      "/images/sleep/ruth-4/s3.jpg",
      "/images/sleep/ruth-2/s1.jpg",
    ],
  },
  hannah: {
    style: "night",
    fallback: NIGHT_HILLS,
    sections: ["new:home", "new:shiloh", "new:prayer", "new:home", "new:road", "new:sunrise", "new:robe", "new:sunrise", "new:robe"],
    paint: {
      shiloh: { prompt: "The ancient tent sanctuary at Shiloh on a hilltop at evening, a family with donkeys arriving along a winding path, the first lamps being lit; seen from a distance." },
      prayer: { prompt: "A woman in a plain dark wool dress and head covering kneeling alone in prayer near the stone doorpost of a tent sanctuary at dusk, an old white-bearded priest seated on a chair in the shadows watching; seen from a distance." },
      home: { prompt: "A small stone house in the hill town of Ramah at night, warm lamplight in the open doorway, a wooden cradle just visible inside; no faces." },
      road: { prompt: "A mother and a small boy walking hand in hand up a hill road toward a tent sanctuary in the morning, a servant leading a young bull behind them; seen from behind." },
      sunrise: { prompt: "Sunrise over the hills of Ephraim, golden light breaking through soft clouds over terraced slopes and olive trees; no people." },
      robe: { prompt: "A small linen robe folded on a wooden bench beside a clay oil lamp at night, a needle and thread resting beside it; no people." },
    },
  },
  abigail: {
    style: "night",
    fallback: NIGHT_HILLS,
    sections: ["new:road", "new:camp", "new:shearing", "new:donkeys", "new:ravine", "new:ravine", "new:shearing", "new:road", "new:road"],
    paint: {
      camp: { prompt: "A band of rough men resting at the mouth of a cave in the wilderness hills of Judah at dusk, spears leaning on the rock, a small fire; seen from a distance." },
      shearing: { prompt: "Flocks of sheep and goats on a hillside at Carmel at shearing time, a rich landowner's tents and a feast laid out on rugs, evening light." },
      donkeys: { prompt: "A woman in a deep blue wool cloak directing servants as they load donkeys with baskets of bread, wineskins, raisins and figs in a stone courtyard at dawn." },
      ravine: { prompt: "A narrow mountain ravine in the morning, a woman kneeling on the path beside her donkey as a band of armed men comes down the slope toward her; seen from far away, peaceful." },
      road: { prompt: "A quiet hill road in Judah at evening, a single donkey walking slowly homeward, the sky soft gold over the hills; no people close." },
    },
  },
  esther: {
    style: "night",
    fallback: "/images/sleep/jonah-3/s5.jpg",
    sections: ["new:city", "new:garden", "new:gate", "new:gate", "new:gate", "new:court", "new:sleepless", "new:garden", "new:city", "new:city", "new:city"],
    paint: {
      garden: { prompt: "The garden court of a Persian palace at Susa by night, marble pillars hung with white and blue linen on silver rings, gold and silver couches on a mosaic floor, lamps glowing; no people close." },
      gate: { prompt: "An older Jewish man in a plain robe and head covering standing alone at the great gate of a Persian palace at dusk; seen from a distance." },
      court: { prompt: "A young queen in Persian royal robes standing alone in a vast columned inner court, a king far off on his throne holding out a golden scepter toward her; seen from far behind her." },
      sleepless: { prompt: "A Persian king lying awake on his couch at night by lamplight while a scribe sits beside him reading from a scroll." },
      city: { prompt: "The city of Susa at night seen from a hill, lamps glowing in every window and on the flat rooftops, a calm festive stillness." },
    },
  },
  mary: {
    style: "gospel",
    fallback: NIGHT_HILLS,
    sections: ["new:shepherds", "new:temple", "new:nazareth", "new:nazareth", "new:embrace", "new:manger", "new:simeon", "new:boy", "new:nazareth", "new:shepherds"],
    paint: {
      temple: { prompt: "Inside the Jerusalem temple at the hour of incense, an old priest standing before a golden altar with smoke rising, soft light beside the altar; seen from behind." },
      nazareth: { prompt: "A small stone house in Nazareth at dusk, a soft light streaming from its open doorway into the quiet street; no figures." },
      embrace: { prompt: "Two women embracing in the doorway of a stone house in the hill country of Judea at evening, one young, one old, both in plain wool and head coverings; seen from a distance." },
      manger: { prompt: "A wooden manger filled with straw in a lamplit stone room at night, a young mother and father kneeling beside it, seen from behind and a little distance; no halos." },
      shepherds: { prompt: "Shepherds on a hillside near Bethlehem at night, their flock resting around them, looking up at a great golden light in the sky." },
      simeon: { prompt: "An old man in the temple courts holding a small baby in his arms, a young couple standing beside him; seen from behind, soft morning light." },
      boy: { prompt: "A boy of twelve sitting among elderly teachers in a temple colonnade, listening and asking questions; seen from a distance." },
    },
  },
  "woman-at-the-well": {
    style: "gospel",
    fallback: "/images/sleep/john-4/s5.jpg",
    sections: [
      "/images/sleep/john-4/s5.jpg",
      "/images/sleep/john-4/s1.jpg",
      "/images/sleep/john-4/s2.jpg",
      "/images/sleep/john-4/s3.jpg",
      "/images/sleep/john-4/s4.jpg",
      "/images/sleep/john-4/s5.jpg",
      "/images/sleep/john-4/s4.jpg",
    ],
  },
  "mary-magdalene": {
    style: "gospel",
    fallback: "/images/sleep/john-20/s1.jpg",
    sections: [
      "new:magdala",
      "new:magdala",
      "new:road",
      "/images/sleep/john-19/s5.jpg",
      "/images/sleep/john-20/s1.jpg",
      "/images/sleep/john-20/s4.jpg",
      "/images/sleep/john-20/s5.jpg",
      "/images/sleep/john-20/s8.jpg",
      "/images/sleep/john-20/s1.jpg",
    ],
    paint: {
      magdala: { prompt: "The small fishing town of Magdala on the shore of the Sea of Galilee at dawn, boats drawn up on the beach, mist on the water; no people close." },
      road: { prompt: "A group of men and women walking along a road beside the Sea of Galilee at golden evening, carrying bundles; seen from behind and far away." },
    },
  },
  noah: {
    style: "night",
    fallback: ARK_AT_NIGHT,
    sections: [
      "/images/sleep/genesis-7/s3.jpg",
      "/images/sleep/genesis-6/s1.jpg",
      "/images/sleep/genesis-6/s2.jpg",
      "/images/sleep/genesis-7/s1.jpg",
      "/images/sleep/genesis-7/s2.jpg",
      "/images/sleep/genesis-8/s1.jpg",
      "/images/sleep/genesis-8/s2.jpg",
      "/images/sleep/genesis-9/s1.jpg",
      "/images/sleep/genesis-9/s2.jpg",
      "/images/sleep/genesis-8/s1.jpg",
    ],
  },
  joseph: {
    style: "night",
    fallback: "/images/sleep/genesis-41/s4.jpg",
    sections: [
      "/images/sleep/genesis-41/s4.jpg",
      "/images/sleep/genesis-37/s1.jpg",
      "/images/sleep/genesis-37/s2.jpg",
      "/images/sleep/genesis-37/s3.jpg",
      "/images/sleep/genesis-39/s1.jpg",
      "/images/sleep/genesis-41/s2.jpg",
      "/images/sleep/genesis-42/s2.jpg",
      "/images/sleep/genesis-45/s1.jpg",
      "/images/sleep/genesis-41/s4.jpg",
    ],
  },
  moses: {
    style: "night",
    fallback: "/images/sleep/exodus-13/s3.jpg",
    sections: [
      "/images/sleep/exodus-15/s4.jpg",
      "/images/sleep/exodus-2/s1.jpg",
      "/images/sleep/exodus-2/s2.jpg",
      "/images/sleep/exodus-3/s2.jpg",
      "/images/sleep/exodus-5/s1.jpg",
      "/images/sleep/exodus-14/s2.jpg",
      "/images/sleep/exodus-14/s3.jpg",
      "/images/sleep/exodus-15/s2.jpg",
      "/images/sleep/exodus-13/s3.jpg",
    ],
  },
  "david-and-goliath": {
    style: "night",
    fallback: NIGHT_HILLS,
    sections: ["new:shepherd", "new:anoint", "new:armies", "new:armies", "new:stones", "new:giant", "new:shepherd"],
    paint: {
      shepherd: { prompt: "A shepherd boy with a sling at his belt sitting on a rock among his sheep on green hills outside Bethlehem at dusk, a small harp beside him." },
      anoint: { prompt: "An old prophet pouring oil from a horn onto the head of a kneeling shepherd boy in a courtyard at evening, his older brothers standing by; seen from a distance." },
      armies: { prompt: "Two armies camped on two hills facing each other across the Valley of Elah, a stream running between them, tents and banners in the morning light; seen from far off." },
      stones: { prompt: "A boy kneeling at a shallow stream in a valley choosing smooth stones from the water, a shepherd's staff and bag beside him, morning light." },
      giant: { prompt: "A small boy with a sling standing in a wide valley facing a huge bronze-armoured warrior and his shield bearer far off; seen from far behind the boy; no blood, no weapons raised." },
    },
  },
  daniel: {
    style: "night",
    fallback: NIGHT_HILLS,
    sections: ["new:babylon", "new:babylon", "new:court", "new:court", "new:window", "new:den", "new:dawn", "new:court", "new:den"],
    paint: {
      babylon: { prompt: "The city of Babylon beside the Euphrates at evening, its great walls and a stepped tower glowing in the last light, the river calm." },
      court: { prompt: "A king seated on a throne in a columned hall at dusk, signing a scroll while officials bow before him; seen from a distance." },
      window: { prompt: "An old man with a white beard kneeling in prayer at an open upper window at sunset, flat rooftops of an ancient city below." },
      den: { prompt: "A dim stone pit with great lions lying calmly and sleepily around an old man who sits peacefully against the wall, a shaft of soft light from above; nothing frightening." },
      dawn: { prompt: "A king at first light hurrying to a stone opening in the ground and calling down into it, servants with ropes behind him, the sky turning gold." },
    },
  },
  jonah: {
    style: "night",
    fallback: "/images/sleep/jonah-1/s5.jpg",
    sections: [
      "/images/sleep/jonah-1/s5.jpg",
      "/images/sleep/jonah-1/s2.jpg",
      "/images/sleep/jonah-1/s3.jpg",
      "/images/sleep/jonah-1/s6.jpg",
      "/images/sleep/jonah-3/s2.jpg",
      "/images/sleep/jonah-4/s3.jpg",
      "/images/sleep/jonah-4/s5.jpg",
    ],
  },
  "jesus-calms-the-storm": {
    style: "gospel",
    fallback: "/images/sleep/jonah-1/s5.jpg",
    sections: ["new:calm", "new:nets", "new:teaching", "new:storm", "new:calm", "new:calm", "new:calm"],
    paint: {
      nets: { prompt: "Fishermen mending their nets beside wooden boats drawn up on the shore of the Sea of Galilee in the morning, hills across the water." },
      teaching: { prompt: "Jesus seated in a small fishing boat a little way from the shore, teaching a large crowd standing along the beach; seen from a distance.", cast: ["jesus"] },
      storm: { prompt: "A small wooden fishing boat on dark heaving waves of the Sea of Galilee at night, fishermen pulling at ropes, a figure asleep on a cushion in the stern; seen from a distance.", cast: ["jesus"] },
      calm: { prompt: "The Sea of Galilee perfectly calm under the stars after a storm, a small fishing boat resting on glassy water that reflects the sky; seen from a distance." },
    },
  },
  "prodigal-son": {
    style: "gospel",
    fallback: NIGHT_HILLS,
    sections: ["new:feast", "new:crowd", "new:leaving", "new:pigs", "new:running", "new:feast", "new:feast"],
    paint: {
      crowd: {
        prompt:
          "A mixed crowd of ordinary working people, tax collectors and farmhands, sitting on the ground in an open village courtyard at evening, listening intently to someone out of view; seen from behind; no long table.",
      },
      leaving: { prompt: "A young man walking away from a farmhouse down a long road with a bundle on his shoulder, his father standing in the doorway behind; morning light." },
      pigs: { prompt: "A thin young man in torn clothes sitting alone in a muddy field among pigs at dusk, dry famine-struck hills behind." },
      running: { prompt: "An old father running down a long dusty road toward a ragged young man far off in the distance, evening light." },
      feast: { prompt: "A lamplit feast in a farmhouse courtyard at night, music and dancing, and an older son standing outside at the dark edge, watching." },
    },
  },
};

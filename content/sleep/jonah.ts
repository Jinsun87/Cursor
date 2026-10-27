import type { SleepChapterPlan } from "./genesis";

/**
 * Jonah for Walk and Sleep. The storm and the fish are told calmly: the sea is vast and
 * dark rather than violent, and the fish is a great, quiet shape in the deep, never a
 * monster with open jaws. Jonah is a lean, dark-bearded Hebrew prophet in a brown cloak.
 * The ship is an ancient wooden trading vessel, and Nineveh an Assyrian city of brick.
 */
const JONAH = "Jonah, a lean Hebrew prophet with a dark beard, in a rough brown wool cloak";
const SHIP = "an ancient wooden trading ship with one square sail and oars, not a tall ship or galleon";
const NINEVEH = "Nineveh, a vast ancient Assyrian city of mud-brick walls, gates and stepped towers beside the Tigris river";

export const JONAH_PLANS: SleepChapterPlan[] = [
  {
    chapter: 1,
    title: "Jonah Flees from the Lord",
    headings: { 1: "Jonah Flees from the Lord", 4: "The Great Storm", 17: "Jonah Swallowed by a Great Fish" },
    scenes: [
      { from: 1, prompt: `${JONAH}, standing alone on a hilltop in Israel at dusk, looking east toward a dark horizon, wind in his cloak.` },
      { from: 3, prompt: `The harbour of Joppa at evening, ${SHIP} moored at a stone quay, a lone traveller in a brown cloak walking up the gangplank, seen from behind.` },
      { from: 4, prompt: `${SHIP} far out on a dark heaving sea at night under heavy storm clouds, its sail straining, a single lantern swinging on deck, lightning on the horizon.` },
      { from: 5, prompt: `The dim lower hold of ${SHIP} at night, coils of rope and clay jars, ${JONAH} lying asleep on a sack in a pool of lantern light.` },
      { from: 15, prompt: `The sea suddenly calm and silver under breaking clouds at dawn, ${SHIP} resting still on the water, its sail hanging slack; no one in the water.` },
      { from: 17, prompt: "The deep sea at night seen from beneath the surface, moonlight falling in shafts through blue-green water, the vast dark shape of a great fish gliding slowly and peacefully below; no people visible." },
    ],
  },
  {
    chapter: 2,
    title: "Jonah's Prayer",
    headings: { 1: "Jonah's Prayer", 10: "Jonah Cast onto Dry Land" },
    scenes: [
      { from: 1, prompt: "Deep under the sea in darkness, faint light far above, long strands of seaweed swaying slowly, the roots of undersea mountains dark below; no people." },
      { from: 4, prompt: "A faint golden glow far away through deep water, as if from a distant temple, reaching down into the darkness of the sea; no people." },
      { from: 7, prompt: "Shafts of light breaking down through the sea toward the surface at dawn, the water turning from black to deep blue; no people." },
      { from: 10, prompt: `A quiet sandy shore at sunrise, gentle waves washing in, ${JONAH} sitting on the sand at the water's edge, seen from behind, looking at the sunrise.` },
    ],
  },
  {
    chapter: 3,
    title: "Jonah Goes to Nineveh",
    headings: { 1: "Jonah Goes to Nineveh", 5: "Nineveh Repents" },
    scenes: [
      { from: 1, prompt: `${JONAH}, walking a long road across a dry plain toward the distant walls of ${NINEVEH}, at golden evening, seen from behind.` },
      { from: 4, prompt: `A busy street inside ${NINEVEH} at dusk, ${JONAH} standing on a step calling out to the crowd, people in Assyrian robes stopping to listen, seen from a little way off.` },
      { from: 5, prompt: `The streets of ${NINEVEH} at night, people in rough sackcloth sitting quietly in doorways with bowed heads, a few lamps burning, the city hushed.` },
      { from: 6, prompt: "An Assyrian king with a long curled black beard, his royal robe and gold crown set aside, sitting in sackcloth among ashes before an empty throne in a dim hall of carved stone reliefs, seen from a distance." },
      { from: 10, prompt: `Dawn rising over the brick walls and towers of ${NINEVEH}, soft golden light spreading across the quiet city and the river; no people close up.` },
    ],
  },
  {
    chapter: 4,
    title: "Jonah's Anger at God's Mercy",
    headings: { 1: "Jonah's Anger at the Lord's Compassion" },
    scenes: [
      { from: 1, prompt: `${JONAH}, sitting alone with his head in his hands on a dry hillside east of the city at evening, the walls of Nineveh glowing in the distance.` },
      { from: 5, prompt: `A small shelter of branches on a dry hillside, ${JONAH} sitting in its shade watching the distant city at sunset.` },
      { from: 6, prompt: "A leafy green vine with broad leaves grown over a little shelter of branches on a dry hillside, cool shade beneath it, the city far off in golden light; no people visible." },
      { from: 7, prompt: "The same vine withered and brown over the little shelter at sunrise, a hot wind blowing dust across the hillside, the sun hard and white; no people visible." },
      { from: 10, prompt: `The great city of ${NINEVEH} at night seen from the hills, thousands of small lamps glowing in its windows, cattle resting in the fields outside its walls, a vast starry sky above.` },
    ],
  },
];

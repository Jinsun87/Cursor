import type { SleepChapterPlan } from "./genesis";

/**
 * Proverbs for Walk and Sleep. Chapters 1–9 are a father's long talks with his son, so
 * they are painted as a grey-bearded father and a young man by lamplight, and as the
 * paths, gates and houses the talks describe. From chapter 10 the book is short sayings,
 * so each chapter's paintings follow a few of its pictures (a strong tower, apples of
 * gold, iron sharpening iron). Wisdom and Folly are never painted as women: Wisdom is warm
 * light at the city gate or in a house of seven pillars, Folly an empty doorway in the
 * dark. The adulteress chapters stay on streets, windows and lamps, never on a woman.
 * God is shown only as light.
 */
const FATHER = "a grey-bearded Hebrew father in a brown wool robe";
const SON = "a young Hebrew man with a short dark beard in a plain undyed wool tunic";
const CITY = "an ancient Israelite hill city of pale limestone houses with flat roofs";
const GATE = "the great stone gate of an ancient Israelite city, with stone benches in its passage";

type Row = [chapter: number, title: string, headings: Record<number, string>, scenes: [from: number, prompt: string][]];

const ROWS: Row[] = [
  // The father's instruction (1–9)
  [1, "The Beginning of Knowledge", { 1: "The Purpose of Proverbs", 8: "The Enticement of Sinners", 20: "Wisdom Calls Aloud" }, [
    [1, `A rolled scroll and an oil lamp on a cedar table in a palace room in Jerusalem at night, a window open to the stars; no people.`],
    [8, `${FATHER} and ${SON} sitting together by an oil lamp in a courtyard at evening, the father speaking, the son listening, seen from a little way off.`],
    [10, `A dark rocky road outside ${CITY} at night, a few shadowy men waiting among the rocks far off, a bird net strung between two bushes in the foreground.`],
    [20, `${GATE} at dusk, a warm golden light glowing in its passage as if someone were calling from it, the square empty, the first lamps lit in the houses.`],
    [33, `A small stone house at night with its door shut and a lamp in the window, safe and quiet beneath the stars; no people visible.`],
  ]],
  [2, "The Value of Wisdom", { 1: "The Value of Wisdom", 12: "Wisdom Delivers from Evil", 20: "The Path of the Good" }, [
    [1, `${SON} kneeling in the entrance of a rocky hillside mine by lamplight, holding up a lamp to a vein of silver glinting in the stone.`],
    [6, "A plain bronze shield leaning against a rock on a quiet mountain path at dawn, light breaking over the hills; no people."],
    [12, "Two paths parting at a crossroads at dusk: one winding down into dark twisted ravines, the other running straight up a hillside into the sunset; no people."],
    [20, "Wide green fields and olive groves in a peaceful valley at golden evening, a village with its lamps being lit; no people close up."],
  ]],
  [3, "Trust in the Lord", { 1: "Trust in the Lord with All Your Heart", 13: "The Blessings of Wisdom", 21: "Sleep Will Be Sweet", 27: "Do Not Withhold Good" }, [
    [1, `${FATHER} writing on a small wax tablet by lamplight while ${SON} sits beside him, a quiet stone room at night.`],
    [5, "A straight path running through a valley of wheat fields toward a distant hill at sunrise, mist lifting; no people."],
    [9, "A threshing floor heaped with golden grain and stone vats brimming with new wine at harvest evening; no people."],
    [13, "A great tree of life on a hilltop at dusk, its branches full of fruit, a warm light glowing among its leaves, stars appearing above."],
    [19, "The earth seen at its making: deep waters, high clouds dropping dew on the hills at first light; no people."],
    [24, "A simple bed in a quiet stone room at night, a lamp burning low, the window open to a sky full of stars, perfect peace; no people."],
    [27, `A doorway of a stone house at evening, a loaf of bread and a jar of oil being passed to a neighbour; only hands visible.`],
  ]],
  [4, "A Father's Instruction", { 1: "A Father's Instruction", 10: "The Two Paths", 20: "Guard Your Heart" }, [
    [1, `${FATHER} with an arm around ${SON}'s shoulders, both seen from behind at the edge of a vineyard at golden evening, looking out over the valley.`],
    [10, "A straight level road through quiet hills, a traveller's staff resting by a milestone; no people."],
    [14, "A dark crooked alley between houses at night, a single lamp guttering; no people."],
    [18, "The first gleam of dawn spreading over the hills of Judah, the path below shining brighter and brighter; no people."],
    [23, "A clear spring welling up between rocks in a quiet garden at evening, water spilling over into a stream; no people."],
  ]],
  [5, "Drink from Your Own Well", { 1: "Warning against Adultery", 15: "Drink from Your Own Well" }, [
    [1, `${FATHER} and ${SON} walking slowly on a road outside ${CITY} at dusk, seen from behind.`],
    [3, "A narrow street at night with a closed door at its end, a jar of honey and a sharp knife on a ledge in the lamplight; no people."],
    [7, `${SON} walking away down a lit road toward home at night, seen from behind, a dark side lane left behind him.`],
    [15, "A stone well in a family courtyard at evening, a bucket resting on its rim, water glinting, a vine over the wall; no people."],
    [18, "A doe and her fawn drinking at a quiet spring under trees at twilight."],
    [21, "A wide night sky full of stars above sleeping hills and paths; no people."],
  ]],
  [6, "Go to the Ant", { 1: "Warnings against Folly", 6: "Go to the Ant", 16: "Six Things the Lord Hates", 20: "A Lamp and a Light" }, [
    [1, "A gazelle leaping free across a moonlit hillside, a hunter's empty snare left behind in the grass."],
    [6, "A line of ants carrying seeds across a sunlit stone at harvest time, golden wheat stalks towering above them, close up."],
    [9, "A neglected bed in a dim room long after sunrise, light streaming through the shutters onto an untouched loom; no people."],
    [16, "A dark storm passing over a quiet valley at night, lightning far off; no people."],
    [20, `${FATHER} placing an oil lamp in the hands of ${SON} in a dark doorway, the lamp lighting both faces.`],
    [27, "Glowing coals in a clay brazier on a stone floor at night, sparks rising into the dark; no people."],
  ]],
  [7, "The Window and the Street", { 1: "Keep My Words", 6: "From My Window", 24: "Do Not Stray into Her Paths" }, [
    [1, `${FATHER} tying a thin cord around ${SON}'s finger in lamplight, both seated at a wooden table.`],
    [6, `The latticed window of an upper room at twilight, looking down on a narrow street of ${CITY}; no people in the room.`],
    [8, `A narrow street at twilight from above, a lone young man in a pale tunic small in the distance, walking toward a corner where a lamp hangs over a doorway.`],
    [16, "Fine coloured linen and jars of spices on a table in a dim lamplit room, curtains drawn; no people."],
    [22, "A deer stepping toward a hidden snare among the trees at dusk."],
    [24, "A dark road leading down into deep shadow between cliffs at night, a broken lamp on the ground; no people."],
  ]],
  [8, "Wisdom's Call", { 1: "Wisdom's Call", 12: "By Me Kings Reign", 22: "Wisdom at Creation", 32: "Blessed Are Those Who Listen" }, [
    [1, `A crossroads on the heights above ${CITY} at dusk, a warm golden light standing where the roads meet; no people.`],
    [10, "Silver coins, gold and rubies scattered on a cedar table beside an open scroll, the scroll glowing more brightly than the treasure in the lamplight; no people."],
    [15, "An empty throne of carved cedar in a quiet palace hall at evening, a single shaft of light falling across it; no people."],
    [22, "The beginning of the world: dark waters under a vast sky before the mountains, a soft golden light moving over the deep; no people."],
    [25, "Mountains rising from the sea at the first dawn, clouds forming above them, springs breaking out on their slopes; no people."],
    [29, "The sea meeting the shore beneath steep cliffs at night, waves stopping at the sand under a full moon; no people."],
    [34, `A house doorway at dawn with its door posts lit gold, ${SON} sitting on the step waiting, seen from behind.`],
  ]],
  [9, "Wisdom's Feast", { 1: "Wisdom's Feast", 7: "The Fear of the Lord", 13: "Folly's Invitation" }, [
    [1, `A noble house of seven carved stone pillars on the heights of ${CITY} at evening, its doors open and golden light pouring out; no people.`],
    [2, "A long table inside a pillared hall set with bread, roast meat and jars of mixed wine by lamplight, waiting for guests; no people."],
    [7, `${FATHER} and ${SON} studying an open scroll together by lamplight, their heads bent close.`],
    [13, "A dark open doorway at the top of a city street at night, a single lamp on the seat beside it and shadow inside; no people."],
    [17, "A stone well at night with a broken rope and an overturned bucket, deep darkness below; no people."],
  ]],
  // The proverbs of Solomon (10–22:16)
  [10, "The Proverbs of Solomon", { 1: "The Proverbs of Solomon", 11: "A Fountain of Life", 22: "The Blessing of the Lord" }, [
    [1, `${FATHER} smiling as ${SON} brings in an armful of harvest sheaves at sunset, a stone farmhouse behind.`],
    [4, "Reapers' sickles and bound sheaves of wheat in a golden field at harvest evening, the work nearly done; no people close up."],
    [11, "A fountain of clear water spilling from a rock into a pool on a dry hillside at dusk; no people."],
    [20, "A silver cup gleaming on a wooden table in lamplight beside a loaf of bread; no people."],
    [25, "A whirlwind passing away across a dark plain while a stone house stands firm on its rock, the sky clearing; no people."],
  ]],
  [11, "A Generous Soul", { 1: "Honest Scales", 9: "The City Rejoices", 16: "A Generous Soul", 28: "Like Green Foliage" }, [
    [1, "A merchant's balance scales with bronze weights on a cloth in the market at dusk, perfectly level; no people."],
    [10, `The lit streets of ${CITY} on a festival evening, small figures gathering in the squares with lamps.`],
    [14, "A council of elders sitting on the stone benches of a city gate at evening, seen from a distance."],
    [24, "A farmer scattering seed across a ploughed field at dawn, seen from far away, the seed catching the light."],
    [28, "A tree in full green leaf beside a stream at golden evening, birds resting in its branches; no people."],
  ]],
  [12, "The Root of the Righteous", { 1: "Whoever Loves Discipline", 11: "Work Your Land", 17: "Truthful Lips", 25: "A Good Word" }, [
    [1, "A great old olive tree with deep roots gripping the rock on a windy hillside at dusk, standing firm; no people."],
    [10, "An ox resting in clean straw in a lamplit stable at night, a full manger beside it; no people."],
    [11, "A man ploughing a field with an ox at sunrise, seen from far away, birds following the furrow."],
    [18, "A clay jar of healing oil and clean linen bandages on a table by lamplight; only hands visible, gently binding a wound."],
    [25, `${FATHER} with a hand on ${SON}'s shoulder, speaking quietly by a fire at night, the young man's face easing.`],
  ]],
  [13, "A Tree of Life", { 1: "A Wise Son Heeds", 9: "The Light of the Righteous", 12: "Hope Fulfilled", 20: "Walk with the Wise" }, [
    [1, `${SON} listening to ${FATHER} at a courtyard table at evening, a lamp between them.`],
    [9, "A bright lamp shining in a window of a dark village at night, other windows dark; no people."],
    [12, "A young fruit tree in blossom on a hillside at sunrise after a long winter, its first fruit forming; no people."],
    [14, "A fountain spilling over the lip of a stone basin into a garden at dusk; no people."],
    [20, "Two travellers walking together on a road through hills at golden evening, seen from behind."],
    [22, "An old man watching his grandchildren play in a courtyard under a fig tree at sunset, seen from a little way off."],
  ]],
  [14, "A Tranquil Heart", { 1: "The Wise Woman Builds Her House", 12: "A Way That Seems Right", 26: "A Fountain of Life", 29: "A Tranquil Heart" }, [
    [1, "A small stone house with fresh plaster and a new wooden door at evening, a lamp lit inside, a loom by the window; no people visible."],
    [4, "A pair of oxen in a stable at evening beside a manger heaped with hay, sacks of grain stacked behind; no people."],
    [12, "A broad smooth road leading toward a cliff edge in the dark, a narrow path climbing up toward the light; no people."],
    [26, "A strong stone refuge on a hill at night, its gate open and a lamp burning inside; no people."],
    [30, "A perfectly still lake at dusk reflecting the hills and the first stars; no people."],
  ]],
  [15, "A Gentle Answer", { 1: "A Gentle Answer", 13: "A Cheerful Heart", 16: "Better a Little", 22: "A Timely Word" }, [
    [1, "Soft rain falling on a dry field at evening, the dust settling, the air cool and calm; no people."],
    [3, "A vast starlit sky over a sleeping land, a gentle light watching over every valley; no people."],
    [13, "A family's faces lit warmly by a fire on a winter evening in a simple stone room, seen from a little way off."],
    [17, "A simple meal of vegetables and bread on a low table in a humble room by lamplight, cushions around it; no people."],
    [24, "A path winding upward through the hills toward a sunlit summit at dawn; no people."],
    [30, "A messenger on a hilltop at sunrise, arms raised, seen far off against the light."],
  ]],
  [16, "The Lord Directs His Steps", { 1: "The Lord Weighs the Heart", 10: "A King's Delight", 16: "Better Than Gold", 25: "Pleasant Words" }, [
    [1, "A potter's hands shaping a clay vessel on a turning wheel by lamplight; only hands visible."],
    [9, "Footprints leading along a sandy path across a moonlit desert toward a distant oasis; no people."],
    [11, "Honest bronze weights in a leather bag beside a balance on a plain wooden table; no people."],
    [15, "A spring rain cloud over green hills at evening, the sun breaking through behind it; no people."],
    [24, "A honeycomb dripping golden honey on a wooden board in warm lamplight; no people."],
    [31, "An old man with a long white beard sitting peacefully at the city gate at sunset, seen from a little way off."],
  ]],
  [17, "A Friend Loves at All Times", { 1: "Better a Dry Morsel", 9: "Love Covers an Offense", 17: "A Friend Loves", 22: "A Joyful Heart" }, [
    [1, "A dry crust of bread and a cup of water on a bare wooden table by a window at evening, quiet and peaceful; no people."],
    [3, "A clay crucible of glowing silver in a refiner's furnace at night, sparks rising; no people."],
    [6, `An old grandfather with a small grandchild on his knee by a fire at night, seen from a little way off.`],
    [14, "A small trickle of water breaking through a crack in a stone dam at dusk; no people."],
    [17, "Two friends walking together through a storm at night, one holding a cloak over the other, seen from behind."],
    [27, "A calm still pool among rocks at twilight, reflecting the first star; no people."],
  ]],
  [18, "A Strong Tower", { 1: "Deep Waters", 10: "The Name of the Lord Is a Strong Tower", 16: "A Gift Opens Doors", 20: "Life and Death in the Tongue" }, [
    [1, "A bubbling brook running over smooth stones in a wooded valley at dusk; no people."],
    [10, "A tall strong stone tower on a hilltop at night, its door open and a lamp shining from its top window, a few small figures running up the path toward it."],
    [11, "High city walls at sunset, seen from far away, beginning to look like a painted backdrop in the haze."],
    [19, "A fortified city with barred gates on a hill under heavy cloud at evening; no people."],
    [24, "Two friends sitting close together by a campfire under the stars, seen from behind."],
  ]],
  [19, "The Purpose of the Lord Prevails", { 1: "Better a Poor Man", 11: "Overlook an Offense", 17: "Kindness to the Poor", 20: "Listen to Counsel" }, [
    [1, "A poor shepherd walking a mountain path at dusk with his flock, seen from far behind."],
    [12, "Morning dew glistening on long grass in a meadow at sunrise; no people."],
    [14, "A simple home in the evening, a woman's hands setting bread on the table beside a lamp; only hands visible."],
    [17, "A hand placing a loaf of bread into the hands of a beggar at a city gate at dusk; only hands visible."],
    [21, "A wide sky at sunrise over many winding paths that all lead into the light; no people."],
  ]],
  [20, "The Lamp of the Lord", { 1: "Wine Is a Mocker", 5: "Deep Waters", 12: "Ears That Hear", 22: "Wait on the Lord", 27: "The Lamp of the Lord" }, [
    [1, "A spilled cup of wine on a tavern table at night, the lamp burning low; no people."],
    [4, "A field of weeds and hard ground at harvest time under a grey sky, an unused plough rusting at its edge; no people."],
    [5, "A deep well in a courtyard at evening, a bucket on a long rope being drawn up full of water; only hands visible."],
    [13, "Dawn light falling through an open window onto a table with bread and fruit; no people."],
    [22, "A man sitting quietly on a hillside at evening, seen from behind, watching the sun go down, his hands open on his knees."],
    [27, "A single clay oil lamp burning in a dark room, its light reaching into every corner; no people."],
  ]],
  [21, "Victory Is of the Lord", { 1: "The King's Heart", 9: "A Corner of the Roof", 20: "Treasure in the House of the Wise", 30: "Victory Belongs to the Lord" }, [
    [1, "Water flowing through stone irrigation channels between green fields at dawn, turning where it is guided; no people."],
    [3, "A small altar of stones on a hillside at sunset, thin smoke rising straight into the still air; no people."],
    [9, "The corner of a flat roof at night, a woven mat and a blanket laid out under the stars; no people."],
    [20, "Jars of oil and baskets of grain in the lamplit storeroom of a modest house; no people."],
    [31, "A warhorse standing saddled in a stable at dawn, light breaking through the door; no people."],
  ]],
  [22, "A Good Name", { 1: "A Good Name", 6: "Train Up a Child", 17: "Sayings of the Wise", 28: "The Ancient Boundary Stone" }, [
    [1, "A family's name carved on the lintel of a stone house at evening, a lamp lit in the doorway; no people."],
    [6, `${FATHER} walking a hillside path with a small boy at his side, holding his hand, seen from behind at sunset.`],
    [17, `${FATHER} reading aloud from a scroll to ${SON} beneath an olive tree at golden evening.`],
    [22, "The gate of a city at dusk, a poor man sitting on a bench in the passage, a lamp lit beside him; seen from a distance."],
    [28, "An old boundary stone half covered with moss between two fields at sunset; no people."],
    [29, "A craftsman's workshop by lamplight, finely carved cedar and tools laid neatly on the bench; no people."],
  ]],
  // Sayings of the wise (22:17–24:34)
  [23, "Do Not Envy Sinners", { 1: "At the Ruler's Table", 4: "Riches Take Wing", 12: "Apply Your Heart", 19: "Listen, My Son", 29: "Wine Bites Like a Snake" }, [
    [1, "A long banquet table in a palace hall laden with rich food and silver dishes by lamplight, empty chairs; no people."],
    [4, "An eagle lifting into the sky from a pile of gold coins on a cliff ledge at sunset."],
    [10, "An old boundary stone at the edge of a small field at dusk, a widow's simple house beyond; no people."],
    [17, "A hillside road at dawn, the sun just rising ahead; no people."],
    [22, `${SON} gently helping his white-haired mother across a courtyard at evening, seen from a little way off.`],
    [31, "A cup of red wine sparkling on a table in the dark beside a coiled grey snake; no people."],
    [34, "A ship's mast swaying on a dark rolling sea at night; no people."],
  ]],
  [24, "By Wisdom a House Is Built", { 1: "Do Not Envy the Wicked", 3: "By Wisdom a House Is Built", 13: "Wisdom Is Sweet", 23: "Further Sayings of the Wise", 30: "The Field of the Slacker" }, [
    [1, "A well-built stone house at evening, its rooms glowing with lamplight, rugs, jars and treasures visible through the doorway; no people."],
    [13, "A honeycomb on a plate beside an open scroll by lamplight; no people."],
    [16, "A man rising to his feet on a rocky path after a fall, seen from far away at dawn."],
    [20, "A lamp guttering out in a dark empty room; no people."],
    [27, "A farmer's ploughed and sown field at evening, the foundations of a house marked out beside it; no people."],
    [30, "A neglected vineyard overgrown with thorns and thistles at dusk, its stone wall broken down; no people."],
  ]],
  // More proverbs of Solomon, copied by Hezekiah's men (25–29)
  [25, "Apples of Gold", { 1: "More Proverbs of Solomon", 6: "Do Not Exalt Yourself", 11: "A Word Fitly Spoken", 21: "If Your Enemy Is Hungry" }, [
    [1, "Scribes' desks in a lamplit palace room in Jerusalem, scrolls being copied, ink pots and reed pens; the scribes seen from behind."],
    [4, "A silversmith's furnace at night, dross skimmed from shining molten silver; only hands visible."],
    [11, "Golden apples set in a delicate silver dish on a table in soft lamplight; no people."],
    [13, "Snow on the mountains of Lebanon seen across a golden harvest field at evening; no people."],
    [21, "A cup of water and a loaf of bread set down on a wall beside a dusty road at dusk; no people."],
    [25, "Cold clear water poured from a clay jar into a cup, a weary traveller's dusty sandals beside it at evening; only hands visible."],
    [28, "A city with its walls broken down at twilight, wind blowing through the gaps; no people."],
  ]],
  [26, "Like Snow in Summer", { 1: "Answering a Fool", 13: "The Slacker", 17: "Meddling and Gossip", 23: "A Hidden Heart" }, [
    [1, "A strange light snowfall over a sunlit summer field of grain at evening; no people."],
    [2, "A sparrow and a swallow darting through the evening sky over rooftops, never settling."],
    [14, "A wooden door turning slowly on its hinges in a dim room, morning light streaming in; no people."],
    [20, "The last embers of a fire dying out in a stone hearth at night, cold and quiet; no people."],
    [23, "A plain clay pot coated with a shining glaze on a shelf by lamplight; no people."],
    [27, "A pit dug in a dark road with a stone rolled back beside it at dusk; no people."],
  ]],
  [27, "Iron Sharpens Iron", { 1: "Do Not Boast about Tomorrow", 5: "Faithful Wounds of a Friend", 17: "Iron Sharpens Iron", 23: "Know Your Flocks" }, [
    [1, "A road disappearing into morning mist over the hills, the way ahead unknown; no people."],
    [8, "An empty bird's nest in an olive tree at dusk, a small bird far off in the sky."],
    [9, "Fragrant oil and incense burning in a small clay bowl, soft smoke curling in lamplight; no people."],
    [17, "Two iron blades crossed against a grindstone in a smithy, sparks flying in the dark; only hands visible."],
    [19, "A still pool reflecting a man's face as he leans over it at dusk, seen from behind."],
    [23, "A shepherd counting his sheep into a stone fold at sunset, lambs and goats among them, seen from far off."],
  ]],
  [28, "Bold as a Lion", { 1: "The Righteous Are Bold", 6: "Better a Poor Man", 13: "Confess and Find Mercy", 25: "Trust in the Lord" }, [
    [1, "A lion standing calm and unafraid on a rocky ridge at dawn."],
    [3, "A heavy rain flattening a field of young grain under dark clouds; no people."],
    [6, "A poor farmer leading a donkey along a quiet road at golden evening, seen from behind."],
    [13, "A man kneeling alone on a hillside at night with his face lifted toward the first light of dawn, seen from behind."],
    [19, "A small field of ripening barley beside a farmhouse at evening, a loaf of bread cooling on the wall; no people."],
    [25, "A peaceful house on a hill at night beneath a great starry sky; no people visible."],
  ]],
  [29, "Where There Is No Vision", { 1: "When the Righteous Flourish", 13: "A King Who Judges Fairly", 18: "Where There Is No Vision", 25: "The Fear of Man Is a Snare" }, [
    [1, `The streets of ${CITY} on a joyful evening, lamps hung across the lanes, small figures gathered with music in the square.`],
    [8, `${GATE} at dusk, a wise elder calmly raising his hand before an angry crowd, seen from a distance.`],
    [14, "An empty royal throne of plain cedar beside a scroll of the law in a quiet hall at evening; no people."],
    [18, "A prophet on a hilltop at dawn gazing toward a distant light, seen from far behind."],
    [25, "A high rocky refuge above the clouds at sunrise, safe and still; no people."],
  ]],
  // The words of Agur and of King Lemuel (30–31)
  [30, "The Words of Agur", { 1: "The Words of Agur", 7: "Two Things I Ask", 15: "Things Never Satisfied", 18: "Things Too Wonderful", 24: "Four Small Things" }, [
    [1, "A lone old man sitting on a rock in the wilderness at night, gazing up at the vast starry sky, seen from behind."],
    [4, "Wind sweeping across the face of the waters under a great sky at dawn, clouds gathering like a garment; no people."],
    [7, "A simple loaf of daily bread on a cloth beside a cup of water in morning light; no people."],
    [16, "Dry cracked ground drinking in rain at dusk while a fire burns on a distant hill; no people."],
    [19, "An eagle soaring high above a cliff over the sea at sunset, a ship far out on the water below."],
    [25, "Ants carrying grain, a rock badger peering from a crag, and locusts in formation over a field, in warm golden evening light."],
    [28, "A small lizard resting on the carved stone wall of a palace in the moonlight."],
    [30, "A lion walking slowly across a moonlit plain."],
  ]],
  [31, "The Wife of Noble Character", { 1: "The Words of King Lemuel", 10: "The Wife of Noble Character", 25: "Strength and Honor Are Her Clothing" }, [
    [1, "A queen mother in a simple dark mantle speaking to a young king by lamplight in a palace room, both seen from a distance."],
    [8, "A young king opening the palace doors at evening to a poor widow and a child waiting outside, seen from a distance."],
    [10, "A modest Israelite house at night, a lamp burning in its window and a loom inside; no people visible."],
    [13, "A woman's hands spinning wool on a distaff and spindle by lamplight before dawn; only hands visible."],
    [16, "A newly planted vineyard on a hillside at sunrise, young vines in neat rows; no people close up."],
    [20, "A woman in a plain headscarf giving bread at her doorway to a poor family at dusk, seen from a little way off."],
    [23, `${GATE} at evening, elders sitting together on the stone benches, seen from a distance.`],
    [28, "A family gathered around a lamplit table in the evening, children and a husband turned toward a mother, all seen from behind and a little way off."],
  ]],
];

export const PROVERBS_PLANS: SleepChapterPlan[] = ROWS.map(([chapter, title, headings, scenes]) => ({
  chapter,
  title,
  headings,
  scenes: scenes.map(([from, prompt]) => ({ from, prompt })),
}));

import type { SleepChapterPlan } from "./genesis";

/**
 * Exodus for Walk and Sleep: a title, section headings and the scenes painted for each
 * chapter (each scene shows from its verse until the next). Kept gentle for the night:
 * deaths and violence are never shown, only what surrounds them; God appears only as fire,
 * cloud and light. Moses is an old white-bearded shepherd from chapter 3 on.
 */
const MOSES = "Moses, an old man with a long white beard and a weathered face, in rough brown wool, holding a shepherd's staff";
const AARON = "Aaron, an elderly man with a grey beard in a plain woven robe";
/** Pharaoh must read as an Egyptian king, never as a robed, long-haired figure on a throne. */
const PHARAOH =
  "Pharaoh, a clean-shaven Egyptian king with kohl-lined eyes, wearing a striped blue-and-gold nemes headdress, a broad gold collar and a pleated linen kilt, holding a crook and flail";

export const EXODUS_PLANS: SleepChapterPlan[] = [
  {
    chapter: 1,
    title: "Israel Oppressed in Egypt",
    headings: { 1: "The Israelites Multiply in Egypt", 8: "Oppression by a New Pharaoh", 15: "The Hebrew Midwives" },
    scenes: [
      { from: 1, prompt: "A fertile village of Hebrew families in the land of Goshen beside the Nile at evening, flocks, simple mud-brick houses, many children playing in the distance." },
      { from: 11, prompt: "Hebrew slaves making mud bricks under a hot sky at dusk, rows of drying bricks, Egyptian taskmasters with rods watching from a ramp, the walls of a store city rising behind." },
      { from: 15, prompt: `Two Hebrew midwives in plain dark dresses standing calmly and respectfully before ${PHARAOH}, seated on a gilded Egyptian throne in a torchlit hall of painted columns.` },
      { from: 20, prompt: "A quiet Hebrew house at night by the Nile, warm lamplight in the doorway, a family's sandals at the threshold; no people visible." },
    ],
  },
  {
    chapter: 2,
    title: "The Birth of Moses",
    headings: { 1: "The Birth of Moses", 11: "Moses Flees to Midian", 23: "God Hears Israel's Groaning" },
    scenes: [
      { from: 1, prompt: "A small woven basket of papyrus coated with pitch resting among tall reeds at the edge of the Nile at dawn, a young girl watching from far off behind the reeds." },
      { from: 5, prompt: "An Egyptian princess with a black braided wig, a gold diadem and broad gold collar, in a pleated linen dress, bending at the edge of the Nile in early morning light to lift a small woven basket from the reeds, two Egyptian maidservants in linen behind her, the palace across the river." },
      { from: 15, prompt: "A clean-shaven man in a plain Egyptian kilt and travelling cloak sitting alone beside a stone well in the desert of Midian at evening, sheep approaching." },
      { from: 23, prompt: "Hebrew slaves resting at night after a day of labour beside the brick kilns, their faces turned up to a sky full of stars, a sense of prayer." },
    ],
  },
  {
    chapter: 3,
    title: "Moses and the Burning Bush",
    headings: { 1: "Moses and the Burning Bush", 13: "I AM WHO I AM" },
    scenes: [
      { from: 1, prompt: `${MOSES}, leading a flock of sheep and goats up the rocky slopes of a desert mountain at dawn.` },
      { from: 2, prompt: "A thorn bush on a desert mountainside blazing with fire yet not burning up, its branches whole within the flames, brilliant golden light against the dark rocks; no people." },
      { from: 5, prompt: `${MOSES}, seen from behind, kneeling with his sandals set aside on the bare ground before a blazing bush, hiding his face.` },
      { from: 16, prompt: "Grey-bearded elders of Israel gathered in a circle in a dim mud-brick room by lamplight, listening intently." },
    ],
  },
  {
    chapter: 4,
    title: "Signs for Moses",
    headings: { 1: "Signs for Moses", 18: "Moses Returns to Egypt", 27: "Moses Meets Aaron" },
    scenes: [
      { from: 1, prompt: "A shepherd's wooden staff lying on desert sand at dusk, its shadow curling like a serpent across the stones; no people." },
      { from: 18, prompt: "An old white-bearded man setting out with his family on a donkey across the desert toward Egypt at sunrise, staff in hand." },
      { from: 27, prompt: `${MOSES}, embracing ${AARON}, on a mountainside in the wilderness at golden evening.` },
      { from: 29, prompt: "The elders of Israel bowing their heads in worship in a lamplit gathering place at night, two old bearded brothers standing before them." },
    ],
  },
  {
    chapter: 5,
    title: "Bricks Without Straw",
    headings: { 1: "Moses Confronts Pharaoh", 6: "Bricks Without Straw" },
    scenes: [
      { from: 1, prompt: `${MOSES}, and ${AARON}, standing before ${PHARAOH}, seated on a gilded Egyptian throne in a vast hall of painted columns, guards at the sides.` },
      { from: 6, prompt: "Hebrew labourers scattered across harvested fields at dawn gathering stubble for straw, bundles on their backs, the brick yards far behind." },
      { from: 14, prompt: "Weary Hebrew foremen sitting on a low wall outside the brick yards at dusk, heads in their hands, piles of unfinished bricks around them." },
    ],
  },
  {
    chapter: 6,
    title: "God Promises Deliverance",
    headings: { 1: "God Promises Deliverance", 14: "The Genealogy of Moses and Aaron", 28: "Moses and Aaron Before Pharaoh Again" },
    scenes: [
      { from: 1, prompt: "A night sky full of stars over the land of Goshen, a single old shepherd standing on a rise looking up, a quiet promise in the stillness." },
      { from: 9, prompt: "Hebrew families too weary to listen, sitting in silence outside their houses at evening after hard labour, lamps just being lit." },
      { from: 14, prompt: "An old scroll of family names unrolled on a wooden table beside a clay lamp at night; no people." },
      { from: 28, prompt: `${MOSES}, standing alone on the bank of the Nile at dawn, looking toward Pharaoh's palace across the water.` },
    ],
  },
  {
    chapter: 7,
    title: "The Nile Turns to Blood",
    headings: { 1: "Moses and Aaron Before Pharaoh", 8: "Aaron's Staff Becomes a Serpent", 14: "The First Plague: Blood" },
    scenes: [
      { from: 1, prompt: "Pharaoh's palace beside the Nile at dusk, torches burning on its terraces, palm trees and the dark river below; no people close up." },
      { from: 8, prompt: `${AARON}, standing in a torchlit Egyptian throne hall as a wooden staff lies on the stone floor, ${PHARAOH} watching from his throne, shaven-headed Egyptian magicians at his side.` },
      { from: 14, prompt: `${MOSES}, standing on the riverbank at morning with his staff raised over the Nile.` },
      { from: 20, prompt: "The Nile at dusk running deep red under a heavy sky, reeds along the bank, empty clay water jars on the shore; no people." },
    ],
  },
  {
    chapter: 8,
    title: "Frogs, Gnats and Flies",
    headings: { 1: "The Second Plague: Frogs", 16: "The Third Plague: Gnats", 20: "The Fourth Plague: Flies" },
    scenes: [
      { from: 1, prompt: "Countless frogs covering the steps and courtyards of an Egyptian palace by moonlight, frogs on the stone lions and in the fountains; no people." },
      { from: 16, prompt: "A cloud of tiny gnats rising like dust over an Egyptian village at dusk, animals in their pens shaking their heads; no people close up." },
      { from: 20, prompt: "Dense swarms of flies over the houses of an Egyptian city in the heat of day, while far off across the fields the Hebrew homes of Goshen stand clear and still." },
      { from: 25, prompt: `${MOSES}, standing before ${PHARAOH}, weary on his throne in a dim hall at evening, his hand raised as if to bargain.` },
    ],
  },
  {
    chapter: 9,
    title: "Livestock, Boils and Hail",
    headings: { 1: "The Fifth Plague: Livestock", 8: "The Sixth Plague: Boils", 13: "The Seventh Plague: Hail" },
    scenes: [
      { from: 1, prompt: "Empty Egyptian pastures at dusk with silent stables and an abandoned plough, while across the river the flocks of Goshen graze peacefully." },
      { from: 8, prompt: "Two old men throwing handfuls of soot from a furnace up into the evening sky, the ash drifting like grey snow over an Egyptian city." },
      { from: 22, prompt: "A violent storm of hail and lightning over Egyptian fields at night, flax and barley flattened, fire running along the ground; no people." },
      { from: 26, prompt: "The land of Goshen under a calm clear evening sky with no hail, Hebrew homes and flocks at peace, storm clouds raging far off over Egypt." },
    ],
  },
  {
    chapter: 10,
    title: "Locusts and Darkness",
    headings: { 1: "The Eighth Plague: Locusts", 21: "The Ninth Plague: Darkness" },
    scenes: [
      { from: 1, prompt: `Shaven-headed Egyptian officials in linen kilts pleading with ${PHARAOH} in a torchlit hall, gesturing toward the ruined land beyond the windows.` },
      { from: 12, prompt: "A vast dark swarm of locusts sweeping in on the east wind over green Egyptian fields at evening, covering the sky; no people." },
      { from: 19, prompt: "A strong west wind driving the last locusts out over the Red Sea at dawn, the stripped fields of Egypt bare behind." },
      { from: 21, prompt: "Thick darkness over an Egyptian city, nothing visible but faint shapes, while beyond it the houses of the Hebrews in Goshen glow with warm lamplight." },
    ],
  },
  {
    chapter: 11,
    title: "The Final Plague Announced",
    headings: { 1: "The Plague on the Firstborn Announced" },
    scenes: [
      { from: 1, prompt: "Hebrew neighbours receiving gifts of silver and gold jewellery from Egyptian households at a doorway at dusk, a quiet sense of leaving." },
      { from: 4, prompt: `${MOSES}, seen from behind, walking out of a torchlit Egyptian throne hall in anger, staff in hand, ${PHARAOH} small on his throne in the distance.` },
      { from: 9, prompt: "The silent palace of Pharaoh at night under a heavy, starless sky, a single torch burning at its gate; no people." },
    ],
  },
  {
    chapter: 12,
    title: "The Passover",
    headings: { 1: "The First Passover", 29: "The Tenth Plague: Death of the Firstborn", 31: "The Exodus Begins", 43: "Restrictions on the Passover" },
    scenes: [
      { from: 1, prompt: "A spring evening over the land of Goshen, a new moon rising, Hebrew families gathering their flocks; a solemn stillness." },
      { from: 7, prompt: "The doorway of a mud-brick Hebrew house at night, a neat dark line brushed along its wooden lintel and doorposts, a bundle of hyssop and a small clay bowl resting on the step, warm lamplight within; no people outside." },
      { from: 11, prompt: "A Hebrew family eating in haste around a wooden table lit only by a clay oil lamp, standing, belts fastened, sandals on, staffs in hand, unleavened bread and roast lamb on the table; no light from above." },
      { from: 29, prompt: "An Egyptian city at midnight under a black sky, every window dark, a single lamp burning in the palace; a heavy, mourning silence; no people." },
      { from: 37, prompt: "A vast multitude of Hebrew families with flocks, carts and kneading bowls bound in their cloaks leaving Egypt by moonlight, stretching to the horizon." },
    ],
  },
  {
    chapter: 13,
    title: "The Pillar of Cloud and Fire",
    headings: { 1: "The Consecration of the Firstborn", 17: "The Route of the Exodus" },
    scenes: [
      { from: 3, prompt: "Flat cakes of unleavened bread on a cloth beside a clay lamp at dawn, a family's travelling bundle beside them; no people." },
      { from: 17, prompt: "A long column of Israelites travelling through the wilderness toward the Red Sea at dusk, the bones of Joseph carried in a wooden chest by bearers." },
      { from: 21, prompt: "A great pillar of cloud rising before a column of travellers across the desert by day, and in the distance a pillar of fire glowing at night; God as light." },
    ],
  },
  {
    chapter: 14,
    title: "Crossing the Red Sea",
    headings: { 1: "Pharaoh Pursues the Israelites", 15: "Crossing the Red Sea" },
    scenes: [
      { from: 5, prompt: "Pharaoh's chariots and horsemen racing across the desert at dusk, dust and torches, the camp of Israel far ahead by the sea." },
      { from: 10, prompt: "A vast camp of frightened Israelites on the shore of the sea at night, a pillar of fire standing between them and a distant army." },
      { from: 21, prompt: "The Red Sea parted at night by a strong east wind, towering walls of water on either side, a multitude walking on dry ground between them by the light of a pillar of fire." },
      { from: 27, prompt: "The Red Sea calm again at dawn, gentle waves on the shore, a single broken chariot wheel half buried in the sand; no people." },
    ],
  },
  {
    chapter: 15,
    title: "The Song of Moses",
    headings: { 1: "The Song of Moses", 19: "The Song of Miriam", 22: "The Waters of Marah" },
    scenes: [
      { from: 1, prompt: `${MOSES}, standing on the shore with his arms raised in praise at sunrise, a great multitude singing behind him, the calm sea glittering.` },
      { from: 20, prompt: "Miriam, an old woman with grey hair in a dark headscarf, leading women dancing with tambourines on the seashore in golden morning light." },
      { from: 22, prompt: "A pool of bitter water in the Desert of Shur at dusk, weary travellers kneeling at its edge, an old white-bearded man throwing a piece of wood into the water." },
      { from: 27, prompt: "The oasis of Elim at evening, twelve springs of water and seventy palm trees, tents being pitched in the shade." },
    ],
  },
  {
    chapter: 16,
    title: "Manna and Quail",
    headings: { 1: "Manna and Quail", 22: "The Sabbath Rest" },
    scenes: [
      { from: 1, prompt: "The vast camp of Israel in the barren Desert of Sin at dusk, people gathered in grumbling groups, empty cooking pots." },
      { from: 13, prompt: "Quail settling over the camp in the evening sky, birds coming down among the tents in soft golden light." },
      { from: 14, prompt: "Fine white flakes like frost covering the desert ground around the camp at dawn, people bending to gather it into baskets." },
      { from: 33, prompt: "A small clay jar filled with manna set carefully on a ledge inside a tent by lamplight; no people." },
    ],
  },
  {
    chapter: 17,
    title: "Water from the Rock",
    headings: { 1: "Water from the Rock", 8: "The Defeat of the Amalekites" },
    scenes: [
      { from: 1, prompt: "Thirsty Israelites crowding around an old white-bearded man in the desert at Rephidim under a burning sky, empty water skins in their hands." },
      { from: 6, prompt: "Clear water gushing from a split rock at Horeb, streaming over the stones into the desert, people kneeling to drink." },
      { from: 10, prompt: `${MOSES}, seated on a stone on a hilltop at sunset, his arms held up by two men standing at either side, a battle far below in the valley.` },
      { from: 15, prompt: "A rough stone altar on a hilltop in the evening, a banner pole beside it against the sky; no people." },
    ],
  },
  {
    chapter: 18,
    title: "Jethro Visits Moses",
    headings: { 1: "Jethro Visits Moses", 13: "Jethro Advises Moses" },
    scenes: [
      { from: 1, prompt: `${MOSES}, bowing in welcome to his elderly father-in-law outside a tent in the wilderness at evening, women and two young men nearby.` },
      { from: 13, prompt: `${MOSES}, seated from morning till evening judging a long line of people waiting in the sun outside his tent.` },
      { from: 24, prompt: "Groups of elders sitting under shade awnings across the camp, each hearing small disputes, the camp orderly and calm at dusk." },
    ],
  },
  {
    chapter: 19,
    title: "Israel at Mount Sinai",
    headings: { 1: "Israel at Mount Sinai", 16: "The LORD Visits Sinai" },
    scenes: [
      { from: 1, prompt: "The vast tents of Israel camped on the plain before the towering granite mass of Mount Sinai at dusk." },
      { from: 10, prompt: "The people washing their garments at a desert stream at dawn, clean robes laid out on the rocks to dry." },
      { from: 16, prompt: "Mount Sinai wrapped in thick dark cloud and smoke, lightning and fire on its summit, the whole mountain trembling; the camp far below; God as fire and light." },
      { from: 20, prompt: "A lone old white-bearded figure, small in the distance, climbing up into the cloud and fire on the summit of Mount Sinai." },
    ],
  },
  {
    chapter: 20,
    title: "The Ten Commandments",
    headings: { 1: "The Ten Commandments", 18: "Israel Afraid of God's Presence", 22: "Idolatry Forbidden" },
    scenes: [
      { from: 1, prompt: "Two tablets of stone resting on a rock on the summit of Mount Sinai, lit by a golden light breaking through the cloud; no people." },
      { from: 18, prompt: "The people of Israel standing far off at the foot of Mount Sinai, covering their faces, as thunder, lightning and smoke fill the sky above." },
      { from: 24, prompt: "A simple altar of uncut earth and stones in the wilderness at sunrise, a thin column of smoke rising; no people." },
    ],
  },
  {
    chapter: 21,
    title: "Laws for Life Together",
    headings: { 1: "Hebrew Servants", 12: "Personal Injuries", 28: "Laws on Property" },
    scenes: [
      { from: 1, prompt: "Elders sitting at the gate of a tent camp in the wilderness at evening, listening to a man and his household who stand before them." },
      { from: 12, prompt: "A wooden doorpost of a tent and a small bronze awl resting on a stool beside it, soft lamplight; no people." },
      { from: 28, prompt: "An ox grazing peacefully beside an open pit covered with planks in a quiet pasture at dusk; no people." },
    ],
  },
  {
    chapter: 22,
    title: "Laws of Restitution",
    headings: { 1: "Laws of Restitution", 16: "Social Laws" },
    scenes: [
      { from: 1, prompt: "A fold of sheep and oxen behind a low stone wall at night, a lamp burning at the gate of the camp; no people." },
      { from: 5, prompt: "A ripe grainfield and a vineyard side by side at sunset, a thin line of smoke from a field fire far away; no people." },
      { from: 21, prompt: "An elderly widow with grey hair sitting alone at the door of a small tent at dusk, a loaf of bread, a jar of oil and a folded woollen cloak left beside her on a mat as gifts; she is the only person in the picture." },
      { from: 26, prompt: "A folded woollen cloak placed carefully in the hands of an old man at sunset, before the cold of night." },
    ],
  },
  {
    chapter: 23,
    title: "Justice and the Three Feasts",
    headings: { 1: "Justice and Mercy", 10: "Sabbath Laws", 14: "Three Annual Feasts", 20: "God's Angel to Lead the Way" },
    scenes: [
      { from: 1, prompt: "A traveller helping to lift a fallen donkey under its load on a desert road at dusk, the donkey's owner standing apart." },
      { from: 10, prompt: "A field resting in its seventh year, wild grain and flowers growing freely, gazelles grazing at the edge at evening; no people." },
      { from: 14, prompt: "Families bringing the first sheaves of the harvest and baskets of fruit to a gathering place in golden evening light." },
      { from: 20, prompt: "A road winding through the wilderness toward green hills on the horizon, a soft light going ahead along the road at dawn; no people." },
    ],
  },
  {
    chapter: 24,
    title: "The Covenant Confirmed",
    headings: { 1: "The Covenant Confirmed", 12: "Moses on the Mountain" },
    scenes: [
      { from: 3, prompt: "An altar of stone at the foot of Mount Sinai at dawn surrounded by twelve standing stones, the tribes of Israel gathered beyond." },
      { from: 9, prompt: "On a high place of the mountain, a pavement of clear sapphire blue stretched out under a dazzling light, seventy elders kneeling at a distance; God shown only as light." },
      { from: 15, prompt: "The summit of Mount Sinai covered by a glowing cloud, like a consuming fire on the mountaintop seen from the camp at night." },
    ],
  },
  {
    chapter: 25,
    title: "The Ark and the Lampstand",
    headings: { 1: "Offerings for the Tabernacle", 10: "The Ark of the Covenant", 23: "The Table", 31: "The Lampstand" },
    scenes: [
      { from: 1, prompt: "Baskets and bowls of offerings laid out on rugs at dusk: gold rings, silver, bronze, blue, purple and scarlet yarn, fine linen, goat hair, oil and spices; no people." },
      { from: 10, prompt: "The ark of the covenant, a chest of acacia wood overlaid with pure gold with two golden cherubim facing each other on its cover, their wings outstretched, glowing in a dark room; no people." },
      { from: 23, prompt: "A golden table with twelve loaves of bread arranged in two rows, plates and pitchers of gold, in soft lamplight; no people." },
      { from: 31, prompt: "A golden lampstand with seven branches like almond branches, its flowers and buds of hammered gold, seven small flames burning in a dark sanctuary; no people." },
    ],
  },
  {
    chapter: 26,
    title: "The Tabernacle",
    headings: { 1: "The Tabernacle", 31: "The Veil" },
    scenes: [
      { from: 1, prompt: "Long curtains of fine linen woven with blue, purple and scarlet yarn and cherubim, hanging in rich folds by lamplight; no people." },
      { from: 15, prompt: "Upright frames of acacia wood overlaid with gold standing on silver bases, the tabernacle's walls in golden lamplight; no people." },
      { from: 31, prompt: "A great veil of blue, purple and scarlet with woven cherubim hanging from golden hooks, a soft light glowing behind it; no people." },
    ],
  },
  {
    chapter: 27,
    title: "The Altar and the Courtyard",
    headings: { 1: "The Bronze Altar", 9: "The Courtyard", 20: "The Oil for the Lampstand" },
    scenes: [
      { from: 1, prompt: "A square bronze altar with horns at its four corners standing in an open courtyard at dawn; no people." },
      { from: 9, prompt: "The tabernacle courtyard seen from above at evening, white linen hangings on bronze posts forming a long rectangle in the desert camp." },
      { from: 20, prompt: "Pure olive oil being poured from a clay jug into the cup of a golden lamp in a dark sanctuary, the flame burning steady; only a hand visible." },
    ],
  },
  {
    chapter: 28,
    title: "The Priestly Garments",
    headings: { 1: "The Priestly Garments", 6: "The Ephod", 15: "The Breastpiece", 31: "The Robe" },
    scenes: [
      { from: 1, prompt: "Folded garments of blue, purple and scarlet with gold thread laid out on a weaver's table by lamplight; no people." },
      { from: 15, prompt: "A square breastpiece of gold and woven cloth set with twelve precious stones in four rows, each engraved, glowing on dark linen; no people." },
      { from: 31, prompt: "The hem of a blue robe with pomegranates of coloured yarn and small golden bells around it, close up in soft light; no people." },
      { from: 36, prompt: "A plate of pure gold engraved with words, tied with a blue cord, resting on folded fine linen; no people." },
    ],
  },
  {
    chapter: 29,
    title: "The Consecration of the Priests",
    headings: { 1: "The Consecration of the Priests", 38: "The Daily Offerings" },
    scenes: [
      { from: 1, prompt: "A basket of unleavened bread and wafers with a jar of anointing oil beside the entrance of a tent of meeting at dawn; no people." },
      { from: 4, prompt: "A large bronze basin of water at the entrance of the tabernacle at sunrise, white linen towels folded beside it; no people." },
      { from: 38, prompt: "A thin column of smoke rising from the bronze altar in the tabernacle courtyard at sunset, the camp of Israel quiet around it; no people close up." },
      { from: 45, prompt: "The tabernacle glowing softly at night in the middle of the sleeping camp of Israel, a pillar of cloud above it lit from within; God as light." },
    ],
  },
  {
    chapter: 30,
    title: "The Altar of Incense",
    headings: { 1: "The Altar of Incense", 11: "The Atonement Money", 17: "The Bronze Basin", 22: "The Anointing Oil and Incense" },
    scenes: [
      { from: 1, prompt: "A small golden altar of incense with horns at its corners, a thin fragrant smoke rising before a woven veil in a dim sanctuary; no people." },
      { from: 11, prompt: "Half-shekel coins of silver counted on a cloth by lamplight, a simple tally of names beside them; only hands visible." },
      { from: 22, prompt: "Myrrh, cinnamon, fragrant cane, cassia and olive oil in bowls on a perfumer's table by lamplight; no people." },
    ],
  },
  {
    chapter: 31,
    title: "Bezalel and Oholiab",
    headings: { 1: "Bezalel and Oholiab", 12: "The Sabbath", 18: "The Two Tablets" },
    scenes: [
      { from: 1, prompt: "A craftsman's workshop by lamplight, a skilled bearded craftsman engraving gold with fine tools, cut stones and carved wood around him." },
      { from: 12, prompt: "The camp of Israel at rest on the Sabbath at golden evening, tools laid aside, families sitting quietly at their tent doors." },
      { from: 18, prompt: "Two tablets of stone engraved with writing, resting in the light on a rock high on Mount Sinai; no people." },
    ],
  },
  {
    chapter: 32,
    title: "The Golden Calf",
    headings: { 1: "The Golden Calf", 15: "Moses Breaks the Tablets", 30: "Moses Intercedes" },
    scenes: [
      { from: 1, prompt: "Crowds of Israelites gathered at night around a golden calf on a pedestal, firelight flickering on its gold, Mount Sinai dark and cloud-covered behind." },
      { from: 15, prompt: `${MOSES}, coming down a mountain path at dusk carrying two stone tablets, the glow of the festival fires in the camp far below.` },
      { from: 19, prompt: "Two broken stone tablets lying shattered among the rocks at the foot of Mount Sinai at night, firelight in the distance; no people." },
      { from: 30, prompt: `${MOSES}, kneeling alone on the mountainside at dawn with his hands lifted in prayer, the camp of Israel small below.` },
    ],
  },
  {
    chapter: 33,
    title: "The Tent of Meeting",
    headings: { 1: "The Command to Leave Sinai", 7: "The Tent of Meeting", 12: "Moses Sees God's Glory" },
    scenes: [
      { from: 1, prompt: "Israelites in mourning at their tent doors at dusk, jewellery and ornaments laid aside on the ground before them." },
      { from: 7, prompt: "A tent pitched outside the camp, a pillar of cloud standing at its entrance, people standing at their own tent doors in the distance watching; God as cloud and light." },
      { from: 18, prompt: "A narrow cleft in a great rock on a mountainside, brilliant light passing by outside it at dawn; God shown only as light; no people visible." },
    ],
  },
  {
    chapter: 34,
    title: "The Covenant Renewed",
    headings: { 1: "The Second Set of Tablets", 10: "The Covenant Renewed", 29: "The Radiant Face of Moses" },
    scenes: [
      { from: 1, prompt: "Two newly cut stone tablets carried up a mountain path at first light, held by weathered hands; the summit in cloud above." },
      { from: 5, prompt: "The summit of Mount Sinai at dawn wrapped in a bright descending cloud, a lone old man bowing low to the ground; God as cloud and light." },
      { from: 29, prompt: "An old white-bearded man coming down the mountain into the camp at evening carrying two stone tablets, the people stepping back in awe, his face catching the warm sunset light." },
    ],
  },
  {
    chapter: 35,
    title: "Offerings for the Tabernacle",
    headings: { 1: "Sabbath Regulations", 4: "Offerings for the Tabernacle", 30: "Bezalel and Oholiab Appointed" },
    scenes: [
      { from: 4, prompt: "People of Israel streaming toward the centre of the camp at dusk carrying gold jewellery, bolts of coloured yarn, goat hair and fine wood as willing gifts." },
      { from: 25, prompt: "Women spinning blue, purple and scarlet yarn and goat hair by lamplight outside their tents, spindles turning." },
      { from: 30, prompt: "Two master craftsmen standing among stacks of gold, wood and woven cloth in a workshop tent, ready to begin; warm lamplight." },
    ],
  },
  {
    chapter: 36,
    title: "Building the Tabernacle",
    headings: { 1: "The People Bring More Than Enough", 8: "Building the Tabernacle" },
    scenes: [
      { from: 3, prompt: "Overflowing heaps of offerings in a workshop tent, gold, silver, yarn and fine linen piled high, craftsmen raising their hands to say enough." },
      { from: 8, prompt: "Weavers at large looms weaving curtains of fine linen with cherubim in blue, purple and scarlet, lamplight on the threads." },
      { from: 20, prompt: "Craftsmen fitting golden frames of acacia wood into silver bases, the tabernacle walls rising in the camp at evening." },
    ],
  },
  {
    chapter: 37,
    title: "The Ark, Table and Lampstand Made",
    headings: { 1: "Making the Ark", 10: "Making the Table", 17: "Making the Lampstand", 25: "Making the Altar of Incense" },
    scenes: [
      { from: 1, prompt: "A craftsman carefully hammering a golden cherub for the cover of the ark in a workshop by lamplight." },
      { from: 10, prompt: "A finished golden table with its gold rings and poles, resting in a workshop beside golden plates and pitchers; no people." },
      { from: 17, prompt: "A golden lampstand with seven branches like almond branches standing finished in a workshop, a craftsman's hand polishing one of its cups." },
      { from: 29, prompt: "Jars of holy anointing oil and fragrant incense on a shelf beside a small golden altar, lit by a single lamp; no people." },
    ],
  },
  {
    chapter: 38,
    title: "The Altar, Basin and Courtyard Made",
    headings: { 1: "Making the Bronze Altar", 9: "Making the Courtyard", 21: "Materials of the Tabernacle" },
    scenes: [
      { from: 1, prompt: "A bronze altar with horns at its corners being finished by a craftsman in a workshop lit by forge fire." },
      { from: 8, prompt: "A bronze basin on a bronze stand, polished bright as mirrors, reflecting lamplight; no people." },
      { from: 21, prompt: "Ledgers and weights beside neat piles of gold, silver and bronze on a cloth in a lamplit tent; no people." },
    ],
  },
  {
    chapter: 39,
    title: "The Priestly Garments Made",
    headings: { 1: "Making the Priestly Garments", 32: "The Work Completed" },
    scenes: [
      { from: 1, prompt: "Weavers working gold thread into blue, purple and scarlet cloth at their looms by lamplight." },
      { from: 8, prompt: "A finished breastpiece set with twelve precious stones in four rows, glowing on a dark cloth; no people." },
      { from: 32, prompt: "The finished work of the tabernacle laid out before an old white-bearded man at evening, garments, curtains, the ark and the lampstand; he raises his hand in blessing over the craftsmen." },
    ],
  },
  {
    chapter: 40,
    title: "The Tabernacle Raised",
    headings: { 1: "The Tabernacle Set Up", 34: "The Glory of the LORD" },
    scenes: [
      { from: 1, prompt: "The tabernacle being raised at dawn on the first day of the new year, its frames and curtains going up in the middle of the camp." },
      { from: 22, prompt: "Inside the tabernacle, the golden table with bread on one side and the golden lampstand with seven flames on the other before the veil; no people." },
      { from: 34, prompt: "The finished tabernacle in the desert covered by a cloud, filled with a glorious golden light from within, the whole camp of Israel watching from afar at dusk; God as light." },
      { from: 36, prompt: "A pillar of cloud by day and fire by night resting over the tabernacle, the tents of Israel spread around it under the stars." },
    ],
  },
];

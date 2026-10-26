import type { SleepChapterPlan } from "./genesis";

/**
 * Psalms for Walk and Sleep. Each psalm has a title (shown as its heading) and its
 * paintings: one for short psalms, two for most, more for the longest. Mostly
 * landscapes and quiet scenes; people are rare, small and seen from behind, and
 * God is shown only as light. The traditional titles ("A Psalm of David…") are
 * part of verse 1 in the BSB and are read as written.
 */
type Row = [psalm: number, title: string, scenes: [from: number, prompt: string][]];

const ROWS: Row[] = [
  // Book One (1–41)
  [1, "The Two Ways", [[1, "A great tree planted by a quiet stream at dusk, its leaves full and green, fruit on its branches, still water reflecting the last light."]]],
  [2, "The Lord's Anointed", [[1, "Distant kings' encampments with banners and torches across a dark plain at night, restless."], [7, "A plain gold circlet crown with no cross and a shepherd's staff resting on a stone on Mount Zion at dawn, the city walls behind, calm light."]]],
  [3, "A Morning Prayer in Trouble", [[1, "A lone figure, a king in a plain cloak seen from far away, climbing a dark hill path at night away from a city, olive trees around."]]],
  [4, "An Evening Prayer", [[1, "A simple bed in a stone room at night, a single oil lamp burning low by the window, stars outside, perfect stillness and peace."]]],
  [5, "A Morning Prayer", [[1, "First light of dawn spreading over the hills of Judah, mist in the valleys, a small altar of stones with thin smoke rising."], [8, "A straight path leading through a quiet valley at sunrise between rocky hills; no people."]]],
  [6, "A Prayer in Distress", [[1, "A dark room at night, a bed with rumpled covers, a lamp almost out, rain on the window, a sense of sorrow."], [8, "Morning light breaking through rain clouds over a quiet village, the storm passing; no people."]]],
  [7, "A Refuge from Pursuers", [[1, "A cave mouth in a rocky hillside at night, a small fire glowing within, dark hills all around; no people visible."], [10, "A shield of bronze leaning against a rock under a vast starry sky; no people."]]],
  [8, "How Majestic Is Your Name", [[1, "The night sky over the desert ablaze with stars and the Milky Way, a crescent moon, tiny hills below; no people."]]],
  [9, "The Lord Reigns Forever", [[1, "A great throne-like rock on a mountain summit lit by golden sunrise, clouds below; no people."], [11, "A city of stone on a hill at evening, lamps being lit in windows, a peaceful scene."]]],
  [10, "Why Do You Stand Far Off?", [[1, "Dark empty streets of an ancient city at night, a single lamp in one window; no people visible."], [12, "Dawn rising over the poor quarter of the city, light reaching into narrow lanes; no people."]]],
  [11, "In the Lord I Take Refuge", [[1, "A small bird flying toward a high mountain crag at dusk, the mountain glowing in the last light."]]],
  [12, "The Pure Words of the Lord", [[1, "Silver being refined in a clay furnace, bright molten metal glowing in the dark, smoke rising; no people."]]],
  [13, "How Long, O Lord?", [[1, "A lone tree on a dark hill under heavy clouds at night, the first faint glow of dawn on the horizon."]]],
  [14, "The Fool Says There Is No God", [[1, "A wide view from heaven of a sleeping ancient city under the night sky, a soft light searching down from above."]]],
  [15, "Who May Dwell on Your Holy Hill?", [[1, "A tent on a holy hill at sunrise, a straight path leading up to it, light resting on the hilltop; no people."]]],
  [16, "You Will Not Abandon Me", [[1, "Pleasant boundary stones marking green fields in a valley at evening, a vineyard and an olive grove, golden light."], [7, "A shepherd's tent at night under stars, a lamp at the door, perfect stillness; no people visible."]]],
  [17, "Keep Me as the Apple of Your Eye", [[1, "A small bird sheltering under the spread wing of a great eagle on a cliff ledge at dusk."], [13, "Sunrise over a sleeping valley, light touching the face of the hills as if waking; no people."]]],
  [18, "The Lord Is My Rock", [[1, "A mighty rock fortress on a cliff above the sea at night, waves breaking below, a beacon on its tower."], [7, "Storm clouds and lightning over dark mountains, rain sweeping the valley, the earth trembling; no people."], [16, "Deep waters parting to show a shining path, light reaching down from above; no people."], [33, "A deer standing surefooted on a high mountain ledge at sunrise."]]],
  [19, "The Heavens Declare", [[1, "The sun rising over a wide desert in glory, golden rays across the dunes and a clear sky; no people."], [7, "A rolled scroll tied with a cord on a wooden lectern beside an oil lamp, honey in a small bowl, warm light; no people."]]],
  [20, "Some Trust in Chariots", [[1, "A small altar with smoke rising at dawn before a battle, tents in the distance."], [7, "Abandoned chariots and horses standing quiet in the mist at sunrise on a plain; no people."]]],
  [21, "The King Rejoices", [[1, "A golden crown resting on a purple cloth by lamplight in a palace room; no people."], [8, "A wide plain at evening after a storm, the clouds clearing, golden light; no people."]]],
  [22, "Why Have You Forsaken Me?", [[1, "A lone hill under a dark sky at midday, heavy clouds, wind in the dry grass; no people."], [12, "Wild bulls and lions in a dry wilderness at dusk, seen from far away; no people."], [22, "Dawn breaking over a great gathering of tents, people from many lands coming together in the distance; small figures."]]],
  [23, "The Lord Is My Shepherd", [[1, "Green pastures beside still waters at golden evening, sheep resting peacefully, a shepherd's staff leaning against a tree; no people."], [4, "A dark valley path between steep cliffs at night, a single lantern hanging from a shepherd's staff planted upright in the path, its light falling on sheep resting safely around it; no people."]]],
  [24, "The King of Glory", [[1, "A vast land seen from a high mountain at sunrise, hills, rivers and a distant sea stretching to the horizon, light spreading over everything; no people."], [7, "Ancient city gates of stone flung wide open at dawn, golden light pouring through; no people."]]],
  [25, "Show Me Your Ways", [[1, "A winding path through misty mountains at dawn, the way ahead lit softly; no people."], [12, "A small house at evening with its door open and a lamp inside, a garden around it; no people."]]],
  [26, "Vindicate Me, O Lord", [[1, "A man's hands washing in a bronze basin by lamplight; only hands visible."], [8, "The house of the Lord at evening, a lamp burning in its doorway, peace around it; no people."]]],
  [27, "The Lord Is My Light", [[1, "A single lamp shining in a great darkness, its light filling a stone room; no people."], [4, "A tent of meeting on a hill at golden evening, seen from a distance, sheltered by trees."]]],
  [28, "The Lord Is My Strength", [[1, "A man's hands lifted toward a sanctuary at dusk, seen from behind, small against the building."], [6, "A shepherd carrying a lamb across a hillside at evening, seen from far away."]]],
  [29, "The Voice of the Lord", [[1, "A thunderstorm over the sea, lightning striking the waves, great cedars of Lebanon bending in the wind on the shore."], [10, "After the storm, the sea calm and silver under the moon, the cedars still; no people."]]],
  [30, "Joy Comes in the Morning", [[1, "A dark night sky slowly turning to dawn over a quiet valley, the first golden light on the hills."], [11, "Sunrise flooding a valley with gold, flowers opening, birds rising; no people."]]],
  [31, "Into Your Hands", [[1, "A rock fortress on a mountain at dusk, its gate open and a lamp burning within; no people."], [14, "Open hands resting in the light from a window, a quiet room; only hands visible."]]],
  [32, "Blessed Is the One Forgiven", [[1, "A heavy rain clearing over a valley, the sun breaking through, everything washed clean; no people."], [8, "A horse and a mule grazing freely in a meadow at evening beside a gentle path."]]],
  [33, "Sing to the Lord a New Song", [[1, "A ten-stringed harp resting on a cushion by an open window at evening, the sea beyond; no people."], [6, "The starry heavens over the sea at night, the waters gathered like a heap; no people."]]],
  [34, "Taste and See", [[1, "A shepherd's camp at night with a small fire, a quiet watchful light on the hillside; no people close up."], [8, "A table with bread, honey and fruit under a fig tree at golden evening; no people."]]],
  [35, "Contend for Me, O Lord", [[1, "A plain round bronze shield with no emblem and a spear leaning against a stone wall at night under the stars; no people."], [9, "A quiet valley at morning after danger has passed, birds singing; no people."]]],
  [36, "The Fountain of Life", [[1, "Mountains rising to the clouds at sunrise, deep valleys below in shadow."], [7, "A spring of clear water flowing from a rock in a green garden, light falling on it; no people."]]],
  [37, "Delight in the Lord", [[1, "Grass withering in the summer heat beside a green tree by a stream; no people."], [11, "Meek travellers resting in a fertile land at evening, seen from far away."], [23, "A traveller's footprints on a firm path along a hillside at dusk; no people."], [35, "A great spreading tree in a field at evening, and a quiet house with its lamp lit nearby."]]],
  [38, "Do Not Forsake Me", [[1, "A dim room at night, an empty bed with tangled covers in shadow, a low lamp; no people."], [15, "Dawn light coming through a small window onto a bowl of water and folded cloth; no people."]]],
  [39, "Make Me Know My End", [[1, "A breath of mist drifting over still water at dawn, fading; no people."], [7, "A small boat drawn up on a quiet lakeshore at evening, the water like glass; no people."]]],
  [40, "He Set My Feet on a Rock", [[1, "A slimy pit at the foot of a cliff, and above it a firm rock in sunlight with a path leading up; no people."], [6, "An open scroll on a table by lamplight, its writing faint and too small to read; no people."]]],
  [41, "Blessed Is the One Who Cares for the Poor", [[1, "A simple bed by a window with bread and water beside it, morning light falling across it; no people."]]],
  // Book Two (42–72)
  [42, "As the Deer Pants for Water", [[1, "A deer drinking from a clear mountain stream at dawn, ferns and mist around."], [7, "Deep waterfalls roaring in a mountain gorge at night, moonlight on the spray; no people."]]],
  [43, "Send Out Your Light", [[1, "A beam of light and a path leading up a dark mountain toward a lit sanctuary at the summit; no people."]]],
  [44, "We Have Heard with Our Ears", [[1, "Elders telling stories around a fire at night, children listening, seen from far away."], [17, "Sheep scattered across dark hills at night, a lone watchman's fire in the distance."]]],
  [45, "A Song for the King", [[1, "A royal hall decorated with ivory and gold, lamps lit for a wedding feast; no people."], [10, "A garden courtyard of a palace at evening with lamps and flowers prepared for a bride; no people."]]],
  [46, "God Is Our Refuge", [[1, "A stormy sea crashing against mountains at night while a quiet river flows peacefully through a city on a hill nearby."], [8, "Broken spears and bows lying in a quiet field at dawn, war ended, flowers growing among them; no people."]]],
  [47, "Clap Your Hands", [[1, "A great crowd celebrating in the distance on a hillside at sunrise, trumpets raised, seen from far away."]]],
  [48, "Great Is the Lord in Zion", [[1, "Mount Zion with the city of Jerusalem on its height at golden evening, its walls and towers glowing."], [9, "A temple courtyard at dusk with lamps lit around it, quiet and holy; no people."]]],
  [49, "Riches Cannot Redeem", [[1, "Gold coins and jewellery lying in dust beside an empty tomb at evening; no people."], [13, "A flock of sheep on a hillside at dusk, a dark valley beyond, and a light breaking through the clouds above."]]],
  [50, "The Mighty One Speaks", [[1, "The sun rising from horizon to horizon over a vast land, fire and storm clouds gathering on the mountains."], [10, "Cattle grazing on a thousand hills at golden evening, birds in the sky; no people."]]],
  [51, "Create in Me a Clean Heart", [[1, "A man kneeling alone in a dark room at night, seen from behind, a single lamp, deep sorrow."], [7, "Fresh snow covering a quiet valley at dawn, everything white and clean; no people."]]],
  [52, "A Green Olive Tree", [[1, "A green olive tree flourishing in the courtyard of a temple at evening; no people."]]],
  [53, "No One Who Does Good", [[1, "A view from the clouds over a sleeping ancient city at night, a soft light searching below; no people."]]],
  [54, "God Is My Helper", [[1, "A rocky wilderness stronghold at dusk, a lone campfire hidden among the rocks; no people close up."]]],
  [55, "Cast Your Burden on the Lord", [[1, "A dove flying away over the wilderness at dusk toward distant hills."], [16, "A man praying at evening, morning and noon, seen from behind at a window looking out on the hills."]]],
  [56, "You Keep My Tears in a Bottle", [[1, "A small glass bottle on a stone ledge catching the light by a window at night, a scroll beside it; no people."]]],
  [57, "In the Shadow of Your Wings", [[1, "A cave in the rocks at night, the shadow of great wings cast over it by moonlight; no people."], [7, "A harp and lyre resting on a rock at dawn, the sun rising over the hills; no people."]]],
  [58, "There Is a God Who Judges", [[1, "A dry riverbed and thorn bushes in a hot wilderness under a hard sky; no people."]]],
  [59, "My Fortress", [[1, "Dogs prowling the dark streets of an ancient city at night, seen from a high tower window."], [16, "Morning sunlight on a high stone fortress tower, the night over; no people."]]],
  [60, "With God We Will Do Valiantly", [[1, "A cracked and shaken land after an earthquake at dusk, a long cloth banner streaming from a single straight pole on a hill above it, no crossbar."]]],
  [61, "The Rock Higher Than I", [[1, "A towering rock rising above the sea at the end of the earth at dusk, a light at its summit; no people."]]],
  [62, "My Soul Waits in Silence", [[1, "A still lake at dawn, perfectly calm, mountains reflected in it, total silence; no people."], [8, "A strong rock on a hillside at evening, rain clouds passing; no people."]]],
  [63, "My Soul Thirsts for You", [[1, "A dry and weary desert land under a pale night sky, cracked earth, a distant oasis."], [6, "A bed by a window at night, a man lying awake looking at the stars, seen from behind, peaceful."]]],
  [64, "Hide Me from Secret Plots", [[1, "Dark alleys of a city at night with shadows, and a lit sanctuary high above on a hill."]]],
  [65, "You Crown the Year", [[1, "The sea calming at dusk, waves stilling, light spreading over the water; no people."], [9, "Abundant fields of grain, meadows full of flocks, and valleys covered with wheat at golden harvest evening; no people."]]],
  [66, "Come and See", [[1, "The sea parted with a path through the waters, light shining on it; no people."], [13, "A temple courtyard with offerings at dawn, smoke rising; no people."]]],
  [67, "May God Be Gracious", [[1, "The earth yielding its harvest under a warm golden sun, fields of many lands stretching to the horizon; no people."]]],
  [68, "Let God Arise", [[1, "Smoke being blown away by the wind and wax melting before a fire, clouds scattering at dawn; no people."], [7, "A column of light leading through the wilderness at night, a great camp following in the distance."], [15, "Majestic mountains of Bashan with many peaks at sunrise."], [24, "A procession of singers and musicians with tambourines entering a sanctuary at dawn, seen from far away."]]],
  [69, "Save Me, O God", [[1, "Deep waters rising around a sinking rock at night, waves overhead; no people."], [13, "Morning light breaking over calm waters, the flood receding; no people."], [30, "An ox and a song: a field at evening, a singer's lyre resting on a fence; no people."]]],
  [70, "Hasten, O God", [[1, "A lone rider galloping toward a besieged house at dawn, seen from far away."]]],
  [71, "From My Youth", [[1, "A rock refuge with an open door at dusk, a lamp inside; no people."], [17, "An elderly man with white hair sitting by a window at evening, telling a story to grandchildren, seen from behind."]]],
  [72, "May He Rule from Sea to Sea", [[1, "Rain falling gently on mown grass in a wide field at evening, showers watering the earth; no people."], [8, "Ancient wooden ships with a single square sail and banks of oars, sailing from distant islands bringing gifts, at sunrise on the sea."]]],
  // Book Three (73–89)
  [73, "Whom Have I in Heaven?", [[1, "A man walking on a slippery mountain path at dusk, seen from far behind, the path steep."], [17, "A sanctuary on a hill at evening lit from within, the path leading to it; no people."]]],
  [74, "Remember Your Congregation", [[1, "A ruined sanctuary with broken carved panels and smoke, at dusk; no people."], [12, "The sea divided and the sun and moon set in their places, a vast sky; no people."]]],
  [75, "We Give Thanks", [[1, "A cup of wine on a stone table with scales of justice beside it, lamplight; no people."]]],
  [76, "God Is Known in Judah", [[1, "Broken arrows, shields and swords on a quiet hillside near Salem at dawn; no people."]]],
  [77, "I Remember the Deeds of the Lord", [[1, "A man awake on his bed at night, unable to sleep, seen from behind, looking at the dark sky."], [16, "The waters of the sea trembling, lightning lighting a path through the waves, a flock led across by night."]]],
  [78, "Things Our Fathers Told Us", [[1, "A father teaching his children by lamplight from an old scroll, seen from far away."], [12, "The sea split open with walls of water, a pillar of fire lighting the way at night."], [23, "Manna like frost on the ground and quail at dawn around a desert camp."], [52, "Sheep led through the wilderness by a shepherd at evening, seen from far away."], [70, "A young shepherd boy with his flock on a hillside at sunrise, seen from behind."]]],
  [79, "Help Us, O God of Our Salvation", [[1, "A ruined city at dusk, smoke rising, broken walls; no people."]]],
  [80, "Restore Us, O God", [[1, "A shepherd's lamp shining over a flock on a dark hillside at night; no people."], [8, "A great vine with spreading branches covering the hills, broken walls around it, at evening; no people."]]],
  [81, "Sing for Joy to God", [[1, "A ram's horn trumpet resting by a harp at the new moon at night; no people."], [10, "Honey dripping from a rock and wheat in a field at evening; no people."]]],
  [82, "God Presides in the Assembly", [[1, "An open-air stone court at the city gate at dusk, low stone benches along its walls, a set of scales on a stone table lit by a shaft of light; no people."]]],
  [83, "Do Not Keep Silent", [[1, "Dark storm clouds gathering over many enemy camps on the hills at night."], [13, "Tumbleweed and chaff blowing before the wind across a plain at dusk; no people."]]],
  [84, "How Lovely Is Your Dwelling", [[1, "A sparrow's nest tucked into a crack in an old stone wall beside a plain stone altar in an open courtyard at golden evening, no wooden beams."], [10, "A doorway of the house of God at evening, warm light within; no people."]]],
  [85, "Righteousness and Peace Kiss", [[1, "A land restored after rain, green fields at dawn; no people."], [10, "Truth springing up from the earth like spring grass and light shining down from the sky at sunrise; no people."]]],
  [86, "Teach Me Your Way", [[1, "A man kneeling in prayer on a rooftop at night under the stars, seen from behind."], [11, "A clear path through the hills at dawn, light shining on it; no people."]]],
  [87, "Glorious Things of Zion", [[1, "The gates of Zion at sunrise on its holy mountain, roads from many lands leading to it; no people."]]],
  [88, "A Prayer from the Depths", [[1, "A dark stone pit at night, a faint light from far above; no people."], [10, "A small window in a dark room, the night sky beyond and one bright star; no people."]]],
  [89, "I Will Sing of Your Steadfast Love", [[1, "The heavens at night full of stars and a full moon, the sea calm below; no people."], [9, "The raging sea stilled under the moon, waves smoothing; no people."], [19, "An old horn of oil and a shepherd's crook resting on a rock at dawn; no people."], [36, "The moon rising over the hills, steady and faithful in the night sky; no people."]]],
  // Book Four (90–106)
  [90, "From Everlasting to Everlasting", [[1, "Ancient mountains at sunrise, mist rising, timeless and still; no people."], [5, "Grass sprouting in the morning and withering by evening in a dry field; no people."]]],
  [91, "Under His Wings", [[1, "A great bird spreading its wings over its young in a nest on a high rock at night, stars above."], [9, "A small house safe on a hillside at night while a storm passes in the distance, a lamp in the window."]]],
  [92, "It Is Good to Give Thanks", [[1, "A lyre and harp resting by a small plain window in a simple stone house at dawn, morning light outside; no people."], [12, "A palm tree and a cedar flourishing in a temple courtyard at evening; no people."]]],
  [93, "The Lord Reigns", [[1, "Mighty ocean waves rising at night, and above them a calm, unshaken light in the sky; no people."]]],
  [94, "God of Vengeance, Shine Forth", [[1, "Dark city streets at night, a widow's lamp in a window; no people."], [12, "A man resting on a bed with a lamp, peace after trouble, seen from far away."]]],
  [95, "Come, Let Us Worship", [[1, "The depths of the earth and the heights of the mountains, the sea below at sunrise; no people."], [6, "Sheep resting in a green pasture at evening with a shepherd's crook nearby; no people."]]],
  [96, "Sing a New Song", [[1, "Nations from every land at sunrise across the hills, seen from far away, banners and songs."], [11, "The sea roaring, fields exulting and trees of the forest swaying with joy in golden light; no people."]]],
  [97, "Clouds and Darkness Surround Him", [[1, "Mountains melting like wax beneath lightning and dark clouds at night; no people."], [11, "Light sown like seed across fields at dawn; no people."]]],
  [98, "The Whole Earth Sings", [[1, "Rivers and hills at sunrise, mountains glowing, harps and trumpets resting on a rock; no people."]]],
  [99, "The Lord Is Holy", [[1, "A pillar of cloud over a tent of meeting at dusk in the desert; no people."]]],
  [100, "Enter His Gates with Thanksgiving", [[1, "Temple gates open at sunrise with courts beyond, light pouring through, a flock grazing nearby; no people."]]],
  [101, "I Will Walk with Integrity", [[1, "A quiet house with a clean doorway at dawn, a lamp lit inside; no people."]]],
  [102, "A Prayer of the Afflicted", [[1, "A lonely bird on a rooftop at night, an owl in the ruins; no people."], [12, "The heavens at dawn like a garment being changed, stars fading and a new day rising; no people."]]],
  [103, "Bless the Lord, O My Soul", [[1, "An eagle soaring at sunrise over the mountains, renewed."], [11, "The heavens high above the earth, east far from west, a wide sky at dusk; no people."]]],
  [104, "How Many Are Your Works", [[1, "Light like a garment spreading over the heavens at dawn, clouds and wind; no people."], [10, "Springs flowing in valleys, wild donkeys drinking, birds singing in branches at evening."], [19, "The moon rising and lions prowling in the night, the sun setting over the sea."], [24, "The great sea full of ships and creatures at golden evening; no people."]]],
  [105, "Remember His Wonders", [[1, "A storyteller's scroll open by a fire at night, its writing faint and too small to read; no people."], [16, "Joseph in chains walking toward Egypt, seen from far behind in the desert."], [26, "Darkness over Egypt and frogs and locusts in the fields; no people."], [37, "A pillar of cloud by day and fire by night over a travelling people, and water flowing from a rock."]]],
  [106, "We Have Sinned", [[1, "The Red Sea divided with walls of water at night; no people close up."], [19, "A golden calf in the desert at night, abandoned; no people."], [43, "A light shining on a people in exile, far across a dark land."]]],
  // Book Five (107–150)
  [107, "Give Thanks, His Love Endures", [[1, "Travellers lost in a desert wasteland at dusk, then a city of lamps in the distance."], [10, "Prison chains broken on a stone floor, a door open to the dawn; no people."], [23, "Ships riding out a great storm at sea at night, high waves, and on the horizon the first calm light of dawn breaking through; one single painting, not a split panel."], [33, "A desert turned into pools of water and fields of grain at golden evening; no people."]]],
  [108, "My Heart Is Steadfast", [[1, "A harp and lyre at dawn, the sun rising over the sea; no people."]]],
  [109, "Help Me, O Lord", [[1, "A lone figure standing at night in the open stone court of a city gate where judges sit, low stone benches empty around him, seen from behind; small."], [21, "A shadow lengthening at evening and a locust blown by the wind, then morning light; no people."]]],
  [110, "A Priest Forever", [[1, "A royal sceptre resting on a cushion before a throne at dawn on Mount Zion; no people."]]],
  [111, "Great Are the Works of the Lord", [[1, "A wide landscape of rivers, hills and fields under a golden morning sky; no people."]]],
  [112, "Blessed Is the One Who Fears the Lord", [[1, "A lamp shining in a dark house at night, the door open to neighbours; no people."]]],
  [113, "Who Is Like the Lord?", [[1, "The sun rising over the eastern hills seen from a high hilltop, the western sky still deep blue with fading stars, a vast open sky; no people."]]],
  [114, "When Israel Went Out of Egypt", [[1, "The sea fleeing and the Jordan turning back, mountains skipping like rams under moonlight; no people."]]],
  [115, "Not to Us, O Lord", [[1, "Small Canaanite idols of cast silver and gold, a few stiff standing figures and a little calf, silent and dusty on a stone shelf in a dark shrine; no people."], [9, "A shield resting against a rock in sunlight; no people."]]],
  [116, "I Love the Lord", [[1, "A man lying on a bed recovering, morning light from the window, seen from far away."], [12, "A cup lifted toward the light in a temple courtyard at evening; only hands visible."]]],
  [117, "Praise the Lord, All Nations", [[1, "Many lands and seas seen from a high mountain at sunrise, stretching to the horizon; no people."]]],
  [118, "His Love Endures Forever", [[1, "Ancient city gates of heavy wood bound with bronze, set in a thick stone wall, swinging open at dawn with golden light pouring through; no people."], [10, "Bees swarming and a fire of thorns dying out at dusk; no people."], [22, "A great cornerstone set in a building at sunrise, glowing; no people."]]],
  [120, "In My Distress I Called", [[1, "Pilgrims' tents in a far land under a dark sky, longing for home, seen from far away."]]],
  [121, "I Lift My Eyes to the Hills", [[1, "Hills at dawn with a winding pilgrim path, a traveller seen from far behind looking up."], [4, "A sleeping camp at night under the stars, a single watchful light on the hill above; no people visible."]]],
  [122, "Let Us Go to the House of the Lord", [[1, "Pilgrims arriving at the gates of Jerusalem at sunrise, seen from far away."]]],
  [123, "I Lift My Eyes to You", [[1, "A servant's eyes on a master's hand: an open doorway in a courtyard at evening, waiting; no people visible."]]],
  [124, "If the Lord Had Not Been on Our Side", [[1, "A small bird escaping from a broken snare into the sky at dawn."]]],
  [125, "Like Mount Zion", [[1, "Mountains surrounding Jerusalem at evening, the city safe within them."]]],
  [126, "Those Who Sow in Tears", [[1, "A dry riverbed in the Negev filling with streams after rain at dawn; no people."], [5, "A farmer sowing seed at dawn, and at evening sheaves of harvest in the same field, seen from far away."]]],
  [127, "Unless the Lord Builds the House", [[1, "A stone house being built on a hillside at evening, its walls half raised with wooden scaffolding, a lamp burning on the site, the city wall beyond; one single painting, not a split panel."]]],
  [128, "Blessed Are All Who Fear the Lord", [[1, "A family at a table under a vine and olive shoots around the house at evening, seen from far away."]]],
  [129, "They Have Afflicted Me", [[1, "A ploughed field with long furrows at dusk, grass on a rooftop withering; no people."]]],
  [130, "Out of the Depths", [[1, "Deep waters at night with a single light far above; no people."], [5, "A watchman on a city wall waiting for the morning, the first light on the horizon, seen from behind."]]],
  [131, "Like a Weaned Child", [[1, "A quiet room at evening, a child asleep peacefully on a soft bed, a lamp low; seen from a distance."]]],
  [132, "Remember David", [[1, "An ark resting in a tent at night with a lamp beside it; no people."], [13, "Zion at evening with a lamp shining, priests' garments folded on a bench; no people."]]],
  [133, "How Good When Brothers Dwell Together", [[1, "Dew on Mount Hermon at dawn and the hills of Zion in soft light; no people."]]],
  [134, "Bless the Lord by Night", [[1, "The temple courts at night with lamps burning and hands raised in the distance, seen from far away."]]],
  [135, "Praise the Name of the Lord", [[1, "Clouds rising from the ends of the earth, lightning and wind over the sea at dusk; no people."], [15, "Silent idols in a dark room, mouths that cannot speak; no people."]]],
  [136, "His Love Endures Forever", [[1, "The heavens and the earth, great lights in the sky, sun and moon together at dusk; no people."], [10, "The Red Sea divided and a people walking through at night, seen from far away."], [23, "Food for every creature: fields, flocks and birds at golden evening; no people."]]],
  [137, "By the Rivers of Babylon", [[1, "Willow trees by the rivers of Babylon at dusk, harps hanging silent on their branches; no people."]]],
  [138, "I Will Give You Thanks", [[1, "A temple at dawn with a lamp burning, a harp resting nearby; no people."]]],
  [139, "You Have Searched Me", [[1, "A lone traveller resting by a fire at the edge of the sea at night, the stars above, seen from behind."], [11, "Darkness lit as bright as day: a night landscape glowing with soft light; no people."], [13, "Delicate threads being woven on a loom in a dark room by lamplight; no people."]]],
  [140, "Rescue Me, O Lord", [[1, "A snare and hidden trap on a path at dusk, avoided; no people."]]],
  [141, "Let My Prayer Rise Like Incense", [[1, "Incense smoke rising from a small altar at evening, hands lifted in the distance, seen from far away."]]],
  [142, "In the Cave", [[1, "A cave mouth in the rocks at night, a small lamp inside; no people visible."]]],
  [143, "Teach Me to Do Your Will", [[1, "A dark land at night and a dry ground thirsting; no people."], [8, "Morning light on a level path through the hills; no people."]]],
  [144, "Blessed Is the People", [[1, "A rock fortress and a shield at dawn; no people."], [12, "Barns full, flocks in the fields and young plants growing at golden evening; no people."]]],
  [145, "Great Is the Lord", [[1, "A wide valley at sunrise with every creature waking: birds, deer and flocks; no people."], [14, "Fruit trees heavy with fruit, fields of ripe grain and vines at golden evening, warm light pouring down from the sky over every living thing; no people, no hands."]]],
  [146, "Do Not Trust in Princes", [[1, "An empty throne of carved stone in a ruined ancient hall open to the sky at dusk, broken stone walls; no people."], [6, "Heaven and earth and sea at sunrise; no people."]]],
  [147, "He Heals the Brokenhearted", [[1, "The stars numbered across the night sky, each one bright; no people."], [8, "Clouds bringing rain to the hills, grass growing on the mountains, a raven's young in a nest."], [16, "Snow like wool and frost like ashes on a quiet landscape at dawn; no people."]]],
  [148, "Praise Him, Sun and Moon", [[1, "Sun, moon and stars together in one sky over the sea; no people."], [7, "Sea creatures, lightning, hail, snow, mountains, fruit trees and cedars in one wide landscape at dusk; no people."]]],
  [149, "Sing a New Song", [[1, "A festival at night with tambourines and lyres, dancers seen far away in firelight."]]],
  [150, "Let Everything That Has Breath", [[1, "Ancient instruments only, a ram's horn, two long silver trumpets, lyres, a harp, hand drums and cymbals, resting together on the stone paving of an open courtyard at sunrise, golden light; no modern instruments, no people."]]],
];

// Psalm 119, an acrostic in 22 sections of eight verses, one for each Hebrew letter.
const LETTERS = ["Aleph", "Beth", "Gimel", "Daleth", "He", "Waw", "Zayin", "Heth", "Teth", "Yodh", "Kaph", "Lamedh", "Mem", "Nun", "Samekh", "Ayin", "Pe", "Tsadhe", "Qoph", "Resh", "Shin", "Taw"];
const PSALM_119: SleepChapterPlan = {
  chapter: 119,
  title: "Your Word Is a Lamp",
  headings: Object.fromEntries(LETTERS.map((l, i) => [i * 8 + 1, l])),
  scenes: [
    { from: 1, prompt: "A traveller's path through green hills at dawn, straight and clear, a stream beside it; no people." },
    { from: 33, prompt: "An open scroll on a wooden table by a window at morning, a pen and ink beside it, its writing faint and too small to read; no people." },
    { from: 65, prompt: "Gold and silver coins scattered and forgotten beside an open scroll in lamplight, the scroll treasured, its writing faint and too small to read; no people." },
    { from: 97, prompt: "A quiet study at night with scrolls on shelves, an elderly man reading by lamplight, seen from behind." },
    { from: 105, prompt: "A small clay oil lamp held low, lighting a narrow path at the feet of a traveller walking through a dark night, only the lamp, the path and the feet visible, stars above." },
    { from: 137, prompt: "Morning sunlight streaming through an open doorway onto an open scroll, its writing faint and too small to read; no people." },
    { from: 161, prompt: "A watchman on a city wall in the early dawn, seen from behind, the city still asleep below." },
  ],
};

/**
 * A scene that names no one is painted empty: the model otherwise adds passers-by, and in
 * the Psalms a figure in a landscape (a shepherd above all) reads as God, who is shown only as light.
 */
const NAMES_SOMEONE =
  /\b(man|men|shepherd|figure|traveller|travellers|king|kings|child|children|family|pilgrims?|watchman|singers|elders|servant|father|crowd|nations|people|rider|farmer|storyteller|Joseph|dancers|priests|hands|feet|boy|widow|bride|musicians)\b/i;
/** Period details the painter gets wrong unless told: temples came out Greek, baroque or South Asian; ships as galleons. */
const PERIOD: [RegExp, string][] = [
  [/temple|sanctuary|house of the lord|courts|palace|royal hall|throne/i, " Ancient Israelite architecture of plain dressed stone and cedar wood: not Greek, Roman, church or Asian."],
  [/\bships?\b/i, " Ships are ancient wooden vessels with one square sail and oars, not tall ships or galleons."],
];
const inPeriod = (prompt: string) => PERIOD.reduce((p, [when, add]) => (when.test(prompt) ? p + add : p), prompt);
const EMPTY = " The scene is completely empty: no people, no figures, no silhouettes in the distance.";
const emptyUnlessNamed = (prompt: string) =>
  /no people/i.test(prompt) || !NAMES_SOMEONE.test(prompt) ? `${prompt}${EMPTY}` : prompt;

/** The plans, with Psalm 119 in its place. */
export const PSALM_PLANS: SleepChapterPlan[] = [
  ...ROWS.map(([chapter, title, scenes]) => ({
    chapter,
    title,
    headings: { 1: title },
    scenes: scenes.map(([from, prompt]) => ({ from, prompt: inPeriod(emptyUnlessNamed(prompt)) })),
  })),
  PSALM_119,
].sort((a, b) => a.chapter - b.chapter);

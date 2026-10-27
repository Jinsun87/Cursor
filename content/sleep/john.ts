import type { SleepChapterPlan } from "./genesis";

/**
 * John for Walk and Sleep. Jesus is painted from one character sheet
 * (content/sleep/characters/jesus.jpg) in every scene that names him, so he looks the same
 * throughout: a first-century Galilean in an undyed tunic and brown cloak, no halo. He is
 * seen at a middle distance, from the side or from behind, never in close-up. The
 * crucifixion is never painted: only the dark hill, the people standing near, and the
 * garden tomb. God is shown only as light; angels only as light within the tomb.
 */
const JESUS = "Jesus, a first-century Galilean man with olive skin, dark shoulder-length hair and a short dark beard, in an undyed cream wool tunic and a brown wool cloak";
const DISCIPLES = "a few Galilean fishermen and working men in plain earth-toned wool tunics and cloaks";
const TEMPLE = "the temple courts in Jerusalem, Herod's temple of pale cream stone with colonnades of tall columns";

/** The look for John: NIGHT_STYLE, with Jesus allowed and kept to his sheet. */
export const GOSPEL_STYLE =
  "Vertical 9:16 composition. Dramatic classical oil painting, chiaroscuro, deep night palette with warm gold light, " +
  "calm and still, reverent, soft edges, Rembrandt and Caravaggio inspired, museum quality. " +
  "Show people only if the scene names them; then few, clothed modestly in simple first-century Galilean and Judean garments of earth-toned wool. " +
  "Jesus appears only when the scene names him and the character sheet is attached, and then exactly as on the sheet, at a middle distance or from the side or behind, never a close-up of his face. " +
  "No other man resembles him. No woman is painted as a Madonna in blue and white. God is shown only as light. " +
  "Full-bleed painting with no frame or border. No halos, no glow around anyone's head, no crosses. No text, no captions, no watermarks, no modern elements.";

const J = ["jesus"];

export const JOHN_PLANS: SleepChapterPlan[] = [
  {
    chapter: 1,
    title: "The Word Became Flesh",
    headings: { 1: "The Word Became Flesh", 19: "The Mission of John the Baptist", 29: "The Lamb of God", 35: "The First Disciples", 43: "Jesus Calls Philip and Nathanael" },
    scenes: [
      { from: 1, prompt: "Light breaking into total darkness over a formless sea at the beginning of all things, a single warm radiance spreading across the deep; no people." },
      { from: 6, prompt: "A lone man in rough camel-hair clothing with a leather belt standing on a rock in the Judean wilderness at dawn, looking toward the rising sun, seen from behind." },
      { from: 14, prompt: "A small village of flat-roofed stone houses in Galilee at evening, lamps glowing in doorways, an ordinary tent of a traveller pitched among them; no people close up." },
      { from: 19, prompt: "The Jordan River at Bethany beyond the Jordan at golden evening, a wild-haired man in camel hair standing knee-deep in the water speaking to priests in white linen turbans on the bank, reeds all around." },
      { from: 29, prompt: `${JESUS}, walking along the bank of the Jordan River at sunset, seen at a distance from behind, while a wild-haired man in camel hair stands in the water pointing toward him.`, cast: J },
      { from: 35, prompt: `Two young fishermen in plain wool following ${JESUS} along a path through tall reeds by the river in the late afternoon, all seen from behind.`, cast: J },
      { from: 43, prompt: "A fig tree on the edge of a Galilean village at evening, a young man resting in its shade, another man running toward him across the field, seen from a little way off." },
    ],
  },
  {
    chapter: 2,
    title: "The Wedding at Cana",
    headings: { 1: "The Wedding at Cana", 12: "Jesus Cleanses the Temple", 23: "Jesus Knows All Men" },
    scenes: [
      { from: 1, prompt: "A village wedding feast in a stone courtyard in Cana at night, lamps strung through an olive tree, guests in festive wool reclining at low tables, musicians with a lyre and drum, seen from a little way off." },
      { from: 6, prompt: "Six large stone water jars standing in a row in a dim storeroom by lamplight, a servant pouring water into one from a clay jug, the jars full to the brim." },
      { from: 9, prompt: "A wooden cup of deep red wine held up to lamplight at a wedding feast, the warm glow of the courtyard behind; only hands visible." },
      { from: 12, prompt: `${JESUS}, standing in ${TEMPLE} by day, overturned money-changers' tables and scattered coins at his feet, sheep and doves fleeing, seen from behind at a distance.`, cast: J },
      { from: 23, prompt: "Jerusalem at night during the Passover feast, thousands of small lamps and campfires on the hills around the city walls, the temple glowing above; no people close up." },
    ],
  },
  {
    chapter: 3,
    title: "You Must Be Born Again",
    headings: { 1: "Jesus and Nicodemus", 22: "John's Testimony about Jesus", 31: "The One from Heaven" },
    scenes: [
      { from: 1, prompt: `A flat rooftop in Jerusalem at night under the stars, an older Pharisee with a grey beard in a fine striped mantle sitting on a bench speaking quietly with ${JESUS}, an oil lamp between them, seen from the side at a distance.`, cast: J },
      { from: 8, prompt: "Wind moving through tall grass and olive trees on a dark hillside at night, leaves stirring under the moon; no people." },
      { from: 14, prompt: "A bronze serpent coiled on a tall plain wooden pole standing in the desert at dusk, with no crossbar, golden light behind it; no people." },
      { from: 16, prompt: "Dawn light spreading over the whole land of Israel seen from a high mountain, the sea and the hills glowing gold; no people." },
      { from: 22, prompt: "A quiet pool of water at Aenon near Salim at evening, many springs among green reeds, a wild-haired man in camel hair baptizing a person in the shallows at a distance." },
      { from: 31, prompt: "The night sky over the Judean hills ablaze with stars, a soft light from above resting on the land; no people." },
    ],
  },
  {
    chapter: 4,
    title: "The Woman at the Well",
    headings: { 1: "Jesus and the Samaritan Woman", 27: "The Disciples Rejoin Jesus", 39: "Many Samaritans Believe", 43: "Jesus Heals an Official's Son" },
    scenes: [
      { from: 1, prompt: `${JESUS}, sitting tired beside an old stone well at noon in Samaria, Mount Gerizim behind, seen from the side at a middle distance, a dusty road leading away.`, cast: J },
      { from: 7, prompt: `A Samaritan woman in a faded red-brown dress and head covering drawing water with a rope and clay jar at a stone well, ${JESUS} seated nearby on the well's rim, the two seen from a little way off at midday.`, cast: J },
      { from: 13, prompt: "Clear water spilling over the stone rim of a deep well and running into the dry ground, green shoots springing up around it, bright light; no people." },
      { from: 27, prompt: "A clay water jar left standing alone beside a stone well in the afternoon, a woman hurrying away along the road toward a hill town in the distance." },
      { from: 35, prompt: "Wide fields of ripe golden grain in Samaria at evening, white for harvest, the low sun across them; no people." },
      { from: 43, prompt: `A worried royal official in a fine dark cloak bowing before ${JESUS} in the street of Cana at midday, seen at a distance from the side.`, cast: J },
      { from: 50, prompt: "A fine house in Capernaum at dawn, a boy sitting up in bed by an open window, servants smiling at the door, morning light pouring in." },
    ],
  },
  {
    chapter: 5,
    title: "The Healing at Bethesda",
    headings: { 1: "The Pool of Bethesda", 16: "The Father and the Son", 31: "Testimonies about Jesus" },
    scenes: [
      { from: 1, prompt: "The Pool of Bethesda in Jerusalem, two stone pools surrounded by five colonnades, many sick people lying on mats in the shade of the columns, the water still, seen from above in early morning light." },
      { from: 5, prompt: `${JESUS}, bending toward a thin man lying on a straw mat beside the pool under a colonnade, seen from behind at a middle distance.`, cast: J },
      { from: 8, prompt: "A man walking away through the colonnade carrying his rolled straw mat on his shoulder, the sun bright on the stones, seen from behind." },
      { from: 16, prompt: `${JESUS}, standing in ${TEMPLE}, speaking to a group of Pharisees in fringed mantles who frown with folded arms, seen from a distance.`, cast: J },
      { from: 31, prompt: "An oil lamp burning brightly on a stand in a dark stone room, its flame steady, light filling the room; no people." },
      { from: 39, prompt: "Rolled scrolls of the Scriptures stacked in wooden niches in a synagogue by lamplight, their writing hidden; no people." },
    ],
  },
  {
    chapter: 6,
    title: "The Bread of Life",
    headings: { 1: "Jesus Feeds the Five Thousand", 16: "Jesus Walks on Water", 22: "Jesus the Bread of Life", 60: "Many Disciples Turn Back", 66: "Peter's Confession" },
    scenes: [
      { from: 1, prompt: "A vast crowd of thousands sitting on the green grassy hillsides above the Sea of Galilee in the late afternoon, in groups, the lake shining below." },
      { from: 8, prompt: "A small boy's woven basket holding five round barley loaves and two small dried fish, set on the grass in golden light; only the basket." },
      { from: 10, prompt: `${JESUS}, standing on a grassy hillside holding a loaf of bread up toward the evening sky giving thanks, a great crowd sitting on the slopes below, seen from behind and far away.`, cast: J },
      { from: 12, prompt: "Twelve woven baskets full of broken barley bread set in a row on the grass at sunset, the crowd leaving down the hillside in the distance." },
      { from: 16, prompt: `A small wooden fishing boat with frightened fishermen rowing on the dark Sea of Galilee at night in a strong wind, and ${JESUS} walking calmly toward them on the water, seen from far away under moonlight.`, cast: J },
      { from: 22, prompt: "The fishing town of Capernaum on the shore of Galilee in the morning, boats pulled up on the stones, a crowd gathering by the synagogue." },
      { from: 35, prompt: "A round loaf of bread broken open on a plain wooden table by a window at dawn, warm light falling on it; no people." },
      { from: 60, prompt: "A road winding away from Capernaum at dusk, many travellers walking away in the distance, seen from behind." },
      { from: 66, prompt: `${JESUS}, with ${DISCIPLES}, sitting together on stones by the lakeshore at dusk, a fire burning low, seen from a distance.`, cast: J },
    ],
  },
  {
    chapter: 7,
    title: "Rivers of Living Water",
    headings: { 1: "Jesus and His Brothers", 10: "Jesus at the Feast of Tabernacles", 25: "Is This the Christ?", 37: "Living Water", 45: "The Unbelief of the Leaders" },
    scenes: [
      { from: 1, prompt: "A village street in Galilee at evening, men in plain wool loading donkeys for a journey to the feast, the hills behind turning gold." },
      { from: 10, prompt: "Jerusalem during the Feast of Tabernacles, rooftops and courtyards covered with little shelters of leafy branches, lamps glowing in them at dusk; people small in the distance." },
      { from: 14, prompt: `${JESUS}, teaching under a colonnade in ${TEMPLE}, people gathered around him listening, seen from a distance.`, cast: J },
      { from: 37, prompt: "A spring of clear water pouring out from a rock in a dry land into a stream, flowing away into the distance under bright evening light; no people." },
      { from: 45, prompt: "A council chamber of dressed stone at night, older men in fine fringed mantles and turbans arguing in lamplight, seen from a little way off." },
    ],
  },
  {
    chapter: 8,
    title: "The Light of the World",
    headings: { 1: "The Woman Caught in Adultery", 12: "The Light of the World", 31: "The Truth Will Set You Free", 48: "Before Abraham Was" },
    scenes: [
      { from: 1, prompt: "The Mount of Olives at dawn, olive groves on its slopes, the walls of Jerusalem across the valley catching the first light; no people." },
      { from: 3, prompt: `${JESUS}, stooping to trace with his finger in the dust of the temple courtyard, leaving only faint wavy lines and no letters or words, his face turned down, a woman in a plain head covering standing alone nearby, scribes walking away in the background, seen from a distance.`, cast: J },
      { from: 12, prompt: "Great golden lampstands blazing in the dark temple courtyard at night, their light spilling over the city of Jerusalem below; no people close up." },
      { from: 31, prompt: "A heavy iron chain lying open and broken on a stone floor in a beam of morning light from a doorway; no people." },
      { from: 48, prompt: "An ancient oak tree at Mamre under a vast night sky of stars, a single tent beside it; no people." },
    ],
  },
  {
    chapter: 9,
    title: "The Man Born Blind",
    headings: { 1: "Jesus Heals the Man Born Blind", 13: "The Pharisees Investigate", 35: "Spiritual Blindness" },
    scenes: [
      { from: 1, prompt: `${JESUS}, with ${DISCIPLES}, stopping on a Jerusalem street before a blind beggar sitting against a wall, seen from a distance in afternoon light.`, cast: J },
      { from: 6, prompt: "A man's hands holding a little mud made from dust beside the closed eyes of a blind man; only the hands and the side of the blind man's face, warm light." },
      { from: 7, prompt: "The Pool of Siloam, stone steps leading down into clear water, a man kneeling at the water's edge washing his face, morning light bursting through." },
      { from: 13, prompt: "A once-blind man standing before a council of stern Pharisees in fringed mantles in a dim stone hall, his elderly parents standing nervously behind him, seen from a little way off." },
      { from: 35, prompt: `${JESUS}, meeting a young man outside the city walls at sunset, the young man kneeling in the road, seen from behind at a middle distance.`, cast: J },
    ],
  },
  {
    chapter: 10,
    title: "The Good Shepherd",
    headings: { 1: "The Good Shepherd and His Sheep", 22: "Jesus at the Feast of Dedication", 31: "The Jews Try to Stone Jesus" },
    scenes: [
      { from: 1, prompt: "A stone sheepfold on a hillside at night, its low walls topped with thorn branches, sheep resting safe inside under the stars, an open gap for a gate; no people." },
      { from: 7, prompt: "A shepherd lying asleep across the narrow gateway of a stone sheepfold at night, his staff beside him, the sheep safe behind him, seen from a little way off." },
      { from: 11, prompt: `${JESUS}, as a shepherd walking ahead of a flock of sheep down a green hillside at golden evening, the sheep following him, seen from behind.`, cast: J },
      { from: 22, prompt: `Winter in Jerusalem, ${JESUS} walking in Solomon's Colonnade of the temple on a grey cold evening, lamps lit along the columns, seen from far away.`, cast: J },
      { from: 27, prompt: "A small lamb resting safely in the strong hands of a shepherd, warm firelight; only the hands and the lamb visible." },
      { from: 40, prompt: "The Jordan River beyond Bethany at dusk, quiet green banks, a few people gathering in the distance; no one close up." },
    ],
  },
  {
    chapter: 11,
    title: "The Raising of Lazarus",
    headings: { 1: "The Death of Lazarus", 17: "Jesus Comforts Martha and Mary", 38: "Jesus Raises Lazarus", 45: "The Plot to Kill Jesus", 54: "Jesus Withdraws" },
    scenes: [
      { from: 1, prompt: "The village of Bethany on the slope of the Mount of Olives at evening, a stone house with a lamp burning in its window, a sense of quiet worry." },
      { from: 17, prompt: `A woman in a plain dark dress and head covering kneeling on the road outside Bethany before ${JESUS}, seen from the side at a middle distance in the afternoon light.`, cast: J },
      { from: 32, prompt: `${JESUS}, standing among mourning friends near the village at dusk, his head bowed, seen from behind at a distance.`, cast: J },
      { from: 38, prompt: "A tomb cut into a rock hillside at evening, a heavy round stone being rolled away from its dark opening by several men, a small crowd watching from a distance." },
      { from: 43, prompt: "Seen from far away at golden sunset: the open doorway of a rock tomb in a hillside, and in front of it two women joyfully embracing a man in a loose white linen garment while friends unwind a long linen cloth from his shoulders, warm and tender, nothing frightening." },
      { from: 45, prompt: "The council of chief priests and Pharisees meeting by lamplight at night in a stone hall, a high priest in a turban speaking, seen from a distance." },
      { from: 54, prompt: "A small village on the edge of the wilderness at Ephraim at dusk, dry hills behind it, a few lamps beginning to glow; no people close up." },
    ],
  },
  {
    chapter: 12,
    title: "The Triumphal Entry",
    headings: { 1: "Mary Anoints Jesus", 12: "The Triumphal Entry", 20: "Jesus Predicts His Death", 37: "Belief and Unbelief" },
    scenes: [
      { from: 1, prompt: `A supper by lamplight in a house in Bethany, a woman kneeling to pour perfume from an alabaster jar over the feet of ${JESUS} as he reclines at a low table, seen from the side at a middle distance.`, cast: J },
      { from: 12, prompt: `${JESUS}, riding a young donkey down the road from the Mount of Olives toward Jerusalem, crowds waving palm branches and laying cloaks on the road, seen from behind and far away in morning light.`, cast: J },
      { from: 20, prompt: "A single grain of wheat lying in dark earth, and beside it a full stalk of golden wheat rising up in the light; no people." },
      { from: 27, prompt: "Thunder clouds over Jerusalem at evening with a great beam of light breaking through onto the temple; no people close up." },
      { from: 35, prompt: "A small clay oil lamp set on a stone beside a dark road at night, its warm circle of light falling on the path ahead, olive trees on either side; no people or figures anywhere." },
      { from: 44, prompt: "Jerusalem at night seen from the Mount of Olives, the temple glowing above the city, stars over the valley; no people." },
    ],
  },
  {
    chapter: 13,
    title: "Jesus Washes the Disciples' Feet",
    headings: { 1: "Jesus Washes His Disciples' Feet", 18: "Jesus Predicts His Betrayal", 31: "A New Commandment" },
    scenes: [
      { from: 1, prompt: "An upper room in Jerusalem at night prepared for a meal, a low table with bread and cups, cushions around it, oil lamps glowing; no people." },
      { from: 4, prompt: `${JESUS}, with a linen towel tied around his waist, kneeling to wash a fisherman's feet in a clay basin in a lamplit upper room, ${DISCIPLES} watching, seen from the side at a middle distance.`, cast: J },
      { from: 18, prompt: `${JESUS}, at the supper table with ${DISCIPLES} reclining around it by lamplight, a troubled silence, seen from a little way off.`, cast: J },
      { from: 30, prompt: "A door standing open onto a dark Jerusalem street at night, a man's shadow disappearing into the darkness, lamplight behind; no face visible." },
      { from: 31, prompt: `${JESUS}, speaking softly to ${DISCIPLES} gathered close around a table by the light of one lamp, seen from behind.`, cast: J },
    ],
  },
  {
    chapter: 14,
    title: "The Way, the Truth and the Life",
    headings: { 1: "In My Father's House", 5: "The Way, the Truth, and the Life", 15: "Jesus Promises the Holy Spirit", 27: "Peace I Leave with You" },
    scenes: [
      { from: 1, prompt: "A great ancient Near Eastern house of pale dressed stone with flat roofs, arched doorways and many rooms around open courtyards, standing on a hill in golden evening light, a lamp glowing in every doorway, a warm welcome; ancient architecture only, nothing modern, no pitched roofs or glass windows; no people." },
      { from: 5, prompt: "A straight path leading through the dark toward a bright open doorway of light on a hill; no people." },
      { from: 15, prompt: "An oil lamp in an upper room at night, its flame steady and gentle, a soft wind moving the curtain at the window; no people." },
      { from: 27, prompt: "A still lake at night under the moon, perfectly calm, the hills around asleep; no people." },
    ],
  },
  {
    chapter: 15,
    title: "The True Vine",
    headings: { 1: "The True Vine", 9: "Love One Another", 18: "The World's Hatred" },
    scenes: [
      { from: 1, prompt: "A great old grapevine heavy with dark grapes climbing over a stone terrace in a vineyard at evening, its branches spreading wide; no people." },
      { from: 5, prompt: "Close view of strong branches growing from a thick vine trunk, clusters of ripe grapes glowing in the last light; no people." },
      { from: 9, prompt: `${DISCIPLES} walking together through a moonlit vineyard on the slopes outside Jerusalem at night, with ${JESUS} among them, seen from behind and far away.`, cast: J },
      { from: 18, prompt: "A narrow lane in Jerusalem at night, shuttered windows and closed doors, a single lamp at the end of the lane; no people." },
    ],
  },
  {
    chapter: 16,
    title: "Your Grief Will Turn to Joy",
    headings: { 1: "The Work of the Holy Spirit", 16: "Grief Will Turn to Joy", 25: "I Have Overcome the World" },
    scenes: [
      { from: 1, prompt: "A soft wind moving through the olive trees on a hillside at night, a faint warm light on the leaves; no people." },
      { from: 16, prompt: "The first light of dawn breaking over dark hills after a long night, the sky turning from deep blue to gold; no people." },
      { from: 21, prompt: "A mother holding her newborn child close by lamplight in a simple room, her face full of quiet joy, seen from the side." },
      { from: 25, prompt: "The sun rising over the hills of Jerusalem in full glory, light pouring across the valleys; no people." },
    ],
  },
  {
    chapter: 17,
    title: "Jesus Prays for His Disciples",
    headings: { 1: "Jesus Prays for Himself", 6: "Jesus Prays for His Disciples", 20: "Jesus Prays for All Believers" },
    scenes: [
      { from: 1, prompt: `${JESUS}, standing with his face lifted toward the night sky in prayer on a hillside above the Kidron Valley, seen from behind, stars overhead.`, cast: J },
      { from: 6, prompt: `${DISCIPLES} sitting together in the shadows of an olive grove at night, listening, ${JESUS} standing a little apart in prayer, seen from far away.`, cast: J },
      { from: 20, prompt: "Countless small lamps glowing in villages across a vast dark land at night, as far as the eye can see, under a sky full of stars; no people close up." },
    ],
  },
  {
    chapter: 18,
    title: "Betrayal and Arrest",
    headings: { 1: "The Betrayal of Jesus", 12: "Jesus Before Annas", 15: "Peter's First Denial", 19: "Jesus Questioned by Annas", 25: "Peter's Second and Third Denials", 28: "Jesus Before Pilate" },
    scenes: [
      { from: 1, prompt: "An olive grove across the Kidron Valley at night, gnarled ancient trees under the moon, torches and lanterns approaching through the trees in the distance." },
      { from: 4, prompt: `${JESUS}, standing calmly among olive trees at night facing a band of soldiers and temple guards with torches and lanterns, seen from behind at a distance.`, cast: J },
      { from: 12, prompt: `${JESUS}, being led away at night by soldiers through the gates of the city, his hands bound, seen from behind and far away, torches around him.`, cast: J },
      { from: 15, prompt: "A charcoal fire burning in the courtyard of the high priest's house at night, servants and guards warming their hands around it, a fisherman in a dark cloak standing among them, his face in shadow." },
      { from: 27, prompt: "A rooster on a low courtyard wall crowing at the first grey light of dawn, the dying embers of a fire below; no people." },
      { from: 28, prompt: `The stone courtyard of the Roman governor's headquarters at dawn, Pilate in a white toga with a purple border standing on steps facing ${JESUS} below, Roman soldiers at the columns, seen from a distance.`, cast: J },
    ],
  },
  {
    chapter: 19,
    title: "The Crucifixion",
    headings: { 1: "Jesus Sentenced to Death", 17: "The Crucifixion", 31: "Jesus' Side Is Pierced", 38: "The Burial of Jesus" },
    scenes: [
      { from: 1, prompt: "A crown woven from thorn branches resting on a stone bench in a Roman courtyard, a purple robe folded beside it, cold morning light; no people." },
      { from: 12, prompt: "The stone Pavement of the governor's judgment seat at noon, an empty raised seat, a restless crowd at a distance beyond the soldiers; no one close up." },
      { from: 17, prompt: "A rocky hill outside the walls of Jerusalem under a darkening sky at midday, storm clouds gathering, the city behind; the hilltop seen from far away, with nothing on it." },
      { from: 23, prompt: "Four Roman soldiers crouched on the ground casting dice for a seamless woven tunic laid on the rocks, seen from a little way off under a dark sky." },
      { from: 25, prompt: "A few women in dark head coverings and a young man standing close together on a rocky slope under a dark sky, looking up, seen from behind; nothing else shown." },
      { from: 31, prompt: "The sun gone dark over Jerusalem in the afternoon, a heavy dim sky, the temple pale in the strange light; no people." },
      { from: 38, prompt: "Two older men in fine cloaks carrying a body wrapped in clean white linen into a garden at dusk, seen from far away, the face covered." },
      { from: 41, prompt: "A new tomb cut into the rock in a quiet garden at nightfall, a great round stone rolled across its entrance, olive trees and flowers around it; no people." },
    ],
  },
  {
    chapter: 20,
    title: "The Resurrection",
    headings: { 1: "The Empty Tomb", 11: "Jesus Appears to Mary Magdalene", 19: "Jesus Appears to the Disciples", 24: "Jesus Appears to Thomas", 30: "The Purpose of John's Book" },
    scenes: [
      { from: 1, prompt: "A garden tomb in the dark just before dawn, the great round stone rolled away from its open entrance, a woman in a dark head covering standing still at a distance." },
      { from: 3, prompt: "Two men running along a garden path toward an open rock tomb in the first grey light of morning, seen from behind." },
      { from: 6, prompt: "Inside a rock tomb at dawn, linen grave cloths lying neatly in place on a stone ledge and the face cloth folded by itself, soft light pouring in from the doorway; no people." },
      { from: 11, prompt: "A woman in a dark head covering weeping outside the open tomb in the garden at sunrise, a soft light glowing inside the tomb, seen from the side." },
      { from: 14, prompt: `${JESUS}, standing in the garden among the olive trees at sunrise, and a woman in a dark head covering turning toward him in surprise, both seen at a distance.`, cast: J },
      { from: 19, prompt: `A locked room in Jerusalem at evening, ${DISCIPLES} gathered in lamplight, and ${JESUS} standing among them, seen from behind and at a distance.`, cast: J },
      { from: 24, prompt: `A lamplit room, a bearded fisherman kneeling before ${JESUS}, seen from the side at a middle distance, the others watching.`, cast: J },
      { from: 30, prompt: "A finished scroll rolled and tied with a cord on a wooden table beside an oil lamp at dawn, its writing hidden; no people." },
    ],
  },
  {
    chapter: 21,
    title: "Breakfast by the Sea",
    headings: { 1: "Jesus Appears by the Sea", 15: "Jesus Restores Peter", 20: "Jesus and the Beloved Disciple" },
    scenes: [
      { from: 1, prompt: "A wooden fishing boat on the Sea of Galilee at night, fishermen hauling in an empty net under the stars, the water dark and still." },
      { from: 4, prompt: `${JESUS}, standing alone on the pebbled shore of the Sea of Galilee at first light, mist on the water, a fishing boat far out on the lake, seen from behind.`, cast: J },
      { from: 6, prompt: "A fishing net so full of silver fish that the fishermen in the boat can barely haul it in, dawn light on the water; the only people are the fishermen in the boat, and nothing and no one stands on the water." },
      { from: 9, prompt: `A small charcoal fire on the lakeshore at sunrise, fish cooking on it and bread beside it, ${JESUS} sitting by the fire with ${DISCIPLES}, seen from a distance.`, cast: J },
      { from: 15, prompt: `${JESUS}, walking along the shore of the Sea of Galilee in the morning beside a bearded fisherman, the two seen from behind, sheep grazing on the hillside above.`, cast: J },
      { from: 20, prompt: "The Sea of Galilee in full morning light, calm and shining, boats pulled up on the shore, the hills green beyond; no people close up." },
      { from: 24, prompt: "A pile of finished scrolls tied with cords on a table by a window open to the morning sea; no people." },
    ],
  },
];

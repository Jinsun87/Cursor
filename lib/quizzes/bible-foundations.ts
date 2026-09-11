import type { Question } from "@/lib/types";

function q(
  prompt: string,
  choices: string[],
  answerIndex: number,
  explanation: string,
): Question {
  return { prompt, choices, answerIndex, explanation };
}

export const PATRIARCHS_AND_EXODUS: Question[] = [
  q("In Genesis, the flood narrative centers on:", ["Noah", "Jonah as the ark builder", "Solomon", "Nehemiah"], 0, "The ark and covenant with Noah close that cycle."),
  q("Jacob is also named:", ["Israel", "Ishmael as his only name", "Esau", "Laban"], 0, "Genesis records the name change after the wrestling scene."),
  q("Joseph interprets dreams for:", ["Pharaoh in Egypt", "Caesar in Rome", "Herod in Galilee", "Cyrus in Persia as a Hebrew slave"], 0, "Genesis 41."),
  q("Moses first meets God at:", ["A burning bush", "The Areopagus", "The empty tomb", "Patmos"], 0, "Exodus 3, at Horeb."),
  q("Passover commemorates:", ["Departure from Egypt and the sparing of Israelite firstborns in the narrative", "The building of the second temple only", "Paul's shipwreck", "The census of Quirinius as its origin"], 0, "Exodus 12."),
  q("In the wilderness, Israel is said to eat:", ["Manna", "Locusts as the daily staple in Exodus", "Roman grain doles", "Fish from the Nile exclusively"], 0, "Exodus 16."),
];

export const PROPHETS_AND_WRITINGS: Question[] = [
  q("Jeremiah is closely tied in the books to:", ["The fall of Jerusalem and the exile", "The founding of Rome", "The Magi's journey as narrator", "The Council of Jerusalem in Acts"], 0, "Jeremiah prophesies in Judah's last years."),
  q("Ezekiel's vision of dry bones is a picture of:", ["National restoration", "A recipe for bread", "Roman military drill", "The building of Noah's ark"], 0, "Ezekiel 37."),
  q("Jonah flees by ship toward:", ["Tarshish", "Bethlehem", "Ur of the Chaldeans as a port", "Damascus"], 0, "He resists the call to Nineveh."),
  q("The book of Job is chiefly a:", ["Wisdom dialogue on suffering", "Travel itinerary of Paul", "King list of Judah only", "Temple inventory"], 0, "Poetic speeches around Job's losses."),
  q("Ecclesiastes famously repeats that much under the sun is:", ["Vanity (or vapor)", "A Roman census", "A genealogy of Levi only", "A psalm of David as its only form"], 0, "The Hebrew hevel is often rendered vanity or vapor."),
  q("Many psalms are superscribed as of:", ["David", "Pontius Pilate", "Luke the physician as psalmist", "Herod Agrippa"], 0, "The Psalter attributes many to David; other authors appear too."),
];

export const GOSPELS_MINISTRY: Question[] = [
  q("Jesus is raised in the town of:", ["Nazareth", "Nineveh", "Babylon", "Athens"], 0, "The Gospels call him Jesus of Nazareth."),
  q("The wedding where water becomes wine is at:", ["Cana", "Jericho only in John", "Rome", "Philippi"], 0, "John 2."),
  q("Much of Jesus' Galilean ministry is set around:", ["The Sea of Galilee", "The Red Sea as a fishing lake", "The Dead Sea as the only setting", "The Aegean"], 0, "Capernaum and the lakeshore towns."),
  q("Gethsemane is the setting of:", ["Prayer before the arrest", "The giving of the law", "Paul's conversion", "Solomon's dedication"], 0, "The garden on the Mount of Olives."),
  q("On the road to Emmaus in Luke, disciples meet:", ["The risen Jesus", "Jonah", "King Saul", "Nebuchadnezzar"], 0, "Luke 24."),
  q("The Great Commission in Matthew sends disciples to:", ["All nations", "Judah only as a permanent limit", "Rome's senate exclusively", "The temple guard"], 0, "Matthew 28."),
];

export const EARLY_CHURCH_PATH: Question[] = [
  q("The first Christian martyr named in Acts is:", ["Stephen", "Goliath", "Ahab", "Festus as a disciple"], 0, "Acts 6–7."),
  q("Cornelius, a centurion, is baptized after a vision in:", ["Caesarea (Acts 10)", "Ur", "Sodom", "Patmos as a Roman fort"], 0, "Peter and the Gentile household."),
  q("Disciples are first called Christians in:", ["Antioch", "Bethlehem in Genesis", "Nineveh in Jonah", "Egypt in Exodus"], 0, "Acts 11."),
  q("Paul speaks at the Areopagus in:", ["Athens", "Jericho", "Hebron", "Samaria as a Greek court"], 0, "Acts 17."),
  q("Priscilla and Aquila are:", ["Tentmakers and coworkers of Paul", "Roman emperors", "Judges of Israel", "Authors of Leviticus"], 0, "Acts 18 and the letters."),
  q("Acts is traditionally paired with which Gospel as a two-volume work?", ["Luke", "Obadiah", "Nahum", "Jude as a travel diary"], 0, "Luke–Acts shares style and address to Theophilus."),
];

export const BIBLE_FOUNDATIONS_REVIEW: Question[] = [
  q("Jacob's other name in Genesis is:", ["Israel", "Pharaoh", "Caesar", "Luke"], 0, "The name of the people is tied to the patriarch."),
  q("Passover in Exodus remembers:", ["The departure from Egypt", "The building of the Colosseum", "The Magi's gifts as its origin", "The fall of Jericho only"], 0, "The meal and the night of departure."),
  q("Ezekiel's dry bones vision concerns:", ["Hope of restoration", "A fishing miracle", "Roman law", "Temple tax tables"], 0, "Ezekiel 37."),
  q("Cana in John is known for:", ["A wedding and wine", "Paul's imprisonment", "The ark's landing", "The tower of Babel"], 0, "The first sign in John."),
  q("Gethsemane is:", ["A garden of prayer before the arrest", "A river in Egypt", "A Persian palace", "A mountain in Sinai only"], 0, "The passion narratives."),
  q("Stephen in Acts is:", ["The first named martyr of the Jerusalem community", "A king of Judah", "A fisherman who wrote Genesis", "A magus from the east"], 0, "Acts 7."),
  q("Christians as a name first appears in Acts at:", ["Antioch", "Eden", "Babylon's hanging gardens", "Mount Carmel as a church name"], 0, "Acts 11:26."),
  q("Luke is also the traditional author of:", ["Acts", "Leviticus", "Amos as a physician's log", "Revelation only"], 0, "The two volumes to Theophilus."),
];

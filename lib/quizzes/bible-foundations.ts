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
  q(
    "In Genesis, the flood narrative centers on:",
    ["Noah", "Jonah as the ark builder", "Solomon", "Nehemiah"],
    0,
    "Faced with human wickedness across the earth, God determined to cleanse creation through a flood, finding grace in Noah, a righteous man blameless among his generation.\n\nNoah obeyed divine instructions to construct a massive wooden ark to preserve his family and pairs of every living creature amidst the rising deluge.\n\nFollowing forty days of rain and the receding waters, God established an everlasting covenant with Noah, sealing it with a rainbow in the sky.",
  ),
  q(
    "Jacob is also named:",
    ["Israel", "Ishmael as his only name", "Esau", "Laban"],
    0,
    "Jacob, the son of Isaac and twin brother of Esau, was known for his cunning youth before wrestling with a divine messenger all night at the river Jabbok.\n\nAt daybreak, the messenger blessed Jacob and gave him the new name Israel, which means 'one who strives with God and prevails.'\n\nJacob's twelve sons became the ancestral patriarchs of the Twelve Tribes of Israel.",
  ),
  q(
    "Joseph interprets dreams for:",
    ["Pharaoh in Egypt", "Caesar in Rome", "Herod in Galilee", "Cyrus in Persia as a Hebrew slave"],
    0,
    "Betrayed by his brothers and imprisoned in Egypt under false accusations, Joseph gained a reputation for accurately interpreting dreams by divine gift.\n\nWhen Pharaoh was troubled by vivid dreams of seven fat cows eaten by seven lean cows, Joseph explained that seven years of abundance would be followed by seven years of severe famine.\n\nImpressed by Joseph's wisdom, Pharaoh elevated him to grand vizier over all Egypt to store grain and save the region.",
  ),
  q(
    "Moses first meets God at:",
    ["A burning bush", "The Areopagus", "The empty tomb", "Patmos"],
    0,
    "While tending the flocks of his father-in-law Jethro at Mount Horeb in the desert of Midian, Moses saw a bush ablaze with fire yet not consumed by the flames.\n\nAs Moses drew near to inspect the miracle, God called him by name from within the bush, instructing him to take off his sandals for he stood on holy ground.\n\nThere God revealed His sacred name 'I AM WHO I AM' and commissioned Moses to liberate Israel from Egyptian bondage.",
  ),
  q(
    "Passover commemorates:",
    ["Departure from Egypt and the sparing of Israelite firstborns in the narrative", "The building of the second temple only", "Paul's shipwreck", "The census of Quirinius as its origin"],
    0,
    "Before the tenth plague struck Egypt, God commanded Israelite families to sacrifice an unblemished lamb and smear its blood on their doorframes.\n\nThat night, the angel of death passed over the homes marked with blood while striking the firstborn of Egypt, prompting Pharaoh to release the Israelites.\n\nPassover remains the foundational feast celebrating divine deliverance, sacrifice, and redemption from slavery.",
  ),
  q(
    "In the wilderness, Israel is said to eat:",
    ["Manna", "Locusts as the daily staple in Exodus", "Roman grain doles", "Fish from the Nile exclusively"],
    0,
    "During forty years of wandering in the Sinai desert, Israel faced severe food shortages and complained against Moses and Aaron.\n\nGod responded by providing bread from heaven called manna—white flakes like coriander seed with the taste of wafers made with honey—appearing every morning with the dew.\n\nHe also sent evening flocks of quail, sustaining a nation of over a million people throughout their wilderness journey.",
  ),
];

export const PROPHETS_AND_WRITINGS: Question[] = [
  q(
    "Jeremiah is closely tied in the books to:",
    ["The fall of Jerusalem and the exile", "The founding of Rome", "The Magi's journey as narrator", "The Council of Jerusalem in Acts"],
    0,
    "Known as the 'Weeping Prophet', Jeremiah ministered during the tragic final decades of the Kingdom of Judah as Babylonian armies advanced.\n\nJeremiah faithfully warned kings and citizens to turn from idolatry and social injustice, but his messages were met with beatings, imprisonment, and rejection.\n\nHe witnessed the tragic siege and destruction of Jerusalem in 586 BC, mourning over the city in the Book of Lamentations while promising a coming New Covenant.",
  ),
  q(
    "Ezekiel's vision of dry bones is a picture of:",
    ["National restoration", "A recipe for bread", "Roman military drill", "The building of Noah's ark"],
    0,
    "While living among Jewish exiles beside the Kebar River in Babylon, Ezekiel was transported by God's Spirit to a valley filled with dry, scattered human bones.\n\nGod asked Ezekiel, 'Son of man, can these bones live?', instructing him to prophesy to the bones until breath entered them and they stood up as a vast army.\n\nThis dramatic vision symbolized God's solemn promise to resurrect the hopeless nation of Israel and restore them to their land.",
  ),
  q(
    "Jonah flees by ship toward:",
    ["Tarshish", "Bethlehem", "Ur of the Chaldeans as a port", "Damascus"],
    0,
    "Commissioned by God to preach judgment to the brutal Assyrian city of Nineveh, Jonah rebelled and boarded a merchant vessel sailing toward Tarshish in the opposite direction.\n\nA violent storm threatened to break the ship apart, prompting pagan sailors to cast lots, which pointed to Jonah as the cause of divine wrath.\n\nAfter Jonah was cast into the sea and swallowed by a great fish, he prayed in repentance and was vomited onto dry land to fulfill his mission.",
  ),
  q(
    "The book of Job is chiefly a:",
    ["Wisdom dialogue on suffering", "Travel itinerary of Paul", "King list of Judah only", "Temple inventory"],
    0,
    "The Book of Job is a poetic masterpiece wrestling with the mystery of why innocent human beings suffer under a sovereign, just God.\n\nJob, an upright man who lost his children, wealth, and health in a single day, endured bitter speeches from well-meaning friends who insisted his pain was secret punishment.\n\nWhen God spoke out of a whirlwind, He pointed to the majesty of creation, revealing that human wisdom cannot fully fathom divine providence.",
  ),
  q(
    "Ecclesiastes famously repeats that much under the sun is:",
    ["Vanity (or vapor)", "A Roman census", "A genealogy of Levi only", "A psalm of David as its only form"],
    0,
    "Attributed to Solomon ('the Teacher'), Ecclesiastes explores human pursuits like wealth, pleasure, ambition, and intellectual wisdom.\n\nThe author repeatedly declares these earthly striving to be 'vanity' (Hebrew *hevel*, meaning a fleeting vapor or chasing the wind) when detached from God.\n\nThe book concludes with timeless perspective: 'Fear God and keep his commandments, for this is the whole duty of man.'",
  ),
  q(
    "Many psalms are superscribed as of:",
    ["David", "Pontius Pilate", "Luke the physician as psalmist", "Herod Agrippa"],
    0,
    "The Book of Psalms is Israel's ancient prayerbook and hymnal, gathering 150 poetic songs used in temple worship and personal devotion.\n\nOver seventy psalms are attributed to David, reflecting his life experiences from shepherd boy and fugitive to king of Jerusalem.\n\nThe Psalter spans every human emotion—from exuberant praise and thanksgiving to deep lament, repentance, and longing for redemption.",
  ),
];

export const GOSPELS_MINISTRY: Question[] = [
  q(
    "Jesus is raised in the town of:",
    ["Nazareth", "Nineveh", "Babylon", "Athens"],
    0,
    "Nazareth was a small, quiet agricultural village nestled in the hills of lower Galilee, carrying little reputation in 1st-century Judea.\n\nFollowing the return of Joseph and Mary from Egypt, Jesus grew up in Nazareth, learning Joseph's trade as a carpenter (*tekton*).\n\nWhen Jesus began His public ministry, skeptics famously asked: 'Can anything good come out of Nazareth?', yet He became known worldwide as Jesus of Nazareth.",
  ),
  q(
    "The wedding where water becomes wine is at:",
    ["Cana", "Jericho only in John", "Rome", "Philippi"],
    0,
    "At a wedding feast in Cana of Galilee, Mary informed Jesus that the host family had run out of wine, a major social embarrassment in ancient Jewish culture.\n\nJesus instructed servants to fill six stone water jars used for ceremonial washing with water, holding twenty to thirty gallons each.\n\nWhen the master of the feast tasted the liquid, he marvelled that the best wine had been saved for last, marking Jesus' first public sign in John's Gospel.",
  ),
  q(
    "Much of Jesus' Galilean ministry is set around:",
    ["The Sea of Galilee", "The Red Sea as a fishing lake", "The Dead Sea as the only setting", "The Aegean"],
    0,
    "The Sea of Galilee, a freshwater lake surrounded by fertile hills, served as the primary setting for Jesus' public preaching and miracles.\n\nFishing villages along the shore—such as Capernaum, Bethsaida, and Magdala—became home to His core disciples, including Peter, Andrew, James, and John.\n\nFrom boats on the water and hillsides by the lake, Jesus taught crowds, healed the sick, cast out demons, and walked upon the waves.",
  ),
  q(
    "Gethsemane is the setting of:",
    ["Prayer before the arrest", "The giving of the law", "Paul's conversion", "Solomon's dedication"],
    0,
    "Gethsemane, an olive orchard at the base of the Mount of Olives east of Jerusalem, was a quiet place where Jesus frequently retreated with His disciples.\n\nOn the night before His crucifixion, Jesus experienced agonizing anguish, praying until His sweat became like drops of blood: 'Father, if you are willing, take this cup from me; yet not my will, but yours be done.'\n\nMinutes later, Judas Iscariot arrived with an armed crowd, identifying Jesus with a kiss.",
  ),
  q(
    "On the road to Emmaus in Luke, disciples meet:",
    ["The risen Jesus", "Jonah", "King Saul", "Nebuchadnezzar"],
    0,
    "On Easter Sunday afternoon, two heart-broken disciples walked seven miles from Jerusalem to the village of Emmaus, discussing the execution of Jesus.\n\nThe risen Jesus joined them incognito, asking about their grief and explaining how Moses and the Prophets foretold the Messiah's suffering and glory.\n\nWhen Jesus stayed to break bread at their evening meal, their eyes were opened to recognize Him, whereupon He vanished from their sight.",
  ),
  q(
    "The Great Commission in Matthew sends disciples to:",
    ["All nations", "Judah only as a permanent limit", "Rome's senate exclusively", "The temple guard"],
    0,
    "Following His resurrection, Jesus met His eleven apostles on a mountain in Galilee, declaring that all authority in heaven and on earth had been given to Him.\n\nHe commanded them: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.'\n\nJesus promised His abiding presence to the end of the age, transforming a small movement into a worldwide faith.",
  ),
];

export const EARLY_CHURCH_PATH: Question[] = [
  q(
    "The first Christian martyr named in Acts is:",
    ["Stephen", "Goliath", "Ahab", "Festus as a disciple"],
    0,
    "Stephen was one of seven men chosen by the early Jerusalem church for his full spiritual wisdom to oversee food distribution to widows.\n\nFull of grace and power, Stephen performed miracles and debated Jewish leaders, leading to his arrest on false blasphemy charges.\n\nAfter delivering a brilliant speech summarizing salvation history, Stephen was dragged outside the city and stoned, praying: 'Lord, do not hold this sin against them.'",
  ),
  q(
    "Cornelius, a centurion, is baptized after a vision in:",
    ["Caesarea (Acts 10)", "Ur", "Sodom", "Patmos as a Roman fort"],
    0,
    "Cornelius was a God-fearing Roman centurion stationed in Caesarea who prayed regularly and gave generously to the poor.\n\nAn angel appeared to Cornelius in a vision, instructing him to send for Simon Peter in Joppa, while Peter simultaneously received a vision of clean and unclean animals.\n\nWhen Peter arrived and preached the Gospel, the Holy Spirit fell upon Gentile listeners, opening Christian baptism to non-Jewish believers.",
  ),
  q(
    "Disciples are first called Christians in:",
    ["Antioch", "Bethlehem in Genesis", "Nineveh in Jonah", "Egypt in Exodus"],
    0,
    "Following the martyrdom of Stephen, persecuted believers fled north to Syrian Antioch, the third largest city in the Roman Empire.\n\nThere, believers began preaching Jesus to Greek Gentiles, forming a vibrant multi-ethnic church led by Barnabas and Paul.\n\nThe local pagan population gave the disciples the nickname 'Christians' ('followers of Christ'), which became the permanent identifier of believers.",
  ),
  q(
    "Paul speaks at the Areopagus in:",
    ["Athens", "Jericho", "Hebron", "Samaria as a Greek court"],
    0,
    "While waiting in Athens, the intellectual cultural heart of the ancient world, Paul was deeply stirred by the city filled with idols.\n\nEpicurean and Stoic philosophers invited Paul to address the Areopagus (Mars Hill), the supreme court of Athenian intellectuals.\n\nPaul used an altar inscribed 'To an Unknown God' to preach the Creator, repentance, and the resurrection of Jesus Christ.",
  ),
  q(
    "Priscilla and Aquila are:",
    ["Tentmakers and coworkers of Paul", "Roman emperors", "Judges of Israel", "Authors of Leviticus"],
    0,
    "Aquila and his wife Priscilla were Jewish Christians forced to leave Rome when Emperor Claudius expelled Jews from the city.\n\nSettling in Corinth, they met Paul, who shared their trade of tentmaking, working and living together while planting the Corinthian church.\n\nThey later ministered in Ephesus, famously taking the eloquent preacher Apollos aside to explain the way of God more accurately.",
  ),
  q(
    "Acts is traditionally paired with which Gospel as a two-volume work?",
    ["Luke", "Obadiah", "Nahum", "Jude as a travel diary"],
    0,
    "The Gospel of Luke and the Book of Acts were written by Luke the physician as a unified two-volume narrative addressed to Theophilus.\n\nVolume one records all that Jesus began to do and teach from His birth to Ascension, while volume two records Christ's ongoing work through the Holy Spirit.\n\nTogether, Luke-Acts constitutes over a quarter of the entire New Testament canon.",
  ),
];

export const BIBLE_FOUNDATIONS_REVIEW: Question[] = [
  q(
    "Jacob's other name in Genesis is:",
    ["Israel", "Pharaoh", "Caesar", "Luke"],
    0,
    "Jacob earned the name Israel after his transformative wrestling match at Penuel before reconciling with his brother Esau.\n\nHis twelve sons gave rise to the twelve tribes that formed the covenant nation of Israel throughout Old Testament history.\n\nThe name signifies 'striving with God' and finding divine blessing through grace.",
  ),
  q(
    "Passover in Exodus remembers:",
    ["The departure from Egypt", "The building of the Colosseum", "The Magi's gifts as its origin", "The fall of Jericho only"],
    0,
    "Passover commemorates the solemn night when God delivered the Israelites from Egyptian bondage.\n\nBy marking their doorposts with sacrificial lamb blood, Israelite homes were spared while Pharaoh was compelled to let God's people go.\n\nPassover remains the foundational holiday celebrating redemption, freedom, and divine protection.",
  ),
  q(
    "Ezekiel's dry bones vision concerns:",
    ["Hope of restoration", "A fishing miracle", "Roman law", "Temple tax tables"],
    0,
    "Ezekiel's vision of the valley of dry bones delivered hope to despairing Jewish exiles in Babylon.\n\nAs God's Spirit breathed life into dry bones, they assembled into a living army, symbolizing the rebirth of Israel.\n\nIt stands as a testament that God can resurrect dead hopes and restore broken nations.",
  ),
  q(
    "Cana in John is known for:",
    ["A wedding and wine", "Paul's imprisonment", "The ark's landing", "The tower of Babel"],
    0,
    "Cana of Galilee was the site of Jesus' miraculous first sign recorded in John's Gospel.\n\nBy transforming water into high quality wine at a wedding, Jesus revealed His divine glory and brought joy to the celebration.\n\nHis disciples saw the sign and put their faith in Him.",
  ),
  q(
    "Gethsemane is:",
    ["A garden of prayer before the arrest", "A river in Egypt", "A Persian palace", "A mountain in Sinai only"],
    0,
    "Gethsemane was an olive press garden on the slopes of the Mount of Olives where Jesus prayed before His passion.\n\nThere He wrestled in intense prayer, surrendering His will to the Father's redemptive plan.\n\nIt remains a sacred site remembering Christ's sacrificial devotion.",
  ),
  q(
    "Stephen in Acts is:",
    ["The first named martyr of the Jerusalem community", "A king of Judah", "A fisherman who wrote Genesis", "A magus from the east"],
    0,
    "Stephen was a deacon known for his spiritual wisdom, miracles, and fearless defense of the Gospel.\n\nWhen condemned by the Sanhedrin, he saw the heavens open and Jesus standing at the right hand of God.\n\nAs he was stoned, Stephen prayed for his accusers, leaving a powerful testimony that inspired Saul of Tarsus.",
  ),
  q(
    "Christians as a name first appears in Acts at:",
    ["Antioch", "Eden", "Babylon's hanging gardens", "Mount Carmel as a church name"],
    0,
    "In the vibrant Gentile mission city of Syrian Antioch, disciples were first called Christians.\n\nThe title reflected their distinct devotion to Christ as Lord above Roman emperors or local idols.\n\nAntioch became the missionary springboard sending Paul and Barnabas across the Mediterranean world.",
  ),
  q(
    "Luke is also the traditional author of:",
    ["Acts", "Leviticus", "Amos as a physician's log", "Revelation only"],
    0,
    "Luke, a Gentile physician and traveling companion of Paul, authored both the Gospel of Luke and the Book of Acts.\n\nHis orderly historical research preserved essential eyewitness accounts of Jesus' life and the early church's spread.\n\nLuke's writings emphasize compassion for the marginalized, prayer, and the work of the Holy Spirit.",
  ),
];

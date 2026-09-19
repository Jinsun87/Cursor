import type { Question, QuizChapter } from "@/lib/types";

function q(
  prompt: string,
  choices: string[],
  answerIndex: number,
  explanation: string,
  image?: string,
): Question {
  return { prompt, choices, answerIndex, explanation, image };
}

export const IMAGE_BIBLE_CHAPTERS: QuizChapter[] = [
  {
    title: "Act I: Creation, Patriarchs & Early Marvels",
    subtitle: "Look at the artwork and identify the Genesis and Patriarchal scenes",
    startIndex: 0,
  },
  {
    title: "Act II: Exodus, Judges, Kings & Prophets",
    subtitle: "Identify the miraculous deliverances, temple marvels, and prophetic visions",
    startIndex: 10,
  },
  {
    title: "Act III: Gospels, Miracles of Christ & Revelation",
    subtitle: "Identify the life, miracles, passion of Jesus, and the heavenly vision",
    startIndex: 20,
  },
];

export const IMAGE_BIBLE_QUESTIONS: Question[] = [
  // --- Act I: Creation, Patriarchs & Early Marvels (1–10) ---
  q(
    "Look at the picture: Which famous biblical event is depicted here?",
    ["Daniel in the Lions' Den", "Joseph in Egypt", "Samson at the Temple", "David before Saul"],
    0,
    "In Daniel chapter 6, King Darius was tricked into passing a decree forbidding prayer to any god except himself for thirty days.\n\nDaniel remained faithful, praying three times daily by his open window facing Jerusalem. Thrown into the pit of hungry lions, God sent His angel to shut their mouths, and Daniel emerged unharmed.",
    "/images/quizzes/look-at-the-picture-bible/q1.png",
  ),
  q(
    "Look at the artwork: What famous mountain summit is shown where the vessel rested?",
    ["Mount Sinai", "Mount Ararat", "Mount Carmel", "Mount of Olives"],
    1,
    "Genesis 8:4 records that after forty days and nights of deluge, Noah's ark rested upon the mountains of Ararat.\n\nNoah sent out a raven and a dove to test whether floodwaters had receded. When the dove returned with a freshly plucked olive leaf, Noah knew land was emerging.",
    "/images/quizzes/look-at-the-picture-bible/q2.png",
  ),
  q(
    "Identify the scene: Which prophet was called by God from a bush that burned without being consumed?",
    ["Elijah", "Moses", "Elisha", "Jeremiah"],
    1,
    "Exodus chapter 3 takes place at Mount Horeb (Sinai), where Moses pastured the flock of Jethro.\n\nAn angel of the Lord appeared in flames of fire from within a desert bush that burned without being consumed. God commanded Moses to take off his sandals on holy ground and commissioned him to lead Israel out of Egypt.",
    "/images/quizzes/look-at-the-picture-bible/q3.png",
  ),
  q(
    "Look at the image: Which miracle occurred when Moses raised his staff over the waters?",
    ["Water Turned into Wine", "Parting of the Red Sea", "Water From the Rock at Horeb", "Stilling the Storm"],
    1,
    "Exodus 14 describes Israel trapped between Pharaoh's chariots and the Red Sea.\n\nMoses stretched his staff over the sea, and God drove back the waters with a strong east wind all night, forming walls of water on either side so the people crossed on dry ground.",
    "/images/quizzes/look-at-the-picture-bible/q4.png",
  ),
  q(
    "Look at the artwork: Which young shepherd defeated the Philistine champion in the Valley of Elah?",
    ["Jonathan", "David", "Gideon", "Saul"],
    1,
    "1 Samuel 17 recounts how Goliath of Gath taunted Israel's army for forty days.\n\nYoung David, refusing royal armor and armed only with his shepherd's staff, sling, and five smooth stones from the brook, confronted the giant in the name of the Lord. A single stone to the forehead brought Goliath down.",
    "/images/quizzes/look-at-the-picture-bible/q5.png",
  ),
  q(
    "Look at the picture: Which paradise and sacred garden is depicted with the Tree of Life?",
    ["Garden of Eden", "Garden of Gethsemane", "Plain of Mamre", "Valley of Eshcol"],
    0,
    "Genesis 2 describes the Garden of Eden planted by God in the east, watered by a river dividing into four streams.\n\nAt its heart stood the Tree of Life and the Tree of the Knowledge of Good and Evil, where humanity walked in perfect fellowship with their Creator.",
    "/images/quizzes/look-at-the-picture-bible/q6.png",
  ),
  q(
    "Look at the image: What ambitious ancient monument was built in the land of Shinar?",
    ["Solomon's Temple", "Walls of Jericho", "Tower of Babel", "Colossus of Rhodes"],
    2,
    "Genesis 11 recounts humanity uniting in the plain of Shinar to build a city and a tower reaching to the heavens to make a name for themselves.\n\nGod dispersed them across the face of the earth by confusing their single common tongue into multiple languages.",
    "/images/quizzes/look-at-the-picture-bible/q7.png",
  ),
  q(
    "Look at the artwork: To which patriarch did God promise descendants as numerous as the night stars?",
    ["Abraham", "Isaac", "Noah", "Jacob"],
    0,
    "Genesis 15:5 describes God bringing Abram outside his tent in the quiet of night, telling him to look up and count the stars.\n\nGod declared: 'So shall your offspring be.' Scripture records that Abram believed the Lord, and it was counted to him as righteousness.",
    "/images/quizzes/look-at-the-picture-bible/q8.png",
  ),
  q(
    "Look at the scene: Which patriarch wrestled all night with an angel until daybreak, receiving the name Israel?",
    ["Abraham", "Isaac", "Jacob", "Joseph"],
    2,
    "Genesis 32 describes Jacob left alone by the Jabbok river before reuniting with his brother Esau.\n\nA man wrestled with him until dawn, dislocating Jacob's hip. Jacob refused to let go until he was blessed, receiving the new name 'Israel' (he who strives with God). Jacob named the place Peniel, saying 'I saw God face to face.'",
    "/images/quizzes/look-at-the-picture-bible/q9.png",
  ),
  q(
    "Look at the artwork: Which son of Jacob was sold into slavery by his brothers after receiving an ornate coat?",
    ["Benjamin", "Joseph", "Judah", "Reuben"],
    1,
    "Genesis 37 recounts how Jacob favored Joseph, giving him a richly ornamented robe of many colors.\n\nSpurred by jealousy over his dreams of sheaves and stars bowing to him, Joseph's brothers threw him into a dry cistern and sold him to Midianite merchants heading to Egypt.",
    "/images/quizzes/look-at-the-picture-bible/q10.png",
  ),

  // --- Act II: Exodus, Judges, Kings & Prophets (11–20) ---
  q(
    "Look at the picture: Which covenant law was given to Moses amidst smoke and lightning upon Mount Sinai?",
    ["The Ten Commandments", "The Beatitudes", "The Priestly Blessing", "The Shema"],
    0,
    "Exodus 20 and 31 describe Moses receiving the tablets of stone inscribed by the finger of God atop cloud-covered Mount Sinai.\n\nThese Decalogue commandments established the foundational moral and spiritual covenant for Israel.",
    "/images/quizzes/look-at-the-picture-bible/q11.png",
  ),
  q(
    "Look at the artwork: Which sacred sanctuary traveled with Israel through the wilderness, housing the Golden Lampstand and Ark?",
    ["Temple of Solomon", "High Place at Gibeon", "The Tabernacle", "Synagogue at Capernaum"],
    2,
    "Exodus 25–40 describes the Tabernacle (Mishkan), the portable desert tent of meeting constructed according to the precise pattern shown on the mount.\n\nIt held the Golden Menorah, the Table of Showbread, the Altar of Incense, and the Ark of the Covenant beneath the Mercy Seat.",
    "/images/quizzes/look-at-the-picture-bible/q12.png",
  ),
  q(
    "Look at the image: Which fortified Canaanite city fell after Israel marched around it for seven days blowing rams' horns?",
    ["Ai", "Jericho", "Gibeon", "Hazor"],
    1,
    "Joshua 6 details the battle of Jericho. On the seventh day, after seven circuits around the city walls, the priests sounded their shofars and the people shouted.\n\nThe mighty walls collapsed flat, allowing Israel to enter and conquer the city as God had promised.",
    "/images/quizzes/look-at-the-picture-bible/q13.png",
  ),
  q(
    "Look at the picture: Which judge of Israel brought down the pillars of the Philistine temple in Gaza?",
    ["Gideon", "Jephthah", "Barak", "Samson"],
    3,
    "Judges 16 recounts Samson's final victory. Blinded and chained between two central pillars of Dagon's temple, Samson prayed for one last surge of strength.\n\nPushing against the stone pillars with all his might, the entire temple collapsed upon the Philistine rulers and thousands gathered.",
    "/images/quizzes/look-at-the-picture-bible/q14.png",
  ),
  q(
    "Look at the artwork: Which devoted Moabite woman is shown gleaning leftover barley in the fields of Boaz?",
    ["Ruth", "Esther", "Hannah", "Rahab"],
    0,
    "The Book of Ruth tells the story of Ruth remaining steadfast with her mother-in-law Naomi in Bethlehem.\n\nWhile gleaning dropped grain in the barley harvest, she found grace in the eyes of the landowner Boaz, who became her kinsman-redeemer, placing her in the ancestral line of King David and Jesus.",
    "/images/quizzes/look-at-the-picture-bible/q15.png",
  ),
  q(
    "Look at the scene: Which prophet called down fire from heaven to consume his drenched water-soaked sacrifice?",
    ["Elisha", "Samuel", "Elijah", "Isaiah"],
    2,
    "1 Kings 18 describes the dramatic confrontation on Mount Carmel between Elijah and 450 prophets of Baal.\n\nAfter drenching the altar with twelve jars of water, Elijah prayed a simple prayer, and divine fire fell from heaven, consuming the bull, wood, stones, soil, and water in the trench.",
    "/images/quizzes/look-at-the-picture-bible/q16.png",
  ),
  q(
    "Look at the artwork: Which prophet witnessed Elijah being taken up to heaven in a chariot and whirlwind of fire?",
    ["Nathan", "Elisha", "Hosea", "Micah"],
    1,
    "2 Kings 2 records Elijah and Elisha crossing the Jordan river on dry ground.\n\nSuddenly a chariot and horses of fire appeared, separating the two men, and Elijah ascended into heaven in a whirlwind. Elisha picked up Elijah's fallen mantle and inherited a double portion of his spirit.",
    "/images/quizzes/look-at-the-picture-bible/q17.png",
  ),
  q(
    "Look at the picture: Which king of Israel demonstrated renowned divine wisdom by proposing to divide a child in half?",
    ["Solomon", "David", "Hezekiah", "Josiah"],
    0,
    "1 Kings 3:16–28 recounts two mothers claiming the same infant before King Solomon.\n\nSolomon commanded a sword be brought to cut the living baby in two. The true mother immediately offered to give up her child rather than see it harmed, revealing the true parent and demonstrating God's wisdom in Solomon.",
    "/images/quizzes/look-at-the-picture-bible/q18.png",
  ),
  q(
    "Look at the image: Which reluctant prophet was swallowed and delivered onto dry shore by a great fish?",
    ["Amos", "Habakkuk", "Joel", "Jonah"],
    3,
    "The Book of Jonah describes the prophet fleeing God's command to preach in Nineveh by boarding a ship to Tarshish.\n\nThrown into a storm-tossed sea, Jonah was swallowed by a great sea creature. After praying from the depths for three days and nights, the fish vomited him safely onto dry land.",
    "/images/quizzes/look-at-the-picture-bible/q19.png",
  ),
  q(
    "Look at the artwork: Which prophet was led by the Spirit into a valley filled with dry bones that came to life?",
    ["Daniel", "Ezekiel", "Zechariah", "Jeremiah"],
    1,
    "Ezekiel 37 recounts the prophet brought in vision to a vast valley strewn with dried human bones.\n\nAs Ezekiel prophesied at God's command, rattling bone connected to bone, sinews and flesh formed, and the breath of the four winds entered them, raising a vast living army symbolizing Israel's restoration.",
    "/images/quizzes/look-at-the-picture-bible/q20.png",
  ),

  // --- Act III: Gospels, Miracles of Christ & Revelation (21–30) ---
  q(
    "Look at the picture: What wondrous sign in the heavens led the Magi to the newborn King in Bethlehem?",
    ["The Star of Bethlehem", "A Solar Eclipse", "A Fiery Comet", "The Northern Lights"],
    0,
    "Matthew 2 and Luke 2 record the birth of Jesus in Bethlehem.\n\nAngels proclaimed good news to shepherds watching their flocks by night, and an extraordinary celestial star guided eastern Magi to worship the young Christ with gold, frankincense, and myrrh.",
    "/images/quizzes/look-at-the-picture-bible/q21.png",
  ),
  q(
    "Look at the artwork: In which river was Jesus baptized by John as the Spirit descended like a dove?",
    ["Euphrates River", "Nile River", "Jordan River", "Tigris River"],
    2,
    "Matthew 3:13–17 describes Jesus coming from Galilee to be baptized by John in the Jordan River.\n\nAs Jesus emerged from the water, the heavens opened, the Holy Spirit descended like a dove upon Him, and the Father's voice declared: 'This is my beloved Son, with whom I am well pleased.'",
    "/images/quizzes/look-at-the-picture-bible/q22.png",
  ),
  q(
    "Look at the image: On which body of water did Jesus command 'Peace, be still!' to calm a furious tempest?",
    ["Red Sea", "Sea of Galilee", "Dead Sea", "Mediterranean Sea"],
    1,
    "Mark 4:35–41 recounts Jesus asleep on a cushion in the stern of the disciples' fishing boat when a furious squall struck the Sea of Galilee.\n\nWoken by fearful disciples, Jesus rebuked the wind and ordered the surging waves: 'Peace, be still!' Immediately the storm ceased into complete calm.",
    "/images/quizzes/look-at-the-picture-bible/q23.png",
  ),
  q(
    "Look at the picture: Which miracle involved multiplying five barley loaves and two small fish to feed thousands?",
    ["Feeding of the 5,000", "Wedding at Cana", "Draft of Fishes", "Manna in the Morning"],
    0,
    "John 6 tells of a crowd of over five thousand following Jesus to a hillside near Bethsaida.\n\nTaking a boy's modest meal of five barley loaves and two small fish, Jesus gave thanks, broke them, and distributed them to the seated crowds. Everyone ate until satisfied, filling twelve baskets with leftover fragments.",
    "/images/quizzes/look-at-the-picture-bible/q24.png",
  ),
  q(
    "Look at the scene: Which disciple stepped out of the fishing vessel to walk on the water toward Jesus?",
    ["John", "James", "Andrew", "Peter"],
    3,
    "Matthew 14:22–33 describes the disciples struggling against waves before dawn when Jesus approached walking on the water.\n\nAt Jesus' invitation, Simon Peter climbed out of the boat and walked on the sea. But feeling the fierce wind, fear overcame him and he began to sink until Jesus reached out His hand and caught him.",
    "/images/quizzes/look-at-the-picture-bible/q25.png",
  ),
  q(
    "Look at the artwork: Whom did Jesus call out from the tomb after being dead for four days in Bethany?",
    ["Jairus' Daughter", "Lazarus", "The Widow's Son", "Bartimaeus"],
    1,
    "John 11 recounts the resurrection of Lazarus in Bethany. His sisters Mary and Martha wept as Jesus stood before the cave sealed with a heavy stone.\n\nAfter weeping and praying to the Father, Jesus called in a loud voice: 'Lazarus, come out!' The man who had been dead four days walked forth, wrapped in graveclothes.",
    "/images/quizzes/look-at-the-picture-bible/q26.png",
  ),
  q(
    "Look at the image: What plant fronds were waved by the crowds as Jesus rode into Jerusalem on a donkey?",
    ["Palm Branches", "Olive Branches", "Cedar Boughs", "Grape Vines"],
    0,
    "Matthew 21:1–11 and John 12 describe the Triumphal Entry on Palm Sunday.\n\nFulfilling Zechariah's prophecy, Jesus rode into Jerusalem on a young donkey while joyous crowds laid cloaks on the road, waving palm branches and shouting: 'Hosanna to the Son of David! Blessed is he who comes in the name of the Lord!'",
    "/images/quizzes/look-at-the-picture-bible/q27.png",
  ),
  q(
    "Look at the picture: At which gathering did Jesus break bread and share the cup, establishing the New Covenant?",
    ["Wedding at Cana", "Breakfast on the Shore", "The Last Supper", "Road to Emmaus Meal"],
    2,
    "Luke 22:14–20 and Matthew 26 depict Jesus gathered with His twelve apostles in an upper room for the Passover meal.\n\nInstituting the Lord's Supper, He took bread, broke it, and gave it saying: 'This is my body given for you.' Taking the cup, He declared: 'This is the new covenant in my blood poured out for you.'",
    "/images/quizzes/look-at-the-picture-bible/q28.png",
  ),
  q(
    "Look at the artwork: To which faithful follower did the risen Christ first appear outside the empty garden tomb?",
    ["Salome", "Mary Magdalene", "Joanna", "Martha"],
    1,
    "John 20:11–18 recounts Mary Magdalene weeping outside the rock-hewn tomb early on Easter morning.\n\nTurning and initially mistaking the figure for the gardener, Jesus called her by name: 'Mary!' Recognizing her Lord, she exclaimed 'Rabboni!' (Teacher) and ran to declare to the disciples that He was risen.",
    "/images/quizzes/look-at-the-picture-bible/q29.png",
  ),
  q(
    "Look at the final vision: What glorious holy city was shown to John descending out of heaven from God?",
    ["The New Jerusalem", "Mount Zion", "Babylon the Great", "The Garden Restored"],
    0,
    "Revelation 21 depicts the apostle John's breathtaking vision on the Isle of Patmos of a new heaven and new earth.\n\nHe saw the Holy City, the New Jerusalem, descending from God like a bride adorned for her husband, radiant with jasper, gold clear as glass, twelve pearl gates, and where God wipes away every tear.",
    "/images/quizzes/look-at-the-picture-bible/q30.png",
  ),
];

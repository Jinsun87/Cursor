import type { Book, Chapter, ReadingPlan, WordSpark } from "./types";

export const BOOKS: Book[] = [
  {
    slug: "genesis",
    title: "Genesis",
    testament: "OT",
    totalChapters: 50,
    summary: "The book of origins: creation, covenant, the patriarchs, and God's faithfulness across generations.",
    featuredChapterNumbers: [1, 12],
  },
  {
    slug: "exodus",
    title: "Exodus",
    testament: "OT",
    totalChapters: 40,
    summary: "Deliverance from bondage, the pillar of cloud and fire, the covenant at Sinai, and the sacred tabernacle.",
    featuredChapterNumbers: [3, 14],
  },
  {
    slug: "1-samuel",
    title: "1 Samuel",
    testament: "OT",
    totalChapters: 31,
    summary: "From the judges to kings: Hannah's prayer, the rise of Samuel, Saul's tragic reign, and David's courageous faith.",
    featuredChapterNumbers: [17],
  },
  {
    slug: "psalms",
    title: "Psalms",
    testament: "OT",
    totalChapters: 150,
    summary: "The inspired hymnbook of Israel: prayers of deliverance, songs of ascent, royal psalms, and shepherd wisdom.",
    featuredChapterNumbers: [23],
  },
  {
    slug: "matthew",
    title: "Matthew",
    testament: "NT",
    totalChapters: 28,
    summary: "The Gospel of the Messiah: Jesus as the promised King of Israel, the fulfillment of prophecy, and the Teacher of the Kingdom.",
    featuredChapterNumbers: [5],
  },
  {
    slug: "john",
    title: "John",
    testament: "NT",
    totalChapters: 21,
    summary: "The Word become flesh: profound signs, spiritual discourses, and the revelation of divine love.",
    featuredChapterNumbers: [1],
  },
  {
    slug: "revelation",
    title: "Revelation",
    testament: "NT",
    totalChapters: 22,
    summary: "The Apocalypse of Jesus Christ: prophetic visions, the cosmic triumph over evil, and the celestial New Jerusalem.",
    featuredChapterNumbers: [21],
  },
];

const SPARKS_GENESIS_1: Record<string, WordSpark> = {
  bara: {
    id: "bara",
    term: "created",
    language: "Hebrew",
    originalScript: "בָּרָא",
    transliteration: "bārā'",
    rootMeaning: "to shape, fashion, create out of nothing (ex nihilo)",
    culturalInsight:
      "In the Old Testament, 'bara' has only one subject: God. Human beings make or form from existing materials, but only God creates from nothingness by divine fiat.",
  },
  elohim: {
    id: "elohim",
    term: "God",
    language: "Hebrew",
    originalScript: "אֱלֹהִים",
    transliteration: "'ĕlōhîm",
    rootMeaning: "Mighty One, supreme God",
    culturalInsight:
      "A plural of majesty and supreme excellence. Remarkably, throughout Genesis 1 it pairs with singular verbs, foreshadowing the triune nature of the one true God.",
  },
  ruach: {
    id: "ruach",
    term: "Spirit",
    language: "Hebrew",
    originalScript: "רוּחַ",
    transliteration: "rûaḥ",
    rootMeaning: "breath, wind, vibrant spirit",
    culturalInsight:
      "The 'Ruach Elohim' hovered over the chaotic face of the deep. In Semitic thought, breath and wind represent invisible yet irresistible life-giving divine power.",
  },
};

const SPARKS_GENESIS_12: Record<string, WordSpark> = {
  lech_lecha: {
    id: "lech_lecha",
    term: "Go forth",
    language: "Hebrew",
    originalScript: "לֶךְ־לְךָ",
    transliteration: "leḵ-ləḵā",
    rootMeaning: "Go for yourself / depart on your journey",
    culturalInsight:
      "A double imperative of deep personal conviction. God commanded Abram to leave not just his geographical home, but his entire family security network to walk into an unknown land.",
  },
  berakah: {
    id: "berakah",
    term: "blessing",
    language: "Hebrew",
    originalScript: "בְּרָכָה",
    transliteration: "bərāḵâ",
    rootMeaning: "transferred prosperity, divine favor",
    culturalInsight:
      "The Abrahamic blessing was never intended to stop with Abram: 'In you all the families of the earth will be blessed.' It is the foundational missionary mandate of Scripture.",
  },
};

const SPARKS_EXODUS_3: Record<string, WordSpark> = {
  ehyeh: {
    id: "ehyeh",
    term: "I AM WHO I AM",
    language: "Hebrew",
    originalScript: "אֶהְיֶה אֲשֶׁר אֶהְיֶה",
    transliteration: "'ehyeh 'ăšer 'ehyeh",
    rootMeaning: "The Self-Existent One, eternal presence",
    culturalInsight:
      "God reveals His personal covenant name (YHWH). Unlike Egyptian deities who had geographic borders and origins, the God of Israel is uncaused, unconstrained, and always present.",
  },
  qodesh: {
    id: "qodesh",
    term: "holy",
    language: "Hebrew",
    originalScript: "קֹדֶשׁ",
    transliteration: "qōḏeš",
    rootMeaning: "set apart, cut off from the ordinary",
    culturalInsight:
      "Moses had to take off his sandals. Sandal removal in ancient Semitic culture acknowledged utter humility and that the soil belonged entirely to the Lord.",
  },
};

const SPARKS_PSALM_23: Record<string, WordSpark> = {
  rohi: {
    id: "rohi",
    term: "my Shepherd",
    language: "Hebrew",
    originalScript: "רֹעִי",
    transliteration: "rō'î",
    rootMeaning: "one who tends, pastures, feeds, and guards",
    culturalInsight:
      "In the ancient Near East, kings were often styled as shepherds, but David—having been an actual shepherd boy—uses intimate, personal language: 'The Lord is *my* shepherd; I shall not lack.'",
  },
  tsalmaveth: {
    id: "tsalmaveth",
    term: "valley of the shadow of death",
    language: "Hebrew",
    originalScript: "צַלְמָוֶת",
    transliteration: "ṣalmāweṯ",
    rootMeaning: "deep darkness, profound gloom",
    culturalInsight:
      "Shepherds in Judea regularly guided sheep through narrow, shadowed ravines with sheer rock cliffs where wolves and flash floods hid. The rod protected; the staff gently guided.",
  },
};

const SPARKS_MATTHEW_5: Record<string, WordSpark> = {
  makarioi: {
    id: "makarioi",
    term: "Blessed",
    language: "Greek",
    originalScript: "μακάριοι",
    transliteration: "makarioi",
    rootMeaning: "divinely favored, deeply happy, flourishing in God",
    culturalInsight:
      "Unlike Greek philosophy which viewed happiness as good fortune or social status, Jesus inverts the world's order: true divine flourishing belongs to the humble, the grieving, and the pure.",
  },
  phos: {
    id: "phos",
    term: "Light of the world",
    language: "Greek",
    originalScript: "φῶς τοῦ κόσμου",
    transliteration: "phōs tou kosmou",
    rootMeaning: "radiance that dispels darkness, illuminating truth",
    culturalInsight:
      "In first-century Palestinian homes, clay oil lamps were placed on elevated stands (lampstands) so the flame could illuminate the entire single-room dwelling.",
  },
};

const SPARKS_JOHN_1: Record<string, WordSpark> = {
  logos: {
    id: "logos",
    term: "the Word",
    language: "Greek",
    originalScript: "λόγος",
    transliteration: "logos",
    rootMeaning: "divine reason, creative expression, the speech of God",
    culturalInsight:
      "Greek philosophers used 'Logos' for the cosmic principle holding the universe together. John boldly declares that this principle is not an abstract theory, but a Person—Jesus Christ.",
  },
  skenoo: {
    id: "skenoo",
    term: "dwelt among us",
    language: "Greek",
    originalScript: "ἐσκήνωσεν",
    transliteration: "eskēnōsen",
    rootMeaning: "pitched His tent, tabernacled",
    culturalInsight:
      "A direct allusion to the wilderness Tabernacle where God's Shekinah glory rested. In Christ, the transcendent Creator pitched His tent among ordinary human flesh.",
  },
};

export const CHAPTERS: Chapter[] = [
  {
    bookSlug: "genesis",
    bookTitle: "Genesis",
    chapterNumber: 1,
    title: "The Creation of the Cosmos",
    subtitle: "In the beginning, God formed the heavens and the earth out of formless void.",
    thematicHook: "Before the stars burned or continents took form, a solitary voice spoke across the deep: 'Let there be light.'",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q6.png",
    coinsReward: 50,
    sparks: SPARKS_GENESIS_1,
    verses: [
      { number: 1, text: "In the beginning God created the heavens and the earth.", sparkIds: ["bara", "elohim"] },
      { number: 2, text: "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.", sparkIds: ["ruach"] },
      { number: 3, text: "And God said, 'Let there be light,' and there was light." },
      { number: 4, text: "And God saw that the light was good, and He separated the light from the darkness." },
      { number: 5, text: "God called the light 'day,' and the darkness He called 'night.' And there was evening, and there was morning—the first day." },
      { number: 6, text: "And God said, 'Let there be an expanse between the waters, to separate the waters from the waters.'" },
      { number: 7, text: "So God made the expanse and separated the waters beneath it from the waters above. And it was so." },
      { number: 8, text: "God called the expanse 'sky.' And there was evening, and there was morning—the second day." },
      { number: 9, text: "And God said, 'Let the waters under the sky be gathered into one place, and let the dry land appear.' And it was so." },
      { number: 10, text: "God called the dry land 'earth,' and the gathering of waters He called 'seas.' And God saw that it was good." },
      { number: 11, text: "Then God said, 'Let the earth bring forth vegetation: seed-bearing plants and fruit trees, each yielding fruit with seed according to its kind.' And it was so." },
      { number: 12, text: "The earth produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good." },
      { number: 14, text: "And God said, 'Let there be lights in the expanse of the sky to distinguish between the day and the night, and let them be signs to mark the seasons and days and years.'" },
      { number: 16, text: "God made two great lights: the greater light to govern the day and the lesser light to govern the night. He also made the stars." },
      { number: 20, text: "And God said, 'Let the waters teem with living creatures, and let birds fly above the earth across the expanse of the sky.'" },
      { number: 26, text: "Then God said, 'Let Us make man in Our image, after Our likeness, to rule over the fish of the sea and the birds of the air, over the livestock, and over all the earth.'" },
      { number: 27, text: "So God created man in His own image; in the image of God He created him; male and female He created them." },
      { number: 31, text: "And God saw all that He had made, and behold, it was very good. And there was evening, and there was morning—the sixth day." },
    ],
    checkInQuestions: [
      {
        prompt: "In Genesis 1:1, what Hebrew verb is used exclusively with God as its subject to denote creation out of nothing?",
        choices: ["Bara", "Asah", "Yatsar", "Bana"],
        correctIndex: 0,
        explanation: "Bara (בָּרָא) is used strictly for divine creation ex nihilo, unlike human craftsmanship.",
      },
      {
        prompt: "On which day did God create the sun, moon, and stars to mark seasons, days, and years?",
        choices: ["Day 1", "Day 3", "Day 4", "Day 6"],
        correctIndex: 2,
        explanation: "God created light on Day 1, but established the celestial luminaries to govern day and night on Day 4.",
      },
      {
        prompt: "What unique distinction is granted to humanity in Genesis 1:26–27 compared to all other created life?",
        choices: [
          "They were created on the first day",
          "They were made in the image and likeness of God",
          "They were formed without physical bodies",
          "They were forbidden from speaking",
        ],
        correctIndex: 1,
        explanation: "Humanity alone bears the Imago Dei (Image of God), endowed with moral agency and spiritual reflection.",
      },
    ],
    storySlides: [
      {
        id: "gen1-s1",
        type: "hook",
        artworkUrl: "/images/stories/genesis-1/s1.jpg",
        badge: "Genesis 1 · The Beginning",
        title: "The Birth of the Cosmos",
        text: "Before stars burned or seas crashed, the earth lay formless and void. But darkness was not alone: the Spirit of God hovered upon the deep.",
      },
      {
        id: "gen1-s2",
        type: "verse",
        artworkUrl: "/images/stories/genesis-1/s2.jpg",
        scriptureRef: "Genesis 1:1–3",
        text: "“In the beginning God created the heavens and the earth... And God said, 'Let there be light,' and there was light.”",
        spark: SPARKS_GENESIS_1.bara,
      },
      {
        id: "gen1-s3",
        type: "verse",
        artworkUrl: "/images/stories/genesis-1/s3.jpg",
        scriptureRef: "Genesis 1:26–27",
        text: "“Then God said, 'Let Us make man in Our image, after Our likeness.' So God created man in His own image; male and female He created them.”",
      },
      {
        id: "gen1-s4",
        type: "insight",
        artworkUrl: "/images/stories/genesis-1/s4.jpg",
        title: "The Divine Pronouncement",
        text: "After each stage, God saw that it was 'good.' But when humanity was formed to walk in relationship with Him, the Creator looked upon everything and called it: 'Very Good.'",
      },
      {
        id: "gen1-s5",
        type: "question",
        artworkUrl: "/images/stories/genesis-1/s1.jpg",
        title: "Quick Recall Check",
        text: "Test your retention from this chapter:",
        question: {
          prompt: "What unique divine attribute is bestowed on humanity in Genesis 1?",
          choices: [
            "Created in the image of God (Imago Dei)",
            "Immunity from physical death",
            "Power over the angels",
          ],
          correctIndex: 0,
          explanation: "Human beings were crowned with the Image of God to reflect His character.",
        },
      },
    ],
  },
  {
    bookSlug: "genesis",
    bookTitle: "Genesis",
    chapterNumber: 12,
    title: "The Call of Abram",
    subtitle: "God calls Abram to leave Ur and promises to make him father of a great nation.",
    thematicHook: "A solitary wanderer looks into the night sky, trusting an unseen God who promises a land, a name, and a worldwide blessing.",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q8.png",
    coinsReward: 50,
    sparks: SPARKS_GENESIS_12,
    verses: [
      { number: 1, text: "Then the LORD said to Abram, 'Leave your country, your family, and your father's household, and go to the land that I will show you.'", sparkIds: ["lech_lecha"] },
      { number: 2, text: "'And I will make you into a great nation, and I will bless you; I will make your name great, so that you will be a blessing.'", sparkIds: ["berakah"] },
      { number: 3, text: "'I will bless those who bless you, and whoever curses you I will curse; and all the peoples of the earth will be blessed through you.'" },
      { number: 4, text: "So Abram departed, as the LORD had directed him, and Lot went with him. Abram was seventy-five years old when he set out from Haran." },
      { number: 5, text: "Abram took his wife Sarai, his nephew Lot, all the possessions they had gathered, and the people they had acquired in Haran, and they set out for the land of Canaan." },
      { number: 6, text: "Abram traveled through the land as far as the site of the Great Tree of Moreh at Shechem. At that time the Canaanites were in the land." },
      { number: 7, text: "Then the LORD appeared to Abram and said, 'I will give this land to your offspring.' So he built an altar there to the LORD, who had appeared to him." },
      { number: 8, text: "From there he moved on to the hill country east of Bethel and pitched his tent, with Bethel on the west and Ai on the east. There he built an altar to the LORD and called upon the name of the LORD." },
    ],
    checkInQuestions: [
      {
        prompt: "How old was Abram when he stepped out in faith from Haran to follow God's call?",
        choices: ["50 years old", "75 years old", "99 years old", "120 years old"],
        correctIndex: 1,
        explanation: "Genesis 12:4 records that Abram was 75 years old when he left Haran.",
      },
      {
        prompt: "What is the ultimate global scope of God's covenant blessing given to Abram?",
        choices: [
          "Only his immediate sons will flourish",
          "All the families of the earth will be blessed through him",
          "He will rule over Egypt and Babylon",
          "He will conquer all armies with iron chariots",
        ],
        correctIndex: 1,
        explanation: "God told Abram: 'In you all the families of the earth will be blessed,' pointing forward to the Messiah.",
      },
      {
        prompt: "What act of worship and dedication did Abram repeatedly perform upon arriving at Shechem and Bethel?",
        choices: ["He built an altar to the LORD", "He built a palace of cedar", "He constructed high city walls", "He wrote a scroll"],
        correctIndex: 0,
        explanation: "Wherever Abram pitched his tent, he built an altar and called upon the name of Yahweh.",
      },
    ],
    storySlides: [
      {
        id: "gen12-s1",
        type: "hook",
        artworkUrl: "/images/stories/genesis-12/s1.jpg",
        badge: "Genesis 12 · Covenant",
        title: "The Leap of Faith",
        text: "Abram was comfortable, settled, and seventy-five years old. Then came a voice that shattered his quiet life: 'Go forth into the unknown.'",
      },
      {
        id: "gen12-s2",
        type: "verse",
        artworkUrl: "/images/stories/genesis-12/s2.jpg",
        scriptureRef: "Genesis 12:1–2",
        text: "“Leave your country, your people and your father's household... I will make you into a great nation, and I will bless you.”",
        spark: SPARKS_GENESIS_12.lech_lecha,
      },
      {
        id: "gen12-s3",
        type: "verse",
        artworkUrl: "/images/stories/genesis-12/s3.jpg",
        scriptureRef: "Genesis 12:3",
        text: "“I will bless those who bless you, and whoever curses you I will curse; and all peoples on earth will be blessed through you.”",
        spark: SPARKS_GENESIS_12.berakah,
      },
      {
        id: "gen12-s4",
        type: "insight",
        artworkUrl: "/images/stories/genesis-12/s4.jpg",
        title: "The Nomad's Altar",
        text: "Abram possessed not an inch of Canaan when he arrived. Yet between Bethel and Ai, he built an altar of rough stone, staking God's claim on the land.",
      },
      {
        id: "gen12-s5",
        type: "question",
        artworkUrl: "/images/stories/genesis-12/s1.jpg",
        title: "Active Recall",
        text: "Test your memory:",
        question: {
          prompt: "How old was Abram when he departed Haran?",
          choices: ["75 years old", "50 years old", "99 years old"],
          correctIndex: 0,
          explanation: "At 75 years old, Abram began the journey that would change world history.",
        },
      },
    ],
  },
  {
    bookSlug: "exodus",
    bookTitle: "Exodus",
    chapterNumber: 3,
    title: "Moses and the Burning Bush",
    subtitle: "At Mount Horeb, God speaks from an unconsumed flame and commissions Moses.",
    thematicHook: "A fugitive shepherd turns aside on Mount Horeb to see a wilderness thornbush burning with fire, yet never consumed by its flame.",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q3.png",
    coinsReward: 50,
    sparks: SPARKS_EXODUS_3,
    verses: [
      { number: 1, text: "Meanwhile, Moses was shepherding the flock of his father-in-law Jethro, the priest of Midian. And he led the flock to the far side of the wilderness and came to Horeb, the mountain of God." },
      { number: 2, text: "There the angel of the LORD appeared to him in flames of fire from within a bush. Moses saw that though the bush was on fire it did not burn up." },
      { number: 3, text: "So Moses thought, 'I will go over and see this strange sight—why the bush does not burn up.'" },
      { number: 4, text: "When the LORD saw that he had gone over to look, God called to him from within the bush, 'Moses! Moses!' And Moses said, 'Here I am.'" },
      { number: 5, text: "'Do not come any closer,' God said. 'Take off your sandals, for the place where you are standing is holy ground.'", sparkIds: ["qodesh"] },
      { number: 6, text: "Then He said, 'I am the God of your father, the God of Abraham, the God of Isaac, and the God of Jacob.' At this, Moses hid his face, because he was afraid to look at God." },
      { number: 7, text: "The LORD said, 'I have indeed seen the misery of My people in Egypt. I have heard them crying out because of their slave drivers, and I am concerned about their suffering.'" },
      { number: 10, text: "'So now, go. I am sending you to Pharaoh to bring My people the Israelites out of Egypt.'" },
      { number: 14, text: "God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you.'", sparkIds: ["ehyeh"] },
    ],
    checkInQuestions: [
      {
        prompt: "Why did God command Moses to take off his sandals at the burning bush?",
        choices: [
          "Because the ground was physically muddy",
          "Because the place where he stood was holy ground",
          "Because Egyptian law required it",
          "Because his shoes were worn out",
        ],
        correctIndex: 1,
        explanation: "The presence of the Holy God transformed ordinary desert sand into holy ground.",
      },
      {
        prompt: "What sacred covenant name did God give Moses when asked who sent him?",
        choices: ["Elohim", "El Shaddai", "I AM WHO I AM (YHWH)", "Adonai"],
        correctIndex: 2,
        explanation: "God revealed His eternal self-existence: 'I AM WHO I AM' ('Ehyeh Asher Ehyeh').",
      },
      {
        prompt: "What was Moses doing for a living when he encountered the burning bush at Mount Horeb?",
        choices: ["Shepherding Jethro's flock", "Leading an army", "Serving as Pharaoh's advisor", "Building brick monuments"],
        correctIndex: 0,
        explanation: "Moses had spent 40 years as a humble desert shepherd in Midian.",
      },
    ],
    storySlides: [
      {
        id: "ex3-s1",
        type: "hook",
        artworkUrl: "/images/stories/exodus-3/s1.jpg",
        badge: "Exodus 3 · The Encounter",
        title: "The Unconsumed Flame",
        text: "Forty years in exile as an obscure shepherd. Then, on the backside of the desert, an ordinary bush blazed with holy fire and was not consumed.",
      },
      {
        id: "ex3-s2",
        type: "verse",
        artworkUrl: "/images/stories/exodus-3/s2.jpg",
        scriptureRef: "Exodus 3:5",
        text: "“'Do not come any closer,' God said. 'Take off your sandals, for the place where you are standing is holy ground.'”",
        spark: SPARKS_EXODUS_3.qodesh,
      },
      {
        id: "ex3-s3",
        type: "verse",
        artworkUrl: "/images/stories/exodus-3/s3.jpg",
        scriptureRef: "Exodus 3:14",
        text: "“God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you.'”",
        spark: SPARKS_EXODUS_3.ehyeh,
      },
      {
        id: "ex3-s4",
        type: "insight",
        artworkUrl: "/images/stories/exodus-3/s4.jpg",
        title: "I Have Heard Their Cry",
        text: "God did not commission Moses because Moses was eloquent or confident. God acted because He heard the groaning of His enslaved people in Egypt.",
      },
      {
        id: "ex3-s5",
        type: "question",
        artworkUrl: "/images/stories/exodus-3/s1.jpg",
        title: "Quick Check",
        text: "What name did God reveal at the bush?",
        question: {
          prompt: "What name did God tell Moses to declare to Pharaoh?",
          choices: ["I AM WHO I AM", "The King of Stars", "The Judge of the Dead"],
          correctIndex: 0,
          explanation: "God revealed His eternal covenant presence: 'I AM has sent me to you.'",
        },
      },
    ],
  },
  {
    bookSlug: "psalms",
    bookTitle: "Psalms",
    chapterNumber: 23,
    title: "The Shepherd Psalm",
    subtitle: "David's timeless song of quiet trust, green pastures, and the banquet table.",
    thematicHook: "In a world of predatory wolves and barren shadows, the sheep fears no evil—because the Good Shepherd walks beside him.",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q15.png",
    coinsReward: 50,
    sparks: SPARKS_PSALM_23,
    verses: [
      { number: 1, text: "The LORD is my shepherd; I shall not want.", sparkIds: ["rohi"] },
      { number: 2, text: "He makes me lie down in green pastures; He leads me beside quiet waters." },
      { number: 3, text: "He restores my soul; He guides me in paths of righteousness for His name's sake." },
      { number: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.", sparkIds: ["tsalmaveth"] },
      { number: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
      { number: 6, text: "Surely goodness and mercy shall follow me all the days of my life, and I will dwell in the house of the LORD forever." },
    ],
    checkInQuestions: [
      {
        prompt: "What two shepherd tools are specifically mentioned in Psalm 23:4 as sources of comfort?",
        choices: ["Sling and stone", "Rod and staff", "Sword and shield", "Trumpet and harp"],
        correctIndex: 1,
        explanation: "The rod was used to drive off predators; the staff gently guided and pulled wayward sheep back from cliffs.",
      },
      {
        prompt: "In verse 5, where does the Lord prepare a banquet table for the psalmist?",
        choices: [
          "In the privacy of the temple",
          "In the presence of my enemies",
          "On top of Mount Sinai",
          "Behind locked bronze doors",
        ],
        correctIndex: 1,
        explanation: "God honors His faithful servant publicly: 'in the presence of my enemies.'",
      },
      {
        prompt: "According to Psalm 23:6, what two companions 'follow' (pursue) the believer throughout all their days?",
        choices: ["Gold and silver", "Goodness and mercy", "Fame and power", "Wisdom and age"],
        correctIndex: 1,
        explanation: "David declares that God's lovingkindness (chesed) and goodness actively follow the believer.",
      },
    ],
    storySlides: [
      {
        id: "ps23-s1",
        type: "hook",
        artworkUrl: "/images/stories/psalms-23/s1.jpg",
        badge: "Psalm 23 · Sanctuary",
        title: "I Shall Not Want",
        text: "The shepherd boy who became king never forgot the hillside: sheep do not worry about tomorrow's grass because the shepherd is already there.",
      },
      {
        id: "ps23-s2",
        type: "verse",
        artworkUrl: "/images/stories/psalms-23/s2.jpg",
        scriptureRef: "Psalm 23:1–3",
        text: "“The LORD is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside quiet waters. He restores my soul.”",
        spark: SPARKS_PSALM_23.rohi,
      },
      {
        id: "ps23-s3",
        type: "verse",
        artworkUrl: "/images/stories/psalms-23/s3.jpg",
        scriptureRef: "Psalm 23:4",
        text: "“Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.”",
        spark: SPARKS_PSALM_23.tsalmaveth,
      },
      {
        id: "ps23-s4",
        type: "insight",
        artworkUrl: "/images/stories/psalms-23/s4.jpg",
        title: "From Path to Presence",
        text: "Notice the shift: in the pastures David talks *about* God ('He leads me'). In the valley of deep shadow, he speaks *directly* to God: 'For You are with me.'",
      },
      {
        id: "ps23-s5",
        type: "question",
        artworkUrl: "/images/stories/psalms-23/s1.jpg",
        title: "Active Recall",
        text: "Test your understanding:",
        question: {
          prompt: "What does the shepherd use to comfort the sheep in the dark valley?",
          choices: ["His rod and staff", "His sword and bow", "His gold coin"],
          correctIndex: 0,
          explanation: "The rod protects against beasts; the staff guides the sheep along narrow passes.",
        },
      },
    ],
  },
  {
    bookSlug: "matthew",
    bookTitle: "Matthew",
    chapterNumber: 5,
    title: "The Sermon on the Mount",
    subtitle: "The Beatitudes, the salt of the earth, the light of the world, and kingdom righteousness.",
    thematicHook: "Sitting on a Galilean hillside, Jesus delivers the manifesto of the Kingdom of God, turning worldly power upside down.",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q24.png",
    coinsReward: 50,
    sparks: SPARKS_MATTHEW_5,
    verses: [
      { number: 1, text: "When Jesus saw the crowds, He went up on the mountain. And after He sat down, His disciples came to Him." },
      { number: 2, text: "Then He opened His mouth and began to teach them, saying:" },
      { number: 3, text: "'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'", sparkIds: ["makarioi"] },
      { number: 4, text: "'Blessed are those who mourn, for they will be comforted.'" },
      { number: 5, text: "'Blessed are the meek, for they will inherit the earth.'" },
      { number: 6, text: "'Blessed are those who hunger and thirst for righteousness, for they will be filled.'" },
      { number: 7, text: "'Blessed are the merciful, for they will be shown mercy.'" },
      { number: 8, text: "'Blessed are the pure in heart, for they will see God.'" },
      { number: 9, text: "'Blessed are the peacemakers, for they will be called sons of God.'" },
      { number: 13, text: "'You are the salt of the earth. But if the salt loses its savor, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot.'" },
      { number: 14, text: "'You are the light of the world. A city set on a hill cannot be hidden.'", sparkIds: ["phos"] },
      { number: 15, text: "'Nor do people light a lamp and put it under a basket. Instead, they set it on a lampstand, and it gives light to everyone in the house.'" },
      { number: 16, text: "'In the same way, let your light shine before men, that they may see your good deeds and glorify your Father in heaven.'" },
    ],
    checkInQuestions: [
      {
        prompt: "Where did Jesus say people place a lit lamp so that it illuminates everyone in the house?",
        choices: ["Under a bushel basket", "On a lampstand", "Inside an iron pot", "Behind a curtain"],
        correctIndex: 1,
        explanation: "Matthew 5:15: 'Nor do people light a lamp and put it under a basket. Instead, they set it on a lampstand.'",
      },
      {
        prompt: "According to the Beatitudes in Matthew 5:8, who will receive the vision of God ('see God')?",
        choices: ["The wealthy rulers", "The pure in heart", "The mighty conquerors", "The eloquent speakers"],
        correctIndex: 1,
        explanation: "Jesus declared: 'Blessed are the pure in heart, for they will see God.'",
      },
      {
        prompt: "What two everyday metaphors did Jesus use in Matthew 5:13–14 to describe His disciples' role in society?",
        choices: ["Iron and brass", "Salt and light", "Gold and silver", "Shield and spear"],
        correctIndex: 1,
        explanation: "Disciples preserve society like salt and illuminate moral darkness like light.",
      },
    ],
    storySlides: [
      {
        id: "mat5-s1",
        type: "hook",
        artworkUrl: "/images/stories/matthew-5/s1.jpg",
        badge: "Matthew 5 · The Manifesto",
        title: "The Upside-Down Kingdom",
        text: "Rome rewarded cruelty, power, and wealth. Then a teacher sat on a grassy hillside above the Sea of Galilee and blessed the broken-hearted.",
      },
      {
        id: "mat5-s2",
        type: "verse",
        artworkUrl: "/images/stories/matthew-5/s2.jpg",
        scriptureRef: "Matthew 5:3, 9",
        text: "“Blessed are the poor in spirit, for theirs is the kingdom of heaven... Blessed are the peacemakers, for they will be called children of God.”",
        spark: SPARKS_MATTHEW_5.makarioi,
      },
      {
        id: "mat5-s3",
        type: "verse",
        artworkUrl: "/images/stories/matthew-5/s3.jpg",
        scriptureRef: "Matthew 5:14–16",
        text: "“You are the light of the world. A town built on a hill cannot be hidden... Let your light shine before others.”",
        spark: SPARKS_MATTHEW_5.phos,
      },
      {
        id: "mat5-s4",
        type: "insight",
        artworkUrl: "/images/stories/matthew-5/s4.jpg",
        title: "Upon the Lampstand",
        text: "No one lights an oil lamp to hide it under a clay bowl. Truth is given to be set on the lampstand—to light the path of every wanderer in the home.",
      },
      {
        id: "mat5-s5",
        type: "question",
        artworkUrl: "/images/stories/matthew-5/s1.jpg",
        title: "Kingdom Recall",
        text: "Check your retention:",
        question: {
          prompt: "What does Jesus say a town built on a hill cannot be?",
          choices: ["Hidden", "Conquered", "Destroyed"],
          correctIndex: 0,
          explanation: "A city on a hill cannot be hidden; its light shines for all travelers across the dark plains.",
        },
      },
    ],
  },
  {
    bookSlug: "john",
    bookTitle: "John",
    chapterNumber: 1,
    title: "The Word Made Flesh",
    subtitle: "The eternal Word who was with God, the true Light coming into the world, and grace upon grace.",
    thematicHook: "Before time began, the Word resonated in the eternity of God. Then, in the fullness of time, the Creator took human breath.",
    artworkUrl: "/images/quizzes/look-at-the-picture-bible/q21.png",
    coinsReward: 50,
    sparks: SPARKS_JOHN_1,
    verses: [
      { number: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", sparkIds: ["logos"] },
      { number: 2, text: "He was with God in the beginning." },
      { number: 3, text: "Through Him all things were made, and without Him nothing was made that has been made." },
      { number: 4, text: "In Him was life, and that life was the light of men." },
      { number: 5, text: "The Light shines in the darkness, and the darkness has not overcome it." },
      { number: 9, text: "The true Light who gives light to every man was coming into the world." },
      { number: 10, text: "He was in the world, and though the world was made through Him, the world did not recognize Him." },
      { number: 11, text: "He came to His own, and His own did not receive Him." },
      { number: 12, text: "But to all who did receive Him, to those who believed in His name, He gave the right to become children of God." },
      { number: 14, text: "The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son from the Father, full of grace and truth.", sparkIds: ["skenoo"] },
      { number: 16, text: "From His fullness we have all received grace upon grace." },
      { number: 17, text: "For the law was given through Moses; grace and truth came through Jesus Christ." },
    ],
    checkInQuestions: [
      {
        prompt: "What profound claim does John 1:1 make concerning the Word (Logos)?",
        choices: [
          "The Word was created by angels",
          "The Word was with God, and the Word was God",
          "The Word began at Mount Sinai",
          "The Word is an impersonal cosmic rule",
        ],
        correctIndex: 1,
        explanation: "John 1:1 explicitly states: 'In the beginning was the Word, and the Word was with God, and the Word was God.'",
      },
      {
        prompt: "According to John 1:5, what power does darkness have over the light?",
        choices: [
          "Darkness will eventually extinguish the light",
          "The darkness has not overcome it",
          "They are equal opposing forces",
          "Darkness existed before the light",
        ],
        correctIndex: 1,
        explanation: "The Light shines into darkness, and the darkness cannot extinguish or comprehend it.",
      },
      {
        prompt: "What does John 1:14 say the Word did in relation to humanity?",
        choices: [
          "He observed humanity from the sky",
          "The Word became flesh and tabernacled (dwelt) among us",
          "He sent letters from heaven",
          "He condemned the material world",
        ],
        correctIndex: 1,
        explanation: "The Incarnation: the eternal Word took upon Himself human flesh and dwelt among us.",
      },
    ],
    storySlides: [
      {
        id: "jn1-s1",
        type: "hook",
        artworkUrl: "/images/stories/john-1/s1.jpg",
        badge: "John 1 · The Prologue",
        title: "The Uncreated Word",
        text: "John echoes the very opening words of Genesis. But where Moses spoke of the universe's creation, John speaks of the Person through whom all things came to be.",
      },
      {
        id: "jn1-s2",
        type: "verse",
        artworkUrl: "/images/stories/john-1/s2.jpg",
        scriptureRef: "John 1:1–4",
        text: "“In the beginning was the Word, and the Word was with God, and the Word was God... In Him was life, and that life was the light of all mankind.”",
        spark: SPARKS_JOHN_1.logos,
      },
      {
        id: "jn1-s3",
        type: "verse",
        artworkUrl: "/images/stories/john-1/s3.jpg",
        scriptureRef: "John 1:14",
        text: "“The Word became flesh and made His dwelling among us. We have seen His glory, full of grace and truth.”",
        spark: SPARKS_JOHN_1.skenoo,
      },
      {
        id: "jn1-s4",
        type: "insight",
        artworkUrl: "/images/stories/john-1/s4.jpg",
        title: "Grace Upon Grace",
        text: "The law was delivered through Moses carved in stone. But in Christ, God's heartbeat—grace coupled with unwavering truth—walked in the dust of our world.",
      },
      {
        id: "jn1-s5",
        type: "question",
        artworkUrl: "/images/stories/john-1/s1.jpg",
        title: "Memory Check",
        text: "Test your understanding:",
        question: {
          prompt: "What does John 1:5 say regarding light and darkness?",
          choices: [
            "The darkness has not overcome it",
            "The light was hidden forever",
            "Darkness won the battle",
          ],
          correctIndex: 0,
          explanation: "No matter how dense the darkness, a single flame cannot be conquered by it.",
        },
      },
    ],
  },
];

export const READING_PLANS: ReadingPlan[] = [
  {
    slug: "foundations-of-faith",
    title: "Foundations of Faith",
    subtitle: "From Creation to the Living Word",
    days: 5,
    badge: "Lampstand Foundation",
    description: "Experience the monumental narrative arc of Scripture through 5 landmark illuminated chapters.",
    chapters: [
      { bookSlug: "genesis", chapterNumber: 1, day: 1 },
      { bookSlug: "genesis", chapterNumber: 12, day: 2 },
      { bookSlug: "exodus", chapterNumber: 3, day: 3 },
      { bookSlug: "psalms", chapterNumber: 23, day: 4 },
      { bookSlug: "john", chapterNumber: 1, day: 5 },
    ],
  },
  {
    slug: "sermon-and-psalms",
    title: "Wisdom for the Soul",
    subtitle: "Shepherd peace and mountain wisdom",
    days: 2,
    badge: "Heart of Wisdom",
    description: "Quiet your mind with the peace of Psalm 23 and the revolutionary kingdom beatitudes of Matthew 5.",
    chapters: [
      { bookSlug: "psalms", chapterNumber: 23, day: 1 },
      { bookSlug: "matthew", chapterNumber: 5, day: 2 },
    ],
  },
];

export function getChapter(bookSlug: string, chapterNumber: number): Chapter | undefined {
  return CHAPTERS.find(
    (c) => c.bookSlug.toLowerCase() === bookSlug.toLowerCase() && c.chapterNumber === chapterNumber,
  );
}

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export function getAdjacentChapters(bookSlug: string, chapterNumber: number) {
  const currentIdx = CHAPTERS.findIndex(
    (c) => c.bookSlug.toLowerCase() === bookSlug.toLowerCase() && c.chapterNumber === chapterNumber,
  );
  if (currentIdx === -1) return { prev: undefined, next: undefined };
  return {
    prev: currentIdx > 0 ? CHAPTERS[currentIdx - 1] : undefined,
    next: currentIdx < CHAPTERS.length - 1 ? CHAPTERS[currentIdx + 1] : undefined,
  };
}

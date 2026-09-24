import type { Chapter, DailyQuote, PassageContext, DevotionalReflection, DailyPrayer } from "./types";

export const DEVOTIONAL_QUOTES: Record<string, DailyQuote> = {
  "genesis-1": {
    quote: "Creation is not a cosmic accident, but an intentional invitation into eternal fellowship with God.",
    author: "A. W. Tozer",
    reference: "The Knowledge of the Holy",
    likesCount: 1420,
    bgImageUrl: "/images/stories/genesis-1/s1.jpg",
  },
  "genesis-3": {
    quote: "Grace does not gloss over our brokenness; it walks straight into the garden and calls us by name.",
    author: "Timothy Keller",
    reference: "The Prodigal God",
    likesCount: 980,
    bgImageUrl: "/images/quizzes/look-at-the-picture-bible/q7.png",
  },
  "genesis-12": {
    quote: "Faith is not the absence of doubt, but courage to take the first step when the map hasn't been drawn yet.",
    author: "Corrie ten Boom",
    reference: "The Hiding Place",
    likesCount: 1250,
    bgImageUrl: "/images/stories/genesis-12/s1.jpg",
  },
  "exodus-3": {
    quote: "Holy ground is not where perfection dwells, but where the presence of God ignites what was once ordinary.",
    author: "Henri Nouwen",
    reference: "Here and Now",
    likesCount: 1640,
    bgImageUrl: "/images/stories/exodus-3/s1.jpg",
  },
  "psalms-23": {
    quote: "The Shepherd does not promise a journey without valleys, but a journey where you will never walk alone.",
    author: "Charles Spurgeon",
    reference: "Treasury of David",
    likesCount: 3120,
    bgImageUrl: "/images/stories/psalms-23/s1.jpg",
  },
  "psalms-32": {
    quote: "Forgiveness can happen unilaterally, but reconciliation requires the participation of both parties.",
    author: "Brian Zahnd",
    reference: "Beauty Will Save the World",
    likesCount: 1890,
    bgImageUrl: "/images/stories/psalms-23/s2.jpg",
  },
  "matthew-5": {
    quote: "The Beatitudes are not a ladder of demands to climb, but a royal announcement of who the King welcomes into His kingdom.",
    author: "Dietrich Bonhoeffer",
    reference: "The Cost of Discipleship",
    likesCount: 2240,
    bgImageUrl: "/images/stories/matthew-5/s1.jpg",
  },
  "john-1": {
    quote: "The Word became flesh not to condemn our frailty, but to pitch His tent in the middle of our storms.",
    author: "C. S. Lewis",
    reference: "Mere Christianity",
    likesCount: 2890,
    bgImageUrl: "/images/stories/john-1/s1.jpg",
  },
};

export const DEVOTIONAL_CONTEXTS: Record<string, PassageContext> = {
  "genesis-1": {
    themeTitle: "The Architecture of Creation",
    weeklyTheme: "Week 1: Covenants & Deliverance",
    historicalContext:
      "Written in the ancient Near East where rival mythologies viewed the universe as the chaotic battleground of violent deities, Genesis 1 shatters pagan darkness: one solitary, sovereign God gently speaks order, goodness, and dignity into being.",
    keyQuestion: "Where in your life today does God want to speak light into formless chaos?",
  },
  "genesis-3": {
    themeTitle: "The Fracture and the Promise",
    weeklyTheme: "Week 1: Covenants & Deliverance",
    historicalContext:
      "The tragedy of Eden reveals humanity trading fellowship for autonomy. Yet even as consequences fall, verse 15 provides the Protoevangelium—the first beam of the Gospel predicting Christ crushing the serpent's head.",
    keyQuestion: "Are you hiding behind leaves of self-reliance, or stepping into His searching grace?",
  },
  "psalms-23": {
    themeTitle: "Peace in the Shadow of the Valley",
    weeklyTheme: "Week 2: The Heart of Worship",
    historicalContext:
      "David composed this hymn drawing upon his boyhood in the Judean wilderness. In arid canyons, sheep depend entirely upon a vigilant shepherd for pasture, quiet waters, and rod defense against prowling predators.",
    keyQuestion: "What anxious burden can you surrender to your Good Shepherd right now?",
  },
  "john-1": {
    themeTitle: "The Light That Overcomes Darkness",
    weeklyTheme: "Week 3: The Incarnate King",
    historicalContext:
      "John opens his Gospel echoing Genesis 1:1, using the Greek philosophical concept of 'Logos' (the cosmic organizing principle) and identifying Him as Jesus Christ—transcendent divine wisdom dwelling among mortals.",
    keyQuestion: "How can you reflect Christ's unextinguishable light to someone hurting today?",
  },
};

export const DEVOTIONAL_REFLECTIONS: Record<string, DevotionalReflection> = {
  "genesis-1": {
    title: "Speaking Light Into Your Deep Waters",
    readingMinutes: 4,
    paragraphs: [
      "Before galaxies spun or oceans found their boundaries, there was only darkness over the surface of the deep. It was formless, empty, and wild. Yet the Spirit of God wasn't intimidated by the void—He was hovering, waiting for the Father to speak.",
      "So often in our daily lives, we look at the unorganized chaos of our responsibilities, uncertain health news, or broken relationships, and we assume God has abandoned the scene. We mistake silence for absence.",
      "Genesis 1 teaches us that God's favorite canvas is formless darkness. When He speaks 'Let there be light,' dark shadows have no choice but to retreat. His voice is creative, ordering, and fundamentally good.",
      "Whatever feels disorganized or overwhelmingly dark in your schedule or spirit this morning, remember: the same God whose breath created the cosmos is leaning in over your life today.",
    ],
    takeaway: "God does His greatest work not in polished perfection, but in the chaotic voids we surrender to His voice.",
    reflectionQuestion: "What specific area of anxiety or confusion do you need to place in God's creative hands today?",
  },
  "psalms-23": {
    title: "The Table Prepared in the Valley",
    readingMinutes: 3,
    paragraphs: [
      "David does not write Psalm 23 from an ivory palace. He writes it from the dusty, limestone ravines of Judah where sudden flash floods and ravenous wolves were ever-present dangers.",
      "Notice the subtle shift in grammar: in verses 1 through 3, David talks about God ('He makes me lie down... He leads me'). But the moment he steps into the dark valley of verse 4, his language shifts into intimate direct address: 'for You are with me.'",
      "Valleys do not separate us from God; they bring us face to face with Him. When the shadows lengthen and familiar comforts dissolve, the Shepherd isn't watching from a distance—He walks stride for stride at your side.",
      "He does not wait until you exit the battlefield to feed your soul. Even in the presence of your adversaries, He spreads a royal banquet of grace, anoints your weary head, and ensures goodness and mercy pursue you every day.",
    ],
    takeaway: "The valley is not your permanent residence; it is merely a passage with your Shepherd.",
    reflectionQuestion: "Can you thank God for being with you in your current valley before the outcome arrives?",
  },
};

export const DEVOTIONAL_PRAYERS: Record<string, DailyPrayer> = {
  "genesis-1": {
    title: "Prayer for Divine Order & Light",
    durationMinutes: 1,
    scriptureInspiration: "Genesis 1:3 — 'And God said, Let there be light.'",
    prayerText: `Heavenly Father, Creator of the ends of the earth,

You who spoke radiant light into the cosmic void, look upon my heart this day. Where there is anxiety, speak peace. Where there is confusion, bring divine order.

Renew my mind in Your likeness. Let me walk as a bearer of Your image, reflecting kindness, justice, and mercy to everyone I encounter.

I surrender my plans into Your hands, trusting that what You have begun in me, You will bring to completion.

In the mighty name of Jesus, Amen.`,
    ambientTheme: "desert-dawn",
  },
  "psalms-23": {
    title: "Prayer of Shepherd Peace",
    durationMinutes: 1,
    scriptureInspiration: "Psalm 23:1 — 'The Lord is my shepherd; I lack nothing.'",
    prayerText: `Lord Jesus, my Good Shepherd,

I release my restless striving. You know where the green pastures lie, and You lead me beside quiet waters to restore my weary soul.

Even as I walk through shadowy valleys and unfamiliar paths today, I will fear no evil, for Your rod and Your staff comfort me.

Pour Your peace over my mind. Anoint my heart with fresh oil, that my cup may overflow with praise and generosity toward others.

In Your holy name, Amen.`,
    ambientTheme: "tranquil-waters",
  },
};

export function getChapterQuote(chapter: Chapter): DailyQuote {
  const key = `${chapter.bookSlug}-${chapter.chapterNumber}`;
  if (DEVOTIONAL_QUOTES[key]) {
    return DEVOTIONAL_QUOTES[key];
  }
  if (chapter.dailyQuote) {
    return chapter.dailyQuote;
  }
  return {
    quote: chapter.thematicHook || "The grass withers and the flowers fall, but the word of our God endures forever.",
    author: `${chapter.bookTitle} ${chapter.chapterNumber}`,
    reference: chapter.arcName || "Anchors of Scripture",
    likesCount: 1100 + (chapter.dayNumber || 1) * 37,
    bgImageUrl: chapter.artworkUrl,
  };
}

export function getChapterContext(chapter: Chapter): PassageContext {
  const key = `${chapter.bookSlug}-${chapter.chapterNumber}`;
  if (DEVOTIONAL_CONTEXTS[key]) {
    return DEVOTIONAL_CONTEXTS[key];
  }
  if (chapter.passageContext) {
    return chapter.passageContext;
  }
  return {
    themeTitle: chapter.title,
    weeklyTheme: chapter.arcName || "Anchors of Scripture",
    historicalContext: `${chapter.bookTitle} chapter ${chapter.chapterNumber} stands as a cornerstone in the canon of Scripture, revealing God's character and covenant faithfulness to His people through landmark history.`,
    keyQuestion: "How does this sacred scripture speak into your present season?",
  };
}

export function getChapterDevotional(chapter: Chapter): DevotionalReflection {
  const key = `${chapter.bookSlug}-${chapter.chapterNumber}`;
  if (DEVOTIONAL_REFLECTIONS[key]) {
    return DEVOTIONAL_REFLECTIONS[key];
  }
  if (chapter.devotional) {
    return chapter.devotional;
  }
  return {
    title: `Walking in the Light of ${chapter.title}`,
    readingMinutes: 3,
    paragraphs: [
      `In ${chapter.bookTitle} ${chapter.chapterNumber}, we witness timeless truth meeting human experience: "${chapter.subtitle}".`,
      `Scripture was not given merely to satisfy intellectual curiosity, but to transform how we navigate mundane Tuesdays, difficult relationships, and deep spiritual longings.`,
      `As you meditate on these verses today, remember that the God who acted faithfully in ancient times is alive, present, and actively sustaining you right here, right now.`,
    ],
    takeaway: `Trust the God who holds every generation in the palm of His righteous hand.`,
    reflectionQuestion: "What promise from today's reading can you anchor your heart to?",
  };
}

export function getChapterPrayer(chapter: Chapter): DailyPrayer {
  const key = `${chapter.bookSlug}-${chapter.chapterNumber}`;
  if (DEVOTIONAL_PRAYERS[key]) {
    return DEVOTIONAL_PRAYERS[key];
  }
  if (chapter.prayer) {
    return chapter.prayer;
  }
  return {
    title: `Prayer for ${chapter.title}`,
    durationMinutes: 1,
    scriptureInspiration: `${chapter.bookTitle} ${chapter.chapterNumber}`,
    prayerText: `Heavenly Father,

Thank You for the living power of Your Word in ${chapter.bookTitle}. Let its truth take deep root in my soul today.

Guard my thoughts, guide my footsteps, and let Your peace reign in my heart through every trial and victory.

In Jesus' name I pray, Amen.`,
    ambientTheme: "golden-dusk",
  };
}

/**
 * Reels for the Lampstand Sleep & Walk Bible Facebook page, rendered by clips.ts:
 *   npx tsx video/clips.ts walk
 *   npx tsx video/clips.ts sleep
 * Walk: one verse for the morning, said clearly, ending "Carry this with you today".
 * Sleep: one passage read softly, different from the Jesus Your Daily Hope clips.
 * Scripture is quoted word for word from the Berean Standard Bible (data/bsb.txt).
 */
import type { Clip } from "./clips";

export const SLEEPWALK_CLIPS: Clip[] = [
  // Morning Walk reels.
  {
    id: "this-is-the-day",
    series: "walk",
    hook: "Before you check your phone, read this",
    kicker: "Psalm 118:24 · for your morning",
    script:
      "Before the emails, before the news, start here. Psalm 118. " +
      "“This is the day that the LORD has made; we will rejoice and be glad in it.” " +
      "Not the day you planned, or the day you would have chosen. The day He made. " +
      "So whatever today holds, you can meet it gladly, because He was here before you woke. " +
      "Carry this with you today: this is the day the Lord has made.",
    images: ["/images/sleep/psalm-30/s2.jpg", "/images/sleep/psalm-145/s2.jpg", "/images/sleep/psalm-118/s1.jpg"],
    caption: "Start here, before the emails and the news. Psalm 118:24 ☀️",
  },
  {
    id: "all-things",
    series: "walk",
    hook: "When today feels like too much",
    kicker: "Philippians 4:13 · for your morning",
    script:
      "If today feels like too much, hear what Paul wrote from a prison cell. " +
      "“I can do all things through Christ who gives me strength.” " +
      "He didn't write it on an easy day. He wrote it in chains. " +
      "The strength isn't yours to find. It's Christ's to give. " +
      "Carry this with you today: through Christ, who gives me strength.",
    images: ["/images/sleep/psalm-143/s2.jpg", "/images/sleep/philippians-3/s3.jpg", "/images/sleep/psalm-119/s1.jpg"],
    caption: "Paul wrote it in chains, not on an easy day. Philippians 4:13 💪",
  },
  {
    id: "morning-trust",
    series: "walk",
    hook: "A prayer for the first minute of your day",
    kicker: "Psalm 143:8 · for your morning",
    script:
      "Here's a prayer for the first minute of your morning. " +
      "“Let me hear Your loving devotion in the morning, for I have put my trust in You. Teach me the way I should walk, for to You I lift up my soul.” " +
      "Pray it slowly, before the day starts asking things of you. Then walk the way He shows you. " +
      "Carry this with you today: teach me the way I should walk.",
    images: ["/images/sleep/philippians-4/s2.jpg", "/images/sleep/psalm-143/s2.jpg", "/images/sleep/psalm-119/s1.jpg"],
    caption: "Pray this before the day starts asking things of you. Psalm 143:8 🙏",
  },
  {
    id: "light-of-the-world",
    series: "walk",
    hook: "Whatever feels dark this morning",
    kicker: "John 8:12 · for your morning",
    script:
      "Whatever feels dark in your life this morning, Jesus said this. " +
      "“I am the light of the world. Whoever follows Me will never walk in the darkness, but will have the light of life.” " +
      "Not a light for one moment. The light of life. Follow Him through today, one step at a time. " +
      "Carry this with you today: whoever follows Him will never walk in the darkness.",
    images: ["/images/sleep/john-8/s4.jpg", "/images/sleep/john-8/s2.jpg", "/images/sleep/psalm-145/s1.jpg"],
    caption: "Follow Him through today, one step at a time. John 8:12 ✨",
  },
  {
    id: "lamp-to-my-feet",
    series: "walk",
    hook: "You don't need to see the whole road today",
    kicker: "Psalm 119:105 · for your morning",
    script:
      "You don't need to see the whole road today. Psalm 119 says, " +
      "“Your word is a lamp to my feet and a light to my path.” " +
      "A lamp in those days lit only a few steps ahead. Enough for the next step, and then the next. " +
      "That's all you need this morning. " +
      "Carry this with you today: Your word is a lamp to my feet.",
    images: ["/images/sleep/philippians-3/s1.jpg", "/images/sleep/psalm-119/s2.jpg", "/images/sleep/psalm-119/s1.jpg"],
    caption: "Enough light for the next step. Psalm 119:105 🪔",
  },
  {
    id: "at-daybreak",
    series: "walk",
    hook: "David's morning habit, worth borrowing",
    kicker: "Psalm 5:3 · for your morning",
    script:
      "David had a morning habit worth borrowing. " +
      "“In the morning, O LORD, You hear my voice; at daybreak I lay my plea before You and wait in expectation.” " +
      "Tell God what you need today. Then watch for His answer, expecting it. " +
      "Carry this with you today: at daybreak, I wait in expectation.",
    images: ["/images/sleep/psalm-5/s1.jpg", "/images/sleep/psalm-5/s2.jpg", "/images/sleep/psalm-65/s1.jpg"],
    caption: "Lay it before Him, then wait expecting. Psalm 5:3 🌅",
  },
  {
    id: "press-on",
    series: "walk",
    hook: "If yesterday went wrong, read this",
    kicker: "Philippians 3:13–14 · for your morning",
    script:
      "If yesterday went wrong, read this before today begins. " +
      "“But one thing I do: Forgetting what is behind and straining toward what is ahead, I press on toward the goal to win the prize of God’s heavenly calling in Christ Jesus.” " +
      "Yesterday is behind you. Today is ahead. Press on. " +
      "Carry this with you today: forgetting what is behind, I press on.",
    images: ["/images/sleep/philippians-3/s3.jpg", "/images/sleep/psalm-5/s2.jpg", "/images/sleep/psalm-30/s2.jpg"],
    caption: "Yesterday is behind you. Today is ahead. Philippians 3:13–14 🏃",
  },

  // Bedtime Sleep reels.
  {
    id: "psalm-23-rest",
    series: "sleep",
    hook: "Psalm 23, read slowly for sleep",
    kicker: "Psalm 23 · for tonight",
    script:
      "Let your shoulders drop. Breathe out slowly, and listen. " +
      "“The LORD is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside quiet waters. He restores my soul.” " +
      "You don't have to lead yourself tonight. The Shepherd is keeping watch. Rest.",
    images: ["/images/sleep/psalm-23/s1.jpg", "/images/sleep/psalm-23/s2.jpg"],
    caption: "You don't have to lead yourself tonight. Psalm 23 🌙",
  },
  {
    id: "under-his-wings",
    series: "sleep",
    hook: "If the night feels heavy",
    kicker: "Psalm 91 · for tonight",
    script:
      "If the night feels heavy, let this cover you. " +
      "“He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.” " +
      "“He will cover you with His feathers; under His wings you will find refuge.” " +
      "“You will not fear the terror of the night.” " +
      "Stay under His wings tonight. You are covered.",
    images: ["/images/sleep/psalm-91/s1.jpg", "/images/sleep/psalm-91/s2.jpg"],
    caption: "Under His wings you will find refuge. Psalm 91 🕊️",
  },
  {
    id: "my-peace",
    series: "sleep",
    hook: "Words Jesus spoke on His last night",
    kicker: "John 14:27 · for tonight",
    script:
      "Jesus said these words on His last night with His friends, knowing what was coming. " +
      "“Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.” " +
      "His peace is still offered tonight. Breathe in, and receive it.",
    images: ["/images/sleep/john-14/s1.jpg", "/images/sleep/john-14/s2.jpg", "/images/sleep/john-14/s3.jpg"],
    caption: "His peace, not the world's. John 14:27 🌙",
  },
  {
    id: "be-still",
    series: "sleep",
    hook: "Your mind has been busy all day",
    kicker: "Psalm 46 · for tonight",
    script:
      "Your mind has been busy all day. Let it slow down now. " +
      "“God is our refuge and strength, an ever-present help in times of trouble.” " +
      "And then God says, “Be still and know that I am God.” " +
      "You don't have to fix anything tonight. Be still. He is God.",
    images: ["/images/sleep/psalm-46/s1.jpg", "/images/sleep/psalm-46/s2.jpg"],
    caption: "You don't have to fix anything tonight. Psalm 46:10 🌊",
  },
  {
    id: "night-shines",
    series: "sleep",
    hook: "The dark isn't dark to God",
    kicker: "Psalm 139:12 · for tonight",
    script:
      "The dark can make every worry feel bigger. But listen to this. " +
      "“Even the darkness is not dark to You, but the night shines like the day, for darkness is as light to You.” " +
      "This room isn't dark to God. He sees you clearly, and He is near. Close your eyes.",
    images: ["/images/sleep/psalm-139/s1.jpg", "/images/sleep/psalm-139/s2.jpg", "/images/sleep/psalm-139/s3.jpg"],
    caption: "The night shines like the day to Him. Psalm 139:12 ✨",
  },
  {
    id: "i-lie-down",
    series: "sleep",
    hook: "David slept while running for his life",
    kicker: "Psalm 3:5 · for tonight",
    script:
      "David wrote this while running for his life, with enemies all around him. And still, he slept. " +
      "“I lie down and sleep; I wake again, for the LORD sustains me.” " +
      "If David could rest that night, you can rest in the same Lord tonight. Lie down. He will sustain you.",
    images: ["/images/sleep/psalm-3/s1.jpg", "/images/sleep/psalm-116/s2.jpg"],
    caption: "I lie down and sleep; I wake again. Psalm 3:5 🌙",
  },
  {
    id: "return-to-rest",
    series: "sleep",
    hook: "Before you sleep, look back on today",
    kicker: "Psalm 116:7 · for tonight",
    script:
      "Before you sleep, look back over today for one good thing. Then pray this. " +
      "“Return to your rest, O my soul, for the LORD has been good to you.” " +
      "Name the ways He was good today. And let that be the last thing on your mind tonight.",
    images: ["/images/sleep/psalm-116/s1.jpg", "/images/sleep/psalm-116/s2.jpg"],
    caption: "Return to your rest, O my soul. Psalm 116:7 🙏",
  },

  // Demo of the punch build (11 Nov): the Be still reel rebuilt around its first three seconds.
  {
    id: "be-still-v2",
    series: "sleep",
    punch: true,
    hook: "God's instruction for a racing mind is two words",
    kicker: "Psalm 46:10 · for tonight",
    script:
      "God gave one instruction for a racing mind. It's just two words. " +
      "“Be still and know that I am God.” " +
      "Not fix it. Not figure it out. Be still. " +
      "He is God tonight, so you don't have to be. " +
      "Type Amen if you needed this.",
    images: ["/images/sleep/psalm-65/s1.jpg", "/images/sleep/psalm-46/s2.jpg", "/images/sleep/psalm-62/s1.jpg"],
    caption: "Two words for a racing mind: be still. Psalm 46:10 🌊 Type Amen if you needed this tonight.",
  },

  // Week 2 (14–20 Nov): numbered episodes, sharper first lines, the most-read verses.
  {
    id: "do-not-fear",
    series: "walk",
    badge: "Day 8 · Morning verse",
    hook: "Four promises before breakfast",
    kicker: "Isaiah 41:10 · for your morning",
    script:
      "If fear woke up before you did this morning, read this. " +
      "“Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.” " +
      "Four promises before breakfast. With you. Strengthen you. Help you. Hold you. " +
      "Carry this with you today: I will uphold you.",
    images: ["/images/sleep/psalm-145/s1.jpg", "/images/sleep/psalm-30/s2.jpg", "/images/sleep/psalm-65/s1.jpg"],
    caption: "Four promises before breakfast. Isaiah 41:10 ☀️",
  },
  {
    id: "new-every-morning",
    series: "walk",
    badge: "Day 9 · Morning verse",
    hook: "Yesterday didn't use up His mercy",
    kicker: "Lamentations 3:22–23 · for your morning",
    script:
      "Yesterday's mistakes didn't use up God's mercy. " +
      "“Because of the loving devotion of the LORD we are not consumed, for His mercies never fail. They are new every morning; great is Your faithfulness!” " +
      "Today's mercy is brand new, made for this day. " +
      "Carry this with you today: His mercies are new this morning.",
    images: ["/images/sleep/psalm-5/s1.jpg", "/images/sleep/psalm-96/s1.jpg", "/images/sleep/psalm-145/s2.jpg"],
    caption: "His mercies are new every morning. Lamentations 3:22–23 🌅",
  },
  {
    id: "strong-and-courageous",
    series: "walk",
    badge: "Day 10 · Morning verse",
    hook: "Walking into something hard today?",
    kicker: "Joshua 1:9 · for your morning",
    script:
      "Walking into something hard today? God said this to Joshua before the biggest day of his life. " +
      "“Have I not commanded you to be strong and courageous? Do not be afraid; do not be discouraged, for the LORD your God is with you wherever you go.” " +
      "Wherever you go today, He's already there. " +
      "Carry this with you today: the Lord is with me wherever I go.",
    images: ["/images/sleep/psalm-143/s2.jpg", "/images/sleep/philippians-3/s3.jpg", "/images/sleep/psalm-119/s1.jpg"],
    caption: "Wherever you go today, He's already there. Joshua 1:9 💪",
  },
  {
    id: "trust-with-all",
    series: "walk",
    badge: "Day 11 · Morning verse",
    hook: "Not sure which way to go today?",
    kicker: "Proverbs 3:5–6 · for your morning",
    script:
      "Not sure which way to go today? " +
      "“Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He will make your paths straight.” " +
      "You don't have to see the whole map. Just take the next step with Him. " +
      "Carry this with you today: He will make my path straight.",
    images: ["/images/sleep/psalm-119/s1.jpg", "/images/sleep/psalm-143/s2.jpg", "/images/sleep/psalm-30/s2.jpg"],
    caption: "You don't have to see the whole map. Proverbs 3:5–6 🧭",
  },
  {
    id: "plans-for-you",
    series: "walk",
    badge: "Day 12 · Morning verse",
    hook: "Today isn't random",
    kicker: "Jeremiah 29:11 · for your morning",
    script:
      "Today isn't random. God said this to people living far from home, in exile. " +
      "“For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.” " +
      "Even in a hard season, He hasn't lost the plot. " +
      "Carry this with you today: He has a future and a hope for me.",
    images: ["/images/sleep/psalm-65/s1.jpg", "/images/sleep/psalm-145/s1.jpg", "/images/sleep/john-8/s2.jpg"],
    caption: "Even in a hard season, He hasn't lost the plot. Jeremiah 29:11 ✨",
  },
  {
    id: "wings-like-eagles",
    series: "walk",
    badge: "Day 13 · Morning verse",
    hook: "Tired before the day has even started?",
    kicker: "Isaiah 40:31 · for your morning",
    script:
      "Tired before the day has even started? " +
      "“But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary, they will walk and not faint.” " +
      "Your strength for today doesn't have to come from you. " +
      "Carry this with you today: those who wait on the Lord renew their strength.",
    images: ["/images/sleep/psalm-30/s2.jpg", "/images/sleep/psalm-145/s2.jpg", "/images/sleep/psalm-65/s1.jpg"],
    caption: "Your strength for today doesn't have to come from you. Isaiah 40:31 🦅",
  },
  {
    id: "one-day-at-a-time",
    series: "walk",
    badge: "Day 14 · Morning verse",
    hook: "Don't carry tomorrow into today",
    kicker: "Matthew 6:34 · for your morning",
    script:
      "Don't carry tomorrow into today. Jesus said, " +
      "“Therefore do not worry about tomorrow, for tomorrow will worry about itself. Today has enough trouble of its own.” " +
      "Today is the only day you've been given to live. Live this one. " +
      "Carry this with you today: one day at a time.",
    images: ["/images/sleep/psalm-96/s1.jpg", "/images/sleep/psalm-65/s1.jpg", "/images/sleep/psalm-145/s2.jpg"],
    caption: "Today is the only day you've been given to live. Matthew 6:34 🌤️",
  },

  {
    id: "perfect-peace",
    series: "sleep",
    badge: "Night 8 · Scripture for sleep",
    hook: "Can't switch your mind off?",
    kicker: "Isaiah 26:3 · for tonight",
    script:
      "Can't switch your mind off tonight? Here's where perfect peace comes from. " +
      "“You will keep in perfect peace the steadfast of mind, because he trusts in You.” " +
      "Not a quiet mind first, and then trust. Trust first, and the peace follows. Rest your mind on Him tonight.",
    images: ["/images/sleep/psalm-63/s2.jpg", "/images/sleep/psalm-131/s1.jpg"],
    caption: "Trust first, and the peace follows. Isaiah 26:3 🌙",
  },
  {
    id: "come-to-me",
    series: "sleep",
    badge: "Night 9 · Scripture for sleep",
    hook: "Jesus has an invitation for you tonight",
    kicker: "Matthew 11:28–29 · for tonight",
    script:
      "Jesus has an invitation for you tonight. " +
      "“Come to Me, all you who are weary and burdened, and I will give you rest.” " +
      "“I am gentle and humble in heart, and you will find rest for your souls.” " +
      "Bring Him everything you're carrying. And rest.",
    images: ["/images/sleep/john-14/s2.jpg", "/images/sleep/psalm-23/s2.jpg"],
    caption: "Come to Me, and I will give you rest. Matthew 11:28 🌙",
  },
  {
    id: "soul-finds-rest",
    series: "sleep",
    badge: "Night 10 · Scripture for sleep",
    hook: "Talk to your own soul tonight",
    kicker: "Psalm 62 · for tonight",
    script:
      "David wrote this while people were plotting against him. " +
      "“In God alone my soul finds rest; my salvation comes from Him.” " +
      "Then he spoke to his own soul. “Rest in God alone, O my soul, for my hope comes from Him.” " +
      "Say it to yourself tonight, slowly. Rest in God alone.",
    images: ["/images/sleep/psalm-62/s1.jpg", "/images/sleep/psalm-62/s2.jpg"],
    caption: "Rest in God alone, O my soul. Psalm 62 🙏",
  },
  {
    id: "when-anxiety",
    series: "sleep",
    badge: "Night 11 · Scripture for sleep",
    hook: "When anxiety hits at night",
    kicker: "Psalm 94:19 · for tonight",
    script:
      "When anxiety overwhelms you at night, pray this. " +
      "“When anxiety overwhelms me, Your consolation delights my soul.” " +
      "The anxiety is real. But so is His comfort, and it is stronger. Let Him comfort you now.",
    images: ["/images/sleep/psalm-94/s1.jpg", "/images/sleep/psalm-94/s2.jpg"],
    caption: "His comfort is stronger than the anxiety. Psalm 94:19 🌙",
  },
  {
    id: "sweet-sleep",
    series: "sleep",
    badge: "Night 12 · Scripture for sleep",
    hook: "Read this right before you close your eyes",
    kicker: "Proverbs 3:24 · for tonight",
    script:
      "A promise to read right before you close your eyes. " +
      "“When you lie down, you will not be afraid; when you rest, your sleep will be sweet.” " +
      "Not because nothing is wrong, but because He is watching over you. Sweet sleep tonight.",
    images: ["/images/sleep/psalm-121/s1.jpg", "/images/sleep/psalm-121/s2.jpg"],
    caption: "When you rest, your sleep will be sweet. Proverbs 3:24 ✨",
  },
  {
    id: "when-afraid",
    series: "sleep",
    badge: "Night 13 · Scripture for sleep",
    hook: "One line to hold onto in the dark",
    kicker: "Psalm 56:3 · for tonight",
    script:
      "Afraid of the dark, or of tomorrow? David gave us one line to hold onto. " +
      "“When I am afraid, I put my trust in You.” " +
      "Not if I'm afraid. When. Fear will come. Trust can come too. Hold that line tonight.",
    images: ["/images/sleep/psalm-56/s1.jpg", "/images/sleep/psalm-57/s1.jpg"],
    caption: "When I am afraid, I put my trust in You. Psalm 56:3 🕯️",
  },
  {
    id: "singing-over-you",
    series: "sleep",
    badge: "Night 14 · Scripture for sleep",
    hook: "God is singing over you tonight",
    kicker: "Zephaniah 3:17 · for tonight",
    script:
      "Fall asleep to this tonight. " +
      "“The LORD your God is among you; He is mighty to save. He will rejoice over you with gladness; He will quiet you with His love; He will rejoice over you with singing.” " +
      "He isn't only watching over you. He's singing over you. Rest.",
    images: ["/images/sleep/psalm-16/s1.jpg", "/images/sleep/psalm-42/s2.jpg"],
    caption: "He will quiet you with His love. Zephaniah 3:17 🎶",
  },
];

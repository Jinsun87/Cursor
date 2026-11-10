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
];

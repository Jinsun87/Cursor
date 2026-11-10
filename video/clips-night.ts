/**
 * Night Stories of the Bible: reels for the Bible For Sleep Facebook page, rendered by clips.ts:
 *   npx tsx video/clips.ts night
 * Each tells a story that happened at night, softly, and ends with one line to sleep on.
 * Scripture is quoted word for word from the Berean Standard Bible (data/bsb.txt).
 * Paintings: public/images/story/ (video/paint-night.ts) and the Sleep chapters.
 */
import type { Clip } from "./clips";

export const NIGHT_CLIPS: Clip[] = [
  {
    id: "jacobs-pillow",
    series: "night",
    badge: "Night Stories · 1",
    hook: "Jacob slept on a stone. Here's what he saw.",
    kicker: "Genesis 28 · a night story",
    script:
      "Jacob was running from home, alone, with nothing but his staff. When the sun went down, he stopped on the open ground. " +
      "“And taking one of the stones from that place, he put it under his head and lay down to sleep.” " +
      "That night he dreamed of a ladder reaching up to heaven, and God spoke to him. " +
      "“Look, I am with you, and I will watch over you wherever you go.” " +
      "When Jacob woke up, he said, “Surely the LORD is in this place, and I was unaware of it.” " +
      "Wherever you're lying down tonight, He is in this place too. Rest.",
    images: ["/images/sleep/genesis-28/s2.jpg", "/images/sleep/genesis-28/s3.jpg", "/images/sleep/genesis-28/s4.jpg"],
    caption: "A stone for a pillow, and heaven open above him. Genesis 28 🌙",
  },
  {
    id: "samuel-called",
    series: "night",
    badge: "Night Stories · 2",
    hook: "A boy heard his name in the dark",
    kicker: "1 Samuel 3 · a night story",
    script:
      "It was late, and the lamp in the temple was burning low. " +
      "“Before the lamp of God had gone out, Samuel was lying down in the temple of the LORD, where the ark of God was located.” " +
      "Then a voice called his name. Three times Samuel ran to old Eli, and three times Eli sent him back to bed. " +
      "Then Eli understood. It was God. So the next time, Samuel answered, “Speak, for Your servant is listening.” " +
      "You can pray that same prayer tonight, lying still in the dark. Speak, Lord. I'm listening.",
    images: ["/images/story/samuel/lamp.jpg", "/images/story/samuel/sleeping.jpg"],
    caption: "Speak, for Your servant is listening. 1 Samuel 3 🕯️",
  },
  {
    id: "elijah-broom-tree",
    series: "night",
    badge: "Night Stories · 3",
    hook: "For the nights when you've had enough",
    kicker: "1 Kings 19 · a night story",
    script:
      "Elijah had just seen fire fall from heaven. Soon after, he was running for his life, worn out and done. " +
      "He sat under a broom tree and prayed. “I have had enough, LORD.” Then he lay down and fell asleep. " +
      "God didn't scold him. He sent an angel with bread and water. " +
      "“Get up and eat, or the journey will be too much for you.” " +
      "Before God asked anything of Elijah, He let him sleep, and He fed him. " +
      "If you've had enough today, that's where God starts with you too. Sleep.",
    images: ["/images/story/elijah/broom-tree.jpg", "/images/story/elijah/bread.jpg"],
    caption: "Before God asked anything of him, He let him sleep. 1 Kings 19 🌙",
  },
  {
    id: "nicodemus-at-night",
    series: "night",
    badge: "Night Stories · 4",
    hook: "He came to Jesus at night",
    kicker: "John 3 · a night story",
    script:
      "Nicodemus was a respected teacher, but he had questions he couldn't ask in daylight. So he came to Jesus at night. " +
      "And Jesus didn't send him away. He talked with him, and that night He spoke the most loved words in the Bible. " +
      "“For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.” " +
      "If you're lying awake with questions tonight, bring them to Him. He still welcomes visitors at night.",
    images: ["/images/sleep/john-3/s1.jpg", "/images/sleep/john-3/s6.jpg"],
    caption: "He still welcomes visitors at night. John 3:16 ✨",
  },
  {
    id: "midnight-hymns",
    series: "night",
    badge: "Night Stories · 5",
    hook: "What Paul and Silas did at midnight",
    kicker: "Acts 16 · a night story",
    script:
      "Paul and Silas had been beaten and locked in the inner cell, their feet fastened in the stocks. And in the darkest hour, this happened. " +
      "“About midnight Paul and Silas were praying and singing hymns to God, and the other prisoners were listening to them.” " +
      "Then the ground shook, the doors flew open, and everyone's chains came loose. " +
      "Your midnight might feel like a prison cell. But it is still a place where you can pray. Whisper a song to Him tonight, and rest.",
    images: ["/images/story/paul-and-silas/midnight.jpg", "/images/story/paul-and-silas/doors.jpg"],
    caption: "Midnight in a prison cell, and they were singing. Acts 16:25 🎶",
  },
  {
    id: "peter-sleeping",
    series: "night",
    badge: "Night Stories · 6",
    hook: "Peter slept the night before his trial",
    kicker: "Acts 12 · a night story",
    script:
      "King Herod had already killed James. Now Peter was in prison, and his trial was set for the morning. You'd think he'd be pacing all night. Instead, " +
      "“Peter was sleeping between two soldiers, bound with two chains, with sentries standing guard at the entrance to the prison.” " +
      "Then an angel came, and a light shone in the cell. “Get up quickly.” And the chains fell off his wrists. " +
      "Peter could sleep because his life was in God's hands. So is yours. Sleep.",
    images: ["/images/story/peter-in-prison/sleeping.jpg", "/images/story/peter-in-prison/light.jpg"],
    caption: "Chained between two soldiers, and still he slept. Acts 12 🕊️",
  },
  {
    id: "night-of-prayer",
    series: "night",
    badge: "Night Stories · 7",
    hook: "Jesus stayed up all night too",
    kicker: "Luke 6 · a night story",
    script:
      "The next morning, Jesus would choose the twelve. But first, He spent the night alone with His Father. " +
      "“In those days Jesus went out to the mountain to pray, and He spent the night in prayer to God.” " +
      "If you can't sleep tonight, you're not alone in the dark. Talk to the Father, the way Jesus did. " +
      "And when your words run out, rest in His company.",
    images: ["/images/story/night-of-prayer/mountain.jpg", "/images/story/night-of-prayer/dawn.jpg"],
    caption: "When you can't sleep, talk to the Father, the way Jesus did. Luke 6:12 🙏",
  },
];

// Bible Topics, Life Situations, Scripture Links, and Church Father Preaching Homilies

export interface TopicVerse {
  reference: string;
  bookSlug: string;
  chapterNumber: number;
  verseSnippet: string;
  thematicTakeaway: string;
}

export interface TopicHomily {
  title: string;
  preacher: string;
  duration: string;
  practicalTips: string[];
  audioScript: string;
}

export interface TopicSubSection {
  id: string;
  title: string;
  tag: string;
  verse: TopicVerse;
  homily: TopicHomily;
}

export interface BibleTopic {
  id: string;
  label: string;
  icon: string;
  category: "struggles" | "virtues" | "spiritual";
  categoryLabel: string;
  summary: string;
  subSections: TopicSubSection[];
}

export const TOPIC_CATEGORIES = [
  { id: "struggles", label: "Challenges & Inner Struggles", icon: "🛡️" },
  { id: "virtues", label: "Virtues & Life Insights", icon: "🕊️" },
  { id: "spiritual", label: "Spiritual Growth & Purpose", icon: "✨" },
] as const;

export const BIBLE_TOPICS: BibleTopic[] = [
  // -------------------------------------------------------------
  // 1. ANGER (Challenges & Inner Struggles)
  // -------------------------------------------------------------
  {
    id: "anger",
    label: "Anger",
    icon: "🔥",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Overcoming reactive fury, workplace indignity, and lingering resentment through Christ's meekness.",
    subSections: [
      {
        id: "anger-workplace",
        title: "Workplace Frustration & Unfair Treatment",
        tag: "Career & Labor",
        verse: {
          reference: "Ephesians 6:7-9 & Ephesians 4:26",
          bookSlug: "ephesians",
          chapterNumber: 6,
          verseSnippet:
            "Serve wholeheartedly, as if you were serving the Lord, not people, because you know that the Lord will reward each one for whatever good they do... In your anger do not sin; do not let the sun go down while you are still angry.",
          thematicTakeaway: "Your ultimate boss is Christ. Lay down vindication so God can defend your labor.",
        },
        homily: {
          title: "Overcoming Workplace Outrage",
          preacher: "Father John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Do not draft or send replies while your heart rate is elevated. Silence is your first defense.",
            "Mentally re-seat your difficult manager or coworker as a soul wounded by pride, not your enemy.",
            "Transfer your grievance from your heart to God's courtroom: 'Lord, You see my labor; I entrust my vindication to You.'",
          ],
          audioScript:
            "Listen closely, my friend. When frustration ignites at your desk—when credit is stolen, an unfair demand is made, or your dignity is brushed aside—your flesh demands immediate retaliation. Saint Paul writes in Ephesians: 'Serve wholeheartedly as unto the Lord, not unto men.' Remember: your employer did not author your destiny, and they cannot withhold God's reward from your hands. Before you speak, step back. Take three slow breaths. Do not allow another person's pettiness to rob you of Christ's peace. Lay down the urge to avenge yourself, and watch God fight for you.",
        },
      },
      {
        id: "anger-desires",
        title: "Anger from Unmet Desires & Entitlement",
        tag: "Expectations",
        verse: {
          reference: "James 1:19-20 & James 4:1-2",
          bookSlug: "james",
          chapterNumber: 1,
          verseSnippet:
            "Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires. What causes fights and quarrels among you? Don't they come from your desires that battle within you?",
          thematicTakeaway: "Rage often reveals our hidden idols. Surrendering our demands restores our joy.",
        },
        homily: {
          title: "The Fire of Unmet Expectations",
          preacher: "Abba Dorotheus of Gaza",
          duration: "2 min",
          practicalTips: [
            "Ask yourself: 'What desire did I treat as an absolute right today?'",
            "Replace the phrase 'They should have' with 'Lord, how can I serve?'",
            "Practice being second: give someone else the preference in traffic, conversation, or decisions.",
          ],
          audioScript:
            "Why do we become angry when plans unravel? Saint James diagnosed the root two thousand years ago: our passions war within our members. We want our timetable, our convenience, our reputation acknowledged. When reality contradicts our desires, anger is the flare of an entitled heart. Today, take the thing you are gripping so tightly and open your palms. Say quietly: 'Father, not my will, but Yours.' The moment you release your entitlement, your anger has no wood left to burn.",
        },
      },
      {
        id: "anger-health",
        title: "Anger Due to Poor Health & Chronic Pain",
        tag: "Physical Suffering",
        verse: {
          reference: "Romans 8:18-26 & 2 Corinthians 12:9",
          bookSlug: "romans",
          chapterNumber: 8,
          verseSnippet:
            "I consider that our present sufferings are not worth comparing with the glory that will be revealed in us... And the Spirit helps us in our weakness, interceding for us through wordless groans.",
          thematicTakeaway: "Pain can tempt us to rage at God; Christ invites us to groan with hope.",
        },
        homily: {
          title: "When the Body Feels Like a Prison",
          preacher: "Saint Augustine of Hippo",
          duration: "2 min",
          practicalTips: [
            "Do not pretend you are not hurting; pour out your honest complaint like David in the Psalms.",
            "Refuse the lie that sickness is God's abandonment; Christ was closest in His own physical torment.",
            "Anchor in the eternal horizon: this mortal tent is temporary, and resurrection power is already at work.",
          ],
          audioScript:
            "My dear child, when chronic pain or a weary body wears down your patience, anger at God and the world is a natural outcry. You ask: 'Why me? Why must I bear this limitation?' Hear Saint Paul in Romans 8: creation groans, and our bodies groan with it. But you do not groan in vain. The Holy Spirit groans alongside you in intercession. Bring your exhaustion to Jesus today. He does not demand forced optimism; He offers His gentle presence to sustain you when your strength fails.",
        },
      },
      {
        id: "anger-family",
        title: "Family Friction & Household Strife",
        tag: "Relationships",
        verse: {
          reference: "Proverbs 3:3-5 & Matthew 5:23-24",
          bookSlug: "proverbs",
          chapterNumber: 3,
          verseSnippet:
            "Let love and faithfulness never leave you; bind them around your neck, write them on the tablet of your heart... If you are offering your gift at the altar and remember your brother has something against you, leave your gift and be reconciled first.",
          thematicTakeaway: "Winning an argument in your household is losing your family peace.",
        },
        homily: {
          title: "Extinguishing Household Spark Fires",
          preacher: "Saint Basil the Great",
          duration: "2 min",
          practicalTips: [
            "Use the 24-hour rule before raising a recurring household grievance.",
            "Lower the volume of your voice; a gentle answer diffuses wrath faster than sharp logic.",
            "Ask for forgiveness for your 10% of the fault, even if the other person holds 90%.",
          ],
          audioScript:
            "In the home, small sparks become blazing forests. We speak sharply to the very people we love the most because our guard is down. Solomon teaches: 'A gentle answer turns away wrath.' Today, if tension has settled over your home, be the first to break the cycle. You do not need to prove yourself right; you need to preserve the bond of peace. A soft word and an humble embrace have dismantled centuries of generational bitterness.",
        },
      },
      {
        id: "anger-bitterness",
        title: "Bitterness & Long-Held Grudges",
        tag: "Forgiveness",
        verse: {
          reference: "Matthew 6:14-15 & Luke 15:28-32",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
          thematicTakeaway: "Bitterness is drinking poison and expecting the offender to die. Forgive to be free.",
        },
        homily: {
          title: "Cutting the Cord of Resentment",
          preacher: "Father John of Kronstadt",
          duration: "2 min",
          practicalTips: [
            "Pray specifically for the spiritual well-being of the person who injured you.",
            "Recognize that forgiving someone does not require trusting them again immediately.",
            "Remember the cross: you and I have been forgiven an insurmountable debt.",
          ],
          audioScript:
            "Bitterness is a heavy chain that ties you to the very person who wounded you. As long as you nurture the grudge, they continue to harm you years after the offense occurred. Christ taught us to pray: 'Forgive us our debts, as we forgive our debtors.' Forgiveness is not saying what they did was good or acceptable; forgiveness is surrendering the right to strike back. Release them into God's righteous hands, and walk out of the prison cell of your own anger.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. ANXIETY & WORRY (Challenges & Inner Struggles)
  // -------------------------------------------------------------
  {
    id: "anxiety",
    label: "Anxiety",
    icon: "🌊",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Quieting panic, financial dread, and sleepless overthinking through the Father's sovereign care.",
    subSections: [
      {
        id: "anxiety-overthinking",
        title: "Power of Overthinking & Racing Thoughts",
        tag: "Mental Calm",
        verse: {
          reference: "Philippians 4:6-8 & Psalms 23:1-3",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet:
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          thematicTakeaway: "Worry borrows tomorrow's catastrophe. Prayer anchors you in today's provision.",
        },
        homily: {
          title: "Quieting the Torrent in the Mind",
          preacher: "Saint Isaac the Syrian",
          duration: "2 min",
          practicalTips: [
            "Write down the three things spinning in your thoughts and hand them to God physically.",
            "Recite Psalm 23:1 slowly aloud: 'The Lord is my shepherd; I lack nothing.'",
            "Focus only on the single task right before you in the next fifteen minutes.",
          ],
          audioScript:
            "Peace be to your spirit. When thoughts spin endlessly through the night, rehearsing worst-case scenarios, your mind is attempting to govern a tomorrow that belongs solely to God. Saint Paul wrote from a Roman prison: 'Do not be anxious about anything.' How could a man chained to soldiers say this? Because he knew that peace is not the absence of trouble, but the presence of Christ. Tell your soul: 'God is already in my tomorrow.' Breathe in His grace, and let the storm settle.",
        },
      },
      {
        id: "anxiety-finances",
        title: "Financial Strain & Future Provision",
        tag: "Money & Survival",
        verse: {
          reference: "Matthew 6:25-34 & Proverbs 3:9-10",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they? Can any one of you by worrying add a single hour to your life?",
          thematicTakeaway: "Your bank balance is not your fortress; the Living God is your Provider.",
        },
        homily: {
          title: "The Birds of the Air and Your Bills",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Identify the difference between immediate daily bread and distant hypothetical fears.",
            "Take honest inventory of past seasons where God brought provision unexpectedly.",
            "Give a small sacrificial offering or help someone else to break money's grip over your heart.",
          ],
          audioScript:
            "Hear the tender voice of Jesus on the Galilean mount: 'Look at the birds of the air; they do not sow or reap, yet your heavenly Father feeds them.' If God adorns wild lilies that bloom for a single afternoon, will He abandon His own sons and daughters? Worry about money has never paid a single bill. Do your honest duty with diligence today, seek His kingdom first, and trust that the God who sustained Elijah in drought will open windows of provision in your life.",
        },
      },
      {
        id: "anxiety-failure",
        title: "Fear of Failure & Performance Dread",
        tag: "Identity & Work",
        verse: {
          reference: "1 Samuel 17:45-47 & 2 Corinthians 12:9-10",
          bookSlug: "1-samuel",
          chapterNumber: 17,
          verseSnippet:
            "David said to the Philistine, 'You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty... for the battle is the Lord's, and he will give all of you into our hands.'",
          thematicTakeaway: "Your worth is secured at the cross, not in your success or failure.",
        },
        homily: {
          title: "Stepping into the Valley of Giants",
          preacher: "Saint Ambrose of Milan",
          duration: "2 min",
          practicalTips: [
            "Stop wearing Saul's armor—be yourself in Christ rather than mimicking others.",
            "Remember that failure in human eyes is often God's setup for deep humility and triumph.",
            "Dedicate your performance to God before you begin: 'Lord, be glorified whether I stumble or shine.'",
          ],
          audioScript:
            "The world measures you by your output, your wins, and your flawless resume. But God looks upon the heart. When young David stood before Goliath, he was not reliant on his own brawn; he declared: 'The battle belongs to the Lord.' If you are paralyzed by the dread of failing at an assignment, a business, or an exam, remember this: God does not call the equipped; He equips the called. Step forward in obedience, and leave the outcome to the King of kings.",
        },
      },
      {
        id: "anxiety-health",
        title: "Health Dread & Chronic Vulnerability",
        tag: "Healing & Trust",
        verse: {
          reference: "Psalms 91:1-6 & Psalms 23:4",
          bookSlug: "psalms",
          chapterNumber: 91,
          verseSnippet:
            "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, 'He is my refuge and my fortress, my God, in whom I trust.' He will cover you with his feathers, and under his wings you will find refuge.",
          thematicTakeaway: "Even in the shadow of vulnerability, God's wings are spread over your life.",
        },
        homily: {
          title: "Resting Under the Wings of the Almighty",
          preacher: "Saint Athanasius of Alexandria",
          duration: "2 min",
          practicalTips: [
            "When health panic spikes, ground your body by feeling your feet on the floor and breathing steadily.",
            "Replace medical doom-scrolling with reading Psalm 91 aloud three times.",
            "Entrust your body to the Great Physician: 'My times are in Your hands.'",
          ],
          audioScript:
            "When physical symptoms rise and catastrophic thoughts whisper that sickness will overtake you, run into the shelter of Psalm 91. The Lord is your refuge and your fortress. Not a single sparrow falls without your Father knowing, and the hairs of your head are numbered. You are not at the mercy of blind chance or disease; you are held by the hands that created the cosmos. Rest your fragile frame in His loving care today.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. FEAR & COURAGE (Challenges & Inner Struggles)
  // -------------------------------------------------------------
  {
    id: "fear",
    label: "Fear",
    icon: "⚡",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Breaking paralysis, lion-den intimidation, and the terror of man with divine boldness.",
    subSections: [
      {
        id: "fear-intimidated",
        title: "Intimidation by Powerful People or Circumstances",
        tag: "Boldness",
        verse: {
          reference: "Daniel 6:10-23 & Acts 9:15-16",
          bookSlug: "daniel",
          chapterNumber: 6,
          verseSnippet:
            "When Daniel learned that the decree had been published, he went home to his upstairs room where the windows opened toward Jerusalem. Three times a day he got down on his knees and prayed... God sent his angel, and he shut the mouths of the lions.",
          thematicTakeaway: "When you kneel before the Almighty God, you can stand before any earthly king.",
        },
        homily: {
          title: "Kneeling Before God, Standing Before Lions",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Do not compromise moral integrity to satisfy a threatening boss or peer group.",
            "Keep your prayer habits unchanged when pressure mounts.",
            "Trust that God's angels are assigned to shut the lions' mouths in your situation.",
          ],
          audioScript:
            "Daniel did not panic when the king's law threatened him with death in the lions' den. He simply walked to his room, opened the windows, and prayed as he had always done. Why? Because the fear of God drove out the fear of man. When earthly authorities or intimidating people threaten your livelihood, look past them to the Sovereign throne. Lions may roar around you, but God has the final word. Stand firm in your faith.",
        },
      },
      {
        id: "fear-unknown",
        title: "Fear of the Unknown Future & Big Changes",
        tag: "Transition",
        verse: {
          reference: "Genesis 12:1-4 & Proverbs 3:5-6",
          bookSlug: "genesis",
          chapterNumber: 12,
          verseSnippet:
            "The Lord had said to Abram, 'Go from your country, your people and your father's household to the land I will show you... and I will bless you.' So Abram went, as the Lord had told him.",
          thematicTakeaway: "You don't need a map of the destination when you know the Guide.",
        },
        homily: {
          title: "Stepping into the Fog with Abraham",
          preacher: "Saint Gregory of Nazianzus",
          duration: "2 min",
          practicalTips: [
            "Focus only on the immediate next step of obedience rather than all twenty future steps.",
            "Remember that God's guidance is like a lamp unto feet—it illuminates the next stride, not the whole mile.",
            "Speak gratitude for past transitions where God made a way out of no way.",
          ],
          audioScript:
            "God called Abram: 'Leave your country and go to a land that I will show you.' Notice the phrasing: God did not show him the land first! He said: 'Begin walking, and I will unveil it.' If you are facing an intimidating career pivot, a move, or a major life crossroads, do not let fear paralyze you. Faith does not mean having all the answers; faith means placing your hand in the Father's hand and taking the next step.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. GRIEF & LOSS (Challenges & Inner Struggles)
  // -------------------------------------------------------------
  {
    id: "grief",
    label: "Grief",
    icon: "🕊️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Holding sorrow, bereavement, and shattered dreams in the tender hope of resurrection.",
    subSections: [
      {
        id: "grief-bereavement",
        title: "Losing a Loved One & Deep Sorrow",
        tag: "Comfort",
        verse: {
          reference: "John 14:1-3, 27 & Revelation 21:3-4",
          bookSlug: "john",
          chapterNumber: 14,
          verseSnippet:
            "Do not let your hearts be troubled. You believe in God; believe also in me. My Father's house has many rooms... And God will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.",
          thematicTakeaway: "Jesus wept at the tomb of Lazarus. He holds your tears and promises resurrection.",
        },
        homily: {
          title: "The Savior Who Weeps Beside You",
          preacher: "Saint Bernard of Clairvaux",
          duration: "2 min",
          practicalTips: [
            "Do not suppress tears; crying is holy water washing a broken heart.",
            "Speak the name of your loved one in prayer and thank God for their life.",
            "Anchor in the certainty that in Christ, goodbyes are never permanent.",
          ],
          audioScript:
            "When grief empties your home and leaves an ache words cannot describe, know that our Lord is the 'Man of Sorrows, well acquainted with grief.' When Lazarus died, Jesus wept—not because He lacked power, but because His heart broke with those who mourn. He does not ask you to rush past your pain. Rest your aching soul in His presence. The day is coming when He will wipe every tear from your eyes and swallow up death forever.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. BURNOUT & WEARINESS (Challenges & Inner Struggles)
  // -------------------------------------------------------------
  {
    id: "burnout",
    label: "Burnout",
    icon: "🕯️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Re-igniting exhausted souls, escaping the rat-race, and finding the unburnt bush of Sabbath.",
    subSections: [
      {
        id: "burnout-exhaustion",
        title: "Exhaustion from Caregiving & Overwork",
        tag: "Rest",
        verse: {
          reference: "Exodus 3:1-5 & Matthew 11:28-30",
          bookSlug: "exodus",
          chapterNumber: 3,
          verseSnippet:
            "Moses saw that though the bush was on fire it did not burn up... 'Take off your sandals, for the place where you are standing is holy ground.' Come to me, all you who are weary and burdened, and I will give you rest.",
          thematicTakeaway: "You are called to burn with God's fire, not consume yourself in human effort.",
        },
        homily: {
          title: "The Fire That Does Not Consume",
          preacher: "Saint Gregory of Nyssa",
          duration: "2 min",
          practicalTips: [
            "Observe a strict digital and work Sabbath this week—unplug completely for half a day.",
            "Say 'no' to non-essential obligations without feeling guilty.",
            "Remember that God operated the universe for billions of years before you were born, and He can manage it while you rest.",
          ],
          audioScript:
            "In Exodus 3, Moses saw a miracle: a bush that blazed with the presence of God, yet the branches were not consumed. Human energy burns out like dry kindling. But divine energy sustains without depleting. If you have been carrying the world on your shoulders—nursing others, working double shifts, solving everyone's crises—you have depleted your fuel. Jesus invites you today: 'Come unto me, all who labor and are heavy laden, and I will give you rest.' Receive His Sabbath peace.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 6. VIRTUES: LOVE & RELATIONSHIPS
  // -------------------------------------------------------------
  {
    id: "love",
    label: "Love",
    icon: "❤️",
    category: "virtues",
    categoryLabel: "Virtues & Life Insights",
    summary: "Cultivating agape devotion, self-giving sacrifice, and enduring patience in relationships.",
    subSections: [
      {
        id: "love-unconditional",
        title: "Patient & Enduring Love (Agape)",
        tag: "Character",
        verse: {
          reference: "1 Corinthians 13:4-8 & Romans 8:38-39",
          bookSlug: "1-corinthians",
          chapterNumber: 13,
          verseSnippet:
            "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love never fails.",
          thematicTakeaway: "True love is not an emotional feeling; it is a sacrificial commitment to another's good.",
        },
        homily: {
          title: "The Royal Law of Agape",
          preacher: "Saint Maximus the Confessor",
          duration: "2 min",
          practicalTips: [
            "Perform an anonymous act of kindness for someone who has annoyed you.",
            "Tear up the mental ledger where you keep score of a spouse or friend's mistakes.",
            "Speak one intentional word of sincere affirmation today.",
          ],
          audioScript:
            "Saint Paul's hymn to love in 1 Corinthians 13 is the portrait of Jesus Himself. Love is patient—it suffers long and remains kind. It does not boast or demand its own way. If you find your patience fraying with difficult family members or colleagues, remember how lavishly God has loved you while you were yet sinners. You cannot manufacture agape from human will; ask the Holy Spirit to pour God's love into your heart afresh today.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 7. VIRTUES: FAITH & TRUST
  // -------------------------------------------------------------
  {
    id: "faith",
    label: "Faith",
    icon: "⚓",
    category: "virtues",
    categoryLabel: "Virtues & Life Insights",
    summary: "Anchoring your soul in the unseen promises of God through seasons of drought.",
    subSections: [
      {
        id: "faith-unseen",
        title: "Steadfast Faith in Waiting Seasons",
        tag: "Perseverance",
        verse: {
          reference: "Hebrews 11:1-6 & Genesis 22:8-14",
          bookSlug: "hebrews",
          chapterNumber: 11,
          verseSnippet:
            "Now faith is confidence in what we hope for and assurance about what we do not see. This is what the ancients were commended for... And without faith it is impossible to please God.",
          thematicTakeaway: "Faith does not eliminate mystery; it trusts the God who stands inside the mystery.",
        },
        homily: {
          title: "The Cloud of Witnesses in Your Living Room",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Reflect on three prayers God answered in the past five years.",
            "Declare: 'Lord, I trust Your heart even when I cannot trace Your hand.'",
            "Keep doing what is right even when you don't feel immediate emotional reward.",
          ],
          audioScript:
            "What is faith? It is not mere wishful thinking. It is substance, conviction, and rock-solid certainty in God's character when the outward circumstances look hopeless. Abraham walked up Mount Moriah believing that God could provide. The heroes of Hebrews 11 conquered kingdoms, endured persecution, and crossed deserts because they saw Him who is invisible. Whatever you are waiting for today, keep your eyes on Jesus. He who promised is faithful.",
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // 8. VIRTUES: PEACE & SERENITY
  // -------------------------------------------------------------
  {
    id: "peace",
    label: "Peace",
    icon: "🕊️",
    category: "virtues",
    categoryLabel: "Virtues & Life Insights",
    summary: "Guarding your heart with Christ's shalom amid noise, headlines, and cultural agitation.",
    subSections: [
      {
        id: "peace-circumstances",
        title: "Peace That Surpasses Understanding",
        tag: "Shalom",
        verse: {
          reference: "John 14:27 & Philippians 4:7",
          bookSlug: "john",
          chapterNumber: 14,
          verseSnippet:
            "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
          thematicTakeaway: "The world's peace depends on calm circumstances. Christ's peace calms you inside the storm.",
        },
        homily: {
          title: "The Calm in the Midst of the Galleon",
          preacher: "Saint Francis of Assisi",
          duration: "2 min",
          practicalTips: [
            "Turn off news alerts and social media noise for two hours today.",
            "Sit in silence for three minutes and whisper: 'My peace I give you.'",
            "Be a peacemaker in your conversations by refusing to fuel gossip or outrage.",
          ],
          audioScript:
            "In the Upper Room, with the shadow of the cross looming, Jesus gave His disciples His farewell gift: 'My peace I give you; not as the world gives do I give to you.' The world defines peace as the absence of war, healthy bank accounts, and smooth days. But Christ gives shalom—wholeness, quiet confidence, and spiritual sanctuary in the very middle of trouble. Receive His peace right where you are sitting now.",
        },
      },
    ],
  },
];

export function getTopicSubSection(subSectionId?: string | null): TopicSubSection | null {
  if (!subSectionId) return null;
  for (const topic of BIBLE_TOPICS) {
    const match = topic.subSections.find((s) => s.id === subSectionId);
    if (match) return match;
  }
  return null;
}

export function getHomilyForChapter(
  bookSlug: string,
  chapterNumber: number,
  topicSubSectionId?: string | null,
): { homily: TopicHomily; scriptureReference?: string } {
  // 1. If explicit topic subsection requested
  if (topicSubSectionId) {
    const sub = getTopicSubSection(topicSubSectionId);
    if (sub) {
      return { homily: sub.homily, scriptureReference: sub.verse.reference };
    }
  }

  // 2. Find any topic sub-section referencing this book & chapter
  for (const topic of BIBLE_TOPICS) {
    for (const sub of topic.subSections) {
      if (sub.verse.bookSlug === bookSlug && sub.verse.chapterNumber === chapterNumber) {
        return { homily: sub.homily, scriptureReference: sub.verse.reference };
      }
    }
  }

  // 3. Fallback generic pastoral reflection for this chapter
  const formattedBook = bookSlug.charAt(0).toUpperCase() + bookSlug.slice(1);
  return {
    homily: {
      title: `Pastoral Meditation on ${formattedBook} ${chapterNumber}`,
      preacher: "Church Father Pastoral Elder",
      duration: "2 min",
      practicalTips: [
        "Take two minutes of stillness before reading; let your racing thoughts quiet down.",
        "Highlight the single sentence or word in this chapter that pricks your conscience.",
        "Take one concrete action today reflecting the truth you discover here.",
      ],
      audioScript: `Beloved, as you open ${formattedBook} chapter ${chapterNumber}, do not rush through these holy words as if they were mundane news print. The ancient scriptures were breathed by the Holy Spirit to minister to your weary soul. Sit quietly, open the ears of your heart, and ask the Father: 'Lord, speak to my circumstance today; Your servant is listening.'`,
    },
    scriptureReference: `${formattedBook} ${chapterNumber}`,
  };
}


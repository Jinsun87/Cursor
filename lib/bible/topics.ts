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

export type TopicCategoryId =
  | "struggles"
  | "growth"
  | "emotions"
  | "philosophical"
  | "virtues"
  | "spiritual";

export interface BibleTopic {
  id: string;
  label: string;
  icon: string;
  category: TopicCategoryId;
  categoryLabel: string;
  summary: string;
  subSections: TopicSubSection[];
}

export const TOPIC_CATEGORIES = [
  { id: "struggles" as const, label: "Challenges & Inner Struggles", icon: "🛡️" },
  { id: "growth" as const, label: "Self-Growth & Strength", icon: "🌱" },
  { id: "emotions" as const, label: "Core Human Emotions & Spiritual Insights", icon: "🕊️" },
  { id: "philosophical" as const, label: "Philosophical & Spiritual Concepts", icon: "💡" },
];

export const BIBLE_TOPICS: BibleTopic[] = [
  // =========================================================================
  // CATEGORY 1: CHALLENGES & INNER STRUGGLES
  // =========================================================================
  {
    id: "anxiety",
    label: "Anxiety",
    icon: "🌊",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Quieting panic, sleepless overthinking, and racing fears through the Father's sovereign shelter.",
    subSections: [
      {
        id: "anxiety-philippians",
        title: "Transcendent Peace Over Daily Dread",
        tag: "Peace in Prayer",
        verse: {
          reference: "Philippians 4:6-7",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet:
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          thematicTakeaway: "Trading white-knuckled worry for grateful prayer releases God's supernatural sentry over your mind.",
        },
        homily: {
          title: "The Sentry of God's Peace",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Write down the single scenario keeping you awake and hand it physically to God in prayer.",
            "Recite Philippians 4:7 slowly three times whenever your chest tightens.",
            "Practice five minutes of silent breath prayer: 'Lord Jesus, I receive Your peace.'",
          ],
          audioScript:
            "Beloved soul, anxiety seeks to convince you that tomorrow is an unmanaged wilderness. But Saint Paul wrote from a Roman prison cell: 'Do not be anxious about anything.' The peace of God is not the mere absence of conflict, but a divine garrison guarding your heart. Entrust this day to Him.",
        },
      },
      {
        id: "anxiety-1peter",
        title: "Casting Your Heavy Burdens",
        tag: "Surrender & Care",
        verse: {
          reference: "1 Peter 5:7",
          bookSlug: "1-peter",
          chapterNumber: 5,
          verseSnippet: "Cast all your anxiety on him because he cares for you.",
          thematicTakeaway: "You were never designed to bear life's weight alone; the Creator personally cares for you.",
        },
        homily: {
          title: "The Father Who Bears Your Load",
          preacher: "Saint Augustine of Hippo",
          duration: "2 min",
          practicalTips: [
            "Physically open your hands flat on your lap as an act of surrendering what you cannot control.",
            "Remind your inner critic: 'God cares for me personally right now.'",
            "Focus only on the immediate task directly before you in the next fifteen minutes.",
          ],
          audioScript:
            "Notice the active word the apostle uses: 'Cast.' It means throwing off a pack that is crushing your spine. Why continue white-knuckling your circumstances when Almighty God invites you to transfer the load to His omnipotent shoulders?",
        },
      },
      {
        id: "anxiety-matthew",
        title: "The Birds of the Air & Daily Bread",
        tag: "Provision & Trust",
        verse: {
          reference: "Matthew 6:25-34",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own. Look at the birds of the air: they do not sow or reap, yet your heavenly Father feeds them.",
          thematicTakeaway: "Worry cannot add a single cubit to your life. Today's grace is sufficient for today's burden.",
        },
        homily: {
          title: "Living in the Grace of Today",
          preacher: "Saint Francis of Assisi",
          duration: "2 min",
          practicalTips: [
            "Notice the birds outside your window and remember your infinite worth in God's sight.",
            "Refuse to rehearse tomorrow's potential problems until tomorrow arrives.",
            "Focus on seeking God's kingdom and righteousness in your very next interaction.",
          ],
          audioScript:
            "Consider the wild lilies and the soaring birds. They do not store away in storehouses, yet our heavenly Father clothes them in majesty. If God cares for passing blossoms, will He abandon His beloved children? Rest in today's bread.",
        },
      },
      {
        id: "anxiety-psalm94",
        title: "Consolation Amid Multitudes of Anxieties",
        tag: "Inner Consolation",
        verse: {
          reference: "Psalm 94:19",
          bookSlug: "psalms",
          chapterNumber: 94,
          verseSnippet: "When anxiety was great within me, your consolation brought me joy.",
          thematicTakeaway: "Even when inner panic multiplies like a storm, God's whisper brings enduring consolation.",
        },
        homily: {
          title: "Joy That Pierces the Cloud",
          preacher: "Saint Isaac the Syrian",
          duration: "2 min",
          practicalTips: [
            "Acknowledge the storm without judging yourself for feeling overwhelmed.",
            "Whisper: 'Lord, let Your comfort bring my soul joy.'",
            "Listen to quiet Scripture audio to reset your nervous system.",
          ],
          audioScript:
            "When the mind is crowded with dark forecasts, the psalmist points us to divine consolation. God does not dismiss your fear; He enters into it, extending a comforting hand that anchors your trembling heart.",
        },
      },
    ],
  },
  {
    id: "guilt",
    label: "Guilt",
    icon: "⚖️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Releasing shame, receiving unconditional cleansing, and walking in no-condemnation freedom.",
    subSections: [
      {
        id: "guilt-1john",
        title: "Faithful & Just to Forgive",
        tag: "Cleansing & Confession",
        verse: {
          reference: "1 John 1:9",
          bookSlug: "1-john",
          chapterNumber: 1,
          verseSnippet:
            "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
          thematicTakeaway: "Confession is not informing God of something He didn't know; it is stepping into His waiting fountain of mercy.",
        },
        homily: {
          title: "The Cleansing of the Heart",
          preacher: "Saint John the Theologian",
          duration: "2 min",
          practicalTips: [
            "Name your transgression plainly before God without making defensive excuses.",
            "Believe that God's justice was fulfilled at the Cross on your behalf.",
            "Walk forward in the radiant purity Christ has purchased for you.",
          ],
          audioScript:
            "Guilt whispers that you are permanently soiled. But Scripture proclaims: He is faithful and just to cleanse us from all unrighteousness. When you bring your brokenness into the light, His grace purifies every stain.",
        },
      },
      {
        id: "guilt-psalm32",
        title: "The Joy of a Cleared Conscience",
        tag: "Conscience & Release",
        verse: {
          reference: "Psalm 32:5",
          bookSlug: "psalms",
          chapterNumber: 32,
          verseSnippet:
            "Then I acknowledged my sin to you and did not cover up my iniquity. I said, 'I will confess my transgressions to the Lord.' And you forgave the guilt of my sin.",
          thematicTakeaway: "Unconfessed sin wastes the bones; unburdening your soul unlocks unhindered joy.",
        },
        homily: {
          title: "Breaking the Silence of Shame",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Stop concealing the fault you have carried in secrecy.",
            "Speak the confession aloud in private prayer.",
            "Celebrate the forgiveness that removes your guilt as far as east is from west.",
          ],
          audioScript:
            "David knew the agony of silent hiding—bones wasting away with groaning all day long. But the instant he acknowledged his fault, God removed the crushing guilt. Step out of the shadows of hiding into His forgiveness.",
        },
      },
      {
        id: "guilt-romans8",
        title: "No Condemnation in Christ",
        tag: "Legal Freedom",
        verse: {
          reference: "Romans 8:1-2",
          bookSlug: "romans",
          chapterNumber: 8,
          verseSnippet:
            "Therefore, there is now no condemnation for those who are in Christ Jesus, because through Christ Jesus the law of the Spirit who gives life has set you free.",
          thematicTakeaway: "The verdict has been rendered in heaven's courtroom: acquitted, redeemed, and beloved.",
        },
        homily: {
          title: "The Courtroom of Grace",
          preacher: "Saint Paul the Apostle",
          duration: "2 min",
          practicalTips: [
            "Distinguish between Holy Spirit conviction (which restores) and demonic condemnation (which accuses).",
            "Declare out loud: 'There is now no condemnation for me in Christ Jesus.'",
            "Refuse to re-punish yourself for sins Christ has already paid for.",
          ],
          audioScript:
            "Hear the resounding declaration of Romans 8: 'There is now no condemnation.' The accuser points his finger, but Christ holds up His pierced hands. You are covered by the blood of the Lamb. Live in holy freedom.",
        },
      },
      {
        id: "guilt-psalm51",
        title: "A Clean Heart & Renewed Spirit",
        tag: "Restoration",
        verse: {
          reference: "Psalm 51:1-4",
          bookSlug: "psalms",
          chapterNumber: 51,
          verseSnippet:
            "Have mercy on me, O God, according to your unfailing love; according to your great compassion blot out my transgressions. Wash away all my iniquity and cleanse me from my sin.",
          thematicTakeaway: "God desires truth in the inmost being and delights in creating a clean heart out of ruins.",
        },
        homily: {
          title: "The Cry for a Pure Heart",
          preacher: "Saint Gregory of Nyssa",
          duration: "2 min",
          practicalTips: [
            "Pray Psalm 51:10: 'Create in me a pure heart, O God.'",
            "Trust in God's unfailing compassion rather than your own moral score.",
            "Allow forgiven failure to become a ministry of empathy toward others.",
          ],
          audioScript:
            "No soul is too fallen for God's unfailing love. David wrote Psalm 51 after his greatest collapse, yet God restored to him the joy of salvation. Bring your brokenness to the Potter; He recreates what is shattered.",
        },
      },
    ],
  },
  {
    id: "regret",
    label: "Regret",
    icon: "⏳",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Breaking the loop of past mistakes and pressing forward into God's new dawn.",
    subSections: [
      {
        id: "regret-philippians",
        title: "Forgetting What Lies Behind",
        tag: "Forward Momentum",
        verse: {
          reference: "Philippians 3:13-14",
          bookSlug: "philippians",
          chapterNumber: 3,
          verseSnippet:
            "Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead, I press on toward the goal to win the prize for which God has called me heavenward.",
          thematicTakeaway: "You cannot run the race of faith while looking backward in the rearview mirror.",
        },
        homily: {
          title: "Eyes on the Celestial Finish Line",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Make peace with the fact that yesterday cannot be rewritten, but tomorrow can be consecrated.",
            "Write down your lingering regret and cross it out with the sign of the cross.",
            "Focus your attention on the prize of knowing Christ today.",
          ],
          audioScript:
            "Saint Paul had plenty to regret—he had persecuted the church and approved the stoning of Stephen. Yet he resolved: 'One thing I do: forgetting what is behind, I press forward.' Hand your yesterday to God's mercy.",
        },
      },
      {
        id: "regret-2corinthians",
        title: "Godly Grief vs. Worldly Regret",
        tag: "True Repentance",
        verse: {
          reference: "2 Corinthians 7:10",
          bookSlug: "2-corinthians",
          chapterNumber: 7,
          verseSnippet:
            "Godly sorrow brings repentance that leads to salvation and leaves no regret, but worldly sorrow brings death.",
          thematicTakeaway: "Worldly sorrow traps you in self-pity; godly sorrow turns your feet toward life and salvation.",
        },
        homily: {
          title: "Turning Sorrow into Sacred Fuel",
          preacher: "Saint John Cassian",
          duration: "2 min",
          practicalTips: [
            "Ask yourself: 'Is this regret drawing me closer to Jesus, or sinking me in shame?'",
            "Take one constructive, loving action today inspired by past lessons.",
            "Receive the forgiveness that leaves no regret.",
          ],
          audioScript:
            "Worldly sorrow is an endless downward spiral of self-reproach. Godly sorrow, however, is a holy spark that turns you toward Christ. Let your regret transform into grateful obedience that honors God.",
        },
      },
      {
        id: "regret-isaiah43",
        title: "Behold, I Am Doing a New Thing",
        tag: "New Beginnings",
        verse: {
          reference: "Isaiah 43:18-19",
          bookSlug: "isaiah",
          chapterNumber: 43,
          verseSnippet:
            "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.",
          thematicTakeaway: "God specializes in carving roads through wilderness and rivers through desert wastelands.",
        },
        homily: {
          title: "Streams in the Desert of Memory",
          preacher: "Isaiah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Stop dwelling on the closed doors and missed opportunities of past years.",
            "Open your eyes to perceive the small shoots of new life God is sprouting today.",
            "Affirm: 'My God is making a road in my desert.'",
          ],
          audioScript:
            "Hear the Lord through Isaiah: 'Do not dwell on the past. See, I am doing a new thing!' If you keep your gaze fixed on dry wastelands of the past, you will miss the fresh streams God is opening right beneath your feet.",
        },
      },
    ],
  },
  {
    id: "jealousy",
    label: "Jealousy",
    icon: "🌱",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Rooting out envy, rejoicing in others' blessings, and resting in your unique calling.",
    subSections: [
      {
        id: "jealousy-james",
        title: "Disorder Caused by Bitter Envy",
        tag: "Heart Cleansing",
        verse: {
          reference: "James 3:16",
          bookSlug: "james",
          chapterNumber: 3,
          verseSnippet:
            "For where you have envy and selfish ambition, there you find disorder and every evil practice.",
          thematicTakeaway: "Jealousy is a spiritual rot that blinds you to the feast God has placed on your own table.",
        },
        homily: {
          title: "Uprooting the Weed of Envy",
          preacher: "Saint Basil the Great",
          duration: "2 min",
          practicalTips: [
            "Silently pray a prayer of blessing over the person you feel envious toward.",
            "List three gifts God has entrusted specifically to your hands.",
            "Refuse to scroll social media when your heart feels prone to comparison.",
          ],
          audioScript:
            "Saint Basil called envy the viper that poisons the breast of the one who carries it. When someone else succeeds, do not grieve. God's treasury is not exhausted; another's blessing does not diminish God's goodness to you.",
        },
      },
      {
        id: "jealousy-proverbs",
        title: "A Heart at Peace Gives Life",
        tag: "Health & Peace",
        verse: {
          reference: "Proverbs 14:30",
          bookSlug: "proverbs",
          chapterNumber: 14,
          verseSnippet: "A heart at peace gives life to the body, but envy rots the bones.",
          thematicTakeaway: "Contentment brings physical and spiritual vitality, while envy drains life from within.",
        },
        homily: {
          title: "Healing the Bone-Rot of Envy",
          preacher: "Solomon the Wise",
          duration: "2 min",
          practicalTips: [
            "Notice how envy tightens your chest and shoulders; breathe deeply and let it go.",
            "Cultivate gratitude for simple, quiet blessings.",
            "Speak genuine words of congratulations to someone today.",
          ],
          audioScript:
            "Envy rots the bones because it turns life into a constant rivalry. But a tranquil heart—at rest in the goodness of God—gives life and vigor to the whole body. Choose peace over the treadmill of comparison.",
        },
      },
      {
        id: "jealousy-1corinthians",
        title: "Living Beyond Fleshly Rivalry",
        tag: "Maturity",
        verse: {
          reference: "1 Corinthians 3:3",
          bookSlug: "1-corinthians",
          chapterNumber: 3,
          verseSnippet:
            "You are still worldly. For since there is jealousy and quarreling among you, are you not worldly? Are you not acting merely like humans?",
          thematicTakeaway: "Spiritual maturity means moving from factional competition to kingdom cooperation.",
        },
        homily: {
          title: "The Higher Walk of the Spirit",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Stop keeping score of who gets recognition or applause.",
            "Cheer for your brothers and sisters in Christ as fellow members of the same body.",
            "Remember that every part of the body has an indispensable role.",
          ],
          audioScript:
            "When the Corinthian believers competed over who was greatest, Paul reminded them that jealousy is the hallmark of spiritual infancy. In Christ, we belong to one body. When one member is honored, all rejoice together.",
        },
      },
      {
        id: "jealousy-galatians",
        title: "No Provoking, No Envying",
        tag: "Humility in Community",
        verse: {
          reference: "Galatians 5:26",
          bookSlug: "galatians",
          chapterNumber: 5,
          verseSnippet: "Let us not become conceited, provoking and envying each other.",
          thematicTakeaway: "True freedom in the Spirit means you have nothing to prove and no one to outshine.",
        },
        homily: {
          title: "Walking in Freedom Together",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Catch yourself when boasting about an accomplishment and redirect glory to God.",
            "Compliment a coworker or peer in front of others.",
            "Anchor your security in being a beloved child of the Father.",
          ],
          audioScript:
            "Conceit and envy are two sides of the same coin. Conceit looks down in arrogance; envy looks up in bitterness. The Spirit of God frees us from both, allowing us to walk in genuine brotherly affection.",
        },
      },
    ],
  },
  {
    id: "anger",
    label: "Anger",
    icon: "🔥",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Overcoming reactive fury, workplace indignity, and lingering resentment through Christ's meekness.",
    subSections: [
      {
        id: "anger-ephesians",
        title: "Do Not Let the Sun Go Down",
        tag: "Daily Reconciliation",
        verse: {
          reference: "Ephesians 4:26-27",
          bookSlug: "ephesians",
          chapterNumber: 4,
          verseSnippet:
            "In your anger do not sin: Do not let the sun go down while you are still angry, and do not give the devil a foothold.",
          thematicTakeaway: "Unresolved anger leaves an open door for bitterness and demonic division.",
        },
        homily: {
          title: "Closing the Door on Outrage",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Clear grievances before sleep; do not nurse grudges overnight.",
            "Lower your voice when disagreements heat up.",
            "Pray for the person who offended you before closing your eyes.",
          ],
          audioScript:
            "Saint Paul warns: do not let the sun set on your wrath. When anger is held through the night, it ferments into malice. Extinguish the spark before it burns down your household peace.",
        },
      },
      {
        id: "anger-james",
        title: "Slow to Speak, Slow to Anger",
        tag: "Self-Restraint",
        verse: {
          reference: "James 1:19-20",
          bookSlug: "james",
          chapterNumber: 1,
          verseSnippet:
            "Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.",
          thematicTakeaway: "Human rage never produces the righteous harvest of God; quiet listening diffuses wrath.",
        },
        homily: {
          title: "The Armor of Silence",
          preacher: "Abba Dorotheus of Gaza",
          duration: "2 min",
          practicalTips: [
            "Count to ten and take three slow breaths before responding to an irritating comment.",
            "Seek first to understand the other person's perspective before defending your own.",
            "Remember that silence is often the most eloquent victory.",
          ],
          audioScript:
            "When indignation flares, the tongue wants to strike. But Saint James teaches us the royal discipline: be quick to listen, slow to speak, slow to anger. Righteousness is cultivated in quiet restraint.",
        },
      },
      {
        id: "anger-proverbs",
        title: "A Gentle Answer Turns Away Wrath",
        tag: "Gentle Speech",
        verse: {
          reference: "Proverbs 15:1",
          bookSlug: "proverbs",
          chapterNumber: 15,
          verseSnippet: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
          thematicTakeaway: "Soft speech has the power to disarm conflict where sharp logic only pours fuel on fire.",
        },
        homily: {
          title: "Softening the Iron of Rage",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Match harsh tones with a calm, subdued answer.",
            "Avoid weaponized sarcasm and defensive retorts.",
            "Choose reconciliation over the fleeting thrill of winning an argument.",
          ],
          audioScript:
            "Like water on hot coals, a soft answer instantly drains heat from an explosive encounter. If someone approaches you with fury today, surprise them with gentleness. You will disarm wrath with Christ's meekness.",
        },
      },
      {
        id: "anger-colossians",
        title: "Rid Yourselves of Malice",
        tag: "Spiritual Cleansing",
        verse: {
          reference: "Colossians 3:8",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet:
            "But now you must also rid yourselves of all such things as these: anger, rage, malice, slander, and filthy language from your lips.",
          thematicTakeaway: "Take off the soiled garments of rage and put on the royal robes of compassion.",
        },
        homily: {
          title: "Discarding the Old Garment",
          preacher: "Saint Ambrose of Milan",
          duration: "2 min",
          practicalTips: [
            "Identify recurring anger triggers in your daily routine.",
            "Replace defensive language with blessings and truth.",
            "Ask the Holy Spirit to fill the space once occupied by hostility with patient love.",
          ],
          audioScript:
            "Saint Paul treats anger like a filthy, ragged coat that no longer fits a child of the King. Throw it off! Clothe yourself instead with kindness, humility, and patience.",
        },
      },
    ],
  },
  {
    id: "ego",
    label: "Ego & Pride",
    icon: "👑",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Dethroning self-importance, embracing holy humility, and finding honor in serving.",
    subSections: [
      {
        id: "ego-proverbs",
        title: "Pride Goes Before Destruction",
        tag: "Caution & Humility",
        verse: {
          reference: "Proverbs 16:18",
          bookSlug: "proverbs",
          chapterNumber: 16,
          verseSnippet: "Pride goes before destruction, a haughty spirit before a fall.",
          thematicTakeaway: "Self-exaltation paves the road to ruin; staying low is the safest place on earth.",
        },
        homily: {
          title: "The Pitfall of Self-Exaltation",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Examine your motives: are you working for God's glory or human applause?",
            "Accept constructive criticism with grace and without immediate defensiveness.",
            "Give credit to God and your teammates for every success.",
          ],
          audioScript:
            "Pride is the blindfold that conceals the cliff edge. Solomon warns that a haughty spirit precedes a fall. The humble soul has nowhere to fall, for it already rests low at the feet of Jesus.",
        },
      },
      {
        id: "ego-james",
        title: "God Opposes the Proud",
        tag: "Grace to the Humble",
        verse: {
          reference: "James 4:6",
          bookSlug: "james",
          chapterNumber: 4,
          verseSnippet: "God opposes the proud but shows favor to the humble.",
          thematicTakeaway: "God actively resists the self-sufficient, but pours out ocean waves of grace to the lowly.",
        },
        homily: {
          title: "The Gravity of Divine Favor",
          preacher: "Saint Bernard of Clairvaux",
          duration: "2 min",
          practicalTips: [
            "Acknowledge your total dependence on God for your next breath and heartbeat.",
            "Volunteer for the lowliest task that nobody else wants to do.",
            "Rest in knowing that God exalts you in His perfect timing.",
          ],
          audioScript:
            "Water always flows to the lowest valleys; it never gathers on mountain peaks. So too does the grace of God bypass the haughty and flow down into the contrite heart. Humble yourself before the Lord.",
        },
      },
      {
        id: "ego-philippians",
        title: "Counting Others More Significant",
        tag: "Christlikeness",
        verse: {
          reference: "Philippians 2:3",
          bookSlug: "philippians",
          chapterNumber: 2,
          verseSnippet:
            "Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.",
          thematicTakeaway: "The mind of Christ seeks not its own rights, but the enrichment and honor of others.",
        },
        homily: {
          title: "The Mind That Was in Christ",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Let someone else take the first place in line or the best seat.",
            "Listen to another person's story without steering the conversation back to yourself.",
            "Serve someone who cannot possibly repay you.",
          ],
          audioScript:
            "Jesus, being in very nature God, did not consider equality with God something to be used to His own advantage; He made Himself nothing, taking the nature of a servant. When we lower ourselves to serve, we mirror the King of Glory.",
        },
      },
      {
        id: "ego-1peter",
        title: "Clothe Yourselves with Humility",
        tag: "Daily Garment",
        verse: {
          reference: "1 Peter 5:5",
          bookSlug: "1-peter",
          chapterNumber: 5,
          verseSnippet:
            "All of you, clothe yourselves with humility toward one another, because, 'God opposes the proud but shows favor to the humble.'",
          thematicTakeaway: "Humility is not thinking less of yourself; it is thinking of yourself less.",
        },
        homily: {
          title: "Wearing the Servant's Apron",
          preacher: "Simon Peter",
          duration: "2 min",
          practicalTips: [
            "Remember Peter watching Jesus wrap an apron around His waist to wash dusty feet.",
            "Approach every conversation with the question: 'How can I bless this soul?'",
            "Cast your vanity aside to pursue genuine holiness.",
          ],
          audioScript:
            "Peter remembered the night Jesus knelt with a washbasin. He tells us: 'Clothe yourselves with humility.' Put on the servant's apron. When you serve in humility, you are cloaked in the beauty of Christ.",
        },
      },
    ],
  },
  {
    id: "doubt",
    label: "Doubt",
    icon: "🧭",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Wrestling through intellectual uncertainty, unanswered prayers, and fragile faith.",
    subSections: [
      {
        id: "doubt-mark",
        title: "I Believe; Help My Unbelief",
        tag: "Honest Faith",
        verse: {
          reference: "Mark 9:24",
          bookSlug: "mark",
          chapterNumber: 9,
          verseSnippet: "Immediately the boy's father exclaimed, 'I do believe; help me overcome my unbelief!'",
          thematicTakeaway: "Jesus welcomes honest doubt mixed with trembling faith; you don't need perfect certainty to reach for Him.",
        },
        homily: {
          title: "The Cry of Fragile Faith",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Be completely honest with God about your questions and struggles.",
            "Offer whatever small mustard seed of faith you have right now.",
            "Remember that Jesus did not rebuke the father; He healed the boy.",
          ],
          audioScript:
            "What a tender cry: 'Lord, I believe; help my unbelief!' The father did not pretend to have immaculate theology; he brought his honest struggle to the feet of Jesus. Christ does not snuff out a smoldering wick.",
        },
      },
      {
        id: "doubt-james",
        title: "Anchoring the Wave of the Sea",
        tag: "Steadfastness",
        verse: {
          reference: "James 1:6",
          bookSlug: "james",
          chapterNumber: 1,
          verseSnippet:
            "But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind.",
          thematicTakeaway: "Anchor your heart in God's immutable character rather than shifting cultural winds.",
        },
        homily: {
          title: "Dropping the Anchor in the Surge",
          preacher: "Saint James the Just",
          duration: "2 min",
          practicalTips: [
            "Write down three foundational truths about God that never change.",
            "Refuse to let transient feelings dictate your spiritual conviction.",
            "Stay committed to prayer even when emotions feel dry.",
          ],
          audioScript:
            "The wave of the sea surges and falls with every breeze. If you anchor your faith in fluctuating emotions, you will be perpetually tossed. Anchor your soul in the rock of God's Word, which stands forever.",
        },
      },
      {
        id: "doubt-matthew",
        title: "Faith That Moves Mountains",
        tag: "Divine Authority",
        verse: {
          reference: "Matthew 21:21",
          bookSlug: "matthew",
          chapterNumber: 21,
          verseSnippet:
            "Truly I tell you, if you have faith and do not doubt, not only can you do what was done to the fig tree, but also you can say to this mountain, 'Go, throw yourself into the sea,' and it will be done.",
          thematicTakeaway: "The power of faith is not the greatness of your belief, but the greatness of the God you trust.",
        },
        homily: {
          title: "The Mountain-Moving God",
          preacher: "Saint Cyril of Jerusalem",
          duration: "2 min",
          practicalTips: [
            "Look at the mountain in your life and declare God's sovereign power over it.",
            "Stop measuring your faith with a microscope; measure God's faithfulness with a telescope.",
            "Take one bold step of obedience despite intimidation.",
          ],
          audioScript:
            "When Jesus spoke of moving mountains, He was not pointing to human willpower, but to the unstoppable power of God unleashed through faith. Even a grain of mustard-seed faith in the living God moves mountains.",
        },
      },
      {
        id: "doubt-jude",
        title: "Mercy to Those Who Doubt",
        tag: "Compassion & Patience",
        verse: {
          reference: "Jude 1:22",
          bookSlug: "jude",
          chapterNumber: 1,
          verseSnippet: "Be merciful to those who doubt.",
          thematicTakeaway: "The church is called to be a hospital of mercy for those wrestling with sincere questions.",
        },
        homily: {
          title: "The Gentle Touch for Troubled Minds",
          preacher: "Jude the Apostle",
          duration: "2 min",
          practicalTips: [
            "Extend patient compassion to friends or family who are questioning their faith.",
            "Avoid harsh argumentative debates; listen with deep empathetic care.",
            "Pray persistently for their illumination by the Holy Spirit.",
          ],
          audioScript:
            "Notice how Jude instructs the church: 'Be merciful to those who doubt.' God does not despise honest inquiry. Meet those who wrestle not with condemnation, but with the warm, patient light of Christ's mercy.",
        },
      },
    ],
  },
  {
    id: "failure",
    label: "Failure",
    icon: "🧗",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Rising from stumbling blocks, broken ventures, and spiritual collapses through God's grip.",
    subSections: [
      {
        id: "failure-proverbs",
        title: "The Righteous Falls Seven Times & Rises",
        tag: "Resilience",
        verse: {
          reference: "Proverbs 24:16",
          bookSlug: "proverbs",
          chapterNumber: 24,
          verseSnippet: "For though the righteous fall seven times, they rise again, but the wicked stumble when calamity strikes.",
          thematicTakeaway: "Righteousness is not about never falling; it is about always getting back up by God's grace.",
        },
        homily: {
          title: "The Art of Getting Back Up",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Do not confuse a temporary setback with a permanent identity.",
            "Ask God: 'What wisdom are You teaching me through this stumble?'",
            "Stand up today and take the very next faithful step.",
          ],
          audioScript:
            "The mark of a righteous soul is not an unblemished record of never slipping, but the holy resilience to rise again. If you have fallen today, do not lie in the dust of defeat. Christ offers His hand: rise and walk.",
        },
      },
      {
        id: "failure-psalm37",
        title: "Held by the Lord's Hand",
        tag: "Upholding Hand",
        verse: {
          reference: "Psalm 37:23-24",
          bookSlug: "psalms",
          chapterNumber: 37,
          verseSnippet:
            "The Lord makes firm the steps of the one who delights in him; though he may stumble, he will not fall, for the Lord upholds him with his hand.",
          thematicTakeaway: "You may stumble, but you will not be utterly cast down, for the Lord grips you by the hand.",
        },
        homily: {
          title: "The Father's Firm Grip",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "Picture a toddler walking with a strong father: when the child trips, the father's grip holds.",
            "Rest in God's grip rather than relying exclusively on your own grasp.",
            "Affirm Psalm 37:24 over your current disappointment.",
          ],
          audioScript:
            "David says: 'Though he stumble, he will not fall headlong, for the Lord upholds him with His hand.' Your security rests not in your grip on God, but in His eternal, unbreakable grip on you. He will not let you fall.",
        },
      },
      {
        id: "failure-lamentations",
        title: "New Mercies Every Morning",
        tag: "Fresh Start",
        verse: {
          reference: "Lamentations 3:22-23",
          bookSlug: "lamentations",
          chapterNumber: 3,
          verseSnippet:
            "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
          thematicTakeaway: "Yesterday's failures do not exhaust God's mercies; His compassions are fresh out of the oven every morning.",
        },
        homily: {
          title: "The Fresh Bread of Morning Grace",
          preacher: "Jeremiah the Weeping Prophet",
          duration: "2 min",
          practicalTips: [
            "Begin every morning by whispering: 'Lord, great is Your faithfulness.'",
            "Refuse to drag yesterday's failures into today's clean canvas.",
            "Trust in His inexhaustible mercies.",
          ],
          audioScript:
            "Jeremiah wrote Lamentations while standing amid the smoking ruins of Jerusalem. Yet out of the ashes he cried: 'His compassions never fail; they are new every morning.' No failure can outlast the faithfulness of God.",
        },
      },
      {
        id: "failure-micah",
        title: "When I Fall, I Shall Arise",
        tag: "Victory in Darkness",
        verse: {
          reference: "Micah 7:8",
          bookSlug: "micah",
          chapterNumber: 7,
          verseSnippet:
            "Do not gloat over me, my enemy! Though I have fallen, I will rise. Though I sit in darkness, the Lord will be my light.",
          thematicTakeaway: "Even when sitting in the dark of defeat, the Lord remains your unquenchable dawn.",
        },
        homily: {
          title: "The Light in the Dark Valley",
          preacher: "Micah",
          duration: "2 min",
          practicalTips: [
            "Tell the accusing voices of failure: 'Do not gloat over me; I will rise.'",
            "Acknowledge the darkness while keeping your gaze on the sunrise of Christ.",
            "Trust that God works all things together for your ultimate good.",
          ],
          audioScript:
            "What defiance of faith Micah displays! 'Do not gloat over me, my enemy! Though I sit in darkness, the Lord will be my light.' Darkness is never the final chapter when the Light of the World is on your side.",
        },
      },
    ],
  },
  {
    id: "confusion",
    label: "Confusion",
    icon: "🕯️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Finding divine clarity, spiritual direction, and stillness when paths seem tangled.",
    subSections: [
      {
        id: "confusion-1corinthians",
        title: "God of Peace, Not of Confusion",
        tag: "Order & Peace",
        verse: {
          reference: "1 Corinthians 14:33",
          bookSlug: "1-corinthians",
          chapterNumber: 14,
          verseSnippet: "For God is not a God of disorder but of peace—as in all the congregations of the Lord's people.",
          thematicTakeaway: "Chaos and frenzied panic do not originate from God; His guidance brings calm, ordered peace.",
        },
        homily: {
          title: "Stillness Over Chaos",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Step away from contradictory advice and sit in ten minutes of quiet prayer.",
            "Ask: 'Does this decision bring the peace of Christ or frantic pressure?'",
            "Trust that God brings clarity in stillness, not in storm.",
          ],
          audioScript:
            "If your mind feels like a howling wind of confusion, know that God is not the author of disorder, but of peace. Step out of the rush. In the quiet presence of Jesus, tangled knots unravel.",
        },
      },
      {
        id: "confusion-proverbs",
        title: "Trusting the Lord with All Your Heart",
        tag: "Surrendering Understanding",
        verse: {
          reference: "Proverbs 3:5-6",
          bookSlug: "proverbs",
          chapterNumber: 3,
          verseSnippet:
            "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          thematicTakeaway: "You don't need to understand every detail when you surrender the steering wheel to God.",
        },
        homily: {
          title: "Straight Paths for Tangled Steps",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Consciously acknowledge God in the dilemma facing you today.",
            "Stop trying to calculate every scenario ten years into the future.",
            "Obey the next clear step of moral duty that lies right in front of you.",
          ],
          audioScript:
            "Human understanding is finite; it cannot see around the bend of tomorrow. But when you lean entirely upon the Lord and submit your path to Him, He promises to make your way straight. Rest in His direction.",
        },
      },
      {
        id: "confusion-james",
        title: "Asking for Heavenly Wisdom",
        tag: "Gift of Wisdom",
        verse: {
          reference: "James 1:5",
          bookSlug: "james",
          chapterNumber: 1,
          verseSnippet:
            "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
          thematicTakeaway: "God never mocks your lack of understanding; He gives wisdom lavishly to all who ask.",
        },
        homily: {
          title: "The Open Treasury of Wisdom",
          preacher: "Saint James",
          duration: "2 min",
          practicalTips: [
            "Ask God plainly: 'Father, give me heavenly wisdom for this choice.'",
            "Consult mature, godly mentors who walk in the fear of the Lord.",
            "Expect God to give guidance with generous kindness.",
          ],
          audioScript:
            "When perplexed, do not wander in frustration. The Creator of the galaxies invites you to ask Him for wisdom. He gives without finding fault or scolding your ignorance. Ask in faith, and He will guide your steps.",
        },
      },
      {
        id: "confusion-psalm119",
        title: "A Lamp Unto My Feet",
        tag: "Illuminated Guidance",
        verse: {
          reference: "Psalm 119:105",
          bookSlug: "psalms",
          chapterNumber: 119,
          verseSnippet: "Your word is a lamp for my feet, a light on my path.",
          thematicTakeaway: "God's Word illuminates the immediate step under your feet, keeping you safe step by step.",
        },
        homily: {
          title: "The Small Oil Lamp in the Night",
          preacher: "Saint Gregory the Great",
          duration: "2 min",
          practicalTips: [
            "Read one chapter of Scripture before making a significant life decision.",
            "Do not demand a floodlight for the next five miles; trust the lamp for your next step.",
            "Let biblical truth be the compass that navigates cultural darkness.",
          ],
          audioScript:
            "An ancient clay oil lamp did not light up the horizon; it cast a circle of light just wide enough for the next stride. God's Word lights your path step by step. Walk in the light you have, and trust Him for the rest.",
        },
      },
    ],
  },
  {
    id: "attachment",
    label: "Attachment & Material Clinging",
    icon: "⛓️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Loosening our grip on temporary possessions, idols, and outcomes to hold Christ alone.",
    subSections: [
      {
        id: "attachment-matthew6-24",
        title: "You Cannot Serve Two Masters",
        tag: "Single-Minded Devotion",
        verse: {
          reference: "Matthew 6:24",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet: "No one can serve two masters... You cannot serve both God and money.",
          thematicTakeaway: "Divided allegiance tears the soul; total devotion to Christ brings undivided peace.",
        },
        homily: {
          title: "Choosing Your True Sovereign",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Identify what object, status, or bank balance rivals God in your thoughts.",
            "Declare: 'Jesus, You are my only Master.'",
            "Use money as a tool to bless others rather than a god to worship.",
          ],
          audioScript:
            "You cannot row a boat in opposite directions at once. When we try to serve both God and wealth, our hearts are torn apart. Make Christ your sole Master, and every material thing will fall into its proper, healthy place.",
        },
      },
      {
        id: "attachment-1john",
        title: "Do Not Love the World",
        tag: "Spiritual Freedom",
        verse: {
          reference: "1 John 2:15",
          bookSlug: "1-john",
          chapterNumber: 2,
          verseSnippet:
            "Do not love the world or anything in the world. If anyone loves the world, love for the Father is not in them.",
          thematicTakeaway: "Clinging to passing worldly systems starves the soul of eternal divine love.",
        },
        homily: {
          title: "Loving the Eternal Over the Passing",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "Notice where consumer cravings hijack your quiet time with God.",
            "Fast from shopping or unnecessary acquisitions this week.",
            "Anchor your affections in the unshakeable kingdom of God.",
          ],
          audioScript:
            "The world is passing away along with all its cravings. Why build your fortress on melting ice? Love the Father whose love endures forever, and your soul will stand unshaken when all earthly kingdoms crumble.",
        },
      },
      {
        id: "attachment-colossians",
        title: "Set Your Minds on Things Above",
        tag: "Heavenly Perspective",
        verse: {
          reference: "Colossians 3:2",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet: "Set your minds on things above, not on earthly things.",
          thematicTakeaway: "Elevating your perspective above temporal fixations frees you from chronic anxiety.",
        },
        homily: {
          title: "The Heavenly Horizon",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Start your day contemplating Christ seated in majesty at the right hand of God.",
            "Ask: 'Will this matter in ten thousand years?'",
            "Live as a citizen of heaven navigating a temporary foreign land.",
          ],
          audioScript:
            "If you were buried with Christ and raised with Him, your true life is hidden with Christ in God. Stop anchoring your happiness to earthly status and earthly toys. Set your mind on heavenly glory.",
        },
      },
      {
        id: "attachment-matthew6-19",
        title: "Treasures in Heaven",
        tag: "True Wealth",
        verse: {
          reference: "Matthew 6:19-21",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "Do not store up for yourselves treasures on earth, where moths and vermin destroy, and where thieves break in and steal. But store up for yourselves treasures in heaven... For where your treasure is, there your heart will be also.",
          thematicTakeaway: "Whatever you invest in the kingdom of God is safe from decay, inflation, and death.",
        },
        homily: {
          title: "The Incorruptible Vault",
          preacher: "Saint Basil the Great",
          duration: "2 min",
          practicalTips: [
            "Invest generously in charity, ministry, and helping the poor.",
            "Audit where your discretionary money and time flow—that reveals your treasure.",
            "Live with open hands: ready to give and ready to release.",
          ],
          audioScript:
            "Earthly wealth rusts, decays, and is stolen away at the grave. But kindness done in Christ's name, love poured out on the needy, and devotion to God are stored in heavenly vaults that never fail. Send your treasure ahead.",
        },
      },
    ],
  },
  {
    id: "greed",
    label: "Greed",
    icon: "💰",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Breaking the thirst of insatiable accumulation through generous contentment.",
    subSections: [
      {
        id: "greed-luke",
        title: "Life Does Not Consist in Possessions",
        tag: "Soul Value",
        verse: {
          reference: "Luke 12:15",
          bookSlug: "luke",
          chapterNumber: 12,
          verseSnippet:
            "Then he said to them, 'Watch out! Be on your guard against all kinds of greed; life does not consist in an abundance of possessions.'",
          thematicTakeaway: "You are an immortal soul made in God's image, not a warehouse of accumulated goods.",
        },
        homily: {
          title: "The Foolish Rich Man's Barns",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Give away three items you have hoarded but do not need.",
            "Remind yourself: 'My net worth is not my self-worth.'",
            "Be rich toward God through active benevolence.",
          ],
          audioScript:
            "Jesus warns: 'Watch out against all kinds of greed!' The rich man built bigger barns to hoard his grain, yet that very night his soul was required of him. Life is not measured by the abundance of possessions, but by richness toward God.",
        },
      },
      {
        id: "greed-1timothy",
        title: "The Root of All Kinds of Evil",
        tag: "Contentment Over Craving",
        verse: {
          reference: "1 Timothy 6:10",
          bookSlug: "1-timothy",
          chapterNumber: 6,
          verseSnippet:
            "For the love of money is a root of all kinds of evil. Some people, eager for money, have wandered from the faith and pierced themselves with many griefs.",
          thematicTakeaway: "Money is a tool, but the love of money is a barbed hook that pierces the soul with sorrows.",
        },
        homily: {
          title: "The Golden Snares",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Practice regular, sacrificial tithing to keep money from mastering your heart.",
            "Recognize that more money never satisfies an appetite for security that only God can fill.",
            "Cultivate gratitude for food, clothing, and shelter.",
          ],
          audioScript:
            "Notice Paul does not say money is evil, but the love of money is the root of all kinds of evil. How many have pierced themselves through with bitter grief chasing wealth? Seek godliness with contentment—it is great gain.",
        },
      },
      {
        id: "greed-hebrews",
        title: "Free from the Love of Money",
        tag: "Never Abandoned",
        verse: {
          reference: "Hebrews 13:5",
          bookSlug: "hebrews",
          chapterNumber: 13,
          verseSnippet:
            "Keep your lives free from the love of money and be content with what you have, because God has said, 'Never will I leave you; never will I forsake you.'",
          thematicTakeaway: "The cure for financial greed is the unshakeable promise: God will never leave you.",
        },
        homily: {
          title: "The Eternal Companion",
          preacher: "The Author of Hebrews",
          duration: "2 min",
          practicalTips: [
            "Say aloud: 'The Lord is my helper; I will not fear.'",
            "Replace anxious calculating with thanking God for His presence.",
            "Find joy in what you currently possess today.",
          ],
          audioScript:
            "Why can we be content with what we have? Because God has promised: 'I will never leave you nor forsake you.' You do not need mountains of gold to face the future when the Lord of heaven walks beside you.",
        },
      },
      {
        id: "greed-proverbs",
        title: "Trusting Riches vs. Flourishing Like a Leaf",
        tag: "True Security",
        verse: {
          reference: "Proverbs 11:28",
          bookSlug: "proverbs",
          chapterNumber: 11,
          verseSnippet: "Those who trust in their riches will fall, but the righteous will thrive like a green leaf.",
          thematicTakeaway: "Riches are a withered crutch; righteousness rooted in God flourishes in every season.",
        },
        homily: {
          title: "Green Leaves in a Scorched World",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Reflect on the temporary nature of stock markets and savings.",
            "Root your trust in the living vine of Christ.",
            "Water your soul with daily Scripture and prayer.",
          ],
          audioScript:
            "Those who trust in riches are like someone building on sand; when the wind howls, the house falls. But those who root their lives in God's righteousness thrive like a green leaf by streams of living water.",
        },
      },
    ],
  },
  {
    id: "grief",
    label: "Grief & Loss",
    icon: "🕊️",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Holding sorrow, bereavement, and shattered dreams in the tender hope of resurrection.",
    subSections: [
      {
        id: "grief-psalm34",
        title: "Close to the Brokenhearted",
        tag: "Divine Closeness",
        verse: {
          reference: "Psalm 34:18",
          bookSlug: "psalms",
          chapterNumber: 34,
          verseSnippet: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
          thematicTakeaway: "When your heart breaks, God does not stand at a distance; He draws nearer than your own breath.",
        },
        homily: {
          title: "The God Who Leans Close",
          preacher: "Saint Bernard of Clairvaux",
          duration: "2 min",
          practicalTips: [
            "Do not feel pressured to hide your tears; crying is holy water washing a wounded heart.",
            "Whisper: 'Lord, You are near to my broken heart right now.'",
            "Let trusted friends sit with you in supportive silence.",
          ],
          audioScript:
            "When grief crushes your spirit, know this truth: the Lord is nearest to those whose hearts are broken. He does not reprimand your sorrow. He draws near, gathers your tears in His bottle, and breathes His comfort into your soul.",
        },
      },
      {
        id: "grief-revelation",
        title: "Wiping Away Every Tear",
        tag: "Eternal Hope",
        verse: {
          reference: "Revelation 21:4",
          bookSlug: "revelation",
          chapterNumber: 21,
          verseSnippet:
            "'He will wipe every tear from their eyes. There will be no more death' or mourning or crying or pain, for the old order of things has passed away.",
          thematicTakeaway: "Grief is real, but it is not eternal. Resurrection and restoration have the final word.",
        },
        homily: {
          title: "The Hand That Dries All Tears",
          preacher: "Saint John the Seer",
          duration: "2 min",
          practicalTips: [
            "Anchor in the certainty that in Christ, goodbyes are temporary.",
            "Meditate on the New Jerusalem where death and pain are forever banished.",
            "Allow eternal hope to give you strength for today's sorrow.",
          ],
          audioScript:
            "Look beyond the cemetery gates to the celestial horizon. Saint John saw the holy city where God Himself wipes every tear from our eyes. Death, mourning, and pain will be no more. Grieve with hope, for Christ is risen.",
        },
      },
      {
        id: "grief-matthew",
        title: "Blessed Are Those Who Mourn",
        tag: "Comfort Promised",
        verse: {
          reference: "Matthew 5:4",
          bookSlug: "matthew",
          chapterNumber: 5,
          verseSnippet: "Blessed are those who mourn, for they will be comforted.",
          thematicTakeaway: "Honest mourning opens the gates to heavenly comfort; tears make room for grace.",
        },
        homily: {
          title: "The Sacred Beatitude of Mourning",
          preacher: "Jesus on the Mount",
          duration: "2 min",
          practicalTips: [
            "Give yourself permission to grieve without rushing the timetable.",
            "Ask the Holy Spirit, the Comforter, to minister to your spirit.",
            "Reach out to someone else who is walking through sorrow.",
          ],
          audioScript:
            "Jesus said: 'Blessed are those who mourn, for they shall be comforted.' He honors our grief. When we bring our mourning into His presence, He wraps us in the comforting embrace of the Holy Spirit.",
        },
      },
      {
        id: "grief-psalm147",
        title: "Heals the Broken in Heart",
        tag: "Binding Up Wounds",
        verse: {
          reference: "Psalm 147:3",
          bookSlug: "psalms",
          chapterNumber: 147,
          verseSnippet: "He heals the brokenhearted and binds up their wounds.",
          thematicTakeaway: "The Creator who numbers the stars is the gentle Physician who binds up your deepest wounds.",
        },
        homily: {
          title: "The Great Physician of Hearts",
          preacher: "The Psalmist",
          duration: "2 min",
          practicalTips: [
            "Trust the slow, gentle healing process of God over time.",
            "Rest your aching soul in prayer like a patient in a recovery room.",
            "Look up at the stars and remember the power and tenderness of your Savior.",
          ],
          audioScript:
            "He who determines the number of the stars and calls them each by name is the very same God who bends down to bind up your broken heart. Entrust your wounded soul to His healing hands.",
        },
      },
    ],
  },
  {
    id: "comparison",
    label: "Comparison",
    icon: "🪞",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Silencing the thief of joy by running your own lane and celebrating your unique identity.",
    subSections: [
      {
        id: "comparison-galatians",
        title: "Testing Your Own Actions",
        tag: "Personal Responsibility",
        verse: {
          reference: "Galatians 6:4-5",
          bookSlug: "galatians",
          chapterNumber: 6,
          verseSnippet:
            "Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else, for each one should carry their own load.",
          thematicTakeaway: "God did not call you to live someone else's story; celebrate your own faithful walk.",
        },
        homily: {
          title: "Running Your Own Assigned Race",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Take a hiatus from comparing your life to highlight reels on social media.",
            "Celebrate one small victory in your personal spiritual discipline today.",
            "Thank God for the unique assignment He gave only to you.",
          ],
          audioScript:
            "Comparison is the thief of spiritual joy. Paul instructs us: test your own work, without comparing yourself to your neighbor. You will not give an account of their race, but of yours. Run your race with gladness.",
        },
      },
      {
        id: "comparison-2corinthians",
        title: "Measuring Themselves by Themselves",
        tag: "Freedom from Folly",
        verse: {
          reference: "2 Corinthians 10:12",
          bookSlug: "2-corinthians",
          chapterNumber: 10,
          verseSnippet:
            "We do not dare to classify or compare ourselves with some who commend themselves. When they measure themselves by themselves and compare themselves with themselves, they are not wise.",
          thematicTakeaway: "Comparing yourself to human standards is foolish; Christ is our only standard and righteousness.",
        },
        homily: {
          title: "Stepping Off the Human Measuring Scale",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Stop seeking human commendation and focus on pleasing the Father.",
            "Measure your heart by the humility and love of Jesus.",
            "Rest in the approval God has already given you in Christ.",
          ],
          audioScript:
            "When people measure themselves by themselves, they fall into foolish pride or deep depression. Throw away the human measuring tape! Your value was established at Calvary. You are treasured by the King.",
        },
      },
      {
        id: "comparison-james",
        title: "Bitter Envy vs. Heavenly Wisdom",
        tag: "Pure Heart",
        verse: {
          reference: "James 3:14-16",
          bookSlug: "james",
          chapterNumber: 3,
          verseSnippet:
            "But if you harbor bitter envy and selfish ambition in your hearts, do not boast about it or deny the truth. Such 'wisdom' does not come down from heaven but is earthly, unspiritual, demonic.",
          thematicTakeaway: "Comparison-driven ambition poisons community; heavenly wisdom is gentle, impartial, and sincere.",
        },
        homily: {
          title: "The Purity of Heavenly Wisdom",
          preacher: "Saint James",
          duration: "2 min",
          practicalTips: [
            "Repent of secret pleasure when an opponent stumbles.",
            "Seek wisdom that is pure, peaceable, gentle, and full of good fruits.",
            "Pray for the success of your peers.",
          ],
          audioScript:
            "Bitter envy and competitive rivalry are earthly and unspiritual. But wisdom from above is pure, peace-loving, considerate, and submissive. Step into that gentle wisdom and be free from comparison.",
        },
      },
    ],
  },
  {
    id: "desire",
    label: "Desire & Craving",
    icon: "🔥",
    category: "struggles",
    categoryLabel: "Challenges & Inner Struggles",
    summary: "Reorienting wayward appetites toward God, who alone satisfies the deepest hunger.",
    subSections: [
      {
        id: "desire-psalm37",
        title: "Delight Yourself in the Lord",
        tag: "Reordered Desires",
        verse: {
          reference: "Psalm 37:4",
          bookSlug: "psalms",
          chapterNumber: 37,
          verseSnippet: "Take delight in the Lord, and he will give you the desires of your heart.",
          thematicTakeaway: "When God becomes your supreme delight, He aligns your heart's desires with His eternal goodness.",
        },
        homily: {
          title: "The Highest Joy",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Spend five minutes praising God simply for who He is, asking for nothing.",
            "Ask: 'Is my desire rooted in self-indulgence or love for God?'",
            "Trust that God's plans for you are greater than your narrow cravings.",
          ],
          audioScript:
            "Saint Augustine famously said: 'Love God, and do what you will.' When you truly delight in the Lord, your desires are transformed. You begin to desire what God desires, and He pours out His blessing without sorrow.",
        },
      },
      {
        id: "desire-matthew",
        title: "Seek First the Kingdom",
        tag: "Priority & Order",
        verse: {
          reference: "Matthew 6:33",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
          thematicTakeaway: "Put first things first: pursue the King's presence, and all necessary things will follow.",
        },
        homily: {
          title: "The Proper Hierarchy of Life",
          preacher: "Jesus",
          duration: "2 min",
          practicalTips: [
            "Dedicate the first thirty minutes of your morning to prayer and Scripture.",
            "Order your financial, career, and personal goals under God's kingdom.",
            "Rest in the assurance that God knows all your practical needs.",
          ],
          audioScript:
            "We spend our lives chasing after food, clothing, status, and security. Jesus turns the pyramid right-side up: 'Seek first the kingdom of God and His righteousness, and all these things will be added to you.'",
        },
      },
      {
        id: "desire-1john",
        title: "The Lust of the Flesh Passes Away",
        tag: "Enduring Worth",
        verse: {
          reference: "1 John 2:16-17",
          bookSlug: "1-john",
          chapterNumber: 2,
          verseSnippet:
            "For everything in the world—the lust of the flesh, the lust of the eyes, and the pride of life—comes not from the Father but from the world. The world and its desires pass away, but whoever does the will of God lives forever.",
          thematicTakeaway: "Transient cravings evaporate like morning mist; doing God's will anchors you in eternity.",
        },
        homily: {
          title: "The Rock of the Father's Will",
          preacher: "Saint John the Beloved",
          duration: "2 min",
          practicalTips: [
            "When temptation flares, remind your soul: 'This craving will pass, but God's word stands forever.'",
            "Guard your eyes and ears from sensory overload.",
            "Invest your time in eternal kingdom relationships.",
          ],
          audioScript:
            "Sensory appetites promise fulfillment but leave only emptiness. Saint John reminds us: the world and its desires pass away, but whoever does the will of God abides forever. Build on the permanent rock.",
        },
      },
      {
        id: "desire-proverbs",
        title: "The Desire of the Righteous Granted",
        tag: "Holy Longings",
        verse: {
          reference: "Proverbs 10:24",
          bookSlug: "proverbs",
          chapterNumber: 10,
          verseSnippet: "What the wicked dreads will overtake them; what the righteous desire will be granted.",
          thematicTakeaway: "Longings conceived in righteousness find their ultimate fulfillment in God's favor.",
        },
        homily: {
          title: "Fulfillment for the Pure Heart",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Purify your desires in prayer: 'Lord, make my desires holy.'",
            "Trust that God withholds no good thing from those who walk uprightly.",
            "Rejoice in the anticipation of God's perfect provision.",
          ],
          audioScript:
            "The righteous desire justice, peace, holy love, and communion with God. Solomon promises that what the righteous desire will be granted. Keep your desires pure, and watch God surpass your highest hopes.",
        },
      },
    ],
  },

  // =========================================================================
  // CATEGORY 2: SELF-GROWTH & STRENGTH
  // =========================================================================
  {
    id: "determination",
    label: "Determination",
    icon: "🏔️",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Steadfast perseverance, unwavering grit, and finishing the race set before you.",
    subSections: [
      {
        id: "determination-hebrews",
        title: "Running the Race with Perseverance",
        tag: "Endurance",
        verse: {
          reference: "Hebrews 12:1-2",
          bookSlug: "hebrews",
          chapterNumber: 12,
          verseSnippet:
            "Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.",
          thematicTakeaway: "Strip off the extra baggage, fix your eyes on Jesus, and keep your feet moving on the marked track.",
        },
        homily: {
          title: "Eyes on the Pioneer of Faith",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Identify the specific weight or distraction slowing your spiritual pace.",
            "Fix your morning gaze on Jesus before looking at phone notifications.",
            "Take one courageous step forward in your calling today.",
          ],
          audioScript:
            "A stadium of heaven cheers you on! Patriarchs, prophets, and martyrs surround you. Throw off the heavy coat of doubt and entangling sin. Fix your eyes upon Jesus, and run with unwavering grit the race set before you.",
        },
      },
      {
        id: "determination-philippians",
        title: "I Can Do All Things Through Christ",
        tag: "Supernatural Strength",
        verse: {
          reference: "Philippians 4:13",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet: "I can do all this through him who gives me strength.",
          thematicTakeaway: "Christ's indwelling power equips you to endure abundance and hardship with equal victory.",
        },
        homily: {
          title: "The Channel of Christ's Might",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Recite Philippians 4:13 when faced with an intimidating challenge.",
            "Rely on Christ's stamina rather than fragile human willpower.",
            "Remember that Paul wrote this while facing hunger and imprisonment.",
          ],
          audioScript:
            "This famous verse is not a charm for selfish ambition; it is Paul's secret of contentment under extreme pressure. In poverty or plenty, freedom or chains, Christ infuses you with the strength to finish your task.",
        },
      },
      {
        id: "determination-galatians",
        title: "Do Not Grow Weary in Doing Good",
        tag: "The Coming Harvest",
        verse: {
          reference: "Galatians 6:9",
          bookSlug: "galatians",
          chapterNumber: 6,
          verseSnippet:
            "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
          thematicTakeaway: "Seeds sown in tears and perseverance will yield an abundant harvest at God's appointed hour.",
        },
        homily: {
          title: "The Patience of the Sower",
          preacher: "Saint Gregory of Nazianzus",
          duration: "2 min",
          practicalTips: [
            "Do not dig up the seed today just because green shoots haven't appeared yet.",
            "Keep doing what is right, even when nobody notices or thanks you.",
            "Trust God's sovereign harvest calendar.",
          ],
          audioScript:
            "The farmer does not reap the afternoon he sows. There is rain, frost, and waiting. Paul urges you: do not grow weary in doing good. At the proper time, you will reap a harvest of glory if you do not surrender.",
        },
      },
      {
        id: "determination-1corinthians",
        title: "Stand Firm, Immovable",
        tag: "Unshakable Labor",
        verse: {
          reference: "1 Corinthians 15:58",
          bookSlug: "1-corinthians",
          chapterNumber: 15,
          verseSnippet:
            "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain.",
          thematicTakeaway: "Because Christ conquered the grave, every act of faithful service possesses eternal significance.",
        },
        homily: {
          title: "Labor That Outlasts the Grave",
          preacher: "Saint Athanasius",
          duration: "2 min",
          practicalTips: [
            "Stand firm in moral conviction even when cultural pressure pushes against you.",
            "Give yourself wholeheartedly to your daily work as unto the Lord.",
            "Remember that not a single cup of cold water given in Jesus' name is forgotten.",
          ],
          audioScript:
            "Because the resurrection is real, your labor is never in vain. Stand like an iron pillar. Let nothing move you. Give yourself fully to Christ's work, knowing that what is done in Him echoes into eternity.",
        },
      },
    ],
  },
  {
    id: "discipline",
    label: "Discipline",
    icon: "🥋",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Training spiritual muscles, embracing loving correction, and building holy habits.",
    subSections: [
      {
        id: "discipline-hebrews",
        title: "Painful for the Moment, Fruitful for Life",
        tag: "Training",
        verse: {
          reference: "Hebrews 12:11",
          bookSlug: "hebrews",
          chapterNumber: 12,
          verseSnippet:
            "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it.",
          thematicTakeaway: "Discipline is the pruning of the vine so that abundant fruit may burst forth in the season to come.",
        },
        homily: {
          title: "The Pruning Shears of the Father",
          preacher: "Saint John Climacus",
          duration: "2 min",
          practicalTips: [
            "Embrace current constraints as God's spiritual gymnasium.",
            "Establish consistent wake-up, prayer, and reading rhythms.",
            "Look past the immediate discomfort to the peaceable harvest of righteousness.",
          ],
          audioScript:
            "No athlete celebrates rigorous conditioning while muscles burn, yet they endure for the victory wreath. God disciplines those He loves. Yield to His training; it produces a golden harvest of peace.",
        },
      },
      {
        id: "discipline-proverbs",
        title: "Loving Instruction and Discipline",
        tag: "Love of Knowledge",
        verse: {
          reference: "Proverbs 12:1",
          bookSlug: "proverbs",
          chapterNumber: 12,
          verseSnippet: "Whoever loves discipline loves knowledge, but whoever hates correction is stupid.",
          thematicTakeaway: "Wisdom welcomes loving correction; foolishness bristles and defends its ignorance.",
        },
        homily: {
          title: "The Openness of the Teachable",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Thank someone when they point out a blind spot in your character.",
            "Read Scripture with the prayer: 'Lord, correct where I am mistaken.'",
            "Cultivate the humility of a lifelong disciple.",
          ],
          audioScript:
            "Solomon speaks bluntly: whoever hates correction is senseless. If someone points out an error in love, they have handed you gold. Welcome discipline, and you will grow rich in heavenly wisdom.",
        },
      },
      {
        id: "discipline-2timothy",
        title: "A Spirit of Power, Love & Self-Discipline",
        tag: "Sound Mind",
        verse: {
          reference: "2 Timothy 1:7",
          bookSlug: "2-timothy",
          chapterNumber: 1,
          verseSnippet: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
          thematicTakeaway: "You have not been given a spirit of cowardice, but divine power, love, and a disciplined mind.",
        },
        homily: {
          title: "The Sound Mind in the Spirit",
          preacher: "Saint Paul to Timothy",
          duration: "2 min",
          practicalTips: [
            "Reject fearful, chaotic thoughts by speaking 2 Timothy 1:7 aloud.",
            "Take decisive action today on a task you have avoided out of timidity.",
            "Align your daily choices with power, love, and sound judgment.",
          ],
          audioScript:
            "God has not left you at the mercy of chaotic whims. The Holy Spirit indwelling you is the Spirit of power, self-giving love, and sound discipline. Walk with clarity, courage, and ordered purpose.",
        },
      },
      {
        id: "discipline-1corinthians",
        title: "Buffeting the Body Like an Athlete",
        tag: "Self-Mastery",
        verse: {
          reference: "1 Corinthians 9:27",
          bookSlug: "1-corinthians",
          chapterNumber: 9,
          verseSnippet:
            "No, I strike a blow to my body and make it my slave so that after I have preached to others, I myself will not be disqualified for the prize.",
          thematicTakeaway: "Subdue physical impulses so your bodily vessel serves the eternal mission of Christ.",
        },
        homily: {
          title: "Training for the Imperishable Crown",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Practice fasting from food or entertainment to strengthen spiritual self-mastery.",
            "Ensure your private actions match your public testimony.",
            "Keep the imperishable crown ever before your eyes.",
          ],
          audioScript:
            "Paul drew from the Olympic athletes who trained with fierce austerity for a wreath of laurel leaves. How much more should we discipline our lives for a crown that never fades? Master your flesh in the Spirit.",
        },
      },
    ],
  },
  {
    id: "purpose",
    label: "Purpose & Calling",
    icon: "🎯",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Discovering your divine blueprint, masterwork calling, and kingdom assignment.",
    subSections: [
      {
        id: "purpose-ephesians",
        title: "God's Handiwork Created for Good Works",
        tag: "Divine Blueprint",
        verse: {
          reference: "Ephesians 2:10",
          bookSlug: "ephesians",
          chapterNumber: 2,
          verseSnippet:
            "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
          thematicTakeaway: "You are God's masterpiece, custom-crafted with pre-planned good works to walk into.",
        },
        homily: {
          title: "The Masterpiece of the Creator",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Stop calling yourself an accident or failure; you are God's 'poiema' (masterpiece).",
            "Ask: 'What good work has God prepared for me to do today?'",
            "Serve those right around you with your unique gifts.",
          ],
          audioScript:
            "In Greek, the word for handiwork is 'poiema'—a poem, a crafted masterpiece. You are not a random accident of biology. God fashioned you in Christ Jesus with specific good deeds assigned to your life. Walk in them with joy.",
        },
      },
      {
        id: "purpose-jeremiah",
        title: "Plans to Prosper and Give Hope",
        tag: "Future & Hope",
        verse: {
          reference: "Jeremiah 29:11",
          bookSlug: "jeremiah",
          chapterNumber: 29,
          verseSnippet:
            "'For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.'",
          thematicTakeaway: "God's heart toward His people is peace and a glorious future, even through seasons of exile.",
        },
        homily: {
          title: "The Sovereign Blueprint",
          preacher: "Jeremiah",
          duration: "2 min",
          practicalTips: [
            "Remember that this promise was given to exiles in Babylon; God works in hard places.",
            "Trust that God's overarching purpose is for your spiritual welfare and shalom.",
            "Pray with expectant hope for your future.",
          ],
          audioScript:
            "Even when Babylon surrounded them and all looked lost, God declared: 'I know the plans I have for you—plans of peace and not of evil, to give you a future and a hope.' Trust His heart when you cannot trace His hand.",
        },
      },
      {
        id: "purpose-romans",
        title: "All Things Working Together for Good",
        tag: "Sovereign Purpose",
        verse: {
          reference: "Romans 8:28",
          bookSlug: "romans",
          chapterNumber: 8,
          verseSnippet:
            "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          thematicTakeaway: "God weaves both trials and triumphs into a tapestry that fulfills His glorious purpose in your life.",
        },
        homily: {
          title: "The Master Weaver",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "View current trials through the lens of God's overarching weaving.",
            "Renew your love for God through simple obedience.",
            "Trust that no pain is wasted in the economy of heaven.",
          ],
          audioScript:
            "Paul does not say all things are pleasant; he says God works all things together for good to those who love Him. Like dark threads in a magnificent tapestry, God takes our hardest moments and weaves them into glory.",
        },
      },
      {
        id: "purpose-proverbs",
        title: "The Lord's Purpose Prevails",
        tag: "Sovereignty",
        verse: {
          reference: "Proverbs 19:21",
          bookSlug: "proverbs",
          chapterNumber: 19,
          verseSnippet: "Many are the plans in a person's heart, but it is the Lord's purpose that prevails.",
          thematicTakeaway: "Human plans fluctuate and fall away, but the Lord's eternal purpose stands invincible.",
        },
        homily: {
          title: "The Anchor of Sovereign Will",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Hold your human schedule loosely in an open hand.",
            "Pray: 'Lord, bend my plans to Your prevailing purpose.'",
            "Rejoice when a door closes, knowing God is protecting His purpose for you.",
          ],
          audioScript:
            "We make dozens of plans on our calendars and spreadsheets. But Solomon reminds us that only the Lord's purpose stands forever. When your plans are disrupted, do not despair. God's purpose is prevailing.",
        },
      },
    ],
  },
  {
    id: "self-control",
    label: "Self-Control",
    icon: "🛡️",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Guarding the fortress of your mind, reigning over passions, and walking in the Spirit.",
    subSections: [
      {
        id: "self-control-galatians",
        title: "The Fruit of the Spirit",
        tag: "Spiritual Fruit",
        verse: {
          reference: "Galatians 5:22-23",
          bookSlug: "galatians",
          chapterNumber: 5,
          verseSnippet:
            "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
          thematicTakeaway: "Self-control is not harsh legalism; it is the sweet fruit of the Holy Spirit ruling in your heart.",
        },
        homily: {
          title: "The Crowning Fruit of the Spirit",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Yield to the Holy Spirit before making decisions under emotional pressure.",
            "Ask: 'Is this reaction driven by the flesh or the fruit of the Spirit?'",
            "Cultivate gentleness alongside inner restraint.",
          ],
          audioScript:
            "Notice where self-control sits: as the final jewel in the cluster of the Spirit's fruit. It is not white-knuckled self-reliance, but the Holy Spirit giving you mastery over your impulses. Live in His fruit.",
        },
      },
      {
        id: "self-control-proverbs",
        title: "A City Without Walls",
        tag: "Guarding the Gates",
        verse: {
          reference: "Proverbs 25:28",
          bookSlug: "proverbs",
          chapterNumber: 25,
          verseSnippet: "Like a city whose walls are broken through is a person who lacks self-control.",
          thematicTakeaway: "Without self-restraint, your life is defenseless against every passing invasion of appetite and fury.",
        },
        homily: {
          title: "Rebuilding the Walls of the Soul",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Set digital boundaries on apps and websites that breach your mental defenses.",
            "Practice small daily 'no's' to bodily cravings to fortify your willpower.",
            "Post the guard of prayer over your tongue and eyes.",
          ],
          audioScript:
            "An ancient city without stone walls was plundered by every bandit. A person without self-control is equally vulnerable. Rebuild the walls of your soul with prayer, Scripture, and holy discipline.",
        },
      },
      {
        id: "self-control-titus",
        title: "Saying 'No' to Ungodliness",
        tag: "Grace That Trains",
        verse: {
          reference: "Titus 2:11-12",
          bookSlug: "titus",
          chapterNumber: 2,
          verseSnippet:
            "For the grace of God has appeared that offers salvation to all people. It teaches us to say 'No' to ungodliness and worldly passions, and to live self-controlled, upright and godly lives in this present age.",
          thematicTakeaway: "True grace does not excuse reckless indulgence; grace trains you to say a decisive 'no' to sin.",
        },
        homily: {
          title: "The School of Grace",
          preacher: "Saint Paul to Titus",
          duration: "2 min",
          practicalTips: [
            "Look at temptation and practice saying a clear, quiet 'no' in Jesus' name.",
            "Remember that grace is your teacher, training you for spiritual dignity.",
            "Live with self-controlled integrity in this present age.",
          ],
          audioScript:
            "Grace is not a license for carelessness; it is a schoolmaster teaching us to say 'No' to worldly passions and 'Yes' to holy self-mastery. Walk in the dignity of God's training.",
        },
      },
      {
        id: "self-control-1peter",
        title: "Alert and of Sober Mind",
        tag: "Spiritual Vigilance",
        verse: {
          reference: "1 Peter 5:8",
          bookSlug: "1-peter",
          chapterNumber: 5,
          verseSnippet:
            "Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.",
          thematicTakeaway: "Sober vigilance keeps you standing firm when subtle temptations prowl near your door.",
        },
        homily: {
          title: "The Watchman on the Tower",
          preacher: "Simon Peter",
          duration: "2 min",
          practicalTips: [
            "Stay spiritually sober by avoiding intoxicating distractions.",
            "Recognize the enemy's subtle tactics in moments of physical exhaustion.",
            "Resist the devil firm in your faith, and he will flee.",
          ],
          audioScript:
            "Peter knew the sting of falling asleep in Gethsemane when he should have been watching. He urges us: 'Be sober-minded; be watchful.' Keep the lamp of your spirit trimmed and burning bright.",
        },
      },
    ],
  },
  {
    id: "responsibility",
    label: "Responsibility",
    icon: "⚖️",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Owning your choices, answering to God, and doing the right thing with moral courage.",
    subSections: [
      {
        id: "responsibility-romans",
        title: "Giving an Account to God",
        tag: "Accountability",
        verse: {
          reference: "Romans 14:12",
          bookSlug: "romans",
          chapterNumber: 14,
          verseSnippet: "So then, each of us will give an account of ourselves to God.",
          thematicTakeaway: "Stop blaming circumstances or others; you will answer to God for your stewardship of life.",
        },
        homily: {
          title: "The Solemnity of Personal Accountability",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Refuse to blame parents, culture, or leaders for your personal choices.",
            "Examine your actions nightly: 'Did I honor God with what was entrusted to me?'",
            "Live with reverent awareness of the judgment seat of Christ.",
          ],
          audioScript:
            "At the end of life's journey, we will not answer for our neighbors, bosses, or critics. Each of us will give an account of ourselves before God. Own your life, steward your hours, and honor your King.",
        },
      },
      {
        id: "responsibility-galatians",
        title: "Each Carrying Their Own Load",
        tag: "Daily Stewardship",
        verse: {
          reference: "Galatians 6:5",
          bookSlug: "galatians",
          chapterNumber: 6,
          verseSnippet: "For each one should carry their own load.",
          thematicTakeaway: "Carry your personal pack of moral duties without shirking responsibility onto others.",
        },
        homily: {
          title: "The Soldier's Pack",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Fulfill your daily commitments with quiet diligence.",
            "Do not make excuses when you drop the ball; apologize and rectify it.",
            "Carry your daily duties with pride in the service of Christ.",
          ],
          audioScript:
            "In the ancient world, every soldier carried his own knapsack on the march. Paul tells us: carry your own pack. Do not expect others to do the heavy lifting of your personal character and duty.",
        },
      },
      {
        id: "responsibility-ezekiel",
        title: "The Soul Who Sins Shall Die",
        tag: "Moral Ownership",
        verse: {
          reference: "Ezekiel 18:20",
          bookSlug: "ezekiel",
          chapterNumber: 18,
          verseSnippet:
            "The one who sins is the one who will die. The child will not share the guilt of the parent, nor will the parent share the guilt of the child. The righteousness of the righteous will be credited to them, and the wickedness of the wicked will be charged against them.",
          thematicTakeaway: "Generational curses are broken at the cross; your destiny is shaped by your personal repentance and obedience.",
        },
        homily: {
          title: "Breaking the Generational Chain",
          preacher: "Ezekiel the Prophet",
          duration: "2 min",
          practicalTips: [
            "Stop defining your future by your family's past mistakes.",
            "Choose righteousness today as an individual act of faith.",
            "Walk in the new covenant freedom bought by Christ.",
          ],
          audioScript:
            "The people in exile repeated an old proverb: 'The fathers ate sour grapes, and the children's teeth are set on edge.' God answered through Ezekiel: no more! You are personally responsible before Me. Turn and live.",
        },
      },
      {
        id: "responsibility-james",
        title: "Knowing the Good and Doing It",
        tag: "Action & Integrity",
        verse: {
          reference: "James 4:17",
          bookSlug: "james",
          chapterNumber: 4,
          verseSnippet: "If anyone, then, knows the good they ought to do and doesn't do it, it is sin for them.",
          thematicTakeaway: "Passive neglect of known good is just as serious as committing active evil.",
        },
        homily: {
          title: "The Sins of Omission",
          preacher: "Saint James",
          duration: "2 min",
          practicalTips: [
            "Act immediately when prompted by the Holy Spirit to encourage or help someone.",
            "Do not procrastinate on the good deed you know you should do today.",
            "Step up and lead with moral courage.",
          ],
          audioScript:
            "We often measure holiness by what we refrain from doing. But Saint James holds up a higher mirror: whoever knows the good they ought to do and fails to do it, to them it is sin. Step out and do the good.",
        },
      },
    ],
  },
  {
    id: "integrity",
    label: "Integrity",
    icon: "💎",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Walking securely in truth, matching private character with public words, and hating deceit.",
    subSections: [
      {
        id: "integrity-proverbs10",
        title: "Whoever Walks in Integrity Walks Securely",
        tag: "Security in Truth",
        verse: {
          reference: "Proverbs 10:9",
          bookSlug: "proverbs",
          chapterNumber: 10,
          verseSnippet: "Whoever walks in integrity walks securely, but whoever takes crooked paths will be found out.",
          thematicTakeaway: "An honest person sleeps peacefully; crooked schemes always unravel in the light.",
        },
        homily: {
          title: "The Unshakable Foundation of Truth",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Never tell a lie that requires three more lies to defend.",
            "Value a clean conscience above a quick financial shortcut.",
            "Walk securely knowing God is your defense.",
          ],
          audioScript:
            "Integrity means wholeness—there are no fractured compartments in your life. You are the same person in secret as you are in public. That person walks securely on solid ground.",
        },
      },
      {
        id: "integrity-proverbs11",
        title: "Guided by Integrity",
        tag: "Moral Compass",
        verse: {
          reference: "Proverbs 11:3",
          bookSlug: "proverbs",
          chapterNumber: 11,
          verseSnippet: "The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity.",
          thematicTakeaway: "Integrity is the internal compass that guides your choices when navigation gets dark.",
        },
        homily: {
          title: "The Compass of the Upright",
          preacher: "Saint Ambrose",
          duration: "2 min",
          practicalTips: [
            "Make decisions based on moral principle rather than temporary convenience.",
            "Refuse double-tongued duplicity in your conversations.",
            "Let your 'Yes' be 'Yes' and your 'No' be 'No.'",
          ],
          audioScript:
            "Duplicity destroys because it divides the soul against itself. But the integrity of the upright guides them like a star in the night sky. Keep your compass true to Christ.",
        },
      },
      {
        id: "integrity-psalm41",
        title: "Upholding Me in My Integrity",
        tag: "Divine Favor",
        verse: {
          reference: "Psalm 41:12",
          bookSlug: "psalms",
          chapterNumber: 41,
          verseSnippet: "Because of my integrity you uphold me and set me in your presence forever.",
          thematicTakeaway: "Integrity preserves your fellowship with God and positions you before His face forever.",
        },
        homily: {
          title: "Set in His Presence Forever",
          preacher: "David",
          duration: "2 min",
          practicalTips: [
            "Remember that God's approval is worth infinitely more than human accolades.",
            "Keep your integrity intact even when betrayed by close companions.",
            "Rest in the assurance that God sees and upholds the upright.",
          ],
          audioScript:
            "Even when friends betrayed him and enemies whispered slander, David found comfort in this truth: 'Because of my integrity, You uphold me and set me in Your presence forever.' Walk with pure hands before God.",
        },
      },
      {
        id: "integrity-titus",
        title: "Integrity, Seriousness and Soundness of Speech",
        tag: "Irreproachable Life",
        verse: {
          reference: "Titus 2:7",
          bookSlug: "titus",
          chapterNumber: 2,
          verseSnippet:
            "In everything set them an example by doing what is good. In your teaching show integrity, seriousness and soundness of speech that cannot be condemned.",
          thematicTakeaway: "Let your conduct and speech be so sound that opponents have nothing bad to say about you.",
        },
        homily: {
          title: "Living Above Reproach",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Model good works in your workplace and home.",
            "Speak words that build up and cannot be condemned by critics.",
            "Demonstrate seriousness of purpose in your spiritual life.",
          ],
          audioScript:
            "The world watches how believers live. Paul tells Titus: show integrity in everything, with sound speech that silences opposition. Let the sermon of your life be the most compelling defense of the Gospel.",
        },
      },
    ],
  },
  {
    id: "self-awareness",
    label: "Self-Awareness",
    icon: "🪞",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Inviting God to search your heart, testing your ways, and discovering authentic inner truth.",
    subSections: [
      {
        id: "self-awareness-psalm139",
        title: "Search Me, O God, and Know My Heart",
        tag: "Holy Examination",
        verse: {
          reference: "Psalm 139:23-24",
          bookSlug: "psalms",
          chapterNumber: 139,
          verseSnippet:
            "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.",
          thematicTakeaway: "Inviting God's spotlight into your soul dismantles blind spots and leads to everlasting life.",
        },
        homily: {
          title: "Under the Spotlight of Grace",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Spend three minutes in silence praying Psalm 139:23-24.",
            "Ask the Holy Spirit to reveal hidden resentment, pride, or anxiety.",
            "Welcome His conviction as the surgery of a loving Father.",
          ],
          audioScript:
            "True self-awareness is not secular self-absorption; it is sitting under the loving searchlight of God. David prayed: 'Search me, God, and know my anxious thoughts.' Let God reveal what is in your heart and lead you.",
        },
      },
      {
        id: "self-awareness-lamentations",
        title: "Test and Examine Our Ways",
        tag: "Returning to God",
        verse: {
          reference: "Lamentations 3:40",
          bookSlug: "lamentations",
          chapterNumber: 3,
          verseSnippet: "Let us examine our ways and test them, and let us return to the Lord.",
          thematicTakeaway: "Honest introspection is only fruitful when it turns our steps back toward the Father.",
        },
        homily: {
          title: "Examining the Compass Heading",
          preacher: "Jeremiah",
          duration: "2 min",
          practicalTips: [
            "Take honest inventory of where your habits and speech have drifted.",
            "Do not get stuck in despair; immediately return to the Lord.",
            "Take concrete steps of renewed obedience today.",
          ],
          audioScript:
            "Jeremiah calls us: 'Let us examine our ways and test them, and return to the Lord.' Self-examination without repentance is mere sorrow; self-examination that leads to returning is salvation and life.",
        },
      },
      {
        id: "self-awareness-1corinthians",
        title: "Examining Yourself Before the Table",
        tag: "Reverence",
        verse: {
          reference: "1 Corinthians 11:28",
          bookSlug: "1-corinthians",
          chapterNumber: 11,
          verseSnippet: "Everyone ought to examine themselves before they eat of the bread and drink from the cup.",
          thematicTakeaway: "Approach holy communion with sober self-examination and awe for Christ's broken body.",
        },
        homily: {
          title: "Approaching the Sacred Table",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Pause before receiving the Eucharist or entering prayer to reconcile with anyone you have hurt.",
            "Examine whether you are taking Christ's sacrifice for granted.",
            "Receive His body and blood with deep thanksgiving.",
          ],
          audioScript:
            "Paul instructs every believer to examine themselves before partaking of the Holy Supper. Look within your heart, wash away unforgiveness and pride in confession, and come with joy to the banquet of the Lamb.",
        },
      },
    ],
  },
  {
    id: "motivation",
    label: "Motivation",
    icon: "⚡",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Working with all your heart as unto the Lord, fleeing sluggishness, and consecrating labor.",
    subSections: [
      {
        id: "motivation-colossians",
        title: "Working as for the Lord, Not Men",
        tag: "Consecrated Labor",
        verse: {
          reference: "Colossians 3:23",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet:
            "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
          thematicTakeaway: "When Christ is your true supervisor, even mundane tasks are transformed into acts of sacred worship.",
        },
        homily: {
          title: "Turning Your Desk into an Altar",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Dedicate your workday to Jesus before opening your computer or starting tools.",
            "Perform your tasks with excellence even when no supervisor is watching.",
            "Remember that your eternal reward comes from Christ.",
          ],
          audioScript:
            "Whether you wash dishes, write software, teach children, or manage a business, do it with all your heart as unto the Lord! Your labor is not merely for an earthly paycheck; it is a sacred offering to the King.",
        },
      },
      {
        id: "motivation-1corinthians",
        title: "Do All to the Glory of God",
        tag: "Singular Purpose",
        verse: {
          reference: "1 Corinthians 10:31",
          bookSlug: "1-corinthians",
          chapterNumber: 10,
          verseSnippet: "So whether you eat or drink or whatever you do, do it all for the glory of God.",
          thematicTakeaway: "Every ordinary breath, meal, and assignment can be sanctified to magnify God's glory.",
        },
        homily: {
          title: "The Golden Thread of Glory",
          preacher: "Saint Ignatius of Antioch",
          duration: "2 min",
          practicalTips: [
            "Frame every decision around: 'Does this bring glory to God?'",
            "Give thanks over your meals and daily activities.",
            "Infuse routine moments with quiet praise.",
          ],
          audioScript:
            "Paul brings the loftiest theology down into eating and drinking: do all to the glory of God. There is no sacred-secular divide for a believer. Weave the golden thread of God's glory through every hour of your day.",
        },
      },
      {
        id: "motivation-proverbs",
        title: "Commit to the Lord Whatever You Do",
        tag: "Established Plans",
        verse: {
          reference: "Proverbs 16:3",
          bookSlug: "proverbs",
          chapterNumber: 16,
          verseSnippet: "Commit to the Lord whatever you do, and he will establish your plans.",
          thematicTakeaway: "Roll your burdens and ventures onto God, and He will solidify your path.",
        },
        homily: {
          title: "Rolling the Burden onto God",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Pray over your goals before initiating action.",
            "Entrust the results and metrics to God's providence.",
            "Walk forward in confident, motivated obedience.",
          ],
          audioScript:
            "The Hebrew word for 'commit' means literally to roll your load onto the shoulders of another. Roll your work, your ventures, and your hopes onto the Lord. He will establish your plans in righteousness.",
        },
      },
    ],
  },
  {
    id: "sacrifice",
    label: "Sacrifice",
    icon: "✝️",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Offering your body as a living sacrifice, laying down self, and tasting the joy of cross-bearing.",
    subSections: [
      {
        id: "sacrifice-romans",
        title: "A Living Sacrifice, Holy & Pleasing",
        tag: "Living Worship",
        verse: {
          reference: "Romans 12:1",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet:
            "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
          thematicTakeaway: "True worship is not just singing on Sunday; it is yielding your bodily life daily to God's will.",
        },
        homily: {
          title: "The Altar of the Heart",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Consecrate your eyes, hands, and feet to holy service each morning.",
            "Let your bodily energy be expended for love of God and neighbor.",
            "Refuse to be conformed to the patterns of this fallen world.",
          ],
          audioScript:
            "In the Old Covenant, sacrifices were killed on the altar. In Christ, we are called to be living sacrifices—our eyes seeing with compassion, our hands serving the poor, our tongues speaking grace. This is true worship.",
        },
      },
      {
        id: "sacrifice-hebrews",
        title: "Do Not Forget to Do Good & Share",
        tag: "Pleasing Sacrifices",
        verse: {
          reference: "Hebrews 13:16",
          bookSlug: "hebrews",
          chapterNumber: 13,
          verseSnippet: "And do not forget to do good and to share with others, for with such sacrifices God is pleased.",
          thematicTakeaway: "Practical generosity and tangible sharing are sweet-smelling incense before heaven's throne.",
        },
        homily: {
          title: "The Incense of Generosity",
          preacher: "Saint Basil the Great",
          duration: "2 min",
          practicalTips: [
            "Share food, money, or resources with someone in acute need.",
            "Do good without seeking credit or recognition.",
            "Remember that God smells the sweet aroma of loving generosity.",
          ],
          audioScript:
            "God needs no bulls or goats; the sacrifice that delights His heart is when His children do good and share with the suffering. What you place in the hands of the poor, you lend directly to the Lord.",
        },
      },
      {
        id: "sacrifice-john",
        title: "Greater Love Has No One Than This",
        tag: "Laying Down Life",
        verse: {
          reference: "John 15:13",
          bookSlug: "john",
          chapterNumber: 15,
          verseSnippet: "Greater love has no one than this: to lay down one's life for one's friends.",
          thematicTakeaway: "The pinnacle of agape love is voluntary self-surrender for the redemption of another.",
        },
        homily: {
          title: "The Measure of Agape",
          preacher: "Saint Polycarp of Smyrna",
          duration: "2 min",
          practicalTips: [
            "Lay down your convenience, ego, or pride for a spouse, child, or friend today.",
            "Value another's spiritual well-being above your own comfort.",
            "Contemplate the supreme sacrifice of Jesus on the cross.",
          ],
          audioScript:
            "Jesus did not merely speak of love; He embodied it on the tree of Calvary. Greater love has no one than this: to lay down one's life for his friends. When you sacrifice your preferences to bless someone, you breathe Christ's aroma.",
        },
      },
      {
        id: "sacrifice-1john",
        title: "Laying Down Our Lives for One Another",
        tag: "Love in Action",
        verse: {
          reference: "1 John 3:16",
          bookSlug: "1-john",
          chapterNumber: 3,
          verseSnippet:
            "This is how we know what love is: Jesus Christ laid down his life for us. And we ought to lay down our lives for our brothers and sisters.",
          thematicTakeaway: "Love is defined not by sentimental words, but by concrete, self-giving sacrifice.",
        },
        homily: {
          title: "Love Without Pretense",
          preacher: "Saint John the Evangelist",
          duration: "2 min",
          practicalTips: [
            "Let love move from theoretical feeling into concrete action.",
            "Meet a tangible material need for a brother or sister in Christ.",
            "Follow the footsteps of Jesus in humble cross-bearing.",
          ],
          audioScript:
            "This is how we know what love is: Jesus laid down His life for us. We cannot claim to abide in Him if we close our hearts to a brother in need. Let us love not in word or tongue, but in action and in truth.",
        },
      },
    ],
  },
  {
    id: "self-care",
    label: "Self-Care & Rest",
    icon: "🌿",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Stepping aside with Jesus, honoring the temple of the body, and finding deep Sabbath restoration.",
    subSections: [
      {
        id: "self-care-mark",
        title: "Come Away by Yourselves and Rest",
        tag: "Solitude & Rest",
        verse: {
          reference: "Mark 6:31",
          bookSlug: "mark",
          chapterNumber: 6,
          verseSnippet:
            "Then, because so many people were coming and going that they did not even have a chance to eat, he said to them, 'Come with me by yourselves to a quiet place and get some rest.'",
          thematicTakeaway: "Jesus commands His disciples to rest; exhaustion is not a spiritual virtue.",
        },
        homily: {
          title: "The Master's Invitation to Solitude",
          preacher: "Saint Francis de Sales",
          duration: "2 min",
          practicalTips: [
            "Schedule thirty minutes of uninterrupted quiet retreat this week.",
            "Unplug from demands and crowds to be alone with Jesus.",
            "Remember that even the Savior withdrew to lonely places to pray.",
          ],
          audioScript:
            "The crowds pressed so intensely that the disciples had no leisure even to eat. Did Jesus praise their overwork? No! He commanded: 'Come away by yourselves to a quiet place and rest a while.' Obey the Savior's call to rest.",
        },
      },
      {
        id: "self-care-matthew",
        title: "I Will Give You Rest",
        tag: "Soul Rest",
        verse: {
          reference: "Matthew 11:28",
          bookSlug: "matthew",
          chapterNumber: 11,
          verseSnippet:
            "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.",
          thematicTakeaway: "Physical sleep restores the body, but only Christ's gentle yoke gives rest to the weary soul.",
        },
        homily: {
          title: "The Unburdened Soul",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "Take off the heavy yoke of people-pleasing and performance dread.",
            "Yoke yourself to Jesus: His yoke is easy and His burden is light.",
            "Rest your mind in His gentle, humble heart.",
          ],
          audioScript:
            "Are you exhausted from carrying the expectations of others and the weight of your own failures? Jesus says: 'Come to Me.' He does not hand you another spreadsheet of rules; He gives you rest. Rest your weary soul in Him.",
        },
      },
      {
        id: "self-care-psalm23",
        title: "He Restores My Soul",
        tag: "Green Pastures",
        verse: {
          reference: "Psalm 23:1-3",
          bookSlug: "psalms",
          chapterNumber: 23,
          verseSnippet:
            "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
          thematicTakeaway: "The Good Shepherd leads you beside still waters so your depleted soul can be completely revived.",
        },
        homily: {
          title: "Beside the Still Waters",
          preacher: "David the Shepherd",
          duration: "2 min",
          practicalTips: [
            "Sit quietly by a window or outdoors and read Psalm 23 slowly.",
            "Allow the Shepherd to lead you into stillness and restoration.",
            "Acknowledge that with the Lord as your Shepherd, you lack nothing.",
          ],
          audioScript:
            "Notice the Shepherd's gentleness: He makes us lie down in green pastures; He leads us beside quiet waters; He restores our soul. Cease your frantic striving today and let the Good Shepherd replenish your spirit.",
        },
      },
      {
        id: "self-care-1corinthians",
        title: "Your Body Is a Temple of the Holy Spirit",
        tag: "Temple Stewardship",
        verse: {
          reference: "1 Corinthians 6:19",
          bookSlug: "1-corinthians",
          chapterNumber: 6,
          verseSnippet:
            "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own.",
          thematicTakeaway: "Caring for your physical health, nutrition, and rest is sacred stewardship of God's temple.",
        },
        homily: {
          title: "Honoring the Living Sanctuary",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Prioritize adequate sleep, healthy food, and hydration as acts of stewardship.",
            "Treat your physical body with reverent care as the dwelling place of God.",
            "Glorify God in your body through pure, healthy living.",
          ],
          audioScript:
            "Your body is not a machine to be abused, nor a garbage dump for reckless indulgence. It is a living temple where the Holy Spirit dwells. Honor God in your body through healthy rhythms of rest, nourishment, and purity.",
        },
      },
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Stewardship",
    icon: "🧭",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Leading through servant humility, wise counsel, and shepherding others with pure motives.",
    subSections: [
      {
        id: "leadership-mark",
        title: "Whoever Wants to Be First Must Be Servant",
        tag: "Servant Leadership",
        verse: {
          reference: "Mark 10:42-45",
          bookSlug: "mark",
          chapterNumber: 10,
          verseSnippet:
            "Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
          thematicTakeaway: "Kingdom leadership flips worldly pyramids upside down: the greatest leader is the servant of all.",
        },
        homily: {
          title: "The Towel and the Basin of Greatness",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Measure your leadership by how effectively you empower and serve your team.",
            "Do not lord authority over those under your care.",
            "Follow the servant model of Jesus in every meeting and interaction.",
          ],
          audioScript:
            "Earthly rulers lord power over their subjects. But Jesus said: 'Not so with you.' Greatness in the kingdom of God is measured by how low you are willing to bend to wash the feet of those you lead. Lead through love.",
        },
      },
      {
        id: "leadership-1timothy",
        title: "Qualifications of Noble Oversight",
        tag: "Character & Sobriety",
        verse: {
          reference: "1 Timothy 3:1-13",
          bookSlug: "1-timothy",
          chapterNumber: 3,
          verseSnippet:
            "Now the overseer is to be above reproach, faithful to his spouse, temperate, self-controlled, respectable, hospitable, able to teach... not a lover of money.",
          thematicTakeaway: "Leadership authority flows from private character, self-control, and moral integrity.",
        },
        homily: {
          title: "The Anchor of Noble Character",
          preacher: "Saint Paul to Timothy",
          duration: "2 min",
          practicalTips: [
            "Prioritize character development above charisma and public performance.",
            "Practice hospitality and temperate self-control in your personal life.",
            "Manage your own household with gentleness and dignity.",
          ],
          audioScript:
            "Notice that Paul lists qualifications of character, not credentials of worldly brilliance. An overseer must be above reproach, gentle, temperate, and free from the love of money. Character is the bedrock of leadership.",
        },
      },
      {
        id: "leadership-proverbs",
        title: "Victory Through Many Advisers",
        tag: "Wise Counsel",
        verse: {
          reference: "Proverbs 11:14",
          bookSlug: "proverbs",
          chapterNumber: 11,
          verseSnippet: "For lack of guidance a nation falls, but victory is won through many advisers.",
          thematicTakeaway: "Wise leaders surround themselves with discerning, godly counsel and welcome diverse insight.",
        },
        homily: {
          title: "The Multiplicity of Wise Counsel",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Seek out experienced, God-fearing mentors before making major executive choices.",
            "Listen to dissenting viewpoints with an open, humble mind.",
            "Recognize that isolation is the quickest road to leadership failure.",
          ],
          audioScript:
            "The arrogant leader imagines they have all the answers; their empire soon collapses. But the wise leader seeks guidance from seasoned advisers. Victory is won in the presence of humble, collaborative wisdom.",
        },
      },
      {
        id: "leadership-1peter",
        title: "Shepherds of God's Flock, Not Lording It Over",
        tag: "Eager Shepherding",
        verse: {
          reference: "1 Peter 5:2-3",
          bookSlug: "1-peter",
          chapterNumber: 5,
          verseSnippet:
            "Be shepherds of God's flock that is under your care, watching over them—not because you must, but because you are willing, as God wants you to be; not pursuing dishonest gain, but eager to serve; not lording it over those entrusted to you, but being examples to the flock.",
          thematicTakeaway: "Lead by setting a luminous personal example, not by bullying, manipulating, or coercive control.",
        },
        homily: {
          title: "Examples to the Flock",
          preacher: "Simon Peter",
          duration: "2 min",
          practicalTips: [
            "Inspire through your own sacrificial example rather than dictating orders.",
            "Serve eagerly out of love, never for personal gain or prestige.",
            "Remember that the flock belongs to the Chief Shepherd, Jesus.",
          ],
          audioScript:
            "Peter had seen the Chief Shepherd lay down His life for the sheep. He warns all leaders: do not lord authority over those entrusted to you; be living examples of Christlikeness. When the Chief Shepherd appears, you will receive a crown of glory.",
        },
      },
    ],
  },
  {
    id: "balance",
    label: "Balance & Moderation",
    icon: "⚖️",
    category: "growth",
    categoryLabel: "Self-Growth & Strength",
    summary: "Discerning the seasons of life, walking in sober judgment, and rejecting destructive extremes.",
    subSections: [
      {
        id: "balance-ecclesiastes",
        title: "A Time for Everything Under Heaven",
        tag: "Seasons of Life",
        verse: {
          reference: "Ecclesiastes 3:1-8",
          bookSlug: "ecclesiastes",
          chapterNumber: 3,
          verseSnippet:
            "There is a time for everything, and a season for every activity under the heavens: a time to be born and a time to die, a time to plant and a time to uproot... a time to weep and a time to laugh, a time to mourn and a time to dance.",
          thematicTakeaway: "God makes everything beautiful in its time; peace comes from accepting your current season.",
        },
        homily: {
          title: "The Wisdom of the Seasons",
          preacher: "The Preacher (Qoheleth)",
          duration: "2 min",
          practicalTips: [
            "Identify what season you are in right now (planting, waiting, harvesting, or resting).",
            "Do not demand harvest fruit in a winter season of preparation.",
            "Trust that God is weaving all seasons into eternal beauty.",
          ],
          audioScript:
            "Life is not a monotonous sprint; it is a sacred rhythm of seasons. There is a time to labor, and a time to rest; a time to weep, and a time to dance. Honor the season God has placed you in today, and trust His timing.",
        },
      },
      {
        id: "balance-proverbs",
        title: "The Lord Detests Dishonest Scales",
        tag: "Fair Balance",
        verse: {
          reference: "Proverbs 11:1",
          bookSlug: "proverbs",
          chapterNumber: 11,
          verseSnippet: "The Lord detests dishonest scales, but accurate weights find favor with him.",
          thematicTakeaway: "Honesty, fair balance, and ethical equilibrium bring the radiant smile of God upon your labor.",
        },
        homily: {
          title: "Accurate Scales Before God",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Be scrupulously fair in business dealings, billing, and transactions.",
            "Balance your daily life between labor, worship, relationships, and rest.",
            "Remember that God loves truth and fair weights.",
          ],
          audioScript:
            "In ancient markets, deceptive traders tilted the scales. Solomon warns that God detests deceitful weights. Live a balanced, honest, transparent life. Accurate weights and fair dealings find favor with God.",
        },
      },
      {
        id: "balance-romans",
        title: "Thinking of Yourself with Sober Judgment",
        tag: "Sober Self-Assessment",
        verse: {
          reference: "Romans 12:3",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet:
            "Do not think of yourself more highly than you ought, but rather think of yourself with sober judgment, in accordance with the faith God has distributed to each of you.",
          thematicTakeaway: "Balanced humility avoids both arrogant self-exaltation and toxic self-loathing.",
        },
        homily: {
          title: "The Golden Mean of Sober Judgment",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Avoid thinking too highly of yourself, and avoid self-destructive despair.",
            "Recognize your strengths as gifts of grace, and your weaknesses as invitations to rely on God.",
            "Serve faithfully within the measure of faith God has allotted you.",
          ],
          audioScript:
            "True balance is thinking of yourself with sober judgment. You are not a god, nor are you worthless dust; you are a redeemed child of the King, gifted by grace. Walk in sober, joyful humility.",
        },
      },
    ],
  },

  // =========================================================================
  // CATEGORY 3: CORE HUMAN EMOTIONS & SPIRITUAL INSIGHTS
  // =========================================================================
  {
    id: "love",
    label: "Love (Agape)",
    icon: "❤️",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Embodying sacrificial agape, unconditional devotion, and the bond of perfect unity.",
    subSections: [
      {
        id: "love-1corinthians",
        title: "Love Is Patient, Love Is Kind",
        tag: "The Hymn of Love",
        verse: {
          reference: "1 Corinthians 13:4-7",
          bookSlug: "1-corinthians",
          chapterNumber: 13,
          verseSnippet:
            "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
          thematicTakeaway: "Agape love is the portrait of Jesus Himself—sacrificial, enduring, and unfailing.",
        },
        homily: {
          title: "The Supreme Way of Agape",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Insert your own name in place of 'love' and see where you fall short of patience.",
            "Tear up the mental ledger of past wrongs someone committed against you.",
            "Choose kindness in your next tense conversation.",
          ],
          audioScript:
            "Without love, the greatest preaching is like a clanging cymbal, and the greatest knowledge is nothing. Love is patient and kind; it bears all things, believes all things, hopes all things. Let Christ's love pour through you.",
        },
      },
      {
        id: "love-1john",
        title: "God Is Love",
        tag: "Divine Nature",
        verse: {
          reference: "1 John 4:8",
          bookSlug: "1-john",
          chapterNumber: 4,
          verseSnippet: "Whoever does not love does not know God, because God is love.",
          thematicTakeaway: "Love is not merely an attribute of God; God's very essence and nature is holy love.",
        },
        homily: {
          title: "The Source of All Affection",
          preacher: "Saint John the Evangelist",
          duration: "2 min",
          practicalTips: [
            "Reflect on how deeply you are loved by God right now.",
            "Let the realization of God's love dissolve bitterness toward others.",
            "Love someone who is difficult to love, drawing on God's infinite supply.",
          ],
          audioScript:
            "God is love. If we do not love our brothers and sisters, we do not know God, no matter how much doctrine we memorize. Drink deeply of the ocean of His love, and let it overflow into the thirsty lives around you.",
        },
      },
      {
        id: "love-romans",
        title: "Owe No One Anything Except Love",
        tag: "Fulfilling the Law",
        verse: {
          reference: "Romans 13:8",
          bookSlug: "romans",
          chapterNumber: 13,
          verseSnippet: "Let no debt remain outstanding, except the continuing debt to love one another, for whoever loves others has fulfilled the law.",
          thematicTakeaway: "The only debt you can never fully pay off is your sacred obligation to love your neighbor.",
        },
        homily: {
          title: "The Debt of Love",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "View every person you meet as someone to whom you owe the debt of Christian love.",
            "Fulfill the law of Christ by doing no harm and extending mercy.",
            "Forgive debts and release grudges.",
          ],
          audioScript:
            "Paul tells us: owe no one anything, except to love one another. Love is a debt that we must pay every morning and still owe by evening. In loving your neighbor, you fulfill the entire law of God.",
        },
      },
      {
        id: "love-colossians",
        title: "Put on Love as the Perfect Bond",
        tag: "The Garment of Unity",
        verse: {
          reference: "Colossians 3:14",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet: "And over all these virtues put on love, which binds them all together in perfect unity.",
          thematicTakeaway: "Love is the master garment that clasps all other virtues together in perfect harmony.",
        },
        homily: {
          title: "The Clasp of Perfection",
          preacher: "Saint Ambrose",
          duration: "2 min",
          practicalTips: [
            "Consciously put on love each morning like a royal outer robe.",
            "Seek peace and unity in your church, workplace, and family.",
            "Let love bind all your actions together.",
          ],
          audioScript:
            "You may possess compassion, kindness, humility, and patience, but Paul says: over all these put on love, which binds them all together in perfect harmony. Love is the crown and clasp of every virtue.",
        },
      },
    ],
  },
  {
    id: "trust",
    label: "Trust",
    icon: "⚓",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Resting your soul in the rock of God's character when the foundation of circumstances shakes.",
    subSections: [
      {
        id: "trust-proverbs",
        title: "Trusting with All Your Heart",
        tag: "Wholehearted Trust",
        verse: {
          reference: "Proverbs 3:5-6",
          bookSlug: "proverbs",
          chapterNumber: 3,
          verseSnippet:
            "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          thematicTakeaway: "Surrender your fragile logic to God's all-seeing wisdom, and He will steer your path.",
        },
        homily: {
          title: "Unconditional Confidence in God",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Acknowledge where you have been leaning on your own cleverness.",
            "Surrender the steering wheel of your future to Christ.",
            "Take the next faithful step in simple obedience.",
          ],
          audioScript:
            "To trust in the Lord with all your heart means abandoning self-reliance. You do not need to forecast the storm when the Master of the sea is in your vessel. Trust Him wholly, and He will direct your path.",
        },
      },
      {
        id: "trust-psalm56",
        title: "When I Am Afraid, I Put My Trust in You",
        tag: "Trust Over Fear",
        verse: {
          reference: "Psalm 56:3",
          bookSlug: "psalms",
          chapterNumber: 56,
          verseSnippet: "When I am afraid, I put my trust in you.",
          thematicTakeaway: "Courage is not the absence of fear; it is choosing to put your trust in God the moment fear strikes.",
        },
        homily: {
          title: "The Pivot from Terror to Trust",
          preacher: "David in Gath",
          duration: "2 min",
          practicalTips: [
            "Whisper: 'When I am afraid, I trust in You, Lord.'",
            "Refuse to let fear dictate your choices.",
            "Recall past times when God carried you through deep waters.",
          ],
          audioScript:
            "David was captured by the Philistines in Gath when he wrote Psalm 56. He did not deny his fear; he pivoted: 'When I am afraid, I put my trust in You.' Make fear a catalyst that drives you straight into God's arms.",
        },
      },
      {
        id: "trust-jeremiah",
        title: "Blessed Is the One Who Trusts in the Lord",
        tag: "Planted by the Water",
        verse: {
          reference: "Jeremiah 17:7-8",
          bookSlug: "jeremiah",
          chapterNumber: 17,
          verseSnippet:
            "But blessed is the one who trusts in the Lord, whose confidence is in him. They will be like a tree planted by the water that sends out its roots by the stream. It does not fear when heat comes; its leaves are always green.",
          thematicTakeaway: "A life rooted in trust never withers, even during long seasons of scorching drought.",
        },
        homily: {
          title: "The Deep-Rooted Tree",
          preacher: "Jeremiah",
          duration: "2 min",
          practicalTips: [
            "Send your spiritual roots deep into daily prayer and meditation.",
            "Do not be anxious when seasons of economic or personal drought arrive.",
            "Yield the fruit of peace even in difficult climates.",
          ],
          audioScript:
            "When heat waves strike, shallow bushes wither. But the tree planted by the river sends its roots deep to hidden waters. When you trust in the Lord, your leaves remain green even through the hottest drought.",
        },
      },
      {
        id: "trust-isaiah",
        title: "Kept in Perfect Peace",
        tag: "Steadfast Mind",
        verse: {
          reference: "Isaiah 26:3",
          bookSlug: "isaiah",
          chapterNumber: 26,
          verseSnippet: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
          thematicTakeaway: "Perfect peace ('shalom shalom') belongs to the mind that stays anchored in God's faithfulness.",
        },
        homily: {
          title: "Double Peace for the Steadfast",
          preacher: "Isaiah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Keep your thoughts fixed on God's promises throughout the day.",
            "Refuse to let catastrophic headlines shake your internal peace.",
            "Rest in the fortress of the Eternal Rock.",
          ],
          audioScript:
            "In Hebrew, Isaiah says: 'Shalom, shalom'—double peace, perfect peace, overflowing peace. To whom is it given? To the soul whose mind is stayed on the Lord, because they trust in Him. Anchor your thoughts in Christ.",
        },
      },
    ],
  },
  {
    id: "fear",
    label: "Fear & Courage",
    icon: "🛡️",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Conquering dread, breaking intimidation, and walking in the boldness of the Holy Spirit.",
    subSections: [
      {
        id: "fear-isaiah",
        title: "Do Not Fear, for I Am with You",
        tag: "Divine Presence",
        verse: {
          reference: "Isaiah 41:10",
          bookSlug: "isaiah",
          chapterNumber: 41,
          verseSnippet:
            "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          thematicTakeaway: "The antidote to fear is not self-confidence, but God's promised presence and upholding right hand.",
        },
        homily: {
          title: "The Upholding Right Hand",
          preacher: "Isaiah",
          duration: "2 min",
          practicalTips: [
            "Repeat: 'God is with me; I will not be dismayed.'",
            "Feel His righteous hand spiritually supporting your frame.",
            "Step forward into intimidating assignments knowing He strengthens you.",
          ],
          audioScript:
            "Hear the Almighty speaking directly to you: 'Fear not, for I am with you; be not dismayed, for I am your God.' He does not send an angel to help from afar; He holds you with His own righteous right hand. Stand firm.",
        },
      },
      {
        id: "fear-psalm27",
        title: "The Lord Is the Stronghold of My Life",
        tag: "Unshakable Fortress",
        verse: {
          reference: "Psalm 27:1",
          bookSlug: "psalms",
          chapterNumber: 27,
          verseSnippet:
            "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
          thematicTakeaway: "When the Almighty is your light and stronghold, every earthly terror is rendered powerless.",
        },
        homily: {
          title: "The Light That Banishes Nightmares",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Declare Psalm 27:1 when walking into intimidating rooms or meetings.",
            "Remember that enemies and circumstances cannot breach God's stronghold.",
            "Rest in the security of your salvation.",
          ],
          audioScript:
            "David asks two rhetorical questions: 'Whom shall I fear? Of whom shall I be afraid?' The answer is: no one! When God is your light, the darkness cannot overcome you. When God is your fortress, no army can breach your walls.",
        },
      },
      {
        id: "fear-2timothy",
        title: "Not a Spirit of Fear, but of Power",
        tag: "Spirit of Boldness",
        verse: {
          reference: "2 Timothy 1:7",
          bookSlug: "2-timothy",
          chapterNumber: 1,
          verseSnippet: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
          thematicTakeaway: "Timidity and dread are not from God; His Spirit fills you with power, love, and a sound mind.",
        },
        homily: {
          title: "The Lion-Heart of the Spirit",
          preacher: "Saint Paul to Timothy",
          duration: "2 min",
          practicalTips: [
            "Reject cowardice and timidity as foreign to the Holy Spirit.",
            "Act with courage motivated by genuine love.",
            "Exercise sound judgment in high-stakes situations.",
          ],
          audioScript:
            "Timothy was naturally timid, facing fierce opposition in Ephesus. Paul reminded him: God has not given you a spirit of fear! Stir up the gift within you. Step out with the holy boldness of the Lion of Judah.",
        },
      },
      {
        id: "fear-1john",
        title: "Perfect Love Drives Out Fear",
        tag: "Love Casts Out Fear",
        verse: {
          reference: "1 John 4:18",
          bookSlug: "1-john",
          chapterNumber: 4,
          verseSnippet:
            "There is no fear in love. But perfect love drives out fear, because fear has to do with punishment. The one who fears is not made perfect in love.",
          thematicTakeaway: "When you understand how radically you are loved by God, the dread of condemnation vanishes.",
        },
        homily: {
          title: "The Expulsive Power of Perfect Love",
          preacher: "Saint John the Evangelist",
          duration: "2 min",
          practicalTips: [
            "Meditate on the cross where Christ took all your punishment.",
            "Let the ocean of God's love displace tormenting fear.",
            "Live as a cherished son or daughter, not a terrified slave.",
          ],
          audioScript:
            "Fear anticipates punishment, looking over its shoulder in dread. But perfect love casts out fear! At the cross, Christ bore your punishment. You are safe in the Father's embrace. Walk in the freedom of beloved children.",
        },
      },
    ],
  },
  {
    id: "courage",
    label: "Courage",
    icon: "🦁",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Stepping across Jordans, conquering giants, and standing firm in holy valor.",
    subSections: [
      {
        id: "courage-joshua",
        title: "Be Strong and Courageous",
        tag: "Crossing the Jordan",
        verse: {
          reference: "Joshua 1:9",
          bookSlug: "joshua",
          chapterNumber: 1,
          verseSnippet:
            "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
          thematicTakeaway: "Courage is a command rooted in the certainty that God accompanies you wherever you set your foot.",
        },
        homily: {
          title: "Taking Territory in Christ's Name",
          preacher: "Joshua the General",
          duration: "2 min",
          practicalTips: [
            "Memorize Joshua 1:9 and repeat it before stepping into difficult assignments.",
            "Cross the river of hesitation by taking the first step of faith.",
            "Trust that God goes before you to prepare the way.",
          ],
          audioScript:
            "Moses was dead, and Joshua faced fortified cities and giants in the land. God gave him one supreme command: 'Be strong and courageous! Do not be terrified, for the Lord your God is with you wherever you go.' March forward!",
        },
      },
      {
        id: "courage-deuteronomy",
        title: "He Will Never Leave You nor Forsake You",
        tag: "Unshakable Ally",
        verse: {
          reference: "Deuteronomy 31:6",
          bookSlug: "deuteronomy",
          chapterNumber: 31,
          verseSnippet:
            "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
          thematicTakeaway: "No enemy or obstacle can outmatch the God who marches at your side.",
        },
        homily: {
          title: "The Vanguard of God",
          preacher: "Moses the Lawgiver",
          duration: "2 min",
          practicalTips: [
            "Remind your soul that you never fight battles alone.",
            "Do not be terrified of loud opposition or cultural hostility.",
            "Stand firm in the unbreakable covenant of God.",
          ],
          audioScript:
            "Moses spoke his final blessing to Israel: 'Be strong and courageous; do not be afraid, for the Lord your God goes with you.' The Creator of the cosmos is your advance guard and your rearguard. You cannot be defeated.",
        },
      },
      {
        id: "courage-psalm31",
        title: "Be of Good Courage, All You Who Hope",
        tag: "Strengthened Heart",
        verse: {
          reference: "Psalm 31:24",
          bookSlug: "psalms",
          chapterNumber: 31,
          verseSnippet: "Be strong and take heart, all you who hope in the Lord.",
          thematicTakeaway: "Hope in the Lord infuses iron strength into the faintest heart.",
        },
        homily: {
          title: "Taking Heart in the Lord",
          preacher: "David",
          duration: "2 min",
          practicalTips: [
            "Take courage today by lifting your eyes from earthly dilemmas to heaven.",
            "Anchor your expectations in God's promises.",
            "Speak courage into someone who is feeling faint-hearted.",
          ],
          audioScript:
            "When circumstances are bleak, the psalmist cries: 'Be strong and take heart, all you who hope in the Lord!' Your hope is not wishful thinking; it is anchored in the resurrected King. Take heart!",
        },
      },
      {
        id: "courage-1corinthians",
        title: "Act Like Men, Be Strong",
        tag: "Vigilant Strength",
        verse: {
          reference: "1 Corinthians 16:13",
          bookSlug: "1-corinthians",
          chapterNumber: 16,
          verseSnippet: "Be on your guard; stand firm in the faith; be courageous; be strong.",
          thematicTakeaway: "Spiritual valor requires alert vigilance, unshakable doctrine, and active courage.",
        },
        homily: {
          title: "The Fourfold Clarion Call",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Be on your guard against moral compromise.",
            "Stand firm in sound biblical doctrine.",
            "Pair strong courage with selfless love in everything you do.",
          ],
          audioScript:
            "Paul delivers a military trumpet blast: 'Be watchful, stand firm in the faith, act like men, be strong!' Do not shrink back in timidity. Stand like watchmen on the wall, courageous in the grace of Jesus Christ.",
        },
      },
    ],
  },
  {
    id: "wisdom",
    label: "Wisdom",
    icon: "🦉",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Treasuring divine discernment, walking in the fear of the Lord, and discerning righteous paths.",
    subSections: [
      {
        id: "wisdom-james",
        title: "Generously Given Without Reproach",
        tag: "Asking God",
        verse: {
          reference: "James 1:5",
          bookSlug: "james",
          chapterNumber: 1,
          verseSnippet: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
          thematicTakeaway: "God delights to pour heavenly wisdom into every open, seeking heart.",
        },
        homily: {
          title: "The Heavenly Gift of Counsel",
          preacher: "Saint James the Just",
          duration: "2 min",
          practicalTips: [
            "Pray for wisdom before every important conversation or transaction.",
            "Expect God to guide your thoughts with divine clarity.",
            "Read a chapter of Proverbs alongside your daily prayer.",
          ],
          audioScript:
            "Earthly knowledge is accumulating facts; heavenly wisdom is knowing how to live honorably in God's world. If you lack wisdom, ask your Father. He gives generously without scolding. Draw near to Him.",
        },
      },
      {
        id: "wisdom-proverbs2",
        title: "For the Lord Gives Wisdom",
        tag: "The Treasury of God",
        verse: {
          reference: "Proverbs 2:6",
          bookSlug: "proverbs",
          chapterNumber: 2,
          verseSnippet: "For the Lord gives wisdom; from his mouth come knowledge and understanding.",
          thematicTakeaway: "True wisdom is not human philosophy; it proceeds directly from the mouth of the Lord.",
        },
        homily: {
          title: "Listening to the Voice of Wisdom",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Open the Scriptures to receive knowledge directly from God's mouth.",
            "Value spiritual understanding above silver and gold.",
            "Let divine wisdom guard your speech and your steps.",
          ],
          audioScript:
            "The world searches in vain for answers through human theories. But true wisdom flows from the mouth of the Lord. He stores up sound wisdom for the upright and is a shield to those who walk with integrity.",
        },
      },
      {
        id: "wisdom-proverbs4",
        title: "Wisdom Is Supreme; Therefore Get Wisdom",
        tag: "The Supreme Treasure",
        verse: {
          reference: "Proverbs 4:7",
          bookSlug: "proverbs",
          chapterNumber: 4,
          verseSnippet: "The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.",
          thematicTakeaway: "Wisdom is the principal thing; invest everything to acquire understanding.",
        },
        homily: {
          title: "Acquiring the Pearl of Understanding",
          preacher: "Solomon the Wise",
          duration: "2 min",
          practicalTips: [
            "Make the pursuit of godly wisdom your primary life goal.",
            "Cherish wisdom, and she will exalt and honor you.",
            "Protect your heart, for it is the wellspring of life.",
          ],
          audioScript:
            "Solomon urges us: 'Wisdom is supreme; therefore get wisdom! Though it cost all you have, get understanding.' Do not chase after temporary honors. Prize wisdom, and she will crown your life with dignity.",
        },
      },
      {
        id: "wisdom-colossians",
        title: "In Whom Are Hidden All Treasures",
        tag: "Christ the Wisdom of God",
        verse: {
          reference: "Colossians 2:3",
          bookSlug: "colossians",
          chapterNumber: 2,
          verseSnippet: "In whom are hidden all the treasures of wisdom and knowledge.",
          thematicTakeaway: "Every secret of divine wisdom and knowledge is personified and unveiled in Jesus Christ.",
        },
        homily: {
          title: "Christ, the Incarnate Wisdom",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Look to Jesus as the ultimate source of truth, morality, and discernment.",
            "Do not be captivated by hollow and deceptive human philosophies.",
            "Abide in Christ, and His wisdom will illumine your soul.",
          ],
          audioScript:
            "In Christ Jesus are hidden all the treasures of wisdom and knowledge. You do not need secret mystery religions or esoteric philosophy. To know Christ is to possess the key to all wisdom.",
        },
      },
    ],
  },
  {
    id: "faith",
    label: "Faith",
    icon: "⚓",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Confidence in what is unseen, walking by conviction, and resting in Christ's righteousness.",
    subSections: [
      {
        id: "faith-hebrews",
        title: "Assurance of Things Hoped For",
        tag: "The Hall of Faith",
        verse: {
          reference: "Hebrews 11:1",
          bookSlug: "hebrews",
          chapterNumber: 11,
          verseSnippet: "Now faith is confidence in what we hope for and assurance about what we do not see.",
          thematicTakeaway: "Faith is not blind wishful thinking; it is absolute conviction in God's character and promises.",
        },
        homily: {
          title: "The Substance of the Unseen",
          preacher: "The Author of Hebrews",
          duration: "2 min",
          practicalTips: [
            "Anchor your soul in what God has promised, not merely what your physical eyes behold.",
            "Remember that without faith it is impossible to please God.",
            "Take one step of faith today that requires reliance on the Spirit.",
          ],
          audioScript:
            "Faith gives substance to the things we hope for. The ancients conquered kingdoms and quenched the violence of fire because they saw Him who is invisible. Trust your unseen Father with your visible challenges.",
        },
      },
      {
        id: "faith-romans10",
        title: "Faith Comes from Hearing the Word",
        tag: "Feeding on Scripture",
        verse: {
          reference: "Romans 10:17",
          bookSlug: "romans",
          chapterNumber: 10,
          verseSnippet: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
          thematicTakeaway: "Faith is nourished and ignited whenever you hear and meditate on the Gospel of Christ.",
        },
        homily: {
          title: "The Fuel of Faith",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Listen to Scripture read aloud or audio devotionals daily.",
            "Fill your mind with the promises of Christ rather than doubt-inducing noise.",
            "Speak the Word of God over your family and circumstances.",
          ],
          audioScript:
            "If your faith feels weak, do not try to manufacture feelings. Faith comes from hearing the word of Christ! Open the Scriptures, listen to His voice, and let His truth ignite fresh confidence in your heart.",
        },
      },
      {
        id: "faith-2corinthians",
        title: "We Walk by Faith, Not by Sight",
        tag: "Unseen Horizon",
        verse: {
          reference: "2 Corinthians 5:7",
          bookSlug: "2-corinthians",
          chapterNumber: 5,
          verseSnippet: "For we live by faith, not by sight.",
          thematicTakeaway: "Physical eyesight sees temporary obstacles; faith perceives eternal realities.",
        },
        homily: {
          title: "Living Above the Horizon of Sight",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Do not let current visible limitations dictate what God can accomplish.",
            "Walk with calm composure through seasons of uncertainty.",
            "Keep an eternal perspective on every temporary struggle.",
          ],
          audioScript:
            "Sight looks at the wind and waves and sinks in panic. Faith looks at the Savior walking on the water and steps out of the boat. We walk by faith, not by sight. Keep your eyes on Jesus.",
        },
      },
      {
        id: "faith-ephesians",
        title: "Saved by Grace Through Faith",
        tag: "The Free Gift",
        verse: {
          reference: "Ephesians 2:8",
          bookSlug: "ephesians",
          chapterNumber: 2,
          verseSnippet: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.",
          thematicTakeaway: "Salvation is an unearned gift of grace received with open hands through faith.",
        },
        homily: {
          title: "The Open Hands of Grace",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Cease trying to earn God's love through legalistic striving.",
            "Receive His salvation with joyful, humble thanksgiving.",
            "Boast only in the cross of our Lord Jesus Christ.",
          ],
          audioScript:
            "You were not saved by your moral resume or your pedigree. It is by grace through faith—the free gift of God, so that no one can boast. Rest in the finished work of Jesus on your behalf.",
        },
      },
    ],
  },
  {
    id: "hope",
    label: "Hope",
    icon: "🌅",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Anchoring your soul in the unshakeable dawn of God's promises and eternal resurrection.",
    subSections: [
      {
        id: "hope-romans",
        title: "The God of Hope Fills You with Joy",
        tag: "Overflowing Hope",
        verse: {
          reference: "Romans 15:13",
          bookSlug: "romans",
          chapterNumber: 15,
          verseSnippet:
            "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
          thematicTakeaway: "The Holy Spirit causes hope to overflow like a fountain in the middle of dry seasons.",
        },
        homily: {
          title: "The Fountain of Holy Hope",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Pray Romans 15:13 as a morning blessing over your household.",
            "Expect the Holy Spirit to replenish joy and peace as you trust God.",
            "Be a contagiously hopeful presence to those burdened by despair.",
          ],
          audioScript:
            "Our God is not the God of despair; He is the God of hope! As you trust in Him, He fills you with all joy and peace until hope overflows from your life into a weary world. Receive His joy today.",
        },
      },
      {
        id: "hope-hebrews",
        title: "An Anchor of the Soul",
        tag: "The Sure Anchor",
        verse: {
          reference: "Hebrews 6:19",
          bookSlug: "hebrews",
          chapterNumber: 6,
          verseSnippet: "We have this hope as an anchor for the soul, firm and secure. It enters the inner sanctuary behind the curtain.",
          thematicTakeaway: "Your hope is not tied to shifting waves, but anchored in the holy presence of God where Jesus intercedes.",
        },
        homily: {
          title: "The Anchor in the Holy of Holies",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "When storms rage, visualize your soul's anchor firmly lodged before God's throne.",
            "Refuse to drift into cynicism or despair.",
            "Celebrate that Jesus has entered behind the veil on your behalf.",
          ],
          audioScript:
            "An anchor is cast downward into the sea, but the Christian hope is cast upward into the heavenly sanctuary behind the veil! It is firm and secure. No storm can tear away a soul anchored in Christ.",
        },
      },
      {
        id: "hope-jeremiah",
        title: "A Future and a Hope",
        tag: "Guaranteed Tomorrow",
        verse: {
          reference: "Jeremiah 29:11",
          bookSlug: "jeremiah",
          chapterNumber: 29,
          verseSnippet: "'For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.'",
          thematicTakeaway: "God has written your future with letters of redemption, shalom, and enduring hope.",
        },
        homily: {
          title: "The Dawn Behind the Clouds",
          preacher: "Jeremiah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Hold onto God's promises even when current circumstances look bleak.",
            "Speak words of hope over your family and future.",
            "Rest in the assurance that God's plans for you are good.",
          ],
          audioScript:
            "God has not forgotten you in your exile. His thoughts toward you are thoughts of peace, to give you a future and a hope. Lift up your eyes; the dawn is breaking.",
        },
      },
      {
        id: "hope-psalm71",
        title: "I Will Hope Continually",
        tag: "Praising Yet More",
        verse: {
          reference: "Psalm 71:14",
          bookSlug: "psalms",
          chapterNumber: 71,
          verseSnippet: "As for me, I will always have hope; I will praise you more and more.",
          thematicTakeaway: "A heart resolved to hope answers every sorrow with multiplied praise.",
        },
        homily: {
          title: "The Song of Unquenchable Hope",
          preacher: "The Aging Psalmist",
          duration: "2 min",
          practicalTips: [
            "Choose praise as your weapon against despair.",
            "Reflect on God's faithfulness from your youth to your old age.",
            "Declare: 'I will hope continually and praise You more and more.'",
          ],
          audioScript:
            "Even in gray-haired old age, the psalmist resolved: 'As for me, I will hope continually, and will praise You yet more and more.' Let praise be the melody that carries you through every season.",
        },
      },
    ],
  },
  {
    id: "peace",
    label: "Peace (Shalom)",
    icon: "🕊️",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Resting in Christ's farewell gift of unshakeable shalom amid cultural noise and storms.",
    subSections: [
      {
        id: "peace-john",
        title: "My Peace I Give to You",
        tag: "The Farewell Gift",
        verse: {
          reference: "John 14:27",
          bookSlug: "john",
          chapterNumber: 14,
          verseSnippet: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
          thematicTakeaway: "Christ's peace is not the absence of trouble, but His calming presence inside the trouble.",
        },
        homily: {
          title: "The Farewell Gift in the Upper Room",
          preacher: "Jesus to His Disciples",
          duration: "2 min",
          practicalTips: [
            "Receive Christ's peace as a gift, not something you must manufacture.",
            "Refuse to let your heart be troubled or afraid.",
            "Carry His quiet calm into every tense environment.",
          ],
          audioScript:
            "On the night before the cross, Jesus bequeathed His legacy: 'My peace I give to you; not as the world gives do I give to you.' The world's peace depends on circumstances; Christ's peace calms you inside the storm. Receive it now.",
        },
      },
      {
        id: "peace-philippians",
        title: "The Peace That Surpasses Understanding",
        tag: "The Garrison of Peace",
        verse: {
          reference: "Philippians 4:7",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          thematicTakeaway: "God's peace stands like an armed guard over your emotions and mental health.",
        },
        homily: {
          title: "The Heavenly Guard over the Soul",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Exchange anxious thoughts for thankful prayers.",
            "Rest in the peace that defies human logic.",
            "Let the peace of God guard your mental gates.",
          ],
          audioScript:
            "When the Roman garrison patrolled Philippi, the citizens felt secure. Paul says: the peace of God will garrison your hearts and minds in Christ Jesus. It transcends human comprehension. Rest in His security.",
        },
      },
      {
        id: "peace-isaiah",
        title: "Steadfast Mind Kept in Peace",
        tag: "The Steadfast Mind",
        verse: {
          reference: "Isaiah 26:3",
          bookSlug: "isaiah",
          chapterNumber: 26,
          verseSnippet: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
          thematicTakeaway: "When your mind is anchored in the Rock of Ages, perfect peace fills your life.",
        },
        homily: {
          title: "The Fortress of Shalom",
          preacher: "Isaiah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Focus your attention on God's unchanging nature.",
            "Refuse to be shaken by temporary setbacks.",
            "Whisper 'Shalom' over your household.",
          ],
          audioScript:
            "Perfect peace is not a distant dream; it is the promised heritage of those whose minds are stayed on God. Fix your thoughts on Him, and His shalom will flood your soul.",
        },
      },
      {
        id: "peace-romans",
        title: "Living at Peace with Everyone",
        tag: "Peacemaking",
        verse: {
          reference: "Romans 12:18",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet: "If it is possible, as far as it depends on you, live at peace with everyone.",
          thematicTakeaway: "Take responsibility for your part in fostering harmony and de-escalating strife.",
        },
        homily: {
          title: "The Blessed Peacemaker",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Do your 100% to live peaceably, even if others refuse.",
            "De-escalate arguments with gentleness and humility.",
            "Refuse to harbor or spread divisive gossip.",
          ],
          audioScript:
            "Paul gives a realistic counsel: 'If it is possible, as far as it depends on you, live at peace with everyone.' You cannot control another's reaction, but you can control your own spirit. Be an instrument of peace.",
        },
      },
    ],
  },
  {
    id: "compassion",
    label: "Compassion",
    icon: "🤲",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Clothe yourself with tender mercies, bind up the wounded, and reflect the Father's heart.",
    subSections: [
      {
        id: "compassion-colossians",
        title: "Clothed with Compassion & Kindness",
        tag: "Holy Garment",
        verse: {
          reference: "Colossians 3:12",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet:
            "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
          thematicTakeaway: "Put on compassion intentionally every morning, as a chosen and beloved child of God.",
        },
        homily: {
          title: "The Robe of Tender Mercies",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Intentionally choose compassion over annoyance when dealing with difficult people.",
            "Put on kindness as your daily garment.",
            "Remember how lavishly God has shown compassion to you.",
          ],
          audioScript:
            "You are holy and dearly loved by God. Therefore, clothe yourself with tender mercies, kindness, humility, and patience. Let people encounter the gentle fragrance of Christ whenever they speak with you.",
        },
      },
      {
        id: "compassion-ephesians",
        title: "Be Kind and Tenderhearted",
        tag: "Tender Hearts",
        verse: {
          reference: "Ephesians 4:32",
          bookSlug: "ephesians",
          chapterNumber: 4,
          verseSnippet: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          thematicTakeaway: "Tenderhearted kindness flows naturally when you remember the depth of your own forgiveness.",
        },
        homily: {
          title: "The Melting of the Stone Heart",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Soften your posture toward someone who has irritated you.",
            "Extend the same lavish forgiveness you received at the cross.",
            "Perform an anonymous act of kindness today.",
          ],
          audioScript:
            "Do not allow the world to harden your heart into stone. Be kind and tenderhearted to one another, forgiving as God in Christ forgave you. A tender heart is the true mark of a disciple.",
        },
      },
      {
        id: "compassion-zechariah",
        title: "Administer True Justice, Show Mercy",
        tag: "Social Compassion",
        verse: {
          reference: "Zechariah 7:9",
          bookSlug: "zechariah",
          chapterNumber: 7,
          verseSnippet: "This is what the Lord Almighty said: 'Administer true justice; show mercy and compassion to one another.'",
          thematicTakeaway: "True religion pairs honest justice with active mercy and compassion for the vulnerable.",
        },
        homily: {
          title: "The Heart That Pleases God",
          preacher: "Zechariah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Defend the cause of the vulnerable, the widow, and the orphan.",
            "Do not plot evil in your heart against your neighbor.",
            "Let justice and compassion walk hand in hand in your life.",
          ],
          audioScript:
            "God cares far more about justice and compassion than empty religious rituals. He commands: administer true justice, show mercy and compassion to one another. Let your faith bear fruit in active love.",
        },
      },
      {
        id: "compassion-psalm103",
        title: "As a Father Has Compassion on His Children",
        tag: "The Father's Pity",
        verse: {
          reference: "Psalm 103:13",
          bookSlug: "psalms",
          chapterNumber: 103,
          verseSnippet: "As a father has compassion on his children, so the Lord has compassion on those who fear him.",
          thematicTakeaway: "God remembers that we are dust and treats our fragile frame with tender paternal care.",
        },
        homily: {
          title: "The Tenderness of the Heavenly Father",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Rest in the knowledge that God knows your human frame and weaknesses.",
            "Approach Him not with terror, but with childlike trust.",
            "Show paternal and maternal compassion to those under your care.",
          ],
          audioScript:
            "As a father pities and cherishes his little children, so the Lord has compassion on those who fear Him. He knows our frame; He remembers that we are dust. Rest in the tender heart of your Father.",
        },
      },
    ],
  },
  {
    id: "forgiveness",
    label: "Forgiveness",
    icon: "🕊️",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Releasing debtors, tearing up mental ledgers, and stepping into the freedom of mercy.",
    subSections: [
      {
        id: "forgiveness-matthew6",
        title: "Forgive Us as We Forgive Others",
        tag: "The Lord's Prayer",
        verse: {
          reference: "Matthew 6:14-15",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet:
            "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
          thematicTakeaway: "Unforgiveness closes the conduit through which heaven's mercy flows into our own lives.",
        },
        homily: {
          title: "The Unlocked Door of Mercy",
          preacher: "Jesus",
          duration: "2 min",
          practicalTips: [
            "Pray specifically for the soul who offended or hurt you.",
            "Release your demand to see them punished.",
            "Open your heart to receive the Father's cleansing forgiveness.",
          ],
          audioScript:
            "Forgiveness is not saying what they did was right; it is releasing the offender into God's hands. When we forgive, we cut the chains that bind us to the injury. Forgive, and walk in freedom.",
        },
      },
      {
        id: "forgiveness-colossians",
        title: "Forgive as the Lord Forgave You",
        tag: "The Model of the Cross",
        verse: {
          reference: "Colossians 3:13",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
          thematicTakeaway: "The measure of our forgiveness toward others is the infinite forgiveness we received at the cross.",
        },
        homily: {
          title: "The Cross, Our Measure of Mercy",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Remember the insurmountable debt of sin that Jesus wiped out on your behalf.",
            "Tear up the grievances you have recorded against a spouse or friend.",
            "Bear with one another with patient grace.",
          ],
          audioScript:
            "How can we hold a petty grudge when Christ wiped out our mountain of debt on the cross? 'Forgive as the Lord forgave you.' Let Calvary be the measure of your mercy toward everyone who hurts you.",
        },
      },
      {
        id: "forgiveness-ephesians",
        title: "Forgiving Each Other in Christ",
        tag: "Kindness & Pardon",
        verse: {
          reference: "Ephesians 4:32",
          bookSlug: "ephesians",
          chapterNumber: 4,
          verseSnippet: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          thematicTakeaway: "Pardon releases the poison of bitterness and restores fellowship in the body of Christ.",
        },
        homily: {
          title: "The Healing Balm of Pardon",
          preacher: "Saint John Chrysostom",
          duration: "2 min",
          practicalTips: [
            "Do not allow bitterness to poison your thoughts.",
            "Speak words of blessing rather than slander about the offender.",
            "Walk in the liberty of a forgiven child of God.",
          ],
          audioScript:
            "Bitterness is drinking poison and waiting for the other person to die. Forgiveness is the antidote. Forgive, as God in Christ forgave you, and watch the peace of God heal your wounded memories.",
        },
      },
      {
        id: "forgiveness-mark",
        title: "Forgive When You Stand Praying",
        tag: "Clear Conscience in Prayer",
        verse: {
          reference: "Mark 11:25",
          bookSlug: "mark",
          chapterNumber: 11,
          verseSnippet:
            "And when you stand praying, if you hold anything against anyone, forgive them, so that your Father in heaven may forgive you your sins.",
          thematicTakeaway: "Clear your horizontal relationships before approaching the vertical throne of prayer.",
        },
        homily: {
          title: "Clear Skies over the Altar",
          preacher: "Jesus",
          duration: "2 min",
          practicalTips: [
            "Before entering deep prayer, pause and forgive anyone you hold a grudge against.",
            "Do not allow unresolved bitterness to block your prayers.",
            "Rejoice in the unhindered communion of heaven.",
          ],
          audioScript:
            "Jesus says: when you stand praying, if you hold anything against anyone, forgive them. Do not let unrepented bitterness cloud your communion with heaven. Clear the air with mercy, and your prayers will soar.",
        },
      },
    ],
  },
  {
    id: "patience",
    label: "Patience",
    icon: "⏳",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Enduring delays, bearing with difficult people, and waiting on God's perfect timing.",
    subSections: [
      {
        id: "patience-romans",
        title: "Patient in Affliction, Constant in Prayer",
        tag: "Steadfast Hope",
        verse: {
          reference: "Romans 12:12",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet: "Be joyful in hope, patient in affliction, faithful in prayer.",
          thematicTakeaway: "Three golden cords of spiritual stamina: joyful hope, patient endurance, and constant prayer.",
        },
        homily: {
          title: "The Threefold Cord of Christian Endurance",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Keep your hope joyful even when the trial lingers.",
            "Endure current afflictions without grumbling or panic.",
            "Maintain an unbroken rhythm of daily prayer.",
          ],
          audioScript:
            "Paul weaves three vital disciplines together: be joyful in hope, patient in tribulation, constant in prayer. When trials press upon you, do not rush the clock. Let patience have its perfect work.",
        },
      },
      {
        id: "patience-james",
        title: "The Farmer Waiting for the Precious Crop",
        tag: "The Farmer's Patience",
        verse: {
          reference: "James 5:7-8",
          bookSlug: "james",
          chapterNumber: 5,
          verseSnippet:
            "Be patient, then, brothers and sisters, until the Lord's coming. See how the farmer waits for the land to yield its valuable crop, patiently waiting for the autumn and spring rains. You too, be patient and stand firm, because the Lord's coming is near.",
          thematicTakeaway: "Like the farmer waiting for the early and late rains, wait patiently for God's coming harvest.",
        },
        homily: {
          title: "Waiting for the Latter Rain",
          preacher: "Saint James the Just",
          duration: "2 min",
          practicalTips: [
            "Do not lose heart during the long seasons between sowing and harvest.",
            "Establish your heart firmly in the truth of Christ's return.",
            "Refuse to grumble against brothers and sisters while waiting.",
          ],
          audioScript:
            "The farmer does not panic during the weeks the seed lies buried in dark soil. He waits patiently for the autumn and spring rains. You too, establish your hearts; the Lord's coming is near.",
        },
      },
      {
        id: "patience-galatians",
        title: "Reaping in Due Season",
        tag: "Unwearied Labor",
        verse: {
          reference: "Galatians 6:9",
          bookSlug: "galatians",
          chapterNumber: 6,
          verseSnippet: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
          thematicTakeaway: "Weariness in well-doing is conquered by faith in God's guaranteed harvest calendar.",
        },
        homily: {
          title: "The Promise of the Due Season",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Do not quit when your labor seems unnoticed or unappreciated.",
            "Rest your physical body, but keep your spiritual resolve strong.",
            "Look forward with eager anticipation to God's harvest.",
          ],
          audioScript:
            "Temptation whispers: 'Give up; nobody cares; it makes no difference.' But Paul declares: 'In due season we shall reap, if we do not faint.' Keep planting seeds of love, truth, and grace.",
        },
      },
      {
        id: "patience-psalm37",
        title: "Be Still Before the Lord and Wait Patiently",
        tag: "Stillness Before God",
        verse: {
          reference: "Psalm 37:7",
          bookSlug: "psalms",
          chapterNumber: 37,
          verseSnippet: "Be still before the Lord and wait patiently for him; do not fret when people succeed in their ways, when they carry out their wicked schemes.",
          thematicTakeaway: "Stillness before the Lord frees you from frantic fretting over the temporary success of the wicked.",
        },
        homily: {
          title: "The Quiet Harbor of Stillness",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Sit in complete silence for two minutes before God.",
            "Do not envy the flashy, unrighteous shortcuts of others.",
            "Trust that God's justice and vindication will stand supreme.",
          ],
          audioScript:
            "Be still before the Lord and wait patiently for Him. Do not fret because of the one who prospers in his crooked way. Stillness is the posture of supreme trust in the Sovereign Judge.",
        },
      },
    ],
  },
  {
    id: "gratitude",
    label: "Gratitude",
    icon: "🌻",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Giving thanks in all circumstances, entering His gates with praise, and rejoicing in His bounty.",
    subSections: [
      {
        id: "gratitude-1thessalonians",
        title: "Give Thanks in All Circumstances",
        tag: "God's Will for You",
        verse: {
          reference: "1 Thessalonians 5:18",
          bookSlug: "1-thessalonians",
          chapterNumber: 5,
          verseSnippet: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
          thematicTakeaway: "Gratitude is not contingent on pleasant weather; it is an unshakeable stance of the redeemed heart.",
        },
        homily: {
          title: "The Sacred Sacrifice of Thanksgiving",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Give thanks for three blessings right now, even if you are facing a trial.",
            "Recognize that gratitude is God's clear, revealed will for your life.",
            "Displace grumbling with intentional praise.",
          ],
          audioScript:
            "Notice Paul says: give thanks *in* all circumstances, not *for* all evil circumstances. Even in the midst of trials, God is good, His mercy endures forever, and His grace is sufficient. Give Him thanks.",
        },
      },
      {
        id: "gratitude-psalm100",
        title: "Enter His Gates with Thanksgiving",
        tag: "Joyful Approach",
        verse: {
          reference: "Psalm 100:4",
          bookSlug: "psalms",
          chapterNumber: 100,
          verseSnippet: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
          thematicTakeaway: "Thanksgiving is the royal key that unlocks the palace gates of God's presence.",
        },
        homily: {
          title: "The Key to the Heavenly Palace",
          preacher: "The Psalmist",
          duration: "2 min",
          practicalTips: [
            "Begin your prayer time with thanksgiving before asking for requests.",
            "Sing or whisper a song of praise as you begin your morning.",
            "Bless His holy name for His eternal goodness.",
          ],
          audioScript:
            "You cannot enter the presence of the King with sour complaints. Thanksgiving is the password that opens the temple gates; praise is the robe that adorns His courts. Enter with joy!",
        },
      },
      {
        id: "gratitude-colossians",
        title: "Let the Peace of Christ Rule, and Be Thankful",
        tag: "Rule of Peace",
        verse: {
          reference: "Colossians 3:15",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet:
            "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
          thematicTakeaway: "A thankful heart creates a serene atmosphere where Christ's peace umpire rules every dispute.",
        },
        homily: {
          title: "The Umpire of Peace and Thanksgiving",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Let peace be the deciding factor when making relational decisions.",
            "Speak words of gratitude to the people in your home and workplace.",
            "Guard against an entitlement mindset that breeds resentment.",
          ],
          audioScript:
            "Paul gives three simple words: 'And be thankful.' Gratitude is the atmosphere in which peace breathes. When you are genuinely thankful, pride, bitterness, and anxiety wither away.",
        },
      },
      {
        id: "gratitude-philippians",
        title: "With Thanksgiving Present Your Requests",
        tag: "Thankful Petitions",
        verse: {
          reference: "Philippians 4:6",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
          thematicTakeaway: "Pair every prayer request with thanksgiving for past mercies and current grace.",
        },
        homily: {
          title: "The Golden Spice of Prayer",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Before asking God for what you lack, thank Him for what He has already provided.",
            "Let gratitude be the foundation upon which you lay your petitions.",
            "Watch anxiety melt as thanksgiving fills your speech.",
          ],
          audioScript:
            "Prayer without thanksgiving is like incense without fire. When you mix thanksgiving with your petitions, you remind your soul of God's track record of faithfulness. Pray with grateful confidence.",
        },
      },
    ],
  },
  {
    id: "humility",
    label: "Humility",
    icon: "🌾",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Walking humbly with God, lowering self to elevate Christ, and tasting true honor.",
    subSections: [
      {
        id: "humility-philippians",
        title: "In Humility Count Others Better",
        tag: "Selfless Regard",
        verse: {
          reference: "Philippians 2:3-4",
          bookSlug: "philippians",
          chapterNumber: 2,
          verseSnippet:
            "Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.",
          thematicTakeaway: "Look to the interests of your neighbors, mirroring the servant heart of Christ.",
        },
        homily: {
          title: "The Lowly Way of Jesus",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Intentionally serve someone who cannot advance your career or social standing.",
            "Listen more than you speak in your next conversation.",
            "Celebrate another's success as if it were your own.",
          ],
          audioScript:
            "Humility is not feeling worthless; it is the freedom of being unconcerned with self-promotion. Value others above yourself, look to their needs, and you will walk in the very footsteps of the Son of God.",
        },
      },
      {
        id: "humility-james",
        title: "Humble Yourselves Before the Lord",
        tag: "Exaltation Promised",
        verse: {
          reference: "James 4:10",
          bookSlug: "james",
          chapterNumber: 4,
          verseSnippet: "Humble yourselves before the Lord, and he will lift you up.",
          thematicTakeaway: "When you take the lowest place before God, He delights to lift you up in His perfect timing.",
        },
        homily: {
          title: "The Lift of the Father's Hand",
          preacher: "Saint James the Just",
          duration: "2 min",
          practicalTips: [
            "Kneel or bow physically in prayer as a sign of inward reverence.",
            "Repent of any self-exalting pride in your thoughts.",
            "Trust God to elevate you when and where He pleases.",
          ],
          audioScript:
            "If you promote yourself, you must defend yourself. But if you humble yourself before the Lord, He becomes your defender and your lifter. Bow low before His majesty, and He will lift you up.",
        },
      },
      {
        id: "humility-proverbs",
        title: "Humility and the Fear of the Lord",
        tag: "Riches, Honor, Life",
        verse: {
          reference: "Proverbs 22:4",
          bookSlug: "proverbs",
          chapterNumber: 22,
          verseSnippet: "Humility is the fear of the Lord; its wages are riches and honor and life.",
          thematicTakeaway: "True spiritual wealth, enduring honor, and vibrant life flow from reverent humility.",
        },
        homily: {
          title: "The True Wages of the Humble",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Fear the Lord with holy awe and reverence.",
            "Seek kingdom riches rather than fleeting worldly accolades.",
            "Walk with integrity and modest self-assessment.",
          ],
          audioScript:
            "The world imagines that aggressive self-assertion wins the prize. Solomon reveals heavenly reality: the reward for humility and the fear of the Lord is true spiritual riches, honor, and life.",
        },
      },
      {
        id: "humility-micah",
        title: "Walk Humbly with Your God",
        tag: "The Core Requirement",
        verse: {
          reference: "Micah 6:8",
          bookSlug: "micah",
          chapterNumber: 6,
          verseSnippet: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
          thematicTakeaway: "God requires three simple, profound marks: justice in actions, love in mercy, and humility in walk.",
        },
        homily: {
          title: "The Walk That Pleases Heaven",
          preacher: "Micah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Act justly in every personal and business encounter.",
            "Love mercy by extending forgiveness without hesitation.",
            "Walk humbly by holding God's hand every step of the day.",
          ],
          audioScript:
            "God does not ask for thousands of rams or rivers of oil. He has shown you what is good: do justice, love mercy, and walk humbly with your God. Hold His hand, step lightly, and walk in grace.",
        },
      },
    ],
  },
  {
    id: "unity",
    label: "Unity",
    icon: "🤝",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Dwelling together in harmony, preserving the bond of peace, and standing as one body in Christ.",
    subSections: [
      {
        id: "unity-psalm133",
        title: "How Good and Pleasant It Is for Brethren to Dwell in Unity",
        tag: "Precious Oil",
        verse: {
          reference: "Psalm 133:1",
          bookSlug: "psalms",
          chapterNumber: 133,
          verseSnippet: "How good and pleasant it is when God's people live together in unity!",
          thematicTakeaway: "Brotherly unity is like the sacred anointing oil that brings God's commanded blessing.",
        },
        homily: {
          title: "The Fragrance of Brotherly Concord",
          preacher: "David the King",
          duration: "2 min",
          practicalTips: [
            "Be a bridge-builder where division or gossip threatens relationships.",
            "Celebrate common ground in Christ rather than minor differences.",
            "Pray for the unity of the global church.",
          ],
          audioScript:
            "Unity is sweet like the fragrant anointing oil running down Aaron's beard, and fresh like the dew of Mount Hermon. For there the Lord bestows His commanded blessing: life forevermore.",
        },
      },
      {
        id: "unity-ephesians",
        title: "Keep the Unity of the Spirit",
        tag: "Bond of Peace",
        verse: {
          reference: "Ephesians 4:3",
          bookSlug: "ephesians",
          chapterNumber: 4,
          verseSnippet: "Make every effort to keep the unity of the Spirit through the bond of peace.",
          thematicTakeaway: "Unity is already created by the Holy Spirit; our responsibility is to eagerly guard it.",
        },
        homily: {
          title: "Guarding the Sacred Bond",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Make 'every effort'—do not give up on reconciliation easily.",
            "Refuse to let personal offense tear the fabric of Christian community.",
            "Speak the truth in love with gentleness.",
          ],
          audioScript:
            "Notice Paul says: 'Make every effort.' Unity requires vigilance, patience, and mutual forbearance. When discord whispers, tighten the bond of peace through prayer and humble love.",
        },
      },
      {
        id: "unity-1corinthians",
        title: "Agree with One Another and Have No Divisions",
        tag: "Same Mind",
        verse: {
          reference: "1 Corinthians 1:10",
          bookSlug: "1-corinthians",
          chapterNumber: 1,
          verseSnippet:
            "I appeal to you, brothers and sisters, in the name of our Lord Jesus Christ, that all of you agree with one another in what you say and that there be no divisions among you, but that you be perfectly united in mind and thought.",
          thematicTakeaway: "Christ is not divided; let the church be united in one heart, mind, and Gospel purpose.",
        },
        homily: {
          title: "One Body, One Lord, One Faith",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Lay aside party factions and petty tribalism.",
            "Focus on the supreme cross of Christ that unifies all believers.",
            "Speak words that build up and harmonize the body.",
          ],
          audioScript:
            "Is Christ divided? Was Paul crucified for you? Put away competitive factions. Be united in the same mind and judgment, exalting the one Lord Jesus Christ above all human personalities.",
        },
      },
      {
        id: "unity-colossians",
        title: "Love Binds All Together",
        tag: "The Perfect Bond",
        verse: {
          reference: "Colossians 3:14",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet: "And over all these virtues put on love, which binds them all together in perfect unity.",
          thematicTakeaway: "Love is the golden cement that unites diverse people into one unshakeable family.",
        },
        homily: {
          title: "The Cement of the Household of God",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Love your fellow believers despite personality quirks or differences.",
            "Pray for unity across denominations and cultures.",
            "Demonstrate to the watching world that we are disciples by our love for one another.",
          ],
          audioScript:
            "Jesus prayed that we might be one as He and the Father are one, so that the world may believe. Love is the bond of perfect unity. Walk in that supernatural love today.",
        },
      },
    ],
  },
  {
    id: "respect",
    label: "Respect & Honor",
    icon: "🤝",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Honoring all people, treating elders with reverence, and outdoing one another in honor.",
    subSections: [
      {
        id: "respect-1peter",
        title: "Show Proper Respect to Everyone",
        tag: "Honoring All",
        verse: {
          reference: "1 Peter 2:17",
          bookSlug: "1-peter",
          chapterNumber: 2,
          verseSnippet: "Show proper respect to everyone, love the family of believers, fear God, honor the emperor.",
          thematicTakeaway: "Every human being bears God's image and is worthy of dignity, respect, and honor.",
        },
        homily: {
          title: "The Image of God in Every Soul",
          preacher: "Simon Peter",
          duration: "2 min",
          practicalTips: [
            "Treat servers, cashiers, and subordinates with genuine dignity.",
            "Love the family of believers with sincere affection.",
            "Fear God above all human powers.",
          ],
          audioScript:
            "Peter wrote under the reign of a hostile Roman emperor, yet he commanded: 'Show proper respect to everyone.' Why? Because every human being is stamped with the image of God. Honor everyone.",
        },
      },
      {
        id: "respect-romans",
        title: "Outdo One Another in Showing Honor",
        tag: "Mutual Honor",
        verse: {
          reference: "Romans 12:10",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet: "Be devoted to one another in love. Honor one another above yourselves.",
          thematicTakeaway: "Engage in holy competition: seek to be the first to honor and elevate your brother.",
        },
        homily: {
          title: "The Holy Contest of Honor",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Publicly praise someone else's contribution before highlighting your own.",
            "Show brotherly devotion with warm, sincere affection.",
            "Honor others above yourself in practical decisions.",
          ],
          audioScript:
            "The world competes to see who can claim the highest seat. The church competes in reverse: who can outdo one another in showing honor! Elevate your brother, celebrate your sister, and honor Christ.",
        },
      },
      {
        id: "respect-philippians",
        title: "In Humility Value Others Above Yourselves",
        tag: "Preferring Others",
        verse: {
          reference: "Philippians 2:3",
          bookSlug: "philippians",
          chapterNumber: 2,
          verseSnippet: "Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.",
          thematicTakeaway: "Respect is born when you genuinely view others as worthy of dignity and service.",
        },
        homily: {
          title: "Dethroning Vain Conceit",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Check your motives: are you looking to impress or to serve?",
            "Treat others as more significant than your personal convenience.",
            "Reflect the humble respect modeled by Jesus Christ.",
          ],
          audioScript:
            "Selfish ambition and vain conceit destroy respect. But when you look through the eyes of Jesus, you see eternal souls of infinite value. Value others above yourself.",
        },
      },
      {
        id: "respect-leviticus",
        title: "Stand Up in the Presence of the Aged",
        tag: "Reverence for Elders",
        verse: {
          reference: "Leviticus 19:32",
          bookSlug: "leviticus",
          chapterNumber: 19,
          verseSnippet: "Stand up in the presence of the aged, show respect for the elderly and revere your God. I am the Lord.",
          thematicTakeaway: "Honoring the elderly is a sacred reflection of your reverence for the Eternal God.",
        },
        homily: {
          title: "The Crown of Gray Hair",
          preacher: "Moses",
          duration: "2 min",
          practicalTips: [
            "Show honor and patient attention to aging parents and grandparents.",
            "Offer your seat or assistance to the elderly with reverence.",
            "Remember that respecting the aged is linked directly to revering God.",
          ],
          audioScript:
            "God ties respect for the elderly directly to the fear of His holy name: 'Stand up in the presence of the aged, show respect for the elderly, and revere your God.' Honor those whose years have borne the heat of the day.",
        },
      },
    ],
  },
  {
    id: "harmony",
    label: "Harmony",
    icon: "🎶",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Pursuing concord, associating with the lowly, and walking in sweet symphonic fellowship.",
    subSections: [
      {
        id: "harmony-romans12-16",
        title: "Live in Harmony with One Another",
        tag: "Lowly Association",
        verse: {
          reference: "Romans 12:16",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet: "Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited.",
          thematicTakeaway: "Harmony flourishes when haughty superiority is abandoned in favor of sweet communion.",
        },
        homily: {
          title: "The Symphony of Lowly Concord",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Do not chase after elitist status or climb social ladders.",
            "Sit and eat with people of low social position with genuine joy.",
            "Refuse all inward conceit and arrogance.",
          ],
          audioScript:
            "Like musical notes of different pitches blending into one majestic chord, Christians are called to live in harmony. Do not be haughty, but associate with the humble. In that lowliness, true harmony is born.",
        },
      },
      {
        id: "harmony-1peter",
        title: "All of You, Be Like-Minded and Sympathetic",
        tag: "Mutual Sympathy",
        verse: {
          reference: "1 Peter 3:8",
          bookSlug: "1-peter",
          chapterNumber: 3,
          verseSnippet: "Finally, all of you, be like-minded, be sympathetic, love one another, be compassionate and humble.",
          thematicTakeaway: "Symphonic community requires shared sympathy, brotherly affection, and tender humility.",
        },
        homily: {
          title: "The Fivefold Harmony of Peter",
          preacher: "Simon Peter",
          duration: "2 min",
          practicalTips: [
            "Weep with those who weep, and rejoice with those who rejoice.",
            "Practice empathy by entering into another's sorrow.",
            "Maintain an humble, compassionate spirit in your home.",
          ],
          audioScript:
            "Peter summarizes Christian living: be like-minded, sympathetic, loving as brothers, tenderhearted, and humble. When these five chords resonate, your home and church become an outpost of heaven's harmony.",
        },
      },
      {
        id: "harmony-romans14-19",
        title: "Pursue What Leads to Peace",
        tag: "Mutual Upbuilding",
        verse: {
          reference: "Romans 14:19",
          bookSlug: "romans",
          chapterNumber: 14,
          verseSnippet: "Let us therefore make every effort to do what leads to peace and to mutual edification.",
          thematicTakeaway: "Harmony does not happen by chance; it is actively pursued through mutual upbuilding.",
        },
        homily: {
          title: "Building Up the Living Stones",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Ask before speaking: 'Will this build up peace, or spark unnecessary controversy?'",
            "Avoid squabbling over non-essential opinions and dietary choices.",
            "Be an intentional builder of harmony in your community.",
          ],
          audioScript:
            "Paul urges us: pursue the things that make for peace and the building up of one another. Put down the sledgehammer of criticism; pick up the trowel of edification and build one another up in Christ.",
        },
      },
      {
        id: "harmony-2corinthians",
        title: "Aim for Perfection, Agree with One Another",
        tag: "God of Peace with You",
        verse: {
          reference: "2 Corinthians 13:11",
          bookSlug: "2-corinthians",
          chapterNumber: 13,
          verseSnippet:
            "Finally, brothers and sisters, rejoice! Strive for full restoration, encourage one another, be of one mind, live in peace. And the God of love and peace will be with you.",
          thematicTakeaway: "When you pursue restoration and peace, the God of love and peace makes His dwelling with you.",
        },
        homily: {
          title: "The Final Apostolic Benediction",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Rejoice in the Lord always.",
            "Encourage one person specifically today.",
            "Live in peace, and expect God's presence to rest upon your household.",
          ],
          audioScript:
            "Paul's farewell blessing to the Corinthians is a masterpiece: 'Rejoice, strive for restoration, encourage one another, be of one mind, live in peace.' And the God of love and peace will be with you.",
        },
      },
    ],
  },
  {
    id: "understanding",
    label: "Understanding",
    icon: "💡",
    category: "emotions",
    categoryLabel: "Core Human Emotions & Spiritual Insights",
    summary: "Seeking spiritual discernment, opening the eyes of the heart, and asking for a wise mind.",
    subSections: [
      {
        id: "understanding-proverbs4",
        title: "Though It Cost All You Have, Get Understanding",
        tag: "Supreme Pursuit",
        verse: {
          reference: "Proverbs 4:7",
          bookSlug: "proverbs",
          chapterNumber: 4,
          verseSnippet: "The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.",
          thematicTakeaway: "Understanding is worth more than all earthly assets; prize it above gold.",
        },
        homily: {
          title: "The Treasure of Understanding",
          preacher: "Solomon the Wise",
          duration: "2 min",
          practicalTips: [
            "Invest time in studying God's Word deeply.",
            "Do not settle for superficial soundbites; pursue deep understanding.",
            "Let divine insight govern your life decisions.",
          ],
          audioScript:
            "Solomon tells his sons: wisdom is supreme, therefore get wisdom; though it cost all your goods, get understanding! When you possess spiritual understanding, you walk in safety and your foot will not stumble.",
        },
      },
      {
        id: "understanding-proverbs3",
        title: "Do Not Lean on Your Own Understanding",
        tag: "Surrender",
        verse: {
          reference: "Proverbs 3:5",
          bookSlug: "proverbs",
          chapterNumber: 3,
          verseSnippet: "Trust in the Lord with all your heart and lean not on your own understanding.",
          thematicTakeaway: "True understanding begins when you recognize the limits of your own human reasoning.",
        },
        homily: {
          title: "The Finite and the Infinite",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Acknowledge God's infinite wisdom above your limited vantage point.",
            "Submit your doubts and plans to the Lord in prayer.",
            "Rest in the guidance of the Holy Spirit.",
          ],
          audioScript:
            "Human reasoning is like a candle in a cavern; God's understanding is the blazing sun. Do not lean on your own fragile candle. Step out into the radiant daylight of God's wisdom.",
        },
      },
      {
        id: "understanding-psalm119",
        title: "The Unfolding of Your Words Gives Light",
        tag: "Illuminated Mind",
        verse: {
          reference: "Psalm 119:130",
          bookSlug: "psalms",
          chapterNumber: 119,
          verseSnippet: "The unfolding of your words gives light; it gives understanding to the simple.",
          thematicTakeaway: "God's Word imparts supernatural understanding even to the simple and uneducated.",
        },
        homily: {
          title: "The Unfolding of Holy Light",
          preacher: "The Psalmist",
          duration: "2 min",
          practicalTips: [
            "Read Scripture with an open, teachable spirit.",
            "Ask the Holy Spirit to unfold the passage to your understanding.",
            "Let biblical light illuminate your moral conscience.",
          ],
          audioScript:
            "When the Scriptures are unfolded by the Holy Spirit, light floods the human mind. The simple become wise; the confused receive direction. Open the sacred pages, and let His understanding illuminate your soul.",
        },
      },
      {
        id: "understanding-1kings",
        title: "Solomon's Prayer for a Discerning Heart",
        tag: "The Listening Heart",
        verse: {
          reference: "1 Kings 3:9",
          bookSlug: "1-kings",
          chapterNumber: 3,
          verseSnippet: "So give your servant a discerning heart to govern your people and to distinguish between right and wrong. For who is able to govern this great people of yours?",
          thematicTakeaway: "When given any wish by God, Solomon asked for a listening heart to discern right from wrong.",
        },
        homily: {
          title: "The Prayer That Pleased God",
          preacher: "Solomon at Gibeon",
          duration: "2 min",
          practicalTips: [
            "Pray: 'Lord, give me a listening, discerning heart.'",
            "Seek wisdom to discern right from wrong in complex ethical dilemmas.",
            "Use your understanding to serve and bless others.",
          ],
          audioScript:
            "God asked young Solomon: 'Ask what I shall give you.' Solomon did not ask for long life, wealth, or the death of enemies; he asked for an understanding heart to discern justice. That prayer delighted heaven.",
        },
      },
    ],
  },

  // =========================================================================
  // CATEGORY 4: PHILOSOPHICAL & SPIRITUAL CONCEPTS
  // =========================================================================
  {
    id: "righteousness",
    label: "Righteousness",
    icon: "⚖️",
    category: "philosophical",
    categoryLabel: "Philosophical & Spiritual Concepts",
    summary: "Walking in covenant justice, total life consecration, and the imputed righteousness of Christ.",
    subSections: [
      {
        id: "righteousness-micah",
        title: "Do Justly, Love Mercy, Walk Humbly",
        tag: "The Triad of Righteousness",
        verse: {
          reference: "Micah 6:8",
          bookSlug: "micah",
          chapterNumber: 6,
          verseSnippet: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
          thematicTakeaway: "True righteousness is not cold legalism, but a living harmony of justice, mercy, and humility.",
        },
        homily: {
          title: "The Divine Triad of Righteousness",
          preacher: "Micah the Prophet",
          duration: "2 min",
          practicalTips: [
            "Practice justice in your speech, billing, and relationships.",
            "Delight in showing mercy rather than demanding harsh vengeance.",
            "Walk in daily, humble communion with God.",
          ],
          audioScript:
            "God strips away all external religious hypocrisy through Micah. What does the Lord require of you? To act justly, to love mercy, and to walk humbly with your God. That is true, living righteousness.",
        },
      },
      {
        id: "righteousness-ecclesiastes",
        title: "The Whole Duty of Man",
        tag: "Fear God & Keep His Commandments",
        verse: {
          reference: "Ecclesiastes 12:13",
          bookSlug: "ecclesiastes",
          chapterNumber: 12,
          verseSnippet: "Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments, for this is the duty of all mankind.",
          thematicTakeaway: "After exploring every earthly vanity, the conclusion of wisdom is reverent obedience to God.",
        },
        homily: {
          title: "The Conclusion of the Matter",
          preacher: "The Preacher (Qoheleth)",
          duration: "2 min",
          practicalTips: [
            "Let the fear of the Lord anchor your soul in an age of confusion.",
            "Obey God's moral commandments with joyful integrity.",
            "Remember that every secret deed will be evaluated in the light of eternity.",
          ],
          audioScript:
            "Solomon tested wealth, pleasure, architecture, and fame, finding them all vanity and chasing after wind. His final conclusion: 'Fear God and keep His commandments, for this is the whole duty of man.' Rest in that truth.",
        },
      },
      {
        id: "righteousness-romans",
        title: "Your Reasonable Service of Worship",
        tag: "Living Sacrifice",
        verse: {
          reference: "Romans 12:1",
          bookSlug: "romans",
          chapterNumber: 12,
          verseSnippet: "I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
          thematicTakeaway: "Righteousness means placing your whole life, mind, and body onto God's altar of service.",
        },
        homily: {
          title: "The Altar of Righteous Devotion",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Present your body each morning to God as an instrument of righteousness.",
            "Do not conform to the selfish patterns of the world.",
            "Be transformed by the renewing of your mind.",
          ],
          audioScript:
            "In view of the magnificent mercies of God in Romans, Paul gives the only logical response: present your bodies as a living sacrifice. Let every breath, thought, and deed be consecrated to Christ.",
        },
      },
      {
        id: "righteousness-ephesians",
        title: "Walking Worthy of Your Calling",
        tag: "Vocation & Calling",
        verse: {
          reference: "Ephesians 4:1",
          bookSlug: "ephesians",
          chapterNumber: 4,
          verseSnippet: "As a prisoner for the Lord, then, I urge you to live a life worthy of the calling you have received.",
          thematicTakeaway: "Righteous living means matching your daily footsteps to the celestial dignity of your calling in Christ.",
        },
        homily: {
          title: "Walking in Celestial Dignity",
          preacher: "Saint Paul from Prison",
          duration: "2 min",
          practicalTips: [
            "Remember your identity as a chosen, adopted child of God.",
            "Walk with all humility, gentleness, and patience.",
            "Bear with one another in love.",
          ],
          audioScript:
            "Paul, writing in chains from Rome, urges you: 'Walk worthy of the calling to which you have been called.' You are royalty in the kingdom of God. Walk with the humility, dignity, and righteousness befitting a prince of heaven.",
        },
      },
    ],
  },
  {
    id: "detachment",
    label: "Detachment & Spiritual Freedom",
    icon: "🕊️",
    category: "philosophical",
    categoryLabel: "Philosophical & Spiritual Concepts",
    summary: "Releasing worldly dependency, counting all loss compared to knowing Christ, and living unentangled.",
    subSections: [
      {
        id: "detachment-1john",
        title: "The World Passes Away",
        tag: "Transience of World",
        verse: {
          reference: "1 John 2:15",
          bookSlug: "1-john",
          chapterNumber: 2,
          verseSnippet: "Do not love the world or anything in the world. If anyone loves the world, love for the Father is not in them.",
          thematicTakeaway: "Holy detachment from worldly applause and transient comforts makes room for the Father's love.",
        },
        homily: {
          title: "Holy Detachment from the Shadows",
          preacher: "Saint John the Beloved",
          duration: "2 min",
          practicalTips: [
            "Hold possessions with an open hand, viewing yourself as a steward, not an owner.",
            "Recognize the temporary nature of earthly systems.",
            "Center your ultimate joy in the Father's eternal love.",
          ],
          audioScript:
            "Detachment is not stoic hatred of creation, but recognizing that creation cannot be your god. Do not love the world or the things in the world. Set your heart on the Eternal Fountain, and you will never thirst again.",
        },
      },
      {
        id: "detachment-matthew",
        title: "Where Neither Moth Nor Rust Destroys",
        tag: "Incorruptible Treasure",
        verse: {
          reference: "Matthew 6:19-20",
          bookSlug: "matthew",
          chapterNumber: 6,
          verseSnippet: "Do not store up for yourselves treasures on earth, where moths and vermin destroy, and where thieves break in and steal. But store up for yourselves treasures in heaven.",
          thematicTakeaway: "True detachment frees you from the terror of losing material wealth by investing in heaven.",
        },
        homily: {
          title: "The Freedom of the Unburdened Soul",
          preacher: "Saint Francis of Assisi",
          duration: "2 min",
          practicalTips: [
            "Practice voluntary simplicity in your lifestyle.",
            "Give away surplus possessions to lighten your soul's load.",
            "Rejoice in the treasures that no thief or moth can touch.",
          ],
          audioScript:
            "When Francis of Assisi renounced his wealthy father's inheritance, he walked into the snow singing praises to God. Why? Because the soul detached from earthly clutter is light as a bird, soaring into the joy of the Lord.",
        },
      },
      {
        id: "detachment-colossians",
        title: "Minds on Things Above, Not Earthly Shadows",
        tag: "Heavenly Focus",
        verse: {
          reference: "Colossians 3:2",
          bookSlug: "colossians",
          chapterNumber: 3,
          verseSnippet: "Set your minds on things above, not on earthly things.",
          thematicTakeaway: "Direct your affections toward the risen Christ, and earthly idols lose their captivating grip.",
        },
        homily: {
          title: "Looking Past the Horizon",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Evaluate daily worries in the light of eternal resurrection.",
            "Refuse to let earthly drama dictate your spiritual state.",
            "Rest in the knowledge that your life is hidden with Christ in God.",
          ],
          audioScript:
            "If you have been raised with Christ, seek the things that are above! When you set your mind on heavenly realities, the glitter of earthly trinkets fades into shadow. Walk in spiritual liberty.",
        },
      },
      {
        id: "detachment-philippians",
        title: "Counting All Things as Loss for Christ",
        tag: "The Surpassing Worth",
        verse: {
          reference: "Philippians 3:8",
          bookSlug: "philippians",
          chapterNumber: 3,
          verseSnippet: "What is more, I consider everything a loss because of the surpassing worth of knowing Christ Jesus my Lord, for whose sake I have lost all things. I consider them garbage, that I may gain Christ.",
          thematicTakeaway: "When you discover the pearl of great price in Jesus, parting with everything else is pure joy.",
        },
        homily: {
          title: "The Pearl of Great Price",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "View pedigree, credentials, and achievements as loss compared to knowing Christ.",
            "Celebrate that losing worldly idols means gaining Jesus.",
            "Press forward to take hold of that for which Christ took hold of you.",
          ],
          audioScript:
            "Paul had pedigree, prestige, and religious authority. Yet he declared: 'I count all things as loss for the surpassing worth of knowing Christ Jesus my Lord.' To gain Christ is to inherit everything.",
        },
      },
    ],
  },
  {
    id: "enlightenment",
    label: "Enlightenment & Spiritual Awakening",
    icon: "✨",
    category: "philosophical",
    categoryLabel: "Philosophical & Spiritual Concepts",
    summary: "Having the eyes of your heart enlightened, walking in the light of life, and awakened understanding.",
    subSections: [
      {
        id: "enlightenment-ephesians",
        title: "The Eyes of Your Heart Enlightened",
        tag: "Spiritual Vision",
        verse: {
          reference: "Ephesians 1:18",
          bookSlug: "ephesians",
          chapterNumber: 1,
          verseSnippet:
            "I pray that the eyes of your heart may be enlightened in order that you may know the hope to which he has called you, the riches of his glorious inheritance in his holy people.",
          thematicTakeaway: "Christian awakening is when the Holy Spirit opens the inner eye of your heart to behold God's glory.",
        },
        homily: {
          title: "The Opening of the Inward Eye",
          preacher: "Saint Gregory of Nyssa",
          duration: "2 min",
          practicalTips: [
            "Pray Ephesians 1:18 over your spiritual life daily.",
            "Ask the Holy Spirit to open the eyes of your understanding.",
            "Behold the glorious inheritance prepared for God's saints.",
          ],
          audioScript:
            "The physical eye sees only material shapes and shadows. But Paul prays for the eyes of your heart to be flooded with divine light! May you perceive the unsearchable riches and the hope to which you have been called.",
        },
      },
      {
        id: "enlightenment-psalm119",
        title: "A Lamp Unto My Feet, a Light on My Path",
        tag: "Illuminated Path",
        verse: {
          reference: "Psalm 119:105",
          bookSlug: "psalms",
          chapterNumber: 119,
          verseSnippet: "Your word is a lamp for my feet, a light on my path.",
          thematicTakeaway: "God's Word dispels the shadows of ignorance and illuminates every step of your journey.",
        },
        homily: {
          title: "The Radiant Lamp of Truth",
          preacher: "Saint Athanasius",
          duration: "2 min",
          practicalTips: [
            "Read Scripture before facing challenging decisions.",
            "Let biblical truth expose lies and cultural deceptions.",
            "Walk confidently in the light of His Word.",
          ],
          audioScript:
            "In an age of moral darkness, God's Word is an unquenchable torch. It does not lead into speculative confusion; it illuminates the path beneath your feet. Walk in His light and you will not stumble.",
        },
      },
      {
        id: "enlightenment-2corinthians",
        title: "Light Shining Out of Darkness",
        tag: "The Light of Knowledge",
        verse: {
          reference: "2 Corinthians 4:6",
          bookSlug: "2-corinthians",
          chapterNumber: 4,
          verseSnippet:
            "For God, who said, 'Let light shine out of darkness,' made his light shine in our hearts to give us the light of the knowledge of God's glory displayed in the face of Christ.",
          thematicTakeaway: "The same Creator who commanded physical light at creation now shines in human hearts through Jesus.",
        },
        homily: {
          title: "The Dawn in the Human Heart",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Gaze upon the face of Jesus through the Gospels.",
            "Rejoice that God has commanded light to banish darkness in your soul.",
            "Reflect His radiant glory to those walking in spiritual blindness.",
          ],
          audioScript:
            "The same voice that spoke into the cosmic abyss, 'Let there be light,' has shone into your heart! The glory of the infinite God is unveiled in the tender, loving face of Jesus Christ. Live in that glorious dawn.",
        },
      },
      {
        id: "enlightenment-john8",
        title: "I Am the Light of the World",
        tag: "Light of Life",
        verse: {
          reference: "John 8:12",
          bookSlug: "john",
          chapterNumber: 8,
          verseSnippet:
            "When Jesus spoke again to the people, he said, 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.'",
          thematicTakeaway: "Following Christ guarantees that you will never walk in darkness; you possess the light of life.",
        },
        homily: {
          title: "The Sun of Righteousness",
          preacher: "Jesus in the Temple",
          duration: "2 min",
          practicalTips: [
            "Follow Jesus closely in daily obedience.",
            "Reject all works of darkness and deception.",
            "Let His light illuminate your relationships, work, and thoughts.",
          ],
          audioScript:
            "Jesus stood in the temple courts illuminated by giant candelabra and proclaimed: 'I am the light of the world. Whoever follows Me will never walk in darkness, but will have the light of life.' Step out of shadows into His light.",
        },
      },
    ],
  },
  {
    id: "acceptance",
    label: "Acceptance & Surrender",
    icon: "🤲",
    category: "philosophical",
    categoryLabel: "Philosophical & Spiritual Concepts",
    summary: "Embracing God's sovereign providence, learning contentment in all states, and letting go of control.",
    subSections: [
      {
        id: "acceptance-romans",
        title: "God Works All Things for Good",
        tag: "Sovereign Trust",
        verse: {
          reference: "Romans 8:28",
          bookSlug: "romans",
          chapterNumber: 8,
          verseSnippet: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          thematicTakeaway: "Acceptance is not fatalistic resignation; it is the confident trust that God redeems every circumstance.",
        },
        homily: {
          title: "The Redemptive Weaving of God",
          preacher: "Saint Augustine",
          duration: "2 min",
          practicalTips: [
            "Accept unexpected setbacks as part of God's redemptive school of character.",
            "Affirm that God is good even when circumstances are painful.",
            "Rest in the assurance of your calling.",
          ],
          audioScript:
            "Acceptance is resting in the knowledge that nothing touches your life without passing through the sovereign hands of God. He works all things—even thorns and storms—together for your ultimate, eternal good.",
        },
      },
      {
        id: "acceptance-philippians",
        title: "I Have Learned the Secret of Contentment",
        tag: "Holy Contentment",
        verse: {
          reference: "Philippians 4:11-12",
          bookSlug: "philippians",
          chapterNumber: 4,
          verseSnippet:
            "I have learned to be content whatever the circumstances. I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation, whether well fed or hungry, whether living in plenty or in want.",
          thematicTakeaway: "Contentment is not a natural instinct; it is a learned spiritual grace anchored in Christ's sufficiency.",
        },
        homily: {
          title: "The Mystery of Contentment",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Stop waiting for circumstances to be perfect before choosing to be content.",
            "Practice accepting financial abundance and financial scarcity with equal grace.",
            "Draw your satisfaction from the indwelling presence of Christ.",
          ],
          audioScript:
            "Notice Paul says: 'I have learned.' Contentment did not fall on him by magic. He learned it in shipwrecks, stonings, and feast days. Christ was his sufficiency in every state. Discover that same secret today.",
        },
      },
      {
        id: "acceptance-proverbs",
        title: "In Their Hearts Humans Plan Their Course",
        tag: "The Lord Establishes",
        verse: {
          reference: "Proverbs 16:9",
          bookSlug: "proverbs",
          chapterNumber: 16,
          verseSnippet: "In their hearts humans plan their course, but the Lord establishes their steps.",
          thematicTakeaway: "Plan with diligence, but surrender every outcome to the wise direction of the Lord.",
        },
        homily: {
          title: "Accepting the Divine Course Correction",
          preacher: "Solomon",
          duration: "2 min",
          practicalTips: [
            "Make wise plans, but hold them with open hands.",
            "Accept divine interruptions as appointments of mercy.",
            "Trust that God's redirection is always better than your original map.",
          ],
          audioScript:
            "We map out our route, but the Lord establishes our steps. When God redirects your journey, do not kick against the goads. Accept His steering; He sees what lies ten miles ahead.",
        },
      },
      {
        id: "acceptance-job",
        title: "Shall We Accept Good from God, and Not Trouble?",
        tag: "Faith in the Dark",
        verse: {
          reference: "Job 2:10",
          bookSlug: "job",
          chapterNumber: 2,
          verseSnippet: "He replied, 'You are talking like a foolish woman. Shall we accept good from God, and not trouble?' In all this, Job did not sin in what he said.",
          thematicTakeaway: "True faith loves God for who He is, not merely for the pleasant gifts in His hands.",
        },
        homily: {
          title: "The Unconditional Faith of Job",
          preacher: "Saint Gregory the Great",
          duration: "2 min",
          practicalTips: [
            "Do not love God only when the sun shines; worship Him in the storm.",
            "Refuse to charge God with foolishness or wrongdoing.",
            "Trust that Job's story ended with double restoration, and God is faithful.",
          ],
          audioScript:
            "Job sat in the ashes, having lost children, wealth, and health. Yet he proclaimed: 'Shall we receive good at the hand of God, and not trouble?' That is the bedrock of holy acceptance. Even in tears, worship the Lord.",
        },
      },
    ],
  },
  {
    id: "freedom",
    label: "Freedom & Liberty",
    icon: "🕊️",
    category: "philosophical",
    categoryLabel: "Philosophical & Spiritual Concepts",
    summary: "Breaking the yoke of slavery, walking in the truth that sets you free, and holy liberty.",
    subSections: [
      {
        id: "freedom-galatians",
        title: "It Is for Freedom that Christ Has Set Us Free",
        tag: "Unshakable Liberty",
        verse: {
          reference: "Galatians 5:1",
          bookSlug: "galatians",
          chapterNumber: 5,
          verseSnippet: "It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.",
          thematicTakeaway: "Christ did not liberate you from sin so you could return to legalistic bondage; stand firm in His liberty.",
        },
        homily: {
          title: "The Charter of Christian Freedom",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Refuse to fall back into legalistic guilt or people-pleasing.",
            "Use your freedom not as an indulgence for the flesh, but to serve one another in love.",
            "Stand firm in the finished work of Christ.",
          ],
          audioScript:
            "Hear the emancipation proclamation of the New Testament: 'It is for freedom that Christ has set us free!' Stand firm. Do not submit again to any yoke of slavery—whether of sin, legalism, or human approval.",
        },
      },
      {
        id: "freedom-john",
        title: "If the Son Sets You Free, You Are Free Indeed",
        tag: "True Freedom",
        verse: {
          reference: "John 8:36",
          bookSlug: "john",
          chapterNumber: 8,
          verseSnippet: "So if the Son sets you free, you will be free indeed.",
          thematicTakeaway: "Human laws can grant civil liberty, but only Jesus Christ can shatter the internal chains of sin and death.",
        },
        homily: {
          title: "Free Indeed in the Son",
          preacher: "Jesus",
          duration: "2 min",
          practicalTips: [
            "Declare: 'I am free indeed in Christ Jesus.'",
            "Break agreement with addictions, shame, and compulsive habits.",
            "Live in the glorious liberty of the children of God.",
          ],
          audioScript:
            "The world offers political freedom, but the human heart remains enslaved to fear and sin. But Jesus declares: 'If the Son sets you free, you will be free indeed!' Walk in the reality of your total liberation.",
        },
      },
      {
        id: "freedom-2corinthians",
        title: "Where the Spirit of the Lord Is, There Is Freedom",
        tag: "Liberty in the Spirit",
        verse: {
          reference: "2 Corinthians 3:17",
          bookSlug: "2-corinthians",
          chapterNumber: 3,
          verseSnippet: "Now the Lord is the Spirit, and where the Spirit of the Lord is, there is freedom.",
          thematicTakeaway: "The Holy Spirit brings an atmosphere of liberation from shame, veil, and condemnation.",
        },
        homily: {
          title: "The Unveiled Face",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Approach God with an open, unveiled face in prayer.",
            "Welcome the presence of the Holy Spirit into your room.",
            "Be transformed into His image from glory to glory.",
          ],
          audioScript:
            "Where the Spirit of the Lord is, there is freedom! No heavy veil of separation, no trembling before Sinai's thunder. In the Spirit, we look with unveiled faces upon the glory of the Lord and are transformed.",
        },
      },
      {
        id: "freedom-romans",
        title: "Set Free from Sin, Slaves to Righteousness",
        tag: "Holy Consecration",
        verse: {
          reference: "Romans 6:18",
          bookSlug: "romans",
          chapterNumber: 6,
          verseSnippet: "You have been set free from sin and have become slaves to righteousness.",
          thematicTakeaway: "True freedom is not license to do evil; it is the joyful liberation to love, obey, and do what is good.",
        },
        homily: {
          title: "The Liberty of Righteousness",
          preacher: "Saint Paul",
          duration: "2 min",
          practicalTips: [
            "Offer your members as instruments of righteousness to God.",
            "Rejoice that sin no longer has dominion over your life.",
            "Walk in the holiness whose end is eternal life.",
          ],
          audioScript:
            "To be free from sin does not mean living in lawless chaos. It means you are liberated from the tyranny of evil to serve the God of righteousness. That service is perfect freedom and everlasting joy.",
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

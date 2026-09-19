import type { ImageAspectRatio, QuestionImageInstruction, QuizImageConfig } from "../types";

export interface ResolvedImagePrompt {
  fullPrompt: string;
  negativePrompt: string;
  aspectRatio: ImageAspectRatio;
}

export interface QuizImageInstructionEntry {
  quizSlug: string;
  category: string;
  imageConfig?: QuizImageConfig;
  questions: Array<{
    qIndex: number; // 1-based index
    instruction: QuestionImageInstruction;
  }>;
}

/**
 * Category-level baseline artistic directions
 */
export const CATEGORY_STYLE_PRESETS: Record<string, string> = {
  bible:
    "Dramatic classical oil painting, chiaroscuro lighting, rich textures, historic biblical reverence, fine art masterpiece, Rembrandt and Caravaggio inspired, museum quality, epic composition, dignified rendering",
  history:
    "Historical realism, classical oil painting on canvas, period-accurate costume and architecture, dramatic atmosphere, museum quality fine art",
  survival:
    "High-resolution outdoor documentary photography, rugged wilderness, National Geographic aesthetic, natural sunlight, authentic survival gear, rich natural contrast",
  science:
    "High-detail 3D scientific visualization, educational render, vivid illumination, depth of field, Octane render aesthetic, clean cinematic composition",
  food:
    "Exquisite culinary food photography, shallow depth of field, warm ambient lighting, Michelin-star presentation, appetizing textures, editorial magazine quality",
  geography:
    "Spectacular wide-angle landscape photography, golden hour sunlight, National Geographic panoramic view, breathtaking natural scenery, ultra-high dynamic range",
  sports:
    "Dynamic sports action photography, high shutter speed, frozen motion, dramatic stadium lighting, emotional intensity",
  cars:
    "Commercial automotive photography, sleek reflections, dramatic lighting, sharp metallic finishes, wide angle",
  diy:
    "Clean workshop and craftsman photography, warm natural workshop lighting, detailed tools and materials, authentic craftsmanship",
  entertainment:
    "Cinematic production still, 35mm film grain, moody atmospheric lighting, widescreen composition",
};

/**
 * Category-specific negative prompts to avoid modern artifacts or unwanted styles
 */
export const CATEGORY_NEGATIVE_PROMPTS: Record<string, string> = {
  bible:
    "watermark, text, signature, low quality, blurry, modern clothing, sunglasses, modern buildings, cartoon, anime, cars, electricity, wristwatches, plastic, modern artifacts",
  history:
    "watermark, text, signature, modern artifacts, cars, phones, wristwatches, cartoon, anime, low quality, neon",
  survival:
    "watermark, text, cartoon, anime, studio backdrop, blurry, low resolution, indoor setting, messy digital artifacts",
  food:
    "watermark, text, dirty plates, unappetizing, moldy, cartoon, blurry, low quality, messy background, plastic packaging",
  science:
    "watermark, text, bad anatomy, cartoon, blurry, distorted, low quality, low resolution",
  default:
    "watermark, text, signature, blurry, low quality, cartoon, anime, bad anatomy, low resolution, artifacts",
};

/**
 * Centralized registry of quiz image instructions.
 * Add instructions for any quiz here to control exact prompts, composition, and styling.
 */
export const QUIZ_IMAGE_INSTRUCTIONS: Record<string, QuizImageInstructionEntry> = {
  "look-at-the-picture-bible": {
    quizSlug: "look-at-the-picture-bible",
    category: "bible",
    imageConfig: {
      stylePreset: "bible",
      aspectRatio: "16:9",
      negativePrompt:
        "watermark, text, signature, low quality, blurry, modern clothing, sunglasses, modern buildings, cartoon, anime, electricity, wristwatches",
    },
    questions: [
      {
        qIndex: 1,
        instruction: {
          subject:
            "The prophet Daniel standing with serene, prayerful dignity in an ancient Babylon underground stone lion den, surrounded by several relaxed, majestic resting lions with gentle expressions",
          composition:
            "Medium-wide shot centered on Daniel, flanked by resting lions, framed by heavy Babylonian carved stone pillars",
          lighting:
            "A single divine beam of warm celestial sunlight streaming down from an opening above, casting strong chiaroscuro highlights on Daniel while deep shadows fill the cavern",
        },
      },
      {
        qIndex: 2,
        instruction: {
          subject:
            "Noah's colossal dark timber ark resting securely on the rugged, snow-dusted rocky crest of Mount Ararat after the deluge, with a pure white dove carrying a green olive leaf soaring in the foreground sky",
          composition:
            "Grand panoramic landscape view from an adjacent ridge, capturing the scale of the ancient vessel atop the mountain peak",
          lighting:
            "Morning golden sunrise breaking through misty receding storm clouds, illuminating a soft vibrant rainbow spanning the distant valley below",
        },
      },
      {
        qIndex: 3,
        instruction: {
          subject:
            "Moses in weathered ancient desert robes having removed his leather sandals, kneeling in holy awe before an ancient desert acacia bush that burns with intense golden divine fire without being consumed or charred",
          composition:
            "Low-angle dramatic perspective with Moses in the foreground and the luminous burning bush commanding the frame against the rocky terrain of Mount Sinai",
          lighting:
            "Vibrant golden-orange holy fire casting dramatic warm highlights across the desert rocks and Moses' face, contrasting with the deep purple dusk sky",
        },
      },
      {
        qIndex: 4,
        instruction: {
          subject:
            "Moses in billowing desert mantle standing atop a shoreline rock with wooden staff raised high toward heaven, miraculously parting the waters of the Red Sea into towering glassy walls of standing water with a dry sandy seabed pathway between them",
          composition:
            "Wide epic cinematic composition looking through the massive canyon of held-back ocean waters, with distant silhouettes of the Hebrew people beginning their crossing",
          lighting:
            "A divine pillar of celestial light piercing through dark tempestuous storm clouds, illuminating the dry seabed and translucent turquoise waves",
        },
      },
      {
        qIndex: 5,
        instruction: {
          subject:
            "Young shepherd David in a simple rustic wool tunic holding a leather shepherd sling and smooth stones, stepping courageously forward to confront the colossal armored Philistine warrior Goliath brandishing an iron spear and bronze shield",
          composition:
            "Dynamic ground-level shot looking upward from behind David towards the towering, menacing figure of Goliath across the dry Valley of Elah",
          lighting:
            "High noon Mediterranean sun casting crisp, long shadows across the chalky earth, with dry dust stirred up by the wind",
        },
      },
      {
        qIndex: 6,
        instruction: {
          subject:
            "The pristine lush Garden of Eden at the dawn of creation, with the magnificent radiant Tree of Life bearing luminous golden fruit beside a crystalline river parting into four tranquil streams, surrounded by gentle peaceful wildlife and flourishing exotic flora",
          composition:
            "Wide panoramic establishing shot of paradise with majestic ancient cedar and fruit trees flanking a glowing central sanctuary",
          lighting:
            "Warm golden ethereal morning light filtering through lush canopy foliage creating soft rays of light onto the tranquil riverbank",
        },
      },
      {
        qIndex: 7,
        instruction: {
          subject:
            "The colossal stepped ziggurat Tower of Babel rising majestically into the clouds in the ancient plain of Shinar, surrounded by thousands of ancient builders, wooden scaffolding, brick kilns, and bustling work platforms",
          composition:
            "Distant upward perspective capturing the immense architectural scale of the unfinished stepped brick ziggurat dwarfing the surrounding desert plain",
          lighting:
            "Dramatic late afternoon sunlight casting long diagonal shadows across the sun-baked mudbrick terraces and bustling crowds below",
        },
      },
      {
        qIndex: 8,
        instruction: {
          subject:
            "The aged patriarch Abraham standing beside his goat-hair desert tent with hands lifted towards the heavens, gazing in profound wonder at an endless luminous field of stars and the Milky Way stretching across the Canaan night sky",
          composition:
            "Low-angle figure silhouette against a vast, deep indigo celestial dome blazing with uncountable bright stars and nebulae",
          lighting:
            "Starlight and gentle campfire embers softly illuminating Abraham's silver beard and robes, contrasting with the cosmic radiance above",
        },
      },
      {
        qIndex: 9,
        instruction: {
          subject:
            "The patriarch Jacob locked in an intense, reverent physical struggle with a radiant, majestic angelic messenger beside the flowing waters of the Jabbok stream, gripping tightly in determination for a blessing",
          composition:
            "Close-action dramatic composition focused on the two figures' muscular tension and spiritual intensity beside the rushing stream",
          lighting:
            "First pink and amber rays of dawn breaking behind misty river hills, with celestial inner luminescence radiating from the angel",
        },
      },
      {
        qIndex: 10,
        instruction: {
          subject:
            "Young handsome Joseph wearing a magnificent, intricately embroidered robe of vibrant colors and gold thread, standing amidst the rocky pasture of Dothan while his envious shepherd brothers in rough wool tunics watch from the shadows",
          composition:
            "Medium shot highlighting the opulent textures and brilliant dyes of Joseph's tunic against the dusty desert terrain",
          lighting:
            "Bright Mediterranean sunlight making the scarlet, cobalt, and saffron fabrics gleam with rich saturation and contrast",
        },
      },
      {
        qIndex: 11,
        instruction: {
          subject:
            "Moses holding two heavy carved stone tablets inscribed with ancient Paleo-Hebrew letters upon the craggy granite peak of Mount Sinai, surrounded by billowing smoke, fiery clouds, and divine lightning",
          composition:
            "Heroic three-quarter perspective on Moses atop the mountain precipice with billowing storm clouds below",
          lighting:
            "Flashes of divine lightning illuminating Moses' white hair and weathered stone tablets amidst dark rolling thunderclouds",
        },
      },
      {
        qIndex: 12,
        instruction: {
          subject:
            "The interior of the Holy Place in the wilderness Tabernacle, with the pure hammered gold seven-branched Menorah casting flickering sacred flame light upon the golden Table of Showbread and embroidered cherubim veil",
          composition:
            "Interior perspective looking past the glowing golden lampstand toward the incense altar and veil of blue, purple, and scarlet",
          lighting:
            "Warm golden glow from seven oil lamps reflecting off polished gold walls and creating rich chiaroscuro shadows on linen tapestries",
        },
      },
      {
        qIndex: 13,
        instruction: {
          subject:
            "The massive ancient stone fortifications and outer walls of Jericho violently crumbling and collapsing outward into dust as priests in white linen blow curved ram horn shofars in the foreground",
          composition:
            "Wide action shot showing the entire perimeter wall breaking apart amidst huge billowing dust clouds",
          lighting:
            "Direct midday sunlight cutting through swirling chalk dust, highlighting the golden Ark carried in the procession",
        },
      },
      {
        qIndex: 14,
        instruction: {
          subject:
            "The mighty muscular judge Samson with long flowing hair, arms braced against two colossal fluted stone pillars of the temple of Dagon in Gaza, crying out to heaven as the pillars crack and fracture",
          composition:
            "Monumental low-angle shot looking up at Samson straining between the buckling stone columns as masonry begins to plunge from above",
          lighting:
            "Torches and banquet braziers in the pagan temple casting fiery orange highlights on Samson's straining muscles and falling debris",
        },
      },
      {
        qIndex: 15,
        instruction: {
          subject:
            "The young devoted Moabite woman Ruth kneeling gently to gather fallen ears of golden barley in the sunlit harvest fields of Bethlehem, while the noble landowner Boaz watches with benevolence from a distance",
          composition:
            "Warm intimate pastoral composition framing Ruth in the golden foreground sheaves with distant rolling Judean hills",
          lighting:
            "Late afternoon golden harvest sunlight bathing the barley field in rich amber and honey tones",
        },
      },
      {
        qIndex: 16,
        instruction: {
          subject:
            "The prophet Elijah standing with arms outstretched in prayer before a stone altar overflowing with water on Mount Carmel, as a searing column of celestial white-hot fire crashes down from the sky, consuming the sacrifice and licking up the trench water",
          composition:
            "Epic vertical composition contrasting the lone standing prophet against a blinding pillar of heavenly fire striking the altar",
          lighting:
            "Blinding white and golden divine flash piercing an overcast sky, casting intense sharp shadows across the stunned crowd",
        },
      },
      {
        qIndex: 17,
        instruction: {
          subject:
            "A radiant chariot and horses formed of blazing golden fire ascending in a swirling tempest toward the heavens, as the younger prophet Elisha watches from the riverbank below, catching Elijah's falling mantle",
          composition:
            "Dynamic ascending composition tracing the fiery chariot spiraling upward into a tear in the sky",
          lighting:
            "Brilliant incandescent fire glow illuminating the churning waters of the Jordan river and Elisha's upturned face",
        },
      },
      {
        qIndex: 18,
        instruction: {
          subject:
            "Young King Solomon seated upon a carved ivory throne with golden lions in his royal court, extending his hand to stay an imperial guard holding a sword, while the true mother frantically pleads for the baby's life",
          composition:
            "Classic courtly interior composition with Solomon elevated on his throne as the moral center between the two weeping women",
          lighting:
            "Rich cathedral-style sunlight pouring through high palatial windows across the polished marble floor and throne",
        },
      },
      {
        qIndex: 19,
        instruction: {
          subject:
            "The prophet Jonah kneeling in prayerful thanksgiving upon a wave-washed sandy Mediterranean shore, having just been cast out from the foaming waters by a colossal sea creature visible offshore",
          composition:
            "Shoreline seascape looking toward Jonah wet and exhausted on the sands, with sea foam and rolling breakers behind him",
          lighting:
            "Dramatic morning sunrise after a storm, breaking through retreating grey waves with warm beams on the wet shoreline",
        },
      },
      {
        qIndex: 20,
        instruction: {
          subject:
            "The prophet Ezekiel standing on a rocky outcrop looking over a vast desert canyon carpeted with countless ancient human bones, where sinews, muscle, and breath begin to reassemble them into a mighty standing host",
          composition:
            "Sweeping wide panoramic canyon view showing the surreal transition from bleached skeletons to living figures standing upright",
          lighting:
            "Atmospheric desert twilight with a supernatural wind swirling sand and heavenly light descending across the valley",
        },
      },
      {
        qIndex: 21,
        instruction: {
          subject:
            "Mary and Joseph adoring the newborn Christ infant lying wrapped in swaddling clothes in a stone manger, surrounded by kneeling Bethlehem shepherds and gentle stable animals in a rustic cave stable",
          composition:
            "Intimate Caravaggio-style grouping gathered tightly around the manger, with the radiant newborn child as the primary source of light",
          lighting:
            "Supernatural warm inner luminescence radiating from the baby Jesus, softly illuminating Mary's gentle face and the rough wool robes of shepherds",
        },
      },
      {
        qIndex: 22,
        instruction: {
          subject:
            "Jesus standing waist-deep in the gentle flowing current of the Jordan River with head bowed in reverence, as John the Baptist pours water over His head, and the radiant Holy Spirit descends from opened clouds like a dove of light",
          composition:
            "River-level medium shot centering on Christ and John the Baptist, framed by reed banks and weeping willows",
          lighting:
            "Heavenly shaft of translucent golden light piercing parted clouds directly onto Jesus, illuminating ripples on the water",
        },
      },
      {
        qIndex: 23,
        instruction: {
          subject:
            "Jesus standing calmly in the bow of a wooden fishing boat tossed by turbulent cresting waves on the Sea of Galilee, extending His hand in sovereign authority to quiet the winds and crashing breakers",
          composition:
            "Dramatic wave-tossed composition with terrified disciples clinging to the rigging while Christ stands steadfast and serene",
          lighting:
            "Lightning illuminating foaming emerald storm waves, rapidly breaking into a circle of tranquil sky centered on Christ",
        },
      },
      {
        qIndex: 24,
        instruction: {
          subject:
            "Jesus standing on a grassy green hillside overlooking the Sea of Galilee, lifting up five small barley loaves and two fish in thanksgiving to heaven, as disciples begin distributing baskets of multiplied food to seated thousands",
          composition:
            "Grand hillside panorama with Christ and the young boy offering his basket in the immediate foreground and thousands seated in orderly groups across the slope",
          lighting:
            "Pleasant late-afternoon sunlight casting gentle warm illumination over the crowd and sparkling lake waters",
        },
      },
      {
        qIndex: 25,
        instruction: {
          subject:
            "Jesus walking gracefully across the crests of rolling dark sea waves in the fourth watch of the night, extending His hand to grasp the sinking disciple Peter whose clothes trail in the water",
          composition:
            "Intimate water-level rescue composition with the wooden fishing boat rocking in the background under billowing sails",
          lighting:
            "Moody moonlight breaking through storm clouds, gleaming off wave crests and highlighting Christ's outstretched hand and Peter's pleading face",
        },
      },
      {
        qIndex: 26,
        instruction: {
          subject:
            "Jesus standing before a dark rock-cut cave tomb calling forth in commanding divine power, as Lazarus, wrapped head to foot in white linen grave bands, steps forward into the light while Mary and Martha weep in astonishment",
          composition:
            "Medium-wide dramatic view framing Christ on the left and the tomb entrance on the right, with astonished onlookers gasping in the center",
          lighting:
            "Bright sunlight illuminating the garden outside, contrasting sharply with the deep black void of the tomb from which Lazarus emerges",
        },
      },
      {
        qIndex: 27,
        instruction: {
          subject:
            "Jesus riding a young colt donkey descending the Mount of Olives into the gates of Jerusalem, surrounded by an ecstatic crowd laying colorful cloaks on the road and waving vibrant green palm branches",
          composition:
            "Sweeping processional view following Christ along the stone roadway toward the imposing walls and Temple of Jerusalem",
          lighting:
            "Joyous midday golden sunlight illuminating fluttering palm fronds and vibrant festival garments",
        },
      },
      {
        qIndex: 28,
        instruction: {
          subject:
            "Jesus seated at the center of a long wooden Passover table with His twelve apostles in an ancient Jerusalem upper room, gently breaking an unleavened loaf of bread with a chalice of red wine before Him",
          composition:
            "Classic renaissance horizontal composition with Christ at the focal center, flanked by emotionally expressive disciples reacting to His words",
          lighting:
            "Warm oil lamps and candles casting soft chiaroscuro glow across the linen tablecloth, earthen vessels, and thoughtful faces of the apostles",
        },
      },
      {
        qIndex: 29,
        instruction: {
          subject:
            "Mary Magdalene kneeling on a blooming garden path outside an open rock tomb with its massive circular stone rolled away, looking up in joy and awe as the resurrected Christ, radiant and serene in white robes, calls her by name",
          composition:
            "Early morning garden view with the empty dark tomb opening behind them and blooming lilies along the stone path",
          lighting:
            "Soft pastel sunrise pink and gold breaking over the garden horizon, with a divine gentle radiance surrounding the risen Savior",
        },
      },
      {
        qIndex: 30,
        instruction: {
          subject:
            "The apostle John kneeling on the rocky coastal cliffs of the Isle of Patmos, looking up in wonder at the celestial New Jerusalem descending from heaven, radiant with twelve foundation stones of precious gems, walls of translucent jasper, and pearly gates",
          composition:
            "Grand visionary scale contrasting the rugged coastal silhouette of John in the foreground against the glowing, crystalline holy city descending through cosmic clouds",
          lighting:
            "Transcendent divine rainbow luminescence and golden glory emanating from the heavenly city, reflecting across the calm ocean waters below",
        },
      },
    ],
  },
  "get-your-fill-restaurant": {
    quizSlug: "get-your-fill-restaurant",
    category: "food",
    imageConfig: {
      stylePreset: "food",
      aspectRatio: "16:9",
      negativePrompt: CATEGORY_NEGATIVE_PROMPTS.food,
    },
    questions: [
      {
        qIndex: 1,
        instruction: {
          subject:
            "A beautifully seared prime ribeye steak sliced to reveal a perfect medium-rare center, topped with melting herb compound butter and fresh rosemary sprig, on a dark artisan ceramic platter",
          composition: "Overhead 45-degree angle close-up with soft background blur",
          lighting: "Warm directional restaurant spotlight accentuating the glistening juices and caramelized crust",
        },
      },
      {
        qIndex: 2,
        instruction: {
          subject:
            "Artisanal handmade pasta tossed in rich velvety carbonara sauce with crispy guanciale pieces, cracked black pepper, and shaved aged Pecorino Romano cheese",
          composition: "Close-up eye-level food photography highlighting steam and texture",
          lighting: "Warm soft window ambient lighting",
        },
      },
    ],
  },
  "wilderness-essentials": {
    quizSlug: "wilderness-essentials",
    category: "survival",
    imageConfig: {
      stylePreset: "survival",
      aspectRatio: "16:9",
      negativePrompt: CATEGORY_NEGATIVE_PROMPTS.survival,
    },
    questions: [
      {
        qIndex: 1,
        instruction: {
          subject:
            "A skillfully crafted wilderness lean-to shelter constructed of pine branches and birch bark nestled in a dense boreal forest next to a small crackling stone-ring campfire",
          composition: "Wide environmental outdoor shot showing the shelter blending with the autumn forest landscape",
          lighting: "Dusk twilight with the warm amber glow of the fire illuminating the shelter interior",
        },
      },
    ],
  },
};

/**
 * Resolves the final composite prompt, negative prompt, and aspect ratio for any quiz question.
 */
export function resolveImagePrompt(
  quizSlug: string,
  qIndex: number,
): ResolvedImagePrompt | null {
  const quizEntry = QUIZ_IMAGE_INSTRUCTIONS[quizSlug];
  if (!quizEntry) return null;

  const question = quizEntry.questions.find((q) => q.qIndex === qIndex);
  if (!question) return null;

  const { instruction } = question;
  const config = quizEntry.imageConfig || {};
  const category = quizEntry.category || "default";

  // Build prompt components
  const parts: string[] = [instruction.subject.trim()];

  if (instruction.composition) {
    parts.push(`Composition: ${instruction.composition.trim()}`);
  }
  if (instruction.lighting) {
    parts.push(`Lighting: ${instruction.lighting.trim()}`);
  }

  // Determine art style
  const styleDirective =
    instruction.styleOverride ||
    config.stylePrompt ||
    (config.stylePreset && CATEGORY_STYLE_PRESETS[config.stylePreset]) ||
    CATEGORY_STYLE_PRESETS[category] ||
    "";

  if (styleDirective) {
    parts.push(`Style: ${styleDirective.trim()}`);
  }

  const fullPrompt = parts.join(". ");

  // Determine negative prompt
  const negativePrompt =
    instruction.negativePromptOverride ||
    config.negativePrompt ||
    CATEGORY_NEGATIVE_PROMPTS[category] ||
    CATEGORY_NEGATIVE_PROMPTS.default;

  // Determine aspect ratio
  const aspectRatio: ImageAspectRatio =
    instruction.aspectRatio || config.aspectRatio || "16:9";

  return {
    fullPrompt,
    negativePrompt,
    aspectRatio,
  };
}

/**
 * Returns list of all quiz slugs configured with image instructions
 */
export function listConfiguredQuizzes(): string[] {
  return Object.keys(QUIZ_IMAGE_INSTRUCTIONS);
}

/**
 * Returns configuration entry for a given quiz slug
 */
export function getQuizImageEntry(quizSlug: string): QuizImageInstructionEntry | undefined {
  return QUIZ_IMAGE_INSTRUCTIONS[quizSlug];
}

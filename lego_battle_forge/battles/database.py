"""Curated historical battles optimized for viral LEGO shorts."""

from lego_battle_forge.models import (
    BattleFaction,
    BattleMoment,
    HistoricalBattle,
    LegoColor,
    LegoUnit,
    UnitType,
    ViralAngle,
)

BATTLE_REGISTRY: dict[str, HistoricalBattle] = {}


def _register(battle: HistoricalBattle) -> None:
    BATTLE_REGISTRY[battle.id] = battle


_register(
    HistoricalBattle(
        id="thermopylae",
        name="Battle of Thermopylae",
        year=-480,
        location="Thermopylae, Greece",
        era="Ancient Greece",
        summary="300 Spartans held off 100,000+ Persians at a narrow mountain pass for three days.",
        factions=[
            BattleFaction(
                name="Sparta",
                color_scheme=LegoColor.RED,
                leader="King Leonidas",
                morale="legendary",
                units=[
                    LegoUnit(name="Spartan Hoplite", unit_type=UnitType.INFANTRY, color=LegoColor.RED, count=8, accessory="spear + shield", pose="phalanx"),
                    LegoUnit(name="Leonidas", unit_type=UnitType.LEADER, color=LegoColor.RED, count=1, accessory="cape + crown", pose="hero stance"),
                ],
            ),
            BattleFaction(
                name="Persia",
                color_scheme=LegoColor.DARK_BLUE,
                leader="King Xerxes",
                morale="overconfident",
                units=[
                    LegoUnit(name="Immortal", unit_type=UnitType.INFANTRY, color=LegoColor.DARK_BLUE, count=12, accessory="bow", pose="advancing wave"),
                    LegoUnit(name="Xerxes", unit_type=UnitType.LEADER, color=LegoColor.YELLOW, count=1, accessory="throne on platform", pose="seated"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="The Stand", description="Spartans form shield wall at the Hot Gates", duration_seconds=4, camera="low angle wide", action="shields lock, spears extend", sound_cue="metal clash + war drums", text_overlay="300 vs 100,000", viral_hook=True),
            BattleMoment(name="This Is Sparta", description="Leonidas kicks messenger into pit", duration_seconds=3, camera="dramatic close-up", action="kick + fall", sound_cue="impact + crowd gasp", text_overlay="WRONG. ARMY.", viral_hook=True),
            BattleMoment(name="Betrayal", description="Local shepherd reveals secret mountain path", duration_seconds=5, camera="tracking shot through trees", action="figure sneaks, points at path", sound_cue="whisper + ominous drone", text_overlay="One traitor ended it all"),
            BattleMoment(name="Last Stand", description="Spartans fight to the death surrounded", duration_seconds=6, camera="360 slow-mo orbit", action="spears thrust, shields break", sound_cue="epic orchestral swell", text_overlay="They never retreated"),
        ],
        outcome="Persians won but lost 20,000 men. Spartan sacrifice inspired all of Greece.",
        fun_fact="The Spartans actually had ~7,000 Greek allies — but only 300 Spartans stayed for the final stand.",
        viral_angles=[ViralAngle.UNDERDOG, ViralAngle.BETRAYAL, ViralAngle.COUNTDOWN],
        trending_score=9,
        difficulty="easy",
    )
)

_register(
    HistoricalBattle(
        id="hastings",
        name="Battle of Hastings",
        year=1066,
        location="Hastings, England",
        era="Medieval",
        summary="William the Conqueror's Normans defeated King Harold with one arrow that changed England forever.",
        factions=[
            BattleFaction(
                name="Normans",
                color_scheme=LegoColor.BLUE,
                leader="William the Conqueror",
                units=[
                    LegoUnit(name="Norman Knight", unit_type=UnitType.CAVALRY, color=LegoColor.BLUE, count=6, accessory="lance + horse", pose="charge"),
                    LegoUnit(name="Archer", unit_type=UnitType.ARCHER, color=LegoColor.BLUE, count=4, accessory="longbow", pose="aiming skyward"),
                    LegoUnit(name="William", unit_type=UnitType.LEADER, color=LegoColor.BLUE, count=1, accessory="horse + banner", pose="raising sword"),
                ],
            ),
            BattleFaction(
                name="Saxons",
                color_scheme=LegoColor.GREEN,
                leader="King Harold",
                units=[
                    LegoUnit(name="Housecarl", unit_type=UnitType.INFANTRY, color=LegoColor.GREEN, count=8, accessory="axe + shield wall", pose="shield wall"),
                    LegoUnit(name="Harold", unit_type=UnitType.LEADER, color=LegoColor.GREEN, count=1, accessory="crown + sword", pose="on hilltop"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="Shield Wall", description="Saxons hold the high ground in impenetrable formation", duration_seconds=4, camera="wide overhead", action="wall holds against cavalry", sound_cue="thundering hooves + bounce", text_overlay="Unbreakable... or so they thought", viral_hook=True),
            BattleMoment(name="Fake Retreat", description="Normans pretend to flee, Saxons break formation to chase", duration_seconds=5, camera="tracking chase", action="knights run, saxons pursue", sound_cue="confused battle cries", text_overlay="The oldest trick in the book"),
            BattleMoment(name="The Arrow", description="Arrow strikes Harold in the eye", duration_seconds=3, camera="slow-mo POV arrow", action="arrow flight, impact", sound_cue="whoosh + silence", text_overlay="ONE arrow. ONE king.", viral_hook=True),
            BattleMoment(name="England Falls", description="Saxon line collapses, William claims throne", duration_seconds=4, camera="wide pullback", action="banner falls, Norman flag rises", sound_cue="dramatic reveal sting", text_overlay="1066 changed EVERYTHING"),
        ],
        outcome="Norman victory. Harold killed. William became King of England.",
        fun_fact="The Bayeux Tapestry shows Harold with an arrow in his eye — historians still debate if that's accurate.",
        viral_angles=[ViralAngle.ONE_MISTAKE, ViralAngle.GENIUS_TACTIC],
        trending_score=8,
        difficulty="medium",
    )
)

_register(
    HistoricalBattle(
        id="cannae",
        name="Battle of Cannae",
        year=-216,
        location="Cannae, Italy",
        era="Ancient Rome",
        summary="Hannibal's genius double envelopment destroyed a Roman army twice his size in a single afternoon.",
        factions=[
            BattleFaction(
                name="Carthage",
                color_scheme=LegoColor.RED,
                leader="Hannibal Barca",
                units=[
                    LegoUnit(name="Numidian Cavalry", unit_type=UnitType.CAVALRY, color=LegoColor.TAN, count=4, accessory="javelin", pose="flanking"),
                    LegoUnit(name="African Infantry", unit_type=UnitType.INFANTRY, color=LegoColor.RED, count=8, accessory="sword + shield", pose="crescent formation"),
                    LegoUnit(name="War Elephant", unit_type=UnitType.ELEPHANT, color=LegoColor.GRAY, count=2, accessory="howdah platform", pose="charging"),
                    LegoUnit(name="Hannibal", unit_type=UnitType.LEADER, color=LegoColor.RED, count=1, accessory="elephant or horse", pose="commanding"),
                ],
            ),
            BattleFaction(
                name="Rome",
                color_scheme=LegoColor.WHITE,
                leader="Consuls Paullus & Varro",
                units=[
                    LegoUnit(name="Roman Legionary", unit_type=UnitType.INFANTRY, color=LegoColor.WHITE, count=16, accessory="pilum + scutum", pose="advancing column"),
                    LegoUnit(name="Roman Cavalry", unit_type=UnitType.CAVALRY, color=LegoColor.WHITE, count=4, accessory="lance", pose="routing"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="The Trap", description="Carthaginian center deliberately weakens and retreats", duration_seconds=5, camera="overhead tactical view", action="center bends backward like a bow", sound_cue="tension build", text_overlay="He WANTED them to push forward", viral_hook=True),
            BattleMoment(name="The Crescents Close", description="Wings slam inward, Romans trapped in a pocket", duration_seconds=6, camera="overhead zoom in", action="two arms close like pincers", sound_cue="snap + crowd roar", text_overlay="The perfect trap", viral_hook=True),
            BattleMoment(name="Slaughter", description="50,000 Romans killed in encirclement", duration_seconds=4, camera="chaos close-ups", action="minifigs fall, dust rises", sound_cue="intense percussion", text_overlay="Worst defeat in Roman history"),
        ],
        outcome="Rome lost ~50,000-70,000 men. Hannibal's masterpiece — but couldn't take Rome itself.",
        fun_fact="Cannae is still taught at military academies worldwide as the perfect battle tactic.",
        viral_angles=[ViralAngle.GENIUS_TACTIC, ViralAngle.COUNTDOWN],
        trending_score=9,
        difficulty="hard",
    )
)

_register(
    HistoricalBattle(
        id="waterloo",
        name="Battle of Waterloo",
        year=1815,
        location="Waterloo, Belgium",
        era="Napoleonic",
        summary="Napoleon's final gamble — delayed by mud, defeated by Wellington and Blücher. An empire ended in one afternoon.",
        factions=[
            BattleFaction(
                name="France",
                color_scheme=LegoColor.BLUE,
                leader="Napoleon Bonaparte",
                units=[
                    LegoUnit(name="Old Guard", unit_type=UnitType.INFANTRY, color=LegoColor.BLUE, count=6, accessory="bearskin hat + musket", pose="advancing column"),
                    LegoUnit(name="Cuirassier", unit_type=UnitType.CAVALRY, color=LegoColor.BLUE, count=4, accessory="breastplate + saber", pose="charge"),
                    LegoUnit(name="Artillery", unit_type=UnitType.ARTILLERY, color=LegoColor.GRAY, count=2, accessory="cannon", pose="firing"),
                    LegoUnit(name="Napoleon", unit_type=UnitType.LEADER, color=LegoColor.BLUE, count=1, accessory="bicorne hat + horse", pose="observing"),
                ],
            ),
            BattleFaction(
                name="Allies",
                color_scheme=LegoColor.RED,
                leader="Duke of Wellington",
                units=[
                    LegoUnit(name="British Infantry", unit_type=UnitType.INFANTRY, color=LegoColor.RED, count=8, accessory="musket + line formation", pose="behind ridge"),
                    LegoUnit(name="Prussian", unit_type=UnitType.INFANTRY, color=LegoColor.BLACK, count=6, accessory="musket", pose="arriving from east"),
                    LegoUnit(name="Wellington", unit_type=UnitType.LEADER, color=LegoColor.RED, count=1, accessory="cocked hat", pose="on ridge"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="Mud Delay", description="Heavy rain turned battlefield to mud, delaying French artillery", duration_seconds=4, camera="close-up boots in mud", action="cannon wheels stuck", sound_cue="squelch + rain", text_overlay="The weather decided an empire", viral_hook=True),
            BattleMoment(name="La Haye Sainte", description="Fierce farmhouse battle in the center", duration_seconds=5, camera="house interior/exterior cuts", action="door breach, bayonet fight", sound_cue="intense close combat", text_overlay="The farm that held an empire hostage"),
            BattleMoment(name="Old Guard Last Charge", description="Napoleon's elite guard marches up the ridge — and breaks", duration_seconds=6, camera="low angle tracking", action="blue column advances, then staggers", sound_cue="drums then collapse", text_overlay="The Guard dies but never surrenders", viral_hook=True),
            BattleMoment(name="Prussians Arrive", description="Blücher's army hits the French flank", duration_seconds=4, camera="wide eastern horizon", action="black-uniformed troops flood in", sound_cue="cavalry horns", text_overlay="He was 3 hours late. It was enough."),
        ],
        outcome="Napoleon defeated. Exiled to St. Helena. End of the Napoleonic Wars.",
        fun_fact="Napoleon had hemorrhoids during the battle — some historians say it affected his decision-making.",
        viral_angles=[ViralAngle.ONE_MISTAKE, ViralAngle.WHAT_IF, ViralAngle.COUNTDOWN],
        trending_score=8,
        difficulty="hard",
    )
)

_register(
    HistoricalBattle(
        id="stalingrad",
        name="Battle of Stalingrad",
        year=1942,
        location="Stalingrad, USSR",
        era="World War II",
        summary="The deadliest battle in history. Street by street, room by room — a city became a graveyard.",
        factions=[
            BattleFaction(
                name="Soviet Union",
                color_scheme=LegoColor.GREEN,
                leader="General Chuikov",
                units=[
                    LegoUnit(name="Rifleman", unit_type=UnitType.INFANTRY, color=LegoColor.GREEN, count=10, accessory="rifle + rubble cover", pose="urban combat"),
                    LegoUnit(name="Sniper", unit_type=UnitType.INFANTRY, color=LegoColor.GREEN, count=1, accessory="scoped rifle", pose="in ruins"),
                    LegoUnit(name="Chuikov", unit_type=UnitType.LEADER, color=LegoColor.GREEN, count=1, accessory="coat + binoculars", pose="in bunker"),
                ],
            ),
            BattleFaction(
                name="Germany",
                color_scheme=LegoColor.GRAY,
                leader="General Paulus",
                units=[
                    LegoUnit(name="Wehrmacht Soldier", unit_type=UnitType.INFANTRY, color=LegoColor.GRAY, count=10, accessory="MP40 + helmet", pose="house clearing"),
                    LegoUnit(name="Panzer", unit_type=UnitType.ARTILLERY, color=LegoColor.GRAY, count=2, accessory="tank brick build", pose="street advance"),
                    LegoUnit(name="Paulus", unit_type=UnitType.LEADER, color=LegoColor.GRAY, count=1, accessory="greatcoat", pose="in command post"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="Pavlov's House", description="One building held for 58 days against all odds", duration_seconds=5, camera="building cross-section", action="defenders on every floor", sound_cue="constant gunfire", text_overlay="ONE building. 58 days.", viral_hook=True),
            BattleMoment(name="Rat War", description="Fighting in sewers beneath the city", duration_seconds=4, camera="dark tunnel POV", action="figures in tight tunnel combat", sound_cue="echo + dripping water", text_overlay="They fought in the DARK"),
            BattleMoment(name="Operation Uranus", description="Soviet pincer encircles entire German 6th Army", duration_seconds=5, camera="map animation overhead", action="two arrows close around city", sound_cue="dramatic sting", text_overlay="2 million soldiers. Trapped.", viral_hook=True),
            BattleMoment(name="Surrender", description="Paulus surrenders — first German field marshal to do so", duration_seconds=4, camera="slow zoom on defeated figure", action="white flag, frozen soldiers", sound_cue="wind + silence", text_overlay="The turning point of WWII"),
        ],
        outcome="Soviet victory. ~2 million casualties total. Germany never recovered.",
        fun_fact="Average life expectancy for a Soviet soldier in Stalingrad was 24 hours.",
        viral_angles=[ViralAngle.UNDERDOG, ViralAngle.COUNTDOWN, ViralAngle.FORBIDDEN],
        trending_score=10,
        difficulty="hard",
    )
)

_register(
    HistoricalBattle(
        id="agincourt",
        name="Battle of Agincourt",
        year=1415,
        location="Agincourt, France",
        era="Medieval",
        summary="6,000 exhausted English archers destroyed 30,000 French knights in the mud. Longbows > armor.",
        factions=[
            BattleFaction(
                name="England",
                color_scheme=LegoColor.RED,
                leader="King Henry V",
                units=[
                    LegoUnit(name="Longbowman", unit_type=UnitType.ARCHER, color=LegoColor.GREEN, count=10, accessory="longbow + arrow volley", pose="behind stakes"),
                    LegoUnit(name="Henry V", unit_type=UnitType.LEADER, color=LegoColor.RED, count=1, accessory="crown + sword", pose="rallying troops"),
                ],
            ),
            BattleFaction(
                name="France",
                color_scheme=LegoColor.BLUE,
                leader="Constable d'Albret",
                units=[
                    LegoUnit(name="French Knight", unit_type=UnitType.CAVALRY, color=LegoColor.BLUE, count=12, accessory="full plate armor", pose="stuck in mud"),
                    LegoUnit(name="Crossbowman", unit_type=UnitType.ARCHER, color=LegoColor.BLUE, count=4, accessory="crossbow", pose="outranged"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="The Mud", description="Heavy armor + muddy field = French nightmare", duration_seconds=4, camera="close-up knights sinking", action="horses struggle, knights fall", sound_cue="mud squelch + struggle", text_overlay="30,000 knights. Stuck in MUD.", viral_hook=True),
            BattleMoment(name="Arrow Storm", description="5,000 arrows per minute rain down", duration_seconds=5, camera="sky POV then ground impact", action="arrow pieces fly, knights fall", sound_cue="arrow whoosh barrage", text_overlay="5,000 arrows per MINUTE"),
            BattleMoment(name="St. Crispin's Day", description="Henry rallies troops before battle", duration_seconds=4, camera="hero shot", action="king walks among soldiers", sound_cue="inspirational swell", text_overlay="We few, we happy few"),
        ],
        outcome="English crushing victory. French nobility decimated. Henry V became legend.",
        fun_fact="French knights who fell in mud were trampled by their own men — more died from drowning than arrows.",
        viral_angles=[ViralAngle.UNDERDOG, ViralAngle.ONE_MISTAKE],
        trending_score=8,
        difficulty="medium",
    )
)

_register(
    HistoricalBattle(
        id="midway",
        name="Battle of Midway",
        year=1942,
        location="Midway Atoll, Pacific",
        era="World War II",
        summary="5 minutes that changed the Pacific War. US dive bombers caught Japanese carriers with decks full of planes.",
        factions=[
            BattleFaction(
                name="United States",
                color_scheme=LegoColor.BLUE,
                leader="Admiral Nimitz",
                units=[
                    LegoUnit(name="SBD Dauntless", unit_type=UnitType.SHIP, color=LegoColor.BLUE, count=4, accessory="dive bomber brick build", pose="diving attack"),
                    LegoUnit(name="Carrier", unit_type=UnitType.SHIP, color=LegoColor.GRAY, count=1, accessory="aircraft carrier plate", pose="on blue baseplate ocean"),
                ],
            ),
            BattleFaction(
                name="Japan",
                color_scheme=LegoColor.RED,
                leader="Admiral Nagumo",
                units=[
                    LegoUnit(name="Zero Fighter", unit_type=UnitType.SHIP, color=LegoColor.RED, count=6, accessory="fighter plane", pose="on carrier deck"),
                    LegoUnit(name="Carrier Kaga/Akagi", unit_type=UnitType.SHIP, color=LegoColor.RED, count=2, accessory="carrier with planes on deck", pose="vulnerable deck full"),
                ],
            ),
        ],
        key_moments=[
            BattleMoment(name="The Gamble", description="Nagumo swaps plane armaments at the worst possible moment", duration_seconds=5, camera="carrier deck overhead", action="crew swaps bombs and torpedoes", sound_cue="alarm klaxon", text_overlay="One decision. Four carriers lost.", viral_hook=True),
            BattleMoment(name="The Window", description="Japanese fighters descend — decks exposed for 5 minutes", duration_seconds=4, camera="split screen timers", action="empty deck, planes fueling", sound_cue="tick tock", text_overlay="5 minutes to change history"),
            BattleMoment(name="Dive Bomber Strike", description="US bombers appear out of the clouds", duration_seconds=5, camera="POV dive from sky", action="bombs release, carriers explode", sound_cue="screaming dive + explosions", text_overlay="The luckiest attack in history", viral_hook=True),
        ],
        outcome="Japan lost 4 carriers. US lost 1. Pacific War turned in America's favor.",
        fun_fact="US codebreakers knew the Japanese plan before the battle even started.",
        viral_angles=[ViralAngle.ONE_MISTAKE, ViralAngle.GENIUS_TACTIC, ViralAngle.COUNTDOWN],
        trending_score=9,
        difficulty="hard",
    )
)


def get_battle(battle_id: str) -> HistoricalBattle:
    if battle_id not in BATTLE_REGISTRY:
        available = ", ".join(sorted(BATTLE_REGISTRY.keys()))
        raise KeyError(f"Battle '{battle_id}' not found. Available: {available}")
    return BATTLE_REGISTRY[battle_id]


def list_battles() -> list[HistoricalBattle]:
    return sorted(BATTLE_REGISTRY.values(), key=lambda b: -b.trending_score)

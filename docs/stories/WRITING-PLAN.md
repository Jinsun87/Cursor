# Writing plan: Bible story series

How the launch story scripts are written, checked and handed to the voice. Applies to both launch series. The episode list, lengths and status live in the planning sheet ("Launch Series" tab).

| Series | Episodes | Length | Voice | Listener |
|---|---|---|---|---|
| Women of the Bible | 8 | 15–25 min | Leona G (ElevenLabs `9BDgg2Q7WSrW0x8naPLw`), British, calm storyteller | Adults, at bedtime |
| Bedtime Bible Stories | 8 | 12–15 min | Theo (the Sleep voice) | Adults and families; written so a child can follow |

## 1. Rules every script follows

**Scripture is the source.**
- **Story events come from the Bible only.** Every name, number, place, age and event must be in the passage, read in the BSB.
- **Background may describe the setting,** not add events: tents, night skies, the walk to a well, what a famine does to fields. It must fit the period and the passage. It may not add events, motives stated as fact, or new speech.
- **God, Jesus and angels speak only in Scripture's own words,** quoted word for word from the BSB. Other characters speak in the BSB's words too, or the narrator reports what they said ("Sarah denied that she had laughed").
- **Feelings the text doesn't state are offered as possibilities,** not facts: "she may have wondered", "it must have felt".
- **Where Christians read a passage differently, the script says so fairly,** without taking sides.

**Quotes are exact.**
- Every quote is the BSB, word for word, marked with its reference (see section 4). The checker compares each one with `data/bsb.txt` and fails the script on a single wrong word.
- Each script quotes 3–6 key lines. That is enough to keep Lampstand's promise, "Know the text", without reading whole chapters.

**Honest, but gentle at night.**
- **Hard parts are told truthfully:** Sarah's harshness to Hagar, David's sins, the cost of Esther's risk. They are told without graphic detail, and never in the last third of a script.
- **No frightening images** close to sleep: no blood, no torture, no hell imagery. Battles and deaths are told from a distance.
- **Every script ends calm,** with a slow wind-down and nothing new introduced in the last two minutes.

**Comfort that stays within Scripture.**
- **Reflections apply what the passage shows about God:** He keeps His promises, He sees, He hears, He is near.
- **They never promise listeners personal outcomes.** Not "your dream will come true"; Sarah's son is not a promise that everyone's wait ends the same way.
- **Keep reflections short:** at most about 90 seconds each, and fewer of them in Bedtime Bible Stories.

**Plain English for listening.**
- Short sentences, familiar words. A sentence should make sense heard once, at night, half asleep.
- Say names clearly when they first appear, and repeat who is who after a gap ("Hagar, Sarah's servant").
- No headings, lists or references are read aloud. The voice reads only the story.
- British and American readers both listen, so avoid idioms that belong to one country.

## 2. Structure

**Women of the Bible (15–25 min):**
1. **Settling in** (1–2 min): breathing, no facts yet.
2. **The story,** in 5–8 parts, each one scene or turn of the story, with a pause between parts. One short reflection after a part where it helps.
3. **What Scripture remembers** (1 min): how the rest of the Bible speaks of her, quoted.
4. **Closing** (2 min): one thought to carry, then the wind-down, then silence.

**Bedtime Bible Stories (12–15 min):**
1. **Settling in** (under 1 min).
2. **The story,** in 4–6 parts. More scene and sound, fewer reflections, simple enough for a child.
3. **Closing** (1–2 min): the story's one truth in a sentence, then the wind-down.

**Length:** each voice has a measured pace, and each `[pause]` adds 4 seconds. Set `wpm:` in a script's front matter so the checker uses the right one.
- **Theo** (Bedtime Bible Stories) reads about **128 words a minute**, measured on Genesis.
- **Leona** (Women of the Bible) reads about **136**, measured on the Sarah opening.

| Target | Theo, 128 wpm | Leona, 136 wpm |
|---|---|---|
| 12 min | 1,450 words | — |
| 15 min | 1,800 | 1,900 |
| 18 min | 2,150 | 2,250 |
| 20 min | 2,400 | 2,550 |
| 25 min | 3,000 | 3,150 |

These assume about 20 pauses in a 25-minute script. The checker gives the real figure.

## 3. Fact-check process

Every script passes all five steps before it is voiced. A failure sends it back to writing.

1. **Read the passages first.** List every passage the story touches in the script's front matter, and read all of them in the BSB before writing, not only the famous verses.
2. **Fact table.** At the end of the script, list every factual claim with its reference: names, ages, numbers, places, who said what, who named whom, and the order of events. A claim with no reference is either removed or marked as background or interpretation.
3. **Automated check:** `npx tsx scripts/check-story.ts <file>`. It confirms every quote is word for word, every reference in the fact table exists, and the length is on target.
4. **Second read against the passage:** read the script beside the BSB text, scene by scene, looking for anything added, missing or out of order. Common traps:
   - names used before they are given (Sarai becomes Sarah only in Genesis 17),
   - ages,
   - who spoke a line (often "the LORD", not "a visitor"),
   - who named a child,
   - details from popular retellings that aren't in the text.
5. **Night read:** read the script once purely as a listener at bedtime, for anything frightening, abrupt, preachy or confusing. Fix it, then run step 3 again.

**Known errors to watch for:**
- **Name meanings:** Sarah means "princess"; "mother of nations" is God's promise in Genesis 17:16.
- **Smoothing over hard parts:** if Scripture says someone treated another person harshly, say so.
- **Pharaoh's words:** quote what he actually said. Don't add a warning that isn't in the text.
- **Invented emotion stated as fact.**

## 4. Script format (for the voice pipeline)

Scripts live in `content/stories/<series>/<slug>.md`:

```
---
title: Sarah: Mother of Nations
series: Women of the Bible
target_minutes: 25
passages: Genesis 11:27–12:20; 15; 16; 17:1–22; 18:1–15; 20; 21:1–21; 23; 24:67
paintings: reuse Genesis 12–23; new: …
---
## Settling in
Close your eyes, if they aren't already closed.
[pause]
> Is anything too difficult for the LORD? [Genesis 18:14]
She said, “God has made me laugh” [Genesis 21:6], and …
[long pause]
## Fact check
| Claim | Reference |
```

- `## …` headings are section titles, not read aloud. They also mark where the painting changes.
- `[pause]` is 4 seconds of silence; `[long pause]` is 10. The pipeline inserts the silences, so the voice never reads the markers.
- `> text [Ref]` is a quote set apart; `“text” [Ref]` is a quote inside a sentence. Use "…" to skip words inside a quote.
- Everything from `## Fact check` on is notes.

## 5. Order of work

1. **Pilot: Sarah,** rewritten to these rules. You read it and give feedback on tone, length and reflections. The female voice is chosen with a sample from this script.
2. **Women of the Bible 2–8,** written in pairs. Each pair is fact-checked and reported before the next.
3. **Bedtime Bible Stories 1–8,** in pairs, after the tone of the first one is approved.
4. **The planning sheet is updated** as each script passes: Status becomes "Checked", with a link to the file.
5. **Voicing** starts once a series' scripts are checked: one episode first, listened to, then the rest.

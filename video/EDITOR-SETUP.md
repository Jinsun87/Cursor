# Making Lampstand Sleep videos: setup for editors

This guide sets up a Windows computer to render Lampstand's Walk and Sleep chapters as long videos for
the YouTube channel. You only download from the project, and nothing you do here can change it.

You will need about 10 GB of free disk space. Rendering is heavy, so a desktop or a laptop that is plugged in works best.

## 1. Install the tools (once)

Install these three, accepting the default options:

1. **Node.js 20 or later** (the "LTS" version): https://nodejs.org
2. **Git**: https://git-scm.com/download/win
3. **ffmpeg**: open **PowerShell** and run:

   ```powershell
   winget install --id Gyan.FFmpeg -e
   ```

Close PowerShell and open it again so it finds the new tools. Check that they work:

```powershell
node --version
git --version
ffmpeg -version
```

Each one should print a version number. Node's should start with `v20` or higher.

## 2. Download the project (once)

In PowerShell:

```powershell
cd $HOME\Documents
git clone https://github.com/Jinsun87/Cursor.git lampstand
cd lampstand
npm ci
cd video
npm ci
cd ..
```

The two `npm ci` steps take a few minutes. The first render also downloads a copy of Chrome
that Remotion uses to draw the frames.

## 3. Tell it where the narration lives (once)

The narration recordings are not in the project itself. They stream from Lampstand's audio
storage, and the renderer downloads each chapter it needs. Create a file named `.env.local` in the
`lampstand` folder with this single line:

```powershell
Set-Content -Path .env.local -Value "NEXT_PUBLIC_AUDIO_BASE_URL=https://pub-03ad57aa18a14ca28f3388af3afd7e3f.r2.dev"
```

This is the same public address the app plays from, not a password. You don't need any other key.

## 4. Render a video

From the `lampstand` folder:

```powershell
# A 60-second test first, to check everything works
npx tsx video/render.ts "Genesis 1" --seconds=60

# One chapter, Sleep voice (the default)
npx tsx video/render.ts "Psalm 23"

# Several chapters in one long video
npx tsx video/render.ts "Genesis 1-11"

# The Walk voice instead of Sleep
npx tsx video/render.ts "Exodus 14" --walk
```

The book names are written as in the Bible: `Genesis`, `Exodus`, `Psalm` (singular, for example
`"Psalm 1-41"`).

Each render writes three files to `video\out\`:

| File | What it is |
|---|---|
| `<name>.mp4` | The video |
| `<name>.jpg` | The thumbnail |
| `<name>.txt` | The YouTube title, description and chapter timestamps, ready to paste |

**How long it takes:** about 1.5 hours of rendering for every hour of video, depending on the
computer. Keep the computer awake and plugged in. If it is too slow or the computer gets too hot,
use fewer render threads, for example `--concurrency=4`.

## The house style

Every render comes out in the channel's format, the same as the Genesis 1 sample, with nothing to
set. Please keep it that way, so the channel looks the same from one video to the next.

- **Video:** 1920×1080, 30 frames a second, H.264 with AAC audio.
- **Each scene:** the painting on the left, the same painting blurred to fill the background, and on the right
  the verse being read, with its number and the chapter and section above it. "Berean Standard Bible ·
  lampstandbible.com" sits small at the bottom.
- **Voice:** Sleep (slow and soft) unless you add `--walk`.
- **Thumbnail:** 1280×720, with a painting, the chapter name ("Genesis 1"), "Read softly for sleep" (or "Read for your
  walk") and "Word for word · Lampstand".
- **Title and description:** from the `.txt`, word for word, including the BSB credit line at the end.

## 5. Get new chapters

New chapters are added to the project regularly. Before rendering, run this from the `lampstand` folder:

```powershell
git pull
```

This only downloads. If an update added new packages, the render will say a module is missing:
run `npm ci` in both folders again, as in step 2.

## 6. Upload to YouTube

You will be invited to the channel as an **Editor** in YouTube Studio. Upload from your own Google
account through that invitation. Never ask for or use the channel owner's password.

For each video:

1. Upload the `.mp4`.
2. Set the `.jpg` as the thumbnail.
3. Paste the title and description from the `.txt`. The chapter timestamps in the description become
   chapters on the YouTube progress bar.
4. Leave the video **Private** or **Unlisted** until it has been checked, unless you have been told otherwise.

## Good to know

- **Which chapters are ready:** what has been recorded is listed in the app at https://lampstandbible.com
  (Walk or Sleep, then the book shelf). A chapter that hasn't been recorded can't be rendered.
- **Don't change the project files.** If you would like to improve the videos, describe the change,
  or fork the project on GitHub and send a pull request for review.
- **Disk space:** `video\out\` and `video\.work\` grow with every render. Delete old renders once
  they are uploaded. `.work` is safe to delete at any time.

## If something goes wrong

| Message | What to do |
|---|---|
| `NEXT_PUBLIC_AUDIO_BASE_URL is not set` | Step 3 was missed, or `.env.local` is in the wrong folder. It must be in `lampstand`, not in `video`. |
| `Could not download ... narration: 404` | That chapter has no recording in that voice yet. Try `--walk` or the other voice, or a different chapter. |
| `'ffmpeg' is not recognized` | Install ffmpeg (step 1), then close and reopen PowerShell. |
| `Cannot find module` | Run `npm ci` in both `lampstand` and `lampstand\video` again. |
| The render stops partway | Run the same command again. If it keeps stopping, try `--concurrency=4`. |

For anything else, send the last 20 lines of the PowerShell window to the Lampstand team.

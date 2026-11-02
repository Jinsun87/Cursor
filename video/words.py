"""Word timings for a stretch of narration, with faster-whisper on this computer (no API, no cost).

    python video/words.py <mp3> <start-seconds> <end-seconds> <out.json>

Writes {"words": [{"word", "start", "end"}]} with times from the start of the mp3.
Used by ads.ts for story captions; the Psalms already have word timings in voice-transcripts/sleep/.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from faster_whisper import WhisperModel

mp3, start, end, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]

with tempfile.TemporaryDirectory() as tmp:
    clip = str(Path(tmp) / "clip.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start), "-to", str(end), "-i", mp3, "-ac", "1", "-ar", "16000", clip],
        check=True,
    )
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(clip, language="en", word_timestamps=True, vad_filter=False)
    words = [
        {"word": w.word.strip(), "start": round(start + w.start, 2), "end": round(start + w.end, 2)}
        for s in segments
        for w in (s.words or [])
    ]

Path(out).write_text(json.dumps({"words": words}, indent=1), encoding="utf-8")
print(f"{len(words)} words")

"""Check selected story copy against both shipped weights, including all headings.
Requires fontTools + Brotli. Build customer subsets first with subset-fonts.py.
"""
import json, os, sys, hashlib
from pathlib import Path
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parent.parent
story = root / os.environ.get('STORY_FILE', 'stories/private/story.json')
def strings(value):
    if isinstance(value, str): yield value
    elif isinstance(value, list):
        for item in value: yield from strings(item)
    elif isinstance(value, dict):
        for item in value.values(): yield from strings(item)
data = json.loads(story.read_text())
text = ''.join(strings(data))
if data.get('letterFile'):
    letter_name = data['letterFile']
    if Path(letter_name).name != letter_name or '..' in letter_name or not letter_name.endswith('.json'):
        raise ValueError('letterFile must be a JSON filename beside the story')
    text += ''.join(strings(json.loads((story.parent / letter_name).read_text())))
chars = set(text)
# Verify Chinese and meaningful punctuation; ASCII paths and control characters are not typography.
chars = {ord(c) for c in chars if '\u3000' <= c <= '\u9fff' or '\uff00' <= c <= '\uffef' or 0x20000 <= ord(c) <= 0x323af or c in '。，“”‘’、—…'}
primary = set(json.loads((root/'src/font-coverage.json').read_text()))
missing_points = sorted(chars-primary)
upstream_sha = 'a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da'
key = hashlib.sha256((json.dumps(missing_points,separators=(',',':'))+upstream_sha).encode()).hexdigest()[:20]
for file in (root / 'public/fonts').glob('*.woff2'):
    available = TTFont(file).getBestCmap()
    if missing_points:
        weight = 'semibold' if 'semibold' in file.name else 'regular'
        supplement = root/'.cache/story-fonts'/key/(weight+'.woff2')
        if supplement.exists():
            available.update(TTFont(supplement).getBestCmap())
    missing = sorted(chars - available.keys())
    if missing:
        print(file.name, 'missing:', ''.join(map(chr,missing))); sys.exit(1)
    print(file.name, 'all story Chinese glyphs covered')

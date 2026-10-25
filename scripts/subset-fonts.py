"""Build the checked-in, renamed OFL font subsets. Not needed for npm builds.

Usage: PYTHONPATH=/tmp/phone-font-tools python scripts/subset-fonts.py /path/to/NotoSansSC.ttf
Requires fontTools and Brotli; the original OFL license stays with the subset.
"""
from pathlib import Path
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
corpus = "".join(p.read_text() for p in (root / "src").glob("*.*") if p.suffix in {".tsx", ".ts"})
corpus += (root / "index.html").read_text() + "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;!?¥＋ /-（）「」"
output = root / "public" / "fonts"
output.mkdir(parents=True, exist_ok=True)

for weight, style in [(400, "Regular"), (600, "Semibold")]:
    font = TTFont(source)
    versions = [n.toUnicode() for n in font["name"].names if n.nameID == 5]
    print("Upstream version:", versions[0])
    font = instantiateVariableFont(font, {"wght": weight}, inplace=True)
    # Rename the subset family; keep upstream copyright and OFL notices.
    for record in font["name"].names:
        values = {1: "Today Sans", 2: style, 4: "Today Sans " + style, 6: "TodaySans-" + style, 16: "Today Sans", 17: style}
        if record.nameID in values:
            record.string = values[record.nameID].encode(record.getEncoding())
    options = subset.Options()
    options.flavor = "woff2"
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
    options.name_legacy = True
    options.name_languages = [0x409]
    sub = subset.Subsetter(options=options)
    sub.populate(text=corpus)
    sub.subset(font)
    font.flavor = "woff2"
    target = output / ("today-sans-" + style.lower() + ".woff2")
    font.save(target)
    print(target.name, target.stat().st_size, "bytes")

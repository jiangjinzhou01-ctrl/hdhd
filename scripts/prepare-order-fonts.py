"""Create ONLY the uncovered characters. Original Today Sans and its license are unchanged."""
import hashlib, json, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

source, points_file, output = map(Path, sys.argv[1:])
points = json.loads(points_file.read_text())
upstream = TTFont(source)
available = upstream.getBestCmap()
unsupported = [cp for cp in points if cp not in available]
if unsupported:
    raise ValueError('Upstream font cannot render: ' + ', '.join(f'U+{cp:X}' for cp in unsupported) + '. Stop delivery; obtain an authorized compatible font or customer-approved spelling. System fallback is not proof of coverage.')
versions = [n.toUnicode() for n in upstream['name'].names if n.nameID == 5]
report = {'sourceSHA256': hashlib.sha256(source.read_bytes()).hexdigest(),
          'version': versions[0], 'codepoints': points, 'files': {}}
output.mkdir(parents=True, exist_ok=True)
for weight, style in [(400, 'regular'), (600, 'semibold')]:
    font = instantiateVariableFont(TTFont(source), {'wght': weight}, inplace=True)
    for record in font['name'].names:
        names = {1:'Today Order', 2:style.title(), 4:'Today Order '+style.title(),
                 6:'TodayOrder-'+style.title(), 16:'Today Order', 17:style.title()}
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = [0,1,2,3,4,5,6,13,14,16,17]
    options.name_legacy = True
    options.name_languages = [0x409]
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=points)
    sub.subset(font)
    font.flavor = 'woff2'
    file = output / (style+'.woff2')
    font.save(file)
    # Re-open encoded artifact: never infer coverage from requested characters alone.
    cmap = sorted(TTFont(file).getBestCmap())
    if not set(points).issubset(cmap):
        raise ValueError('Incomplete encoded font cmap')
    report['files'][style] = {'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),
                             'bytes':file.stat().st_size, 'codepoints':cmap}
(output/'coverage.json').write_text(json.dumps(report, indent=2))

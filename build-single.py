import re, base64, pathlib
d = pathlib.Path('dist')
html = (d/'index.html').read_text(encoding='utf-8')
js   = next(d.glob('assets/index-*.js')).read_text(encoding='utf-8')
css  = next(d.glob('assets/index-*.css')).read_text(encoding='utf-8')
icon = base64.b64encode((d/'icon-180.png').read_bytes()).decode()
nt   = pathlib.Path('src/nt.json').read_text(encoding='utf-8')
morf = pathlib.Path('src/morf.json').read_text(encoding='utf-8')
ap   = pathlib.Path('src/aparato.json').read_text(encoding='utf-8')

# num módulo embutido o import dinâmico não resolve; os dados já vêm na página
js = re.sub(r'import\("\./nt-[^"]+\.js"\)',   'Promise.resolve({default:window.__NT__})',   js)
js = re.sub(r'import\("\./morf-[^"]+\.js"\)', 'Promise.resolve({default:window.__MORF__})', js)
js = re.sub(r'import\("\./aparato-[^"]+\.js"\)', 'Promise.resolve({default:window.__AP__})', js)

html = re.sub(r'\s*<script type="module"[^>]*src="[^"]*"></script>', '', html)
html = re.sub(r'\s*<link rel="stylesheet"[^>]*>', '', html)
html = re.sub(r'\s*<link rel="manifest"[^>]*>', '', html)
html = html.replace('href="./icon-180.png"', f'href="data:image/png;base64,{icon}"')
html = html.replace('</head>', f'<style>\n{css}\n</style>\n</head>')
html = html.replace('</body>',
    f'<script>window.__NT__={nt};window.__MORF__={morf};window.__AP__={ap};</script>\n'
    f'<script type="module">\n{js}\n</script>\n</body>')

out = pathlib.Path('/mnt/user-data/outputs/grego-react-teste.html')
out.write_text(html, encoding='utf-8')
print('HTML único:', round(out.stat().st_size/1024), 'KB')

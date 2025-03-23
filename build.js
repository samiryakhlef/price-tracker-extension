const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Assurez-vous que le dossier dist existe
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copier les fichiers statiques
const staticFiles = ['manifest.json', 'popup.html', 'images'];
staticFiles.forEach(file => {
  if (fs.existsSync(path.join('public', file))) {
    if (fs.lstatSync(path.join('public', file)).isDirectory()) {
      fs.cpSync(path.join('public', file), path.join('dist', file), { recursive: true });
    } else {
      fs.copyFileSync(path.join('public', file), path.join('dist', file));
    }
  }
});

// Configuration de build
const config = {
  entryPoints: ['src/index.jsx', 'src/background.js', 'src/content.js'],
  bundle: true,
  outdir: 'dist',
  loader: { '.js': 'jsx' },
  format: 'cjs',
  platform: 'browser',
  target: ['chrome58'],
  minify: true
};

// Build
esbuild.build(config).catch(() => process.exit(1));

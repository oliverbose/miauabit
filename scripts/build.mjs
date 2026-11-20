import { cp, mkdir, writeFile } from 'node:fs/promises';
import { languages, stops } from './content.mjs';
import { legalCopy } from './legal.mjs';
import { photos } from './photos.mjs';

const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const paw = '<span class="paw" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span>';
const start = 'petworth';

function footer(lang, siteLine) {
  const legal = legalCopy[lang];
  return `<footer class="shell footer">
  ${paw}<span>${escape(siteLine)}</span>
  <nav class="footer-legal" aria-label="${legal.navigation}">
    <a href="${legal.imprint.file}">${legal.imprint.title}</a>
    <a href="${legal.privacy.file}">${legal.privacy.title}</a>
  </nav>
</footer>`;
}

function renderLegal(lang, copy, page, preview) {
  const legal = legalCopy[lang];
  const { title, file } = legal[page];
  const otherLang = lang === 'de' ? 'en' : 'de';
  const otherFile = legalCopy[otherLang][page].file;
  const otherUrl = `https://${copy.other}/${otherFile}`;
  const switchTo = preview ? `../${otherLang}/${otherFile}` : otherUrl;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${preview ? '<meta name="robots" content="noindex">' : ''}
<title>${title} · ${copy.brand}</title>
<link rel="canonical" href="https://${copy.domain}/${file}">
<link rel="alternate" hreflang="${otherLang}" href="${otherUrl}">
<link rel="icon" href="assets/cats.webp">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="masthead shell">
  <a class="brand" href="./">${copy.brand}${paw}</a>
  <nav class="languages" aria-label="${lang === 'de' ? 'Sprache' : 'Language'}">
    <span aria-current="page">${lang.toUpperCase()}</span>
    <a href="${switchTo}" lang="${otherLang}" hreflang="${otherLang}" aria-label="${copy.otherLanguage}">${otherLang.toUpperCase()}</a>
  </nav>
</header>
<main class="shell legal-page">
  <a href="./">${legal.back}</a>
  <h1>${title}</h1>
  <p>${page === 'imprint' ? legal.siteType : legal.scope}</p>
  ${page === 'privacy' ? legal.sections.map(({ title, paragraphs, sources = [] }) => `<section>
    <h2>${title}</h2>
    ${paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('\n    ')}
    ${sources.map(([label, href]) => `<p><a href="${href}">${escape(label)}</a></p>`).join('\n    ')}
  </section>`).join('\n  ') : ''}
</main>
${footer(lang, copy.siteLine)}
</body>
</html>
`;
}

function render(lang, copy, preview = false) {
  const otherLang = lang === 'de' ? 'en' : 'de';
  const home = 'https://' + copy.domain + '/';
  const other = 'https://' + copy.other + '/';
  const switchTo = preview ? '../' + otherLang + '/' : other;
  const altIndex = lang === 'en' ? 1 : 2;
  const cover = photos.find((photo) => photo[3] === start);
  const views = ['atlantic', 'usa', 'berlin'];
  const photo = ([filename, ...details], loading = 'lazy') =>
    '<img src="assets/photos/' + filename + '" alt="' + escape(details[altIndex - 1]) + '" loading="' + loading + '">';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f7edda">
<meta name="description" content="${escape(copy.description)}">
<title>${copy.brand} · Jacques &amp; Xena</title>
<link rel="canonical" href="${home}">
<link rel="alternate" hreflang="${lang}" href="${home}">
<link rel="alternate" hreflang="${otherLang}" href="${other}">
<link rel="icon" href="assets/cats.webp">
<link rel="stylesheet" href="assets/style.css">
<script type="module" src="assets/journey.js"></script>
</head>
<body>
<a class="skip" href="#journey">${copy.skip}</a>
<header class="masthead shell">
  <a class="brand" href="./">${copy.brand}${paw}</a>
  <nav class="languages" aria-label="${lang === 'de' ? 'Sprache' : 'Language'}">
    <span aria-current="page">${lang.toUpperCase()}</span>
    <a data-language href="${switchTo}" lang="${otherLang}" hreflang="${otherLang}" aria-label="${copy.otherLanguage}">${otherLang.toUpperCase()}</a>
  </nav>
</header>
<main class="shell">
  <section class="hero">
    <img class="mascots" src="assets/cats.webp" width="640" height="381" alt="">
    <div class="hero-copy"><p>${escape(copy.intro)}</p><h1>${escape(copy.title)}</h1></div>
    <a class="destination" href="#moabit" data-stop="moabit"><span>${copy.nextStop}</span><strong>Moabit</strong><small>${copy.planned}</small></a>
  </section>
  <section class="journey" id="journey" aria-label="${copy.map}" data-journey>
    <div class="map-column">
      <div class="map-toolbar">
        <div class="views" hidden role="group" aria-label="${copy.map}">
          ${views.map((view) => `<button type="button" data-view="${view}" aria-pressed="${view === 'atlantic'}">${copy[view]}</button>`).join('')}
        </div>
        <button class="play" type="button" data-play hidden><span aria-hidden="true">▶</span> <span data-play-label>${copy.play}</span></button>
      </div>
      <div class="map" data-map data-view-name="atlantic">
        <div class="map-art" aria-hidden="true"></div>
        <canvas class="map-drawing" width="1000" height="500" aria-hidden="true"></canvas>
        <div class="map-pawprints" aria-hidden="true"></div>
        <template id="map-pawprint">${paw}</template>
        <div class="pins"></div>
        <span class="map-note">${copy.distant}</span>
      </div>
      <nav class="timeline" aria-label="${copy.timeline}">
        <ol>${stops.map(({id, [lang]: [name, date]}) =>
          `<li><a href="#${id}" data-stop="${id}"${id === start ? ' aria-current="step"' : ''}><span>${escape(name)}</span><small>${escape(date.split(' · ')[0])}</small></a></li>`).join('')}</ol>
      </nav>
    </div>
    <div class="story-column">
      <div class="postcard" aria-live="polite">
        <figure class="postcard-photo" ${cover ? '' : 'hidden'}>
          <button type="button" data-open-photo>${cover ? photo(cover, 'eager') : ''}</button>
          <figcaption>${copy.photoNote}</figcaption>
        </figure>
        ${stops.map(({id, [lang]: [name,date,heading,body]}) => `
        <article id="${id}" data-chapter>
          <p class="postmark">${escape(name)} <span>·</span> ${escape(date)}</p>
          <h2>${escape(heading)}</h2><p>${escape(body)}</p>
        </article>`).join('')}
        <div class="story-controls" hidden><button type="button" data-step="-1">${copy.previous}</button><button type="button" data-step="1">${copy.next}</button></div>
      </div>
    </div>
  </section>
  ${photos.length ? `<section class="album" aria-labelledby="album-heading">
    <header><h2 id="album-heading">${copy.gallery}</h2><p>${escape(copy.cast).replace('\n','<br>')}</p></header>
    <div class="album-grid">${photos.map((entry, index) => `<a href="assets/photos/${entry[0]}" data-photo="${index}">${photo(entry)}</a>`).join('')}</div>
  </section>
  <dialog aria-label="${copy.gallery}" class="lightbox">
    <form method="dialog"><button type="submit" aria-label="${copy.close}">×</button></form>
    <figure><img alt=""><figcaption></figcaption></figure>
    <div><button type="button" data-photo-step="-1">${copy.previousPhoto}</button><button type="button" data-photo-step="1">${copy.nextPhoto}</button></div>
  </dialog>` : ''}
</main>
${footer(lang, copy.siteLine)}
<script type="application/json" id="journey-data">${JSON.stringify({
  copy, photos: photos.map((entry) => [entry[0], entry[altIndex], entry[3] ?? null]),
  chapters: stops.map(({id, view, [lang]: [name]}) => ({id, view, name})),
  start,
}).replaceAll('<','\\u003c')}</script>
</body>
</html>
`;
}

for (const [lang, copy] of Object.entries(languages)) {
  for (const [directory, preview] of [['dist/' + copy.brand, false], ['dist/preview/' + lang, true]]) {
    await mkdir(directory, { recursive: true });
    await cp('public/assets', directory + '/assets', { recursive: true });
    await writeFile(directory + '/index.html', render(lang, copy, preview));
    for (const page of ['imprint', 'privacy']) {
      await writeFile(directory + '/' + legalCopy[lang][page].file, renderLegal(lang, copy, page, preview));
    }
  }
}

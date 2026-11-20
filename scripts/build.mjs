import { cp, mkdir, writeFile } from 'node:fs/promises';
import { languages, stops } from './content.mjs';
import { photos } from './photos.mjs';

const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const paw = '<span class="paw" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span>';
const start = 'petworth';
const cats = [['jacques', 'Jacques'], ['xena', 'Xena']];

function render(lang, copy, preview = false) {
  const otherLang = lang === 'de' ? 'en' : 'de';
  const home = 'https://' + copy.domain + '/';
  const other = 'https://' + copy.other + '/';
  const switchTo = preview ? '../' + otherLang + '/' : other;
  const altIndex = lang === 'en' ? 1 : 2;
  const views = ['atlantic', 'usa', 'berlin'];
  const photo = (entry) =>
    '<img src="assets/photos/' + entry[0] + '" alt="' + escape(entry[altIndex]) + '" loading="lazy">';
  const renderStop = ({id, [lang]: [name, date, heading, body]}) => {
    const photoIndex = photos.findIndex((entry) => entry[3] === id);
    const entry = photos[photoIndex];
    const current = id === start;
    return `<li class="timeline-stop">
      <article class="postcard" id="${id}" data-chapter${current ? ' data-active' : ''} tabindex="-1" aria-labelledby="${id}-heading">
        <div class="postcard-copy">
          ${id === 'petworth' ? `<p class="timeline-meet">${escape(copy.meet)}</p>` : ''}
          <p class="postmark"><a href="#${id}" data-stop="${id}"${current ? ' aria-current="step"' : ''}>${escape(name)}</a> <span>·</span> ${escape(date)}</p>
          <h3 id="${id}-heading">${escape(heading)}</h3>
          <p>${escape(body)}</p>
        </div>
        ${entry ? `<figure class="postcard-photo">
          <a href="assets/photos/${entry[0]}" data-photo="${photoIndex}">${photo(entry)}</a>
          <figcaption>${copy.photoNote}</figcaption>
        </figure>` : ''}
      </article>
    </li>`;
  };
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
      <div class="story-controls" hidden>
        <button type="button" data-step="-1">${copy.previous}</button>
        <output data-current-stop></output>
        <button type="button" data-step="1">${copy.next}</button>
      </div>
    </div>
    <section class="timeline" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading">${escape(copy.timeline)}</h2>
      <div class="timeline-branches">
        ${cats.map(([cat, name]) => `<div class="timeline-branch" data-cat="${cat}">
          <p class="timeline-cat" id="timeline-${cat}">${name}</p>
          <ol class="timeline-stops" aria-labelledby="timeline-${cat}">${stops.filter((stop) => stop.cat === cat).map(renderStop).join('')}</ol>
        </div>`).join('')}
      </div>
      <div class="timeline-join" aria-hidden="true"></div>
      <ol class="timeline-stops timeline-shared" aria-label="Jacques &amp; Xena">${stops.filter((stop) => !stop.cat).map(renderStop).join('')}</ol>
    </section>
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
<footer class="shell footer">${paw}<span>${copy.siteLine}</span></footer>
<script type="application/json" id="journey-data">${JSON.stringify({
  copy, photos: photos.map((entry) => [entry[0], entry[altIndex]]),
  chapters: stops.map(({id, view, cat, [lang]: [name]}) => ({id, view, cat, name})),
  start,
}).replaceAll('<','\\u003c')}</script>
</body>
</html>
`;
}

for (const [lang, copy] of Object.entries(languages)) {
  const directory = 'dist/' + copy.brand;
  await mkdir(directory, { recursive: true });
  await cp('public/assets', directory + '/assets', { recursive: true });
  await writeFile(directory + '/index.html', render(lang, copy));
  await mkdir('dist/preview/' + lang, { recursive: true });
  await cp('public/assets', 'dist/preview/' + lang + '/assets', { recursive: true });
  await writeFile('dist/preview/' + lang + '/index.html', render(lang, copy, true));
}

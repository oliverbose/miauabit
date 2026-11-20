const { copy, chapters, photos, start } = JSON.parse(document.querySelector('#journey-data').textContent);
const map = document.querySelector('[data-map]');
const pins = map.querySelector('.pins');
const pawprints = map.querySelector('.map-pawprints');
const pawprint = document.querySelector('#map-pawprint').content.firstElementChild;
const canvas = map.querySelector('canvas');
const ink = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const chapterArticles = [...document.querySelectorAll('[data-chapter]')];
const currentStop = document.querySelector('[data-current-stop]');
const viewButtons = [...document.querySelectorAll('[data-view]')];
const playButton = document.querySelector('[data-play]');
const playLabel = playButton.querySelector('[data-play-label]');
const languageLink = document.querySelector('[data-language]');
const baseLanguageUrl = languageLink.href;
const steps = [...document.querySelectorAll('[data-step]')];

const positions = {
  atlantic: {
    'north-carolina': [8, 84, 'right'],
    petworth: [13, 69, 'right'],
    brooklyn: [18, 59, 'right'],
    vermont: [18.5, 46, 'right'],
    flight: [52, 30, 'above'],
    friedrichshain: [94, 36, 'left'],
  },
  usa: {
    'north-carolina': [23, 81, 'right'],
    bethesda: [33, 52, 'left'],
    jacques: [44, 51, 'right'],
    petworth: [39, 61, 'right'],
    brooklyn: [59, 42, 'right'],
    vermont: [61, 22, 'right'],
  },
  berlin: {
    moabit: [26, 36, 'above'],
    friedrichshain: [74, 66, 'above'],
  },
};
const flightPath = [[13, 69], [34, 25], [64, 13], [94, 36]];
let selected = -1;
let view = 'atlantic';
let player = 'idle';
let tourTimer;
let flightFrame;
let flightProgress;

const point = ([x, y]) => [x * 10, y * 5];
const chapterIndex = (id) => chapters.findIndex((chapter) => chapter.id === id);

function trail(points, { curve = false, color = '#a5482c', width = 4, dash = [4, 9] } = {}) {
  const [startPoint, ...rest] = points.map(point);
  ink.beginPath();
  ink.moveTo(...startPoint);
  if (curve) ink.bezierCurveTo(...rest.flat());
  else rest.forEach((location) => ink.lineTo(...location));
  ink.strokeStyle = color;
  ink.lineWidth = width;
  ink.lineCap = 'round';
  ink.lineJoin = 'round';
  ink.setLineDash(dash);
  ink.stroke();
  ink.setLineDash([]);
}

function drawBerlin() {
  ink.fillStyle = '#e9ddba';
  ink.fillRect(0, 0, 1000, 500);
  const parks = [
    [[8, 23], [17, 19], [22, 28], [18, 46], [9, 43]],
    [[28, 58], [43, 52], [53, 55], [47, 73], [30, 79]],
    [[84, 31], [93, 26], [96, 45], [88, 53], [83, 46]],
  ];
  for (const park of parks) {
    ink.beginPath();
    ink.moveTo(...point(park[0]));
    park.slice(1).forEach((location) => ink.lineTo(...point(location)));
    ink.closePath();
    ink.fillStyle = '#aebe8e';
    ink.fill();
  }
  const streets = [
    [[0, 34], [31, 30], [53, 39], [67, 33], [100, 40]],
    [[0, 57], [25, 47], [42, 49], [59, 44], [100, 55]],
    [[0, 79], [24, 70], [60, 74], [77, 63], [100, 67]],
    [[14, 0], [17, 20], [24, 35], [20, 60], [28, 100]],
    [[33, 0], [37, 31], [42, 49], [39, 71], [47, 100]],
    [[61, 0], [58, 41], [64, 58], [61, 100]],
    [[80, 0], [77, 34], [73, 52], [78, 79], [81, 100]],
    [[91, 0], [89, 20], [85, 57], [94, 80], [95, 100]],
    [[0, 20], [34, 19], [55, 21], [81, 14], [100, 20]],
    [[2, 92], [42, 88], [70, 90], [100, 85]],
  ];
  streets.forEach((street) => trail(street, {color: '#f8f0d8', width: 9, dash: []}));
  trail([[-3, 53], [23, 81], [22, 16], [42, 51]], {curve: true, color: '#699f9f', width: 23, dash: []});
  trail([[42, 51], [65, 88], [64, 48], [101, 83]], {curve: true, color: '#699f9f', width: 23, dash: []});
  ink.fillStyle = '#295b64';
  ink.font = 'italic 20px Georgia';
  ink.fillText('Spree', 530, 351);
  trail([[74, 66], [64, 53], [54, 38], [26, 36]], {curve: true});
}

function drawPlane(t) {
  const curvePoint = (amount) => flightPath[0].map((_, axis) =>
    flightPath.reduce((sum, location, i) => {
      const weights = [(1 - amount) ** 3, 3 * (1 - amount) ** 2 * amount, 3 * (1 - amount) * amount ** 2, amount ** 3];
      return sum + location[axis] * weights[i];
    }, 0));
  const [x, y] = point(curvePoint(t));
  const [nextX, nextY] = point(curvePoint(t + 0.002));
  ink.save();
  ink.translate(x, y);
  ink.rotate(Math.atan2(nextY - y, nextX - x));
  ink.beginPath();
  ink.moveTo(-23, 0);
  ink.lineTo(-25, -10);
  ink.lineTo(-20, -10);
  ink.lineTo(-14, -4);
  ink.lineTo(-2, -5);
  ink.lineTo(-9, -20);
  ink.lineTo(-2, -20);
  ink.lineTo(9, -5);
  ink.lineTo(21, -4);
  ink.quadraticCurveTo(32, 0, 21, 4);
  ink.lineTo(9, 5);
  ink.lineTo(-2, 20);
  ink.lineTo(-9, 20);
  ink.lineTo(-2, 5);
  ink.lineTo(-14, 4);
  ink.lineTo(-20, 10);
  ink.lineTo(-25, 10);
  ink.closePath();
  ink.fillStyle = '#fff6e5';
  ink.strokeStyle = '#183640';
  ink.lineWidth = 2.5;
  ink.fill();
  ink.stroke();
  ink.restore();
}

function draw() {
  if (!ink) return;
  const scale = Math.min(devicePixelRatio, 2);
  const width = Math.round(canvas.clientWidth * scale);
  const height = Math.round(canvas.clientHeight * scale);
  if (width !== canvas.width || height !== canvas.height) {
    canvas.width = width;
    canvas.height = height;
  }
  ink.setTransform(width / 1000, 0, 0, height / 500, 0, 0);
  ink.clearRect(0, 0, 1000, 500);

  if (view === 'berlin') {
    drawBerlin();
    return;
  }
  const places = positions[view];
  const from = (id) => places[id].slice(0, 2);
  const sideColor = '#395f65';
  for (const destination of ['brooklyn', 'vermont']) {
    const [x, y] = from(destination);
    const [homeX, homeY] = from('petworth');
    trail([[homeX, homeY], [homeX - 12, homeY - 5], [x - 11, y], [x, y]], {curve: true, color: sideColor, width: 3});
  }
  if (view === 'usa') {
    trail([from('north-carolina'), [27, 64], from('bethesda'), from('petworth')]);
    trail([from('jacques'), from('petworth')], {color: sideColor, width: 3, dash: [2, 8]});
    return;
  }
  trail([from('north-carolina'), from('petworth')]);
  trail(flightPath, {curve: true, width: 5, dash: [5, 10]});
  if (flightProgress !== undefined) drawPlane(flightProgress);
  else drawPlane(0.65);
  ink.font = 'italic 22px Georgia';
  ink.textAlign = 'center';
  ink.fillStyle = '#315c64';
  ink.fillText(copy.ocean, 525, 350);
  ink.textAlign = 'start';
}

function renderMap(nextView) {
  pawprints.replaceChildren();
  view = nextView;
  map.dataset.viewName = view;
  for (const button of viewButtons) button.setAttribute('aria-pressed', button.dataset.view === view);
  const activeId = chapters[selected].id;
  const currentPins = new Map([...pins.children].map((pin) => [pin.dataset.stop, pin]));
  for (const [id, [x, y, placement]] of Object.entries(positions[view])) {
    const pin = currentPins.get(id) ?? document.createElement('a');
    pin.href = '#' + id;
    pin.dataset.stop = id;
    pin.className = 'pin';
    pin.style.left = x + '%';
    pin.style.top = y + '%';
    pin.toggleAttribute('data-active', id === activeId);
    if (id === activeId) pin.setAttribute('aria-current', 'step');
    else pin.removeAttribute('aria-current');
    const label = document.createElement('span');
    label.className = 'pin-label ' + placement;
    label.textContent = view === 'atlantic' && id === 'friedrichshain'
      ? copy.berlin : chapters[chapterIndex(id)].name;
    const dot = document.createElement('span');
    dot.className = 'pin-dot';
    dot.setAttribute('aria-hidden', 'true');
    pin.replaceChildren(dot, label);
    if (!pin.isConnected) pins.append(pin);
    currentPins.delete(id);
  }
  currentPins.forEach((pin) => pin.remove());
  draw();
}

function animatePawprints(previousId, nextId) {
  if (reducedMotion.matches) return;
  const width = map.clientWidth;
  const height = map.clientHeight;
  const toPixels = ([x, y]) => [x * width / 100, y * height / 100];
  const places = positions[view];
  const [endX, endY] = toPixels(places[nextId]);
  const [startX, startY] = places[previousId]
    ? toPixels(places[previousId])
    : [endX + (endX < width / 2 ? 1 : -1) * Math.min(130, width / 3),
       endY + (endY < height / 2 ? 1 : -1) * Math.min(58, height / 4)];
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy);
  if (distance < 24) return;

  const heading = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  const count = Math.max(2, Math.min(8, Math.floor(distance / 23)));
  const padding = Math.min(25, distance / 4);
  for (let i = 0; i < count; i++) {
    const progress = (padding + (distance - 2 * padding) * i / (count - 1)) / distance;
    const offset = i % 2 === 0 ? 6 : -6;
    const x = startX + dx * progress - dy / distance * offset;
    const y = startY + dy * progress + dx / distance * offset;
    const print = pawprint.cloneNode(true);
    print.style.left = x + 'px';
    print.style.top = y + 'px';
    print.style.setProperty('--heading', (heading + offset) + 'deg');
    print.style.setProperty('--delay', i * 85 + 'ms');
    print.addEventListener('animationend', () => print.remove(), {once: true});
    pawprints.append(print);
  }
}

function runFlight() {
  if (reducedMotion.matches) return;
  let began;
  const frame = (now) => {
    began ??= now;
    const progress = Math.min((now - began) / 2200, 1);
    flightProgress = 0.10 + progress * 0.85;
    draw();
    if (progress < 1) flightFrame = requestAnimationFrame(frame);
  };
  flightFrame = requestAnimationFrame(frame);
}

function select(index, { updateUrl = true, keepView = false } = {}) {
  if (index < 0 || index >= chapters.length) return;
  const previousIndex = selected;
  selected = index;
  const chapter = chapters[index];
  cancelAnimationFrame(flightFrame);
  flightProgress = undefined;
  for (const article of chapterArticles) {
    const active = article.id === chapter.id;
    const link = article.querySelector('[data-stop]');
    article.toggleAttribute('data-active', active);
    if (active) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  }
  currentStop.value = chapter.name;
  steps[0].disabled = index === 0;
  steps[1].disabled = index === chapters.length - 1;
  const hash = '#' + chapter.id;
  if (updateUrl && location.hash !== hash) history.pushState(null, '', hash);
  languageLink.href = baseLanguageUrl + hash;
  renderMap(keepView ? view : chapter.view);
  const previousChapter = chapters[previousIndex];
  if (previousChapter && index > previousIndex && (!chapter.cat || chapter.cat === previousChapter.cat)) {
    animatePawprints(previousChapter.id, chapter.id);
  }
  if (chapter.id === 'flight' && view === 'atlantic') runFlight();
}

function setPlayer(state) {
  clearTimeout(tourTimer);
  player = state;
  playButton.firstElementChild.textContent = state === 'playing' ? 'Ⅱ' : '▶';
  playLabel.textContent = { playing: copy.pause, ended: copy.replay }[state] ?? copy.play;
}

function scheduleNext() {
  tourTimer = setTimeout(() => {
    if (selected === chapters.length - 1) {
      setPlayer('ended');
      return;
    }
    select(selected + 1, {updateUrl: false});
    scheduleNext();
  }, 7000);
}

playButton.addEventListener('click', () => {
  if (player === 'playing') {
    setPlayer('paused');
    return;
  }
  const restart = player !== 'paused';
  setPlayer('playing');
  if (restart) select(0, {updateUrl: false});
  scheduleNext();
});

for (const button of viewButtons) {
  button.addEventListener('click', () => {
    setPlayer('idle');
    cancelAnimationFrame(flightFrame);
    flightProgress = undefined;
    renderMap(button.dataset.view);
  });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-stop]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const id = link.dataset.stop;
  setPlayer('idle');
  select(chapterIndex(id));
  if (!link.closest('.postcard')) {
    const article = document.getElementById(id);
    article.focus({preventScroll: true});
    article.scrollIntoView({block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
});

for (const button of steps) {
  button.addEventListener('click', () => {
    setPlayer('idle');
    select(selected + Number(button.dataset.step));
    if (button.disabled) steps.find((step) => !step.disabled).focus();
  });
}

function restoreChapter() {
  setPlayer('idle');
  const index = chapterIndex(location.hash.slice(1));
  select(index >= 0 ? index : chapterIndex(start), {updateUrl: false, keepView: index < 0 && view === 'atlantic'});
}
window.addEventListener('popstate', restoreChapter);
window.addEventListener('hashchange', () => {
  if (chapterIndex(location.hash.slice(1)) !== selected) restoreChapter();
});
new ResizeObserver(draw).observe(canvas);

const dialog = document.querySelector('.lightbox');
if (dialog && typeof dialog.showModal === 'function') {
  const fullPhoto = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const [file, alt] = photos[photoIndex];
    fullPhoto.src = 'assets/photos/' + file;
    fullPhoto.alt = alt;
    caption.textContent = alt;
    if (!dialog.open) dialog.showModal();
  }
  for (const link of document.querySelectorAll('a[data-photo]')) {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(Number(link.dataset.photo));
    });
  }
  for (const button of dialog.querySelectorAll('[data-photo-step]')) {
    button.addEventListener('click', () => showPhoto(photoIndex + Number(button.dataset.photoStep)));
  }
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
}
restoreChapter();
playButton.hidden = false;
document.querySelector('.views').hidden = false;
document.querySelector('.story-controls').hidden = false;

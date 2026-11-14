// Homepage: live operations board (illustrative data). Loaded only by index.html.
(function () {
  'use strict';

  var board = document.querySelector('[data-ops]');
  if (!board) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.slice.call(board.querySelectorAll('.ops-row'));
  var totalEl = board.querySelector('[data-ops-total]');
  var clockEl = board.querySelector('[data-ops-clock]');
  var feedEl = board.querySelector('[data-ops-feed]');
  var fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  var names = rows.map(function (r) { return r.querySelector('.ops-name').textContent; });
  var amounts = rows.map(function (r) { return parseInt(r.getAttribute('data-amt'), 10); });
  var events = [
    'submitted the daily report',
    'entered delivery sales',
    'updated deposits',
    'logged a register reading',
    'closed out the day'
  ];
  function minsAgo(n) {
    return new Date(Date.now() - n * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function render(hitIndex) {
    var max = Math.max.apply(null, amounts);
    var sum = 0;
    rows.forEach(function (row, i) {
      sum += amounts[i];
      row.querySelector('.ops-amt').textContent = fmt.format(amounts[i]);
      row.querySelector('.ops-track b').style.setProperty('--w', Math.round((amounts[i] / max) * 100));
      row.classList.toggle('is-hit', i === hitIndex);
    });
    totalEl.textContent = fmt.format(sum);
  }

  function clock() {
    clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }

  function pushFeed(i) {
    var li = document.createElement('li');
    li.className = 'is-new';
    var t = document.createElement('time');
    t.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    var s = document.createElement('span');
    var b = document.createElement('b');
    b.textContent = names[i];
    s.appendChild(b);
    s.appendChild(document.createTextNode(' ' + events[Math.floor(Math.random() * events.length)]));
    li.appendChild(t);
    li.appendChild(s);
    feedEl.insertBefore(li, feedEl.firstChild);
    while (feedEl.children.length > 3) feedEl.removeChild(feedEl.lastChild);
  }

  Array.prototype.forEach.call(feedEl.children, function (li, k) {
    li.querySelector('time').textContent = minsAgo((k + 1) * 3);
    li.querySelector('b').textContent = names[(k * 3 + 1) % names.length];
  });
  rows.forEach(function (row, i) { row.style.setProperty('--i', i); });
  render(-1);
  clock();
  setInterval(clock, 1000);
  if (reduced) return;

  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(board);
  }

  var tick = 0;
  setInterval(function () {
    if (!visible || document.hidden) return;
    var i = Math.floor(Math.random() * rows.length);
    amounts[i] += 35 + Math.floor(Math.random() * 150);
    render(i);
    if (++tick % 2 === 0) pushFeed(i);
    setTimeout(function () { rows[i].classList.remove('is-hit'); }, 900);
  }, 1800);
})();

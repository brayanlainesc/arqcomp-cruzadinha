const CHAVE = 'cacacomp_partidas', N = 20, LIMITE = 3600000;
// [palavra no tabuleiro, forma legível] — mesma ordem do PDF e do dicas.js
const PALAVRAS = [['CPU', 'CPU'], ['ULA', 'ULA'], ['UC', 'UC'], ['REGISTRADORES', 'Registradores'], ['RAM', 'RAM'], ['ROM', 'ROM'], ['EEPROM', 'EEPROM'], ['FLASH', 'Flash'], ['CACHE', 'Cache'], ['MEMORIADEMASSA', 'Memória de massa'], ['DMA', 'DMA'], ['ADDRESSBUS', 'Address bus'], ['DATABUS', 'Data bus'], ['MICROCONTROLADOR', 'Microcontrolador'], ['DUALCORE', 'Dual core'], ['QUADCORE', 'Quad core']];
const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
const $ = s => document.querySelector(s);
const fmt = ms => { const t = Math.min(Math.floor(ms / 1000), 3599); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0') };
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || [] } catch (e) { return [] } };
const salvar = p => { const l = ler(); p.rodada = l.length + 1; l.push(p); try { localStorage.setItem(CHAVE, JSON.stringify(l)) } catch (e) { } };
const irMenu = () => { location.href = 'index.html' };

function menu() {
  const l = ler();
  $('#corpo').innerHTML = l.length ? l.slice().reverse().map(p => `<tr><td>${p.rodada}</td><td>${p.acertos} de 16</td><td>${fmt(p.tempo)}</td></tr>`).join('') : '<tr><td colspan="3" class="vazio">Nenhuma partida ainda.</td></tr>';
  const c = l.filter(p => p.completa).sort((a, b) => a.tempo - b.tempo)[0];
  if (c) $('#pb').textContent = `Rodada ${c.rodada} · ${fmt(c.tempo)}`;
}

function gerar() {
  const ordem = PALAVRAS.map(p => p[0]).sort((a, b) => b.length - a.length);
  for (let t = 0; t < 500; t++) {
    const g = Array.from({ length: N }, () => Array(N).fill(''));
    let ok = true;
    for (const w of ordem) {
      let put = false;
      for (let k = 0; k < 300 && !put; k++) {
        const [dr, dc] = DIRS[Math.random() * 8 | 0], r = Math.random() * N | 0, c = Math.random() * N | 0;
        const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
        if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
        let cabe = true;
        for (let i = 0; i < w.length; i++) { const x = g[r + dr * i][c + dc * i]; if (x && x !== w[i]) { cabe = false; break } }
        if (!cabe) continue;
        for (let i = 0; i < w.length; i++)g[r + dr * i][c + dc * i] = w[i];
        put = true;
      }
      if (!put) { ok = false; break }
    }
    if (ok) {
      const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return g.map(l => l.map(x => x || A[Math.random() * 26 | 0]));
    }
  }
}

// Fundo de placa-mãe: trilhas retas perpendiculares com vértices no centro das células (viewBox 20x20 = 1 unidade por célula)
function placa() {
  const R = (a, b) => a + Math.random() * (b - a), I = (a, b) => Math.floor(R(a, b + 1)), K = '#1b3a14', D = '#010a04';
  let s = '<svg class="placa" viewBox="0 0 20 20" preserveAspectRatio="none"><defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#04150a"/><stop offset="1" stop-color="#020b05"/></linearGradient><pattern id="pt" width=".32" height=".32" patternUnits="userSpaceOnUse"><circle cx=".16" cy=".16" r=".06" fill="#010804"/></pattern></defs><rect width="20" height="20" fill="url(#gp)"/>', pads = '';
  for (let i = 0; i < 5; i++)s += `<rect x="${I(0, 14)}" y="${I(0, 14)}" width="${I(3, 6)}" height="${I(3, 6)}" fill="url(#pt)"/>`;
  for (let t = 0; t < 45; t++) {
    let x = I(0, 19) + .5, y = I(0, 19) + .5, h = Math.random() < .5; const pts = [[x, y]];
    for (let k = I(2, 4); k--;) { const d = (Math.random() < .5 ? -1 : 1) * I(1, 6); if (h) x = Math.min(19.5, Math.max(.5, x + d)); else y = Math.min(19.5, Math.max(.5, y + d)); pts.push([x, y]); h = !h }
    const p = pts.map(q => q.join(',')).join(' ');
    s += `<polyline points="${p}" fill="none" stroke="${D}" stroke-width=".2" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${p}" fill="none" stroke="${K}" stroke-width=".045" stroke-linejoin="round" stroke-linecap="round"/>`;
    for (const q of [pts[0], pts[pts.length - 1]]) pads += `<circle cx="${q[0]}" cy="${q[1]}" r=".2" fill="${D}" stroke="${K}" stroke-width=".05"/><circle cx="${q[0]}" cy="${q[1]}" r=".07" fill="#2f4a1c"/>`;
  }
  for (let i = 0; i < 3; i++) { const x = I(1, 15), y = I(1, 15), w = I(2, 4), h = I(2, 4); s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".12" fill="#010804" stroke="${K}" stroke-width=".04"/><rect x="${x - .1}" y="${y - .1}" width="${w + .2}" height="${h + .2}" fill="none" stroke="#36402a" stroke-width=".1" stroke-dasharray=".1 .12"/>` }
  return s + pads + '</svg>';
}

function modal(titulo, texto, botoes) {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="caixa"><h2>${titulo}</h2><p>${texto}</p><div class="acoes"></div></div>`;
  botoes.forEach(([t, f]) => { const b = document.createElement('button'); b.className = 'btn'; b.textContent = t; b.onclick = () => { m.remove(); if (f) f() }; m.querySelector('.acoes').append(b) });
  document.body.append(m);
}

function jogo() {
  const grade = gerar(), els = [], achadas = new Set();
  let estado = 'ini', acc = 0, t0 = 0, timer = null, sel = [];
  const tab = $('#tabuleiro'), aviso = $('#aviso'), bj = $('#btn-jogo'), bs = $('#btn-sair');
  tab.insertAdjacentHTML('afterbegin', placa());
  for (let r = 0; r < N; r++)for (let c = 0; c < N; c++) { const d = document.createElement('div'); d.className = 'c'; d.dataset.r = r; d.dataset.c = c; d.textContent = grade[r][c]; $('#celulas').append(d); els.push(d) }
  const tem = typeof DICAS !== 'undefined' && Array.isArray(DICAS);
  $('#dicas').innerHTML = (tem && DICAS.length === 16 ? '' : '<li class="erro">Aviso: o arquivo dicas.js deve conter exatamente 16 dicas.</li>') + PALAVRAS.map((p, i) => `<li id="d${i}"><b>${i + 1}.</b> ${(tem && DICAS[i]) || '(dica ausente)'}</li>`).join('');

  const dec = () => acc + (estado === 'run' ? Date.now() - t0 : 0);
  const cobrir = m => { tab.classList.toggle('coberto', !!m); $('#dicas').classList.toggle('ofusc', !!m); $('#capa').textContent = m || '' };
  const pintar = () => { els.forEach(e => e.classList.remove('sel')); sel.forEach(([r, c]) => els[r * N + c].classList.add('sel')) };
  cobrir('Clique em “Começar”');

  function encerrar(completa, tempo) {
    const t = tempo === undefined ? dec() : tempo;
    estado = 'fim'; clearInterval(timer); sel = []; pintar(); bj.disabled = true;
    salvar({ acertos: achadas.size, tempo: t, completa });
    return t;
  }
  function tempoEsgotado() {
    if (estado === 'fim') return;
    encerrar(false, LIMITE); $('#cron').textContent = '59:59';
    modal('Tempo esgotado', 'Passou de 59:59. A partida foi encerrada por desistência automática.', [['Voltar ao menu', irMenu]]);
  }
  function vitoria() {
    const t = encerrar(true); $('#cron').textContent = fmt(t);
    setTimeout(() => modal('Parabéns!', `Você encontrou as 16 palavras em ${fmt(t)}.`, [['Voltar ao menu', irMenu]]), 1300);
  }
  function conferir() {
    const s = sel.map(([r, c]) => grade[r][c]).join(''), v = [...s].reverse().join('');
    const i = PALAVRAS.findIndex((p, k) => !achadas.has(k) && (p[0] === s || p[0] === v));
    if (i < 0) return;
    achadas.add(i);
    const usadas = sel.map(([r, c]) => els[r * N + c]); sel = []; pintar();
    usadas.forEach(e => e.classList.add('piscar', 'ach'));
    setTimeout(() => usadas.forEach(e => e.classList.remove('piscar')), 1300);
    $('#d' + i).classList.add('achada');
    $('#achadas').insertAdjacentHTML('beforeend', `<li>${PALAVRAS[i][1]}</li>`);
    $('#fracao').textContent = `${achadas.size}/16`;
    aviso.textContent = PALAVRAS[i][1]; aviso.style.transition = 'none'; aviso.style.opacity = 1;
    void aviso.offsetWidth; aviso.style.transition = 'opacity 1.8s ease .6s'; aviso.style.opacity = 0;
    if (achadas.size === 16) vitoria();
  }

  bj.onclick = () => {
    if (estado === 'run') { acc += Date.now() - t0; estado = 'pausa'; sel = []; pintar(); cobrir('Jogo pausado'); bj.textContent = 'Continuar' }
    else if (estado === 'ini' || estado === 'pausa') {
      if (estado === 'ini') bs.textContent = 'Desistir';
      estado = 'run'; t0 = Date.now(); cobrir(false); bj.textContent = 'Pausar';
      if (!timer) timer = setInterval(() => { const e = dec(); $('#cron').textContent = fmt(e); if (e >= LIMITE) tempoEsgotado() }, 250);
    }
  };
  bs.onclick = () => {
    if (estado === 'ini') return irMenu();
    if (estado === 'fim') return;
    modal('Desistir?', 'A partida será registrada com os acertos e o tempo até agora.', [['Continuar jogando'], ['Desistir', () => { if (estado !== 'fim') { encerrar(false); irMenu() } }]]);
  };
  tab.addEventListener('click', e => {
    const el = e.target.closest('.c');
    if (!el || estado !== 'run') return;
    const r = +el.dataset.r, c = +el.dataset.c, u = sel[sel.length - 1];
    if (!u) sel = [[r, c]];
    else if (sel.length === 1) {
      if (u[0] === r && u[1] === c) sel = [];
      else if (Math.max(Math.abs(r - u[0]), Math.abs(c - u[1])) === 1) sel.push([r, c]);
      else sel = [[r, c]];
    } else {
      const dr = sel[1][0] - sel[0][0], dc = sel[1][1] - sel[0][1];
      if (r === u[0] + dr && c === u[1] + dc) sel.push([r, c]); else sel = [[r, c]];
    }
    pintar(); conferir();
  });
}

if (document.body.dataset.pagina === 'menu') menu(); else jogo();
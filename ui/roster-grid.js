/* GRADE DE PERSONAGENS (quadrados só com o retrato) + PAINEL DE INFORMAÇÕES.
   PC: passar o mouse mostra o painel; clicar seleciona.
   Celular: 1º toque mostra o painel; 2º toque no mesmo quadrado seleciona. */
(function () {
  const PORTRAIT = 128;

  function drawSquare(cv, def, t, hover, colors) {
    const g = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    g.clearRect(0, 0, w, h);
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, VF.M.hexA(def.color, hover ? 0.95 : 0.75));
    bg.addColorStop(1, '#10081e');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    // raios decorativos
    g.save();
    g.globalAlpha = 0.18;
    g.translate(w / 2, h * 0.4);
    g.rotate(t * 0.3);
    g.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); g.fillRect(-3, 0, 6, w); }
    g.restore();
    const bob = hover ? Math.sin(t * 6) * 3 : 0;
    const skin = def.skin;
    if (def.partnerSkin) {
      VF.Rig.portrait(g, def.partnerSkin, w * 0.34, h * 0.64 + bob, w * 0.72, { t, expr: hover ? 'happy' : 'normal' });
      VF.Rig.portrait(g, skin, w * 0.62, h * 0.66 + bob, w * 0.78, { t, expr: hover ? 'happy' : 'normal', colors });
    } else {
      VF.Rig.portrait(g, skin, w / 2, h * 0.64 + bob, w * 0.95, { t, expr: hover ? 'happy' : 'normal', colors, fighter: { state: hover ? 'victory' : 'idle' } });
    }
  }

  function bar(v, color) {
    const n = Math.round(v);
    let h = '';
    for (let i = 0; i < 10; i++) h += `<i class="${i < n ? 'on' : ''}" style="${i < n ? 'background:' + color : ''}"></i>`;
    return h;
  }

  VF.RosterGrid = function (container, opts) {
    opts = opts || {};
    const grid = VF.UI.el('div', 'roster-grid', null, container);
    const items = [];
    let hover = null, lastTap = null;
    for (const def of VF.CHARACTERS) {
      const b = VF.UI.el('button', 'sq', `<canvas width="${PORTRAIT}" height="${PORTRAIT}"></canvas><span class="sq-mark"></span>`, grid);
      b.type = 'button';
      b.setAttribute('data-nav', '');
      b.setAttribute('aria-label', def.name);
      b.dataset.id = def.id;
      b.style.setProperty('--c', def.color);
      const it = { def, el: b, cv: b.querySelector('canvas'), dirty: true };
      items.push(it);
      const show = () => {
        if (hover === def.id) return;
        hover = def.id;
        VF.Audio.play('hover');
        items.forEach((x) => { x.el.classList.toggle('hover', x === it); x.dirty = true; });
        if (opts.onHover) opts.onHover(def.id);
      };
      b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(); });
      b.addEventListener('focus', show);
      b.addEventListener('click', () => {
        if (performance.now() - VF.Game.sceneAt < 280) return;
        VF.Audio.unlock();
        const touchLike = VF.Device.touch;
        if (touchLike && lastTap !== def.id) {
          // celular: primeiro toque só mostra as informações
          lastTap = def.id;
          show();
          VF.Audio.play('click');
          return;
        }
        lastTap = null;
        show();
        if (opts.onPick) opts.onPick(def.id);
      });
    }
    return {
      el: grid,
      items,
      get hover() { return hover; },
      setHover(id) { const it = items.find((x) => x.def.id === id); if (it) { hover = null; it.el.dispatchEvent(new Event('focus')); } },
      mark(id, text, cls) {
        const it = items.find((x) => x.def.id === id);
        if (!it) return;
        const m = it.el.querySelector('.sq-mark');
        m.textContent = text;
        it.el.classList.add(cls || 'marked');
      },
      clearMarks() {
        items.forEach((x) => { x.el.querySelector('.sq-mark').textContent = ''; x.el.classList.remove('marked', 'picked', 'picked2'); });
      },
      render(t) {
        for (const it of items) {
          const h = it.def.id === hover;
          if (h || it.dirty) {
            drawSquare(it.cv, it.def, t, h);
            it.dirty = false;
          }
        }
      }
    };
  };

  /* Painel de informações com retrato grande animado */
  VF.InfoPanel = function (container, opts) {
    opts = opts || {};
    const el = VF.UI.el('div', 'info-panel panel', null, container);
    el.innerHTML = `<div class="ip-top"><canvas class="ip-portrait" width="220" height="220"></canvas>
        <div class="ip-head"><div class="ip-name"></div><div class="ip-title"></div><div class="ip-style"></div></div></div>
      <div class="ip-desc"></div>
      <div class="ip-bars"></div>
      <div class="ip-move ip-sp"></div>
      <div class="ip-move ip-ult"></div>
      <div class="ip-combo"></div>
      <div class="ip-parody"></div>
      <div class="ip-actions"></div>`;
    const cv = el.querySelector('.ip-portrait');
    let def = null, puppet = null;
    const api = {
      el,
      show(id) {
        def = VF.getCharacter(id);
        puppet = new VF.Puppet(id);
        el.style.setProperty('--c', def.color);
        el.querySelector('.ip-name').textContent = def.fullName || def.name;
        el.querySelector('.ip-title').textContent = def.title;
        el.querySelector('.ip-style').innerHTML = `<b>ESTILO:</b> ${def.style}`;
        el.querySelector('.ip-desc').textContent = `"${def.desc}"`;
        el.querySelector('.ip-bars').innerHTML = [['FORÇA', def.stats.power, '#ff5252'], ['VELOCIDADE', def.stats.speed, '#ffd600'], ['DEFESA', def.stats.defense, '#29b6f6']]
          .map(([l, v, c]) => `<div class="ipb"><span>${l}</span><div class="segs">${bar(v, c)}</div><b class="ipv">${v}</b></div>`).join('');
        el.querySelector('.ip-sp').innerHTML = `<span class="tag">ESPECIAL</span><b>${def.special.icon} ${def.special.name}</b><p>${def.special.desc}</p>`;
        el.querySelector('.ip-ult').innerHTML = `<span class="tag ult">ULTIMATE</span><b>🔥 ${def.ultimate.name}</b><p>${def.ultimate.desc}</p>`;
        el.querySelector('.ip-combo').innerHTML = opts.combo === false ? '' : `<span class="tag combo">COMBO</span> ${def.combo || ''}`;
        el.querySelector('.ip-parody').textContent = def.parody ? '⚠️ Caricatura/paródia fictícia: poderes são apenas humor de videogame.' : '';
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
      },
      get def() { return def; },
      actions(html) { el.querySelector('.ip-actions').innerHTML = ''; return el.querySelector('.ip-actions'); },
      render(dt, t) {
        if (!puppet) return;
        puppet.update(dt);
        const g = cv.getContext('2d');
        g.clearRect(0, 0, cv.width, cv.height);
        const rg = g.createRadialGradient(110, 110, 10, 110, 110, 130);
        rg.addColorStop(0, VF.M.hexA(def.color, 0.6));
        rg.addColorStop(1, 'rgba(10,5,20,0)');
        g.fillStyle = rg;
        g.fillRect(0, 0, 220, 220);
        if (opts.fullBody) puppet.draw(g, 110, 212, 0.82, 1);
        else {
          if (def.partnerSkin) VF.Rig.portrait(g, def.partnerSkin, 70, 150 + Math.sin(t * 3) * 3, 150, { t, expr: 'happy' });
          VF.Rig.portrait(g, def.skin, def.partnerSkin ? 140 : 110, 150 + Math.sin(t * 3) * 3, def.partnerSkin ? 170 : 205, { t, expr: Math.sin(t * 1.3) > 0.6 ? 'happy' : 'normal' });
        }
      },
      puppet: () => puppet
    };
    return api;
  };
})();

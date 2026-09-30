/* Núcleo do jogo: loop com passo fixo, gerenciador de cenas e escala da tela */
(function () {
  const C = VF.CONFIG;

  VF.Session = {
    mode: 'cpu',          // cpu | pvp | demo
    difficulty: 'normal',
    p1: null,
    p2: null,
    arena: null
  };

  VF.Game = {
    scenes: {},
    scene: null,
    sceneName: '',
    speed: 1,
    t: 0,
    fps: 60,
    acc: 0,
    sceneAt: 0,

    register(name, scene) { this.scenes[name] = scene; },

    go(name, params) {
      if (this.scene && this.scene.exit) this.scene.exit();
      VF.Audio.baseMusic = null;
      VF.UI.clear();
      VF.Touch.show(false);
      this.sceneName = name;
      this.sceneAt = performance.now();
      this.scene = this.scenes[name];
      document.body.dataset.scene = name;
      if (this.scene.enter) this.scene.enter(params || {});
    },

    init() {
      this.canvas = document.getElementById('game');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
      // Safari no iPhone: a barra de endereço aparece/some sem disparar 'resize' sempre
      if (window.visualViewport) window.visualViewport.addEventListener('resize', () => this.resize());
      this.last = performance.now();
      requestAnimationFrame((ts) => this.loop(ts));
    },

    resize() {
      const w = window.innerWidth, h = window.innerHeight;
      const s = Math.min(w / C.WIDTH, h / C.HEIGHT);
      const cw = Math.floor(C.WIDTH * s), ch = Math.floor(C.HEIGHT * s);
      const st = this.canvas.style;
      st.width = cw + 'px';
      st.height = ch + 'px';
      st.left = Math.floor((w - cw) / 2) + 'px';
      st.top = Math.floor((h - ch) / 2) + 'px';
      const root = document.documentElement.style;
      root.setProperty('--stage-w', cw + 'px');
      root.setProperty('--stage-h', ch + 'px');
      root.setProperty('--stage-x', Math.floor((w - cw) / 2) + 'px');
      root.setProperty('--stage-y', Math.floor((h - ch) / 2) + 'px');
      document.body.classList.toggle('portrait', h > w);
    },

    loop(ts) {
      requestAnimationFrame((t) => this.loop(t));
      let dt = (ts - this.last) / 1000;
      this.last = ts;
      if (dt > 0.25) dt = 0.25;
      if (dt < 0) dt = 0;
      this.fps = this.fps * 0.95 + (1 / Math.max(dt, 0.001)) * 0.05;
      this.acc += dt * this.speed;
      const F = C.FIXED_DT;
      const maxSteps = 10 * this.speed;
      let n = 0;
      while (this.acc >= F && n < maxSteps) {
        this.t += F;
        try {
          if (this.scene && this.scene.update) this.scene.update(F);
        } catch (e) {
          console.error(e);
        }
        VF.Keyboard.endFrame();
        this.acc -= F;
        n++;
      }
      if (n >= maxSteps) this.acc = 0;
      const ctx = this.ctx;
      try {
        if (this.scene && this.scene.render) this.scene.render(ctx, dt);
      } catch (e) {
        console.error(e);
      }
      if (VF.Settings.data.showFps) {
        ctx.font = "16px monospace";
        ctx.fillStyle = '#0f0';
        ctx.textAlign = 'left';
        ctx.fillText(Math.round(this.fps) + ' FPS', 8, C.HEIGHT - 10);
      }
    }
  };

  /* Fundo compartilhado entre as telas de menu (continuidade da animação) */
  VF.menuBG = function () {
    if (!VF._menuBG) VF._menuBG = VF.Backgrounds.menu.create();
    return VF._menuBG;
  };
  VF.drawMenuBG = function (ctx, dt, fighters) {
    const st = VF.menuBG();
    st.showFighters = fighters !== false;
    VF.Backgrounds.menu.draw(ctx, VF.Game.t, st, dt);
  };

  VF.logoHTML = function (small) {
    return `<div class="logo ${small ? 'logo-small' : ''}">
      <div class="logo-vini">VINI</div>
      <div class="logo-fight">FIGHT</div>
      <div class="logo-sub">⚡ EDIÇÃO BRASIL ⚡</div>
    </div>`;
  };

  VF.DISCLAIMER = 'Jogo fictício e humorístico. Personagens baseados em pessoas públicas (Lula, Jair Bolsonaro, Xandao, Albert Einstein) são caricaturas/paródias; nenhum poder, habilidade ou comportamento do jogo representa fatos sobre pessoas reais.';
})();

/* HOW TO PLAY: controles, golpes direcionais, combos, SPECIAL, ULTIMATE e rounds */
VF.Game.register('howto', {
  enter() {
    const b = VF.Settings.data.bindings;
    const K = (p, a) => `<kbd>${VF.keyLabel(b[p][a][0])}</kbd>`;
    const row = (a) => `<tr><td>${VF.ACTION_LABELS[a]}</td><td>${K('p1', a)}</td><td>${K('p2', a)}</td></tr>`;
    const s = VF.UI.screen('howto-screen');
    s.innerHTML = `<h1 class="title">HOW TO PLAY</h1>
      <div class="panel howto-panel">
        <section><h2>⌨️ CONTROLES NO PC</h2>
          <table class="keys"><tr><th>Ação</th><th>Player 1</th><th>Player 2</th></tr>${VF.ACTIONS.map(row).join('')}</table>
          <p>Todas as teclas podem ser trocadas em SETTINGS. Pausa: <kbd>Esc</kbd> ou <kbd>P</kbd>.</p>
        </section>
        <section><h2>🥋 GOLPES DE CADA PERSONAGEM</h2>
          <table class="keys">
            <tr><td>Ataque leve / Chute / Pesado</td><td>${K('p1', 'punch')} / ${K('p1', 'kick')} / ${K('p1', 'heavy')}</td></tr>
            <tr><td>Ataque baixo</td><td>segure ${K('p1', 'down')} + leve ou chute</td></tr>
            <tr><td>Rasteira (derruba)</td><td>segure ${K('p1', 'down')} + pesado</td></tr>
            <tr><td>Ataque para frente (arremessa na parede)</td><td>para frente + pesado</td></tr>
            <tr><td>Ataque para trás (LANÇADOR)</td><td>para trás + qualquer ataque</td></tr>
            <tr><td>Ataque aéreo / Aéreo pesado (bate no chão)</td><td>no ar: leve ou chute / pesado</td></tr>
            <tr><td>Agarrão (não pode ser defendido)</td><td>${K('p1', 'grab')}</td></tr>
            <tr><td>Dash / corrida</td><td>toque duas vezes na direção</td></tr>
            <tr><td>Defesa</td><td>segure ${K('p1', 'down')}</td></tr>
          </table>
        </section>
        <section><h2>🔥 SISTEMA DE COMBOS</h2>
          <p>Quando um golpe <b>acerta</b>, você pode <b>cancelá-lo</b> no próximo. Exemplo:</p>
          <p class="combo-ex">LEVE → LEVE → CHUTE → PARA TRÁS (lança) → ↑ (pulo) → AÉREO → SOCO AÉREO → AÉREO PESADO (bate no chão) → quica → LEVE → ESPECIAL</p>
          <ul>
            <li><b>Lançador</b> joga o oponente para cima: aperte ↑ logo depois para continuar o combo no ar.</li>
            <li><b>Aéreo pesado</b> bate o oponente no chão: ele quica e dá para continuar.</li>
            <li><b>Pesado</b> e <b>para frente</b> podem ser cancelados em <b>dash</b> (toque duplo para frente) e continuar.</li>
            <li><b>Para frente</b> arremessa o oponente e ele <b>quica na parede</b>.</li>
            <li>Qualquer golpe que acerta pode ser cancelado em <b>ESPECIAL</b> ou <b>ULTIMATE</b>.</li>
            <li>Cada personagem tem rotas diferentes (veja em CHARACTERS). Quanto maior o combo (x3, x5, x8, x10...), mais efeitos, sons e mais rápido enchem as barras.</li>
          </ul>
        </section>
        <section><h2>⚡ SPECIAL</h2>
          <p>A barra SPECIAL enche ao <b>atacar</b>, <b>receber dano</b> e fazer <b>combos</b>. Cheia, ela brilha: aperte ${K('p1', 'special')} (ou o botão SPECIAL no celular). Depois volta a zero. Cada personagem tem um especial único (raios, tornados, perucas, drones, ondas sonoras, prisão, câmera lenta...).</p>
        </section>
        <section><h2>💥 ULTIMATE</h2>
          <p>A barra ULTIMATE enche mais devagar. Cheia, aperte ${K('p1', 'ultimate')}: a câmera aproxima, o fundo escurece, a música muda e começa uma sequência cinematográfica que termina com um impacto enorme. Algumas ultimates avançam até o oponente (podem errar!), outras atingem a arena inteira.</p>
        </section>
        <section><h2>📱 CELULAR</h2>
          <p>Jogue na <b>horizontal</b>. Esquerda: joystick (↑ pula, ↓ baixo/defesa, ← + golpe = lançador, toque duplo = dash). Direita: PUNCH, KICK, HEAVY, BLOCK, JUMP, GRAB, SPECIAL e ULTIMATE.</p>
        </section>
        <section><h2>🥊 ROUNDS</h2>
          <p>ROUND 1 → 3 → 2 → 1 → FIGHT! Cada round dura <b>60 segundos</b>. K.O. ou, no fim do tempo, vence quem tiver mais vida. 2 rounds; se ficar <b>1 x 1</b>, acontece o <b>FINAL ROUND</b>. Vidas iguais = EMPATE, decidido por mais dano → maior combo → mais golpes → cara ou coroa.</p>
        </section>
        <section class="warn"><h2>⚠️ AVISO</h2><p>${VF.DISCLAIMER}</p></section>
      </div>
      <div class="row-buttons"></div>`;
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back', s.querySelector('.row-buttons'));
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
    this.off = VF.Keyboard.onKey((e) => {
      const p = s.querySelector('.howto-panel');
      if (e.code === 'ArrowDown') p.scrollBy(0, 60);
      if (e.code === 'ArrowUp') p.scrollBy(0, -60);
    });
  },
  exit() { if (this.off) this.off(); },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, false); }
});

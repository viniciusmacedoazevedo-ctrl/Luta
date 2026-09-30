/* COMO JOGAR: controles, rounds, SPECIAL e combos */
VF.Game.register('howto', {
  enter() {
    const b = VF.Settings.data.bindings;
    const K = (p, a) => `<kbd>${VF.keyLabel(b[p][a][0])}</kbd>`;
    const row = (a) => `<tr><td>${VF.ACTION_LABELS[a]}</td><td>${K('p1', a)}</td><td>${K('p2', a)}</td></tr>`;
    const s = VF.UI.screen('howto-screen');
    s.innerHTML = `<h1 class="title">COMO JOGAR</h1>
      <div class="panel howto-panel">
        <section><h2>⌨️ CONTROLES NO PC</h2>
          <table class="keys"><tr><th>Ação</th><th>Jogador 1</th><th>Jogador 2</th></tr>
          ${VF.ACTIONS.map(row).join('')}</table>
          <p><b>Dash / corrida:</b> toque duas vezes rápido para frente (ou para trás, para recuar). Segure depois do dash para correr.</p>
          <p><b>Ataque aéreo:</b> aperte um ataque durante o pulo. <b>Pausa:</b> Esc ou P. Controles podem ser alterados em Configurações.</p>
        </section>
        <section><h2>📱 CONTROLES NO CELULAR</h2>
          <p>Jogue com o celular <b>na horizontal</b>. Lado esquerdo: <b>joystick virtual</b> (arraste para andar, para cima para pular, para baixo para defender, toque duplo para os lados = dash).</p>
          <p>Lado direito: botões <b>SOCO</b>, <b>CHUTE</b>, <b>FORTE</b>, <b>DEFESA</b>, <b>PULO</b> e <b>ESPECIAL</b> (brilha quando a barra está cheia).</p>
        </section>
        <section><h2>🥊 ROUNDS</h2>
          <p>Cada luta tem <b>2 rounds de 60 segundos</b>. Zere a vida do oponente para um <b>K.O.</b>; se o tempo acabar, vence quem tiver <b>mais vida</b>.</p>
          <p>Ganhou os 2 rounds? Vitória imediata. Deu <b>1 x 1</b>? Acontece o <b>FINAL ROUND</b> (desempate de 60s) e quem vencer leva a partida.</p>
          <p>Se as vidas ficarem iguais, há um <b>EMPATE</b> e o desempate vai para: mais dano causado → maior combo → mais golpes → cara ou coroa.</p>
        </section>
        <section><h2>⚡ BARRA SPECIAL</h2>
          <p>A barra enche quando você <b>ataca</b>, <b>recebe dano</b> e faz <b>combos</b>. Cheia, ela brilha — aperte ESPECIAL para soltar o poder. Depois de usar, volta a zero.</p>
          <ul>${VF.CHARACTERS.map((d) => `<li>${d.special.icon} <b>${d.name} — ${d.special.name}:</b> ${d.special.desc}</li>`).join('')}</ul>
        </section>
        <section><h2>🔥 COMBOS</h2>
          <p>Acerte golpes em sequência (menos de 1 segundo entre eles) para montar combos: <b>COMBO x3</b>, <b>x5</b>, <b>x10</b>… cada nível tem efeitos e sons diferentes e enche mais a barra SPECIAL.</p>
          <p>Dica: quando um golpe acerta, aperte o próximo logo em seguida para encadear (ex.: Soco → Soco → Chute → Forte). O especial também pode encerrar um combo!</p>
        </section>
        <section><h2>🛡️ DEFESA</h2>
          <p>Segure <b>defesa</b> para bloquear golpes vindos da frente (você ainda recebe um dano pequeno). Agarrões e alguns especiais não podem ser bloqueados.</p>
        </section>
        <section class="warn"><h2>⚠️ AVISO</h2><p>${VF.DISCLAIMER}</p></section>
      </div>
      <div class="row-buttons"></div>`;
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back', s.querySelector('.row-buttons'));
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
    // rolar o painel com as setas
    this.off = VF.Keyboard.onKey((e) => {
      const p = s.querySelector('.howto-panel');
      if (e.code === 'ArrowDown') p.scrollBy(0, 60);
      if (e.code === 'ArrowUp') p.scrollBy(0, -60);
    });
  },
  exit() { if (this.off) this.off(); },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, false); }
});

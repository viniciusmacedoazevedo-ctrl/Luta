/* CHARACTERS: galeria com a grade de retratos, painel completo e o personagem
   inteiro demonstrando todos os golpes, especial e ultimate. */
VF.Game.register('characters', {
  enter() {
    const s = VF.UI.screen('chars-screen');
    this.s = s;
    s.innerHTML = `<div class="sel-head"><h1 class="title">CHARACTERS</h1><div class="sel-sub">25 lutadores • toque ou passe o mouse</div></div>
      <div class="sel-body"><div class="sel-grid-wrap"></div><div class="sel-panel-wrap"></div></div>
      <div class="chars-move"></div><div class="row-buttons"></div>`;
    this.panel = VF.InfoPanel(s.querySelector('.sel-panel-wrap'), { fullBody: true });
    const show = (id) => {
      this.panel.show(id);
      this.panel.puppet().setLoop(['idle', 'walk', 'light', 'medium', 'heavy', 'low', 'sweep', 'forward', 'back', 'air', 'airHeavy', 'grab', 'block', 'dash', 'hurt', 'special', 'ultimate', 'victory', 'defeat']);
    };
    this.grid = VF.RosterGrid(s.querySelector('.sel-grid-wrap'), { onHover: show, onPick: show });
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back', s.querySelector('.row-buttons'));
    show('vini');
    this.grid.setHover('vini');
    VF.UI.enableNav(s, () => VF.Game.go('menu'), false);
  },

  render(ctx, dt) {
    VF.drawMenuBG(ctx, dt, false);
    this.grid.render(VF.Game.t);
    this.panel.render(dt, VF.Game.t);
    const p = this.panel.puppet();
    const el = this.s.querySelector('.chars-move');
    if (p && el.textContent !== p.moveName) el.textContent = '▶ ' + p.moveName;
  }
});

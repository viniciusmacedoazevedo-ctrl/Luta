/* Tela de abertura: logo animado + "pressione qualquer tecla" (também libera o áudio) */
VF.Game.register('title', {
  enter() {
    this.done = false;
    const s = VF.UI.screen('title-screen');
    s.innerHTML = `${VF.logoHTML()}
      <div class="press">${VF.Device.touch ? 'TOQUE PARA COMEÇAR' : 'PRESSIONE QUALQUER TECLA'}</div>
      <div class="disclaimer">${VF.DISCLAIMER}</div>`;
    this.start = () => {
      if (this.done) return;
      this.done = true;
      VF.Audio.unlock();
      VF.Audio.play('confirm');
      if (VF.Device.touch) VF.Device.goFullscreenLandscape();
      VF.Game.go('menu');
    };
    s.addEventListener('click', this.start);
    this.off = VF.Keyboard.onKey(() => this.start());
    VF.Audio.playMusic('menu');
  },
  exit() { if (this.off) this.off(); },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, true); }
});

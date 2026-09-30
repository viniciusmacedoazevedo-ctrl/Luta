/* MENU PRINCIPAL */
VF.Game.register('menu', {
  enter() {
    VF.Audio.playMusic('menu');
    const s = VF.UI.screen('menu-screen');
    s.innerHTML = `${VF.logoHTML()}<div class="menu-buttons"></div>
      <div class="footer"><span>v${VF.CONFIG.VERSION}</span> • ${VF.DISCLAIMER}</div>`;
    const box = s.querySelector('.menu-buttons');
    const B = (label, fn, cls) => VF.UI.button(label, fn, cls, box);
    B('🥊 VAMOS LUTAR', () => VF.Game.go('mode'), 'primary big');
    B('👥 PERSONAGENS', () => VF.Game.go('characters'));
    B('⚙️ CONFIGURAÇÕES', () => VF.Game.go('settings'));
    B('📖 COMO JOGAR', () => VF.Game.go('howto'));
    if (!VF.Device.touch || VF.Device.isElectron || VF.Device.isNative) {
      B('🚪 SAIR', () => VF.Game.go('exit'), 'danger');
    }
    box.querySelectorAll('.btn').forEach((b, i) => { b.style.animationDelay = 0.35 + i * 0.07 + 's'; });
    VF.UI.enableNav(s, null);
  },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, true); }
});

/* MENU PRINCIPAL: arena animada ao fundo, logo grande e botões animados */
VF.Game.register('menu', {
  enter() {
    VF.Audio.playMusic('menu');
    const s = VF.UI.screen('menu-screen');
    s.innerHTML = `${VF.logoHTML()}<div class="menu-buttons"></div>
      <div class="footer"><span>v${VF.CONFIG.VERSION}</span> • ${VF.DISCLAIMER}</div>`;
    const box = s.querySelector('.menu-buttons');
    const B = (label, fn, cls) => VF.UI.button(label, fn, cls, box);
    B('<span class="mi">🥊</span> FIGHT', () => VF.Game.go('mode'), 'primary big');
    B('<span class="mi">👥</span> CHARACTERS', () => VF.Game.go('characters'));
    B('<span class="mi">📖</span> HOW TO PLAY', () => VF.Game.go('howto'));
    B('<span class="mi">⚙️</span> SETTINGS', () => VF.Game.go('settings'));
    if (!VF.Device.touch || VF.Device.isElectron || VF.Device.isNative) B('<span class="mi">🚪</span> EXIT', () => VF.Game.go('exit'), 'danger');
    box.querySelectorAll('.btn').forEach((b, i) => { b.style.animationDelay = 0.35 + i * 0.07 + 's'; });
    VF.UI.enableNav(s, null);
  },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, true); }
});

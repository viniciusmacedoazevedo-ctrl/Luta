/* SAIR: fecha o app (Windows/Android) ou mostra mensagem no navegador */
VF.Game.register('exit', {
  enter() {
    VF.Audio.stopMusic();
    if (window.vfDesktop && window.vfDesktop.quit) { window.vfDesktop.quit(); return; }
    const App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (App && App.exitApp) { App.exitApp(); return; }
    try { window.close(); } catch (e) { /* navegadores bloqueiam */ }
    const s = VF.UI.screen('exit-screen');
    s.innerHTML = `${VF.logoHTML(true)}<div class="panel"><h1 class="title">VALEU POR JOGAR!</h1>
      <p>Você já pode fechar esta aba do navegador.</p><div class="row-buttons"></div></div>`;
    VF.UI.button('◀ VOLTAR AO MENU', () => VF.Game.go('menu'), 'primary', s.querySelector('.row-buttons'));
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
  },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, false); }
});

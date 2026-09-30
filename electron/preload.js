/* Ponte segura entre o jogo e o Electron (botão SAIR) */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vfDesktop', {
  quit: () => ipcRenderer.send('vf-quit')
});

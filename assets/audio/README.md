# Áudio do VINI FIGHT

Hoje **todos os sons e músicas são sintetizados em tempo real** (Web Audio):

- `synth.js` — efeitos sonoros (socos, chutes, impactos, poderes, botões, locutor…)
- `music.js` — músicas procedurais (menu, uma por arena, vitória)

Eles funcionam como *placeholders*: o jogo já está completo sem nenhum arquivo de áudio.

## Como trocar por arquivos reais

1. Coloque os arquivos em `assets/audio/music/` (músicas) ou `assets/audio/sfx/` (efeitos).
   Formatos recomendados: `.mp3` ou `.ogg`.
2. Abra `config/audio.js` e troque o `null` pelo caminho do arquivo, por exemplo:

```js
music: {
  menu: 'assets/audio/music/menu.mp3',
  rua: 'assets/audio/music/rua-noite.mp3',
  ...
},
sfx: {
  punch: 'assets/audio/sfx/soco.wav',
  ...
}
```

Qualquer entrada que continuar `null` segue usando o som sintetizado.

| Chave | Onde toca |
|---|---|
| `menu` | Menus e seleção |
| `rua`, `urbana`, `praca`, `futurista` | Música de cada arena |
| `victory` | Tela de vitória |
| `punch`, `kick`, `heavy`, `grab`, `block` | Golpes e defesa |
| `blast`, `flash`, `dark`, `steal`, `speech`, `wave`, `charge` | Poderes especiais |
| `round`, `fight`, `ko`, `draw`, `tick`, `combo` | Locutor / rounds / combos |
| `click`, `hover`, `confirm`, `back`, `select`, `ready` | Interface |

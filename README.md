# 🥊 VINI FIGHT 2

Jogo de luta 2D completo, cartunesco e **jogável no PC e no celular**, com **25 lutadores**,
combos elaborados, **SPECIAL** e **ULTIMATE** cinematográfica para cada um.

> ⚠️ **Aviso:** jogo fictício e humorístico. **Lula**, **Jair Bolsonaro**, **Xandao** e
> **Albert Einstein** aparecem como **caricaturas/paródias** de videogame. Nenhum poder,
> habilidade ou comportamento do jogo representa fatos sobre pessoas reais.

---

## ▶️ Como iniciar (o jeito mais rápido)

**Abra o arquivo `index.html`** com dois cliques (Chrome, Edge ou Firefox). O jogo abre direto,
sem instalar nada. Para testar no celular, use o servidor local (`npm start`, veja abaixo).

---

## 🎮 O que tem no jogo

- **Menu principal** sobre uma arena animada (câmera passeando, lutadores ao fundo):
  **FIGHT, CHARACTERS, HOW TO PLAY, SETTINGS, EXIT**.
- **VERSUS**: PLAYER VS AI (EASY / NORMAL / HARD) e PLAYER VS PLAYER (mesmo teclado).
- **Seleção em grade**: só os retratos em quadrados.
  - **PC:** passar o mouse mostra o painel (nome, retrato grande, descrição, estilo, barras de
    força/velocidade/defesa, SPECIAL e ULTIMATE); clicar seleciona.
  - **Celular:** 1º toque mostra as informações, 2º toque no mesmo quadrado seleciona.
  - Depois: **ESCOLHA SEU OPONENTE** e a arena.
- **25 lutadores**, cada um com visual, pose, golpes, SPECIAL e ULTIMATE próprios:

| Lutador | Estilo | SPECIAL | ULTIMATE |
|---|---|---|---|
| **VINI** | Equilibrado | 👓 VINI BLAST | 🔥 VINI FINAL BLAST |
| **ARTHUR** | Velocidade extrema • combos rápidos | ⚡ FLASH ARTHUR | 🔥 FLASH COMBO |
| **JULIA EDUARDA** | Energia sombria • médio alcance | 🔮 SHADOW BURST | 🔥 SHADOW STORM |
| **LULA** *(paródia)* | Lento • golpes pesados • agarrão | 🫳 MÃO LEVE | 🔥 LADRÃO DE ENERGIA |
| **BOLSONARO** *(paródia)* | Defesa alta • força alta | 📣 DISCURSO DE PODER | 🔥 DISCURSO FINAL |
| **XANDAO** *(paródia)* | Defesa • controle • precisão | ⚖️ ORDEM JUDICIAL | 🔥 DECISÃO FINAL |
| **WILL** | Fluido • elegante | 🌈 FASHION STORM | 🔥 GRAND STYLE |
| **DEYVERSON** | Equilibrado • projétil que volta | 👱 PERUCA SUPREMA | 🔥 PERUCA INFINITA |
| **WAL** | Controle de área | 🌪️ TORNADO ROXO | 🔥 MEGA TORNADO |
| **DG** | Rápido • chutes acrobáticos | ⚽ CHUTE FANTÁSTICO | 🔥 CRAQUE DO COMBO |
| **GABRIEL MORAIS** | Equilibrado • avanço rápido | 💨 MORAIS RUSH | 🔥 MORAIS FINAL |
| **MUSKITO** | Técnico • tecnologia | 💻 NERD MODE | 🔥 SUPER COMPUTADOR |
| **DOCINHO** | Equilibrado • área de luz | 🙌 BENÇÃO SUPREMA | 🔥 CHUVA DE BENÇÃOS |
| **LIVIA** | Rápida • agressiva | 💢 LIVIA ATTACK | 🔥 LIVIA RUSH |
| **LAURA** | Distância • ataques do céu | ⚡ RAIO DA FÉ | 🔥 LUZ SUPREMA |
| **ANNY** | Força física alta | 💪 ACADEMIA MODE | 🔥 LEG DAY |
| **JULIA NEGREIROS** | Precisão • atordoamento | 😏 OLHAR DE JULIA | 🔥 JULIA FINAL |
| **ALLANE** | Giros • área próxima | 🌀 CURLY STORM | 🔥 CURLY CHAOS |
| **BIA** | Longo alcance • precisão | 🏹 LONG RANGE | 🔥 MAX RANGE |
| **ALBERT EINSTEIN** *(paródia)* | Controle do tempo • atrapalhado | ⏱️ RELATIVIDADE | 🔥 E = MC² |
| **JOVANIRA** | Técnica • matemática | ➗ EQUAÇÃO IMPOSSÍVEL | 🔥 MATEMÁTICA FINAL |
| **GIOVANA GOBI** | Equilibrada • combos cômicos | 💔 EX ATTACK | 🔥 EX COMBO |
| **ELENA** | Ondas sonoras • distância | 🎤 VOZ DIVINA | 🔥 GRANDE CORAL |
| **LUTU** | Dupla • ataques sincronizados | 💑 ATAQUE DO CASAL | 🔥 LUTU COMBO |
| **LEIDIANE** | Charme • combos rápidos | 🌹 CHARME SUPREMO | 🔥 LEIDIANE FINAL |

- **Combos**: leve, médio (chute), pesado, baixo, rasteira, para frente (arremessa na parede),
  para trás (lançador), aéreo, aéreo pesado (bate no chão e quica), agarrão, dash, defesa,
  cancelamentos (golpe → golpe, dash cancel, jump cancel, cancel em SPECIAL/ULTIMATE),
  *juggle* com limite e escalonamento de dano. Contador x3, x5, x8, x10… com efeitos crescentes.
- **Barra SPECIAL** (enche rápido) e **barra ULTIMATE** (enche devagar). A ULTIMATE dá zoom,
  escurece o fundo, troca a música, mostra **ULTIMATE!** e faz uma sequência cinematográfica
  com impacto final. Algumas avançam e podem errar; outras pegam a arena inteira.
- **Rounds**: ROUND 1 → 3 → 2 → 1 → **FIGHT!**, 60 segundos; se ficar 1 x 1, **FINAL ROUND**.
  Empate de vida é decidido por dano → maior combo → golpes → cara ou coroa.
- **HUD**: vida, SPECIAL e ULTIMATE de cada jogador, tempo, rounds e combos.
- **7 arenas animadas**: Rua brasileira, Escola, Campo de futebol, Igreja (estilizada),
  Arena urbana, Arena futurista e Praça — cada uma com música própria.
- **Câmera dinâmica**: segue os lutadores, zoom nos golpes fortes, foco na ULTIMATE, tremor.
- **IA** com EASY/NORMAL/HARD e comportamento próprio por personagem (zoner, rushdown,
  agarrador…): anda, defende, pula, faz combos, esquiva e usa SPECIAL/ULTIMATE.
- **Áudio** sintetizado (funciona sem arquivos) e pronto para receber arquivos reais
  (`assets/audio/README.md`).
- **Desempenho**: qualidade AUTO/ALTA/BAIXA em SETTINGS (limita partículas e efeitos em
  aparelhos fracos).

---

## ⌨️ Controles no PC

| Ação | Jogador 1 | Jogador 2 |
|---|---|---|
| Andar | A / D | ← / → |
| Pular | W | ↑ |
| Defesa / baixo | S | ↓ |
| Ataque leve | J | 1 |
| Chute (médio) | K | 2 |
| Ataque pesado | L | 3 |
| SPECIAL | U | 4 |
| ULTIMATE | I | 5 |
| Agarrão | O | 6 |

- **↓ + leve/chute** = ataque baixo • **↓ + pesado** = rasteira
- **→ + pesado** = ataque para frente (quica na parede) • **← + ataque** = lançador
- **No ar**: leve/chute = aéreo • pesado = aéreo pesado (bate no chão)
- **Dash**: toque duas vezes na direção • Pausa: **Esc** / **P**
- **Todas as teclas podem ser trocadas em SETTINGS** (ficam salvas).

## 📱 Controles no celular

O jogo detecta sozinho se está no PC ou no celular.

- **Esquerda:** joystick (↑ pula, ↓ baixo/defesa, toque duplo = dash, ← + golpe = lançador).
- **Direita — 8 botões:** PUNCH, KICK, HEAVY, BLOCK, JUMP, GRAB, **SPECIAL** e **ULTIMATE**
  (os dois brilham quando a barra está cheia).
- Jogue **na horizontal** (na vertical aparece o aviso para girar).

---

## 🖥️ Testar no PC

**Opção 1 — sem instalar nada:** dê dois cliques em `index.html`.

**Opção 2 — servidor local** (requer [Node.js](https://nodejs.org) 18+):

```bash
npm start
```

Abra `http://localhost:8080`.

## 📲 Testar no celular

1. No PC, rode `npm start`. O terminal mostra um endereço do tipo
   `http://192.168.0.10:8080` (linha "Celular").
2. Com o **celular na mesma rede Wi-Fi**, abra esse endereço no Chrome (Android) ou no Safari (iPhone).
3. Toque na tela, gire para a **horizontal** e jogue.
4. *(Opcional)* No menu do navegador, use **"Adicionar à tela inicial"** para instalar como app
   (abre em tela cheia e funciona offline).

> Se o celular não abrir o endereço, permita o Node.js/porta 8080 no firewall do Windows
> (a primeira vez que rodar `npm start` o Windows pergunta). Outra opção é instalar o APK (abaixo).

---

## 🪟 Gerar a versão para Windows (.exe)

### Opção A — automático pelo GitHub (recomendado, funciona até pelo Codespaces)
A cada `git push`, o GitHub Actions gera o **instalador do Windows** e o **APK do Android**.
Vá na aba **Actions** do repositório → abra a execução mais recente de *"Build (Windows + Android)"*
→ baixe em **Artifacts**: `VINI-FIGHT-Windows` (instalador + portátil) e `VINI-FIGHT-Android` (APK).
Também dá para rodar manualmente: **Actions → Build (Windows + Android) → Run workflow**.

### Opção B — no seu computador
Requer Node.js 18+:

```bash
npm install
npm run build:win
```

- **No Windows**: gera em `dist/` o instalador `VINI FIGHT Setup 1.0.0.exe` e a versão
  portátil `VINI-FIGHT-portable.exe`.
- **No Linux/macOS/Codespaces** (sem Wine): gera `dist/VINI-FIGHT-win-x64.zip`.
  Baixe o zip, extraia no Windows e abra **`VINI FIGHT.exe`** — o jogo roda sem instalar.
  (O instalador "Setup" precisa do Windows, do Wine ou da Opção A.)

Para só abrir a versão desktop sem gerar nada: `npm run desktop`.

## 🤖 Gerar a versão para Android (.apk)

> Sem instalar nada: use a **Opção A** acima (GitHub Actions) e baixe o artifact `VINI-FIGHT-Android`.

Requer Node.js 18+ e o **[Android Studio](https://developer.android.com/studio)**
(ele instala o Android SDK e o Java).

```bash
npm install
npm run android:sync     # copia o jogo para o projeto Android (pasta android/)
npm run android:open     # abre o projeto no Android Studio
```

No Android Studio: **Build ▸ Build App Bundle(s) / APK(s) ▸ Build APK(s)**.
O APK fica em `android/app/build/outputs/apk/debug/app-debug.apk`. Copie para o celular
e instale (permita "fontes desconhecidas"). Para testar direto no aparelho, conecte-o por USB
(com depuração USB ativada) e clique em **Run ▶**.

Pela linha de comando (com o SDK já instalado):

```bash
npm run android:sync
cd android
./gradlew assembleDebug        # Windows: gradlew.bat assembleDebug
```

Para publicar na Play Store, use **Build ▸ Generate Signed Bundle / APK**.
O app já está configurado para abrir em **paisagem** e com o botão **SAIR** funcionando.

> Sempre que alterar o jogo, rode `npm run android:sync` de novo antes de gerar o APK.

---

## 🧪 Testes automatizados

```bash
npm install
npx playwright install chromium   # só na primeira vez
npm test
```

O teste abre o jogo num navegador real e verifica:

- menu (FIGHT, CHARACTERS, HOW TO PLAY, SETTINGS), VERSUS, grade com 25 quadrados,
  painel no *hover*, ESCOLHA SEU OPONENTE e as 7 arenas;
- movimento, ataques, pulo, SPECIAL, ULTIMATE (com dano) e pausa pelo teclado;
- celular: 1º toque mostra infos / 2º seleciona, 8 botões touch, aviso de retrato;
- 7 partidas completas **CPU x CPU** (uma por arena) até a tela de vitória.

Screenshots ficam em `tools/test/screenshots/`. Galeria de todos os lutadores:
`tools/test/sprites.html`.

**Modo demonstração:** `index.html?demo=vini,lula,praca&diff=hard` (adicione `&speed=4`).

---

## 🗂️ Onde fica cada coisa

| Quero mudar… | Arquivo |
|---|---|
| **Um personagem** (nome, cores, visual, atributos, golpes, textos, SPECIAL/ULTIMATE escolhidos) | `assets/characters/<id>/character.js` |
| **Lista/ordem dos personagens** | `config/roster.js` + `<script>` em `index.html` |
| **Retratos** (desenhados por código a partir do visual) | `assets/characters/_shared/appearance.js` e `VF.Rig.portrait` em `assets/characters/_shared/rig.js` |
| **Animações / poses** (parado, andar, golpes, vitória…) | `assets/characters/_shared/poses.js` |
| **Golpes, combos e cancelamentos** (dano, alcance, `next`) | `config/movesets.js` |
| **SPECIALs** (os 25 tipos) | `scripts/specials.js` (+ visual em `assets/effects/projectile-fx.js`) |
| **ULTIMATEs** (sequência cinematográfica) | `scripts/ultimates.js` + `assets/effects/bigfx.js` |
| **Controles do teclado** | `config/controls.js` (ou SETTINGS no jogo) |
| **Controles touch** | `ui/touch-controls.js` |
| **Regras** (tempo, vida, barras) | `config/game.js` |
| **Arenas** | `config/arenas.js` + `assets/backgrounds/*.js` |
| **IA** | `scripts/ai.js` |
| **Câmera** | `scripts/camera.js` |
| **Sons e músicas** | `config/audio.js`, `assets/audio/` |

```
index.html              ← ARQUIVO PRINCIPAL (abra este)
config/                 game.js, controls.js, movesets.js, roster.js, arenas.js, audio.js
src/                    main.js, game.js (loop + cenas), core/ (input, áudio, storage…)
scripts/                fighter, combat, camera, specials, ultimates, projectile, ai, match, puppet
scenes/                 title, menu, mode, select, arena, fight, victory, characters, settings, howto, exit
ui/                     hud, announcer, touch-controls, roster-grid, dom, styles.css
assets/characters/      _shared/ (rig, appearance, poses) + uma pasta por lutador
assets/backgrounds/     7 arenas + fundo do menu
assets/effects/         partículas, efeitos, projéteis, bigfx (ultimates)
assets/audio/           sons e músicas sintetizados
electron/  android/     empacotamento Windows e Android
tools/                  servidor local, builds, testes
```

### Tecnologia

**HTML5 Canvas + JavaScript puro** (sem engine e sem dependências para jogar), porque:

- abre com um clique no `index.html`, em qualquer PC ou celular;
- teclado **e** touchscreen nativos;
- **Electron** gera o `.exe` para Windows e **Capacitor** gera o `.apk` para Android
  a partir do mesmo código;
- o código é dividido por sistemas e fácil de modificar (ex.: para mudar a duração do round,
  edite `ROUND_TIME` em `config/game.js`; para balancear um personagem, `assets/characters/<id>/character.js`).

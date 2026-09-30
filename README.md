# 🥊 VINI FIGHT

Jogo de luta 2D completo, cartunesco e **jogável no PC e no celular**, inspirado nos clássicos
(Street Fighter / Mortal Kombat) mas com identidade visual própria.

> ⚠️ **Aviso:** jogo fictício e humorístico. **Lula** e **Jair Bolsonaro** aparecem como
> **caricaturas/paródias** de videogame. Nenhum poder, habilidade ou comportamento do jogo
> representa fatos sobre pessoas reais.

---

## ▶️ Como iniciar (o jeito mais rápido)

**Abra o arquivo `index.html`** com dois cliques (Chrome, Edge ou Firefox). Pronto: o jogo abre
direto, sem instalar nada.

Para testar no celular, ou para instalar o jogo como app, use o servidor local (abaixo).

---

## 🎮 O que tem no jogo

- **Menu animado**: logo com animação, partículas, música e sons nos botões
  (VAMOS LUTAR, PERSONAGENS, CONFIGURAÇÕES, COMO JOGAR, SAIR).
- **5 lutadores**, todos desenhados e animados por código (parado, andar, correr, pular, soco,
  chute, forte, defesa, dano, especial, vitória e derrota):

| Lutador | Estilo | Especial |
|---|---|---|
| **VINI** | Equilibrado | 👓 **VINI BLAST** – rajada de energia dos óculos |
| **ARTHUR** | Velocidade extrema, combos | ⚡ **FLASH ARTHUR** – teleporta para as costas e ataca em sequência |
| **JUEXU** | Equilibrada, bom alcance, ataque aéreo | 🔮 **ENERGIA SOMBRIA** – aura roxa + esfera sombria |
| **LULA** *(paródia)* | Lento, dano altíssimo, agarrão | 🫳 **MÃO LEVE** – "pega emprestada" a barra SPECIAL do rival (mecânica cômica) |
| **BOLSONARO** *(paródia)* | Defesa alta, golpes fortes | 📣 **DISCURSO DE PODER** – discurso + onda de choque que empurra |

- **Seleção**: "ESCOLHA SEU LUTADOR" → "ESCOLHA SEU OPONENTE", com cards (rosto animado, nome,
  barras de força/velocidade/defesa, descrição e ícone do especial) e o carimbo **READY!**.
- **4 arenas animadas**, cada uma com música própria: Rua brasileira à noite, Arena urbana,
  Praça brasileira e Arena futurista.
- **Regras**: 2 rounds de **60 segundos**. Quem ganhar os 2 vence na hora; se ficar **1 x 1**,
  acontece o **FINAL ROUND**. Com o tempo zerado vence quem tem mais vida. Se as vidas empatarem,
  há animação de **EMPATE** e desempate por: mais dano → maior combo → mais golpes → cara ou coroa.
- **Combos** com contador na tela (x3, x5, x10…), efeitos e sons diferentes por nível.
- **Barra SPECIAL** que enche ao atacar, apanhar e fazer combos. Cheia, ela brilha e o poder fica
  liberado, com animação de corte (*super flash*).
- **IA** com 3 dificuldades (FÁCIL, NORMAL, DIFÍCIL): anda, ataca, defende, pula, faz combos,
  esquiva de projéteis e usa os poderes (no difícil, de forma mais agressiva e inteligente).
- **Tela de vitória** com o vencedor comemorando, confete e estatísticas
  (rounds vencidos, combo máximo, dano causado, golpes, especiais), além de
  JOGAR NOVAMENTE / ESCOLHER PERSONAGEM / MENU.
- **Efeitos**: faíscas de impacto, partículas, flash, poeira, energia, *hit-stop*, câmera lenta
  no K.O. e tremor de tela nos golpes fortes.
- **Áudio**: músicas e efeitos sintetizados (funcionam sem arquivos), já preparados para
  receber arquivos reais (veja `assets/audio/README.md`). Locutor por voz opcional.
- **Modos**: 1 jogador x CPU e 2 jogadores no mesmo teclado. Pausa com **Esc**/**P**.

---

## ⌨️ Controles no PC

| Ação | Jogador 1 | Jogador 2 |
|---|---|---|
| Esquerda / Direita | A / D | ← / → |
| Pular | W | ↑ |
| Defesa | S | ↓ |
| Soco | J | 1 |
| Chute | K | 2 |
| Ataque forte | L | 3 |
| Poder especial | U | 4 |

- **Dash/corrida**: toque duas vezes rápido na direção.
- **Ataque aéreo**: ataque durante o pulo.
- No modo 1 jogador, as teclas do Jogador 2 também controlam o seu lutador.
- **Todas as teclas podem ser trocadas em CONFIGURAÇÕES** (ficam salvas).

## 📱 Controles no celular

O jogo **detecta sozinho** se está no PC ou em celular/tablet e troca os controles.

- **Esquerda:** joystick virtual (arrastar = andar • para cima = pular • para baixo = defender •
  toque duplo para o lado = dash).
- **Direita:** botões grandes **SOCO, CHUTE, FORTE, DEFESA, PULO e ESPECIAL** (brilha quando
  estiver cheio).
- Jogue **na horizontal**. Na vertical aparece o aviso para girar o aparelho.
- Dá para forçar "touch sempre/nunca" em CONFIGURAÇÕES.

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

- navegação pelos menus;
- movimento, ataques, pulo, especial e pausa pelo teclado;
- layout de celular (touch, botões, joystick, aviso de retrato);
- 4 partidas completas **CPU x CPU** (uma por arena) até a tela de vitória,
  passando por K.O., tempo, FINAL ROUND e especiais.

Screenshots ficam em `tools/test/screenshots/`.

**Modo demonstração:** abra `index.html?demo=vini,lula,praca&diff=hard` para assistir
CPU x CPU (adicione `&speed=4` para acelerar).

---

## 🗂️ Estrutura do projeto

```
index.html              ← ARQUIVO PRINCIPAL (abra este)
config/                 ← balanceamento e dados
  game.js               regras globais (tempo do round, vida, dificuldade da IA…)
  characters.js         atributos, golpes, hitboxes e especiais dos 5 lutadores
  arenas.js             lista de arenas
  controls.js           teclas padrão
  audio.js              manifesto de áudio (trocar placeholders por arquivos)
src/
  main.js               inicialização
  game.js               loop de passo fixo + gerenciador de cenas
  core/                 entrada (teclado), áudio, detecção de dispositivo, storage, matemática
scripts/                ← sistemas de jogo
  fighter.js            máquina de estados do lutador, física, defesa, dano
  combat.js             acertos, combos, colisão de corpos, projéteis
  specials.js           lógica + animação dos 5 poderes especiais
  ai.js                 inteligência artificial (3 dificuldades)
  match.js              regras de rounds / desempate
  projectile.js, puppet.js
scenes/                 ← telas: title, menu, mode, select, arena, fight, victory,
                          characters, settings, howto, exit
ui/                     ← HUD, locutor, controles touch, helpers de DOM, styles.css
assets/
  characters/           rig procedural + visual de cada personagem
  backgrounds/          as 4 arenas + fundo do menu
  effects/              partículas, faíscas, visual dos projéteis
  audio/                sons e músicas sintetizados (+ pastas para arquivos reais)
  icons/                ícones do app
electron/               ← empacotamento Windows (Electron)
android/                ← projeto Android (Capacitor)
tools/                  ← servidor local, build, testes
```

### Tecnologia

**HTML5 Canvas + JavaScript puro** (sem engine e sem dependências para jogar), porque:

- abre com um clique no `index.html`, em qualquer PC ou celular;
- teclado **e** touchscreen nativos;
- **Electron** gera o `.exe` para Windows e **Capacitor** gera o `.apk` para Android
  a partir do mesmo código;
- o código é dividido por sistemas e fácil de modificar (ex.: para mudar a duração do round,
  edite `ROUND_TIME` em `config/game.js`; para balancear um personagem, `config/characters.js`).

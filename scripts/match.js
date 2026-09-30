/* Regras da partida: 2 rounds de 60s; quem vencer 2 ganha.
   Se ficar 1x1, acontece o FINAL ROUND (desempate). */
(function () {
  const C = VF.CONFIG;

  class Match {
    constructor(o) {
      this.p1 = o.p1;
      this.p2 = o.p2;
      this.arena = o.arena;
      this.mode = o.mode || 'cpu';
      this.difficulty = o.difficulty || 'normal';
      this.round = 1;
      this.wins = [0, 0];
      this.history = [];
      this.over = false;
      this.winner = -1;
    }

    get roundLabel() {
      return this.round >= 3 ? 'FINAL ROUND' : 'ROUND ' + this.round;
    }

    /* Decide o vencedor de um round que terminou por tempo (ou duplo K.O.) */
    static decide(f1, f2) {
      if (f1.hp !== f2.hp) return { winner: f1.hp > f2.hp ? 0 : 1, tie: false };
      const crit = [['damage', 'MAIS DANO CAUSADO'], ['maxCombo', 'MAIOR COMBO'], ['hits', 'MAIS GOLPES ACERTADOS']];
      for (const [k, label] of crit) {
        if (f1.round[k] !== f2.round[k]) return { winner: f1.round[k] > f2.round[k] ? 0 : 1, tie: true, reason: label };
      }
      return { winner: Math.random() < 0.5 ? 0 : 1, tie: true, reason: 'CARA OU COROA' };
    }

    record(w) {
      this.wins[w]++;
      this.history.push(w);
      if (this.wins[w] >= C.WINS_NEEDED) {
        this.over = true;
        this.winner = w;
      } else {
        this.round++;
      }
    }
  }

  VF.Match = Match;
})();

/* ROSTER — ordem dos personagens na grade de seleção e função de registro.
   Cada personagem vive em assets/characters/<id>/character.js e chama
   VF.defineCharacter({...}). Para adicionar um novo lutador:
     1) crie a pasta assets/characters/<id>/ com character.js;
     2) adicione o <script> no index.html;
     3) coloque o id em VF.ROSTER abaixo. */
VF.ROSTER = [
  'vini', 'arthur', 'julia_eduarda', 'lula', 'bolsonaro',
  'xandao', 'will', 'deyverson', 'wal', 'dg',
  'gabriel', 'muskito', 'docinho', 'livia', 'laura',
  'anny', 'julia_negreiros', 'allane', 'bia', 'einstein',
  'jovanira', 'giovana', 'elena', 'lutu', 'leidiane'
];

VF.CHARACTERS = [];
VF.Skins = {};

VF.defineCharacter = function (d) {
  const s = d.stats;
  // física derivada dos atributos (pode ser sobrescrita em d.physics)
  const phys = Object.assign({
    walk: 230 + s.speed * 22,
    jump: 1000 + s.speed * 12,
    dashSpeed: 780 + s.speed * 80,
    dashTime: 0.2 - s.speed * 0.006,
    runMult: 1.6,
    power: 0.72 + s.power * 0.06,
    defense: 0.78 + s.defense * 0.055
  }, d.physics || {});
  Object.assign(d, phys);
  d.attacks = VF.buildMoveset(d.archetype || 'balanced', d.moves, d.moveMods);
  d.skin = VF.makeSkin(d.look);
  if (d.partner) d.partnerSkin = VF.makeSkin(d.partner);
  d.anim = d.anim || {};
  d.ai = Object.assign({ prefer: 'mid', aggression: 0, jumpy: 0, grabby: 0 }, d.ai || {});
  d.moveNames = Object.assign({}, VF.MOVE_NAMES, d.moveNames || {});
  VF.Skins[d.id] = d.skin;
  VF.CHARACTERS.push(d);
  VF.CHARACTERS.sort((a, b) => VF.ROSTER.indexOf(a.id) - VF.ROSTER.indexOf(b.id));
  return d;
};

VF.getCharacter = (id) => VF.CHARACTERS.find((c) => c.id === id) || VF.CHARACTERS[0];

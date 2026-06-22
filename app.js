/*
  Isacc Hybrid - v2
  HTML/CSS/JS puro, sem backend por enquanto.
  Depois podemos conectar no Supabase trocando as funções saveState/loadState.
*/

const STORE_KEY = 'isacc_hybrid_v2';
const LEGACY_STORE_KEYS = ['isacc_dino_hybrid_v1'];
const $app = document.querySelector('#app');
const $toast = document.querySelector('#toast');

const SUPABASE_CONFIG = {
  enabled: false,
  url: '',
  anonKey: ''
};

const weekdayMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const shortWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const todayISO = () => new Date().toISOString().slice(0, 10);
const todayTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const muscleGroups = {
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior',
  gluteos: 'Glúteos',
  panturrilha: 'Panturrilha',
  abdomen: 'Abdômen',
  lombar: 'Lombar',
  cardio: 'Cardio'
};

const plan = [
  {
    id: 'seg-reset',
    day: 1,
    title: 'Reset + Cardio leve + Lombar',
    type: 'Cardio/Mobilidade',
    duration: '35–45 min',
    intensity: 'Leve',
    goal: 'Não falhar na segunda. Quebrar o ciclo sofá + celular + treino tarde.',
    notes: ['Caminhada Z2: ritmo em que dá para conversar.', 'Sem treino pesado. Hoje é para vencer a preguiça e cuidar da lombar.'],
    exercises: [
      ex('walk-z2', 'Caminhada leve/moderada', '30 min', 'Z2 / conversa normal', 'Esteira ou rua', ['cardio']),
      ex('cat-camel', 'Cat Camel', '2x10', 'controle', 'Mobilidade de coluna', ['lombar']),
      ex('dead-bug', 'Dead Bug', '2x10 cada lado', 'controle', 'Abdômen sem forçar lombar', ['abdomen', 'lombar']),
      ex('bird-dog', 'Bird Dog', '2x10 cada lado', 'controle', 'Estabilidade lombar', ['lombar', 'gluteos']),
      ex('glute-bridge', 'Ponte de Glúteo', '2x15', 'leve', 'Ativar glúteo', ['gluteos', 'lombar']),
      ex('plank', 'Prancha', '2–3x30s', 'controle', 'Core firme', ['abdomen'])
    ]
  },
  {
    id: 'ter-superior-a',
    day: 2,
    title: 'Superior A Pesado',
    type: 'Musculação',
    duration: '60–75 min',
    intensity: 'Pesado controlado',
    goal: 'Peito, costas, ombro e braço com progressão de carga.',
    notes: ['Descanso 1:30–2:00 nos principais.', 'Termine com 1–2 repetições sobrando nos compostos.'],
    exercises: [
      ex('supino-maquina-halter', 'Supino máquina ou halter', '4x6–10', 'RIR 1–2', 'Principal de peito. Aumentar carga quando fechar 10/10/10/10.', ['peito', 'triceps', 'ombros']),
      ex('puxada-alta-aberta', 'Puxada alta aberta', '4x8–10', 'RIR 1–2', 'Costas em V. Puxa com cotovelo, não com bíceps.', ['costas', 'biceps']),
      ex('remada-sentada', 'Remada sentada máquina/cabo', '3x8–12', 'RIR 1–2', 'Escápula firme. Evitar jogar lombar.', ['costas', 'biceps']),
      ex('desenvolvimento-sentado', 'Desenvolvimento de ombro sentado', '3x8–10', 'RIR 1–2', 'Ombro forte sem roubar na lombar.', ['ombros', 'triceps']),
      ex('supino-inclinado', 'Supino inclinado halter/máquina', '3x8–12', 'RIR 1–2', 'Parte superior do peito.', ['peito', 'ombros', 'triceps']),
      ex('elevacao-lateral', 'Elevação lateral', '4x12–20', 'quase falha', 'Controle total. Esse é shape de ombro largo.', ['ombros']),
      ex('triceps-polia', 'Tríceps na polia', '3x10–12', 'quase falha', 'Cotovelos fixos.', ['triceps']),
      ex('rosca-direta-polia', 'Rosca direta na polia', '3x10–12', 'quase falha', 'Braço cheio, sem balançar.', ['biceps']),
      ex('barra-tecnica', 'Barra fixa técnica/negativa', '3 séries', 'técnica', '1 barra limpa se sair + negativas descendo 4–5s.', ['costas', 'biceps'])
    ]
  },
  {
    id: 'qua-inferior-a',
    day: 3,
    title: 'Inferior A Controlado',
    type: 'Musculação',
    duration: '55–65 min',
    intensity: 'Moderado/Pesado',
    goal: 'Perna completa sem judiar da lombar/ciático.',
    notes: ['Sem stiff pesado na primeira semana.', 'Dor lombar acima de 4/10: reduzir carga ou trocar exercício.'],
    exercises: [
      ex('leg-press', 'Leg Press', '4x8–12', 'RIR 1–2', 'Pés firmes, amplitude segura, lombar colada.', ['quadriceps', 'gluteos']),
      ex('cadeira-extensora', 'Cadeira Extensora', '3x10–15', 'quase falha', 'Segura 1s em cima.', ['quadriceps']),
      ex('mesa-flexora', 'Mesa/Cadeira Flexora', '4x10–12', 'RIR 1–2', 'Posterior forte protege joelho e lombar.', ['posterior']),
      ex('elevacao-pelvica', 'Elevação Pélvica', '4x8–12', 'RIR 1–2', 'Glúteo forte e estabilidade pélvica.', ['gluteos', 'posterior']),
      ex('cadeira-abdutora', 'Cadeira Abdutora', '3x12–15', 'quase falha', 'Glúteo médio para estabilidade.', ['gluteos']),
      ex('panturrilha', 'Panturrilha em pé ou sentado', '5x10–15', 'quase falha', 'Pausa embaixo e em cima.', ['panturrilha']),
      ex('prancha', 'Prancha', '3x30–40s', 'controle', 'Core anti-lombar.', ['abdomen']),
      ex('dead-bug-core', 'Dead Bug', '3x10 cada lado', 'controle', 'Core sem flexionar lombar.', ['abdomen', 'lombar'])
    ]
  },
  {
    id: 'qui-corrida-calistenia',
    day: 4,
    title: 'Corrida Intervalada + Calistenia',
    type: 'Híbrido',
    duration: '45–55 min',
    intensity: 'Moderado',
    goal: 'Melhorar corrida, barra e flexão sem matar hipertrofia.',
    notes: ['Sem frequencímetro: usa respiração. Trote moderado, caminhada para recuperar.', 'Calistenia é técnica, não é para destruir cotovelo/ombro.'],
    exercises: [
      ex('aquecimento-caminhada', 'Aquecimento caminhando', '5 min', 'leve', 'Preparar corpo para correr.', ['cardio']),
      ex('intervalado-1-2', 'Intervalado: 1 min trote + 2 min caminhada', '6x', 'Z2–Z3', 'Trote moderado, sem sprint.', ['cardio']),
      ex('volta-calma', 'Volta à calma caminhando', '5 min', 'leve', 'Desacelerar.', ['cardio']),
      ex('flexao-solo', 'Flexão no solo', '4 séries', '2 reps antes da falha', 'Hoje sua base é 12 reps. Registrar reps limpas.', ['peito', 'triceps', 'ombros']),
      ex('barra-negativa', 'Barra negativa', '4x2–3', 'controle', 'Sobe com apoio e desce em 4–5s.', ['costas', 'biceps']),
      ex('dead-hang', 'Dead Hang pendurado', '3x20–30s', 'controle', 'Força de pegada e ombro saudável.', ['costas', 'biceps']),
      ex('prancha-calistenia', 'Prancha', '3x30s', 'controle', 'Abdômen funcional.', ['abdomen'])
    ]
  },
  {
    id: 'sex-superior-b',
    day: 5,
    title: 'Superior B Volume/Shape',
    type: 'Musculação',
    duration: '60–70 min',
    intensity: 'Volume',
    goal: 'Ombro largo, peito cheio, costas em V e braço.',
    notes: ['Mais volume, menos ego.', 'Elevação lateral é prioridade visual.'],
    exercises: [
      ex('supino-inclinado-b', 'Supino inclinado halter/máquina', '4x8–12', 'RIR 1–2', 'Peito superior.', ['peito', 'ombros', 'triceps']),
      ex('puxada-triangulo', 'Puxada alta pegada triângulo/neutra', '4x10–12', 'RIR 1–2', 'Foco em dorsal.', ['costas', 'biceps']),
      ex('remada-baixa', 'Remada baixa', '3x10–12', 'RIR 1–2', 'Costas densas.', ['costas', 'biceps']),
      ex('voador-crossover', 'Crucifixo no voador ou crossover', '3x12–15', 'quase falha', 'Peito cheio sem forçar articulação.', ['peito']),
      ex('elevacao-lateral-b', 'Elevação lateral', '5x12–20', 'quase falha', 'Ombro 3D.', ['ombros']),
      ex('face-pull', 'Face pull ou crucifixo inverso', '3x12–20', 'controle', 'Postura, posterior de ombro.', ['ombros', 'costas']),
      ex('rosca-scott-alternada', 'Rosca alternada ou Scott', '3x10–12', 'quase falha', 'Bíceps.', ['biceps']),
      ex('triceps-corda', 'Tríceps corda', '3x10–12', 'quase falha', 'Tríceps cheio.', ['triceps']),
      ex('abdominal-maquina', 'Abdominal máquina/crunch', '3x12–15', 'controle', 'Abdômen com carga.', ['abdomen'])
    ]
  },
  {
    id: 'sab-inferior-b',
    day: 6,
    title: 'Inferior B + Cardio leve',
    type: 'Musculação/Cardio',
    duration: '60–80 min',
    intensity: 'Moderado/Pesado',
    goal: 'Perna, glúteo e gasto calórico sem virar sorvete.',
    notes: ['Se a lombar reclamar no hack/smith, troca por leg press.', 'Cardio pós-treino leve, não corrida forte.'],
    exercises: [
      ex('hack-smith', 'Hack machine ou agachamento no Smith', '3x8–10', 'RIR 1–2', 'Se incomodar, trocar por leg press.', ['quadriceps', 'gluteos']),
      ex('bulgaro-passada', 'Afundo búlgaro ou passada no Smith', '3x8–10 cada perna', 'RIR 1–2', 'Controle e equilíbrio.', ['quadriceps', 'gluteos']),
      ex('cadeira-flexora-b', 'Cadeira Flexora', '3x10–15', 'quase falha', 'Posterior.', ['posterior']),
      ex('cadeira-extensora-b', 'Cadeira Extensora', '3x12–15', 'quase falha', 'Quadríceps.', ['quadriceps']),
      ex('elevacao-pelvica-b', 'Elevação Pélvica', '3x10–12', 'RIR 1–2', 'Glúteo.', ['gluteos', 'posterior']),
      ex('panturrilha-b', 'Panturrilha', '5x12–20', 'quase falha', 'Pausa no alongamento.', ['panturrilha']),
      ex('cardio-pos-perna', 'Cardio leve pós-treino', '20 min', 'leve', 'Caminhada inclinada ou bike leve.', ['cardio'])
    ]
  },
  {
    id: 'dom-descanso',
    day: 0,
    title: 'Descanso total',
    type: 'Recuperação',
    duration: 'Livre',
    intensity: 'Leve',
    goal: 'Recuperar, dormir melhor, preparar a próxima semana.',
    notes: ['Pode caminhar leve se quiser.', 'Sem culpa. O descanso também constrói shape.'],
    exercises: [
      ex('caminhada-opcional', 'Caminhada opcional', '20–40 min', 'leve', 'Só se estiver com vontade.', ['cardio']),
      ex('mobilidade-leve', 'Mobilidade leve', '8–10 min', 'leve', 'Soltar lombar/quadril.', ['lombar'])
    ]
  }
];


const exerciseLibrary = [
  lib('supino-maquina', 'Supino Máquina', ['peito', 'triceps', 'ombros'], 'Máquina', '4x6–10', 'Peito cheio com controle e segurança.'),
  lib('supino-halter-reto', 'Supino Reto com Halteres', ['peito', 'triceps', 'ombros'], 'Halter', '4x8–12', 'Mais liberdade de movimento e amplitude.'),
  lib('supino-inclinado-halter', 'Supino Inclinado com Halteres', ['peito', 'ombros', 'triceps'], 'Halter', '4x8–12', 'Prioridade para peito superior.'),
  lib('supino-inclinado-maquina', 'Supino Inclinado Máquina', ['peito', 'ombros', 'triceps'], 'Máquina', '4x8–12', 'Estável para progredir carga.'),
  lib('crucifixo-voador', 'Crucifixo no Voador', ['peito'], 'Máquina', '3x12–15', 'Isolador de peito sem exigir lombar.'),
  lib('crossover-cabo', 'Crossover no Cabo', ['peito'], 'Cabo', '3x12–15', 'Tensão constante no peito.'),
  lib('flexao-solo-lib', 'Flexão no Solo', ['peito', 'triceps', 'ombros'], 'Peso corporal', '4 séries', 'Calistenia base para peito e tríceps.'),
  lib('supino-declinado-maquina', 'Supino Declinado Máquina', ['peito', 'triceps'], 'Máquina', '3x8–12', 'Variação estável para peito.'),

  lib('puxada-alta-aberta-lib', 'Puxada Alta Aberta', ['costas', 'biceps'], 'Cabo', '4x8–12', 'Dorsal para costas em V.'),
  lib('puxada-neutra', 'Puxada Alta Pegada Neutra', ['costas', 'biceps'], 'Cabo', '4x10–12', 'Boa opção para ombro mais confortável.'),
  lib('puxada-triangulo-lib', 'Puxada Alta Triângulo', ['costas', 'biceps'], 'Cabo', '4x10–12', 'Mais controle na dorsal.'),
  lib('remada-sentada-lib', 'Remada Sentada Cabo/Máquina', ['costas', 'biceps'], 'Cabo/Máquina', '3x8–12', 'Costas densas sem roubar na lombar.'),
  lib('remada-baixa-lib', 'Remada Baixa', ['costas', 'biceps'], 'Cabo', '3x10–12', 'Espessura de costas.'),
  lib('remada-maquina-peito-apoiado', 'Remada Máquina com Peito Apoiado', ['costas', 'biceps'], 'Máquina', '3x8–12', 'Excelente quando a lombar está sensível.'),
  lib('pullover-cabo', 'Pullover no Cabo', ['costas'], 'Cabo', '3x12–15', 'Isolador de dorsal.'),
  lib('barra-fixa-assistida', 'Barra Fixa Assistida', ['costas', 'biceps'], 'Máquina/Peso corporal', '3x6–10', 'Progressão para barras livres.'),
  lib('barra-negativa-lib', 'Barra Negativa', ['costas', 'biceps'], 'Peso corporal', '4x2–3', 'Desce devagar para ganhar força.'),

  lib('desenvolvimento-maquina', 'Desenvolvimento Máquina', ['ombros', 'triceps'], 'Máquina', '3x8–10', 'Ombro forte com estabilidade.'),
  lib('desenvolvimento-halter', 'Desenvolvimento com Halteres', ['ombros', 'triceps'], 'Halter', '3x8–12', 'Mais controle e amplitude.'),
  lib('elevacao-lateral-halter', 'Elevação Lateral Halter', ['ombros'], 'Halter', '4x12–20', 'Prioridade para ombro largo.'),
  lib('elevacao-lateral-cabo', 'Elevação Lateral no Cabo', ['ombros'], 'Cabo', '4x12–20', 'Tensão constante no deltóide lateral.'),
  lib('face-pull-lib', 'Face Pull', ['ombros', 'costas'], 'Cabo', '3x12–20', 'Postura e posterior de ombro.'),
  lib('crucifixo-inverso', 'Crucifixo Inverso', ['ombros', 'costas'], 'Máquina/Halter', '3x12–20', 'Posterior de ombro.'),

  lib('rosca-direta-polia-lib', 'Rosca Direta na Polia', ['biceps'], 'Cabo', '3x10–12', 'Bíceps com tensão constante.'),
  lib('rosca-scott-maquina', 'Rosca Scott Máquina', ['biceps'], 'Máquina', '3x10–12', 'Isola o bíceps e reduz roubo.'),
  lib('rosca-alternada', 'Rosca Alternada', ['biceps'], 'Halter', '3x10–12', 'Bíceps com controle.'),
  lib('rosca-martelo', 'Rosca Martelo', ['biceps'], 'Halter', '3x10–12', 'Braquial/antebraço, braço mais cheio.'),
  lib('rosca-concentrada', 'Rosca Concentrada', ['biceps'], 'Halter', '3x10–12', 'Isolador para controle.'),

  lib('triceps-polia-barra', 'Tríceps Polia Barra', ['triceps'], 'Cabo', '3x10–12', 'Tríceps pesado e simples.'),
  lib('triceps-corda-lib', 'Tríceps Corda', ['triceps'], 'Cabo', '3x10–12', 'Boa contração no final.'),
  lib('triceps-testa', 'Tríceps Testa', ['triceps'], 'Barra/Halter', '3x10–12', 'Cuidado com cotovelo.'),
  lib('triceps-frances-cabo', 'Extensão de Tríceps Acima da Cabeça', ['triceps'], 'Cabo', '3x10–15', 'Cabeça longa do tríceps.'),
  lib('mergulho-maquina', 'Mergulho Máquina', ['triceps', 'peito'], 'Máquina', '3x8–12', 'Tríceps e peito inferior.'),

  lib('leg-press-lib', 'Leg Press', ['quadriceps', 'gluteos'], 'Máquina', '4x8–12', 'Perna pesada com controle de lombar.'),
  lib('cadeira-extensora-lib', 'Cadeira Extensora', ['quadriceps'], 'Máquina', '3x10–15', 'Quadríceps isolado.'),
  lib('hack-machine', 'Hack Machine', ['quadriceps', 'gluteos'], 'Máquina', '3x8–10', 'Agachamento guiado.'),
  lib('agachamento-smith', 'Agachamento no Smith', ['quadriceps', 'gluteos'], 'Smith', '3x8–10', 'Controle e estabilidade.'),
  lib('afundo-bulgaro', 'Afundo Búlgaro', ['quadriceps', 'gluteos'], 'Halter/Smith', '3x8–10 cada perna', 'Unilateral forte.'),
  lib('passada-smith', 'Passada no Smith', ['quadriceps', 'gluteos'], 'Smith', '3x8–10 cada perna', 'Boa alternativa ao búlgaro.'),

  lib('mesa-flexora-lib', 'Mesa Flexora', ['posterior'], 'Máquina', '4x10–12', 'Posterior de coxa.'),
  lib('cadeira-flexora-lib', 'Cadeira Flexora', ['posterior'], 'Máquina', '3x10–15', 'Posterior com controle.'),
  lib('stiff-leve', 'Stiff/Romeno Leve', ['posterior', 'gluteos', 'lombar'], 'Barra/Halter', '3x8–10', 'Só se lombar estiver 100%.'),
  lib('elevacao-pelvica-lib', 'Elevação Pélvica', ['gluteos', 'posterior'], 'Barra/Máquina', '4x8–12', 'Glúteo forte e estabilidade.'),
  lib('cadeira-abdutora-lib', 'Cadeira Abdutora', ['gluteos'], 'Máquina', '3x12–20', 'Glúteo médio para estabilidade.'),
  lib('glute-kickback-cabo', 'Coice no Cabo', ['gluteos'], 'Cabo', '3x12–15', 'Glúteo isolado.'),

  lib('panturrilha-em-pe', 'Panturrilha em Pé', ['panturrilha'], 'Máquina', '5x10–15', 'Pausa em cima e embaixo.'),
  lib('panturrilha-sentado', 'Panturrilha Sentado', ['panturrilha'], 'Máquina', '5x12–20', 'Sóleo e resistência.'),
  lib('panturrilha-unilateral', 'Panturrilha Unilateral', ['panturrilha'], 'Máquina/Halter', '4x12–20 cada', 'Corrige diferença entre lados.'),

  lib('prancha-lib', 'Prancha', ['abdomen'], 'Peso corporal', '3x30–45s', 'Core firme.'),
  lib('abdominal-maquina-lib', 'Abdominal Máquina', ['abdomen'], 'Máquina', '3x12–15', 'Abdômen com carga.'),
  lib('crunch-solo', 'Crunch no Solo', ['abdomen'], 'Peso corporal', '3x15–20', 'Simples e seguro.'),
  lib('dead-bug-lib', 'Dead Bug', ['abdomen', 'lombar'], 'Peso corporal', '3x10 cada lado', 'Core sem forçar lombar.'),
  lib('bird-dog-lib', 'Bird Dog', ['lombar', 'gluteos'], 'Peso corporal', '3x10 cada lado', 'Estabilidade lombar.'),
  lib('hiperextensao-lombar', 'Hiperextensão Lombar', ['lombar', 'gluteos', 'posterior'], 'Banco', '3x10–12', 'Só leve e controlado.'),

  lib('caminhada-z2', 'Caminhada Z2', ['cardio'], 'Rua/Esteira', '30 min', 'Ritmo conversável.'),
  lib('bike-leve', 'Bike Leve', ['cardio'], 'Bike', '20–30 min', 'Cardio sem impacto.'),
  lib('esteira-inclinada', 'Esteira Inclinada', ['cardio', 'gluteos', 'panturrilha'], 'Esteira', '20–30 min', 'Queima boa sem precisar correr forte.'),
  lib('intervalado-leve', 'Intervalado Leve', ['cardio'], 'Rua/Esteira', '6x 1 min/2 min', 'Trote + caminhada.'),
  lib('simulador-escadas', 'Simulador de Escadas', ['cardio', 'gluteos', 'quadriceps', 'panturrilha'], 'Máquina', '10–20 min', 'Forte, usar com cautela no déficit.')
];

function lib(id, name, muscles, equipment, target, note) {
  return { id, name, muscles, equipment, target, intensity: 'Alternativa', note };
}

function ex(id, name, target, intensity, note, muscles) {
  return { id, name, target, intensity, note, muscles, equipment: 'Plano' };
}

const defaultState = {
  profile: {
    name: 'Isacc Lopes', initials: 'IL', age: 27, height: 1.85, weight: 95.75,
    goal: 'Perder gordura, ganhar superior e melhorar corrida',
    sleepTarget: '22:30',
    gymWindow: '18:15–20:00'
  },
  settings: {
    waterGoalMl: 2500,
    glassMl: 250,
    bottleMl: 500,
    remindersEnabled: false,
    walkReminderTimes: ['09:00', '11:00', '14:00', '16:00'],
    creatineEnabled: true,
    creatineDose: '3–5g/dia'
  },
  checklists: {},
  water: {},
  bodyMeasures: [
    { date: '2026-05-27', weight: 95.75, neck: 41, shoulder: 132, chest: 112, waist: 96, armL: 40, armR: 40, forearmL: 31, forearmR: 31, abdomenUpper: 41, abdomenLower: 110, thighL: 66, thighR: 66, calfL: 43, calfR: 43, hip: 107 }
  ],
  workoutLogs: [],
  runLogs: [],
  exerciseOverrides: {},
  notes: [],
  appVersion: '1.0.0'
};

let state = loadState();
let currentRoute = 'home';
let deferredInstallPrompt = null;
let lastReminderSent = {};

function loadState() {
  try {
    let raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const legacyKey = LEGACY_STORE_KEYS.find(key => localStorage.getItem(key));
      raw = legacyKey ? localStorage.getItem(legacyKey) : null;
    }
    if (!raw) return structuredClone(defaultState);
    const saved = JSON.parse(raw);
    return mergeDeep(structuredClone(defaultState), saved);
  } catch (error) {
    console.error(error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function mergeDeep(target, source) {
  if (!source || typeof source !== 'object') return target;
  Object.keys(source).forEach(key => {
    if (Array.isArray(source[key])) target[key] = source[key];
    else if (source[key] && typeof source[key] === 'object') target[key] = mergeDeep(target[key] || {}, source[key]);
    else target[key] = source[key];
  });
  return target;
}

function showToast(message) {
  $toast.textContent = message;
  $toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => $toast.classList.remove('show'), 2700);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function getTodayWorkout() {
  const day = new Date().getDay();
  return plan.find(w => w.day === day) || plan[0];
}

function getChecklist(date = todayISO()) {
  if (!state.checklists[date]) {
    state.checklists[date] = {
      noSofa: false,
      workout: false,
      water: false,
      protein: false,
      creatine: false,
      sleep: false,
      walkBreaks: false
    };
  }
  return state.checklists[date];
}

function getWaterDay(date = todayISO()) {
  if (!state.water[date]) state.water[date] = { totalMl: 0, entries: [] };
  return state.water[date];
}

function formatMl(ml) {
  if (ml >= 1000) return `${(ml / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`;
  return `${ml} ml`;
}

function calcPace(distanceKm, timeMin) {
  if (!distanceKm || !timeMin) return '';
  const pace = timeMin / distanceKm;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60).toString().padStart(2, '0');
  return `${min}:${sec}/km`;
}

function parseTimeToMinutes(value) {
  if (!value) return 0;
  const parts = String(value).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(value) || 0;
}

function setRoute(route) {
  currentRoute = route;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.route === baseRoute(route)));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function baseRoute(route) {
  if (route.startsWith('workout:')) return 'workouts';
  return route;
}

function overrideKey(workoutId, slotId) {
  return `${workoutId}::${slotId}`;
}

function getWorkout(workoutId) {
  return plan.find(w => w.id === workoutId);
}

function getExercisesForWorkout(workout) {
  return workout.exercises.map(slot => {
    const replacement = state.exerciseOverrides?.[overrideKey(workout.id, slot.id)];
    if (replacement) {
      return { ...replacement, slotId: slot.id, originalId: slot.id, originalName: slot.name, replaced: true };
    }
    return { ...slot, slotId: slot.id, originalId: slot.id, originalName: slot.name, replaced: false };
  });
}

function findExerciseInWorkout(workoutId, exerciseId, slotId = '') {
  const workout = getWorkout(workoutId);
  if (!workout) return null;
  return getExercisesForWorkout(workout).find(e => e.slotId === slotId || e.id === exerciseId);
}

function findExerciseById(exerciseId, workoutId = '') {
  if (workoutId) {
    const inWorkout = findExerciseInWorkout(workoutId, exerciseId);
    if (inWorkout) return inWorkout;
  }
  for (const workout of plan) {
    const found = getExercisesForWorkout(workout).find(e => e.id === exerciseId || e.slotId === exerciseId);
    if (found) return found;
  }
  return exerciseLibrary.find(e => e.id === exerciseId) || null;
}

function allLibraryExercises() {
  const planExercises = plan.flatMap(w => w.exercises).map(e => ({ ...e, equipment: e.equipment || 'Plano' }));
  const map = new Map();
  [...exerciseLibrary, ...planExercises].forEach(item => map.set(item.id, item));
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function render() {
  if (currentRoute === 'home') renderHome();
  else if (currentRoute === 'workouts') renderWorkouts();
  else if (currentRoute.startsWith('workout:')) renderWorkoutDetail(currentRoute.split(':')[1]);
  else if (currentRoute === 'run') renderRun();
  else if (currentRoute === 'measures') renderMeasures();
  else if (currentRoute === 'water') renderWater();
  else if (currentRoute === 'progress') renderProgress();
}

function renderHome() {
  const workout = getTodayWorkout();
  const water = getWaterDay();
  const checklist = getChecklist();
  const waterPercent = Math.min(100, Math.round((water.totalMl / state.settings.waterGoalMl) * 100));
  const latestMeasure = state.bodyMeasures.at(-1) || {};
  const weekday = weekdayMap[new Date().getDay()];
  const completedToday = state.workoutLogs.filter(log => log.date === todayISO()).length;

  $app.innerHTML = `
    <section class="hero">
      <h2>${weekday}: ${escapeHtml(workout.title)}</h2>
      <p>${escapeHtml(workout.goal)}</p>
      <div class="pill-row">
        <span class="pill green">${escapeHtml(workout.type)}</span>
        <span class="pill blue">${escapeHtml(workout.duration)}</span>
        <span class="pill orange">${escapeHtml(workout.intensity)}</span>
      </div>
      <div class="btn-row" style="margin-top:16px">
        <button class="btn primary" data-action="open-workout" data-id="${workout.id}">Iniciar treino de hoje</button>
        <button class="btn ghost" data-route-jump="water">Registrar água</button>
      </div>
    </section>

    <section class="grid three" style="margin-top:14px">
      <div class="card compact stat"><span class="label">Peso atual</span><span class="value">${latestMeasure.weight || state.profile.weight} kg</span><span class="sub">Meta: cintura baixando</span></div>
      <div class="card compact stat"><span class="label">Cintura</span><span class="value">${latestMeasure.waist || 96} cm</span><span class="sub">1x por semana</span></div>
      <div class="card compact stat"><span class="label">Água hoje</span><span class="value">${formatMl(water.totalMl)}</span><span class="sub">${waterPercent}% da meta</span></div>
    </section>

    <section class="section-title">
      <div><h2>Checklist do Isacc</h2><p>Coisas pequenas que seguram o resultado no déficit.</p></div>
    </section>
    <div class="checklist">
      ${checkItem('noSofa', 'Cheguei e não sentei no sofá/celular antes do treino', checklist.noSofa)}
      ${checkItem('workout', completedToday ? `Treino registrado (${completedToday} exercício(s))` : 'Treino do dia feito', checklist.workout || completedToday)}
      ${checkItem('water', `Água: bater ${formatMl(state.settings.waterGoalMl)}`, checklist.water || water.totalMl >= state.settings.waterGoalMl)}
      ${checkItem('protein', 'Proteína nas refeições principais', checklist.protein)}
      ${checkItem('creatine', `Creatina ${state.settings.creatineDose}`, checklist.creatine)}
      ${checkItem('walkBreaks', 'Pausas de caminhada no trabalho', checklist.walkBreaks)}
      ${checkItem('sleep', `Cama perto de ${state.profile.sleepTarget}`, checklist.sleep)}
    </div>

    <section class="section-title">
      <div><h2>Plano de hoje</h2><p>Ordem simples para executar sem pensar.</p></div>
    </section>
    <div class="timeline">
      <div class="timeline-item"><strong>17:40</strong><span>Chegar em casa e comer pré-treino planejado.</span></div>
      <div class="timeline-item"><strong>18:15–18:30</strong><span>Ir para academia sem cair no sofá.</span></div>
      <div class="timeline-item"><strong>20:00–20:30</strong><span>Jantar e deixar tudo pronto para amanhã.</span></div>
      <div class="timeline-item"><strong>22:30</strong><span>Dormir para não quebrar a semana.</span></div>
    </div>

    <section class="section-title">
      <div><h2>Exercícios de hoje</h2><p>Toque para registrar carga, reps, RIR e dor.</p></div>
    </section>
    <div class="list">
      ${getExercisesForWorkout(workout).map(item => `
        <div class="list-item">
          <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.target)} • ${escapeHtml(item.intensity)}${item.replaced ? ` • substituiu ${escapeHtml(item.originalName)}` : ''}</small></div>
          <button class="btn ghost" data-action="log-exercise" data-workout="${workout.id}" data-exercise="${item.id}" data-slot="${item.slotId}">Registrar</button>
        </div>
      `).join('')}
    </div>
  `;
}

function checkItem(key, label, checked) {
  return `<label class="check ${checked ? 'done' : ''}"><input type="checkbox" data-action="toggle-check" data-key="${key}" ${checked ? 'checked' : ''}> ${escapeHtml(label)}</label>`;
}

function renderWorkouts() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const ordered = order.map(day => plan.find(w => w.day === day));
  $app.innerHTML = `
    <section class="hero">
      <h2>Semana híbrida</h2>
      <p>Superior 2x, inferior 2x, corrida/calistenia e um dia curto para segunda-feira não te vencer.</p>
      <div class="pill-row">
        <span class="pill green">Hipertrofia</span>
        <span class="pill blue">Corrida</span>
        <span class="pill orange">Calistenia</span>
      </div>
    </section>
    <section class="section-title">
      <div><h2>Treinos</h2><p>Abra o dia e registre as séries anteriores igual Hevy.</p></div>
    </section>
    <div class="grid">
      ${ordered.map(w => workoutCard(w)).join('')}
    </div>
  `;
}

function workoutCard(w) {
  const logs = state.workoutLogs.filter(log => log.workoutId === w.id);
  return `
    <article class="card week-card">
      <div class="day-badge"><strong>${shortWeek[w.day]}</strong><span>${escapeHtml(w.type)}</span></div>
      <div>
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.goal)}</p>
        <div class="pill-row">
          <span class="pill green">${escapeHtml(w.duration)}</span>
          <span class="pill blue">${getExercisesForWorkout(w).length} itens</span>
          <span class="pill">${logs.length} registros</span>
        </div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn primary" data-action="open-workout" data-id="${w.id}">Abrir treino</button>
        </div>
      </div>
    </article>
  `;
}

function renderWorkoutDetail(workoutId) {
  const workout = plan.find(w => w.id === workoutId) || getTodayWorkout();
  const exercises = getExercisesForWorkout(workout);
  const muscleCount = getWorkoutMuscleCount(workout);
  $app.innerHTML = `
    <section class="hero">
      <h2>${escapeHtml(workout.title)}</h2>
      <p>${escapeHtml(workout.goal)}</p>
      <div class="pill-row">
        <span class="pill green">${escapeHtml(workout.type)}</span>
        <span class="pill blue">${escapeHtml(workout.duration)}</span>
        <span class="pill orange">${escapeHtml(workout.intensity)}</span>
      </div>
      <div class="btn-row" style="margin-top:16px">
        <button class="btn ghost" data-route-jump="workouts">Voltar</button>
        <button class="btn primary" data-action="finish-workout" data-workout="${workout.id}">Marcar treino feito</button>
      </div>
    </section>

    <section class="section-title">
      <div><h2>Músculos do treino</h2><p>Distribuição de estímulos de hoje.</p></div>
    </section>
    <div class="pill-row">
      ${Object.entries(muscleCount).map(([muscle, count]) => `<span class="pill green">${muscleGroups[muscle]} • ${count}</span>`).join('')}
    </div>

    <section class="section-title">
      <div><h2>Exercícios</h2><p>Registre peso, reps, RIR, descanso e dor. O app mostra o último registro.</p></div>
    </section>
    <div>
      ${exercises.map(exercise => exerciseCard(workout, exercise)).join('')}
    </div>
  `;
}

function getWorkoutMuscleCount(workout) {
  const result = {};
  getExercisesForWorkout(workout).forEach(item => item.muscles.forEach(m => result[m] = (result[m] || 0) + 1));
  return result;
}

function exerciseCard(workout, exercise) {
  const latest = getLatestExerciseLog(exercise.id);
  return `
    <article class="exercise">
      <div class="exercise-head">
        <div>
          <h4>${escapeHtml(exercise.name)}</h4>
          <small>${escapeHtml(exercise.target)} • ${escapeHtml(exercise.intensity)}${exercise.replaced ? ` • substituiu ${escapeHtml(exercise.originalName)}` : ''}</small>
        </div>
        <div class="btn-row exercise-actions">
          <button class="btn ghost" data-action="replace-exercise" data-workout="${workout.id}" data-slot="${exercise.slotId}">Substituir</button>
          <button class="btn primary" data-action="log-exercise" data-workout="${workout.id}" data-exercise="${exercise.id}" data-slot="${exercise.slotId}">Registrar</button>
        </div>
      </div>
      <div class="exercise-visual-row">
        ${muscleFigure(exercise.muscles, exercise.name)}
        <div>
          <p style="margin-top:9px">${escapeHtml(exercise.note)}</p>
          <div class="pill-row">
            ${exercise.muscles.map(m => `<span class="pill blue">${muscleGroups[m]}</span>`).join('')}
          </div>
          ${exercise.equipment ? `<div class="pill-row"><span class="pill">${escapeHtml(exercise.equipment)}</span>${exercise.replaced ? `<button class="btn ghost mini" data-action="reset-replacement" data-workout="${workout.id}" data-slot="${exercise.slotId}">Voltar original</button>` : ''}</div>` : ''}
        </div>
      </div>
      ${latest ? `
        <table class="sets-table">
          <thead><tr><th>Último</th><th>Kg</th><th>Reps</th><th>RIR</th><th>Dor</th></tr></thead>
          <tbody>${latest.sets.map((s, index) => `<tr><td>${index + 1}</td><td>${s.weight || '-'}</td><td>${s.reps || '-'}</td><td>${s.rir || '-'}</td><td>${s.pain || 0}/10</td></tr>`).join('')}</tbody>
        </table>
      ` : `<div class="empty" style="margin-top:10px;padding:14px">Sem registro ainda. Bora criar histórico.</div>`}
    </article>
  `;
}

function hasMuscle(muscles, names) {
  return names.some(name => muscles.includes(name));
}

function muscleCls(muscles, names) {
  return hasMuscle(muscles, names) ? 'muscle-zone active' : 'muscle-zone';
}

function muscleFigure(muscles = [], label = '') {
  const front = {
    chest: muscleCls(muscles, ['peito']), shoulders: muscleCls(muscles, ['ombros']),
    arms: muscleCls(muscles, ['biceps', 'triceps']), abs: muscleCls(muscles, ['abdomen']),
    quads: muscleCls(muscles, ['quadriceps']), calves: muscleCls(muscles, ['panturrilha']),
    cardio: muscleCls(muscles, ['cardio'])
  };
  const back = {
    back: muscleCls(muscles, ['costas']), shoulders: muscleCls(muscles, ['ombros']),
    arms: muscleCls(muscles, ['triceps', 'biceps']), lumbar: muscleCls(muscles, ['lombar']),
    glutes: muscleCls(muscles, ['gluteos']), posterior: muscleCls(muscles, ['posterior']),
    calves: muscleCls(muscles, ['panturrilha']), cardio: muscleCls(muscles, ['cardio'])
  };
  return `
    <div class="muscle-card" aria-label="Músculos alvo de ${escapeHtml(label)}">
      <svg class="muscle-svg" viewBox="0 0 240 180" role="img">
        <text x="54" y="14" text-anchor="middle" class="figure-label">Frente</text>
        <text x="174" y="14" text-anchor="middle" class="figure-label">Costas</text>

        <g transform="translate(16,18)">
          <circle class="body-base" cx="38" cy="13" r="10"/>
          <path class="body-base" d="M29 27 Q38 22 47 27 L53 70 Q45 78 31 78 L23 70 Z"/>
          <path class="${front.chest}" d="M27 30 Q38 25 49 30 L47 48 Q38 45 29 48 Z"/>
          <path class="${front.abs}" d="M31 49 L45 49 L46 73 Q38 77 30 73 Z"/>
          <circle class="${front.shoulders}" cx="22" cy="32" r="8"/>
          <circle class="${front.shoulders}" cx="54" cy="32" r="8"/>
          <path class="${front.arms}" d="M16 38 Q10 57 13 79 L23 78 Q22 56 28 39 Z"/>
          <path class="${front.arms}" d="M60 38 Q66 57 63 79 L53 78 Q54 56 48 39 Z"/>
          <path class="${front.quads}" d="M29 78 L39 78 L38 122 L25 122 Z"/>
          <path class="${front.quads}" d="M41 78 L51 78 L55 122 L42 122 Z"/>
          <path class="${front.calves}" d="M26 122 L38 122 L35 150 L24 150 Z"/>
          <path class="${front.calves}" d="M43 122 L55 122 L57 150 L46 150 Z"/>
          <path class="${front.cardio}" d="M38 40 c-8-8-18 2-8 12 l8 8 l8-8 c10-10 0-20-8-12z"/>
        </g>

        <g transform="translate(136,18)">
          <circle class="body-base" cx="38" cy="13" r="10"/>
          <path class="body-base" d="M29 27 Q38 22 47 27 L53 70 Q45 78 31 78 L23 70 Z"/>
          <path class="${back.back}" d="M25 30 Q38 22 51 30 L50 63 Q38 56 26 63 Z"/>
          <path class="${back.lumbar}" d="M31 59 L45 59 L47 76 Q38 80 29 76 Z"/>
          <circle class="${back.shoulders}" cx="22" cy="32" r="8"/>
          <circle class="${back.shoulders}" cx="54" cy="32" r="8"/>
          <path class="${back.arms}" d="M16 38 Q10 57 13 79 L23 78 Q22 56 28 39 Z"/>
          <path class="${back.arms}" d="M60 38 Q66 57 63 79 L53 78 Q54 56 48 39 Z"/>
          <path class="${back.glutes}" d="M28 76 Q38 70 48 76 L50 92 Q38 100 26 92 Z"/>
          <path class="${back.posterior}" d="M28 92 L39 92 L37 122 L25 122 Z"/>
          <path class="${back.posterior}" d="M41 92 L52 92 L55 122 L43 122 Z"/>
          <path class="${back.calves}" d="M26 122 L38 122 L35 150 L24 150 Z"/>
          <path class="${back.calves}" d="M43 122 L55 122 L57 150 L46 150 Z"/>
          <path class="${back.cardio}" d="M38 41 c-7-7-16 2-7 11 l7 7 l7-7 c9-9 0-18-7-11z"/>
        </g>
      </svg>
    </div>
  `;
}

function getLatestExerciseLog(exerciseId) {
  return [...state.workoutLogs].reverse().find(log => log.exerciseId === exerciseId);
}

function renderRun() {
  const best5k = getBestRunAtLeast(5);
  const best3k = getBestRunAtLeast(3);
  $app.innerHTML = `
    <section class="hero">
      <h2>Corrida</h2>
      <p>Registre distância, tempo, pace e sensação. Sem exagerar para não atrapalhar a hipertrofia.</p>
      <div class="pill-row">
        <span class="pill green">Seg: Z2 leve</span>
        <span class="pill blue">Qui: intervalado</span>
        <span class="pill orange">Sáb: cardio leve</span>
      </div>
    </section>

    <section class="grid two" style="margin-top:14px">
      <div class="card stat"><span class="label">Melhor 3 km+</span><span class="value">${best3k ? best3k.pace : '-'}</span><span class="sub">${best3k ? `${best3k.distanceKm} km • ${best3k.date}` : 'sem registro'}</span></div>
      <div class="card stat"><span class="label">Melhor 5 km+</span><span class="value">${best5k ? best5k.pace : '-'}</span><span class="sub">${best5k ? `${best5k.distanceKm} km • ${best5k.date}` : 'sem registro'}</span></div>
    </section>

    <section class="section-title">
      <div><h2>Novo registro</h2><p>Use formato tempo 00:30 ou 00:30:15.</p></div>
    </section>
    <form class="card" data-form="run">
      <div class="form-grid">
        <div><label>Data</label><input class="input" name="date" type="date" value="${todayISO()}"></div>
        <div><label>Tipo</label><select name="type"><option>Corrida</option><option>Caminhada</option><option>Esteira</option><option>Intervalado</option></select></div>
        <div><label>Distância (km)</label><input class="input" name="distanceKm" type="number" step="0.01" placeholder="Ex: 3.21"></div>
        <div><label>Tempo</label><input class="input" name="time" type="text" placeholder="Ex: 23:28 ou 00:23:28"></div>
        <div><label>Local</label><input class="input" name="location" placeholder="Porto Franco, Esteira..."></div>
        <div><label>Sensação</label><select name="feeling"><option>Leve</option><option>Boa</option><option>Pesada</option><option>Destruído</option></select></div>
      </div>
      <div style="margin-top:12px"><label>Observação</label><textarea name="notes" placeholder="Dor, respiração, pace, clima..."></textarea></div>
      <div class="btn-row" style="margin-top:14px"><button class="btn primary" type="submit">Salvar corrida</button></div>
    </form>

    <section class="section-title">
      <div><h2>Histórico</h2><p>Últimas corridas/caminhadas.</p></div>
    </section>
    <div class="list">
      ${state.runLogs.length ? [...state.runLogs].reverse().map(runItem).join('') : '<div class="empty">Nenhuma corrida registrada ainda.</div>'}
    </div>
  `;
}

function runItem(run) {
  return `
    <div class="list-item">
      <div>
        <strong>${escapeHtml(run.type)} • ${run.distanceKm} km</strong>
        <small>${escapeHtml(run.date)} • ${escapeHtml(run.time)} • ${escapeHtml(run.pace)} • ${escapeHtml(run.feeling)}</small>
      </div>
      <button class="btn ghost" data-action="delete-run" data-id="${run.id}">Excluir</button>
    </div>
  `;
}

function getBestRunAtLeast(distance) {
  const runs = state.runLogs.filter(r => Number(r.distanceKm) >= distance && r.timeMin);
  if (!runs.length) return null;
  return [...runs].sort((a, b) => (a.timeMin / a.distanceKm) - (b.timeMin / b.distanceKm))[0];
}

function renderMeasures() {
  const latest = state.bodyMeasures.at(-1) || {};
  const previous = state.bodyMeasures.at(-2) || {};
  const diffWaist = latest.waist && previous.waist ? (latest.waist - previous.waist).toFixed(1) : null;
  const diffWeight = latest.weight && previous.weight ? (latest.weight - previous.weight).toFixed(2) : null;
  $app.innerHTML = `
    <section class="hero">
      <h2>Medidas corporais</h2>
      <p>Peso é só uma parte. Cintura, foto, carga e corrida vão mostrar se o plano está funcionando.</p>
      <div class="pill-row">
        <span class="pill green">Peso ${latest.weight || '-'} kg ${diffWeight ? signed(diffWeight, 'kg') : ''}</span>
        <span class="pill blue">Cintura ${latest.waist || '-'} cm ${diffWaist ? signed(diffWaist, 'cm') : ''}</span>
        <span class="pill orange">Braço ${latest.armR || '-'} cm</span>
      </div>
    </section>

    <section class="section-title">
      <div><h2>Novo registro</h2><p>Meça sempre no mesmo horário. Ideal: ao acordar.</p></div>
    </section>
    <form class="card" data-form="measures">
      <div class="form-grid three">
        ${measureInput('date', 'Data', 'date', todayISO())}
        ${measureInput('weight', 'Peso kg', 'number', latest.weight, '0.01')}
        ${measureInput('waist', 'Cintura cm', 'number', latest.waist, '0.1')}
        ${measureInput('neck', 'Pescoço cm', 'number', latest.neck, '0.1')}
        ${measureInput('shoulder', 'Ombro cm', 'number', latest.shoulder, '0.1')}
        ${measureInput('chest', 'Peito cm', 'number', latest.chest, '0.1')}
        ${measureInput('armL', 'Braço esquerdo', 'number', latest.armL, '0.1')}
        ${measureInput('armR', 'Braço direito', 'number', latest.armR, '0.1')}
        ${measureInput('forearmL', 'Antebraço esquerdo', 'number', latest.forearmL, '0.1')}
        ${measureInput('forearmR', 'Antebraço direito', 'number', latest.forearmR, '0.1')}
        ${measureInput('abdomenUpper', 'Abdômen superior', 'number', latest.abdomenUpper, '0.1')}
        ${measureInput('abdomenLower', 'Abdômen inferior', 'number', latest.abdomenLower, '0.1')}
        ${measureInput('thighL', 'Coxa esquerda', 'number', latest.thighL, '0.1')}
        ${measureInput('thighR', 'Coxa direita', 'number', latest.thighR, '0.1')}
        ${measureInput('calfL', 'Panturrilha esquerda', 'number', latest.calfL, '0.1')}
        ${measureInput('calfR', 'Panturrilha direita', 'number', latest.calfR, '0.1')}
        ${measureInput('hip', 'Quadril cm', 'number', latest.hip, '0.1')}
      </div>
      <div class="btn-row" style="margin-top:14px"><button class="btn primary" type="submit">Salvar medidas</button></div>
    </form>

    <section class="section-title">
      <div><h2>Histórico</h2><p>Últimos registros de evolução.</p></div>
    </section>
    <div class="list">
      ${state.bodyMeasures.length ? [...state.bodyMeasures].reverse().map(measureItem).join('') : '<div class="empty">Sem medidas registradas.</div>'}
    </div>
  `;
}

function measureInput(name, label, type, value = '', step = '') {
  return `<div><label>${label}</label><input class="input" name="${name}" type="${type}" ${step ? `step="${step}"` : ''} value="${escapeHtml(value ?? '')}"></div>`;
}

function signed(value, unit) {
  const n = Number(value);
  const cls = n <= 0 ? '↓' : '↑';
  return `${cls} ${Math.abs(n)} ${unit}`;
}

function measureItem(item) {
  return `
    <div class="list-item">
      <div>
        <strong>${escapeHtml(item.date)} • ${item.weight || '-'} kg</strong>
        <small>Cintura ${item.waist || '-'} cm • Peito ${item.chest || '-'} cm • Braço D ${item.armR || '-'} cm</small>
      </div>
      <button class="btn ghost" data-action="delete-measure" data-date="${item.date}">Excluir</button>
    </div>
  `;
}

function renderWater() {
  const water = getWaterDay();
  const goal = state.settings.waterGoalMl;
  const percent = Math.min(100, Math.round((water.totalMl / goal) * 100));
  const remaining = Math.max(0, goal - water.totalMl);
  $app.innerHTML = `
    <section class="water-big">
      <div>
        <div class="drop">💧</div>
        <div class="number">${formatMl(water.totalMl)}</div>
        <div class="goal">Meta: ${formatMl(goal)} • faltam ${formatMl(remaining)}</div>
      </div>
    </section>
    <div class="card" style="margin-top:12px">
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
      <div class="pill-row"><span class="pill green">${percent}% da meta</span><span class="pill blue">${water.entries.length} registros hoje</span></div>
    </div>

    <section class="section-title">
      <div><h2>Adicionar água</h2><p>Copo, garrafa ou valor personalizado.</p></div>
    </section>
    <div class="grid two">
      <button class="btn blue" data-action="add-water" data-ml="${state.settings.glassMl}">+ 1 copo (${state.settings.glassMl} ml)</button>
      <button class="btn blue" data-action="add-water" data-ml="${state.settings.bottleMl}">+ 1 garrafa (${state.settings.bottleMl} ml)</button>
    </div>
    <form class="card" data-form="custom-water" style="margin-top:12px">
      <div class="form-grid">
        <div><label>Valor personalizado em ml</label><input class="input" name="ml" type="number" placeholder="Ex: 350"></div>
        <div><label>Observação</label><input class="input" name="label" placeholder="Ex: garrafa azul"></div>
      </div>
      <div class="btn-row" style="margin-top:14px"><button class="btn primary" type="submit">Adicionar</button><button class="btn danger" type="button" data-action="clear-water-today">Zerar hoje</button></div>
    </form>

    <section class="section-title">
      <div><h2>Personalizar copo/garrafa</h2><p>Coloque do seu jeito: 200 ml, 300 ml, 750 ml...</p></div>
    </section>
    <form class="card" data-form="water-settings">
      <div class="form-grid three">
        <div><label>Meta diária ml</label><input class="input" name="waterGoalMl" type="number" value="${state.settings.waterGoalMl}"></div>
        <div><label>Copo ml</label><input class="input" name="glassMl" type="number" value="${state.settings.glassMl}"></div>
        <div><label>Garrafa ml</label><input class="input" name="bottleMl" type="number" value="${state.settings.bottleMl}"></div>
      </div>
      <div class="btn-row" style="margin-top:14px"><button class="btn primary" type="submit">Salvar personalização</button></div>
    </form>

    <section class="section-title">
      <div><h2>Registros de hoje</h2><p>Histórico do dia.</p></div>
    </section>
    <div class="list">
      ${water.entries.length ? [...water.entries].reverse().map(entry => `
        <div class="list-item"><div><strong>${formatMl(entry.ml)}</strong><small>${entry.time} • ${escapeHtml(entry.label || 'água')}</small></div><button class="btn ghost" data-action="delete-water" data-id="${entry.id}">Excluir</button></div>
      `).join('') : '<div class="empty">Nenhum copo/garrafa registrado hoje.</div>'}
    </div>
  `;
}

function renderProgress() {
  const volumeByMuscle = getVolumeByMuscle();
  const recentMeasures = state.bodyMeasures.slice(-8);
  const weightChart = chartBars(recentMeasures, 'weight', 'kg');
  const waistChart = chartBars(recentMeasures, 'waist', 'cm');
  const totalWorkouts = new Set(state.workoutLogs.map(l => `${l.date}_${l.workoutId}`)).size;
  const totalRuns = state.runLogs.length;
  const totalRunKm = state.runLogs.reduce((sum, r) => sum + Number(r.distanceKm || 0), 0).toFixed(2);

  $app.innerHTML = `
    <section class="hero">
      <h2>Evolução</h2>
      <p>O app junta shape, força, corrida, água e rotina. Aqui ficam seus PRs e gráficos.</p>
      <div class="pill-row">
        <span class="pill green">${totalWorkouts} treinos</span>
        <span class="pill blue">${totalRuns} corridas</span>
        <span class="pill orange">${totalRunKm} km</span>
      </div>
    </section>

    <section class="grid two" style="margin-top:14px">
      <div class="card"><h3>Peso</h3>${weightChart}</div>
      <div class="card"><h3>Cintura</h3>${waistChart}</div>
    </section>

    <section class="section-title">
      <div><h2>Volume por músculo</h2><p>Contagem dos exercícios registrados por grupo muscular.</p></div>
    </section>
    <div class="grid two">
      ${Object.entries(muscleGroups).map(([key, name]) => `
        <div class="card compact stat"><span class="label">${name}</span><span class="value">${volumeByMuscle[key] || 0}</span><span class="sub">registros</span></div>
      `).join('')}
    </div>

    <section class="section-title">
      <div><h2>Configurações e backup</h2><p>Notificações, exportação e reset.</p></div>
    </section>
    <form class="card" data-form="settings">
      <div class="form-grid">
        <div><label>Horário alvo para dormir</label><input class="input" name="sleepTarget" value="${escapeHtml(state.profile.sleepTarget)}"></div>
        <div><label>Dose creatina</label><input class="input" name="creatineDose" value="${escapeHtml(state.settings.creatineDose)}"></div>
      </div>
      <label class="check ${state.settings.remindersEnabled ? 'done' : ''}" style="margin-top:12px"><input type="checkbox" name="remindersEnabled" ${state.settings.remindersEnabled ? 'checked' : ''}> Ativar lembretes enquanto o app estiver aberto</label>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn primary" type="submit">Salvar configurações</button>
        <button class="btn blue" type="button" data-action="request-notifications">Permitir notificações</button>
      </div>
    </form>

    <div class="grid two" style="margin-top:12px">
      <button class="btn ghost" data-action="export-json">Exportar backup JSON</button>
      <button class="btn ghost" data-action="export-csv">Exportar treinos CSV</button>
      <button class="btn danger" data-action="reset-app">Resetar app</button>
    </div>
  `;
}

function getVolumeByMuscle() {
  const result = {};
  state.workoutLogs.forEach(log => {
    const exercise = findExerciseById(log.exerciseId, log.workoutId);
    if (!exercise) return;
    exercise.muscles.forEach(m => result[m] = (result[m] || 0) + 1);
  });
  return result;
}

function chartBars(items, key, unit) {
  const valid = items.filter(item => Number(item[key]));
  if (!valid.length) return '<div class="empty">Sem dados.</div>';
  const values = valid.map(item => Number(item[key]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  return `<div class="chart">${valid.map(item => {
    const value = Number(item[key]);
    const h = 25 + ((value - min) / range) * 70;
    return `<div class="bar" style="height:${h}%" title="${item.date}: ${value}${unit}"><span>${value}</span></div>`;
  }).join('')}</div>`;
}

function openLogExerciseModal(workoutId, exerciseId, slotId = '') {
  const workout = getWorkout(workoutId);
  const exercise = findExerciseInWorkout(workoutId, exerciseId, slotId);
  if (!workout || !exercise) return;
  const latest = getLatestExerciseLog(exercise.id);
  const rows = inferSetCount(exercise.target);
  const latestRows = latest?.sets || [];

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div><h3>${escapeHtml(exercise.name)}</h3><p style="margin:4px 0 0;color:var(--muted)">${escapeHtml(exercise.target)} • ${escapeHtml(exercise.note)}</p></div>
        <button class="icon-btn" data-modal-close>×</button>
      </div>
      <div class="modal-muscle-preview">${muscleFigure(exercise.muscles, exercise.name)}<div><h4>Músculo alvo</h4><div class="pill-row">${exercise.muscles.map(m => `<span class="pill blue">${muscleGroups[m]}</span>`).join('')}</div></div></div>
      <form data-form="exercise-log" data-workout="${workout.id}" data-exercise="${exercise.id}" data-slot="${exercise.slotId}">
        <div class="form-grid three">
          <div><label>Data</label><input class="input" name="date" type="date" value="${todayISO()}"></div>
          <div><label>Dor lombar/perna 0-10</label><input class="input" name="painGlobal" type="number" min="0" max="10" value="0"></div>
          <div><label>Descanso usado</label><input class="input" name="rest" placeholder="Ex: 90s"></div>
        </div>
        <table class="sets-table">
          <thead><tr><th>Série</th><th>Kg</th><th>Reps/Tempo</th><th>RIR</th><th>Dor</th></tr></thead>
          <tbody>
            ${Array.from({ length: rows }, (_, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><input class="input" name="weight_${i}" type="number" step="0.5" value="${latestRows[i]?.weight || ''}"></td>
                <td><input class="input" name="reps_${i}" value="${latestRows[i]?.reps || ''}" placeholder="10 ou 30s"></td>
                <td><input class="input" name="rir_${i}" type="number" step="1" value="${latestRows[i]?.rir || ''}" placeholder="2"></td>
                <td><input class="input" name="pain_${i}" type="number" min="0" max="10" value="${latestRows[i]?.pain || 0}"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top:12px"><label>Observação</label><textarea name="notes" placeholder="Como foi? Carga leve/pesada? Dor? Forma?"></textarea></div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn primary" type="submit">Salvar exercício</button>
          <button class="btn ghost" type="button" data-modal-close>Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function openReplaceExerciseModal(workoutId, slotId) {
  const workout = getWorkout(workoutId);
  const original = workout?.exercises.find(e => e.id === slotId);
  if (!workout || !original) return;
  const current = findExerciseInWorkout(workoutId, '', slotId) || original;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div>
          <h3>Substituir exercício</h3>
          <p style="margin:4px 0 0;color:var(--muted)">Atual: ${escapeHtml(current.name)} • original: ${escapeHtml(original.name)}</p>
        </div>
        <button class="icon-btn" data-modal-close>×</button>
      </div>
      <div class="modal-muscle-preview">
        ${muscleFigure(current.muscles, current.name)}
        <div>
          <h4>Escolha por músculo</h4>
          <p>Funciona igual uma biblioteca: pesquisa, filtra por músculo e troca mantendo seu treino salvo.</p>
        </div>
      </div>
      <div class="form-grid">
        <div><label>Pesquisar exercício</label><input class="input" data-replace-search placeholder="Ex: supino, remada, panturrilha"></div>
        <div><label>Músculo</label><select data-replace-muscle>
          <option value="">Todos</option>
          ${Object.entries(muscleGroups).map(([key, name]) => `<option value="${key}" ${current.muscles.includes(key) ? 'selected' : ''}>${name}</option>`).join('')}
        </select></div>
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn ghost" data-reset-replacement>Voltar para original</button>
      </div>
      <div class="library-list" data-replace-list></div>
    </div>
  `;

  const search = modal.querySelector('[data-replace-search]');
  const muscle = modal.querySelector('[data-replace-muscle]');
  const list = modal.querySelector('[data-replace-list]');

  function renderChoices() {
    const q = normalize(search.value);
    const selectedMuscle = muscle.value;
    const choices = allLibraryExercises().filter(item => {
      const matchesQuery = !q || normalize(`${item.name} ${item.equipment} ${item.note}`).includes(q);
      const matchesMuscle = !selectedMuscle || item.muscles.includes(selectedMuscle);
      return matchesQuery && matchesMuscle;
    });
    list.innerHTML = choices.length ? choices.map(item => `
      <button class="library-item" data-choose-exercise="${item.id}">
        <div class="library-figure">${muscleFigure(item.muscles, item.name)}</div>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.equipment || 'Alternativa')} • ${escapeHtml(item.target || '')}</small>
          <div class="pill-row">${item.muscles.map(m => `<span class="pill blue">${muscleGroups[m]}</span>`).join('')}</div>
        </div>
      </button>
    `).join('') : '<div class="empty">Nenhum exercício encontrado com esse filtro.</div>';
  }

  function chooseExercise(libraryId) {
    const chosen = allLibraryExercises().find(item => item.id === libraryId);
    if (!chosen) return;
    state.exerciseOverrides[overrideKey(workoutId, slotId)] = { ...chosen };
    saveState();
    modal.remove();
    showToast(`Exercício substituído por ${chosen.name}.`);
    render();
  }

  search.addEventListener('input', renderChoices);
  muscle.addEventListener('change', renderChoices);
  modal.addEventListener('click', event => {
    const chosen = event.target.closest('[data-choose-exercise]');
    if (chosen) chooseExercise(chosen.dataset.chooseExercise);
    if (event.target.closest('[data-reset-replacement]')) {
      delete state.exerciseOverrides[overrideKey(workoutId, slotId)];
      saveState();
      modal.remove();
      showToast('Exercício original restaurado.');
      render();
    }
  });
  document.body.appendChild(modal);
  renderChoices();
}

function normalize(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function inferSetCount(target) {
  const match = String(target).match(/(\d+)x/i);
  if (match) return Math.min(6, Math.max(1, Number(match[1])));
  if (target.includes('6x')) return 6;
  if (target.includes('2–3')) return 3;
  return 3;
}

function saveExerciseLog(form) {
  const workoutId = form.dataset.workout;
  const exerciseId = form.dataset.exercise;
  const sets = [];
  const maxRows = 8;
  for (let i = 0; i < maxRows; i++) {
    if (!(form[`weight_${i}`] || form[`reps_${i}`])) continue;
    const weight = form[`weight_${i}`]?.value || '';
    const reps = form[`reps_${i}`]?.value || '';
    const rir = form[`rir_${i}`]?.value || '';
    const pain = form[`pain_${i}`]?.value || '0';
    if (weight || reps || rir) sets.push({ weight, reps, rir, pain });
  }
  if (!sets.length) {
    showToast('Registra pelo menos uma série/repetição, Isacc.');
    return;
  }
  state.workoutLogs.push({
    id: uid(),
    date: form.date.value || todayISO(),
    time: todayTime(),
    workoutId,
    exerciseId,
    rest: form.rest.value || '',
    painGlobal: form.painGlobal.value || '0',
    notes: form.notes.value || '',
    sets
  });
  getChecklist(form.date.value || todayISO()).workout = true;
  saveState();
  document.querySelector('.modal-backdrop')?.remove();
  showToast('Exercício salvo. Histórico criado!');
  render();
}

function addWater(ml, label = '') {
  ml = Number(ml);
  if (!ml || ml <= 0) return showToast('Informe uma quantidade válida de água.');
  const day = getWaterDay();
  day.totalMl += ml;
  day.entries.push({ id: uid(), ml, label: label || `${ml} ml`, time: todayTime() });
  if (day.totalMl >= state.settings.waterGoalMl) getChecklist().water = true;
  saveState();
  showToast(`+ ${formatMl(ml)} registrado.`);
  render();
}

function exportFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const header = ['date', 'time', 'workoutId', 'exerciseId', 'set', 'weight', 'reps', 'rir', 'pain', 'painGlobal', 'notes'];
  const rows = [header.join(';')];
  state.workoutLogs.forEach(log => {
    log.sets.forEach((s, index) => rows.push([
      log.date, log.time, log.workoutId, log.exerciseId, index + 1, s.weight, s.reps, s.rir, s.pain, log.painGlobal, String(log.notes || '').replaceAll(';', ',')
    ].map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(';')));
  });
  exportFile(`isacc-hybrid-treinos-${todayISO()}.csv`, rows.join('\n'), 'text/csv;charset=utf-8');
}

function requestNotifications() {
  if (!('Notification' in window)) return showToast('Seu navegador não suporta notificações.');
  Notification.requestPermission().then(permission => {
    showToast(permission === 'granted' ? 'Notificações liberadas.' : 'Notificações não liberadas.');
  });
}

function sendReminder(title, body) {
  showToast(`${title}: ${body}`);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: undefined });
  }
}

function reminderLoop() {
  if (!state.settings.remindersEnabled) return;
  const now = new Date();
  const hhmm = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const date = todayISO();
  state.settings.walkReminderTimes.forEach(time => {
    const key = `${date}_${time}`;
    if (hhmm === time && !lastReminderSent[key]) {
      lastReminderSent[key] = true;
      sendReminder('Levanta, Isacc', 'Anda 3–5 minutos e volta. Seu corpo não foi feito para ficar travado na cadeira.');
    }
  });
  if (hhmm === '17:45' && !lastReminderSent[`${date}_pretreino`]) {
    lastReminderSent[`${date}_pretreino`] = true;
    sendReminder('Pré-treino', 'Come algo planejado e não senta no sofá. Academia antes do celular.');
  }
  if (hhmm === '22:00' && !lastReminderSent[`${date}_sono`]) {
    lastReminderSent[`${date}_sono`] = true;
    sendReminder('Sono', 'Começa a desligar. Shape também cresce dormindo.');
  }
}

setInterval(reminderLoop, 30 * 1000);

// Eventos globais

document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => setRoute(btn.dataset.route)));

$app.addEventListener('click', event => {
  const routeBtn = event.target.closest('[data-route-jump]');
  if (routeBtn) return setRoute(routeBtn.dataset.routeJump);

  const action = event.target.closest('[data-action]');
  if (!action) return;
  const type = action.dataset.action;

  if (type === 'open-workout') setRoute(`workout:${action.dataset.id}`);
  if (type === 'log-exercise') openLogExerciseModal(action.dataset.workout, action.dataset.exercise, action.dataset.slot);
  if (type === 'replace-exercise') openReplaceExerciseModal(action.dataset.workout, action.dataset.slot);
  if (type === 'reset-replacement') {
    delete state.exerciseOverrides[overrideKey(action.dataset.workout, action.dataset.slot)];
    saveState();
    showToast('Exercício original restaurado.');
    render();
  }
  if (type === 'finish-workout') {
    getChecklist().workout = true;
    saveState();
    showToast('Treino marcado como feito. Boa, Isacc!');
    render();
  }
  if (type === 'add-water') addWater(action.dataset.ml, action.textContent.trim());
  if (type === 'clear-water-today') {
    if (confirm('Zerar água registrada hoje?')) {
      state.water[todayISO()] = { totalMl: 0, entries: [] };
      saveState(); render();
    }
  }
  if (type === 'delete-water') {
    const day = getWaterDay();
    const item = day.entries.find(e => e.id === action.dataset.id);
    if (item) day.totalMl = Math.max(0, day.totalMl - Number(item.ml || 0));
    day.entries = day.entries.filter(e => e.id !== action.dataset.id);
    saveState(); render();
  }
  if (type === 'delete-run') {
    state.runLogs = state.runLogs.filter(r => r.id !== action.dataset.id);
    saveState(); render();
  }
  if (type === 'delete-measure') {
    state.bodyMeasures = state.bodyMeasures.filter(m => m.date !== action.dataset.date);
    saveState(); render();
  }
  if (type === 'request-notifications') requestNotifications();
  if (type === 'export-json') exportFile(`isacc-hybrid-backup-${todayISO()}.json`, JSON.stringify(state, null, 2), 'application/json');
  if (type === 'export-csv') exportCsv();
  if (type === 'reset-app') {
    if (confirm('Resetar tudo? Isso apaga registros locais.')) {
      localStorage.removeItem(STORE_KEY);
      state = structuredClone(defaultState);
      saveState();
      showToast('App resetado.');
      render();
    }
  }
});

$app.addEventListener('change', event => {
  const check = event.target.closest('[data-action="toggle-check"]');
  if (!check) return;
  const checklist = getChecklist();
  checklist[check.dataset.key] = check.checked;
  saveState();
  render();
});

$app.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const formType = form.dataset.form;

  if (formType === 'custom-water') {
    addWater(form.ml.value, form.label.value);
  }

  if (formType === 'water-settings') {
    state.settings.waterGoalMl = Number(form.waterGoalMl.value) || 2500;
    state.settings.glassMl = Number(form.glassMl.value) || 250;
    state.settings.bottleMl = Number(form.bottleMl.value) || 500;
    saveState(); showToast('Água personalizada salva.'); render();
  }

  if (formType === 'run') {
    const distanceKm = Number(form.distanceKm.value);
    const timeMin = parseTimeToMinutes(form.time.value);
    if (!distanceKm || !timeMin) return showToast('Informe distância e tempo.');
    state.runLogs.push({
      id: uid(),
      date: form.date.value || todayISO(),
      type: form.type.value,
      distanceKm,
      time: form.time.value,
      timeMin,
      pace: calcPace(distanceKm, timeMin),
      location: form.location.value,
      feeling: form.feeling.value,
      notes: form.notes.value
    });
    saveState(); showToast('Corrida salva.'); render();
  }

  if (formType === 'measures') {
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach(key => {
      if (key !== 'date') data[key] = data[key] === '' ? '' : Number(data[key]);
    });
    state.bodyMeasures = state.bodyMeasures.filter(m => m.date !== data.date);
    state.bodyMeasures.push(data);
    state.bodyMeasures.sort((a, b) => a.date.localeCompare(b.date));
    if (data.weight) state.profile.weight = data.weight;
    saveState(); showToast('Medidas salvas.'); render();
  }

  if (formType === 'settings') {
    state.profile.sleepTarget = form.sleepTarget.value || '22:30';
    state.settings.creatineDose = form.creatineDose.value || '3–5g/dia';
    state.settings.remindersEnabled = Boolean(form.remindersEnabled.checked);
    saveState(); showToast('Configurações salvas.'); render();
  }
});

document.body.addEventListener('click', event => {
  if (event.target.matches('[data-modal-close]') || event.target.classList.contains('modal-backdrop')) {
    event.target.closest('.modal-backdrop')?.remove();
  }
});

document.body.addEventListener('submit', event => {
  const form = event.target;
  if (form.dataset.form === 'exercise-log') {
    event.preventDefault();
    saveExerciseLog(form);
  }
});

// PWA install
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const btn = document.querySelector('#installBtn');
  btn.hidden = false;
});

document.querySelector('#installBtn').addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.querySelector('#installBtn').hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(console.error));
}

render();

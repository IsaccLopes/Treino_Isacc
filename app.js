
const $app = document.getElementById('app');
const $topbar = document.getElementById('topbar');
const $toast = document.getElementById('toast');
const $modalRoot = document.getElementById('modalRoot');
const STORE_KEY = 'isacc_hybrid_v3';

const weekDays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const today = new Date();
const todayDate = new Date().toISOString().slice(0,10);

const dayWorkoutIndexMap = {1:0, 2:1, 3:2, 4:3, 5:4, 6:5};
const bibleQuotes = [
  {text:'Tudo posso naquele que me fortalece.', ref:'Filipenses 4:13'},
  {text:'Os que esperam no Senhor renovam as suas forças.', ref:'Isaías 40:31'},
  {text:'Sejam fortes e corajosos.', ref:'Josué 1:9'},
  {text:'Entrega o teu caminho ao Senhor; confia nele.', ref:'Salmos 37:5'},
  {text:'O choro pode durar uma noite, mas a alegria vem pela manhã.', ref:'Salmos 30:5'},
  {text:'O Senhor é a minha força e o meu escudo.', ref:'Salmos 28:7'},
  {text:'Bem-aventurado o homem que persevera na provação.', ref:'Tiago 1:12'}
];

const muscleLabels = {
  peito:'Peito', costas:'Costas', ombros:'Ombros', biceps:'Bíceps', triceps:'Tríceps',
  quadriceps:'Quadríceps', posterior:'Posterior', gluteos:'Glúteos', panturrilha:'Panturrilha',
  abdomen:'Abdômen', lombar:'Lombar', cardio:'Cardio'
};
const equipmentOptions = ['Todos','Máquina','Halter','Cabo','Peso corporal','Smith','Rua/Esteira','Bike','Barra/Máquina','Máquina/Peso corporal','Banco','Barra/Halter'];
const muscleOptions = ['Todos', ...Object.values(muscleLabels)];

function ex(id,name,sets,reps,rest,muscles,equipment='Máquina',demo='push',note=''){
  return {id,name,sets,reps,rest,muscles,equipment,demo,note};
}
function lib(id,name,muscles,equipment,defaultScheme,demo='push',note=''){
  return {id,name,muscles,equipment,defaultScheme,demo,note};
}
const exerciseLibrary = [
  lib('crucifixo-reto-halter','Crucifixo Reto (Halter)',['peito'],'Halter','3x8–12','push','Isolador de peito.'),
  lib('supino-declinado-maquina','Supino Declinado (Máquina)',['peito','triceps'],'Máquina','3x8–10','push','Foco em peito inferior.'),
  lib('supino-reto-maquina','Supino Reto (Máquina)',['peito','triceps','ombros'],'Máquina','4x6–10','push','Mais estável para progredir.'),
  lib('supino-inclinado-halter','Supino Inclinado (Halter)',['peito','ombros','triceps'],'Halter','3x8–12','push','Peito superior.'),
  lib('crossover-cabo','Crossover (Cabo)',['peito'],'Cabo','3x12–15','push','Tensão constante.'),
  lib('puxada-alta-maquina','Puxada Alta na Polia (Máquina)',['costas','biceps'],'Cabo','4x8–12','raise','Costas em V.'),
  lib('remada-sentada-v','Remada Sentada com Pegada em V (Cabo)',['costas','biceps'],'Cabo','4x7–12','row','Espessura de costas.'),
  lib('puxada-triangulo','Puxada Alta - Pegada Triângulo',['costas','biceps'],'Cabo','4x8–12','raise','Alternativa confortável.'),
  lib('pullover-cabo','Pullover no Cabo',['costas'],'Cabo','3x12–15','raise','Isolador de dorsal.'),
  lib('elevacao-lateral-halter','Elevação Lateral (Halter)',['ombros'],'Halter','3x8–10','raise','Ombro largo.'),
  lib('face-pull','Face Pull',['ombros','costas'],'Cabo','3x12–20','row','Posterior de ombro e postura.'),
  lib('desenvolvimento-halter','Desenvolvimento (Halter)',['ombros','triceps'],'Halter','3x8–10','raise','Ombro forte.'),
  lib('rosca-direta-polia','Rosca Direta na Polia',['biceps'],'Cabo','3x8–12','push','Tensão constante.'),
  lib('rosca-scott-maquina','Rosca Scott (Máquina)',['biceps'],'Máquina','3x8–12','push','Isola o bíceps.'),
  lib('rosca-concentrada-halter','Rosca Concentrada (Halter)',['biceps'],'Halter','3x8–12','push','Controle total.'),
  lib('triceps-corda','Tríceps na Polia com Corda',['triceps'],'Cabo','3x8–12','push','Boa contração.'),
  lib('extensao-triceps-cabo','Extensão de tríceps acima da cabeça (cabo)',['triceps'],'Cabo','3x8–12','raise','Cabeça longa do tríceps.'),
  lib('leg-press-45','Leg Press 45º (Máquina)',['quadriceps','gluteos'],'Máquina','4x8–12','squat','Perna com estabilidade.'),
  lib('cadeira-extensora','Cadeira Extensora (Máquina)',['quadriceps'],'Máquina','3x10–15','squat','Quadríceps isolado.'),
  lib('mesa-flexora','Mesa Flexora (Máquina)',['posterior'],'Máquina','3x10–15','plank','Posterior.'),
  lib('cadeira-flexora','Cadeira Flexora (Máquina)',['posterior'],'Máquina','3x10–15','plank','Posterior com controle.'),
  lib('elevacao-pelvica-barra','Elevação Pélvica (Barra)',['gluteos','posterior'],'Barra/Halter','4x8–12','squat','Glúteo forte.'),
  lib('cadeira-abdutora','Cadeira Abdutora (Máquina)',['gluteos'],'Máquina','3x12–15','squat','Glúteo médio.'),
  lib('panturrilha-pe','Elevação de Panturrilha em Pé (Máquina)',['panturrilha'],'Máquina','4x12–20','squat','Panturrilha.'),
  lib('panturrilha-sentado','Panturrilha Sentado',['panturrilha'],'Máquina','4x12–20','squat','Panturrilha.'),
  lib('flexao-solo','Flexão no Solo',['peito','triceps','ombros'],'Peso corporal','4x até perto da falha','push','Calistenia base.'),
  lib('barra-negativa','Barra Negativa',['costas','biceps'],'Peso corporal','4x2–3','raise','Descer controlado.'),
  lib('dead-hang','Dead Hang',['costas'],'Peso corporal','3x20–30s','raise','Pendurar na barra.'),
  lib('prancha','Prancha',['abdomen'],'Peso corporal','3x30–45s','plank','Core firme.'),
  lib('dead-bug','Dead Bug',['abdomen','lombar'],'Peso corporal','3x10 cada lado','plank','Estabilidade.'),
  lib('bird-dog','Bird Dog',['lombar','gluteos'],'Peso corporal','3x10 cada lado','plank','Lombar estável.'),
  lib('caminhada-z2','Caminhada Z2',['cardio'],'Rua/Esteira','30 min','cardio','Ritmo conversável.'),
  lib('intervalado-leve','Intervalado Leve',['cardio'],'Rua/Esteira','6x (1 min trote / 2 min caminhada)','cardio','Cardio progressivo.'),
  lib('simulador-escadas','Simulador de Escadas',['cardio','quadriceps','gluteos','panturrilha'],'Máquina','10–20 min','cardio','Usar com moderação.'),
];

const plan = [
  {id:'seg',day:'SEG',title:'Segunda - Superiores',subtitle:'Peito, costas, ombro e braço',exercises:[
    ex('crucifixo-reto-halter','Crucifixo Reto (Halter)',3,'8–12','2 min',['peito'],'Halter','push'),
    ex('supino-declinado-maquina','Supino Declinado (Máquina)',3,'8–10','1 min 30 s',['peito','triceps'],'Máquina','push'),
    ex('puxada-alta-maquina','Puxada Alta na Polia (Máquina)',4,'8–12','1 min',['costas','biceps'],'Cabo','raise'),
    ex('remada-sentada-v','Remada Sentada com Pegada em V (Cabo)',4,'7–12','1 min',['costas','biceps'],'Cabo','row'),
    ex('elevacao-lateral-halter','Elevação Lateral (Halter)',3,'8–10','1 min',['ombros'],'Halter','raise'),
    ex('rosca-direta-polia','Rosca Direta na Polia',3,'8–12','1 min',['biceps'],'Cabo','push'),
    ex('triceps-corda','Tríceps na Polia com Corda',3,'8–12','1 min',['triceps'],'Cabo','push')
  ]},
  {id:'ter',day:'TER',title:'Terça - Inferiores',subtitle:'Quadríceps, posterior, glúteo e panturrilha',exercises:[
    ex('leg-press-45','Leg Press 45º (Máquina)',4,'8–12','1 min 30 s',['quadriceps','gluteos'],'Máquina','squat'),
    ex('cadeira-extensora','Cadeira Extensora (Máquina)',3,'10–15','1 min',['quadriceps'],'Máquina','squat'),
    ex('mesa-flexora','Mesa Flexora (Máquina)',3,'10–15','1 min',['posterior'],'Máquina','plank'),
    ex('elevacao-pelvica-barra','Elevação Pélvica (Barra)',4,'8–12','1 min 30 s',['gluteos','posterior'],'Barra/Halter','squat'),
    ex('cadeira-abdutora','Cadeira Abdutora (Máquina)',3,'12–15','1 min',['gluteos'],'Máquina','squat'),
    ex('panturrilha-pe','Elevação de Panturrilha em Pé (Máquina)',4,'12–20','45 s',['panturrilha'],'Máquina','squat')
  ]},
  {id:'qua',day:'QUA',title:'Quarta - Cardio + Core',subtitle:'Condicionamento e estabilidade',exercises:[
    ex('caminhada-z2','Caminhada Z2',1,'30 min','—',['cardio'],'Rua/Esteira','cardio'),
    ex('prancha','Prancha',3,'30–45 s','45 s',['abdomen'],'Peso corporal','plank'),
    ex('dead-bug','Dead Bug',3,'10 cada lado','45 s',['abdomen','lombar'],'Peso corporal','plank'),
    ex('bird-dog','Bird Dog',3,'10 cada lado','45 s',['lombar','gluteos'],'Peso corporal','plank')
  ]},
  {id:'qui',day:'QUI',title:'Quinta - Superiores 2',subtitle:'Costas em V, peito e ombro',exercises:[
    ex('supino-inclinado-halter','Supino Inclinado (Halter)',3,'8–12','1 min 30 s',['peito','ombros','triceps'],'Halter','push'),
    ex('puxada-triangulo','Puxada Alta - Pegada Triângulo',4,'8–12','1 min',['costas','biceps'],'Cabo','raise'),
    ex('pullover-cabo','Pullover no Cabo',3,'12–15','1 min',['costas'],'Cabo','raise'),
    ex('face-pull','Face Pull',3,'12–20','1 min',['ombros','costas'],'Cabo','row'),
    ex('rosca-scott-maquina','Rosca Scott (Máquina)',3,'8–12','1 min',['biceps'],'Máquina','push'),
    ex('extensao-triceps-cabo','Extensão de tríceps acima da cabeça (cabo)',3,'8–12','1 min',['triceps'],'Cabo','raise')
  ]},
  {id:'sex',day:'SEX',title:'Sexta - Calistenia + Corrida',subtitle:'Barra, flexão e cardio',exercises:[
    ex('flexao-solo','Flexão no Solo',4,'até perto da falha','1 min',['peito','triceps','ombros'],'Peso corporal','push'),
    ex('barra-negativa','Barra Negativa',4,'2–3','1 min',['costas','biceps'],'Peso corporal','raise'),
    ex('dead-hang','Dead Hang',3,'20–30 s','45 s',['costas'],'Peso corporal','raise'),
    ex('intervalado-leve','Intervalado Leve',1,'6x 1 min / 2 min','—',['cardio'],'Rua/Esteira','cardio')
  ]},
  {id:'sab',day:'SÁB',title:'Sábado - Inferiores 2',subtitle:'Perna completa + glúteo',exercises:[
    ex('leg-press-45','Leg Press 45º (Máquina)',4,'8–12','1 min 30 s',['quadriceps','gluteos'],'Máquina','squat'),
    ex('cadeira-flexora','Cadeira Flexora (Máquina)',3,'10–15','1 min',['posterior'],'Máquina','plank'),
    ex('elevacao-pelvica-barra','Elevação Pélvica (Barra)',4,'8–12','1 min 30 s',['gluteos','posterior'],'Barra/Halter','squat'),
    ex('cadeira-abdutora','Cadeira Abdutora (Máquina)',3,'12–15','1 min',['gluteos'],'Máquina','squat'),
    ex('panturrilha-sentado','Panturrilha Sentado',4,'12–20','45 s',['panturrilha'],'Máquina','squat')
  ]},
];

const defaultState = {
  profile:{name:'Isacc Lopes', initials:'IL', weight:95.75, waist:96, waterGoal:2500, glassMl:250, bottleMl:500},
  waterLog:{},
  measures:[{date:'2026-05-27', weight:95.75, waist:96, chest:112, shoulder:132, arm:40, thigh:66, calf:43, hip:107}],
  runLog:[],
  workoutLog:[],
  overrides:{},
  libraryFilters:{search:'', muscle:'Todos', equipment:'Todos'},
  route:'home'
};

let state = loadState();
let currentRoute = state.route || 'home';
let routeMeta = null;

function loadState(){
  try{const raw = localStorage.getItem(STORE_KEY); return raw ? {...structuredClone(defaultState), ...JSON.parse(raw)} : structuredClone(defaultState);}catch(e){return structuredClone(defaultState)}
}
function saveState(){state.route=currentRoute; localStorage.setItem(STORE_KEY, JSON.stringify(state));}
function toast(msg){$toast.textContent=msg; $toast.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=> $toast.classList.remove('show'),2200);}
function closeModal(){ $modalRoot.innerHTML=''; document.body.style.overflow=''; }
function openModal(html){ $modalRoot.innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this) closeModal()"><div class="modal">${html}</div></div>`; document.body.style.overflow='hidden'; }
window.closeModal=closeModal;

function getDisplayedExercise(dayId, exObj){
  const override = state.overrides?.[`${dayId}:${exObj.id}`];
  if(!override) return exObj;
  return {...exObj, ...override, originalId: exObj.id, overridden:true};
}
function getWorkoutSummary(day){
  const items = day.exercises.map(ex=>getDisplayedExercise(day.id,ex));
  const totalSets = items.reduce((s,e)=> s + (Number(e.sets)||1), 0);
  const muscles = [...new Set(items.flatMap(x=>x.muscles))];
  return {items,totalSets,muscles,duration: Math.max(25, Math.round(totalSets*2.1))};
}
function showExerciseDemoFromLibrary(ex){
  openModal(`
    <div class="handle"></div>
    <div class="modal-header">
      <div class="modal-title"><h3>${ex.name}</h3><p>${muscleNames(ex.muscles)} · ${ex.equipment}</p></div>
      <button class="icon-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="demo-card">
      <div class="demo-stage">
        ${renderAnimatedDemo(ex)}
        <div class="chip-row">${ex.muscles.map(m=>`<span class="chip active">${muscleLabels[m]}</span>`).join('')}</div>
      </div>
      <div class="card tight">
        <div class="row-between"><strong>Execução sugerida</strong><span class="tagline">${ex.defaultScheme || `${ex.sets}x${ex.reps}`}</span></div>
        <p class="tagline" style="margin-top:8px">${ex.note || 'Movimento controlado. Priorize amplitude e técnica.'}</p>
      </div>
      <div class="card tight">
        <strong>Músculos alvo</strong>
        <div class="human-map">${renderBodyMap('front', ex.muscles)} ${renderBodyMap('back', ex.muscles)}</div>
      </div>
    </div>
  `);
}
window.showExerciseDemoFromLibrary=showExerciseDemoFromLibrary;
function showExerciseDemo(dayId, exerciseId){
  const day = plan.find(d=>d.id===dayId); const original = day.exercises.find(e=>e.id===exerciseId); const ex = getDisplayedExercise(dayId, original);
  openModal(`
    <div class="handle"></div>
    <div class="modal-header">
      <div class="modal-title"><h3>${ex.name}</h3><p>${day.title} · ${ex.sets} séries · ${ex.reps} reps</p></div>
      <button class="icon-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="demo-card">
      <div class="demo-stage">
        ${renderAnimatedDemo(ex)}
        <div class="chip-row">${ex.muscles.map(m=>`<span class="chip active">${muscleLabels[m]}</span>`).join('')}</div>
      </div>
      <div class="list-plain">
        <div class="item"><span>Descanso</span><strong>${ex.rest}</strong></div>
        <div class="item"><span>Equipamento</span><strong>${ex.equipment}</strong></div>
        <div class="item"><span>Execução</span><strong>${ex.note || 'Controlado, sem pressa.'}</strong></div>
      </div>
      <div class="card tight">
        <strong>Músculos alvo</strong>
        <div class="human-map">${renderBodyMap('front', ex.muscles)} ${renderBodyMap('back', ex.muscles)}</div>
      </div>
      <div class="btn-row">
        <button class="btn soft" onclick="openSubstituteModal('${dayId}','${exerciseId}')">Substituir exercício</button>
        ${ex.overridden ? `<button class="btn outline" onclick="resetExercise('${dayId}','${exerciseId}')">Voltar ao original</button>`:''}
      </div>
    </div>
  `);
}
window.showExerciseDemo=showExerciseDemo;
function openSubstituteModal(dayId, exerciseId){
  const day = plan.find(d=>d.id===dayId); const base = day.exercises.find(e=>e.id===exerciseId);
  const filters = state.libraryFilters || {search:'', muscle:'Todos', equipment:'Todos'};
  const filtered = getFilteredLibrary(base.muscles, filters);
  openModal(`
    <div class="handle"></div>
    <div class="modal-header">
      <div class="modal-title"><h3>Substituir exercício</h3><p>${base.name}</p></div>
      <button class="icon-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="filters">
      <input class="search-box" id="libSearch" placeholder="Procurar exercício" value="${filters.search || ''}" oninput="updateLibraryFilters('${dayId}','${exerciseId}')" />
      <select id="libMuscle" onchange="updateLibraryFilters('${dayId}','${exerciseId}')">${muscleOptions.map(o=>`<option ${filters.muscle===o?'selected':''}>${o}</option>`).join('')}</select>
      <select id="libEquipment" onchange="updateLibraryFilters('${dayId}','${exerciseId}')">${equipmentOptions.map(o=>`<option ${filters.equipment===o?'selected':''}>${o}</option>`).join('')}</select>
    </div>
    <div style="height:12px"></div>
    <div class="library-list">
      ${filtered.length ? filtered.map(item=> renderLibraryRow(item, `chooseSubstitute('${dayId}','${exerciseId}','${item.id}')`, true)).join('') : `<div class="empty">Nada encontrado com esses filtros.</div>`}
    </div>
  `);
}
window.openSubstituteModal=openSubstituteModal;
function updateLibraryFilters(dayId, exerciseId){
  state.libraryFilters = {search:document.getElementById('libSearch').value, muscle:document.getElementById('libMuscle').value, equipment:document.getElementById('libEquipment').value};
  saveState();
  openSubstituteModal(dayId, exerciseId);
}
window.updateLibraryFilters=updateLibraryFilters;
function chooseSubstitute(dayId, exerciseId, libId){
  const libEx = exerciseLibrary.find(x=>x.id===libId);
  const day = plan.find(d=>d.id===dayId); const base = day.exercises.find(e=>e.id===exerciseId);
  state.overrides[`${dayId}:${exerciseId}`] = {
    id: libEx.id, name: libEx.name, muscles: libEx.muscles, equipment: libEx.equipment, demo: libEx.demo,
    note: libEx.note, sets: base.sets, reps: base.reps, rest: base.rest
  };
  saveState(); closeModal(); render(); toast('Exercício substituído');
}
window.chooseSubstitute=chooseSubstitute;
function resetExercise(dayId, exerciseId){ delete state.overrides[`${dayId}:${exerciseId}`]; saveState(); closeModal(); render(); toast('Exercício original restaurado'); }
window.resetExercise=resetExercise;
function muscleNames(muscles){ return muscles.map(m=>muscleLabels[m]).join(', '); }
function getFilteredLibrary(preferredMuscles=[], filters=state.libraryFilters){
  return exerciseLibrary.filter(item=>{
    const searchOk = !filters.search || item.name.toLowerCase().includes(filters.search.toLowerCase());
    const muscleOk = filters.muscle==='Todos' || item.muscles.some(m=>muscleLabels[m]===filters.muscle);
    const equipOk = filters.equipment==='Todos' || item.equipment===filters.equipment;
    const preferredBoost = preferredMuscles.length===0 || item.muscles.some(m=>preferredMuscles.includes(m));
    return searchOk && muscleOk && equipOk && preferredBoost;
  });
}

function changeRoute(route, meta=null){ currentRoute=route; routeMeta=meta; saveState(); render(); }

document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=> changeRoute(btn.dataset.route)));

function renderTopbar(){
  const titleMap = {
    home:['Isacc','Plano da semana'], workouts:['Treinos','Rotinas e execução'], library:['Biblioteca','Exercícios e substituições'], water:['Água','Meta e consumo diário'], progress:['Evolução','Medidas e corridas'], measures:['Medidas','Peso e circunferências'], run:['Corrida','Log de cardio']
  };
  let title = titleMap[currentRoute] || ['Isacc','Treino híbrido'];
  if(currentRoute==='workout-detail' && routeMeta){ const day = plan.find(d=>d.id===routeMeta); title=[day.title,'Detalhes do treino']; }
  $topbar.innerHTML = `
    <div class="brand">
      ${currentRoute==='workout-detail' ? `<button class="icon-btn" onclick="changeRoute('workouts')">←</button>` : `<div class="avatar">IL</div>`}
      <div><h1>${title[0]}</h1><span class="subtitle">${title[1]}</span></div>
    </div>
    <button class="icon-btn" onclick="openQuickMenu()">⋯</button>
  `;
}
window.changeRoute=changeRoute;
function openQuickMenu(){
  openModal(`
    <div class="handle"></div>
    <div class="modal-header"><div class="modal-title"><h3>Atalhos</h3><p>Configurações rápidas</p></div><button class="icon-btn" onclick="closeModal()">✕</button></div>
    <div class="list-plain">
      <button class="item" onclick="changeRoute('measures'); closeModal()"><span>Adicionar medida corporal</span><strong>→</strong></button>
      <button class="item" onclick="changeRoute('run'); closeModal()"><span>Registrar corrida/cardio</span><strong>→</strong></button>
      <button class="item" onclick="exportData()"><span>Exportar dados</span><strong>JSON</strong></button>
      <button class="item" onclick="resetAllData()"><span>Limpar dados locais</span><strong>⚠️</strong></button>
    </div>
  `);
}
window.openQuickMenu=openQuickMenu;
function exportData(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='isacc-hybrid-data.json'; a.click(); toast('Dados exportados');
}
window.exportData=exportData;
function resetAllData(){ if(confirm('Tem certeza que deseja limpar os dados locais?')){ localStorage.removeItem(STORE_KEY); state=structuredClone(defaultState); closeModal(); render(); toast('Dados limpos'); } }
window.resetAllData=resetAllData;

function render(){
  renderTopbar();
  document.querySelectorAll('.nav-btn').forEach(btn=> btn.classList.toggle('active', btn.dataset.route===currentRoute));
  if(currentRoute==='home') return renderHome();
  if(currentRoute==='workouts') return renderWorkouts();
  if(currentRoute==='workout-detail') return renderWorkoutDetail(routeMeta);
  if(currentRoute==='library') return renderLibrary();
  if(currentRoute==='water') return renderWater();
  if(currentRoute==='progress') return renderProgress();
  if(currentRoute==='measures') return renderMeasures();
  if(currentRoute==='run') return renderRun();
}

function renderHome(){
  const dayIndex = dayWorkoutIndexMap[today.getDay()];
  const todayWorkout = dayIndex !== undefined ? plan[dayIndex] : null;
  const water = getWaterMl(todayDate);
  const quote = bibleQuotes[today.getDay() % bibleQuotes.length];
  const weekdayName = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'][today.getDay()];
  $app.innerHTML = `
    <div class="section">
      <div class="card hero hero-simple">
        <span class="tagline">Frase do dia · ${weekdayName}</span>
        <h2>"${quote.text}"</h2>
        <p>${quote.ref}</p>
      </div>

      <div class="grid-2 compact-grid">
        <div class="card stat-card">
          <span class="label">Treino de hoje</span>
          <span class="value">${todayWorkout ? todayWorkout.day : 'DOM'}</span>
          <span class="sub">${todayWorkout ? todayWorkout.title.replace(todayWorkout.day+' - ','') : 'Descanso / mobilidade leve'}</span>
        </div>
        <div class="card stat-card">
          <span class="label">Água hoje</span>
          <span class="value">${water}</span>
          <span class="sub">de ${state.profile.waterGoal} ml</span>
        </div>
      </div>

      <div class="card">
        <div class="section-title"><div><h2>Seu dia</h2><p>Menos informação, mais ação.</p></div></div>
        <div class="btn-row">
          ${todayWorkout ? `<button class="btn primary" onclick="changeRoute('workout-detail','${todayWorkout.id}')">Abrir treino de hoje</button>` : `<button class="btn primary" onclick="changeRoute('library')">Ver biblioteca</button>`}
          <button class="btn outline" onclick="changeRoute('water')">Registrar água</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title"><div><h2>Semana</h2><p>Toque para abrir o treino.</p></div></div>
        <div class="exercise-list">
          ${plan.map(day=>{
            const summary=getWorkoutSummary(day);
            return `<button class="day-card card tight" style="text-align:left;border:0" onclick="changeRoute('workout-detail','${day.id}')">
              <div class="day-badge"><strong>${day.day}</strong><small>${summary.items.length} ex.</small></div>
              <div><h3>${day.title}</h3><p>${summary.totalSets} séries · ${summary.duration} min</p></div>
            </button>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}
function renderWorkouts(){
  $app.innerHTML = `
    <div class="section">
      <div class="section-title"><div><h2>Rotinas</h2><p>Toque em um treino para ver exercícios, execução e substituições.</p></div></div>
      ${plan.map(day=>{
        const s=getWorkoutSummary(day);
        return `<div class="card">
          <button class="day-card" style="border:0;background:transparent;padding:0;width:100%;text-align:left" onclick="changeRoute('workout-detail','${day.id}')">
            <div class="day-badge"><strong>${day.day}</strong><small>${s.duration} min</small></div>
            <div><h3>${day.title}</h3><p>${day.subtitle}</p></div>
          </button>
          <div style="height:12px"></div>
          <div class="summary">
            <div><strong>${s.items.length}</strong><span>Exercícios</span></div>
            <div><strong>${s.totalSets}</strong><span>Séries</span></div>
            <div><strong>${s.duration}</strong><span>Min</span></div>
          </div>
          <div class="card tight" style="margin-top:12px">
            <strong>Resumo muscular</strong>
            <div class="human-map">${renderBodyMap('front', s.muscles)} ${renderBodyMap('back', s.muscles)}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}
function renderWorkoutDetail(dayId){
  const day = plan.find(d=>d.id===dayId); const summary = getWorkoutSummary(day);
  $app.innerHTML = `
    <div class="section">
      <div class="card">
        <div class="section-title"><div><h2>${day.title}</h2><p>${day.subtitle}</p></div></div>
        <div class="summary">
          <div><strong>${summary.items.length}</strong><span>Exercícios</span></div>
          <div><strong>${summary.totalSets}</strong><span>Total de séries</span></div>
          <div><strong>${summary.duration}</strong><span>Duração</span></div>
        </div>
        <div class="card tight" style="margin-top:12px">
          <strong>Resumo da rotina</strong>
          <div class="human-map">${renderBodyMap('front', summary.muscles)} ${renderBodyMap('back', summary.muscles)}</div>
        </div>
      </div>

      <div class="exercise-list">
        ${day.exercises.map(original=>{
          const ex = getDisplayedExercise(day.id, original);
          return `<div class="exercise-item">
            <div class="thumb">${renderThumbDemo(ex)}</div>
            <div class="exercise-main">
              <h4>${ex.name}</h4>
              <div class="exercise-meta">
                <span>${ex.sets} sets</span>
                <span>${ex.reps} reps</span>
                <span>${ex.rest}</span>
              </div>
              ${ex.overridden ? `<div class="tagline" style="margin-top:6px;color:var(--blue)">Substituído</div>`:''}
            </div>
            <div class="exercise-actions">
              <button class="mini-btn soft" onclick="showExerciseDemo('${day.id}','${original.id}')">Ver</button>
              <button class="mini-btn" onclick="openSubstituteModal('${day.id}','${original.id}')">Trocar</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}
function renderLibrary(){
  const filters=state.libraryFilters; const rows = getFilteredLibrary([], filters);
  $app.innerHTML = `
    <div class="section">
      <div class="card">
        <div class="section-title"><div><h2>Biblioteca de exercícios</h2><p>Estilo catálogo para trocar quando precisar.</p></div></div>
        <div class="filters">
          <input class="search-box" id="pageSearch" placeholder="Procurar exercício" value="${filters.search || ''}" />
          <select id="pageMuscle">${muscleOptions.map(o=>`<option ${filters.muscle===o?'selected':''}>${o}</option>`).join('')}</select>
          <select id="pageEquipment">${equipmentOptions.map(o=>`<option ${filters.equipment===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
      </div>
      <div class="library-list">
        ${rows.map(item=> renderLibraryRow(item, `showExerciseDemoFromLibrary(findLibrary('${item.id}'))`)).join('')}
      </div>
    </div>`;
    document.getElementById('pageSearch').addEventListener('input', updatePageFilters);
    document.getElementById('pageMuscle').addEventListener('change', updatePageFilters);
    document.getElementById('pageEquipment').addEventListener('change', updatePageFilters);
}
function updatePageFilters(){ state.libraryFilters = {search:pageSearch.value, muscle:pageMuscle.value, equipment:pageEquipment.value}; saveState(); renderLibrary(); }
window.updatePageFilters=updatePageFilters;
function renderLibraryRow(item, action, choosing=false){
  return `<div class="library-item">
    <div class="thumb" style="width:54px;height:54px;border-radius:14px">${renderThumbDemo(item)}</div>
    <div><h4>${item.name}</h4><p>${muscleNames(item.muscles)} · ${item.equipment}</p></div>
    <button class="mini-btn ${choosing?'soft':''}" onclick="${action}">${choosing?'Escolher':'Ver'}</button>
  </div>`;
}
function findLibrary(id){ return exerciseLibrary.find(x=>x.id===id); }
window.findLibrary=findLibrary;
function renderWater(){
  const current=getWaterMl(todayDate); const progress=Math.min(100, Math.round((current/state.profile.waterGoal)*100));
  $app.innerHTML = `
    <div class="section">
      <div class="card">
        <div class="water-ring" style="--progress:${progress}%"><div class="inner"><div><strong>${progress}%</strong><span>${current} / ${state.profile.waterGoal} ml</span></div></div></div>
        <div style="height:16px"></div>
        <div class="water-actions">
          <button class="btn soft" onclick="addWater(state.profile.glassMl)">+ 1 copo<br><small>${state.profile.glassMl} ml</small></button>
          <button class="btn soft" onclick="addWater(state.profile.bottleMl)">+ 1 garrafa<br><small>${state.profile.bottleMl} ml</small></button>
          <button class="btn primary" onclick="openCustomWaterModal()">+ personalizado</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title"><div><h2>Configuração</h2><p>Personalize copo, garrafa e meta.</p></div></div>
        <div class="kv">
          <div class="field"><label class="tagline">Meta diária (ml)</label><input id="goalMl" type="number" value="${state.profile.waterGoal}" /></div>
          <div class="field"><label class="tagline">Copo (ml)</label><input id="glassMl" type="number" value="${state.profile.glassMl}" /></div>
          <div class="field"><label class="tagline">Garrafa (ml)</label><input id="bottleMl" type="number" value="${state.profile.bottleMl}" /></div>
        </div>
        <div style="height:12px"></div>
        <button class="btn primary" onclick="saveWaterSettings()">Salvar</button>
      </div>
    </div>`;
}
function addWater(ml){ state.waterLog[todayDate]=(state.waterLog[todayDate]||0)+Number(ml); saveState(); renderWater(); toast(`${ml} ml adicionados`); }
window.addWater=addWater;
function getWaterMl(date){ return state.waterLog[date] || 0; }
function openCustomWaterModal(){
  openModal(`
    <div class="handle"></div>
    <div class="modal-header"><div class="modal-title"><h3>Adicionar água</h3><p>Digite o valor em ml.</p></div><button class="icon-btn" onclick="closeModal()">✕</button></div>
    <input id="customWaterMl" type="number" placeholder="Ex: 350" />
    <div style="height:12px"></div>
    <button class="btn primary" onclick="confirmCustomWater()">Adicionar</button>
  `);
}
window.openCustomWaterModal=openCustomWaterModal;
function confirmCustomWater(){ const v=Number(document.getElementById('customWaterMl').value); if(v>0){ addWater(v); closeModal(); renderWater(); } }
window.confirmCustomWater=confirmCustomWater;
function saveWaterSettings(){ state.profile.waterGoal=Number(goalMl.value)||2500; state.profile.glassMl=Number(glassMl.value)||250; state.profile.bottleMl=Number(bottleMl.value)||500; saveState(); toast('Configuração salva'); }
window.saveWaterSettings=saveWaterSettings;
function renderProgress(){
  const last = state.measures[state.measures.length-1] || {}; const lastRun = state.runLog[state.runLog.length-1];
  $app.innerHTML = `
    <div class="section">
      <div class="grid-2">
        <div class="card stat-card"><span class="label">Peso atual</span><span class="value">${last.weight || state.profile.weight}</span><span class="sub">kg</span></div>
        <div class="card stat-card"><span class="label">Cintura</span><span class="value">${last.waist || state.profile.waist}</span><span class="sub">cm</span></div>
      </div>
      <div class="card">
        <div class="section-title"><div><h2>Últimas medidas</h2><p>Acompanhe o que importa.</p></div><button class="btn soft" onclick="changeRoute('measures')">Atualizar</button></div>
        <div class="list-plain">
          <div class="item"><span>Peito</span><strong>${last.chest || '-'} cm</strong></div>
          <div class="item"><span>Ombro</span><strong>${last.shoulder || '-'} cm</strong></div>
          <div class="item"><span>Braço</span><strong>${last.arm || '-'} cm</strong></div>
          <div class="item"><span>Coxa</span><strong>${last.thigh || '-'} cm</strong></div>
          <div class="item"><span>Panturrilha</span><strong>${last.calf || '-'} cm</strong></div>
        </div>
      </div>
      <div class="card">
        <div class="section-title"><div><h2>Corrida / cardio</h2><p>Resumo da última sessão.</p></div><button class="btn soft" onclick="changeRoute('run')">Registrar</button></div>
        ${lastRun ? `<div class="list-plain"><div class="item"><span>Distância</span><strong>${lastRun.distance} km</strong></div><div class="item"><span>Tempo</span><strong>${lastRun.time}</strong></div><div class="item"><span>Pace</span><strong>${lastRun.pace}</strong></div><div class="item"><span>Sensação</span><strong>${lastRun.feel}</strong></div></div>` : `<div class="empty">Nenhuma corrida/cardio registrada ainda.</div>`}
      </div>
    </div>`;
}
function renderMeasures(){
  const last = state.measures[state.measures.length-1] || {};
  $app.innerHTML = `
    <div class="section">
      <div class="card">
        <div class="section-title"><div><h2>Registrar medidas</h2><p>Atualize peso e principais circunferências.</p></div></div>
        <div class="kv">
          <div class="field"><label class="tagline">Peso</label><input id="mWeight" type="number" step="0.01" value="${last.weight || ''}"></div>
          <div class="field"><label class="tagline">Cintura</label><input id="mWaist" type="number" step="0.1" value="${last.waist || ''}"></div>
          <div class="field"><label class="tagline">Peito</label><input id="mChest" type="number" step="0.1" value="${last.chest || ''}"></div>
          <div class="field"><label class="tagline">Ombro</label><input id="mShoulder" type="number" step="0.1" value="${last.shoulder || ''}"></div>
          <div class="field"><label class="tagline">Braço</label><input id="mArm" type="number" step="0.1" value="${last.arm || ''}"></div>
          <div class="field"><label class="tagline">Coxa</label><input id="mThigh" type="number" step="0.1" value="${last.thigh || ''}"></div>
          <div class="field"><label class="tagline">Panturrilha</label><input id="mCalf" type="number" step="0.1" value="${last.calf || ''}"></div>
          <div class="field"><label class="tagline">Quadril</label><input id="mHip" type="number" step="0.1" value="${last.hip || ''}"></div>
        </div>
        <div style="height:12px"></div>
        <button class="btn primary" onclick="saveMeasures()">Salvar medidas</button>
      </div>
    </div>`;
}
function saveMeasures(){
  const obj={date:new Date().toISOString().slice(0,10), weight:Number(mWeight.value)||0, waist:Number(mWaist.value)||0, chest:Number(mChest.value)||0, shoulder:Number(mShoulder.value)||0, arm:Number(mArm.value)||0, thigh:Number(mThigh.value)||0, calf:Number(mCalf.value)||0, hip:Number(mHip.value)||0};
  state.measures.push(obj); state.profile.weight=obj.weight; state.profile.waist=obj.waist; saveState(); toast('Medidas salvas'); changeRoute('progress');
}
window.saveMeasures=saveMeasures;
function renderRun(){
  const last = state.runLog[state.runLog.length-1];
  $app.innerHTML = `
    <div class="section">
      <div class="card">
        <div class="section-title"><div><h2>Registrar cardio</h2><p>Corrida, caminhada, esteira ou escadas.</p></div></div>
        <div class="kv">
          <div class="field"><label class="tagline">Tipo</label><select id="rType"><option>Corrida</option><option>Caminhada</option><option>Esteira</option><option>Escadas</option><option>Bike</option></select></div>
          <div class="field"><label class="tagline">Distância (km)</label><input id="rDistance" type="number" step="0.01" placeholder="Ex: 3.20"></div>
          <div class="field"><label class="tagline">Tempo (mm:ss ou hh:mm:ss)</label><input id="rTime" placeholder="Ex: 23:28"></div>
          <div class="field"><label class="tagline">Sensação</label><select id="rFeel"><option>Leve</option><option>Moderado</option><option>Pesado</option><option>Destruído</option></select></div>
        </div>
        <div style="height:12px"></div>
        <button class="btn primary" onclick="saveRun()">Salvar cardio</button>
      </div>
      <div class="card">
        <div class="section-title"><div><h2>Último registro</h2><p>Resumo rápido.</p></div></div>
        ${last ? `<div class="list-plain"><div class="item"><span>Tipo</span><strong>${last.type}</strong></div><div class="item"><span>Distância</span><strong>${last.distance} km</strong></div><div class="item"><span>Tempo</span><strong>${last.time}</strong></div><div class="item"><span>Pace</span><strong>${last.pace}</strong></div><div class="item"><span>Sensação</span><strong>${last.feel}</strong></div></div>` : `<div class="empty">Nenhum cardio salvo ainda.</div>`}
      </div>
    </div>`;
}
function saveRun(){
  const type=rType.value, distance=Number(rDistance.value)||0, time=rTime.value.trim(), feel=rFeel.value;
  const pace = distance>0 && time ? calcPace(time, distance) : '-';
  state.runLog.push({date:new Date().toISOString(), type, distance, time, feel, pace}); saveState(); toast('Cardio salvo'); changeRoute('progress');
}
window.saveRun=saveRun;
function calcPace(time, distance){
  const parts=time.split(':').map(Number); let secs=0; if(parts.length===2) secs=parts[0]*60+parts[1]; if(parts.length===3) secs=parts[0]*3600+parts[1]*60+parts[2];
  if(!secs || !distance) return '-'; const p=secs/distance; const m=Math.floor(p/60); const s=Math.round(p%60).toString().padStart(2,'0'); return `${m}:${s}/km`;
}
function renderThumbDemo(ex){ return renderAnimatedDemo(ex, true); }
function renderAnimatedDemo(ex, compact=false){
  const type = ex.demo || 'push';
  const size = compact ? 70 : 230;
  const bodyClass = type==='push'?'anim-push':type==='row'?'anim-row':type==='raise'?'anim-raise':type==='squat'?'anim-squat':type==='plank'?'anim-plank':'anim-cardio';
  let svg='';
  if(type==='push') svg = pushSVG(ex.muscles, size, bodyClass);
  else if(type==='row') svg = rowSVG(ex.muscles, size, bodyClass);
  else if(type==='raise') svg = latPullSVG(ex.muscles, size, bodyClass);
  else if(type==='squat') svg = lowerSVG(ex.muscles, size, bodyClass);
  else if(type==='plank') svg = plankSVG(ex.muscles, size, bodyClass);
  else svg = cardioSVG(ex.muscles, size, bodyClass);
  return svg;
}
function renderBodyMap(side, muscles){
  const mset = new Set(muscles);
  const fill = (m, back=false)=> mset.has(m) ? (back?'highlight-back':'highlight') : 'body-base';
  if(side==='front') return `
  <svg viewBox="0 0 120 220" aria-label="Mapa muscular frontal">
    <circle class="body-base" cx="60" cy="20" r="14"></circle>
    <rect class="${fill('peito')}" x="42" y="42" rx="7" ry="7" width="16" height="18"></rect>
    <rect class="${fill('peito')}" x="62" y="42" rx="7" ry="7" width="16" height="18"></rect>
    <rect class="${fill('abdomen')}" x="49" y="63" rx="7" ry="7" width="22" height="28"></rect>
    <rect class="${fill('ombros')}" x="29" y="39" rx="8" ry="8" width="13" height="18"></rect>
    <rect class="${fill('ombros')}" x="78" y="39" rx="8" ry="8" width="13" height="18"></rect>
    <rect class="${fill('biceps')}" x="22" y="56" rx="7" ry="7" width="14" height="32"></rect>
    <rect class="${fill('biceps')}" x="84" y="56" rx="7" ry="7" width="14" height="32"></rect>
    <rect class="${fill('triceps')}" x="24" y="88" rx="6" ry="6" width="12" height="26"></rect>
    <rect class="${fill('triceps')}" x="84" y="88" rx="6" ry="6" width="12" height="26"></rect>
    <rect class="${fill('quadriceps')}" x="42" y="99" rx="8" ry="8" width="15" height="45"></rect>
    <rect class="${fill('quadriceps')}" x="63" y="99" rx="8" ry="8" width="15" height="45"></rect>
    <rect class="${fill('panturrilha')}" x="45" y="147" rx="7" ry="7" width="11" height="40"></rect>
    <rect class="${fill('panturrilha')}" x="65" y="147" rx="7" ry="7" width="11" height="40"></rect>
    <rect class="${fill('gluteos')}" x="44" y="91" rx="8" ry="8" width="32" height="16"></rect>
    <path class="body-outline" d="M47 34c-8 4-14 10-18 19m49-19c8 4 14 10 18 19M39 53c-2 28 1 42 5 48m32-48c2 28-1 42-5 48M49 92c-1 22-2 65-3 97m25-97c1 22 2 65 3 97M45 189l-7 18m38-18 7 18"/>
  </svg>`;
  return `
  <svg viewBox="0 0 120 220" aria-label="Mapa muscular posterior">
    <circle class="body-base" cx="60" cy="20" r="14"></circle>
    <rect class="${fill('costas',true)}" x="43" y="40" rx="8" ry="8" width="34" height="42"></rect>
    <rect class="${fill('ombros',true)}" x="28" y="38" rx="8" ry="8" width="13" height="18"></rect>
    <rect class="${fill('ombros',true)}" x="79" y="38" rx="8" ry="8" width="13" height="18"></rect>
    <rect class="${fill('triceps',true)}" x="22" y="56" rx="7" ry="7" width="14" height="32"></rect>
    <rect class="${fill('triceps',true)}" x="84" y="56" rx="7" ry="7" width="14" height="32"></rect>
    <rect class="${fill('lombar',true)}" x="49" y="78" rx="8" ry="8" width="22" height="20"></rect>
    <rect class="${fill('gluteos',true)}" x="43" y="94" rx="8" ry="8" width="34" height="18"></rect>
    <rect class="${fill('posterior',true)}" x="42" y="114" rx="8" ry="8" width="15" height="40"></rect>
    <rect class="${fill('posterior',true)}" x="63" y="114" rx="8" ry="8" width="15" height="40"></rect>
    <rect class="${fill('panturrilha',true)}" x="45" y="157" rx="7" ry="7" width="11" height="38"></rect>
    <rect class="${fill('panturrilha',true)}" x="65" y="157" rx="7" ry="7" width="11" height="38"></rect>
    <path class="body-outline" d="M47 34c-8 4-14 10-18 19m49-19c8 4 14 10 18 19M39 53c-2 28 1 42 5 48m32-48c2 28-1 42-5 48M49 92c-1 22-2 65-3 97m25-97c1 22 2 65 3 97M45 189l-7 18m38-18 7 18"/>
  </svg>`;
}
function partColor(group, muscles){ return muscles.includes(group)?'#ff7b2f':'#d9dee7'; }
function renderThumbDemo(ex){ return renderAnimatedDemo(ex, true); }
function renderAnimatedDemo(ex, compact=false){
  const type = ex.demo || 'push';
  const size = compact ? 68 : 230;
  const bodyClass = type==='push'?'anim-push':type==='row'?'anim-row':type==='raise'?'anim-raise':type==='squat'?'anim-squat':type==='plank'?'anim-plank':'anim-cardio';
  if(type==='push') return pressSVG(ex.muscles, size, bodyClass);
  if(type==='row') return seatedRowSVG(ex.muscles, size, bodyClass);
  if(type==='raise') return latPulldownSVG(ex.muscles, size, bodyClass);
  if(type==='squat') return lowerMachineSVG(ex.muscles, size, bodyClass);
  if(type==='plank') return floorCoreSVG(ex.muscles, size, bodyClass);
  return cardioMachineSVG(ex.muscles, size, bodyClass);
}
function latPulldownSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <g>
    <ellipse cx="110" cy="196" rx="72" ry="10" fill="#edf1f5"></ellipse>
    <rect x="42" y="28" width="12" height="140" rx="5" fill="#aab2bc"></rect>
    <rect x="42" y="28" width="70" height="8" rx="4" fill="#b7c0ca"></rect>
    <line x1="85" y1="36" x2="85" y2="66" class="equip"></line>
    <line x1="65" y1="66" x2="105" y2="66" class="equip"></line>
    <rect x="108" y="126" width="12" height="34" rx="5" fill="#aab2bc"></rect>
    <rect x="92" y="158" width="44" height="10" rx="5" fill="#bbc4ce"></rect>
    <path d="M120 116 L144 166" class="equip"/>
    <g class="body-group">
      <circle cx="109" cy="79" r="12" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.8"></circle>
      <path d="M100 92 Q109 100 118 92 L123 116 Q110 123 97 116 Z" fill="#e5e9ef" stroke="#bfc7d0" stroke-width="1.5"></path>
      <path d="M100 94 Q109 98 118 94 L121 108 Q109 114 97 108 Z" fill="${muscles.includes('costas')||muscles.includes('peito') ? '#ff7b2f':'#d8dee6'}" opacity=".95"></path>
      <path class="arm-l" d="M100 96 Q87 88 79 76 Q77 71 80 68 Q85 70 91 79 Q97 87 103 93" fill="${muscles.includes('biceps')||muscles.includes('ombros')?'#ff7b2f':'#f3dccd'}" stroke="#c8b1a5" stroke-width="1"></path>
      <path class="arm-r" d="M118 96 Q131 88 139 76 Q141 71 138 68 Q133 70 127 79 Q121 87 115 93" fill="${muscles.includes('biceps')||muscles.includes('ombros')?'#ff7b2f':'#f3dccd'}" stroke="#c8b1a5" stroke-width="1"></path>
      <path d="M97 116 Q96 136 98 157" class="person"></path>
      <path d="M121 116 Q122 136 120 157" class="person"></path>
      <path d="M98 157 Q87 152 77 154" class="person"></path>
      <path d="M120 157 Q132 152 142 154" class="person"></path>
      <path d="M78 154 Q76 160 78 170" class="person"></path>
      <path d="M142 154 Q144 160 142 170" class="person"></path>
      <path d="M97 117 Q90 131 88 146" class="person"></path>
      <path d="M121 117 Q128 131 130 146" class="person"></path>
    </g>
  </g>
</svg>`;}
function pressSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <ellipse cx="110" cy="196" rx="74" ry="10" fill="#edf1f5"></ellipse>
  <rect x="55" y="138" width="110" height="10" rx="5" fill="#bec6cf"></rect>
  <rect x="50" y="130" width="10" height="26" rx="4" fill="#a9b2bd"></rect>
  <rect x="160" y="130" width="10" height="26" rx="4" fill="#a9b2bd"></rect>
  <g class="body-group">
    <circle cx="110" cy="80" r="12" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.8"></circle>
    <path d="M97 92 Q110 100 123 92 L130 120 Q110 128 90 120 Z" fill="#e5e9ef" stroke="#bfc7d0" stroke-width="1.5"></path>
    <path d="M97 94 Q110 101 123 94 L126 108 Q110 115 94 108 Z" fill="${muscles.includes('peito') ? '#ff7b2f':'#d8dee6'}"></path>
    <path class="arm-l" d="M96 96 Q84 105 73 120 Q68 128 60 140" fill="none" stroke="#c8b1a5" stroke-width="8" stroke-linecap="round"></path>
    <path class="arm-r" d="M124 96 Q136 105 147 120 Q152 128 160 140" fill="none" stroke="#c8b1a5" stroke-width="8" stroke-linecap="round"></path>
    <path d="M96 96 Q91 102 86 109" stroke="${muscles.includes('ombros')||muscles.includes('triceps')?'#ff7b2f':'#c8b1a5'}" stroke-width="8" stroke-linecap="round"></path>
    <path d="M124 96 Q129 102 134 109" stroke="${muscles.includes('ombros')||muscles.includes('triceps')?'#ff7b2f':'#c8b1a5'}" stroke-width="8" stroke-linecap="round"></path>
    <path d="M95 120 Q92 147 89 176" class="person"></path>
    <path d="M125 120 Q128 147 131 176" class="person"></path>
  </g>
</svg>`;}
function seatedRowSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <ellipse cx="110" cy="196" rx="76" ry="10" fill="#edf1f5"></ellipse>
  <rect x="42" y="140" width="84" height="12" rx="6" fill="#c0c8d2"></rect>
  <line x1="124" y1="145" x2="188" y2="145" class="equip"></line>
  <g class="body-group">
    <circle cx="82" cy="92" r="12" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.8"></circle>
    <path d="M92 103 Q110 110 125 128" fill="none" stroke="#bfc7d0" stroke-width="16" stroke-linecap="round"></path>
    <path d="M95 104 Q109 109 121 122" fill="none" stroke="${muscles.includes('costas') ? '#ff7b2f':'#d8dee6'}" stroke-width="12" stroke-linecap="round"></path>
    <path class="arm-l" d="M107 111 Q124 118 145 128" fill="none" stroke="#c8b1a5" stroke-width="8" stroke-linecap="round"></path>
    <path class="arm-r" d="M103 118 Q122 127 142 137" fill="none" stroke="#c8b1a5" stroke-width="8" stroke-linecap="round"></path>
    <path d="M121 120 Q126 131 130 143" stroke="${muscles.includes('biceps')?'#ff7b2f':'#c8b1a5'}" stroke-width="8" stroke-linecap="round"></path>
    <path d="M70 104 Q61 137 51 176" class="person"></path>
    <path d="M93 116 Q84 150 98 188" class="person"></path>
  </g>
</svg>`;}
function lowerMachineSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <ellipse cx="110" cy="196" rx="72" ry="10" fill="#edf1f5"></ellipse>
  <g class="body-group">
    <circle cx="110" cy="66" r="12" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.8"></circle>
    <path d="M98 80 Q110 87 122 80 L127 108 Q110 115 93 108 Z" fill="#e5e9ef" stroke="#bfc7d0" stroke-width="1.5"></path>
    <path d="M95 109 Q111 118 127 109" fill="none" stroke="${muscles.includes('gluteos') ? '#ff7b2f':'#d8dee6'}" stroke-width="10" stroke-linecap="round"></path>
    <path d="M95 88 L82 108" class="person"></path>
    <path d="M125 88 L138 108" class="person"></path>
    <path d="M100 110 L88 147 L82 188" stroke="${muscles.includes('quadriceps')||muscles.includes('panturrilha') ? '#ff7b2f':'#c8b1a5'}" stroke-width="8" stroke-linecap="round" fill="none"></path>
    <path d="M120 110 L132 147 L138 188" stroke="${muscles.includes('quadriceps')||muscles.includes('panturrilha') ? '#ff7b2f':'#c8b1a5'}" stroke-width="8" stroke-linecap="round" fill="none"></path>
  </g>
</svg>`;}
function floorCoreSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <ellipse cx="110" cy="196" rx="72" ry="10" fill="#edf1f5"></ellipse>
  <g class="body-group">
    <circle cx="70" cy="124" r="11" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.6"></circle>
    <path d="M82 127 Q108 136 145 141" fill="none" stroke="#d8dee6" stroke-width="14" stroke-linecap="round"></path>
    <path d="M92 130 Q110 136 128 138" fill="none" stroke="${muscles.includes('abdomen')||muscles.includes('lombar') ? '#ff7b2f':'#d8dee6'}" stroke-width="10" stroke-linecap="round"></path>
    <path class="arm-l" d="M81 130 L60 153" class="person"></path>
    <path class="arm-r" d="M88 131 L74 161" class="person"></path>
    <path class="leg-l" d="M145 141 L167 159" class="person"></path>
    <path class="leg-r" d="M137 140 L164 185" class="person"></path>
  </g>
</svg>`;}
function cardioMachineSVG(muscles,size,cls){return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <ellipse cx="110" cy="196" rx="74" ry="10" fill="#edf1f5"></ellipse>
  <rect x="66" y="154" width="80" height="8" rx="4" fill="#c0c8d2"></rect>
  <g class="body-group">
    <circle cx="110" cy="66" r="12" fill="#f3dccd" stroke="#c8b1a5" stroke-width="1.8"></circle>
    <path d="M100 80 Q110 87 120 80 L123 106 Q110 111 97 106 Z" fill="${muscles.includes('cardio') ? '#ff7b2f':'#d8dee6'}" stroke="#bfc7d0" stroke-width="1.2"></path>
    <path class="arm-l" d="M104 90 L87 104" class="person"></path>
    <path class="arm-r" d="M116 90 L132 102" class="person"></path>
    <path class="leg-l" d="M105 107 L90 147" class="person"></path>
    <path class="leg-r" d="M116 107 L134 146" class="person"></path>
  </g>
</svg>`;}
render();

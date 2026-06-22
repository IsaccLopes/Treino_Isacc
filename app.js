
const $app = document.getElementById('app');
const $topbar = document.getElementById('topbar');
const $toast = document.getElementById('toast');
const $modalRoot = document.getElementById('modalRoot');
const STORE_KEY = 'isacc_hybrid_v3';

const weekDays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const today = new Date();
const todayDate = new Date().toISOString().slice(0,10);

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
  const nextWorkout = plan[(today.getDay()+6)%6] || plan[0];
  const water = getWaterMl(todayDate);
  $app.innerHTML = `
    <div class="section">
      <div class="card hero">
        <h2>Foco no shape,<br/>consistência no processo.</h2>
        <p>Meta atual: secar barriga, crescer superior e evoluir corrida sem largar a musculação.</p>
        <div class="pills" style="margin-top:12px">
          <span class="pill blue">${state.profile.weight.toFixed(2)} kg</span>
          <span class="pill orange">Cintura ${state.profile.waist} cm</span>
          <span class="pill green">Água ${water} / ${state.profile.waterGoal} ml</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="card stat-card"><span class="label">Treino de hoje</span><span class="value">${nextWorkout.day}</span><span class="sub">${nextWorkout.title.replace(nextWorkout.day+' - ','')}</span></div>
        <div class="card stat-card"><span class="label">Próxima ação</span><span class="value">18:15</span><span class="sub">Sair do sofá e ir treinar</span></div>
      </div>

      <div class="card">
        <div class="section-title"><div><h2>Seu dia</h2><p>Check rápido do que importa.</p></div></div>
        <div class="btn-row">
          <button class="btn primary" onclick="changeRoute('workout-detail','${nextWorkout.id}')">Abrir treino de hoje</button>
          <button class="btn outline" onclick="changeRoute('water')">Registrar água</button>
          <button class="btn outline" onclick="changeRoute('run')">Registrar cardio</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title"><div><h2>Semana</h2><p>Rotina estruturada para iPhone e uso como app.</p></div></div>
        <div class="exercise-list">
          ${plan.slice(0,3).map(day=>{
            const summary=getWorkoutSummary(day);
            return `<button class="day-card card tight" style="text-align:left;border:0" onclick="changeRoute('workout-detail','${day.id}')">
              <div class="day-badge"><strong>${day.day}</strong><small>${summary.items.length} ex.</small></div>
              <div><h3>${day.title}</h3><p>${day.subtitle}<br>${summary.totalSets} séries · ${summary.duration} min</p></div>
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
function partColor(group, muscles){ return muscles.includes(group)?'#4ea2ff':'#d7dde7'; }
function pushSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
  <g class="anim-float">
    <ellipse cx="110" cy="196" rx="70" ry="10" fill="#ecf0f5"></ellipse>
    <g>
      <rect x="58" y="136" width="104" height="10" rx="5" fill="#c5ced8"></rect>
      <rect x="52" y="128" width="12" height="26" rx="4" fill="#a7b0bb"></rect>
      <rect x="156" y="128" width="12" height="26" rx="4" fill="#a7b0bb"></rect>
    </g>
    <g class="body-group">
      <circle cx="110" cy="78" r="14" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
      <rect x="90" y="94" width="40" height="44" rx="14" fill="#eef2f7" stroke="#c0c9d3"></rect>
      <rect x="91" y="98" width="18" height="16" rx="8" fill="${partColor('peito',muscles)}"></rect>
      <rect x="111" y="98" width="18" height="16" rx="8" fill="${partColor('peito',muscles)}"></rect>
      <rect x="77" y="92" width="13" height="18" rx="6" fill="${partColor('ombros',muscles)}"></rect>
      <rect x="130" y="92" width="13" height="18" rx="6" fill="${partColor('ombros',muscles)}"></rect>
      <g class="arm-l"><path class="person" d="M88 103 L67 124 L53 138"/><circle class="joint" cx="67" cy="124" r="4"/><rect x="58" y="118" width="12" height="18" rx="6" fill="${partColor('triceps',muscles)}"></rect></g>
      <g class="arm-r"><path class="person" d="M132 103 L153 124 L167 138"/><circle class="joint" cx="153" cy="124" r="4"/><rect x="150" y="118" width="12" height="18" rx="6" fill="${partColor('triceps',muscles)}"></rect></g>
      <path class="person" d="M100 138 L95 174 L90 198"/><path class="person" d="M120 138 L125 174 L130 198"/>
      <rect x="92" y="140" width="16" height="30" rx="8" fill="${partColor('quadriceps',muscles)}"></rect>
      <rect x="112" y="140" width="16" height="30" rx="8" fill="${partColor('quadriceps',muscles)}"></rect>
    </g>
  </g>
</svg>`; }
function rowSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
 <ellipse cx="110" cy="196" rx="78" ry="10" fill="#ecf0f5"></ellipse>
 <rect x="42" y="132" width="80" height="14" rx="7" fill="#c6ced8"></rect>
 <line x1="124" y1="138" x2="185" y2="138" class="equip"/>
 <g class="body-group">
  <circle cx="78" cy="90" r="14" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
  <path class="person" d="M90 98 L116 114 L129 138"/>
  <rect x="94" y="106" width="26" height="18" rx="8" fill="${partColor('costas',muscles)}"></rect>
  <g class="arm-l"><path class="person" d="M111 111 L144 121 L158 136"/><rect x="128" y="115" width="14" height="16" rx="6" fill="${partColor('biceps',muscles)}"></rect></g>
  <g class="arm-r"><path class="person" d="M104 118 L137 130 L151 145"/><rect x="123" y="125" width="14" height="16" rx="6" fill="${partColor('biceps',muscles)}"></rect></g>
  <path class="person" d="M69 104 L61 139 L48 176"/><path class="person" d="M92 115 L82 150 L96 191"/>
 </g>
</svg>`; }
function latPullSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
 <ellipse cx="110" cy="196" rx="70" ry="10" fill="#ecf0f5"></ellipse>
 <line x1="110" y1="30" x2="110" y2="165" class="equip"></line>
 <line x1="70" y1="38" x2="150" y2="38" class="equip"></line>
 <g class="body-group">
   <circle cx="110" cy="76" r="14" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
   <rect x="90" y="92" width="40" height="50" rx="14" fill="#eef2f7" stroke="#c0c9d3"></rect>
   <rect x="90" y="95" width="40" height="20" rx="10" fill="${partColor('costas',muscles)}"></rect>
   <g class="arm-l"><path class="person" d="M92 100 L78 75 L70 45"/><rect x="79" y="78" width="14" height="18" rx="6" fill="${partColor('biceps',muscles)}"></rect></g>
   <g class="arm-r"><path class="person" d="M128 100 L142 75 L150 45"/><rect x="127" y="78" width="14" height="18" rx="6" fill="${partColor('biceps',muscles)}"></rect></g>
   <path class="person" d="M99 142 L95 177 L92 198"/><path class="person" d="M121 142 L125 177 L128 198"/>
 </g>
</svg>`; }
function lowerSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
 <ellipse cx="110" cy="196" rx="70" ry="10" fill="#ecf0f5"></ellipse>
 <g class="body-group">
  <circle cx="110" cy="62" r="14" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
  <rect x="92" y="78" width="36" height="42" rx="14" fill="#eef2f7" stroke="#c0c9d3"></rect>
  <rect x="93" y="110" width="34" height="18" rx="8" fill="${partColor('gluteos',muscles)}"></rect>
  <path class="person" d="M92 87 L77 111"/><path class="person" d="M128 87 L143 111"/>
  <path class="person" d="M101 120 L88 154 L82 193"/><path class="person" d="M119 120 L132 154 L138 193"/>
  <rect x="88" y="125" width="16" height="35" rx="8" fill="${partColor('quadriceps',muscles)}"></rect>
  <rect x="116" y="125" width="16" height="35" rx="8" fill="${partColor('quadriceps',muscles)}"></rect>
  <rect x="85" y="158" width="14" height="25" rx="8" fill="${partColor('panturrilha',muscles)}"></rect>
  <rect x="121" y="158" width="14" height="25" rx="8" fill="${partColor('panturrilha',muscles)}"></rect>
 </g>
</svg>`; }
function plankSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
 <ellipse cx="110" cy="196" rx="70" ry="10" fill="#ecf0f5"></ellipse>
 <g class="body-group">
   <circle cx="68" cy="122" r="11" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
   <path class="person" d="M79 126 L118 135 L162 142"/>
   <rect x="90" y="128" width="25" height="12" rx="6" fill="${partColor('abdomen',muscles)}"></rect>
   <rect x="115" y="132" width="24" height="12" rx="6" fill="${partColor('lombar',muscles)}"></rect>
   <path class="person arm-l" d="M82 128 L60 152"/>
   <path class="person arm-r" d="M89 129 L74 160"/>
   <path class="person leg-l" d="M162 142 L180 161"/>
   <path class="person leg-r" d="M153 141 L176 184"/>
 </g>
</svg>`; }
function cardioSVG(muscles,size,cls){ return `
<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="${cls}">
 <ellipse cx="110" cy="196" rx="70" ry="10" fill="#ecf0f5"></ellipse>
 <g class="body-group">
  <circle cx="110" cy="58" r="13" fill="#d9dee7" stroke="#b8c1cc" stroke-width="2"></circle>
  <path class="person" d="M110 71 L110 111"/>
  <rect x="95" y="78" width="30" height="18" rx="8" fill="${partColor('cardio',muscles)}"></rect>
  <path class="person arm-l" d="M110 86 L88 104"/>
  <path class="person arm-r" d="M110 86 L134 102"/>
  <path class="person leg-l" d="M110 111 L87 149"/>
  <path class="person leg-r" d="M110 111 L133 148"/>
 </g>
</svg>`; }
render();

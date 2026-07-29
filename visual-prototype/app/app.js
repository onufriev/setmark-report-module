const incidents = [
  {id:"INC-10482",critical:true,store:"Магазин № 184",city:"Екатеринбург",cash:"Касса 04",type:"Продажа товара после запрета реализации",group:"Молочная продукция",time:"28.07.2026, 17:42",result:"Подтверждённое нарушение",contour:"Кассовое ПО",fine:20000,mark:"010460123456781721ABCD92",status:"Анализ завершён"},
  {id:"INC-10471",critical:true,store:"Магазин № 052",city:"Пермь",cash:"Касса 11",type:"Продажа товара после запрета реализации",group:"Табачная продукция",time:"28.07.2026, 16:18",result:"Подтверждённое нарушение",contour:"Кассовое ПО",fine:20000,mark:"010460123456782728EFGH41",status:"Анализ завершён"},
  {id:"INC-10423",critical:true,store:"Магазин № 317",city:"Тюмень",cash:"Касса 02",type:"Продажа товара после запрета реализации",group:"Молочная продукция",time:"27.07.2026, 12:56",result:"Подтверждённое нарушение",contour:"Настройки магазина",fine:20000,mark:"010460123456783725JKLM73",status:"Анализ завершён"},
  {id:"INC-10398",critical:false,store:"Магазин № 184",city:"Екатеринбург",cash:"Касса 01",type:"Некорректный код проверки",group:"Пиво",time:"26.07.2026, 10:12",result:"Подтверждённое нарушение",contour:"Данные интеграции",fine:0,mark:"010460123456784722NPQR18",status:"Анализ завершён"},
  {id:"INC-10314",critical:false,store:"Магазин № 088",city:"Челябинск",cash:"Касса 07",type:"Повторная продажа кода маркировки",group:"Молочная продукция",time:"25.07.2026, 21:04",result:"Допустимый сценарий",contour:"Не требуется",fine:0,mark:"010460123456785729STUV66",status:"Анализ завершён"},
  {id:"INC-10277",critical:false,store:"Магазин № 052",city:"Пермь",cash:"Касса 03",type:"Неизвестный тип отклонения",group:"Обувь",time:"24.07.2026, 18:21",result:"Требуется обновление правил анализа",contour:"Правила анализа",fine:0,mark:"010460123456786726WXYZ04",status:"Анализ завершён"},
  {id:"INC-10201",critical:false,store:"Магазин № 241",city:"Уфа",cash:"Касса 09",type:"Выбытие вне розничной продажи",group:"Вода",time:"23.07.2026, 13:39",result:"Отклонение не относится к поддерживаемым процессам выбытия",contour:"Внешний процесс",fine:0,mark:"010460123456787723BCDF39",status:"Анализ завершён"}
];
const actions = [
  {text:"На кассах магазинов № 184, № 052 и № 317 включить блокировку продажи после получения запрета от ГИС МТ и выполнить контрольную проверку.",count:3,critical:true},
  {text:"Включить разрешительную проверку для категории «Молочная продукция» во всех магазинах сети.",count:1600,critical:false},
  {text:"Проверить настройки сопоставления кодов проверки для категории «Пиво».",count:214,critical:false},
  {text:"На кассе № 07 магазина № 088 проверить обработку повторной продажи кода маркировки.",count:43,critical:false}
].sort((a,b)=>Number(b.critical)-Number(a.critical)||b.count-a.count);
const state = {
  query:"",
  priorityOnly:false,
  confirmedOnly:false,
  result:"",
  store:"Все магазины",
  types:[],
  tab:"analysis",
  rangePreset:"week",
  rangeStart:"2026-07-22",
  rangeEnd:"2026-07-28"
};
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat("ru-RU").format(n);
const DAY = 86400000;

function pageHead(title,subtitle,actions="") {
  return `<div class="page-head"><div><h1>${title}</h1><p>${subtitle}</p><span class="freshness">Обновлено сегодня в 18:40 · UTC+05:00</span></div><div class="controls">${actions}</div></div>`;
}
function badge(text, cls="neutral"){ return `<span class="badge ${cls}">${text}</span>`; }
function toast(text){ const el=qs("#toast"); el.textContent=text; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200); }
function navigate(hash){ location.hash=hash; }
function dateAtStart(value){ return new Date(`${value}T00:00:00`); }
function incidentDate(value){
  const [date] = value.split(","), [day,month,year] = date.split(".").map(Number);
  return new Date(year,month-1,day);
}
function dateRangeLabel(){
  const format = new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"});
  return `${format.format(dateAtStart(state.rangeStart))} — ${format.format(dateAtStart(state.rangeEnd))}`;
}
function dateRangeControl(){
  return `<div class="date-range" role="group" aria-label="Диапазон дат">
    <label><span>Период</span><select class="select" data-range-preset>
      <option value="today" ${state.rangePreset==="today"?"selected":""}>Сегодня</option>
      <option value="week" ${state.rangePreset==="week"?"selected":""}>Неделя</option>
      <option value="month" ${state.rangePreset==="month"?"selected":""}>30 дней</option>
      <option value="custom" ${state.rangePreset==="custom"?"selected":""}>Произвольный</option>
    </select></label>
    <div class="custom-range" ${state.rangePreset==="custom"?"":"hidden"}>
      <label><span>С</span><input class="input date-input" data-range-start type="date" value="${state.rangeStart}"></label>
      <span class="date-separator" aria-hidden="true">—</span>
      <label><span>По</span><input class="input date-input" data-range-end type="date" value="${state.rangeEnd}"></label>
      <button class="button" data-apply-range>Применить</button>
    </div>
  </div>`;
}
function applyPreset(preset){
  const end="2026-07-28";
  const days={today:0,week:6,month:29}[preset];
  if(days===undefined)return;
  const start=dateAtStart(end);start.setDate(start.getDate()-days);
  state.rangePreset=preset;
  state.rangeStart=start.toISOString().slice(0,10);
  state.rangeEnd=end;
  route();
  toast(`Период применён: ${dateRangeLabel()}`);
}
function metricsForRange(){
  const rows=incidents.filter(i=>incidentDate(i.time)>=dateAtStart(state.rangeStart)&&incidentDate(i.time)<=dateAtStart(state.rangeEnd));
  return {
    total:rows.length,
    critical:rows.filter(i=>i.critical).length,
    fine:rows.filter(i=>i.critical).length,
    potentialFine:rows.reduce((sum,i)=>sum+i.fine,0)
  };
}
function riskObjectsForRange(){
  const start=dateAtStart(state.rangeStart), end=dateAtStart(state.rangeEnd);
  const rows=incidents.filter(i=>i.critical&&incidentDate(i.time)>=start&&incidentDate(i.time)<=end);
  const byStore=new Map();
  rows.forEach(i=>{
    const current=byStore.get(i.store)||{store:i.store,city:i.city,count:0,cashes:new Set()};
    current.count++;
    current.cashes.add(i.cash);
    byStore.set(i.store,current);
  });
  const result=[...byStore.values()].sort((a,b)=>b.count-a.count||a.store.localeCompare(b.store,"ru"));
  const max=Math.max(1,...result.map(x=>x.count));
  return result.map(x=>({...x,width:Math.round(x.count/max*100)}));
}

function renderOverview() {
  const metrics=metricsForRange();
  const riskObjects=riskObjectsForRange();
  qs("#overview-view").innerHTML = `
    ${pageHead("Мониторинг нарушений",`Сводка по сети «Север» за ${dateRangeLabel()}`,
      `${dateRangeControl()}<button class="button" data-export>Выгрузить CSV</button>`)}
    <section class="priority-banner" id="priority" aria-labelledby="priority-title">
      <div class="priority-icon" aria-hidden="true">!</div>
      <div><h2 id="priority-title">Критические инциденты</h2><p>Инциденты, для которых возможен автоштраф · 3 магазина, 3 кассы</p></div>
      <div><span class="priority-count">${metrics.critical}</span><button class="priority-action" data-priority>Перейти к инцидентам →</button></div>
    </section>
    <div class="metrics">
      <article class="metric"><span>Всего инцидентов</span><strong>${fmt(metrics.total)}</strong><small>За выбранный период</small></article>
      <article class="metric"><span>Критические</span><strong>${fmt(metrics.critical)}</strong><small>${metrics.total?Math.round(metrics.critical/metrics.total*1000)/10:0}% от общего числа</small></article>
      <article class="metric"><span>Потенциальный штраф</span><strong>${fmt(metrics.potentialFine)} ₽</strong><small class="up">Расчётная оценка, не назначенный штраф</small></article>
      <article class="metric"><span>Подтверждённые нарушения</span><strong>${incidents.filter(i=>i.result==="Подтверждённое нарушение"&&incidentDate(i.time)>=dateAtStart(state.rangeStart)&&incidentDate(i.time)<=dateAtStart(state.rangeEnd)).length}</strong><small>За выбранный период</small></article>
    </div>
    <section class="panel" style="margin-bottom:16px">
      <div class="section-head"><div><h2>Необходимые действия</h2><p class="subtle">Топ-5 действий для предотвращения повторения нарушений в следующем периоде</p></div><button class="button ghost" data-all-actions>Все действия</button></div>
      <div class="actions-list">${actions.slice(0,5).map(actionRow).join("")}</div>
    </section>
    <section class="panel" style="margin-bottom:16px">
      <div class="section-head"><div><h2>Инциденты по типам нарушений</h2><p class="subtle">Все инциденты за выбранный период</p></div></div>
      ${typeChart()}
    </section>
    <div class="grid-2">
      <section class="panel">
        <div class="section-head"><div><h2>Объекты с наибольшим риском</h2><p class="subtle">Сортировка по критическим инцидентам</p></div><button class="button ghost" data-all-stores>Все магазины</button></div>
        <div class="store-list">
          ${riskObjects.length
            ?riskObjects.map(x=>`<div class="store-row" tabindex="0" role="button" data-risk-store="${x.store}"><div><strong>${x.store}</strong><small>${x.city} · ${x.cashes.size} ${x.cashes.size===1?"касса":"кассы"}</small></div><div class="bar"><i style="width:${x.width}%"></i></div><div>${badge(fmt(x.count)+" с риском","danger")}</div><span>›</span></div>`).join("")
            :`<div class="empty-state">За выбранный период критических инцидентов нет</div>`}
        </div>
      </section>
      <section class="panel">
        <div class="section-head"><div><h2>Состояние данных</h2><p class="subtle">Доступность источников, необходимых для анализа</p></div></div>
        <div class="source-list">
          <div class="source-item"><span class="source-dot ok"></span><div><strong>Последнее обращение в «Честный знак» за отчётом</strong><small>28.07.2026, 18:40</small></div>${badge("Успешно","ok")}</div>
          <div class="source-item"><span class="source-dot ok"></span><div><strong>Связь с Set Centrum</strong><small>Связь необходима для анализа инцидентов</small></div>${badge("Есть связь","ok")}</div>
        </div>
      </section>
    </div>`;
}

function filteredIncidents() {
  return incidents.filter(i => (!state.priorityOnly || i.critical) &&
    (!state.confirmedOnly || i.result==="Подтверждённое нарушение") &&
    (!state.result || i.result===state.result) &&
    incidentDate(i.time)>=dateAtStart(state.rangeStart) &&
    incidentDate(i.time)<=dateAtStart(state.rangeEnd) &&
    (state.store==="Все магазины" || i.store===state.store) &&
    (!state.types.length || state.types.includes(i.type)) &&
    (!state.query || (state.query===i.mark || `${i.id} ${i.store} ${i.cash} ${i.type} ${i.group}`.toLowerCase().includes(state.query.toLowerCase()))));
}
function actionRow(a){return `<article class="action-row ${a.critical?"priority":""}"><div><strong>${a.text}</strong><span class="action-meta">${a.critical?badge("Предотвращает критические инциденты","danger"):""} Связано: ${fmt(a.count)} инцидентов за выбранный период</span></div></article>`}
function typeCounts(){return [...new Set(incidents.map(i=>i.type))].map(type=>({type,count:incidents.filter(i=>i.type===type).length})).sort((a,b)=>b.count-a.count)}
function typeChart(){const data=typeCounts(),max=Math.max(...data.map(x=>x.count));return `<div class="type-chart">${data.map(x=>`<button class="type-row" data-type-jump="${x.type}"><strong>${x.type}</strong><span class="type-bar"><i style="width:${x.count/max*100}%"></i></span><span>${x.count}</span></button>`).join("")}</div>`}
function typeFilter(){const all=[...new Set(incidents.map(i=>i.type))];return `<details class="select multi-filter"><summary>Тип нарушения${state.types.length?` · ${state.types.length}`:""} ⌄</summary><div class="multi-menu">${all.map(x=>`<label><input type="checkbox" data-type-filter value="${x}" ${state.types.includes(x)?"checked":""}>${x}</label>`).join("")}</div></details>`}
function renderIncidents() {
  const rows=filteredIncidents();
  qs("#incidents-view").innerHTML=`
    ${pageHead("Инциденты",`Системные результаты анализа отклонений за ${dateRangeLabel()}`,
      `<button class="button" data-export>Выгрузить CSV</button>`)}
    <div class="filterbar">
      ${dateRangeControl()}
      <input class="input search" id="search" type="search" placeholder="Поиск; код маркировки вводится полностью" value="${state.query}" aria-label="Поиск инцидентов">
      <select class="select" id="store-filter" aria-label="Магазин">${["Все магазины",...new Set(incidents.map(i=>i.store))].map(x=>`<option ${x===state.store?"selected":""}>${x}</option>`).join("")}</select>
      ${typeFilter()}
      <label class="check-filter"><input type="checkbox" id="priority-filter" ${state.priorityOnly?"checked":""}>Только критические</label>
      <select class="select" id="result-filter" aria-label="Результат проверки"><option value="">Результат проверки: все</option>${["Подтверждённое нарушение","Допустимый сценарий","Отклонение не относится к поддерживаемым процессам выбытия","Недостаточно данных","Требуется обновление правил анализа"].map(x=>`<option ${state.result===x?"selected":""}>${x}</option>`).join("")}</select>
    </div>
    <div class="table-wrap">
      ${rows.length?`<table><thead><tr><th>Инцидент</th><th>Дата и время</th><th>Магазин / касса</th><th>Тип нарушения</th><th>Результат проверки</th><th>Потенциальный штраф</th><th></th></tr></thead>
      <tbody>${rows.map(i=>`<tr class="${i.critical?"critical":""}" tabindex="0" data-incident="${i.id}">
        <td><span class="cell-title">${i.id}</span><span class="cell-sub">${i.group}</span></td><td>${i.time}</td>
        <td><span class="cell-title">${i.store}</span><span class="cell-sub">${i.cash} · ${i.city}</span></td>
        <td>${i.type}</td><td>${badge(i.result,i.result==="Подтверждённое нарушение"?"danger":i.result==="Допустимый сценарий"?"ok":"warn")}</td>
        <td>${i.fine?`<span class="money">${fmt(i.fine)} ₽</span><span class="cell-sub">Расчётная оценка</span>`:"—"}</td><td>›</td></tr>`).join("")}</tbody></table>`:
      `<div class="empty"><h3>Инциденты не найдены</h3><p>Измените условия поиска или сбросьте фильтры.</p><button class="button" id="reset-filters">Сбросить фильтры</button></div>`}
      <div class="table-foot"><span>Показано ${rows.length} из ${rows.length}</span><span>1 / 1 &nbsp; ‹ &nbsp; ›</span></div>
    </div>`;
  bindIncidentFilters();
}

function renderIncident(id) {
  const i=incidents.find(x=>x.id===id)||incidents[0];
  qs("#incident-view").innerHTML=`
    <button class="back" id="back-incidents">← Назад к списку инцидентов</button>
    <div class="page-head"><div><div class="incident-title"><h1>${i.id}</h1>${i.critical?badge("Критический","danger"):""}</div><p>${i.type} · ${i.store}, ${i.cash}</p></div><div class="controls"><button class="button" data-copy>Копировать ссылку</button><button class="button" data-pdf>Описание для контролирующих органов, PDF</button></div></div>
    <div class="incident-layout">
      <div>
        <section class="panel summary-card">
          <span class="eyebrow">Результат проверки</span>
          <div class="result-line"><div><strong>${i.result}</strong><p class="subtle">Версия правил 2026.07.3 · анализ завершён сегодня в 17:49</p></div></div>
          <div class="explain"><strong>Почему получен такой результат</strong><br>ГИС МТ вернула результат «Продажа запрещена: истёк срок годности». Несмотря на запрет, продажа завершена успешно. Фактическое действие кассы не соответствует полученному решению.</div>
          <dl class="kv"><dt>Операция</dt><dd>${i.time} · UTC+05:00</dd><dt>Товарная группа</dt><dd>${i.group}</dd><dt>Код маркировки</dt><dd>${i.mark}</dd><dt>Контур устранения</dt><dd>${i.contour}</dd><dt>Состояние</dt><dd>${i.status}</dd></dl>
          <div class="tabs" role="tablist">
            <button class="tab ${state.tab==="analysis"?"active":""}" data-tab="analysis" role="tab">Цепочка проверки</button>
            <button class="tab ${state.tab==="source"?"active":""}" data-tab="source" role="tab">Исходное отклонение</button>
            <button class="tab ${state.tab==="operations"?"active":""}" data-tab="operations" role="tab">Операции</button>
          </div>
          <div class="tab-content" id="tab-content"></div>
        </section>
      </div>
      <aside>
        <section class="panel side-card"><h3>Рекомендация</h3><div class="recommendation">На ${i.cash} ${i.store} включить блокировку продажи после получения запрета от ГИС МТ и выполнить контрольную проверку.</div></section>
        <section class="panel side-card"><h3>Критичность</h3><dl class="kv"><dt>Критичность</dt><dd>${i.critical?badge("Критическая","danger"):badge("Некритическая","neutral")}</dd><dt>Потенциальный штраф</dt><dd>${i.fine?`<span class="money">${fmt(i.fine)} ₽</span><small class="cell-sub">Расчётная оценка, не назначенный штраф</small>`:"—"}</dd><dt>Основание</dt><dd>Применимая норма и количество проданных единиц</dd></dl></section>
      </aside>
    </div>`;
  renderTab();
  qsa("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderIncident(i.id)});
  qs("#back-incidents").onclick=()=>navigate("incidents");
}
function renderTab(){
  const content=qs("#tab-content"); if(!content)return;
  if(state.tab==="source") content.innerHTML=`<dl class="kv"><dt>Номер отклонения</dt><dd>DEV-DEMO-20260728-10482</dd><dt>Категория</dt><dd>Розничная реализация</dd><dt>Вид</dt><dd>Продажа без соблюдения разрешительного режима</dd><dt>Регистрация</dt><dd>28.07.2026, 17:46</dd></dl><p class="subtle">Синтетический неизменяемый снимок структуры True API. Реальные клиентские идентификаторы не используются.</p>`;
  else if(state.tab==="operations") content.innerHTML=`<dl class="kv"><dt>Документ продажи</dt><dd>Чек № 8421</dd><dt>Продажа завершена успешно</dt><dd>Да · 28.07.2026, 17:42:18</dd><dt>Возврат или отмена</dt><dd>Не найдены</dd><dt>Ключ корреляции</dt><dd>Полный код маркировки + временная метка</dd></dl>`;
  else content.innerHTML=`
    <div class="evidence-step"><span class="step">1</span><div><strong>Ответ онлайн Честного знака</strong><p class="subtle">Получены исходные признаки: found=true, verified=true, isBlocked=true. Это не готовое решение о продаже.</p></div></div>
    <div class="evidence-step"><span class="step">2</span><div><strong>Решение кассового ПО</strong><p class="subtle">Продажа запрещена · правило ККТ-17, версия 2026.07.3.</p></div></div>
    <div class="evidence-step"><span class="step">3</span><div><strong>Фактическое действие кассы</strong><p class="subtle">Продажа завершена успешно. Обнаружено расхождение с решением кассового ПО.</p></div></div>`;
}

function renderAnalytics(){
  const rows=filteredIncidents();
  const start=dateAtStart(state.rangeStart), end=dateAtStart(state.rangeEnd);
  const dayCount=Math.round((end-start)/DAY)+1;
  const groupByDay=dayCount<=14;
  const buckets=[];
  for(let cursor=new Date(start);cursor<=end;){
    const bucketStart=new Date(cursor);
    const bucketEnd=new Date(cursor);
    bucketEnd.setDate(bucketEnd.getDate()+(groupByDay?0:6));
    if(bucketEnd>end)bucketEnd.setTime(end.getTime());
    const count=rows.filter(i=>{const d=incidentDate(i.time);return d>=bucketStart&&d<=bucketEnd}).length;
    const short=new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit"});
    buckets.push({
      label:groupByDay?short.format(bucketStart):`${short.format(bucketStart)}–${short.format(bucketEnd)}`,
      start:bucketStart.toISOString().slice(0,10),
      end:bucketEnd.toISOString().slice(0,10),
      count
    });
    cursor=new Date(bucketEnd);cursor.setDate(cursor.getDate()+1);
  }
  const max=Math.max(1,...buckets.map(x=>x.count));
  const critical=rows.filter(i=>i.critical).length;
  const confirmed=rows.filter(i=>i.result==="Подтверждённое нарушение").length;
  qs("#analytics-view").innerHTML=`
    ${pageHead("Аналитика","Динамика нарушений по выбранному часовому поясу сети",
      `${dateRangeControl()}<label class="check-filter"><input id="analytics-critical" type="checkbox" ${state.priorityOnly?"checked":""}>Только критические</label><label class="check-filter"><input id="analytics-confirmed" type="checkbox" ${state.confirmedOnly?"checked":""}>Только подтверждённые нарушения</label>`)}
    <div class="metrics" style="margin-top:20px">
      <article class="metric"><span>Инциденты</span><strong>${fmt(rows.length)}</strong><small>С учётом фильтров</small></article>
      <article class="metric"><span>Критические</span><strong>${fmt(critical)}</strong><small>В текущей выборке</small></article>
      <article class="metric"><span>Подтверждённые нарушения</span><strong>${fmt(confirmed)}</strong><small>В текущей выборке</small></article>
      <article class="metric"><span>Группировка</span><strong>${groupByDay?"По дням":"По неделям"}</strong><small>Автоматически по длине периода</small></article>
    </div>
    <section class="panel"><div class="section-head"><div><h2>${groupByDay?"Динамика по дням":"Динамика по неделям"}</h2><p class="subtle">${dateRangeLabel()} · нажмите на колонку, чтобы открыть составившие её инциденты</p></div></div><div class="chart">${buckets.map(w=>`<button class="col ${w.count&&state.priorityOnly?"critical":""}" data-week-start="${w.start}" data-week-end="${w.end}" style="height:${Math.max(10,w.count/max*100)}%" aria-label="Открыть ${w.count} инцидентов за ${w.label}"><b>${fmt(w.count)}</b><span>${w.label}</span></button>`).join("")}</div></section>`;
}
function renderActions(){
  qs("#actions-view").innerHTML=`${pageHead("Необходимые действия",`Действия для предотвращения повторения нарушений в следующем периоде`,dateRangeControl())}
    <section class="panel" style="margin-top:20px"><div class="section-head"><div><h2>Полный перечень</h2><p class="subtle">Сначала — действия, предотвращающие критические инциденты; далее — по количеству связанных инцидентов</p></div></div><div class="actions-list">${actions.map(actionRow).join("")}</div></section>`;
}
function renderSettings(){
  qs("#settings-view").innerHTML=`${pageHead("Настройки мониторинга","Доступно администраторам Set Mark")}
    <section class="panel" style="margin-top:20px"><h2>Источники данных</h2><div class="setting-row"><div><strong>Новая интеграция с API Честного знака</strong><small>Получение отклонений для нового модуля. Действующей интеграции Set Mark с Честным знаком нет.</small></div>${badge("Деморежим","warn")}</div><div class="setting-row"><div><strong>Данные кассового ПО</strong><small>Существующий обмен кассы с Set Mark: результаты онлайн- и офлайн-проверок, решение кассового ПО и фактическое действие.</small></div>${badge("Доступно","ok")}</div></section>
    <section class="panel" style="margin-top:14px"><h2>Уведомления и хранение</h2><div class="setting-row"><div><strong>Ежедневные уведомления</strong><small>3 получателя · ежедневно в 09:00</small></div><button class="switch" aria-label="Ежедневные уведомления включены"></button></div><div class="setting-row"><div><strong>Срок хранения данных</strong><small>Инциденты и исходные снимки</small></div><select class="select"><option>365 дней</option><option>180 дней</option></select></div></section>`;
}
function exportCsv(){
  const rows=filteredIncidents();
  const csv=["Инцидент;Дата и время;Магазин;Касса;Нарушение;Результат;Риск",...rows.map(i=>[i.id,i.time,i.store,i.cash,i.type,i.ra,i.risk].join(";"))].join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}), a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="set-mark-incidents-demo.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV сформирован по текущей выборке");
}
function bindIncidentFilters(){
  const search=qs("#search"); if(search){let timer;search.oninput=e=>{const value=e.target.value;clearTimeout(timer);timer=setTimeout(()=>{state.query=value;renderIncidents();setTimeout(()=>{const next=qs("#search");next?.focus();next?.setSelectionRange(value.length,value.length)},0)},250)}}
  const store=qs("#store-filter"); if(store)store.onchange=e=>{state.store=e.target.value;renderIncidents()};
  const priority=qs("#priority-filter"); if(priority)priority.onchange=e=>{state.priorityOnly=e.target.checked;renderIncidents()};
  const result=qs("#result-filter"); if(result)result.onchange=e=>{state.result=e.target.value;renderIncidents()};
  qsa("[data-type-filter]").forEach(c=>c.onchange=e=>{state.types=e.target.checked?[...state.types,e.target.value]:state.types.filter(x=>x!==e.target.value);renderIncidents()});
  const reset=qs("#reset-filters"); if(reset)reset.onclick=()=>{state.query="";state.store="Все магазины";state.priorityOnly=false;state.confirmedOnly=false;state.result="";state.types=[];renderIncidents()};
}
function bindGlobal(){
  qsa("[data-network]").forEach(select=>select.onchange=e=>toast(`Выбрана ${e.target.options[e.target.selectedIndex].text}`));
  qsa("[data-export]").forEach(b=>b.onclick=exportCsv);
  qsa("[data-range-preset]").forEach(select=>select.onchange=()=>{
    const preset=select.value;
    if(preset==="custom"){
      state.rangePreset="custom";
      route();
      return;
    }
    applyPreset(preset);
  });
  qsa("[data-apply-range]").forEach(b=>b.onclick=()=>{
    const container=b.closest(".date-range");
    const start=container.querySelector("[data-range-start]").value;
    const end=container.querySelector("[data-range-end]").value;
    if(!start||!end){toast("Укажите обе даты периода");return}
    if(start>end){toast("Дата начала не может быть позже даты окончания");return}
    state.rangePreset="custom";state.rangeStart=start;state.rangeEnd=end;route();
    toast(`Период применён: ${dateRangeLabel()}`);
  });
  qsa("[data-priority]").forEach(b=>b.onclick=()=>{state.priorityOnly=true;navigate("incidents")});
  qsa("[data-all-stores]").forEach(b=>b.onclick=()=>{
    state.store="Все магазины";
    state.priorityOnly=true;
    state.confirmedOnly=false;
    state.result="";
    state.types=[];
    state.query="";
    navigate("incidents");
  });
  qsa("[data-all-actions]").forEach(b=>b.onclick=()=>navigate("actions"));
  qsa("[data-type-jump]").forEach(b=>b.onclick=()=>{state.types=[b.dataset.typeJump];navigate("incidents")});
  qsa("[data-week-start]").forEach(b=>b.onclick=()=>{state.rangePreset="custom";state.rangeStart=b.dataset.weekStart;state.rangeEnd=b.dataset.weekEnd;navigate("incidents")});
  const ac=qs("#analytics-critical");if(ac)ac.onchange=e=>{state.priorityOnly=e.target.checked;renderAnalytics();bindGlobal()};
  const af=qs("#analytics-confirmed");if(af)af.onchange=e=>{state.confirmedOnly=e.target.checked;renderAnalytics();bindGlobal()};
  qsa("[data-store]").forEach(el=>{const go=()=>{state.store=el.dataset.store;navigate("incidents")};el.onclick=go;el.onkeydown=e=>{if(e.key==="Enter")go()}});
  qsa("[data-risk-store]").forEach(el=>{const go=()=>{
    state.store=el.dataset.riskStore;
    state.priorityOnly=true;
    state.confirmedOnly=false;
    state.result="";
    state.types=[];
    state.query="";
    navigate("incidents");
  };el.onclick=go;el.onkeydown=e=>{if(e.key==="Enter")go()}});
  qsa("[data-incident]").forEach(el=>{const go=()=>navigate("incident/"+el.dataset.incident);el.onclick=go;el.onkeydown=e=>{if(e.key==="Enter")go()}});
  qsa("[data-copy]").forEach(b=>b.onclick=()=>toast("Ссылка на инцидент скопирована"));
  qsa("[data-pdf]").forEach(b=>b.onclick=()=>{
    const id=(location.hash.split("/")[1]||incidents[0].id);
    const a=document.createElement("a");
    a.href=`/pdf/${id}.pdf`;
    a.download=`Описание инцидента ${id}.pdf`;
    document.body.appendChild(a);a.click();a.remove();
    toast("PDF сформирован по данным инцидента");
  });
}
function route(){
  const hash=(location.hash||"#overview").slice(1), [page,id]=hash.split("/");
  const target=page==="priority"?"overview":page;
  qsa(".view").forEach(v=>v.hidden=true);
  qsa("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===target));
  if(target==="incidents"){renderIncidents();qs("#incidents-view").hidden=false}
  else if(target==="incident"){renderIncident(id);qs("#incident-view").hidden=false;qsa("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav==="incidents"))}
  else if(target==="actions"){renderActions();qs("#actions-view").hidden=false}
  else if(target==="analytics"){renderAnalytics();qs("#analytics-view").hidden=false}
  else if(target==="settings"){renderSettings();qs("#settings-view").hidden=false}
  else {renderOverview();qs("#overview-view").hidden=false;if(page==="priority")setTimeout(()=>qs("#priority")?.scrollIntoView(),0)}
  bindGlobal();window.scrollTo({top:0,behavior:"instant"});
}
window.addEventListener("hashchange",route);
route();


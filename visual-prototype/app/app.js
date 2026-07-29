const incidents = [
  {id:"INC-10482",critical:true,fine:true,store:"Магазин № 184",city:"Екатеринбург",cash:"Касса 04",type:"Продажа без проверки КМ",group:"Пиво",time:"28.07.2026, 17:42",ra:"RA-01",result:"Подтверждённое нарушение",risk:"Риск автоштрафа",contour:"Кассовое ПО",status:"Анализ завершён"},
  {id:"INC-10471",critical:true,fine:true,store:"Магазин № 052",city:"Пермь",cash:"Касса 11",type:"Продажа при запрете кассы",group:"Табачная продукция",time:"28.07.2026, 16:18",ra:"RA-01",result:"Подтверждённое нарушение",risk:"Риск автоштрафа",contour:"Кассовое ПО",status:"Анализ завершён"},
  {id:"INC-10423",critical:true,fine:true,store:"Магазин № 317",city:"Тюмень",cash:"Касса 02",type:"Нарушена последовательность проверки",group:"Молочная продукция",time:"28.07.2026, 12:56",ra:"RA-01",result:"Подтверждённое нарушение",risk:"Риск автоштрафа",contour:"Настройки магазина",status:"Анализ завершён"},
  {id:"INC-10398",critical:true,fine:false,store:"Магазин № 184",city:"Екатеринбург",cash:"Касса 01",type:"Некорректный код проверки",group:"Пиво",time:"28.07.2026, 10:12",ra:"RA-04",result:"Недостаточно данных",risk:"Риск не установлен",contour:"Данные интеграции",status:"Анализ завершён"},
  {id:"INC-10314",critical:false,fine:false,store:"Магазин № 088",city:"Челябинск",cash:"Касса 07",type:"Повторная продажа КМ",group:"Молочная продукция",time:"27.07.2026, 21:04",ra:"RA-02",result:"Корректный сценарий",risk:"Риска нет",contour:"Не требуется",status:"Анализ завершён"},
  {id:"INC-10277",critical:false,fine:false,store:"Магазин № 052",city:"Пермь",cash:"Касса 03",type:"Неизвестный тип отклонения",group:"Обувь",time:"27.07.2026, 18:21",ra:"RA-05",result:"Требуется обновление правил",risk:"Риск не установлен",contour:"Правила анализа",status:"Анализ завершён"},
  {id:"INC-10201",critical:false,fine:false,store:"Магазин № 241",city:"Уфа",cash:"Касса 09",type:"Выбытие вне розничной продажи",group:"Вода",time:"27.07.2026, 13:39",ra:"RA-03",result:"Вне поддерживаемых процессов",risk:"Риск не установлен",contour:"Внешний процесс",status:"Анализ завершён"}
];
const state = {
  query:"",
  priorityOnly:false,
  store:"Все магазины",
  tab:"analysis",
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
    <label><span>С</span><input class="input date-input" data-range-start type="date" value="${state.rangeStart}"></label>
    <span class="date-separator" aria-hidden="true">—</span>
    <label><span>По</span><input class="input date-input" data-range-end type="date" value="${state.rangeEnd}"></label>
    <button class="button" data-apply-range>Применить</button>
  </div>`;
}
function metricsForRange(){
  const start=Math.max(dateAtStart(state.rangeStart),dateAtStart("2026-07-22"));
  const end=Math.min(dateAtStart(state.rangeEnd),dateAtStart("2026-07-28"));
  const overlap=end<start?0:Math.floor((end-start)/DAY)+1;
  const scale=overlap/7;
  return {
    total:Math.round(1248*scale),
    critical:Math.round(64*scale),
    fine:Math.round(12*scale),
    incomplete:Math.round(37*scale)
  };
}

function renderOverview() {
  const metrics=metricsForRange();
  qs("#overview-view").innerHTML = `
    ${pageHead("Мониторинг нарушений",`Сводка по сети «Север» за ${dateRangeLabel()}`,
      `${dateRangeControl()}<button class="button" data-export>Выгрузить CSV</button>`)}
    <section class="priority-banner" id="priority" aria-labelledby="priority-title">
      <div class="priority-icon" aria-hidden="true">!</div>
      <div><h2 id="priority-title">Критические инциденты с риском автоштрафа</h2><p>Требуют первоочередного анализа · 3 магазина, 3 кассы</p></div>
      <div><span class="priority-count">${metrics.fine}</span><button class="priority-action" data-priority>Перейти к инцидентам →</button></div>
    </section>
    <div class="metrics">
      <article class="metric"><span>Всего инцидентов</span><strong>${fmt(metrics.total)}</strong><small>За выбранный период</small></article>
      <article class="metric"><span>Критические</span><strong>${fmt(metrics.critical)}</strong><small>${metrics.total?Math.round(metrics.critical/metrics.total*1000)/10:0}% от общего числа</small></article>
      <article class="metric"><span>С риском автоштрафа</span><strong>${fmt(metrics.fine)}</strong><small class="up">Требуют внимания</small></article>
      <article class="metric"><span>Недостаточно данных</span><strong>${fmt(metrics.incomplete)}</strong><small>За выбранный период</small></article>
    </div>
    <div class="grid-2">
      <section class="panel">
        <div class="section-head"><div><h2>Объекты с наибольшим риском</h2><p class="subtle">Сортировка по критическим инцидентам</p></div><button class="button ghost" data-all-stores>Все магазины</button></div>
        <div class="store-list">
          ${[
            ["Магазин № 184","Екатеринбург · 8 касс",19,8,100],
            ["Магазин № 052","Пермь · 12 касс",14,5,74],
            ["Магазин № 317","Тюмень · 6 касс",11,3,58],
            ["Магазин № 088","Челябинск · 10 касс",8,0,42]
          ].map(x=>`<div class="store-row" tabindex="0" role="button" data-store="${x[0]}"><div><strong>${x[0]}</strong><small>${x[1]}</small></div><div class="bar"><i style="width:${x[4]}%"></i></div><div>${x[3]?badge(x[3]+" с риском","danger"):badge("нет риска","ok")}</div><span>›</span></div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="section-head"><div><h2>Состояние данных</h2><p class="subtle">Источники и полнота</p></div></div>
        <div class="source-list">
          <div class="source-item"><span class="source-dot ok"></span><div><strong>Отклонения Честного знака</strong><small>Новая интеграция Set Mark с True API · демоданные</small></div>${badge("100%","ok")}</div>
          <div class="source-item"><span class="source-dot ok"></span><div><strong>Кассовые операции</strong><small>Последнее событие 4 мин назад</small></div>${badge("99,8%","ok")}</div>
          <div class="source-item"><span class="source-dot ok"></span><div><strong>Проверки кассового ПО</strong><small>Онлайн ЧЗ и ЛМ ЧЗ</small></div>${badge("98,4%","ok")}</div>
          <div class="source-item"><span class="source-dot"></span><div><strong>Настройки Set Centrum</strong><small>Актуальная конфигурация, не историческое доказательство</small></div>${badge("ограничение","warn")}</div>
        </div>
      </section>
    </div>`;
}

function filteredIncidents() {
  return incidents.filter(i => (!state.priorityOnly || i.fine) &&
    incidentDate(i.time)>=dateAtStart(state.rangeStart) &&
    incidentDate(i.time)<=dateAtStart(state.rangeEnd) &&
    (state.store==="Все магазины" || i.store===state.store) &&
    (!state.query || `${i.id} ${i.store} ${i.cash} ${i.type} ${i.group}`.toLowerCase().includes(state.query.toLowerCase())));
}
function renderIncidents() {
  const rows=filteredIncidents();
  qs("#incidents-view").innerHTML=`
    ${pageHead("Инциденты",`Системные результаты анализа отклонений за ${dateRangeLabel()}`,
      `<button class="button" data-export>Выгрузить CSV</button>`)}
    <div class="filterbar">
      ${dateRangeControl()}
      <input class="input search" id="search" type="search" placeholder="Поиск по номеру, магазину, кассе или нарушению" value="${state.query}" aria-label="Поиск инцидентов">
      <select class="select" id="store-filter" aria-label="Магазин">${["Все магазины",...new Set(incidents.map(i=>i.store))].map(x=>`<option ${x===state.store?"selected":""}>${x}</option>`).join("")}</select>
      <button class="filter-chip ${state.priorityOnly?"active":""}" id="priority-filter" aria-pressed="${state.priorityOnly}">! Риск автоштрафа</button>
      <button class="filter-chip">Критичность ⌄</button><button class="filter-chip">Результат RA ⌄</button>
    </div>
    <div class="table-wrap">
      ${rows.length?`<table><thead><tr><th>Инцидент</th><th>Дата и время</th><th>Магазин / касса</th><th>Нарушение</th><th>Результат</th><th>Риск</th><th></th></tr></thead>
      <tbody>${rows.map(i=>`<tr class="${i.critical?"critical":""}" tabindex="0" data-incident="${i.id}">
        <td><span class="cell-title">${i.id}</span><span class="cell-sub">${i.group}</span></td><td>${i.time}</td>
        <td><span class="cell-title">${i.store}</span><span class="cell-sub">${i.cash} · ${i.city}</span></td>
        <td>${i.type}</td><td>${badge(i.ra,i.ra==="RA-01"?"danger":i.ra==="RA-02"?"ok":"warn")}<span class="cell-sub">${i.result}</span></td>
        <td>${badge(i.risk,i.fine?"danger":"neutral")}</td><td>›</td></tr>`).join("")}</tbody></table>`:
      `<div class="empty"><h3>Инциденты не найдены</h3><p>Измените условия поиска или сбросьте фильтры.</p><button class="button" id="reset-filters">Сбросить фильтры</button></div>`}
      <div class="table-foot"><span>Показано ${rows.length} из 1 248</span><span>1 / 125 &nbsp; ‹ &nbsp; ›</span></div>
    </div>`;
  bindIncidentFilters();
}

function renderIncident(id) {
  const i=incidents.find(x=>x.id===id)||incidents[0];
  qs("#incident-view").innerHTML=`
    <button class="back" id="back-incidents">← Назад к списку инцидентов</button>
    <div class="page-head"><div><div class="incident-title"><h1>${i.id}</h1>${badge("Критический","danger")}${badge(i.risk,i.fine?"danger":"neutral")}</div><p>${i.type} · ${i.store}, ${i.cash}</p></div><div class="controls"><button class="button" data-copy>Копировать ссылку</button><button class="button" data-export>Выгрузить</button></div></div>
    <div class="incident-layout">
      <div>
        <section class="panel summary-card">
          <span class="eyebrow">Результат анализа</span>
          <div class="result-line"><span class="result-code">${i.ra}</span><div><strong>${i.result}</strong><p class="subtle">Версия правил 2026.07.3 · анализ завершён сегодня в 17:49</p></div></div>
          <div class="explain"><strong>Почему получен такой результат</strong><br>Кассовое ПО получило от онлайн Честного знака исходные признаки по коду маркировки, сформировало запрет продажи, но кассовая операция была завершена. Фактическое действие не соответствует решению кассового ПО.</div>
          <dl class="kv"><dt>Операция</dt><dd>${i.time} · UTC+05:00</dd><dt>Товарная группа</dt><dd>${i.group}</dd><dt>Код маркировки</dt><dd>010460••••••817521••••92</dd><dt>Контур устранения</dt><dd>${i.contour}</dd><dt>Состояние</dt><dd>${i.status}</dd></dl>
          <div class="tabs" role="tablist">
            <button class="tab ${state.tab==="analysis"?"active":""}" data-tab="analysis" role="tab">Цепочка проверки</button>
            <button class="tab ${state.tab==="source"?"active":""}" data-tab="source" role="tab">Исходное отклонение</button>
            <button class="tab ${state.tab==="operations"?"active":""}" data-tab="operations" role="tab">Операции</button>
          </div>
          <div class="tab-content" id="tab-content"></div>
        </section>
      </div>
      <aside>
        <section class="panel side-card"><h3>Рекомендация</h3><div class="recommendation">Проверьте применение правил запрета продажи в кассовом ПО ${i.cash} и журнал завершения операции.</div></section>
        <section class="panel side-card"><h3>Критичность и риск</h3><dl class="kv"><dt>Критичность</dt><dd>${badge("Критическая","danger")}</dd><dt>Автоштраф</dt><dd>${badge(i.fine?"Риск установлен":"Не установлен",i.fine?"danger":"neutral")}</dd><dt>Основание</dt><dd>Норма действовала на дату операции</dd></dl></section>
        <section class="panel side-card"><h3>Качество данных</h3><div class="source-item"><span class="source-dot ok"></span><div><strong>Данные полные</strong><small>Все обязательные источники доступны</small></div></div></section>
      </aside>
    </div>`;
  renderTab();
  qsa("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderIncident(i.id)});
  qs("#back-incidents").onclick=()=>navigate("incidents");
}
function renderTab(){
  const content=qs("#tab-content"); if(!content)return;
  if(state.tab==="source") content.innerHTML=`<dl class="kv"><dt>Номер отклонения</dt><dd>DEV-DEMO-20260728-10482</dd><dt>Категория</dt><dd>Розничная реализация</dd><dt>Вид</dt><dd>Продажа без соблюдения разрешительного режима</dd><dt>Регистрация</dt><dd>28.07.2026, 17:46</dd></dl><p class="subtle">Синтетический неизменяемый снимок структуры True API. Реальные клиентские идентификаторы не используются.</p>`;
  else if(state.tab==="operations") content.innerHTML=`<dl class="kv"><dt>Документ продажи</dt><dd>Чек № 8421</dd><dt>Продажа завершена</dt><dd>Да · 28.07.2026, 17:42:18</dd><dt>Возврат или отмена</dt><dd>Не найдены</dd><dt>Ключ корреляции</dt><dd>Код маркировки + временная метка</dd></dl>`;
  else content.innerHTML=`
    <div class="evidence-step"><span class="step">1</span><div><strong>Ответ онлайн Честного знака</strong><p class="subtle">Получены исходные признаки: found=true, verified=true, isBlocked=true. Это не готовое решение о продаже.</p></div></div>
    <div class="evidence-step"><span class="step">2</span><div><strong>Решение кассового ПО</strong><p class="subtle">Продажа запрещена · правило ККТ-17, версия 2026.07.3.</p></div></div>
    <div class="evidence-step"><span class="step">3</span><div><strong>Фактическое действие кассы</strong><p class="subtle">Продажа завершена. Обнаружено расхождение с решением кассового ПО.</p></div></div>`;
}

function renderAnalytics(){
  qs("#analytics-view").innerHTML=`
    ${pageHead("Аналитика","Динамика нарушений по выбранному часовому поясу сети",
      `<select class="select"><option>Последние 7 дней</option></select><button class="button" data-export>Выгрузить CSV</button>`)}
    <div class="metrics"><article class="metric"><span>Инциденты за период</span><strong>1 248</strong><small class="up">↑ 8%</small></article><article class="metric"><span>Критические</span><strong>64</strong><small>5,1%</small></article><article class="metric"><span>С риском автоштрафа</span><strong>12</strong><small class="up">↑ 3</small></article><article class="metric"><span>Магазины выше порога</span><strong>7</strong><small>из 412</small></article></div>
    <div class="grid-2">
      <section class="panel"><div class="section-head"><div><h2>Динамика инцидентов</h2><p class="subtle">Всего и критические по дням</p></div></div><div class="chart">${[54,68,61,82,74,91,87].map((h,i)=>`<div class="col ${i===5?"critical":""}" style="height:${h}%"><span>${22+i}.07</span></div>`).join("")}</div><div class="legend"><span><i style="background:#66bce8"></i>Все инциденты</span><span><i style="background:var(--csi-error)"></i>Максимум критических</span></div></section>
      <section class="panel"><h2>Распределение результатов</h2><div class="store-list">${[["RA-01 · Нарушение",48,"danger"],["RA-02 · Корректный сценарий",21,"ok"],["RA-03 · Вне процессов",9,"neutral"],["RA-04 · Недостаточно данных",17,"warn"],["RA-05 · Нужны правила",5,"warn"]].map(x=>`<div class="store-row"><div><strong>${x[0]}</strong></div><div class="bar"><i style="width:${x[1]}%;background:${x[2]==="danger"?"var(--csi-error)":"#66bce8"}"></i></div><div>${x[1]}%</div><span></span></div>`).join("")}</div></section>
    </div>`;
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
  const search=qs("#search"); if(search)search.oninput=e=>{state.query=e.target.value;renderIncidents()};
  const store=qs("#store-filter"); if(store)store.onchange=e=>{state.store=e.target.value;renderIncidents()};
  const priority=qs("#priority-filter"); if(priority)priority.onclick=()=>{state.priorityOnly=!state.priorityOnly;renderIncidents()};
  const reset=qs("#reset-filters"); if(reset)reset.onclick=()=>{state.query="";state.store="Все магазины";state.priorityOnly=false;renderIncidents()};
}
function bindGlobal(){
  qsa("[data-network]").forEach(select=>select.onchange=e=>toast(`Выбрана ${e.target.options[e.target.selectedIndex].text}`));
  qsa("[data-export]").forEach(b=>b.onclick=exportCsv);
  qsa("[data-apply-range]").forEach(b=>b.onclick=()=>{
    const container=b.closest(".date-range");
    const start=container.querySelector("[data-range-start]").value;
    const end=container.querySelector("[data-range-end]").value;
    if(!start||!end){toast("Укажите обе даты периода");return}
    if(start>end){toast("Дата начала не может быть позже даты окончания");return}
    state.rangeStart=start;state.rangeEnd=end;route();
    toast(`Период применён: ${dateRangeLabel()}`);
  });
  qsa("[data-priority]").forEach(b=>b.onclick=()=>{state.priorityOnly=true;navigate("incidents")});
  qsa("[data-store]").forEach(el=>{const go=()=>{state.store=el.dataset.store;navigate("incidents")};el.onclick=go;el.onkeydown=e=>{if(e.key==="Enter")go()}});
  qsa("[data-incident]").forEach(el=>{const go=()=>navigate("incident/"+el.dataset.incident);el.onclick=go;el.onkeydown=e=>{if(e.key==="Enter")go()}});
  qsa("[data-copy]").forEach(b=>b.onclick=()=>toast("Ссылка на инцидент скопирована"));
}
function route(){
  const hash=(location.hash||"#overview").slice(1), [page,id]=hash.split("/");
  const target=page==="priority"?"overview":page;
  qsa(".view").forEach(v=>v.hidden=true);
  qsa("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===target));
  if(target==="incidents"){renderIncidents();qs("#incidents-view").hidden=false}
  else if(target==="incident"){renderIncident(id);qs("#incident-view").hidden=false;qsa("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav==="incidents"))}
  else if(target==="analytics"){renderAnalytics();qs("#analytics-view").hidden=false}
  else if(target==="settings"){renderSettings();qs("#settings-view").hidden=false}
  else {renderOverview();qs("#overview-view").hidden=false;if(page==="priority")setTimeout(()=>qs("#priority")?.scrollIntoView(),0)}
  bindGlobal();window.scrollTo({top:0,behavior:"instant"});
}
window.addEventListener("hashchange",route);
route();

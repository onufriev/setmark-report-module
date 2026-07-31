incidents.splice(0,incidents.length,...window.prototypeIncidents);
actions.splice(0,actions.length,...window.prototypeActions);
state.query="";state.priorityOnly=false;state.confirmedOnly=false;state.result="";state.store="Все магазины";state.types=[];

renderIncident=function(id){
  const i=incidents.find(x=>x.id===id)||incidents[0];
  qs("#incident-view").innerHTML=`
    <button class="back" id="back-incidents">← Назад к списку инцидентов</button>
    <div class="page-head"><div><div class="incident-title"><h1>${i.id}</h1>${i.critical?badge("Критический","danger"):""}</div><p>${i.type} · ${i.store}, ${i.cash}</p></div><div class="controls"><button class="button" data-copy>Копировать ссылку</button><button class="button" data-pdf>Описание для контролирующих органов, PDF</button></div></div>
    <div class="incident-layout"><div><section class="panel summary-card">
      <span class="eyebrow">Результат проверки</span>
      <div class="result-line"><div><strong>${i.result}</strong><p class="subtle">Правило ${i.rule} v0.1 · анализ завершён</p></div></div>
      <div class="explain"><strong>Почему получен такой результат</strong><br>${i.reason}</div>
      <dl class="kv"><dt>Операция</dt><dd>${i.time} · UTC+05:00</dd><dt>Товарная группа</dt><dd>${i.group}</dd><dt>Код маркировки</dt><dd>${i.mark}</dd><dt>Контур устранения</dt><dd>${i.contour}</dd><dt>Состояние</dt><dd>${i.status}</dd></dl>
      <div class="tabs" role="tablist"><button class="tab ${state.tab==="analysis"?"active":""}" data-tab="analysis">Цепочка проверки</button><button class="tab ${state.tab==="source"?"active":""}" data-tab="source">Исходное отклонение</button><button class="tab ${state.tab==="operations"?"active":""}" data-tab="operations">Операции</button></div>
      <div class="tab-content" id="tab-content"></div>
    </section></div><aside>
      <section class="panel side-card"><h3>Необходимое действие</h3><div class="recommendation">${i.recommendation}</div></section>
      <section class="panel side-card"><h3>Критичность</h3><dl class="kv"><dt>Критичность</dt><dd>${i.critical?badge("Критическая","danger"):badge("Некритическая","neutral")}</dd><dt>Риск автоштрафа</dt><dd>${i.critical?"Да":"Нет"}</dd><dt>Потенциальный штраф</dt><dd>${i.fine?`<span class="money">${fmt(i.fine)} ₽</span><small class="cell-sub">Расчётная оценка, не назначенный штраф</small>`:"—"}</dd></dl></section>
    </aside></div>`;
  renderTab(i);
  qsa("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderIncident(i.id)});
  qs("#back-incidents").onclick=()=>navigate("incidents");
};

renderTab=function(i){
  const content=qs("#tab-content");if(!content)return;
  if(state.tab==="source") content.innerHTML=`<dl class="kv"><dt>Правило</dt><dd>${i.rule}</dd><dt>Вид отклонения</dt><dd>${i.sourceKind}</dd><dt>Описание</dt><dd>${i.sourceText}</dd><dt>Регистрация</dt><dd>${i.time}</dd></dl><p class="subtle">Синтетический неизменяемый снимок структуры True API. Реальные клиентские идентификаторы не используются.</p>`;
  else if(state.tab==="operations") content.innerHTML=`<dl class="kv"><dt>Документ продажи</dt><dd>Чек № ${i.id.slice(-4)}</dd><dt>Продажа завершена успешно</dt><dd>Да · ${i.time}</dd><dt>Код маркировки</dt><dd>${i.mark}</dd><dt>Ключ корреляции</dt><dd>Полный код маркировки + временная метка</dd></dl>`;
  else content.innerHTML=i.chain.map((text,index)=>`<div class="evidence-step"><span class="step">${index+1}</span><div><strong>${text}</strong></div></div>`).join("");
};

exportCsv=function(){
  const rows=filteredIncidents();
  const csv=["Инцидент;Правило;Дата и время;Магазин;Касса;Нарушение;Результат;Риск автоштрафа",...rows.map(i=>[i.id,i.rule,i.time,i.store,i.cash,i.type,i.result,i.critical?"Да":"Нет"].join(";"))].join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="set-mark-reviewed-incidents.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV сформирован по текущей выборке");
};

const originalRenderIncidents=renderIncidents;
renderIncidents=function(){
  originalRenderIncidents();
  qsa("tbody tr[data-incident]").forEach(row=>{
    const i=incidents.find(x=>x.id===row.dataset.incident);
    const sub=row.querySelector(".cell-sub");
    if(i&&sub)sub.textContent=`${i.rule} · ${i.group}`;
  });
};

const originalRenderOverview=renderOverview;
renderOverview=function(){
  originalRenderOverview();
  const subtitle=qs("#overview-view .type-chart")?.closest(".panel")?.querySelector(".subtle");
  if(subtitle)subtitle.textContent="Только разобранные типы отклонений: INC-001, INC-002 и INC-006";
  const banner=qs("#priority-title")?.nextElementSibling;
  if(banner)banner.textContent="Инциденты, для которых возможен автоштраф";
};

route();
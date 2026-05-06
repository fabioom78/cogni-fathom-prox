const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;

const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cogni Fathom Agent</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#1a1a1a;font-size:14px}
.app{max-width:780px;margin:0 auto;padding:2rem 1rem}
h1{font-size:18px;font-weight:600;margin-bottom:1.5rem;color:#1a1a1a}
.pipeline{display:flex;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;margin-bottom:2rem;background:#fff}
.ps{flex:1;padding:10px 4px;text-align:center;font-size:11px;color:#999;border-right:1px solid #e0e0e0;cursor:default}
.ps:last-child{border-right:none}
.ps.active{background:#f0f0f0;color:#1a1a1a;font-weight:600}
.ps.done{color:#22c55e}
.ps .sn{display:block;font-size:10px;margin-bottom:2px}
.pane{display:none}.pane.active{display:block}
label{font-size:12px;font-weight:600;color:#555;margin-bottom:5px;display:block}
.sub{font-size:11px;color:#888;margin-bottom:8px;line-height:1.5}
input,textarea,select{width:100%;padding:9px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;font-family:inherit;background:#fff;color:#1a1a1a;outline:none}
input:focus,textarea:focus{border-color:#999}
textarea{resize:vertical}
.btn{padding:9px 18px;border-radius:8px;border:1px solid #ccc;background:#fff;cursor:pointer;font-size:13px;color:#1a1a1a;display:inline-flex;align-items:center;gap:6px;font-family:inherit}
.btn:hover{background:#f0f0f0}
.btn:disabled{opacity:0.4;cursor:not-allowed}
.btn-p{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.btn-p:hover{background:#333}
.btn-sm{padding:6px 12px;font-size:12px}
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.sec{margin-bottom:1.5rem}
.divhr{border:none;border-top:1px solid #eee;margin:1.5rem 0}
.flag{padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:10px;line-height:1.5}
.fok{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.fwarn{background:#fffbeb;color:#92400e;border:1px solid #fde68a}
.ferr{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.finfo{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}
.log{background:#1a1a1a;border-radius:8px;padding:1rem;font-size:12px;font-family:monospace;line-height:1.8;margin-bottom:1rem;max-height:220px;overflow-y:auto;color:#e0e0e0}
.lok{color:#4ade80}.lrun{color:#60a5fa}.lwarn{color:#fbbf24}.lerr{color:#f87171}
.spinner{display:inline-block;width:12px;height:12px;border:2px solid #444;border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.theme-card{border:1px solid #e0e0e0;border-radius:10px;padding:14px 16px;margin-bottom:10px;cursor:pointer;background:#fff;transition:border-color 0.15s}
.theme-card:hover{border-color:#999;background:#fafafa}
.theme-card.sel{border:2px solid #3b82f6;background:#eff6ff}
.tc-title{font-size:14px;font-weight:600;margin-bottom:4px}
.tc-meta{font-size:12px;color:#666;line-height:1.5}
.sel .tc-title{color:#1d4ed8}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.pill{font-size:11px;padding:3px 10px;border-radius:20px;background:#f0f0f0;border:1px solid #e0e0e0;color:#555;display:flex;align-items:center;gap:4px}
.pill button{background:none;border:none;cursor:pointer;color:#999;font-size:13px;padding:0;line-height:1}
.nirow{display:flex;align-items:center;gap:10px;margin-top:10px}
.dl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.dl-card{border:1px solid #e0e0e0;border-radius:10px;padding:14px;text-align:center;background:#fff}
.dl-title{font-size:12px;font-weight:600;margin-bottom:4px}
.dl-sub{font-size:11px;color:#888;margin-bottom:12px;line-height:1.4}
.verdict{font-size:13px;font-weight:600;padding:10px 14px;border-radius:8px;margin-bottom:10px}
.vpass{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.vcrit{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.key-row{display:flex;gap:8px;align-items:flex-end;margin-bottom:1.5rem}
.key-row input{flex:1}
</style>
</head>
<body>
<div class="app">
<h1>Cogni Fathom Agent</h1>
<div class="key-row">
  <div style="flex:1">
    <label>Anthropic API Key</label>
    <input type="password" id="apikey" placeholder="sk-ant-..." />
  </div>
  <button class="btn btn-sm" onclick="saveKey()">Salvar</button>
  <span id="key-status" style="font-size:11px;color:#888"></span>
</div>
<div class="pipeline">
  <div class="ps active" id="ps1"><span class="sn">1</span>Tema</div>
  <div class="ps" id="ps2"><span class="sn">2</span>Pesquisa</div>
  <div class="ps" id="ps3"><span class="sn">3</span>Brief</div>
  <div class="ps" id="ps4"><span class="sn">4</span>Roteiro</div>
  <div class="ps" id="ps5"><span class="sn">5</span>Revisao</div>
</div>
<div class="pane active" id="pane1">
  <div class="sec">
    <label>Temas ja publicados</label>
    <div class="pills" id="pills"></div>
    <div style="display:flex;gap:8px">
      <input type="text" id="topic-input" placeholder="Ex: Social Media Psychological Traps" style="flex:1" onkeydown="if(event.key==='Enter')addTopic()" />
      <button class="btn btn-sm" onclick="addTopic()">+</button>
    </div>
  </div>
  <div class="divhr"></div>
  <div class="sec">
    <label>Como quer comecar?</label>
    <div class="two" style="margin-top:8px">
      <button class="btn" id="btn-suggest" onclick="startSuggest()">Sugerir 5 temas via API</button>
      <button class="btn" id="btn-manual" onclick="showManual()">Digitar meu proprio tema</button>
    </div>
  </div>
  <div id="suggest-area" style="display:none">
    <div class="log" id="suggest-log"></div>
    <div id="themes-list"></div>
    <div id="manual-fallback" style="display:none"><div class="flag fwarn">Nao foi possivel gerar sugestoes. Digite o tema manualmente.</div></div>
  </div>
  <div id="manual-area" style="display:none">
    <div class="sec">
      <label>Tema do video</label>
      <input type="text" id="manual-theme" placeholder="Ex: Cognitive Dissonance and Self-Deception Mechanisms" />
    </div>
  </div>
  <div id="subtopic-choose" style="display:none;margin-top:16px">
    <div class="nirow">
      <label style="margin:0;white-space:nowrap">Numero de subtopicos:</label>
      <input type="number" id="num-sub" min="5" max="10" value="7" style="width:70px" />
      <span style="font-size:11px;color:#888">entre 5 e 10</span>
    </div>
  </div>
  <div class="actions" id="p1-actions" style="display:none">
    <button class="btn btn-p" onclick="confirmTheme()">Confirmar tema e pesquisar</button>
  </div>
</div>
<div class="pane" id="pane2">
  <div class="flag finfo" id="p2-info"></div>
  <div class="log" id="research-log"></div>
  <div id="p2-actions" style="display:none" class="actions">
    <button class="btn btn-p" onclick="goPane(3)">Ver e editar brief</button>
    <button class="btn btn-sm" onclick="rerunResearch()">Refazer pesquisa</button>
  </div>
</div>
<div class="pane" id="pane3">
  <div class="sec">
    <label>Brief gerado</label>
    <div class="sub">Revise e edite se necessario antes de gerar o roteiro.</div>
    <textarea id="brief-edit" rows="22" style="font-family:monospace;font-size:12px;line-height:1.6"></textarea>
  </div>
  <div class="actions">
    <button class="btn btn-p" onclick="runScript()">Gerar roteiro</button>
    <button class="btn btn-sm" onclick="goPane(2)">Voltar</button>
  </div>
</div>
<div class="pane" id="pane4">
  <div class="log" id="script-log"></div>
  <div id="p4-actions" style="display:none" class="actions">
    <button class="btn btn-p" onclick="startReview()">Rodar revisao de monetizacao</button>
    <button class="btn btn-sm" onclick="goPane(3)">Editar brief</button>
  </div>
</div>
<div class="pane" id="pane5">
  <div class="log" id="review-log"></div>
  <div id="review-result-block"></div>
  <div id="p5-actions" style="display:none">
    <div class="dl-grid">
      <div class="dl-card">
        <div class="dl-title">Script completo</div>
        <div class="dl-sub">Todas as cenas com todos os campos</div>
        <button class="btn btn-p btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('script')">Baixar</button>
      </div>
      <div class="dl-card">
        <div class="dl-title">Narracoes</div>
        <div class="dl-sub">CENA + NARRACAO de cada cena</div>
        <button class="btn btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('narracao')">Baixar</button>
      </div>
      <div class="dl-card">
        <div class="dl-title">Prompts SuperGrok</div>
        <div class="dl-sub">CENA + PROMPT em linha unica</div>
        <button class="btn btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('prompts')">Baixar</button>
      </div>
    </div>
    <div class="actions" style="margin-top:12px">
      <button class="btn btn-sm" onclick="downloadFile('all')">Baixar os 3 arquivos</button>
      <button class="btn btn-sm" onclick="restartPipeline()">Novo video</button>
    </div>
    <div id="dl-confirm" style="display:none;margin-top:10px" class="flag fok">Download iniciado.</div>
  </div>
</div>
</div>
<script>
var MODEL='claude-sonnet-4-20250514';
var P1="You are a senior scriptwriter for Cogni Fathom, a faceless YouTube psychology channel. US/UK English. Style: dark cinematic, direct, counterintuitive. Tone: calm, precise, slightly unsettling.\n\nAUTHENTICITY MANDATE: Every script must execute the VARIATION PROFILE and include the PERSPECTIVE FRAME. Every claim must cite established research.\n\nVIDEO SPECS: Scene count 65-90. ~10s per scene. List-style format. Opening 2-3 scenes. Closing 3 scenes, end abruptly.\n\nVARIATION PROFILE dimensions: total_scenes, opening (hook_tension/cold_open/question_hook/stat_hook), ordering (ascending_intensity/thematic_clusters/chronological/reverse_surprise), palette (dark_cinematic/cold_clinical/warm_grain/monochrome_contrast/naturalistic_dim), arc (arc_3part/arc_4part/arc_5part).\n\nMANDATORY HEADER before scene 01:\nVARIATION PROFILE\n  total_scenes: [n]\n  opening: [value]\n  ordering: [value]\n  palette: [value]\n  arc: [value]\n  perspective_frame_position: [scene n]\n\nNARRATIVE: First scene of each subtopic: '[Number word] [number]: [topic]. [Hook].' Final: '[Number word] [number] - the last one. [Hook].'\nDRAMATIC PEAK: ascending_intensity=last item. reverse_surprise=penultimate.\nPERSPECTIVE FRAME: ONE scene with authorial observation. Wider shot, longer hold, no text overlay. NARRACAO verbatim from brief.\nWRITING: NARRACAO 130-150 chars including spaces. Second person. No CTA. SOURCE on first scene of each subtopic. Pace markers: [pause 0.4s] [slow] [emphasize: word].\nPOP-PSYCH FLAG: left-brain/right-brain, 10% brain, VAK, body language lie detection, 7-38-55 Mehrabian, Dunning-Kruger as stupid people, 21-day habit, subliminal mass control, Kubler-Ross fixed sequence.\nSCENE FORMAT:\nCENA [XX]\nNARRACAO: [130-150 chars] [chars: XXX]\nPROMPT: [single continuous line]\nFOOTAGE: [AI_GEN|REAL_BROLL]\nDISCLOSURE: [REQUIRES_DISCLOSURE|none]\nEDITING_NOTES: [CapCut]\nSOURCE: [Author, Work (Year) or none]\nREAL_BROLL>=20%. No nudity, no minors, no graphic violence. INELIGIBLE: eating disorders, child abuse.\nOUTPUT: 1)VARIATION PROFILE block 2)All scenes 3)DISCLOSURE SUMMARY block.";
var P3="YouTube monetization compliance specialist 2025-2026. Review Cogni Fathom scripts conservatively.\nCheck: VARIATION PROFILE present, PERSPECTIVE FRAME present, >=20% REAL_BROLL, SOURCE on every subtopic first scene, no graphic content, no minors, no eating disorders/child abuse, no pop-psych myths, NARRACAO 130-150 chars (excluding pace markers), AI disclosure complete.\nPer flagged scene: CENA[XX] / ISSUE / SEVERITY[critical|high|medium|low] / REASON / SUGGESTION\nEnd with summary including OVERALL VERDICT: [Approved|Needs revision|Reject]. Only flag issues.";
var PS="Content strategist for Cogni Fathom psychology YouTube channel. Topics used: {USED}\nGenerate exactly 5 themes. For each:\nTHEME [N]: [name]\nANGLE: [counterintuitive angle]\nHOOK: [second person hook sentence]\nSUBTOPICS: [3 with real authors and years]\nSCENES: [65|70|78|84|90]\nPALETTE: [palette value]";
var PR="Research psychology theme for YouTube: {THEME}\n1. TITLE OPTIONS (3): '[N] adj noun That/Why/How verb self-part' number 5-10.\n2. HOOK: second person, counterintuitive.\n3. SUBTOPICS ({NSUB}): concept + Author Work (Year). Last: DRAMATIC PEAK.\n4. PERSPECTIVE FRAME: 130-150 chars exactly.\n5. VARIATION PROFILE with justification.\n6. DIFFERENTIATOR NOTE. Previous: {PREV}";
var PB="Fill Cogni Fathom Topic Brief. Output ONLY the filled template.\nRESEARCH: {RESEARCH}\nPREVIOUS: {PREV}\n<titulo>[title]</titulo>\n<numero_subtopicos>[n]</numero_subtopicos>\n<hook>[hook]</hook>\n<subtopicos>[list with SOURCE, last DRAMATIC PEAK]</subtopicos>\n<variation_profile>\ntotal_scenes: [v]\nopening: [v]\nordering: [v]\npalette: [v]\narc: [v]\n</variation_profile>\n<differentiator_note>Previous video used: [profile or N/A first video]\nThis video changes:\n- [dim] [old]->[new] ([reason])\n- [dim] [old]->[new] ([reason])\n</differentiator_note>\n<perspective_frame>[130-150 chars]</perspective_frame>\n<perspective_frame_position>auto</perspective_frame_position>\n<instrucao>Step 1: PRE-FLIGHT CHECK. Step 2: Generate full script per Prompt 1. Apply VARIATION PROFILE. PERSPECTIVE FRAME verbatim. >=20% REAL_BROLL. REQUIRES_DISCLOSURE on AI_GEN humans. SOURCE on subtopic first scenes. Step 3: Output VARIATION PROFILE header, all scenes, DISCLOSURE SUMMARY.</instrucao>";
var PF="Fix ONLY NARRACAO char counts (130-150 chars, excluding pace markers). Use SUGGESTION from review when provided. Do NOT change other fields. Output COMPLETE script.\nREVIEW: {REVIEW}\nSCRIPT: {SCRIPT}";
var state={usedTopics:[],selectedTheme:null,numSub:7,manualMode:false,researchData:'',briefText:'',scriptText:'',reviewText:'',prevProfile:null,reviewAttempt:0,MAX_REVIEW:3};
function saveKey(){var k=document.getElementById('apikey').value.trim();if(k){localStorage.setItem('cf_apikey',k);document.getElementById('key-status').textContent='Salva!';setTimeout(function(){document.getElementById('key-status').textContent=''},2000);}}
function getKey(){return localStorage.getItem('cf_apikey')||document.getElementById('apikey').value.trim();}
function loadStorage(){try{var s=localStorage.getItem('cf_state');if(s){var p=JSON.parse(s);state.usedTopics=p.u||[];state.prevProfile=p.p||null;}}catch(e){}}
function saveStorage(){try{localStorage.setItem('cf_state',JSON.stringify({u:state.usedTopics,p:state.prevProfile}));}catch(e){}}
function renderPills(){document.getElementById('pills').innerHTML=state.usedTopics.map(function(t,i){return '<span class="pill">'+t+'<button onclick="removeTopic('+i+')">x</button></span>';}).join('');}
function addTopic(){var inp=document.getElementById('topic-input');var v=inp.value.trim();if(v&&state.usedTopics.indexOf(v)===-1){state.usedTopics.push(v);saveStorage();renderPills();}inp.value='';}
function removeTopic(i){state.usedTopics.splice(i,1);saveStorage();renderPills();}
function callAPI(sys,user,maxTok,cb){
  var key=getKey();
  if(!key){cb(new Error('API Key nao configurada.'),null);return;}
  var body={model:MODEL,max_tokens:maxTok||8000};
  if(sys)body.system=sys;
  body.messages=[{role:'user',content:user}];
  var xhr=new XMLHttpRequest();
  xhr.open('POST','/api');
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.onload=function(){
    if(xhr.status>=200&&xhr.status<300){
      try{var d=JSON.parse(xhr.responseText);if(d.error){cb(new Error(d.error.message||JSON.stringify(d.error)),null);}else{cb(null,d.content&&d.content[0]?d.content[0].text:'');}}
      catch(e){cb(e,null);}
    }else{cb(new Error('HTTP '+xhr.status+': '+xhr.responseText.slice(0,200)),null);}
  };
  xhr.onerror=function(){cb(new Error('Erro de rede'),null);};
  xhr.send(JSON.stringify({key:key,payload:body}));
}
function appendLog(id,text,type){var el=document.getElementById(id);var ln=document.createElement('div');var icon=type==='ok'?'v':type==='run'?'>':type==='warn'?'!':type==='err'?'X':'-';ln.innerHTML='<span class="l'+(type||'run')+'" style="margin-right:8px">'+icon+'</span><span>'+text+'</span>';ln.style.display='flex';el.appendChild(ln);el.scrollTop=el.scrollHeight;}
function setSpinner(id,text){var el=document.getElementById(id);var ln=document.createElement('div');ln.id=id+'-sp';ln.style.display='flex';ln.style.gap='8px';ln.style.alignItems='center';ln.innerHTML='<span class="spinner"></span><span style="color:#aaa">'+text+'</span>';el.appendChild(ln);el.scrollTop=el.scrollHeight;}
function clearSpinner(id){var s=document.getElementById(id+'-sp');if(s)s.remove();}
function goPane(n){for(var i=1;i<=5;i++){document.getElementById('pane'+i).classList.toggle('active',i===n);document.getElementById('ps'+i).classList.toggle('active',i===n);}}
function markDone(n){document.getElementById('ps'+n).classList.add('done');}
function showManual(){state.manualMode=true;document.getElementById('suggest-area').style.display='none';document.getElementById('manual-area').style.display='block';document.getElementById('subtopic-choose').style.display='block';document.getElementById('p1-actions').style.display='flex';}
function startSuggest(){
  document.getElementById('btn-suggest').disabled=true;document.getElementById('btn-manual').disabled=true;
  document.getElementById('suggest-area').style.display='block';document.getElementById('manual-area').style.display='none';
  document.getElementById('subtopic-choose').style.display='none';document.getElementById('p1-actions').style.display='none';
  document.getElementById('themes-list').innerHTML='';state.manualMode=false;state.selectedTheme=null;
  var id='suggest-log';document.getElementById(id).innerHTML='';
  appendLog(id,'Chamando API...','run');setSpinner(id,'aguardando resposta...');
  var used=state.usedTopics.length?state.usedTopics.join(', '):'nenhum ainda';
  callAPI(null,PS.replace('{USED}',used),2000,function(err,result){
    clearSpinner(id);
    if(err){appendLog(id,'Erro: '+err.message,'err');document.getElementById('manual-fallback').style.display='block';showManual();}
    else{appendLog(id,'Sugestoes recebidas.','ok');renderThemes(result);}
    document.getElementById('btn-suggest').disabled=false;document.getElementById('btn-manual').disabled=false;
  });
}
function renderThemes(raw){
  var container=document.getElementById('themes-list');container.innerHTML='';
  var themes=[];var blocks=raw.split(/THEME \[?(\d)\]?:/).filter(Boolean);
  for(var i=0;i<blocks.length-1;i+=2){var num=blocks[i].trim();var body=blocks[i+1];var name=body.split('\n')[0].trim();var am=body.match(/ANGLE:\s*(.+)/);var hm=body.match(/HOOK:\s*(.+)/);themes.push({num:num,name:name,angle:am?am[1]:'',hook:hm?hm[1]:''});}
  if(!themes.length){var lines=raw.split('\n').filter(function(l){return l.trim();});for(var j=0;j<Math.min(5,lines.length);j++){themes.push({num:String(j+1),name:lines[j].replace(/^THEME \d+:?\s*/i,'').trim(),angle:'',hook:''}); }}
  themes.forEach(function(t){var card=document.createElement('div');card.className='theme-card';card.innerHTML='<div class="tc-title">'+t.num+'. '+t.name+'</div><div class="tc-meta">'+(t.angle?'Angulo: '+t.angle+'<br>':'')+(t.hook?'Hook: '+t.hook:'')+'</div>';card.onclick=function(){document.querySelectorAll('.theme-card').forEach(function(c){c.classList.remove('sel');});card.classList.add('sel');state.selectedTheme=t.name;document.getElementById('subtopic-choose').style.display='block';document.getElementById('p1-actions').style.display='flex';};container.appendChild(card);});
}
function confirmTheme(){
  var theme='';
  if(state.manualMode){theme=document.getElementById('manual-theme').value.trim();if(!theme){alert('Digite o tema.');return;}}
  else{if(!state.selectedTheme){alert('Selecione um tema.');return;}theme=state.selectedTheme;}
  state.selectedTheme=theme;state.numSub=parseInt(document.getElementById('num-sub').value)||7;
  markDone(1);goPane(2);runResearch();
}
function runResearch(){
  var id='research-log';document.getElementById(id).innerHTML='';document.getElementById('p2-actions').style.display='none';
  document.getElementById('p2-info').textContent='Tema: '+state.selectedTheme+' - '+state.numSub+' subtopicos';
  appendLog(id,'Pesquisando: '+state.selectedTheme,'run');setSpinner(id,'buscando fontes cientificas...');
  var prev=state.prevProfile||'N/A - first video';
  callAPI(null,PR.replace('{THEME}',state.selectedTheme).replace('{NSUB}',state.numSub).replace('{PREV}',prev),3000,function(err,res){
    clearSpinner(id);
    if(err){appendLog(id,'Erro: '+err.message,'err');return;}
    state.researchData=res;appendLog(id,'Pesquisa concluida.','ok');appendLog(id,'Montando brief...','run');setSpinner(id,'preenchendo template...');
    callAPI('Fill templates precisely. Output only the filled template.',PB.replace('{RESEARCH}',state.researchData).replace('{PREV}',prev),4000,function(err2,res2){
      clearSpinner(id);
      if(err2){appendLog(id,'Erro: '+err2.message,'err');return;}
      state.briefText=res2;appendLog(id,'Brief pronto.','ok');markDone(2);document.getElementById('p2-actions').style.display='block';document.getElementById('brief-edit').value=state.briefText;
    });
  });
}
function rerunResearch(){document.getElementById('brief-edit').value='';runResearch();}
function runScript(){
  state.briefText=document.getElementById('brief-edit').value;markDone(3);goPane(4);
  var id='script-log';document.getElementById(id).innerHTML='';document.getElementById('p4-actions').style.display='none';
  var sm=state.briefText.match(/total_scenes:\s*(\d+)/);var scenes=sm?sm[1]:'78';
  appendLog(id,'Gerando roteiro ('+scenes+' cenas - pode levar 1-2 min)...','run');setSpinner(id,'escrevendo cenas...');
  callAPI(P1,state.briefText,16000,function(err,res){
    clearSpinner(id);
    if(err){appendLog(id,'Erro: '+err.message,'err');return;}
    state.scriptText=res;
    var lines=res.split('\n').filter(function(l){return l.match(/^CENA \[?\d+\]?/);});
    appendLog(id,'Roteiro gerado: '+lines.length+' cenas.','ok');
    var vpm=res.match(/VARIATION PROFILE[\s\S]*?(?=\nCENA \[?0*1\]?)/);
    if(vpm){state.prevProfile=vpm[0].trim();saveStorage();}
    markDone(4);document.getElementById('p4-actions').style.display='flex';
  });
}
function startReview(){state.reviewAttempt=0;markDone(4);goPane(5);reviewLoop();}
function reviewLoop(){
  state.reviewAttempt++;var id='review-log';
  if(state.reviewAttempt===1)document.getElementById(id).innerHTML='';
  document.getElementById('p5-actions').style.display='none';document.getElementById('review-result-block').innerHTML='';
  appendLog(id,'Revisao monetizacao - tentativa '+state.reviewAttempt+'/'+state.MAX_REVIEW+'...','run');setSpinner(id,'analisando cenas...');
  callAPI(P3,'Review this script:\n\n'+state.scriptText,8000,function(err,res){
    clearSpinner(id);
    if(err){appendLog(id,'Erro: '+err.message,'err');return;}
    state.reviewText=res;
    var approved=res.indexOf('OVERALL VERDICT: Approved')>=0;
    var minor=res.indexOf('OVERALL VERDICT: Needs revision')>=0&&res.indexOf('SEVERITY: critical')<0&&res.indexOf('SEVERITY: high')<0;
    if(approved||(minor&&state.reviewAttempt>=2)){appendLog(id,'APROVADO.','ok');showReviewResult('pass');markDone(5);document.getElementById('p5-actions').style.display='block';}
    else if(state.reviewAttempt<state.MAX_REVIEW){
      var fm=res.match(/SCENES FLAGGED: (\d+)/);var fc=fm?fm[1]:'?';
      appendLog(id,fc+' issues - corrigindo...','warn');setSpinner(id,'aplicando correcoes...');
      callAPI(null,PF.replace('{REVIEW}',res).replace('{SCRIPT}',state.scriptText),16000,function(err2,res2){
        clearSpinner(id);
        if(err2){appendLog(id,'Erro: '+err2.message,'err');return;}
        state.scriptText=res2;appendLog(id,'Correcoes aplicadas.','run');reviewLoop();
      });
    }else{appendLog(id,'Revisao manual necessaria.','err');showReviewResult('manual');document.getElementById('p5-actions').style.display='block';}
  });
}
function showReviewResult(type){
  var el=document.getElementById('review-result-block');
  var lines=state.reviewText.split('\n');var si=-1;
  for(var i=0;i<lines.length;i++){if(lines[i].indexOf('TOTAL SCENES REVIEWED')>=0){si=i;break;}}
  var summary=si>=0?lines.slice(si).join('\n'):state.reviewText.slice(-600);
  el.innerHTML='<div class="verdict '+(type==='pass'?'vpass':'vcrit')+'">'+(type==='pass'?'Roteiro aprovado para producao.':'Revisao manual necessaria.')+'</div><div style="background:#1a1a1a;color:#e0e0e0;border-radius:8px;padding:1rem;font-size:12px;font-family:monospace;white-space:pre-wrap;line-height:1.6;max-height:260px;overflow-y:auto">'+summary+'</div>';
}
function extractNarracoes(s){var r=[];var blocks=s.split(/(?=CENA \[?\d+\]?)/);blocks.forEach(function(b){var m=b.match(/^CENA \[?(\d+)\]?/);if(!m)return;var n=String(m[1]).length<2?'0'+m[1]:m[1];var nm=b.match(/NARRACAO:\s*(.+?)(?:\s*\[chars:[^\]]+\])?(?:\n|$)/);if(nm)r.push('CENA '+n+'\nNARRACAO: '+nm[1].trim());});return r.join('\n\n');}
function extractPrompts(s){var r=[];var blocks=s.split(/(?=CENA \[?\d+\]?)/);blocks.forEach(function(b){var m=b.match(/^CENA \[?(\d+)\]?/);if(!m)return;var n=String(m[1]).length<2?'0'+m[1]:m[1];var pm=b.match(/PROMPT:\s*([\s\S]*?)(?=\nFOOTAGE:|\nDISCLOSURE:|\nEDITING_NOTES:|\nSOURCE:|\nCENA |$)/);if(pm)r.push('CENA '+n+'\nPROMPT: '+pm[1].replace(/\n/g,' ').replace(/\s+/g,' ').trim());});return r.join('\n\n');}
function triggerDL(content,filename){var blob=new Blob([content],{type:'text/plain;charset=utf-8'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(url);a.remove();},1000);}
function downloadFile(type){
  var ts=new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
  var slug=state.selectedTheme.replace(/[^a-zA-Z0-9]+/g,'_').slice(0,35).toLowerCase();
  var base='CF_'+ts+'_'+slug;
  if(type==='script'||type==='all')triggerDL(state.scriptText,base+'_01_script_completo.txt');
  if(type==='narracao'||type==='all')setTimeout(function(){triggerDL(extractNarracoes(state.scriptText),base+'_02_narracao.txt');},type==='all'?400:0);
  if(type==='prompts'||type==='all')setTimeout(function(){triggerDL(extractPrompts(state.scriptText),base+'_03_prompts_supergrok.txt');},type==='all'?800:0);
  document.getElementById('dl-confirm').style.display='block';setTimeout(function(){document.getElementById('dl-confirm').style.display='none';},3000);
  if(state.usedTopics.indexOf(state.selectedTheme)===-1){state.usedTopics.push(state.selectedTheme);saveStorage();}
}
function restartPipeline(){
  state.selectedTheme=null;state.researchData='';state.briefText='';state.scriptText='';state.reviewText='';state.reviewAttempt=0;state.manualMode=false;
  ['brief-edit','manual-theme'].forEach(function(id){document.getElementById(id).value='';});
  ['suggest-log','research-log','script-log','review-log'].forEach(function(id){document.getElementById(id).innerHTML='';});
  ['review-result-block','themes-list'].forEach(function(id){document.getElementById(id).innerHTML='';});
  ['suggest-area','manual-area','subtopic-choose','p1-actions','p4-actions','p5-actions','dl-confirm','manual-fallback'].forEach(function(id){document.getElementById(id).style.display='none';});
  document.getElementById('btn-suggest').disabled=false;document.getElementById('btn-manual').disabled=false;
  for(var i=1;i<=5;i++){document.getElementById('ps'+i).classList.remove('done','active');}
  document.getElementById('ps1').classList.add('active');goPane(1);renderPills();
}
var saved=localStorage.getItem('cf_apikey');if(saved)document.getElementById('apikey').value=saved;
loadStorage();renderPills();
</script>
</body>
</html>`;

http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(HTML);
    return;
  }
  if (req.method === 'POST' && req.url === '/api') {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var parsed = JSON.parse(body);
        var key = parsed.key;
        var payload = parsed.payload;
        var data = JSON.stringify(payload);
        var options = {
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          }
        };
        var proxy = https.request(options, function(r) {
          var resp = '';
          r.on('data', function(c) { resp += c; });
          r.on('end', function() {
            res.writeHead(r.statusCode, {'Content-Type': 'application/json'});
            res.end(resp);
          });
        });
        proxy.on('error', function(e) {
          res.writeHead(500);
          res.end(JSON.stringify({error: {message: e.message}}));
        });
        proxy.write(data);
        proxy.end();
      } catch(e) {
        res.writeHead(400);
        res.end(JSON.stringify({error: {message: e.message}}));
      }
    });
    return;
  }
  res.writeHead(404); res.end('Not found');
}).listen(PORT, function() { console.log('Cogni Fathom Agent rodando na porta ' + PORT); });

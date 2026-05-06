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
.div{border:none;border-top:1px solid #eee;margin:1.5rem 0}
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
  <div class="ps" id="ps5"><span class="sn">5</span>Revisão</div>
</div>

<div class="pane active" id="pane1">
  <div class="sec">
    <label>Temas já publicados</label>
    <div class="pills" id="pills"></div>
    <div style="display:flex;gap:8px">
      <input type="text" id="topic-input" placeholder="Ex: Social Media Psychological Traps" style="flex:1" onkeydown="if(event.key==='Enter')addTopic()" />
      <button class="btn btn-sm" onclick="addTopic()">+</button>
    </div>
  </div>
  <div class="div"></div>
  <div class="sec">
    <label>Como quer começar?</label>
    <div class="two" style="margin-top:8px">
      <button class="btn" id="btn-suggest" onclick="startSuggest()">&#9998; Sugerir 5 temas via API</button>
      <button class="btn" id="btn-manual" onclick="showManual()">&#9998; Digitar meu próprio tema</button>
    </div>
  </div>
  <div id="suggest-area" style="display:none">
    <div class="log" id="suggest-log"></div>
    <div id="themes-list"></div>
    <div id="manual-fallback" style="display:none"><div class="flag fwarn">Não foi possível gerar sugestões. Digite o tema manualmente.</div></div>
  </div>
  <div id="manual-area" style="display:none">
    <div class="sec">
      <label>Tema do vídeo</label>
      <input type="text" id="manual-theme" placeholder="Ex: Cognitive Dissonance and Self-Deception Mechanisms" />
    </div>
  </div>
  <div id="subtopic-choose" style="display:none;margin-top:16px">
    <div class="nirow">
      <label style="margin:0;white-space:nowrap">Número de subtópicos:</label>
      <input type="number" id="num-sub" min="5" max="10" value="7" style="width:70px" />
      <span style="font-size:11px;color:#888">entre 5 e 10</span>
    </div>
  </div>
  <div class="actions" id="p1-actions" style="display:none">
    <button class="btn btn-p" onclick="confirmTheme()">Confirmar tema e pesquisar &rarr;</button>
  </div>
</div>

<div class="pane" id="pane2">
  <div class="flag finfo" id="p2-info"></div>
  <div class="log" id="research-log"></div>
  <div id="p2-actions" style="display:none" class="actions">
    <button class="btn btn-p" onclick="goPane(3)">Ver e editar brief &rarr;</button>
    <button class="btn btn-sm" onclick="rerunResearch()">&#8635; Refazer pesquisa</button>
  </div>
</div>

<div class="pane" id="pane3">
  <div class="sec">
    <label>Brief gerado</label>
    <div class="sub">Revise e edite se necessário antes de gerar o roteiro.</div>
    <textarea id="brief-edit" rows="22" style="font-family:monospace;font-size:12px;line-height:1.6"></textarea>
  </div>
  <div class="actions">
    <button class="btn btn-p" onclick="runScript()">&#9654; Gerar roteiro</button>
    <button class="btn btn-sm" onclick="goPane(2)">&larr; Voltar</button>
  </div>
</div>

<div class="pane" id="pane4">
  <div class="log" id="script-log"></div>
  <div id="p4-actions" style="display:none" class="actions">
    <button class="btn btn-p" onclick="startReview()">&#10003; Rodar revisão de monetização</button>
    <button class="btn btn-sm" onclick="goPane(3)">&#9998; Editar brief</button>
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
        <button class="btn btn-p btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('script')">&#8595; Baixar</button>
      </div>
      <div class="dl-card">
        <div class="dl-title">Narrações</div>
        <div class="dl-sub">CENA + NARRACAO de cada cena</div>
        <button class="btn btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('narracao')">&#8595; Baixar</button>
      </div>
      <div class="dl-card">
        <div class="dl-title">Prompts SuperGrok</div>
        <div class="dl-sub">CENA + PROMPT em linha única</div>
        <button class="btn btn-sm" style="width:100%;justify-content:center" onclick="downloadFile('prompts')">&#8595; Baixar</button>
      </div>
    </div>
    <div class="actions" style="margin-top:12px">
      <button class="btn btn-sm" onclick="downloadFile('all')">&#8595; Baixar os 3 arquivos</button>
      <button class="btn btn-sm" onclick="restartPipeline()">&#8635; Novo vídeo</button>
    </div>
    <div id="dl-confirm" style="display:none;margin-top:10px" class="flag fok">Download iniciado.</div>
  </div>
</div>
</div>

<script>
const MODEL='claude-sonnet-4-20250514';
const PROMPT1=\`You are a senior scriptwriter for Cogni Fathom, a faceless YouTube psychology channel. US/UK English. Style: dark cinematic, direct, counterintuitive. Tone: calm, precise, slightly unsettling.

AUTHENTICITY MANDATE: Every script must execute the VARIATION PROFILE and include the PERSPECTIVE FRAME. Every claim must cite established research.

VIDEO SPECS: Scene count 65-90. ~10s per scene. List-style format. Opening 2-3 scenes. Closing 3 scenes, end abruptly.

VARIATION PROFILE dimensions: total_scenes, opening (hook_tension/cold_open/question_hook/stat_hook), ordering (ascending_intensity/thematic_clusters/chronological/reverse_surprise), palette (dark_cinematic/cold_clinical/warm_grain/monochrome_contrast/naturalistic_dim), arc (arc_3part/arc_4part/arc_5part).

MANDATORY HEADER before scene 01:
VARIATION PROFILE
  total_scenes: [n]
  opening: [value]
  ordering: [value]
  palette: [value]
  arc: [value]
  perspective_frame_position: [scene n]

NARRATIVE: First scene of each subtopic: "[Number word] [number]: [topic]. [Hook]." Final: "[Number word] [number] — the last one. [Hook]."
DRAMATIC PEAK: ascending_intensity=last item. reverse_surprise=penultimate.
PERSPECTIVE FRAME: ONE scene with authorial observation. Wider shot, longer hold, no text overlay. NARRACAO verbatim from brief.
WRITING: NARRACAO 130-150 chars including spaces. Second person. No CTA. SOURCE on first scene of each subtopic. Pace markers: [pause 0.4s] [slow] [emphasize: word].
POP-PSYCH FLAG: left-brain/right-brain, 10% brain, VAK, body language lie detection, 7-38-55 Mehrabian, Dunning-Kruger as stupid people, 21-day habit, subliminal mass control, Kubler-Ross fixed sequence.
SCENE FORMAT:
CENA [XX]
NARRACAO: [130-150 chars] [chars: XXX]
PROMPT: [single continuous line]
FOOTAGE: [AI_GEN|REAL_BROLL]
DISCLOSURE: [REQUIRES_DISCLOSURE|none]
EDITING_NOTES: [CapCut]
SOURCE: [Author, Work (Year) or none]
REAL_BROLL>=20%. No nudity, no minors, no graphic violence. INELIGIBLE: eating disorders, child abuse.
OUTPUT: 1)VARIATION PROFILE block 2)All scenes 3)DISCLOSURE SUMMARY block.\`;

const PROMPT3=\`YouTube monetization compliance specialist 2025-2026. Review Cogni Fathom scripts conservatively.
Check: VARIATION PROFILE present, PERSPECTIVE FRAME present, >=20% REAL_BROLL, SOURCE on every subtopic first scene, no graphic content, no minors, no eating disorders/child abuse, no pop-psych myths, NARRACAO 130-150 chars (excluding pace markers), AI disclosure complete.
Per flagged scene: CENA[XX] / ISSUE / SEVERITY[critical|high|medium|low] / REASON / SUGGESTION
End with summary including OVERALL VERDICT: [Approved|Needs revision|Reject]. Only flag issues.\`;

const PROMPT_SUGGEST=\`Content strategist for Cogni Fathom psychology YouTube channel. Topics used: {USED}
Generate exactly 5 themes. For each:
THEME [N]: [name]
ANGLE: [counterintuitive angle]
HOOK: [second person hook sentence]
SUBTOPICS: [3 with real authors and years]
SCENES: [65|70|78|84|90]
PALETTE: [palette value]\`;

const PROMPT_RESEARCH=\`Research psychology theme for YouTube: {THEME}
1. TITLE OPTIONS (3): "[N] adj noun That/Why/How verb self-part" number 5-10.
2. HOOK: second person, counterintuitive.
3. SUBTOPICS ({NSUB}): concept + Author Work (Year). Last: DRAMATIC PEAK.
4. PERSPECTIVE FRAME: 130-150 chars exactly.
5. VARIATION PROFILE with justification.
6. DIFFERENTIATOR NOTE. Previous: {PREV}\`;

const PROMPT_BRIEF=\`Fill Cogni Fathom Topic Brief. Output ONLY the filled template.
RESEARCH: {RESEARCH}
PREVIOUS: {PREV}
<titulo>[title]</titulo>
<numero_subtopicos>[n]</numero_subtopicos>
<hook>[hook]</hook>
<subtopicos>[list with SOURCE, last DRAMATIC PEAK]</subtopicos>
<variation_profile>
total_scenes: [v]
opening: [v]
ordering: [v]
palette: [v]
arc: [v]
</variation_profile>
<differentiator_note>Previous video used: [profile or N/A first video]
This video changes:
- [dim] [old]->[new] ([reason])
- [dim] [old]->[new] ([reason])
</differentiator_note>
<perspective_frame>[130-150 chars]</perspective_frame>
<perspective_frame_position>auto</perspective_frame_position>
<instrucao>Step 1: PRE-FLIGHT CHECK. Step 2: Generate full script per Prompt 1. Apply VARIATION PROFILE. PERSPECTIVE FRAME verbatim. >=20% REAL_BROLL. REQUIRES_DISCLOSURE on AI_GEN humans. SOURCE on subtopic first scenes. Step 3: Output VARIATION PROFILE header, all scenes, DISCLOSURE SUMMARY.</instrucao>\`;

const PROMPT_FIX=\`Fix ONLY NARRACAO char counts (130-150 chars, excluding pace markers). Use SUGGESTION from review when provided. Do NOT change other fields. Output COMPLETE script.
REVIEW: {REVIEW}
SCRIPT: {SCRIPT}\`;

let state={usedTopics:[],selectedTheme:null,numSub:7,manualMode:false,researchData:'',briefText:'',scriptText:'',reviewText:'',prevProfile:null,reviewAttempt:0,MAX_REVIEW:3};

function saveKey(){const k=document.getElementById('apikey').value.trim();if(k){localStorage.setItem('cf_apikey',k);document.getElementById('key-status').textContent='Salva!';setTimeout(()=>document.getElementById('key-status').textContent='',2000);}}
function getKey(){return localStorage.getItem('cf_apikey')||document.getElementById('apikey').value.trim();}
function loadStorage(){try{const s=localStorage.getItem('cf_state');if(s){const p=JSON.parse(s);state.usedTopics=p.u||[];state.prevProfile=p.p||null;}}catch(e){}}
function saveStorage(){try{localStorage.setItem('cf_state',JSON.stringify({u:state.usedTopics,p:state.prevProfile}));}catch(e){}}
function renderPills(){document.getElementById('pills').innerHTML=state.usedTopics.map((t,i)=>\`<span class="pill">\${t}<button onclick="removeTopic(\${i})">×</button></span>\`).join('');}
function addTopic(){const i=document.getElementById('topic-input');const v=i.value.trim();if(v&&!state.usedTopics.includes(v)){state.usedTopics.push(v);saveStorage();renderPills();}i.value='';}
function removeTopic(i){state.usedTopics.splice(i,1);saveStorage();renderPills();}

async function callAPI(sys,user,maxTok){
  const key=getKey();
  if(!key){throw new Error('API Key não configurada. Insira sua chave no campo acima.');}
  const body={model:MODEL,max_tokens:maxTok||8000};
  if(sys)body.system=sys;
  body.messages=[{role:'user',content:user}];
  const r=await fetch('/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,payload:body})});
  if(!r.ok){const t=await r.text();throw new Error('HTTP '+r.status+': '+t.slice(0,200));}
  const d=await r.json();
  if(d.error)throw new Error(d.error.message||JSON.stringify(d.error));
  return d.content&&d.content[0]?d.content[0].text:'';
}

function appendLog(id,text,type){const el=document.getElementById(id);const ln=document.createElement('div');const icon=type==='ok'?'✓':type==='run'?'›':type==='warn'?'⚠':type==='err'?'✗':'·';ln.innerHTML=\`<span class="l\${type||'run'}" style="margin-right:8px">\${icon}</span><span>\${text}</span>\`;ln.style.display='flex';el.appendChild(ln);el.scrollTop=el.scrollHeight;}
function setSpinner(id,text){const el=document.getElementById(id);const ln=document.createElement('div');ln.id=id+'-sp';ln.style.display='flex';ln.style.gap='8px';ln.style.alignItems='center';ln.innerHTML=\`<span class="spinner"></span><span style="color:#aaa">\${text}</span>\`;el.appendChild(ln);el.scrollTop=el.scrollHeight;}
function clearSpinner(id){const s=document.getElementById(id+'-sp');if(s)s.remove();}
function goPane(n){[1,2,3,4,5].forEach(i=>{document.getElementById('pane'+i).classList.toggle('active',i===n);document.getElementById('ps'+i).classList.toggle('active',i===n);});}
function markDone(n){document.getElementById('ps'+n).classList.add('done');}

function showManual(){state.manualMode=true;document.getElementById('suggest-area').style.display='none';document.getElementById('manual-area').style.display='block';document.getElementById('subtopic-choose').style.display='block';document.getElementById('p1-actions').style.display='flex';}

async function startSuggest(){
  document.getElementById('btn-suggest').disabled=true;document.getElementById('btn-manual').disabled=true;
  document.getElementById('suggest-area').style.display='block';document.getElementById('manual-area').style.display='none';
  document.getElementById('subtopic-choose').style.display='none';document.getElementById('p1-actions').style.display='none';
  document.getElementById('themes-list').innerHTML='';state.manualMode=false;state.selectedTheme=null;
  const id='suggest-log';document.getElementById(id).innerHTML='';
  appendLog(id,'Chamando API...','run');setSpinner(id,'aguardando resposta...');
  try{
    const used=state.usedTopics.length?state.usedTopics.join(', '):'nenhum ainda';
    const result=await callAPI(null,PROMPT_SUGGEST.replace('{USED}',used),2000);
    clearSpinner(id);appendLog(id,'Sugestões recebidas.','ok');renderThemes(result);
  }catch(e){clearSpinner(id);appendLog(id,'Erro: '+e.message,'err');document.getElementById('manual-fallback').style.display='block';showManual();}
  document.getElementById('btn-suggest').disabled=false;document.getElementById('btn-manual').disabled=false;
}

function renderThemes(raw){
  const container=document.getElementById('themes-list');container.innerHTML='';
  const themes=[];const blocks=raw.split(/THEME \\[?(\\d)\\]?:/).filter(Boolean);
  for(let i=0;i<blocks.length-1;i+=2){const num=blocks[i].trim();const body=blocks[i+1];const name=body.split('\\n')[0].trim();const angle=(body.match(/ANGLE:\\s*(.+)/)||[])[1]||'';const hook=(body.match(/HOOK:\\s*(.+)/)||[])[1]||'';themes.push({num,name,angle,hook});}
  if(!themes.length){raw.split('\\n').filter(l=>l.trim()).slice(0,5).forEach((l,i)=>{themes.push({num:String(i+1),name:l.replace(/^THEME \\d+:?\\s*/i,'').trim(),angle:'',hook:''});});}
  themes.forEach(t=>{const card=document.createElement('div');card.className='theme-card';card.innerHTML=\`<div class="tc-title">\${t.num}. \${t.name}</div><div class="tc-meta">\${t.angle?'<b>Ângulo:</b> '+t.angle+'<br>':''}\${t.hook?'<b>Hook:</b> '+t.hook:''}</div>\`;card.onclick=()=>{document.querySelectorAll('.theme-card').forEach(c=>c.classList.remove('sel'));card.classList.add('sel');state.selectedTheme=t.name;document.getElementById('subtopic-choose').style.display='block';document.getElementById('p1-actions').style.display='flex';};container.appendChild(card);});
}

function confirmTheme(){
  let theme='';
  if(state.manualMode){theme=document.getElementById('manual-theme').value.trim();if(!theme){alert('Digite o tema.');return;}}
  else{if(!state.selectedTheme){alert('Selecione um tema.');return;}theme=state.selectedTheme;}
  state.selectedTheme=theme;state.numSub=parseInt(document.getElementById('num-sub').value)||7;
  markDone(1);goPane(2);runResearch();
}

async function runResearch(){
  const id='research-log';document.getElementById(id).innerHTML='';document.getElementById('p2-actions').style.display='none';
  document.getElementById('p2-info').textContent='Tema: '+state.selectedTheme+' — '+state.numSub+' subtópicos';
  appendLog(id,'Pesquisando: '+state.selectedTheme,'run');setSpinner(id,'buscando fontes científicas...');
  try{
    const prev=state.prevProfile||'N/A — first video';
    state.researchData=await callAPI(null,PROMPT_RESEARCH.replace('{THEME}',state.selectedTheme).replace('{NSUB}',state.numSub).replace('{PREV}',prev),3000);
    clearSpinner(id);appendLog(id,'Pesquisa concluída.','ok');appendLog(id,'Montando brief...','run');setSpinner(id,'preenchendo template...');
    state.briefText=await callAPI('Fill templates precisely. Output only the filled template.',PROMPT_BRIEF.replace('{RESEARCH}',state.researchData).replace('{PREV}',prev),4000);
    clearSpinner(id);appendLog(id,'Brief pronto.','ok');markDone(2);document.getElementById('p2-actions').style.display='block';document.getElementById('brief-edit').value=state.briefText;
  }catch(e){clearSpinner(id);appendLog(id,'Erro: '+e.message,'err');}
}
async function rerunResearch(){document.getElementById('brief-edit').value='';await runResearch();}

async function runScript(){
  state.briefText=document.getElementById('brief-edit').value;markDone(3);goPane(4);
  const id='script-log';document.getElementById(id).innerHTML='';document.getElementById('p4-actions').style.display='none';
  const scenes=(state.briefText.match(/total_scenes:\\s*(\\d+)/)||['','78'])[1];
  appendLog(id,'Gerando roteiro ('+scenes+' cenas — pode levar 1-2 min)...','run');setSpinner(id,'escrevendo cenas...');
  try{
    state.scriptText=await callAPI(PROMPT1,state.briefText,16000);clearSpinner(id);
    const count=state.scriptText.split('\\n').filter(l=>l.match(/^CENA \\[?\\d+\\]?/)).length;
    appendLog(id,'Roteiro gerado: '+count+' cenas.','ok');
    const vp=state.scriptText.match(/VARIATION PROFILE[\\s\\S]*?(?=\\nCENA \\[?0*1\\]?)/);
    if(vp){state.prevProfile=vp[0].trim();saveStorage();}
    markDone(4);document.getElementById('p4-actions').style.display='flex';
  }catch(e){clearSpinner(id);appendLog(id,'Erro: '+e.message,'err');}
}

async function startReview(){state.reviewAttempt=0;markDone(4);goPane(5);await reviewLoop();}
async function reviewLoop(){
  state.reviewAttempt++;const id='review-log';
  if(state.reviewAttempt===1)document.getElementById(id).innerHTML='';
  document.getElementById('p5-actions').style.display='none';document.getElementById('review-result-block').innerHTML='';
  appendLog(id,'Revisão monetização — tentativa '+state.reviewAttempt+'/'+state.MAX_REVIEW+'...','run');setSpinner(id,'analisando cenas...');
  try{
    state.reviewText=await callAPI(PROMPT3,'Review this script:\\n\\n'+state.scriptText,8000);clearSpinner(id);
    const approved=state.reviewText.includes('OVERALL VERDICT: Approved');
    const minor=state.reviewText.includes('OVERALL VERDICT: Needs revision')&&!state.reviewText.includes('SEVERITY: critical')&&!state.reviewText.includes('SEVERITY: high');
    if(approved||(minor&&state.reviewAttempt>=2)){appendLog(id,'APROVADO.','ok');showReviewResult('pass');markDone(5);document.getElementById('p5-actions').style.display='block';}
    else if(state.reviewAttempt<state.MAX_REVIEW){
      const fc=(state.reviewText.match(/SCENES FLAGGED: (\\d+)/)||['','?'])[1];
      appendLog(id,fc+' issues — corrigindo...','warn');setSpinner(id,'aplicando correções...');
      state.scriptText=await callAPI(null,PROMPT_FIX.replace('{REVIEW}',state.reviewText).replace('{SCRIPT}',state.scriptText),16000);
      clearSpinner(id);appendLog(id,'Correções aplicadas.','run');await reviewLoop();
    }else{appendLog(id,'Revisão manual necessária.','err');showReviewResult('manual');document.getElementById('p5-actions').style.display='block';}
  }catch(e){clearSpinner(id);appendLog(id,'Erro: '+e.message,'err');}
}

function showReviewResult(type){
  const el=document.getElementById('review-result-block');
  const lines=state.reviewText.split('\\n');const si=lines.findIndex(l=>l.includes('TOTAL SCENES REVIEWED'));
  const summary=si>=0?lines.slice(si).join('\\n'):state.reviewText.slice(-600);
  el.innerHTML=\`<div class="verdict \${type==='pass'?'vpass':'vcrit'}">\${type==='pass'?'✓ Roteiro aprovado para produção.':'⚠ Revisão manual necessária.'}</div><div style="background:#1a1a1a;color:#e0e0e0;border-radius:8px;padding:1rem;font-size:12px;font-family:monospace;white-space:pre-wrap;line-height:1.6;max-height:260px;overflow-y:auto">\${summary}</div>\`;
}

function extractNarracoes(s){const r=[];s.split(/(?=CENA \\[?\\d+\\]?)/).forEach(b=>{const m=b.match(/^CENA \\[?(\\d+)\\]?/);if(!m)return;const n=String(m[1]).padStart(2,'0');const nm=b.match(/NARRACAO:\\s*(.+?)(?:\\s*\\[chars:[^\\]]+\\])?(?:\\n|$)/);if(nm)r.push('CENA '+n+'\\nNARRACAO: '+nm[1].trim());});return r.join('\\n\\n');}
function extractPrompts(s){const r=[];s.split(/(?=CENA \\[?\\d+\\]?)/).forEach(b=>{const m=b.match(/^CENA \\[?(\\d+)\\]?/);if(!m)return;const n=String(m[1]).padStart(2,'0');const pm=b.match(/PROMPT:\\s*([\\s\\S]*?)(?=\\nFOOTAGE:|\\nDISCLOSURE:|\\nEDITING_NOTES:|\\nSOURCE:|\\nCENA |$)/);if(pm)r.push('CENA '+n+'\\nPROMPT: '+pm[1].replace(/\\n/g,' ').replace(/\\s+/g,' ').trim());});return r.join('\\n\\n');}
function triggerDL(content,filename){const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);}
function downloadFile(type){
  const ts=new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
  const slug=state.selectedTheme.replace(/[^a-zA-Z0-9]+/g,'_').slice(0,35).toLowerCase();
  const base='CF_'+ts+'_'+slug;
  if(type==='script'||type==='all')triggerDL(state.scriptText,base+'_01_script_completo.txt');
  if(type==='narracao'||type==='all')setTimeout(()=>triggerDL(extractNarracoes(state.scriptText),base+'_02_narracao.txt'),type==='all'?400:0);
  if(type==='prompts'||type==='all')setTimeout(()=>triggerDL(extractPrompts(state.scriptText),base+'_03_prompts_supergrok.txt'),type==='all'?800:0);
  document.getElementById('dl-confirm').style.display='block';setTimeout(()=>document.getElementById('dl-confirm').style.display='none',3000);
  if(!state.usedTopics.includes(state.selectedTheme)){state.usedTopics.push(state.selectedTheme);saveStorage();}
}
function restartPipeline(){
  state.selectedTheme=null;state.researchData='';state.briefText='';state.scriptText='';state.reviewText='';state.reviewAttempt=0;state.manualMode=false;
  ['brief-edit','manual-theme'].forEach(id=>document.getElementById(id).value='');
  ['suggest-log','research-log','script-log','review-log'].forEach(id=>document.getElementById(id).innerHTML='');
  ['review-result-block','themes-list'].forEach(id=>document.getElementById(id).innerHTML='');
  ['suggest-area','manual-area','subtopic-choose','p1-actions','p4-actions','p5-actions','dl-confirm','manual-fallback'].forEach(id=>document.getElementById(id).style.display='none');
  document.getElementById('btn-suggest').disabled=false;document.getElementById('btn-manual').disabled=false;
  [1,2,3,4,5].forEach(i=>document.getElementById('ps'+i).classList.remove('done','active'));
  document.getElementById('ps1').classList.add('active');goPane(1);renderPills();
}

const saved=localStorage.getItem('cf_apikey');if(saved)document.getElementById('apikey').v

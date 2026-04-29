'use strict';
/* ─ Theme ─ */
const Theme={
  init(){const t=localStorage.getItem('ca-theme')||'dark';this.apply(t);document.getElementById('themeBtn')?.addEventListener('click',()=>this.toggle());},
  apply(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('ca-theme',t);const i=document.querySelector('#themeBtn i');if(i)i.className=t==='dark'?'fas fa-sun':'fas fa-moon';},
  toggle(){this.apply(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');}
};
/* ─ Sidebar ─ */
const Sidebar={col:false,init(){document.getElementById('sbToggle')?.addEventListener('click',()=>this.toggle());},toggle(){this.col=!this.col;document.getElementById('sb').classList.toggle('col',this.col);}};
/* ─ Router ─ */
const Router={cur:'overview',init(){document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>this.go(b.getAttribute('data-nav'))));this.go('overview');},
  go(id){
    this.cur=id;
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.getAttribute('data-nav')===id));
    const p=document.getElementById('p-'+id);if(p)p.classList.add('active');
    const lbl=document.querySelector(`[data-nav="${id}"] .ni-lbl`)?.textContent||id;
    const bc=document.getElementById('bc-cur');if(bc)bc.textContent=lbl;
    if(id==='overview')Dashboard.init();
    if(id==='discovery')Discovery.initPanel();
    if(id==='liftshift')LiftShift.init();
    if(id==='waveplan')WavePlan.init();
    if(id==='depmap')DepMap.init();
    if(id==='tco')TCO.init();
    if(id==='app-assessment')AppAssessment.init();
    if(id==='db-assessment')DBAssessment.init();
    if(id==='acr-assessment'){}
    if(id==='mod-waveplan')ModWavePlan.init();
    if(id==='portfolio')Portfolio.init();
    if(id==='sixr')SixR.init();
    if(id==='wavemigration')WaveMigration.init();
  }
};
/* ─ Toast ─ */
function toast(ico,t,s,dur=3500){const el=document.createElement('div');el.className='toast';el.innerHTML=`<span class="toast-ico">${ico}</span><div class="toast-msg"><strong>${t}</strong><span>${s||''}</span></div>`;document.body.appendChild(el);setTimeout(()=>el.remove(),dur);}
window.toast=toast;

/* ─ Dashboard ─ */
const Dashboard={ch:{},init(){setTimeout(()=>{this.tcoLine();this.sixrDnt();this.cloudBar();},120);},
  tcoLine(){const ctx=document.getElementById('ch-tco-line');if(!ctx||this.ch.tl)return;this.ch.tl=new Chart(ctx,{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{label:'On-Premises',data:[11400,11400,11400,11400,11400,11400,11400,11400,11400,11400,11400,11400],borderColor:'#4E6080',borderDash:[4,4],pointRadius:0,borderWidth:1.5,fill:false},{label:'Azure (Projected)',data:[11400,10800,9600,7800,6200,5200,4800,4700,4600,4500,4450,4380],borderColor:'#2D7EFF',backgroundColor:'rgba(45,126,255,0.07)',borderWidth:2,fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:'#2D7EFF'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},color:'#8A9FC0',boxWidth:12}}},scales:{x:{ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000).toFixed(1)+'K'},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  sixrDnt(){const ctx=document.getElementById('ch-sixr-dnt');if(!ctx||this.ch.sd)return;this.ch.sd=new Chart(ctx,{type:'doughnut',data:{labels:['Refactor','Rehost','Re-Arch','Rebuild','Replace','Retain'],datasets:[{data:[96,5,1,0,0,0],backgroundColor:['#059669','#2D7EFF','#DB2777','#7C3AED','#D97706','#0284C7'],borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{position:'right',labels:{font:{size:11},color:'#8A9FC0',boxWidth:10,padding:10}}}}});},
  cloudBar(){const ctx=document.getElementById('ch-cloud-bar');if(!ctx||this.ch.cb)return;this.ch.cb=new Chart(ctx,{type:'bar',data:{labels:['On-Prem','Azure','AWS','GCP'],datasets:[{data:[136800,52560,55200,50880],backgroundColor:['#4E6080','#2D7EFF','#F5A623','#22D86B'],borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000)+'K'},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#8A9FC0',font:{size:11}},grid:{display:false}}}}});}
};

/* ─ Discovery ─ */
const Discovery={sel:null,_ready:false,
  initPanel(){if(!this._ready)this._ready=true;},
  select(name,el){this.sel=name;document.querySelectorAll('.dt-card').forEach(c=>c.classList.remove('sel'));el.classList.add('sel');const btn=document.getElementById('disc-upload-btn');if(btn){btn.disabled=false;btn.textContent=name==='Custom Template'?'Download Template':'Upload '+name+' File';}},
  openUpload(){
    if(!this.sel){toast('⚠️','Select Tool','Please select a discovery tool first');return;}
    if(this.sel==='Custom Template'){toast('⬇️','Downloading Template','cloudatlas-inventory-template.xlsx');return;}
    document.getElementById('um-tool').textContent=this.sel;
    document.getElementById('upload-modal').classList.add('open');
  },
  closeUpload(){document.getElementById('upload-modal').classList.remove('open');},
  startScan(){
    this.closeUpload();
    document.getElementById('disc-tools').classList.add('hidden');
    document.getElementById('disc-scanning').classList.remove('hidden');
    const bar=document.getElementById('disc-bar'),lbl=document.getElementById('disc-lbl');
    const steps=['Connecting to '+this.sel+'...','Parsing workload data...','Scanning 221 assets...','Classifying workloads...','Building asset inventory...','Generating report...'];
    let pct=0,si=0;
    const iv=setInterval(()=>{pct=Math.min(pct+2,100);if(bar)bar.style.width=pct+'%';if(pct%17===0&&si<steps.length&&lbl)lbl.textContent=steps[si++];if(pct>=100){clearInterval(iv);setTimeout(()=>this.showResults(),500);}},60);
  },
  showResults(){
    document.getElementById('disc-scanning').classList.add('hidden');
    document.getElementById('disc-results').classList.remove('hidden');
    this.renderTable();
    toast('✅','Discovery Complete','221 assets discovered · Inventory ready');
  },
  renderTable(){
    const data=window._inv?.servers||[];const tbody=document.getElementById('disc-tbody');if(!tbody)return;
    if(!data.length){tbody.innerHTML='<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--t3)">Serve via: python3 -m http.server 8080</td></tr>';return;}
    tbody.innerHTML=data.map(s=>`<tr><td><b>${s.name}</b></td><td>${s.type}</td><td style="font-size:10.5px">${s.os}</td><td style="font-family:var(--mono)">${s.cores}C/${s.ram}GB</td><td style="font-family:var(--mono)">${s.disk}GB</td><td style="font-size:10.5px">${s.apps}</td><td><span class="bdg bb">${s.wave}</span></td><td><span class="bdg ${s.platform==='PaaS'?'bt':'bb'}">${s.platform}</span></td><td><span class="bdg ${s.complexity==='Low'?'bg':s.complexity==='Medium'?'ba':'br'}">${s.complexity}</span></td><td><span class="bdg ${s.ready==='Ready'?'bg':s.ready==='Review'?'ba':'br'}">${s.ready}</span></td></tr>`).join('');
  },
  reset(){this.sel=null;document.querySelectorAll('.dt-card').forEach(c=>c.classList.remove('sel'));const btn=document.getElementById('disc-upload-btn');if(btn){btn.disabled=true;btn.textContent='Select a tool above';}document.getElementById('disc-tools').classList.remove('hidden');document.getElementById('disc-scanning').classList.add('hidden');document.getElementById('disc-results').classList.add('hidden');}
};

/* ─ LiftShift ─ */
const LiftShift={ch:{},_done:false,
  wl:[
    {name:'APEX_HR_PORTAL',type:'Application',os:'RHEL 8.4',cpu:4,ram:'16 GB',disk:'240 GB',compat:98,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'ERP_BATCH_PROC',type:'Compute',os:'Oracle Linux 7.9',cpu:8,ram:'32 GB',disk:'500 GB',compat:95,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'INVENTORY_API',type:'Application',os:'RHEL 8.4',cpu:2,ram:'8 GB',disk:'120 GB',compat:92,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'PAYROLL_ENGINE',type:'Compute',os:'Windows 2019',cpu:8,ram:'64 GB',disk:'1.2 TB',compat:78,rec:'Replatform',eff:'Medium',st:'Review'},
    {name:'LEGACY_REPORTS',type:'Application',os:'Solaris 11',cpu:4,ram:'16 GB',disk:'800 GB',compat:45,rec:'Modernize',eff:'High',st:'Not Ready'},
    {name:'FILE_SERVER_01',type:'Storage',os:'Windows 2016',cpu:2,ram:'8 GB',disk:'4 TB',compat:88,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'WEBLOGIC_CLUSTER',type:'Application',os:'Oracle Linux 7.9',cpu:16,ram:'64 GB',disk:'320 GB',compat:72,rec:'Replatform',eff:'Medium',st:'Review'},
    {name:'MONITORING_SVC',type:'Application',os:'RHEL 8.4',cpu:2,ram:'4 GB',disk:'60 GB',compat:99,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'CONDC01',type:'Infra',os:'Win Server 2016',cpu:4,ram:'8 GB',disk:'100 GB',compat:97,rec:'Lift & Shift',eff:'Low',st:'Ready'},
    {name:'CONDB01',type:'Database',os:'Win Server 2016',cpu:16,ram:'128 GB',disk:'2 TB',compat:76,rec:'Replatform',eff:'Medium',st:'Review'},
    {name:'CONAPP02',type:'Application',os:'Linux RHEL 7',cpu:8,ram:'32 GB',disk:'400 GB',compat:55,rec:'Modernize',eff:'High',st:'Not Ready'},
    {name:'CONFILE01',type:'Storage',os:'Win Server 2012',cpu:4,ram:'16 GB',disk:'10 TB',compat:90,rec:'Lift & Shift',eff:'Low',st:'Ready'},
  ],
  init(){if(this._done)return;this._done=true;this.renderTbl('all');setTimeout(()=>this.renderChart(),120);},
  renderTbl(f){
    const tbody=document.getElementById('ls-tbody');if(!tbody)return;
    const rows=f==='all'?this.wl:this.wl.filter(w=>f==='ls'?w.rec==='Lift & Shift':f==='rp'?w.rec==='Replatform':w.rec==='Modernize');
    tbody.innerHTML=rows.map(w=>{
      const rc=w.rec==='Lift & Shift'?'ls-ls':w.rec==='Replatform'?'ls-rp':'ls-mod';
      const sc=w.st==='Ready'?'bg':w.st==='Review'?'ba':'br';
      const bc=w.compat>=85?'#22D86B':w.compat>=65?'#2D7EFF':w.compat>=50?'#F5A623':'#F04444';
      return`<tr><td><b style="font-family:var(--mono);font-size:11px">${w.name}</b></td><td style="color:var(--t3)">${w.type}</td><td style="font-size:10.5px">${w.os}</td><td style="font-family:var(--mono);color:${w.cpu>=16?'var(--amber)':'var(--t2)'}">${w.cpu}</td><td style="font-family:var(--mono)">${w.ram}</td><td style="font-family:var(--mono)">${w.disk}</td><td><div style="display:flex;align-items:center;gap:6px"><div style="width:60px;height:5px;background:var(--bg4);border-radius:3px;overflow:hidden"><div style="height:100%;width:${w.compat}%;background:${bc};border-radius:3px"></div></div><span style="font-family:var(--mono);font-weight:700;color:${bc};font-size:11px">${w.compat}%</span></div></td><td><span class="${rc}">${w.rec}</span></td><td><span class="bdg ${w.eff==='Low'?'bg':w.eff==='Medium'?'ba':'br'}">${w.eff}</span></td><td><span class="bdg ${sc}">${w.st==='Ready'?'✅':w.st==='Review'?'⚠️':'⊘'} ${w.st}</span></td></tr>`;
    }).join('');
  },
  renderChart(){const ctx=document.getElementById('ch-ls-compat');if(!ctx||this.ch.c)return;this.ch.c=new Chart(ctx,{type:'bar',data:{labels:['0–20%','21–40%','41–60%','61–80%','81–90%','91–100%'],datasets:[{data:[0,0,2,3,4,3],backgroundColor:['#F04444','#F04444','#F5A623','#2D7EFF','#2D7EFF','#22D86B'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8A9FC0',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10},stepSize:1},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  filter(f){document.querySelectorAll('.flt-btn').forEach(b=>b.classList.remove('on'));document.querySelector(`.flt-btn[data-f="${f}"]`)?.classList.add('on');this.renderTbl(f);}
};

/* ─ Wave Plan ─ */
const WavePlan={ch:{},_done:false,
  init(){if(this._done)return;this._done=true;setTimeout(()=>{this.sixrBar();this.sixrComp();},120);},
  sixrBar(){const ctx=document.getElementById('ch-wp-sixr');if(!ctx||this.ch.s)return;this.ch.s=new Chart(ctx,{type:'bar',data:{labels:['Rehost','Refactor','Re-Arch','Replace','Retain','Retire'],datasets:[{label:'VMs',data:[201,9,9,2,0,0],backgroundColor:['#22D86B','#F5A623','#F5A623','#F97316','#4E6080','#4E6080'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8A9FC0',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  sixrComp(){const ctx=document.getElementById('ch-wp-comp');if(!ctx||this.ch.c)return;this.ch.c=new Chart(ctx,{type:'bar',data:{labels:['Rehost','Refactor','Re-Arch/Rebuild','Replace','Retain','Retire'],datasets:[{label:'VMs',data:[201,9,9,2,0,0],backgroundColor:['#22D86B','#F5A623','#F5A623','#F97316','#4E6080','#4E6080'],borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8A9FC0',font:{size:9.5}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  wavesGroupsChart(){const ctx=document.getElementById('ch-wp-wg');if(!ctx||this.ch.wg)return;this.ch.wg=new Chart(ctx,{type:'pie',data:{labels:['Wave 1 Groups','Wave 2 Groups','Wave 3 Groups','Wave 4 Groups'],datasets:[{data:[3,3,3,3],backgroundColor:['#2D7EFF','#00C8D4','#22D86B','#F5A623'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},color:'#8A9FC0',boxWidth:8}}}}});}
};

/* ─ Dependency Map ─ */
const DepMap={_done:false,_svg:false,
  deps:[
    {src:'HR_EMPLOYEE_FORM',tgt:'HR_DB',type:'Database',proto:'OCI/TNS',crit:'High',lat:'2ms',wave:'Wave 2',grp:'Group 1'},
    {src:'HR_EMPLOYEE_FORM',tgt:'AUTH_SERVICE',type:'API',proto:'REST',crit:'High',lat:'15ms',wave:'Wave 2',grp:'Group 1'},
    {src:'FIN_GL_ENTRY',tgt:'FINANCE_DB',type:'Database',proto:'OCI/TNS',crit:'Critical',lat:'1ms',wave:'Wave 3',grp:'Group 2'},
    {src:'FIN_GL_ENTRY',tgt:'REPORTING_SVC',type:'Service',proto:'SOAP',crit:'Medium',lat:'45ms',wave:'Wave 3',grp:'Group 2'},
    {src:'FIN_GL_ENTRY',tgt:'AUDIT_LOG_DB',type:'Database',proto:'JDBC',crit:'High',lat:'3ms',wave:'Wave 3',grp:'Group 2'},
    {src:'INV_STOCK_MGMT',tgt:'INVENTORY_DB',type:'Database',proto:'OCI/TNS',crit:'High',lat:'2ms',wave:'Wave 2',grp:'Group 3'},
    {src:'INV_STOCK_MGMT',tgt:'WAREHOUSE_API',type:'API',proto:'REST',crit:'Medium',lat:'120ms',wave:'Wave 2',grp:'Group 3'},
    {src:'PO_PURCHASE_ORDER',tgt:'PROCUREMENT_DB',type:'Database',proto:'OCI/TNS',crit:'Critical',lat:'1ms',wave:'Wave 1',grp:'Group 1'},
    {src:'PO_PURCHASE_ORDER',tgt:'VENDOR_PORTAL',type:'External',proto:'SFTP',crit:'Medium',lat:'500ms',wave:'Wave 1',grp:'Group 1'},
    {src:'PAYROLL_ENGINE',tgt:'HR_DB',type:'Database',proto:'DB Link',crit:'Critical',lat:'3ms',wave:'Wave 4',grp:'Group 1'},
    {src:'PAYROLL_ENGINE',tgt:'TAX_SERVICE',type:'External',proto:'REST',crit:'High',lat:'200ms',wave:'Wave 4',grp:'Group 1'},
    {src:'PAYROLL_ENGINE',tgt:'BANK_GATEWAY',type:'External',proto:'SFTP',crit:'Critical',lat:'800ms',wave:'Wave 4',grp:'Group 1'},
  ],
  conflicts:[
    {t:'Circular dependency between HR_DB and PAYROLL_ENGINE',i:'Migration ordering constraint',r:'Migrate together in same wave',sev:'High'},
    {t:'VENDOR_PORTAL SFTP requires static IP whitelisting',i:'Network config needed pre-migration',r:'Pre-provision cloud static IPs',sev:'Medium'},
    {t:'DB Links between FINANCE_DB and AUDIT_LOG_DB',i:'Cross-database references break on split migration',r:'Replace with API calls post-migration',sev:'High'},
    {t:'TAX_SERVICE has IP-based auth',i:'Auth fails from new cloud IPs',r:'Coordinate with vendor for IP update',sev:'Medium'},
  ],
  srvDeps:[
    {srv:'aadcsrv1',conn:2,wl:'Oracle, Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'High',wc:'Medium',wave:'Wave 4',grp:'Group 1'},
    {srv:'AINS-Airwave',conn:0,wl:'',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'Low',wc:'Medium',wave:'Wave 1',grp:'Group 1'},
    {srv:'ainsmigvm',conn:0,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'Low',wc:'Medium',wave:'Wave 1',grp:'Group 1'},
    {srv:'aksahu',conn:2,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'High',wc:'High',wave:'Wave 4',grp:'Group 1'},
    {srv:'aovtre1',conn:3,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'High',wc:'Medium',wave:'Wave 4',grp:'Group 1'},
    {srv:'aovtre2',conn:3,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'Low',wc:'Medium',wave:'Wave 2',grp:'Group 2'},
    {srv:'aovtre3',conn:3,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'Low',wc:'High',wave:'Wave 2',grp:'Group 2'},
    {srv:'AutoPilotConn',conn:2,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'Low',wc:'High',wave:'Wave 2',grp:'Group 3'},
    {srv:'AW2Proxy',conn:0,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'High',wc:'Medium',wave:'Wave 3',grp:'Group 1'},
    {srv:'BACKUPHDC1',conn:0,wl:'Custom Web Apps',approach:'Rehost',ready:'Ready',plat:'IaaS',infra:'High',wc:'High',wave:'Wave 3',grp:'Group 1'},
  ],
  init(){if(this._done)return;this._done=true;this.renderDepTbl();this.renderConflicts();this.renderSrvTbl();setTimeout(()=>this.drawSVG(),100);},
  renderDepTbl(){
    const tb=document.getElementById('dep-tbody');if(!tb)return;
    tb.innerHTML=this.deps.map(d=>{
      const tc={Database:'bp',API:'bb',Service:'bgr',External:'ba'}[d.type]||'bgr';
      const cs=d.crit==='Critical'?'color:var(--red);font-weight:700':d.crit==='High'?'color:var(--amber);font-weight:700':'color:var(--t3)';
      return`<tr><td><b style="font-family:var(--mono);font-size:11px">${d.src}</b></td><td style="font-family:var(--mono);font-size:11px">${d.tgt}</td><td><span class="bdg ${tc}">${d.type}</span></td><td style="font-family:var(--mono);font-size:10.5px">${d.proto}</td><td><span style="${cs}">${d.crit}</span></td><td style="font-family:var(--mono);color:var(--t3)">${d.lat}</td><td><span class="bdg bb">${d.wave}</span></td><td><span class="bdg bgr">${d.grp}</span></td></tr>`;
    }).join('');
  },
  renderConflicts(){
    ['dep-conflicts','dep-conflicts2'].forEach(id=>{
      const c=document.getElementById(id);if(!c)return;
      c.innerHTML=this.conflicts.map(d=>`<div class="dep-ci"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div class="dep-cit">${d.t}</div><div class="dep-cii">Impact: ${d.i}</div><div class="dep-cir">Resolution: <span style="color:var(--blue)">${d.r}</span></div></div><span class="bdg ${d.sev==='High'?'br':'ba'}" style="flex-shrink:0">${d.sev}</span></div></div>`).join('');
    });
  },
  renderSrvTbl(){
    const tb=document.getElementById('srv-dep-tbody');if(!tb)return;
    tb.innerHTML=this.srvDeps.map(s=>{
      const ic=s.infra==='High'?'br':s.infra==='Medium'?'ba':'bg';
      const wc=s.wc==='High'?'br':s.wc==='Medium'?'ba':'bg';
      return`<tr><td><b>${s.srv}</b></td><td style="font-family:var(--mono)">${s.conn}</td><td style="font-size:10.5px;color:var(--t3)">${s.wl||'—'}</td><td><span class="bdg bg">${s.approach}</span></td><td><span class="bdg bg">${s.ready}</span></td><td>${s.plat}</td><td><span class="bdg ${ic}">${s.infra}</span></td><td><span class="bdg ${wc}">${s.wc}</span></td><td><span class="bdg bb">${s.wave}</span></td><td><span class="bdg bgr">${s.grp}</span></td></tr>`;
    }).join('');
  },
  drawSVG(){
    const svg=document.getElementById('dep-svg');if(!svg||this._svg)return;this._svg=true;
    const W=svg.clientWidth||680,H=300;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const apps=['HR_EMPLOYEE_FORM','FIN_GL_ENTRY','INV_STOCK_MGMT','PO_PURCHASE_ORDER','PAYROLL_ENGINE'];
    const dbs=['HR_DB','FINANCE_DB','INVENTORY_DB','PROCUREMENT_DB','AUDIT_LOG_DB'];
    const exts=['AUTH_SERVICE','WAREHOUSE_API','VENDOR_PORTAL','TAX_SERVICE','BANK_GATEWAY'];
    const nW=150,nH=32,gap=11,c1=nW/2+8,c2=W/2,c3=W-nW/2-8;
    const isDark=document.documentElement.getAttribute('data-theme')==='dark';
    const nb=isDark?'#1B2D45':'#EEF4FF',nt=isDark?'#8A9FC0':'#334155';
    const pos={};
    const place=(ns,cx,bc)=>{const th=ns.length*(nH+gap)-gap,ys=(H-th)/2;ns.forEach((n,i)=>{const y=ys+i*(nH+gap),x=cx-nW/2;pos[n]={x:cx,y:y+nH/2};const r=document.createElementNS('http://www.w3.org/2000/svg','rect');r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',nW);r.setAttribute('height',nH);r.setAttribute('rx','6');r.setAttribute('fill',nb);r.setAttribute('stroke',bc);r.setAttribute('stroke-width','1.2');svg.appendChild(r);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',y+nH/2+4);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','9.5');t.setAttribute('font-family','DM Mono,monospace');t.setAttribute('fill',nt);t.textContent=n;svg.appendChild(t);});};
    place(apps,c1,'#2D7EFF');place(dbs,c2,'#8B5CF6');place(exts,c3,'#F5A623');
    this.deps.forEach(d=>{const f=pos[d.src],to=pos[d.tgt];if(!f||!to)return;const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',f.x+nW/2);l.setAttribute('y1',f.y);l.setAttribute('x2',to.x-nW/2);l.setAttribute('y2',to.y);l.setAttribute('stroke',d.crit==='Critical'?'rgba(240,68,68,0.4)':'rgba(45,126,255,0.18)');l.setAttribute('stroke-width',d.crit==='Critical'?'2':'1');svg.insertBefore(l,svg.firstChild);});
    [{x:c1,l:'APPLICATIONS'},{x:c2,l:'DATABASES'},{x:c3,l:'EXTERNAL'}].forEach(({x,l})=>{const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',x);t.setAttribute('y',H-6);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','9');t.setAttribute('font-weight','700');t.setAttribute('font-family','Plus Jakarta Sans,sans-serif');t.setAttribute('fill',isDark?'#4E6080':'#9CA3AF');t.setAttribute('letter-spacing','0.08em');t.textContent=l;svg.appendChild(t);});
  }
};

/* ─ TCO ─ */
const TCO={ch:{},init(){setTimeout(()=>{this.det();this.sav();this.opts();},120);},
  det(){const ctx=document.getElementById('ch-tco-det');if(!ctx||this.ch.d)return;this.ch.d=new Chart(ctx,{type:'bar',data:{labels:['Compute','Storage','Network','Licensing','Support','Personnel'],datasets:[{label:'On-Premises',data:[42000,18000,8000,28000,12000,28800],backgroundColor:'#4E6080',borderRadius:4},{label:'Azure',data:[16000,6000,4000,8000,4000,14000],backgroundColor:'#2D7EFF',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},color:'#8A9FC0',boxWidth:10}}},spaces:{x:{ticks:{color:'#4E6080',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000)+'K'},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  sav(){const ctx=document.getElementById('ch-tco-sav');if(!ctx||this.ch.s)return;this.ch.s=new Chart(ctx,{type:'bar',data:{labels:['Year 1','Year 2','Year 3'],datasets:[{label:'Savings',data:[84240,168480,253440],backgroundColor:['rgba(45,126,255,.5)','rgba(45,126,255,.7)','#2D7EFF'],borderRadius:8}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#4E6080',font:{size:11}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000)+'K'},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  opts(){const ctx=document.getElementById('ch-tco-opts');if(!ctx||this.ch.o)return;this.ch.o=new Chart(ctx,{type:'bar',data:{labels:['PAYG','1yr RI','3yr RI','1yr SP','3yr SP'],datasets:[{label:'Annual Cost',data:[52560,42000,36800,39000,33000],backgroundColor:['#4E6080','#2D7EFF','#22D86B','#00C8D4','#8B5CF6'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#4E6080',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000)+'K'},grid:{color:'rgba(255,255,255,0.04)'}}}}});}
};

/* ─ Portfolio ─ */
const Portfolio={ch:{},_done:false,
  init(){if(this._done)return;this._done=true;setTimeout(()=>{this.dbDnt();this.appDnt();},120);},
  dbDnt(){const ctx=document.getElementById('ch-port-db');if(!ctx||this.ch.db)return;this.ch.db=new Chart(ctx,{type:'doughnut',data:{labels:['SQL Server','Oracle','MySQL','PostgreSQL','MariaDB','MongoDB'],datasets:[{data:[7,14,1,1,3,9],backgroundColor:['#2D7EFF','#F5A623','#22D86B','#00C8D4','#8B5CF6','#EC4899'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'right',labels:{font:{size:10},color:'#8A9FC0',boxWidth:8,padding:8}}}}});},
  appDnt(){const ctx=document.getElementById('ch-port-app');if(!ctx||this.ch.app)return;this.ch.app=new Chart(ctx,{type:'doughnut',data:{labels:['.Net','Java','PHP','Python','NodeJS'],datasets:[{data:[77,17,2,2,0],backgroundColor:['#2D7EFF','#F5A623','#22D86B','#EC4899','#8B5CF6'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'right',labels:{font:{size:10},color:'#8A9FC0',boxWidth:8,padding:8}}}}});}
};

/* ─ 6R ─ */
const SixR={_done:false,init(){if(this._done)return;this._done=true;}};

/* ─ Wave Migration ─ */
const WaveMigration={running:false,_done:false,
  init(){},
  start(){
    if(this.running)return;this.running=true;
    const nodes=document.querySelectorAll('.wv-node'),clouds=document.querySelectorAll('.cloud-n'),lbl=document.getElementById('mig-status'),btn=document.getElementById('btn-mig-start');
    const names=['CONDC01','CONFILE01','CONAPP01','CONAPP02','CONDB01','CONBIZ01','CONWEB01','CONMAIL01'];
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Migrating...';}
    let i=0;const iv=setInterval(()=>{
      if(i>0)nodes[i-1]?.classList.replace('migrating','done');
      if(i<nodes.length){nodes[i]?.classList.add('migrating');if(lbl)lbl.textContent=`🌊 Migrating ${names[i]}...`;i++;}
      else{clearInterval(iv);clouds.forEach(c=>c.classList.add('lit'));if(lbl)lbl.textContent='✅ All workloads migrated successfully!';toast('☁️','Migration Complete','8 servers migrated · 0 errors');if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-redo"></i> Reset';btn.onclick=()=>WaveMigration.reset();}}
    },800);
  },
  reset(){this.running=false;document.querySelectorAll('.wv-node').forEach(n=>n.classList.remove('migrating','done'));document.querySelectorAll('.cloud-n').forEach(n=>n.classList.remove('lit'));const s=document.getElementById('mig-status');if(s)s.textContent='Ready to start migration';const b=document.getElementById('btn-mig-start');if(b){b.disabled=false;b.innerHTML='<i class="fas fa-rocket"></i> Start Migration';b.onclick=()=>WaveMigration.start();}}
};

/* ─ AI Agent ─ */
const Agent={
  flows:{
    discovery:{trig:['discover','upload','scan','inventory','asset','tool','data'],intro:"I'll guide you through <strong>Data Discovery</strong>. Select your tool and upload its output to generate a full inventory report.",steps:[{l:'Connecting to tool...',ico:'🔍',d:1800},{l:'Parsing workload data...',ico:'📄',d:2000},{l:'Classifying 221 assets...',ico:'⚙️',d:1800},{l:'Building asset inventory...',ico:'📋',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Discovery Complete!</strong><br><br>221 assets discovered · 10 servers in demo dataset<br><br>Navigate to <strong>Data Discovery</strong> to view the full inventory or proceed to <strong>Lift &amp; Shift</strong> assessment.`,nav:'discovery'},
    liftshift:{trig:['lift','shift','rehost','direct migration','compat'],intro:"Running <strong>IaaS Lift &amp; Shift AI Analysis</strong> across all workloads.",steps:[{l:'Scanning workload specs...',ico:'🖥️',d:1800},{l:'Evaluating OS compatibility...',ico:'🔎',d:2000},{l:'Scoring cloud readiness...',ico:'📊',d:1800},{l:'Generating recommendations...',ico:'🎯',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>L&S Assessment Done!</strong><br><br>48 workloads · <strong>28 L&S Ready (58%)</strong><br>Replatform: 12 · Modernize: 8<br><br>Top candidates: APEX_HR (98%), MONITORING_SVC (99%)<br><br>Opening <strong>Lift &amp; Shift</strong>...`,nav:'liftshift'},
    waveplan:{trig:['wave','plan','group','batch'],intro:"Generating <strong>AI-Assisted Wave Plan</strong> for your environment.",steps:[{l:'Analyzing dependencies...',ico:'🕸️',d:2000},{l:'Scoring complexity...',ico:'⚖️',d:1800},{l:'Grouping workloads...',ico:'🌊',d:2000},{l:'Creating wave plan...',ico:'📋',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Wave Plan Ready!</strong><br><br>4 Waves · 12 Groups · 201 Servers<br>Rehost: 201 · Refactor: 9 · Re-Arch: 9<br><br>Opening <strong>Wave Plan</strong>...`,nav:'waveplan'},
    depmap:{trig:['depend','topology','connect','conflict','circular','graph'],intro:"Analyzing <strong>Infrastructure Dependencies</strong> with conflict detection.",steps:[{l:'Tracing connections...',ico:'🕸️',d:2000},{l:'Mapping DB links...',ico:'🗄️',d:2000},{l:'Detecting conflicts...',ico:'⚠️',d:1800},{l:'Building topology...',ico:'🗺️',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Dependency Map Complete!</strong><br><br>156 connections · 4 conflicts · 7 orphaned<br>⚠️ Circular: HR_DB ↔ PAYROLL_ENGINE<br><br>Opening <strong>Dependency Map</strong>...`,nav:'depmap'},
    tco:{trig:['tco','total cost','pricing','saving','cost'],intro:"Running <strong>TCO Analysis</strong> across cloud providers.",steps:[{l:'Calculating compute costs...',ico:'💻',d:1800},{l:'Storage & network...',ico:'💾',d:1800},{l:'3-year projections...',ico:'📈',d:1800},{l:'Generating TCO report...',ico:'📊',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>TCO Report Ready!</strong><br><br>On-Prem: $136,800/yr → Azure: $52,560/yr<br>3-Year Savings: <strong>$253,440 (61.6% ROI)</strong><br><br>Opening <strong>TCO Analysis</strong>...`,nav:'tco'},
    portfolio:{trig:['portfolio','app assess','db assess','assessment portfolio'],intro:"Running <strong>App &amp; DB Assessment Portfolio</strong> analysis.",steps:[{l:'Assessing app targets...',ico:'💻',d:2000},{l:'Analyzing DB migration...',ico:'🗄️',d:2000},{l:'Costing deployment targets...',ico:'💰',d:1800},{l:'Building portfolio...',ico:'📊',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Portfolio Assessment Done!</strong><br><br>95 assessments · 35 Databases · 98 Applications<br>45 apps need config changes<br><br>Opening <strong>App &amp; DB Portfolio</strong>...`,nav:'portfolio'},
    appAssessment:{trig:['application assessment','app overview','app portfolio','application portfolio'],intro:"Running <strong>Application Portfolio Assessment</strong>.",steps:[{l:'Scanning application estate...',ico:'📦',d:1800},{l:'Scoring migration readiness...',ico:'📊',d:1800},{l:'Mapping target platforms...',ico:'🎯',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Application Assessment Ready!</strong><br><br>98 apps assessed · App Service 95 · VM 121 · Container 121<br>Total Cost: $201,916.91 · 7942 hours effort<br><br>Opening <strong>Application Assessment</strong>...`,nav:'app-assessment'},
    dbAssessment:{trig:['database assessment','db overview','db portfolio','database portfolio'],intro:"Running <strong>Database Portfolio Assessment</strong>.",steps:[{l:'Extracting DB schemas...',ico:'🗄️',d:2000},{l:'Analyzing migration blockers...',ico:'⚠️',d:1800},{l:'Costing Azure SQL targets...',ico:'💰',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Database Assessment Ready!</strong><br><br>7 databases · SQL MI: €1,625 · vCore: €3,976 · VM: €2,043<br>3 target to SQL MI · 4 to SQL VM<br><br>Opening <strong>Database Assessment</strong>...`,nav:'db-assessment'},
    acrAssessment:{trig:['acr','azure cost recommendation','cost report','pricing report'],intro:"Generating <strong>ACR Assessment Report</strong>.",steps:[{l:'Fetching Azure pricing...',ico:'💰',d:1800},{l:'Comparing RI vs PayG...',ico:'📊',d:1800},{l:'Calculating AHB savings...',ico:'💡',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>ACR Assessment Ready!</strong><br><br>App Service: Best 3Yr RI+AHB = €5,863.82/mo<br>VM: Best 3Yr RI+AHB = €7,215.89/mo<br>Container: Best 3Yr RI+AHB = €5,975.94/mo<br><br>Opening <strong>ACR Assessment</strong>...`,nav:'acr-assessment'},
    modWavePlan:{trig:['modernization wave','mod wave','modernize wave','app wave plan'],intro:"Building <strong>Modernization Wave Plan</strong> for apps and databases.",steps:[{l:'Classifying app complexity...',ico:'⚖️',d:1800},{l:'Grouping by dependency...',ico:'🕸️',d:1800},{l:'Assigning waves...',ico:'🌊',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Modernization Wave Plan Ready!</strong><br><br>1 Migration Wave · 1 Group · 1 Application<br>Open <strong>Modernization Wave Plan</strong> to view details.`,nav:'mod-waveplan'},
    sixr:{trig:['6r','six r','refactor','moderniz','modernization'],intro:"Running <strong>6R Analysis</strong> for Apps and Databases.",steps:[{l:'Detecting tech stacks...',ico:'💻',d:2000},{l:'Static code analysis...',ico:'🔎',d:2200},{l:'6R classification...',ico:'🔄',d:1800},{l:'Building analysis...',ico:'📊',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>6R Analysis Done!</strong><br><br>Apps: Refactor 96 · Rehost 5 · Re-Arch 1<br>DBs: Rehost 10 · Rebuild 14 · Refactor 8<br><br>Opening <strong>6R Analysis</strong>...`,nav:'sixr'},
    migration:{trig:['migrat','execute','run migration','deploy'],intro:"Launching <strong>Migration Execution</strong> wave-based deployment.",steps:[{l:'Validating wave plan...',ico:'✅',d:1800},{l:'Pre-flight checks...',ico:'🔧',d:2000},{l:'Configuring landing zones...',ico:'🏗️',d:1800},{l:'Ready to execute...',ico:'🚀',d:1000},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Ready for Migration!</strong><br><br>4 waves staged · 12 groups configured<br>Download the Migration tool to execute<br><br>Opening <strong>Wave Migration</strong>...`,nav:'wavemigration'},
    security:{trig:['secur','compli','gdpr','soc2','cyber','e5','e7','sovereign'],intro:"Reviewing <strong>Post-Migration Security Solutions</strong>.",steps:[{l:'Assessing security posture...',ico:'🔒',d:1800},{l:'Compliance gap analysis...',ico:'📋',d:1800},{l:'Solution matching...',ico:'🎯',d:1500},{l:'Complete!',ico:'✅',d:400}],result:`<strong>Security Assessment Complete!</strong><br><br>Score: 86/100 · SOC2: 92% · GDPR: 65%<br><br>Opening <strong>Security &amp; Compliance</strong>...`,nav:'security'},
  },
  busy:false,
  init(){
    document.getElementById('agent-open')?.addEventListener('click',()=>this.open());
    document.getElementById('agent-close')?.addEventListener('click',()=>this.close());
    document.getElementById('ao')?.addEventListener('click',e=>{if(e.target.id==='ao')this.close();});
    document.getElementById('agent-send')?.addEventListener('click',()=>this.send());
    document.getElementById('agent-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.send();}});
    document.querySelectorAll('.qr-b').forEach(b=>b.addEventListener('click',()=>{document.getElementById('agent-input').value=b.getAttribute('data-q');this.send();}));
  },
  open(){document.getElementById('ao').classList.add('open');},
  close(){document.getElementById('ao').classList.remove('open');},
  send(){
    if(this.busy)return;const inp=document.getElementById('agent-input');const txt=inp.value.trim();if(!txt)return;
    inp.value='';this.pushMsg('user',txt);this.process(txt);
  },
  process(txt){
    this.busy=true;const lower=txt.toLowerCase();let matched=null;
    for(const[,f] of Object.entries(this.flows)){if(f.trig.some(t=>lower.includes(t))){matched=f;break;}}
    if(!matched)matched=this.flows.discovery;
    this.setPip('thinking');this.showTyping();
    setTimeout(()=>{this.removeTyping();this.pushMsg('bot',matched.intro);setTimeout(()=>this.runFlow(matched),600);},1100);
  },
  runFlow(f){this.resetWF(f.steps);this.setProgress(0);this.showTyping();this.runStep(f,0);},
  runStep(f,i){
    if(i>=f.steps.length){this.removeTyping();this.setPip('ready');this.setProgress(100);setTimeout(()=>{this.pushMsg('bot',f.result);this.busy=false;if(f.nav)setTimeout(()=>{Router.go(f.nav);this.close();},1500);},300);return;}
    const s=f.steps[i];this.activateWF(i);this.setPip('thinking',s.l);this.setProgress(Math.round((i/f.steps.length)*90));
    setTimeout(()=>{this.doneWF(i);this.runStep(f,i+1);},s.d);
  },
  pushMsg(role,html){const m=document.getElementById('agent-msgs');if(!m)return;const d=document.createElement('div');d.className=`msg ${role}`;d.innerHTML=`<div class="msg-av">${role==='bot'?'🤖':'👤'}</div><div class="msg-b">${html}</div>`;m.appendChild(d);m.scrollTop=m.scrollHeight;},
  showTyping(){const m=document.getElementById('agent-msgs');if(!m||document.getElementById('typing'))return;const d=document.createElement('div');d.className='msg bot';d.id='typing';d.innerHTML='<div class="msg-av">🤖</div><div class="msg-b"><div class="tdots"><span class="tdot"></span><span class="tdot"></span><span class="tdot"></span></div></div>';m.appendChild(d);m.scrollTop=m.scrollHeight;},
  removeTyping(){document.getElementById('typing')?.remove();},
  setPip(state,lbl){const p=document.getElementById('agent-pip');const l=document.getElementById('agent-pip-lbl');if(p)p.className='ap-pip'+(state!=='ready'?' thinking':'');if(l)l.textContent=lbl||(state==='ready'?'Ready':'Processing...');},
  resetWF(steps){const c=document.getElementById('agent-wf');if(!c)return;c.innerHTML=steps.map((s,i)=>`<div class="wf-s" id="ws-${i}"><div class="wf-bull" id="wb-${i}">${s.ico}</div><span>${s.l}</span></div>`).join('');},
  activateWF(i){document.getElementById(`ws-${i}`)?.classList.add('active');},
  doneWF(i){const el=document.getElementById(`ws-${i}`);if(el){el.classList.remove('active');el.classList.add('done');}const b=document.getElementById(`wb-${i}`);if(b)b.textContent='✓';},
  setProgress(pct){const f=document.getElementById('agent-pf');if(f)f.style.width=pct+'%';}
};

/* ─ Helpers ─ */
function downloadCSV(){const l=document.createElement('a');l.href='assets/data/inventory.json';l.download='CloudAtlas-Report.json';l.click();toast('⬇️','Download Started','CloudAtlas-Report.json');}
function downloadTool(n){toast('⬇️',`Downloading ${n}`,'Preparing installer... Demo mode');}
function switchTab(group,id){document.querySelectorAll(`.${group}-tab-b`).forEach(b=>b.classList.toggle('on',b.getAttribute(`data-${group}`)===id));document.querySelectorAll(`.${group}-tab-c`).forEach(c=>c.classList.toggle('on',c.getAttribute(`data-${group}`)===id));}
function switchLSTab(id){switchTab('ls',id);}
function switchWPTab(id){switchTab('wp',id);if(id==='wg')setTimeout(()=>WavePlan.wavesGroupsChart(),100);}
function switchDepTab(id){switchTab('dep',id);}

/* ─ App Assessment ─ */
const AppAssessment={ch:{},_done:false,
  init(){if(this._done)return;this._done=true;setTimeout(()=>{this.dnt();this.roadmap();this.costCmp();this.dep();},150);},
  dnt(){const ctx=document.getElementById('ch-app-assess-dnt');if(!ctx||this.ch.d)return;this.ch.d=new Chart(ctx,{type:'doughnut',data:{labels:['.Net','Java','PHP','Python'],datasets:[{data:[77,17,2,2],backgroundColor:['#2D7EFF','#F5A623','#22D86B','#EC4899'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'right',labels:{font:{size:9},color:'#8A9FC0',boxWidth:7,padding:5}}}}});},
  roadmap(){const ctx=document.getElementById('ch-app-roadmap');if(!ctx||this.ch.r)return;
    const data=[];for(let i=0;i<20;i++){data.push({x:55+Math.random()*43,y:Math.random()*750,r:4+Math.random()*14});}
    this.ch.r=new Chart(ctx,{type:'bubble',data:{datasets:[{label:'Applications',data:data,backgroundColor:'rgba(249,115,22,0.65)',borderColor:'rgba(249,115,22,0.2)',borderWidth:1},{label:'Quick Wins (100%)',data:[{x:98,y:25,r:5},{x:96,y:18,r:4},{x:94,y:12,r:4}],backgroundColor:'rgba(34,216,107,0.75)',borderColor:'rgba(34,216,107,0.2)',borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:10},color:'#8A9FC0',boxWidth:8}}},scales:{x:{min:0,max:100,ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  costCmp(){const ctx=document.getElementById('ch-app-cost-cmp');if(!ctx||this.ch.c)return;this.ch.c=new Chart(ctx,{type:'bar',data:{labels:['App Service','Azure Function','Virtual Machine','Container (AKS)'],datasets:[{label:'Monthly Cost ($)',data:[148618,1713,163561,239144],backgroundColor:['#F97316','#EF4444','#22D86B','#8B5CF6'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8A9FC0',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:10},callback:v=>'$'+(v/1000).toFixed(0)+'K'},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  dep(){const ctx=document.getElementById('ch-app-dep');if(!ctx||this.ch.dep)return;this.ch.dep=new Chart(ctx,{type:'bubble',data:{datasets:[{data:[{x:30,y:60,r:12},{x:60,y:80,r:8},{x:80,y:40,r:10},{x:50,y:30,r:6},{x:20,y:30,r:7},{x:70,y:65,r:9}],backgroundColor:['rgba(45,126,255,.55)','rgba(139,92,246,.55)','rgba(34,216,107,.55)','rgba(245,166,35,.55)','rgba(0,200,212,.55)','rgba(236,72,153,.55)'],borderColor:'transparent'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`App ${ctx.dataIndex+1}`}}},scales:{x:{display:false},y:{display:false}}}});}
};
/* ─ DB Assessment ─ */
const DBAssessment={ch:{},_done:false,
  init(){if(this._done)return;this._done=true;setTimeout(()=>{this.costBar();this.roadmap();},150);},
  costBar(){const ctx=document.getElementById('ch-db-cost-cmp');if(!ctx||this.ch.c)return;this.ch.c=new Chart(ctx,{type:'bar',data:{labels:['MI','vCore','VM'],datasets:[{data:[1625,3976,2043],backgroundColor:['#F97316','#22D86B','#2D7EFF'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8A9FC0',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#4E6080',font:{size:9},callback:v=>v>999?'€'+(v/1000).toFixed(1)+'K':'€'+v},grid:{color:'rgba(255,255,255,0.04)'}}}}});},
  roadmap(){const ctx=document.getElementById('ch-db-roadmap');if(!ctx||this.ch.r)return;this.ch.r=new Chart(ctx,{type:'bubble',data:{datasets:[{label:'SQL Server',data:[{x:80,y:35,r:8},{x:92,y:28,r:6}],backgroundColor:'rgba(249,115,22,0.7)',borderWidth:0},{label:'Oracle',data:[{x:75,y:5,r:4}],backgroundColor:'rgba(240,68,68,0.7)',borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:10},color:'#8A9FC0',boxWidth:8}}},scales:{x:{min:0,max:100,ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#4E6080',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}}}}});}
};
/* ─ Mod Wave Plan ─ */
const ModWavePlan={ch:{},_done:false,
  init(){if(this._done)return;this._done=true;setTimeout(()=>this.wgChart(),150);},
  wgChart(){const ctx=document.getElementById('ch-mwp-wg');if(!ctx||this.ch.wg)return;this.ch.wg=new Chart(ctx,{type:'pie',data:{labels:['Wave 1 Groups: 1','Wave 2 Groups: 0','Wave 3 Groups: 0','Wave 4 Groups: 0'],datasets:[{data:[97,1,1,1],backgroundColor:['#2D7EFF','rgba(0,200,212,.3)','rgba(34,216,107,.3)','rgba(245,166,35,.3)'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},color:'#8A9FC0',boxWidth:8}}}}});}
};
/* ─ Discovery tab switcher ─ */
function switchDiscTab(id){
  document.querySelectorAll('.disc-tb').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.disc-tc').forEach(c=>c.classList.remove('on'));
  document.querySelector(`.disc-tb[data-disc="${id}"]`)?.classList.add('on');
  document.querySelector(`.disc-tc[data-disc="${id}"]`)?.classList.add('on');
}
function switchACRTab(id){
  document.querySelectorAll('.acr-tab-b').forEach(b=>b.classList.toggle('on',b.getAttribute('data-acr')===id));
  document.querySelectorAll('.acr-tab-c').forEach(c=>c.classList.toggle('on',c.getAttribute('data-acr')===id));
}
function switchMWPTab(id){
  document.querySelectorAll('.mwp-tab-b').forEach(b=>b.classList.toggle('on',b.getAttribute('data-mwp')===id));
  document.querySelectorAll('.mwp-tab-c').forEach(c=>c.classList.toggle('on',c.getAttribute('data-mwp')===id));
}
window.AppAssessment=AppAssessment;window.DBAssessment=DBAssessment;window.ModWavePlan=ModWavePlan;
window.Discovery=Discovery;window.LiftShift=LiftShift;window.WavePlan=WavePlan;window.DepMap=DepMap;window.TCO=TCO;window.Portfolio=Portfolio;window.SixR=SixR;window.WaveMigration=WaveMigration;window.Agent=Agent;window.Router=Router;window.downloadCSV=downloadCSV;window.downloadTool=downloadTool;window.switchLSTab=switchLSTab;window.switchWPTab=switchWPTab;window.switchDepTab=switchDepTab;window.switchDiscTab=switchDiscTab;window.switchACRTab=switchACRTab;window.switchMWPTab=switchMWPTab;

async function boot(){
  try{const r=await fetch('assets/data/inventory.json');window._inv=await r.json();}catch{window._inv={servers:[]};}
  Theme.init();Sidebar.init();Router.init();Agent.init();Dashboard.init();
}
document.addEventListener('DOMContentLoaded',boot);

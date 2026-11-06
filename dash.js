const T='#16a6a1',N='#102b49',O='#e0873a',$=id=>document.getElementById(id),M=['Jan','Feb','Mar','Apr','May','Jun'];
const f1=x=>+x.toFixed(1),ls=x=>x.toLocaleString('en-IN'),mny=v=>v>=100?'₹'+(v/100).toFixed(2)+' Cr':'₹'+f1(v)+'L';
function cols(id,labels,series,max){
  max=max||Math.ceil(Math.max(...series.flatMap(s=>s.v))*1.15);
  const W=420,H=190,p=30,n=labels.length,g=(W-p)/n,k=series.length,bw=Math.min(26,(g-8)/k);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img">`;
  for(let i=0;i<=3;i++){const y=10+(H-45)*i/3;s+=`<line x1="${p}" x2="${W}" y1="${y}" y2="${y}" stroke="#edf1f4"/><text x="0" y="${y+3}" font-size="9" fill="#9aa7b2">${Math.round(max*(1-i/3))}</text>`}
  labels.forEach((l,i)=>{series.forEach((se,j)=>{const v=se.v[i],h=(H-45)*v/max,x=p+g*i+(g-bw*k)/2+bw*j,y=H-35-h;
    s+=`<rect class="mk" x="${x}" y="${y}" width="${bw-2}" height="${h}" rx="3" fill="${se.c}"><title>${l}, ${se.n}: ${v}</title></rect>`;
    if(k==1)s+=`<text x="${x+bw/2-1}" y="${y-4}" font-size="9" text-anchor="middle" fill="${N}">${v}</text>`});
    s+=`<text x="${p+g*i+g/2}" y="${H-18}" font-size="9" text-anchor="middle" fill="#7b8a99">${l}</text>`});
  $(id).innerHTML=s+'</svg>'+(k>1?'<div class="legend">'+series.map(x=>`<span style="--c:${x.c}">${x.n}</span>`).join('')+'</div>':'');
}
function line(id,labels,v,u='%'){
  const mn=Math.floor(Math.min(...v))-1,mx=Math.ceil(Math.max(...v))+1,W=420,H=190,p=36,st=(W-p-12)/(v.length-1),y=x=>H-30-(H-50)*(x-mn)/(mx-mn);
  const pts=v.map((x,i)=>[p+st*i,y(x)]),d=pts.map(q=>q.join(' ')).join(' L');let s=`<svg viewBox="0 0 ${W} ${H}" role="img">`;
  for(let i=0;i<=3;i++){const val=mx-(mx-mn)*i/3,yy=y(val);s+=`<line x1="${p}" x2="${W}" y1="${yy}" y2="${yy}" stroke="#edf1f4"/><text x="0" y="${yy+3}" font-size="9" fill="#9aa7b2">${val.toFixed(0)}${u}</text>`}
  s+=`<path d="M${d} L${pts.at(-1)[0]} ${H-30} L${p} ${H-30}Z" fill="${T}" opacity=".12"/><path d="M${d}" fill="none" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach((q,i)=>s+=`<circle class="mk" cx="${q[0]}" cy="${q[1]}" r="5" fill="${T}"><title>${labels[i]}: ${v[i]}${u}</title></circle><text x="${q[0]}" y="${H-12}" font-size="9" text-anchor="middle" fill="#7b8a99">${labels[i]}</text><text x="${q[0]}" y="${q[1]-10}" font-size="9" text-anchor="middle" fill="${N}">${v[i]}</text>`);
  $(id).innerHTML=s+'</svg>';
}
function hb(id,rows,max,fmt,below,sel,pick){
  $(id).innerHTML=rows.map(([l,v])=>`<div class="hb${v<below?' flag':''}${sel===l?' sel':''}${pick?' pick':''}" data-k="${l}" tabindex="${pick?0:-1}"><span>${l}</span><i><u style="width:${100*v/max}%"></u></i><b>${fmt(v)}</b></div>`).join('');
  if(pick)$(id).querySelectorAll('.hb').forEach(r=>{r.onclick=()=>pick(r.dataset.k);r.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();pick(r.dataset.k)}}});
}
function donut(id,rows){
  const cs=[N,T,'#35c4bb','#7fa6c4','#c3d3df'];let off=0,s='<svg viewBox="0 0 42 42" role="img"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="#eef2f5" stroke-width="6"/>';
  rows.forEach(([l,v],i)=>{s+=`<circle class="mk" cx="21" cy="21" r="15.9155" fill="none" stroke="${cs[i]}" stroke-width="6" stroke-dasharray="${v} ${100-v}" stroke-dashoffset="${25-off}"><title>${l}: ${v}%</title></circle>`;off+=v});
  $(id).innerHTML='<div class="donut">'+s+'</svg><div>'+rows.map(([l,v],i)=>`<div class="hb" style="grid-template-columns:12px auto 40px"><i style="height:10px;width:10px;background:${cs[i]}"></i><span>${l}</span><b>${v}%</b></div>`).join('')+'</div></div>';
}
function kpi(id,a){document.querySelector('#'+id+' .kpis').innerHTML=a.map(([l,v,s,w])=>`<div class="kpi"><small>${l}</small><b>${v}</b><span${w?' class="warn"':''}>${s}</span></div>`).join('')}
function csv(name,rows){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));a.download=name;a.click()}
function ctl(id,html,exp){const d=document.createElement('div');d.className='ctl';d.innerHTML=html+'<span class="sp"></span><button class="mini" data-x="csv">Download CSV</button><button class="mini" data-x="print">Print / save PDF</button>';
  document.querySelector('#'+id).prepend(d);d.querySelector('[data-x=csv]').onclick=exp;d.querySelector('[data-x=print]').onclick=()=>window.print();return d}
const seg=(n,opts,cur)=>`<div class="seg" data-n="${n}">`+opts.map(([v,l])=>`<button data-v="${v}" aria-pressed="${v==cur}">${l}</button>`).join('')+'</div>';
const sel=(n,lab,opts)=>`<label>${lab}<select data-n="${n}">`+opts.map(o=>`<option>${o}</option>`).join('')+'</select></label>';
const rng=(n,lab,mn,mx,v)=>`<label>${lab} <output>${v}</output><input type="range" data-n="${n}" min="${mn}" max="${mx}" value="${v}"></label>`;
function bind(d,st,fn){d.querySelectorAll('select,input').forEach(e=>e.oninput=()=>{st[e.dataset.n]=e.type=='range'?+e.value:e.value;if(e.type=='range')e.previousElementSibling.textContent=e.value;fn()});
  d.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{const g=b.parentNode;st[g.dataset.n]=+b.dataset.v;g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));fn()})}
const setSel=(d,n,v)=>{d.querySelector(`select[data-n=${n}]`).value=v};

/* School */
const SC={'6A':[210,94.1,74,92],'6B':[205,88.2,66,82],'7A':[212,93.0,72,89],'8A':[208,92.5,70,83],'9A':[198,87.6,68,80],'10A':[215,95.3,77,94]};
const ATT=[90.1,91.2,92.0,91.5,92.8,92.4],EXP=[24,24,25,26,26,27],COL=[21,22,22,23,23,24],SUB=['Math','Science','English','Hindi','Social'],SB=[68,72,76,74,70];
const S={cls:'All',r:6,th:90},wavg=(ks,i)=>ks.reduce((a,k)=>a+SC[k][0]*SC[k][i],0)/ks.reduce((a,k)=>a+SC[k][0],0);
function school(){
  const all=Object.keys(SC),ks=S.cls=='All'?all:[S.cls],n=ks.reduce((a,k)=>a+SC[k][0],0),att=wavg(ks,1),sc=wavg(ks,2),fee=wavg(ks,3),one=S.cls!='All',da=one?att-92.4:0,ds=one?sc-71.8:0,sh=n/1248,fr=fee/86.8,m=M.slice(-S.r),lo=all.filter(k=>SC[k][1]<S.th);
  kpi('school',[['Enrolled students',ls(n),one?'Class '+S.cls:'+6.2% vs last year'],['Attendance rate',f1(att)+'%',one?(da>=0?'+':'')+f1(da)+' pts vs school':'+0.9 pts vs last month',one&&da<0],['Average exam score',f1(sc),one?(ds>=0?'+':'')+f1(ds)+' vs school':'+2.1 vs last term',one&&ds<0],['Fees collected',f1(fee)+'%',lo.length+' class'+(lo.length==1?'':'es')+' below '+S.th+'% attendance',lo.length>0]]);
  line('s1',m,ATT.slice(-S.r).map(v=>f1(v+da)));
  hb('s2',all.map(k=>[k,SC[k][1]]),100,v=>v+'%',S.th,S.cls,k=>{S.cls=S.cls==k?'All':k;setSel(sd,'cls',S.cls);school()});
  cols('s3',SUB,[{n:'Avg score',v:SB.map(v=>Math.round(v+ds)),c:T}],100);
  cols('s4',m,[{n:'Expected',v:EXP.slice(-S.r).map(v=>f1(v*sh)),c:'#c3d3df'},{n:'Collected',v:COL.slice(-S.r).map(v=>f1(v*sh*fr)),c:T}]);
  document.querySelector('#school .q').innerHTML=`<b>Management question:</b> which classes need attendance or academic follow-up? ${lo.length?lo.map(k=>'Class '+k).join(' and ')+' sit below '+S.th+'% attendance.':'No class is below '+S.th+'% attendance at this threshold.'} Click a class bar to drill down.`;
}
const sd=ctl('school',sel('cls','Class',['All',...Object.keys(SC)])+seg('r',[[3,'Last 3 months'],[6,'Last 6 months']],6)+rng('th','Attendance flag below',85,95,90),()=>csv('school-classes.csv',[['Class','Students','Attendance %','Avg score','Fee collected %'],...Object.entries(SC).map(([k,v])=>[k,...v])]));
bind(sd,S,school);

/* Coaching */
const CO={JEE:[290,96],NEET:[240,78],Foundation:[190,62],'Board prep':[122,40]},CS=[['Counsellor A',248,91],['Counsellor B',226,78],['Counsellor C',204,64],['Counsellor D',164,43]],C={course:'All',key:3,dir:-1};
function coach(){
  const ks=C.course=='All'?Object.keys(CO):[C.course],enq=ks.reduce((a,k)=>a+CO[k][0],0),adm=ks.reduce((a,k)=>a+CO[k][1],0),sh=adm/276,one=C.course!='All';
  kpi('coach',[['New enquiries',ls(enq),one?C.course:'+11% vs last quarter'],['Admissions',adm,one?C.course:'+9% vs last quarter'],['Conversion',f1(100*adm/enq)+'%','enquiry to admission'],['Monthly collection','₹'+f1(18.4*sh)+'L','₹'+f1(3.2*sh)+'L pending',true]]);
  hb('c1',[['Enquiries',enq],['Contacted',Math.round(enq*.82)],['Demo attended',Math.round(enq*.487)],['Admitted',adm]],enq,v=>v,-1);
  hb('c3',Object.entries(CO).map(([k,v])=>[k,v[1]]),100,v=>v,-1,C.course,k=>{C.course=C.course==k?'All':k;setSel(cd,'course',C.course);coach()});
  cols('c4',M,[{n:'Collected',v:[16.2,17.1,17.8,18.0,18.4,18.4].map(v=>f1(v*sh)),c:T},{n:'Pending',v:[4.1,3.9,3.6,3.4,3.3,3.2].map(v=>f1(v*sh)),c:O}]);
  const g=r=>C.key==3?r[2]/r[1]:r[C.key],rows=[...CS].sort((a,b)=>C.dir*(g(a)>g(b)?1:-1)),A=k=>C.key==k?(C.dir<0?' ▼':' ▲'):'';
  $('c5').innerHTML='<table><tr>'+['Counsellor','Enquiries','Admissions','Conversion'].map((h,i)=>`<th><button class="sort" data-k="${i}">${h}${A(i)}</button></th>`).join('')+'</tr>'+rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><b>${f1(100*r[2]/r[1])}%</b></td></tr>`).join('')+'</table>';
  $('c5').querySelectorAll('.sort').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;C.dir=C.key==k?-C.dir:-1;C.key=k;coach()});
}
donut('c2',[['Referral',31],['Walk-in',27],['Instagram',20],['Google search',14],['Pamphlets',8]]);
const cd=ctl('coach',sel('course','Course',['All',...Object.keys(CO)]),()=>csv('coaching-courses.csv',[['Course','Enquiries','Admissions'],...Object.entries(CO).map(([k,v])=>[k,...v])]));
bind(cd,C,coach);

/* Fees */
const F={cls:'All',tgt:85},FT=152;
function fees(){
  const all=Object.keys(SC),ks=F.cls=='All'?all:[F.cls],n=ks.reduce((a,k)=>a+SC[k][0],0),exp=FT*n/1248,rate=wavg(ks,3),col=exp*rate/100,pend=exp-col,one=F.cls!='All',bl=all.filter(k=>SC[k][3]<F.tgt);
  kpi('fees',[['Expected to date',mny(exp),'academic year'],['Collected',mny(col),f1(rate)+'% collection rate'],['Pending dues','₹'+f1(pend)+'L','₹'+f1(6.4*pend/20)+'L overdue 60+ days',true],['Online payments','67%','UPI, bank and card']]);
  hb('f1',all.map(k=>[k,SC[k][3]]),100,v=>v+'%',F.tgt,F.cls,k=>{F.cls=F.cls==k?'All':k;setSel(fd,'cls',F.cls);fees()});
  cols('f2',['0-30','31-60','61-90','90+'],[{n:'Pending (₹ lakh)',v:[8.2,5.4,3.6,2.8].map(v=>f1(v*pend/20)),c:O}]);
  line('f4',M,[84.2,85.0,86.1,85.7,86.9,86.8].map(v=>f1(v+(one?rate-86.8:0))));
  document.querySelector('#fees .q').innerHTML=`<b>Management question:</b> which classes have the most pending dues and need reminders? ${bl.length?bl.map(k=>'Class '+k).join(', ')+' are below the '+F.tgt+'% target.':'No class is below the '+F.tgt+'% target.'} Click a class to drill down.`;
}
donut('f3',[['UPI',42],['Cash',23],['Bank transfer',20],['Cheque',10],['Card',5]]);
const fd=ctl('fees',sel('cls','Class',['All',...Object.keys(SC)])+rng('tgt','Target rate',70,95,85),()=>csv('fee-collection.csv',[['Class','Students','Collection rate %'],...Object.entries(SC).map(([k,v])=>[k,v[0],v[3]])]));
bind(fd,F,fees);

/* Results */
const R={sub:'All',th:70},PS=[91,94,97,96,95];
function results(){
  const all=Object.keys(SC),i=SUB.indexOf(R.sub),adj=i<0?0:SB[i]-71.8,cs=all.map(k=>[k,Math.round(SC[k][2]+adj)]),lo=cs.filter(c=>c[1]<R.th);
  kpi('results',[['Average score',f1(wavg(all,2)+adj),i<0?'+2.1 vs last term':R.sub+' average'],['Pass rate',(i<0?94.6:PS[i])+'%',i<0?'+1.3 pts vs last term':R.sub],['Grade A and above','38%','of students'],['Need extra support',Math.round(62*(1-adj/25)),'students below 40',true]]);
  cols('r1',SUB,[{n:'Pass %',v:PS,c:T}],100);
  cols('r2',['A+','A','B','C','D'],[{n:'% of students',v:[12,26,31,21,10],c:N}],40);
  hb('r3',cs,100,v=>v,R.th);
  line('r4',['Unit 1','Unit 2','Mid-term','Unit 3','Pre-final'],[66.5,68.9,70.2,71.0,71.8].map(v=>f1(v+adj)),'');
  document.querySelector('#results .q').innerHTML=`<b>Management question:</b> which classes and subjects need academic support? ${lo.length?lo.map(c=>'Class '+c[0]).join(', ')+' average below '+R.th+(i<0?', and Math has the lowest pass rate.':' in '+R.sub+'.'):'No class averages below '+R.th+' here.'}`;
}
const rd=ctl('results',sel('sub','Subject',['All',...SUB])+rng('th','Support flag below',60,80,70),()=>csv('results-classes.csv',[['Class','Avg score'],...Object.entries(SC).map(([k,v])=>[k,v[2]])]));
bind(rd,R,results);

school();coach();fees();results();
/* ---- Enrolment & retention ---- */
const RT={'6A':92,'6B':88,'7A':90,'8A':89,'9A':85,'10A':93},YR=['2021','2022','2023','2024','2025','2026'],ET=[1010,1055,1102,1150,1175,1248],NW=[140,155,162,171,160,198],LF=[95,110,115,123,135,125];
const E={cls:'All',th:88};
function enrol(){
  const all=Object.keys(SC),ks=E.cls=='All'?all:[E.cls],n=ks.reduce((a,k)=>a+SC[k][0],0),sh=n/1248,rt=ks.reduce((a,k)=>a+SC[k][0]*RT[k],0)/n,one=E.cls!='All',lo=all.filter(k=>RT[k]<E.th);
  kpi('enrol',[['Enrolled students',ls(n),one?'Class '+E.cls:'+6.2% vs last year'],['New admissions',Math.round(198*sh),'this year'],['Retention rate',f1(rt)+'%',lo.length+' class'+(lo.length==1?'':'es')+' below '+E.th+'%',lo.length>0],['Students who left',Math.round(n*(1-rt/100)),'this year',true]]);
  line('e1',YR,ET.map(v=>Math.round(v*sh)),'');
  cols('e2',YR,[{n:'New admissions',v:NW.map(v=>Math.round(v*sh)),c:T},{n:'Left school',v:LF.map(v=>Math.round(v*sh)),c:O}]);
  hb('e3',all.map(k=>[k,SC[k][0]]),250,v=>v,-1,E.cls,k=>{E.cls=E.cls==k?'All':k;setSel(ed,'cls',E.cls);enrol()});
  hb('e4',all.map(k=>[k,RT[k]]),100,v=>v+'%',E.th,E.cls,k=>{E.cls=E.cls==k?'All':k;setSel(ed,'cls',E.cls);enrol()});
  document.querySelector('#enrol .q').innerHTML='<b>Management question:</b> where are we gaining and losing students? '+(lo.length?lo.map(k=>'Class '+k).join(', ')+' retain fewer than '+E.th+'% of students.':'Every class retains at least '+E.th+'%.')+' Click a class to drill down.';
}
const ed=ctl('enrol',sel('cls','Class',['All',...Object.keys(SC)])+rng('th','Retention alert below',80,95,88),()=>csv('enrolment.csv',[['Class','Students','Retention %'],...Object.keys(SC).map(k=>[k,SC[k][0],RT[k]])]));bind(ed,E,enrol);

/* ---- Attendance heatmap ---- */
const DY=['Mon','Tue','Wed','Thu','Fri','Sat'],DA=[1.2,1.0,.6,0,-.8,-2.1],H={m:'Jun',th:90,pick:null};
function heat(){
  const mi=M.indexOf(H.m),adj=ATT[mi]-92.4,ks=Object.keys(SC),v=(k,d)=>f1(SC[k][1]+DA[d]+adj),cells=ks.flatMap(k=>DY.map((_,d)=>[k,d,v(k,d)])),lo=cells.filter(c=>c[2]<H.th),mn=cells.reduce((a,c)=>c[2]<a[2]?c:a),dav=DY.map((_,d)=>f1(ks.reduce((a,k)=>a+v(k,d),0)/6)),wd=dav.indexOf(Math.min(...dav));
  kpi('heat',[['School average',f1(ATT[mi])+'%',H.m],['Lowest day',DY[wd],dav[wd]+'% average',true],['Lowest cell','Class '+mn[0]+', '+DY[mn[1]],mn[2]+'%',true],['Cells below '+H.th+'%',lo.length,'of 36 class-day slots',lo.length>0]]);
  $('h1').innerHTML='<table class="heat"><tr><th></th>'+DY.map(d=>`<th>${d}</th>`).join('')+'</tr>'+ks.map(k=>'<tr><th>Class '+k+'</th>'+DY.map((_,d)=>{const x=v(k,d),t=Math.max(0,Math.min(1,(x-84)/13));return `<td><button class="cell${H.pick==k+d?' sel':''}" data-c="${k}|${d}" style="background:color-mix(in srgb,${T} ${Math.round(t*100)}%,${O})${x<H.th?';box-shadow:inset 0 0 0 2px #7a2e00':''}">${x}</button></td>`}).join('')+'</tr>').join('')+'</table>';
  $('h1').querySelectorAll('.cell').forEach(b=>b.onclick=()=>{const[k,d]=b.dataset.c.split('|');H.pick=k+d;heat()});
  const p=H.pick&&ks.find(k=>H.pick.startsWith(k)&&H.pick.length==k.length+1);
  $('h3').innerHTML=p?(()=>{const d=+H.pick.slice(p.length),x=v(p,d);return `<b>Class ${p}, ${DY[d]}, ${H.m}:</b> ${x}% present, about ${Math.round(SC[p][0]*(100-x)/100)} of ${SC[p][0]} students absent.`})():'Select a cell to see how many students were absent.';
  cols('h2',DY,[{n:'Avg attendance %',v:dav,c:T}],100);
  document.querySelector('#heat .q').innerHTML='<b>Management question:</b> which days and classes have attendance gaps? '+DY[wd]+' is weakest in '+H.m+'; outlined cells are below '+H.th+'%.';
}
const hd=ctl('heat',sel('m','Month',M)+rng('th','Flag below',85,95,90),()=>csv('attendance-heatmap.csv',[['Class',...DY],...Object.keys(SC).map(k=>[k,...DY.map((_,d)=>f1(SC[k][1]+DA[d]+ATT[M.indexOf(H.m)]-92.4))])]));bind(hd,H,heat);
hd.querySelector('select').value='Jun';

/* ---- Placement ---- */
const PL={'Computer Science':[120,102,6.8],Mechanical:[90,63,4.6],Commerce:[110,81,3.9],Management:[60,51,7.2]},P={d:'All'};
function place(){
  const ks=P.d=='All'?Object.keys(PL):[P.d],el=ks.reduce((a,k)=>a+PL[k][1-1],0),pl=ks.reduce((a,k)=>a+PL[k][1],0),avg=ks.reduce((a,k)=>a+PL[k][1]*PL[k][2],0)/pl,pc=100*pl/el,sh=pl/297,one=P.d!='All';
  kpi('place',[['Eligible students',el,one?P.d:'final-year batch'],['Placed',pl,f1(pc)+'% placement rate'],['Average package','₹'+f1(avg)+' LPA','across offers'],['Unplaced',el-pl,'students seeking roles',true]]);
  hb('p1',Object.entries(PL).map(([k,v])=>[k,f1(100*v[1]/v[0])]),100,v=>v+'%',-1,P.d,k=>{P.d=P.d==k?'All':k;setSel(pd,'d',P.d);place()});
  line('p2',['2022','2023','2024','2025','2026'],[68,71,74,76,78.2].map(v=>f1(v+(one?pc-78.2:0))));
  cols('p3',['Under 3','3 to 5','5 to 8','Over 8'],[{n:'Offers (LPA)',v:[58,104,95,40].map(v=>Math.round(v*sh)),c:N}]);
  donut('p4',[['IT services',38],['Banking and finance',22],['Manufacturing',17],['Education',12],['Others',11]]);
  document.querySelector('#place .q').innerHTML='<b>Management question:</b> which departments need placement support? '+Object.entries(PL).sort((a,b)=>a[1][1]/a[1][0]-b[1][1]/b[1][0])[0][0]+' has the lowest placement rate this year.';
}
const pd=ctl('place',sel('d','Department',['All',...Object.keys(PL)]),()=>csv('placement.csv',[['Department','Eligible','Placed','Avg LPA'],...Object.entries(PL).map(([k,v])=>[k,...v])]));bind(pd,P,place);

/* ---- Student watchlist ---- */
let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647,KS=Object.keys(SC);
const ST=Array.from({length:48},(_,i)=>{const a=f1(72+rnd()*26),s=Math.round(35+rnd()*55),du=Math.round(rnd()*rnd()*12)*1000,fl=(a<85)+(s<50)+(du>=5000);return{id:'S-'+(1001+i),cls:KS[i%6],att:a,sc:s,du,fl,lv:fl>=2?'High':fl?'Watch':'On track'}});
const W={cls:'All',lv:'All',q:'',k:'fl',dir:-1};
function risk(){
  const rows=ST.filter(s=>(W.cls=='All'||s.cls==W.cls)&&(W.lv=='All'||s.lv==W.lv)&&s.id.toLowerCase().includes(W.q.toLowerCase())).sort((a,b)=>W.dir*(a[W.k]>b[W.k]?1:a[W.k]<b[W.k]?-1:0)),hi=rows.filter(s=>s.lv=='High').length,A=k=>W.k==k?(W.dir<0?' ▼':' ▲'):'';
  kpi('risk',[['Students shown',rows.length,'of '+ST.length+' sample records'],['High risk',hi,'two or more flags',hi>0],['Average attendance',rows.length?f1(rows.reduce((a,s)=>a+s.att,0)/rows.length)+'%':'-','shown students'],['Fee dues','₹'+ls(rows.reduce((a,s)=>a+s.du,0)),'shown students',true]]);
  $('k1').innerHTML='<div class="scroll"><table><tr>'+[['id','Student ID'],['cls','Class'],['att','Attendance'],['sc','Avg score'],['du','Fee dues'],['fl','Risk']].map(([k,h])=>`<th><button class="sort" data-k="${k}">${h}${A(k)}</button></th>`).join('')+'</tr>'+(rows.map(s=>`<tr><td>${s.id}</td><td>${s.cls}</td><td>${s.att}%${s.att<85?' ⚑':''}</td><td>${s.sc}${s.sc<50?' ⚑':''}</td><td>₹${ls(s.du)}${s.du>=5000?' ⚑':''}</td><td><b class="lv ${s.lv[0]}">${s.lv}</b></td></tr>`).join('')||'<tr><td colspan="6">No students match these filters. Clear the search or choose All.</td></tr>')+'</table></div>';
  $('k1').querySelectorAll('.sort').forEach(b=>b.onclick=()=>{W.dir=W.k==b.dataset.k?-W.dir:-1;W.k=b.dataset.k;risk()});
  hb('k2',KS.map(k=>[k,ST.filter(s=>s.cls==k&&s.lv=='High').length]),6,v=>v,-1,W.cls,k=>{W.cls=W.cls==k?'All':k;setSel(kd,'cls',W.cls);risk()});
}
const kd=ctl('risk',sel('cls','Class',['All',...KS])+sel('lv','Risk',['All','High','Watch','On track'])+'<label>Search<input type="search" data-n="q" placeholder="Student ID"></label>',()=>csv('watchlist.csv',[['ID','Class','Attendance','Score','Dues','Risk'],...ST.map(s=>[s.id,s.cls,s.att,s.sc,s.du,s.lv])]));bind(kd,W,risk);
enrol();heat();place();risk();

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected',x===b));
  document.querySelectorAll('.dash').forEach(d=>d.classList.toggle('on',d.id===b.dataset.t));
  history.replaceState(null,'','#'+b.dataset.t);
});
{const tb=document.querySelector('[data-t="'+location.hash.slice(1)+'"]');if(tb)tb.click();}
$('year').textContent=new Date().getFullYear();

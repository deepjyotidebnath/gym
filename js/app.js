const OWNER_PIN="1234",GYM="Pulse Fitness Club",OWNER_PHONE="919876543210";
const PLANS=[{id:"m",n:"Monthly",mo:1,p:1500,d:"Gym floor and cardio. Pay month to month."},{id:"q",n:"Quarterly",mo:3,p:3900,d:"Gym floor, cardio and group classes. Save ₹600.",best:1},{id:"y",n:"Yearly",mo:12,p:12000,d:"Everything, plus 4 trainer sessions. Save ₹6,000."}];
const PROGS=[{n:"Strength floor",i:6,t:"Mon to Sat, 5:30 am to 10 pm",d:"Racks, free weights and machines with a coach on the floor at peak hours."},{n:"Yoga flow",i:7,t:"Daily, 6:30 am and 6:30 pm",d:"Mobility, breathing and flexibility for all levels. Mats provided."},{n:"HIIT conditioning",i:8,t:"Mon, Wed, Fri, 7 pm",d:"45-minute group circuits for fat loss and stamina."}];
const TRAINERS=[{n:"Arjun Rai",r:"Strength and muscle gain",i:3,b:"10 years of coaching beginners and returning lifters.",pl:"12-week muscle plan: 4 days a week, tracked lifts"},{n:"Kavya Nair",r:"Yoga and mobility",i:4,b:"Certified yoga teacher who works with desk-job posture and back stiffness.",pl:"8-week flexibility plan: 3 sessions a week"},{n:"Imran Sheikh",r:"Fat loss and conditioning",i:5,b:"Builds simple training and meal-habit plans that fit a work week.",pl:"12-week fat loss plan: 5 days a week with weekly check-ins"}];
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rs=n=>"₹"+n.toLocaleString("en-IN"),wa=(p,t)=>"https://wa.me/"+p+"?text="+encodeURIComponent(t);
const store={get(k,d){try{const v=localStorage.getItem("pulse_"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("pulse_"+k,JSON.stringify(v))}catch(e){}}};
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const addMo=(s,m)=>{const d=new Date(s+"T00:00");d.setMonth(d.getMonth()+m);return iso(d)};
const today=iso(new Date()),left=e=>Math.round((new Date(e+"T00:00")-new Date(today+"T00:00"))/864e5);
const status=m=>left(m.exp)<0?"Expired":left(m.exp)<=7?"Expiring":"Active";
const plan=id=>PLANS.find(p=>p.id===id)||PLANS[0];
let members=store.get("members",[]),enq=store.get("enq",[]);
const img=(n,a)=>`<div class="ph"><img src="../assets/image-${n}.jpg" alt="${a}" loading="lazy" onerror="nx(this)"></div>`;

$("#progs").innerHTML=PROGS.map(p=>`<div class="card">${img(p.i,p.n)}<div class="body"><h3>${p.n}</h3><p><span class="tag">${p.t}</span></p><p>${p.d}</p></div></div>`).join("");
$("#trs").innerHTML=TRAINERS.map(t=>`<div class="card">${img(t.i,t.n)}<div class="body"><h3>${t.n}</h3><p><b>${t.r}</b></p><p>${t.b}</p><p><span class="tag">Plan</span> ${t.pl}</p></div></div>`).join("");
$("#pl").innerHTML=PLANS.map(p=>`<div class="plan ${p.best?"best":""}"><h3>${p.n}${p.best?" (most popular)":""}</h3><div class="price">${rs(p.p)}</div><p class="sub" style="margin:0">${p.mo} month${p.mo>1?"s":""}. ${p.d}</p></div>`).join("");
$("#rPlan").innerHTML=PLANS.map(p=>`<option value="${p.id}">${p.n} (${rs(p.p)})</option>`).join("");
$("#rStart").min=today;$("#rStart").value=today;

$("#regForm").onsubmit=e=>{e.preventDefault();const p=plan($("#rPlan").value),ph=$("#rPhone").value.trim(),nm=$("#rName").value.trim(),st=$("#rStart").value;
const m={id:Date.now(),name:nm,phone:ph,plan:p.id,start:st,exp:addMo(st,p.mo),goal:$("#rGoal").value};members.push(m);store.set("members",members);
const t=`Hi ${nm}, welcome to ${GYM}! Your ${p.n} plan (${rs(p.p)}) starts ${st} and runs until ${m.exp}. Please pay at the front desk on your first visit. Goal: ${m.goal}.`;
$("#regDone").classList.remove("hide");$("#regDone").innerHTML=`<b>You're registered.</b> ${esc(p.n)} plan, valid until ${m.exp}.<br><a class="btn sm" style="margin-top:.6rem" target="_blank" rel="noopener" href="${wa(ph,t)}">Send WhatsApp confirmation</a>`;e.target.reset();$("#rStart").value=today};
$("#enqForm").onsubmit=e=>{e.preventDefault();const q={id:Date.now(),name:$("#qName").value.trim(),phone:$("#qPhone").value.trim(),msg:$("#qMsg").value.trim(),date:today};enq.unshift(q);store.set("enq",enq);
$("#enqDone").classList.remove("hide");$("#enqDone").innerHTML=`<b>Inquiry saved.</b> Tap below to also send it to the gym on WhatsApp.<br><a class="btn sm" style="margin-top:.6rem" target="_blank" rel="noopener" href="${wa(OWNER_PHONE,`Inquiry from ${q.name} (${q.phone}): ${q.msg}`)}">Send on WhatsApp</a>`;e.target.reset()};

/* owner desk */
let tab="m",aud="All";
$("#unlock").onclick=()=>{if($("#pin").value===OWNER_PIN){$("#lock").classList.add("hide");$("#desk").classList.remove("hide");draw()}else $("#pinErr").textContent="Wrong PIN."};
$("#dTabs").onclick=e=>{const t=e.target.dataset.t;if(!t)return;tab=t;document.querySelectorAll("#dTabs .tab").forEach(x=>x.setAttribute("aria-selected",x.dataset.t===t));draw()};
const remTxt=m=>{const l=left(m.exp);return l<0?`Hi ${m.name}, your ${GYM} membership expired on ${m.exp}. Renew this week to keep your plan going. Reply here or visit the front desk.`:`Hi ${m.name}, your ${GYM} membership ends on ${m.exp} (${l} day${l==1?"":"s"} left). Renew at the front desk or reply here.`};
const TPL=[`Hi {name}, Pulse Fitness Club is offering 15% off Quarterly and Yearly plans this month. Reply here to claim it.`,`Hi {name}, bring a friend this week and you both get 1 free personal training session. Reply to book.`,`Hi {name}, festival offer at Pulse Fitness Club: join or renew a Yearly plan and get 1 extra month free.`];
function draw(){const B=$("#dBody");
if(tab==="m"){const rows=[...members].sort((a,b)=>a.exp.localeCompare(b.exp));
B.innerHTML=rows.length?`<table><tr><th>Member</th><th>Plan</th><th>Expires</th><th>Status</th><th>Actions</th></tr>${rows.map(m=>`<tr><td>${esc(m.name)}<br><span class="sub small" style="margin:0">${m.phone} · ${esc(m.goal)}</span></td><td>${plan(m.plan).n}</td><td>${m.exp}</td><td class="st-${status(m)}">${status(m)}</td>
<td class="chips"><button class="chip rn" data-id="${m.id}">Renew</button><a class="chip" target="_blank" rel="noopener" href="${wa(m.phone,remTxt(m))}">Remind</a><button class="chip dl" data-id="${m.id}">Delete</button></td></tr>`).join("")}</table><p class="sub small" style="margin-top:.8rem">Renew extends the plan from today, or from the current end date if the member is still active.</p>`:`<p class="sub">No members yet. Registrations from the form above appear here.</p>`}
if(tab==="q"){B.innerHTML=enq.length?`<table><tr><th>When</th><th>From</th><th>Message</th><th></th></tr>${enq.map(q=>`<tr><td>${q.date}</td><td>${esc(q.name)}<br><span class="sub small" style="margin:0">${q.phone}</span></td><td>${esc(q.msg)}</td><td><a class="chip" target="_blank" rel="noopener" href="${wa(q.phone,`Hi ${q.name}, thanks for contacting ${GYM}. `)}">Reply</a></td></tr>`).join("")}</table>`:`<p class="sub">No inquiries yet.</p>`}
if(tab==="p"){const list=members.filter(m=>aud==="All"||status(m)===aud);
B.innerHTML=`<div class="row"><label>Send to<select id="aud">${["All","Active","Expiring","Expired"].map(a=>`<option ${a===aud?"selected":""}>${a}</option>`).join("")}</select></label>
<label>Offer<select id="tpl"><option value="0">New year offer</option><option value="1">Bring a friend</option><option value="2">Festival discount</option></select></label></div>
<label style="margin:.8rem 0">Message (use {name} for the member's name)<textarea id="pm" rows="3"></textarea></label>
${list.length?`<table><tr><th>Member</th><th></th></tr>${list.map(m=>`<tr><td>${esc(m.name)} <span class="st-${status(m)}">${status(m)}</span></td><td><a class="chip pmlink" data-n="${esc(m.name)}" data-p="${m.phone}" target="_blank" rel="noopener" href="#">Send promotion</a></td></tr>`).join("")}</table>`:`<p class="sub">No members in this group.</p>`}`;setTpl()}}
function setTpl(){const t=$("#tpl"),pm=$("#pm");if(!t)return;pm.value=TPL[+t.value];links()}
function links(){document.querySelectorAll(".pmlink").forEach(a=>a.href=wa(a.dataset.p,$("#pm").value.replace("{name}",a.dataset.n)))}
$("#dBody").onchange=e=>{if(e.target.id==="aud"){aud=e.target.value;draw()}if(e.target.id==="tpl")setTpl()};
$("#dBody").oninput=e=>{if(e.target.id==="pm")links()};
$("#dBody").onclick=e=>{const t=e.target,m=members.find(x=>x.id===+t.dataset.id);
if(t.classList.contains("rn")&&m){const base=left(m.exp)>=0?m.exp:today;m.exp=addMo(base,plan(m.plan).mo);store.set("members",members);draw()}
if(t.classList.contains("dl")&&m&&confirm("Delete this member?")){members=members.filter(x=>x.id!==m.id);store.set("members",members);draw()}};
$("#theme").onclick=()=>{const r=document.documentElement;r.dataset.theme=getComputedStyle(r).getPropertyValue("--bg").trim()==="#10151d"?"light":"dark"};

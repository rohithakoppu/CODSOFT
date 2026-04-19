/* ============================================================
   HireGreen — Complete Job Board App
   ============================================================ */

const App = (() => {

  /* ── State ─────────────────────────────────────────── */
  let S = {
    user: null,
    dashSection: 'overview',
    applyJobId: null,
    applyStep: 1,
  };

  /* ── Seed Data ─────────────────────────────────────── */
  const LOGOS = ['#22c55e','#14b8a6','#3b82f6','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#84cc16'];
  const EMOJIS = ['🏢','💡','🌿','🚀','⚡','🔮','🌐','🎯'];

  const seed = () => {
    if (!ls('jb_users')) {
      ls('jb_users', [
        { id:'u1', name:'Alex Rivera', email:'employer@demo.com', password:'demo123', role:'employer', company:'GreenTech Inc', avatar:'A', joinedAt: Date.now()-8640000*30 },
        { id:'u2', name:'Priya Sharma', email:'candidate@demo.com', password:'demo123', role:'candidate', avatar:'P', skills:['React','Node.js','MongoDB'], experience:'3 years', joinedAt: Date.now()-8640000*20 },
      ]);
    }
    if (!ls('jb_jobs')) {
      ls('jb_jobs', [
        { id:'j1', title:'Senior React Developer', company:'GreenTech Inc', companyId:'u1', location:'Hyderabad, India', type:'Full-time', mode:'Remote', salary:'₹12L–18L/yr', category:'Engineering', desc:'We are looking for a passionate Senior React Developer to join our growing product team. You will be working on cutting-edge web applications serving millions of users.', requirements:['5+ years of React experience','Proficiency in TypeScript','Experience with state management (Redux/Zustand)','Strong communication skills'], tags:['React','TypeScript','Redux','Node.js'], posted: Date.now()-86400000*2, deadline:'2025-06-30', status:'active', applications:14 },
        { id:'j2', title:'Full Stack Engineer', company:'EcoSoft', companyId:'u1', location:'Bangalore, India', type:'Full-time', mode:'Hybrid', salary:'₹8L–14L/yr', category:'Engineering', desc:'Join EcoSoft\'s engineering team and help build sustainable technology solutions. You\'ll work across our entire stack from backend APIs to frontend interfaces.', requirements:['3+ years full-stack experience','Proficiency in Node.js and React','Experience with PostgreSQL or MongoDB','Agile/Scrum experience'], tags:['Node.js','React','PostgreSQL','Docker'], posted: Date.now()-86400000*5, deadline:'2025-07-15', status:'active', applications:8 },
        { id:'j3', title:'UI/UX Designer', company:'Sprout Design', companyId:'u1', location:'Mumbai, India', type:'Full-time', mode:'On-site', salary:'₹6L–10L/yr', category:'Design', desc:'Sprout Design is seeking a creative UI/UX Designer to craft beautiful, user-centric digital experiences. You\'ll collaborate with product managers and engineers.', requirements:['3+ years UI/UX experience','Proficiency in Figma','Strong portfolio of shipped products','Understanding of accessibility standards'], tags:['Figma','Prototyping','User Research','CSS'], posted: Date.now()-86400000*1, deadline:'2025-06-20', status:'active', applications:22 },
        { id:'j4', title:'Data Scientist', company:'LeafAI', companyId:'u1', location:'Pune, India', type:'Full-time', mode:'Remote', salary:'₹15L–25L/yr', category:'Data Science', desc:'LeafAI is at the forefront of sustainable AI research. We\'re hiring a Data Scientist to develop predictive models and extract insights from complex datasets.', requirements:['4+ years in data science','Python & ML frameworks (PyTorch/TensorFlow)','Strong statistics background','Experience with large-scale data processing'], tags:['Python','ML','TensorFlow','SQL'], posted: Date.now()-86400000*7, deadline:'2025-07-01', status:'active', applications:31 },
        { id:'j5', title:'DevOps Engineer', company:'CloudRoot', companyId:'u1', location:'Chennai, India', type:'Contract', mode:'Remote', salary:'₹10L–16L/yr', category:'Engineering', desc:'CloudRoot needs a skilled DevOps Engineer to manage our cloud infrastructure, CI/CD pipelines, and ensure high availability of our mission-critical services.', requirements:['3+ years DevOps/SRE experience','AWS or GCP certification','Experience with Kubernetes & Docker','Infrastructure as Code (Terraform)'], tags:['AWS','Kubernetes','Docker','Terraform'], posted: Date.now()-86400000*3, deadline:'2025-06-25', status:'active', applications:19 },
        { id:'j6', title:'Product Manager', company:'GreenTech Inc', companyId:'u1', location:'Hyderabad, India', type:'Full-time', mode:'Hybrid', salary:'₹16L–24L/yr', category:'Product', desc:'GreenTech Inc is looking for a strategic Product Manager to define the roadmap for our flagship SaaS product. You\'ll work closely with engineering, design, and sales.', requirements:['5+ years product management','B2B SaaS experience','Excellent stakeholder communication','Data-driven decision making'], tags:['Product Strategy','Agile','Analytics','B2B'], posted: Date.now()-86400000*4, deadline:'2025-07-10', status:'active', applications:11 },
        { id:'j7', title:'Content Strategist', company:'VineMedia', companyId:'u1', location:'Delhi, India', type:'Part-time', mode:'Remote', salary:'₹3L–5L/yr', category:'Marketing', desc:'VineMedia seeks a creative Content Strategist to develop compelling narratives for our sustainability-focused brand. You\'ll own our content calendar and execution.', requirements:['2+ years content strategy','SEO/SEM knowledge','Excellent writing skills','Social media expertise'], tags:['SEO','Content','Social Media','Copywriting'], posted: Date.now()-86400000*6, deadline:'2025-06-18', status:'active', applications:27 },
        { id:'j8', title:'Backend Engineer (Python)', company:'LeafAI', companyId:'u1', location:'Bangalore, India', type:'Full-time', mode:'On-site', salary:'₹10L–15L/yr', category:'Engineering', desc:'LeafAI is building the next generation of AI-powered sustainability tools. We need a Python Backend Engineer to develop robust APIs and microservices.', requirements:['3+ years Python backend','FastAPI or Django experience','PostgreSQL & Redis','Experience with AI/ML integration'], tags:['Python','FastAPI','PostgreSQL','Redis'], posted: Date.now()-86400000*8, deadline:'2025-07-20', status:'active', applications:16 },
      ]);
    }
    if (!ls('jb_applications')) ls('jb_applications', [
      { id:'a1', jobId:'j1', userId:'u2', applicantName:'Priya Sharma', email:'candidate@demo.com', coverLetter:'I am very excited about this opportunity...', resumeName:'Priya_Sharma_Resume.pdf', status:'reviewing', appliedAt: Date.now()-86400000*1 },
    ]);
  };

  /* ── LocalStorage ──────────────────────────────────── */
  const ls = (k, v) => { if (v===undefined) { try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } } localStorage.setItem(k, JSON.stringify(v)); };
  const getUsers = () => ls('jb_users') || [];
  const getJobs  = () => ls('jb_jobs')  || [];
  const getApps  = () => ls('jb_applications') || [];
  const saveJobs = (j) => ls('jb_jobs', j);
  const saveApps = (a) => ls('jb_applications', a);

  /* ── Navigation ────────────────────────────────────── */
  const page = (id) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); window.scrollTo(0,0); }
    updateNavActive(id);
    closeMobileMenu();
    document.getElementById('user-dropdown')?.classList.remove('open');
  };

  const updateNavActive = (id) => {
    document.querySelectorAll('.nav-links a, .dash-nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === id);
    });
  };

  /* ── Toast ─────────────────────────────────────────── */
  const toast = (msg, type='info') => {
    const icons = { success:'✅', error:'❌', info:'ℹ️', email:'📧' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all .3s'; }, 2700);
    setTimeout(() => t.remove(), 3100);
  };

  /* ── Auth ──────────────────────────────────────────── */
  const login = (email, pw) => {
    const users = getUsers();
    const u = users.find(u => u.email===email && u.password===pw);
    if (!u) return { ok:false, msg:'Invalid email or password.' };
    S.user = u;
    ls('jb_session', u);
    renderNav();
    return { ok:true };
  };

  const register = (data) => {
    const users = getUsers();
    if (users.find(u => u.email===data.email)) return { ok:false, msg:'Email already registered.' };
    const u = { id:'u'+Date.now(), ...data, avatar: data.name.charAt(0).toUpperCase(), joinedAt: Date.now() };
    users.push(u);
    ls('jb_users', users);
    S.user = u;
    ls('jb_session', u);
    renderNav();
    return { ok:true };
  };

  const logout = () => {
    S.user = null;
    localStorage.removeItem('jb_session');
    renderNav();
    page('page-home');
    toast('Logged out successfully.','info');
  };

  /* ── Nav Render ─────────────────────────────────────── */
  const renderNav = () => {
    const area = document.getElementById('nav-auth');
    const mArea = document.getElementById('mobile-auth');
    if (!area) return;
    if (S.user) {
      area.innerHTML = `
        <div class="user-menu">
          <div class="user-avatar" id="uav" title="${S.user.name}">${S.user.avatar}</div>
          <div class="dropdown" id="user-dropdown">
            <div class="dropdown-item" style="font-weight:700;color:var(--n800);cursor:default">${S.user.name}</div>
            <div class="dropdown-item text-muted text-sm" style="cursor:default">${S.user.role==='employer'?'Employer':'Job Seeker'}</div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" onclick="App.openDash()">🏠 Dashboard</div>
            <div class="dropdown-item danger" onclick="App.logout()">🚪 Logout</div>
          </div>
        </div>`;
      document.getElementById('uav')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('user-dropdown')?.classList.toggle('open');
      });
      if (mArea) mArea.innerHTML = `<button onclick="App.openDash()">🏠 Dashboard</button><button onclick="App.logout()">🚪 Logout</button>`;
    } else {
      area.innerHTML = `
        <button class="btn btn-ghost btn-sm" onclick="App.showAuth('login')">Login</button>
        <button class="btn btn-primary btn-sm" onclick="App.showAuth('register')">Post a Job</button>`;
      if (mArea) mArea.innerHTML = `<a onclick="App.showAuth('login')">🔐 Login</a><a onclick="App.showAuth('register')">📝 Register</a>`;
    }
  };

  /* ── Job Rendering ─────────────────────────────────── */
  const jobCardHTML = (j) => {
    const idx = Math.abs(j.id.charCodeAt(1)) % LOGOS.length;
    const daysAgo = Math.max(0, Math.floor((Date.now()-j.posted)/86400000));
    const postedStr = daysAgo===0?'Today':daysAgo===1?'Yesterday':`${daysAgo}d ago`;
    return `
    <div class="job-card fade-in-up" onclick="App.viewJob('${j.id}')">
      <div class="job-card-top">
        <div class="company-logo" style="background:${LOGOS[idx]}">${EMOJIS[idx]}</div>
        <div class="job-card-info">
          <div class="job-title">${esc(j.title)}</div>
          <div class="company-name">${esc(j.company)} • ${esc(j.location)}</div>
        </div>
        ${j.mode==='Remote'?`<span class="badge badge-green">🌿 Remote</span>`:''}
      </div>
      <div class="job-card-badges">
        <span class="badge badge-gray">${j.type}</span>
        <span class="badge badge-blue">${j.category}</span>
        ${j.mode!=='Remote'?`<span class="badge badge-teal">${j.mode}</span>`:''}
      </div>
      <div class="job-desc">${esc(j.desc)}</div>
      <div class="job-card-footer">
        <div class="job-salary">${esc(j.salary)}</div>
        <div class="job-posted">🕐 ${postedStr}</div>
      </div>
    </div>`;
  };

  const renderJobs = (containerId, jobs) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!jobs.length) {
      el.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No jobs found</h3><p>Try adjusting your search filters.</p></div>`;
      return;
    }
    el.innerHTML = jobs.map((j,i) => jobCardHTML(j).replace('fade-in-up', `fade-in-up delay-${Math.min(i%4+1,4)}`)).join('');
  };

  /* ── Home Page ──────────────────────────────────────── */
  const initHome = () => {
    const jobs = getJobs().slice(0,6);
    renderJobs('home-jobs', jobs);
    // Stats animation
    const apps = getApps();
    animNum('stat-jobs', getJobs().length);
    animNum('stat-cos', [...new Set(getJobs().map(j=>j.company))].length);
    animNum('stat-placed', apps.length * 3 + 24);
    animNum('stat-remote', getJobs().filter(j=>j.mode==='Remote').length);
    // Companies
    const cos = [...new Map(getJobs().map(j=>[j.company, j])).values()];
    document.getElementById('company-grid').innerHTML = cos.slice(0,8).map((j,i) => {
      const idx = i % LOGOS.length;
      return `<div class="company-card" onclick="App.filterByCompany('${esc(j.company)}')">
        <div class="logo" style="background:${LOGOS[idx]}">${EMOJIS[idx]}</div>
        <div class="name">${esc(j.company)}</div>
        <div class="jobs">${getJobs().filter(jj=>jj.company===j.company).length} open roles</div>
      </div>`;
    }).join('');
  };

  const doHeroSearch = () => {
    const q = document.getElementById('hero-search').value;
    const cat = document.getElementById('hero-cat').value;
    page('page-jobs');
    document.getElementById('search-input').value = q;
    if (cat) document.getElementById('filter-cat').value = cat;
    filterJobs();
  };

  const filterByCompany = (co) => {
    page('page-jobs');
    document.getElementById('search-input').value = co;
    filterJobs();
  };

  /* ── Jobs Page ──────────────────────────────────────── */
  const filterJobs = () => {
    const q = (document.getElementById('search-input')?.value||'').toLowerCase();
    const cat = document.getElementById('filter-cat')?.value||'';
    const types = [...document.querySelectorAll('.filter-type:checked')].map(c=>c.value);
    const modes = [...document.querySelectorAll('.filter-mode:checked')].map(c=>c.value);
    let jobs = getJobs();
    if (q) jobs = jobs.filter(j => j.title.toLowerCase().includes(q)||j.company.toLowerCase().includes(q)||j.desc.toLowerCase().includes(q)||j.tags.some(t=>t.toLowerCase().includes(q)));
    if (cat) jobs = jobs.filter(j=>j.category===cat);
    if (types.length) jobs = jobs.filter(j=>types.includes(j.type));
    if (modes.length) jobs = jobs.filter(j=>modes.includes(j.mode));
    const sort = document.getElementById('sort-jobs')?.value||'newest';
    jobs = jobs.sort((a,b)=> sort==='newest'? b.posted-a.posted : sort==='salary'? b.applications-a.applications : a.title.localeCompare(b.title));
    document.getElementById('job-count').textContent = `${jobs.length} job${jobs.length!==1?'s':''} found`;
    renderJobs('jobs-grid', jobs);
  };

  /* ── Job Detail ─────────────────────────────────────── */
  const viewJob = (id) => {
    const j = getJobs().find(j=>j.id===id);
    if (!j) return;
    const idx = Math.abs(j.id.charCodeAt(1)) % LOGOS.length;
    const apps = getApps().filter(a=>a.jobId===id);
    const daysAgo = Math.max(0, Math.floor((Date.now()-j.posted)/86400000));
    const deadline = new Date(j.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    const alreadyApplied = S.user && apps.find(a=>a.userId===S.user.id);

    document.getElementById('page-job-detail').innerHTML = `
    <div class="job-detail-hero">
      <div class="container">
        <div class="flex items-start gap-4 flex-wrap">
          <div class="company-logo" style="background:${LOGOS[idx]};width:72px;height:72px;border-radius:18px;font-size:2rem;flex-shrink:0">${EMOJIS[idx]}</div>
          <div style="flex:1">
            <div class="flex gap-2 flex-wrap mb-4">
              <span class="badge badge-green">${j.type}</span>
              <span class="badge badge-blue">${j.category}</span>
              <span class="badge ${j.mode==='Remote'?'badge-green':j.mode==='Hybrid'?'badge-teal':'badge-gray'}">${j.mode}</span>
            </div>
            <h2 style="font-family:'Fraunces',serif;font-size:clamp(1.5rem,4vw,2.2rem);font-weight:700;color:var(--n900);margin-bottom:6px;">${esc(j.title)}</h2>
            <div class="info-row mt-2">
              <span class="info-item"><span class="ico">🏢</span>${esc(j.company)}</span>
              <span class="info-item"><span class="ico">📍</span>${esc(j.location)}</span>
              <span class="info-item"><span class="ico">💰</span>${esc(j.salary)}</span>
              <span class="info-item"><span class="ico">🕐</span>Posted ${daysAgo===0?'today':daysAgo+'d ago'}</span>
              <span class="info-item"><span class="ico">📅</span>Deadline: ${deadline}</span>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end;">
            ${alreadyApplied ? `<span class="badge badge-green" style="font-size:.9rem;padding:10px 20px">✅ Applied</span>` : `<button class="btn btn-primary btn-lg" onclick="App.openApply('${j.id}')">Apply Now →</button>`}
            <button class="btn btn-ghost btn-sm" onclick="App.goBack()">← Back to Jobs</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container section">
      <div class="two-col">
        <div class="sidebar">
          <div class="card">
            <div class="job-section-title">Job Overview</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
              <div class="info-item"><span class="ico">💼</span><div><div class="text-sm text-muted">Job Type</div><div class="font-bold">${j.type}</div></div></div>
              <div class="info-item"><span class="ico">🌍</span><div><div class="text-sm text-muted">Work Mode</div><div class="font-bold">${j.mode}</div></div></div>
              <div class="info-item"><span class="ico">💰</span><div><div class="text-sm text-muted">Salary</div><div class="font-bold text-green">${j.salary}</div></div></div>
              <div class="info-item"><span class="ico">📅</span><div><div class="text-sm text-muted">Deadline</div><div class="font-bold">${deadline}</div></div></div>
              <div class="info-item"><span class="ico">👥</span><div><div class="text-sm text-muted">Applicants</div><div class="font-bold">${apps.length}</div></div></div>
            </div>
          </div>
          <div class="card mt-4">
            <div class="job-section-title">Skills Required</div>
            <div class="tag-list">${j.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
          </div>
          <div class="card mt-4" style="background:linear-gradient(135deg,var(--g50),var(--g100));border-color:var(--g200)">
            <div style="font-weight:700;color:var(--g800);margin-bottom:8px">Ready to apply?</div>
            <div style="font-size:.85rem;color:var(--n500);margin-bottom:14px">Join ${apps.length} other applicants.</div>
            ${alreadyApplied ? `<span class="badge badge-green" style="font-size:.88rem;padding:8px 16px">✅ Already Applied</span>` : `<button class="btn btn-primary w-full" onclick="App.openApply('${j.id}')">Apply Now →</button>`}
          </div>
        </div>
        <div>
          <div class="card mb-4">
            <div class="job-section-title">About the Role</div>
            <p style="font-size:.92rem;color:var(--n600);line-height:1.8">${esc(j.desc)}</p>
          </div>
          <div class="card">
            <div class="job-section-title">Requirements</div>
            <ul class="detail-ul">
              ${j.requirements.map(r=>`<li>${esc(r)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>`;
    page('page-job-detail');
  };

  const goBack = () => {
    document.getElementById('page-jobs').classList.contains('active') ? null : page('page-jobs');
    page('page-jobs');
  };

  /* ── Apply Modal ─────────────────────────────────────── */
  const openApply = (jobId) => {
    if (!S.user) { toast('Please login to apply.','error'); showAuth('login'); return; }
    if (S.user.role==='employer') { toast('Employers cannot apply for jobs.','error'); return; }
    const apps = getApps();
    if (apps.find(a=>a.jobId===jobId && a.userId===S.user.id)) { toast('You already applied for this job.','info'); return; }
    S.applyJobId = jobId;
    S.applyStep = 1;
    renderApplyModal();
    document.getElementById('apply-modal').classList.add('open');
  };

  const renderApplyModal = () => {
    const j = getJobs().find(j=>j.id===S.applyJobId);
    const modal = document.getElementById('apply-modal-content');
    const stepsHTML = `
      <div class="steps">
        ${['Profile','Cover Letter','Resume','Review'].map((s,i)=>`
          <div class="step ${S.applyStep>i+1?'done':S.applyStep===i+1?'active':''}">
            <div class="step-num">${S.applyStep>i+1?'✓':i+1}</div>
            <div class="step-label">${s}</div>
          </div>`).join('')}
      </div>`;

    if (S.applyStep===1) {
      modal.innerHTML = `
        ${stepsHTML}
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input id="apply-name" class="form-control" value="${esc(S.user.name)}" placeholder="Your full name">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input id="apply-email" class="form-control" value="${esc(S.user.email)}" type="email">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input id="apply-phone" class="form-control" placeholder="+91 9876543210">
        </div>
        <div class="form-group">
          <label class="form-label">LinkedIn Profile (optional)</label>
          <input id="apply-linkedin" class="form-control" placeholder="https://linkedin.com/in/yourname">
        </div>
        <div class="flex justify-between gap-3 mt-4">
          <button class="btn btn-ghost" onclick="closeApply()">Cancel</button>
          <button class="btn btn-primary" onclick="App.applyNext()">Next →</button>
        </div>`;
    } else if (S.applyStep===2) {
      modal.innerHTML = `
        ${stepsHTML}
        <div class="form-group">
          <label class="form-label">Cover Letter</label>
          <textarea id="apply-cover" class="form-control" rows="7" placeholder="Tell the employer why you're a great fit for ${esc(j?.title)}..."></textarea>
          <div class="form-hint">Minimum 100 characters. Tailor it to the role!</div>
        </div>
        <div class="flex justify-between gap-3 mt-4">
          <button class="btn btn-ghost" onclick="App.applyPrev()">← Back</button>
          <button class="btn btn-primary" onclick="App.applyNext()">Next →</button>
        </div>`;
    } else if (S.applyStep===3) {
      modal.innerHTML = `
        ${stepsHTML}
        <div class="upload-zone" onclick="document.getElementById('resume-input').click()">
          <div class="icon">📄</div>
          <p><strong>Click to upload your resume</strong></p>
          <p>PDF, DOC, DOCX — Max 5MB</p>
          <input type="file" id="resume-input" style="display:none" accept=".pdf,.doc,.docx" onchange="App.handleResumeUpload(this)">
          <div id="resume-name" style="margin-top:10px;font-weight:600;color:var(--g700)"></div>
        </div>
        <div class="mt-4">
          <label class="form-label">Or paste resume link</label>
          <input id="resume-link" class="form-control" placeholder="https://drive.google.com/...">
        </div>
        <div class="flex justify-between gap-3 mt-4">
          <button class="btn btn-ghost" onclick="App.applyPrev()">← Back</button>
          <button class="btn btn-primary" onclick="App.applyNext()">Next →</button>
        </div>`;
    } else {
      modal.innerHTML = `
        ${stepsHTML}
        <div style="background:var(--g50);border:1px solid var(--g200);border-radius:var(--radius);padding:20px;margin-bottom:20px">
          <div style="font-weight:700;color:var(--g800);margin-bottom:12px">📋 Application Summary</div>
          <div style="font-size:.88rem;color:var(--n600);display:flex;flex-direction:column;gap:8px">
            <div>🎯 Applying for: <strong>${esc(j?.title)}</strong> at <strong>${esc(j?.company)}</strong></div>
            <div>👤 Name: <strong>${esc(S.user.name)}</strong></div>
            <div>📧 Email: <strong>${esc(S.user.email)}</strong></div>
            <div>📄 Resume: <strong>${window._resumeName || 'Not uploaded (link provided)'}</strong></div>
          </div>
        </div>
        <p style="font-size:.85rem;color:var(--n500);margin-bottom:20px">By submitting, you agree that your information will be shared with the employer.</p>
        <div class="flex justify-between gap-3">
          <button class="btn btn-ghost" onclick="App.applyPrev()">← Back</button>
          <button class="btn btn-primary btn-lg" onclick="App.submitApplication()">🚀 Submit Application</button>
        </div>`;
    }
  };

  const applyNext = () => {
    if (S.applyStep===2) {
      const cv = document.getElementById('apply-cover')?.value||'';
      if (cv.trim().length < 30) { toast('Please write a cover letter (min 30 chars).','error'); return; }
    }
    if (S.applyStep < 4) { S.applyStep++; renderApplyModal(); }
  };
  const applyPrev = () => { if (S.applyStep > 1) { S.applyStep--; renderApplyModal(); } };
  const handleResumeUpload = (input) => {
    if (input.files[0]) {
      window._resumeName = input.files[0].name;
      document.getElementById('resume-name').textContent = '✅ ' + input.files[0].name;
    }
  };

  const submitApplication = () => {
    const apps = getApps();
    const newApp = {
      id: 'a'+Date.now(),
      jobId: S.applyJobId,
      userId: S.user.id,
      applicantName: S.user.name,
      email: S.user.email,
      coverLetter: document.getElementById('apply-cover')?.value || '',
      resumeName: window._resumeName || 'Resume (Link)',
      status: 'pending',
      appliedAt: Date.now(),
    };
    apps.push(newApp);
    saveApps(apps);

    // Update job application count
    const jobs = getJobs();
    const j = jobs.find(j=>j.id===S.applyJobId);
    if (j) { j.applications = (j.applications||0)+1; saveJobs(jobs); }

    closeApply();
    toast('🎉 Application submitted!','success');
    setTimeout(()=>toast('📧 Confirmation email sent to '+S.user.email,'email'), 1000);

    // Refresh if on detail page
    if (S.applyJobId) viewJob(S.applyJobId);
  };

  window.closeApply = () => {
    document.getElementById('apply-modal').classList.remove('open');
    window._resumeName = null;
  };

  /* ── Auth ───────────────────────────────────────────── */
  const showAuth = (mode) => {
    document.getElementById('auth-mode-label').textContent = mode==='login'?'Welcome back 👋':'Create account ✨';
    document.getElementById('auth-mode-sub').textContent = mode==='login'?'Login to your HireGreen account.':'Join thousands of professionals on HireGreen.';
    document.getElementById('login-panel').style.display = mode==='login'?'block':'none';
    document.getElementById('register-panel').style.display = mode!=='login'?'block':'none';
    document.getElementById('auth-tab-login').classList.toggle('active', mode==='login');
    document.getElementById('auth-tab-reg').classList.toggle('active', mode!=='login');
    page('page-auth');
  };

  const initAuth = () => {
    document.getElementById('auth-tab-login').addEventListener('click', () => showAuth('login'));
    document.getElementById('auth-tab-reg').addEventListener('click', () => showAuth('register'));
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('l-email').value.trim();
      const pw    = document.getElementById('l-pw').value;
      const r = login(email, pw);
      if (r.ok) { toast('Welcome back, '+S.user.name+'! 🎉','success'); openDash(); }
      else document.getElementById('login-err').textContent = r.msg;
    });
    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('r-name').value.trim();
      const email= document.getElementById('r-email').value.trim();
      const pw   = document.getElementById('r-pw').value;
      const cpw  = document.getElementById('r-cpw').value;
      const role = document.querySelector('.role-btn.active')?.dataset.role || 'candidate';
      const errEl= document.getElementById('reg-err');
      if (!name||!email||!pw) { errEl.textContent='All fields required.'; return; }
      if (pw.length<6) { errEl.textContent='Password min 6 characters.'; return; }
      if (pw!==cpw) { errEl.textContent='Passwords do not match.'; return; }
      const r = register({ name, email, password:pw, role });
      if (r.ok) { toast('Account created! Welcome '+name+' 🌿','success'); openDash(); }
      else errEl.textContent = r.msg;
    });
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  };

  /* ── Dashboard ──────────────────────────────────────── */
  const openDash = () => {
    if (!S.user) { showAuth('login'); return; }
    S.user.role==='employer' ? renderEmployerDash('overview') : renderCandidateDash('overview');
  };

  /* ── Employer Dash ─────────────────────────────────── */
  const renderEmployerDash = (section='overview') => {
    S.dashSection = section;
    const myJobs = getJobs().filter(j=>j.companyId===S.user.id||j.createdBy===S.user.id);
    const allApps = getApps().filter(a=>myJobs.map(j=>j.id).includes(a.jobId));

    const dashEl = document.getElementById('page-employer-dash');
    dashEl.innerHTML = `
    <div class="dash-layout">
      <div class="dash-sidebar">
        <div class="profile-card" style="margin-bottom:16px">
          <div class="profile-avatar">${S.user.avatar}</div>
          <div class="profile-name">${esc(S.user.name)}</div>
          <div class="profile-role">Employer • ${esc(S.user.company||'Your Company')}</div>
        </div>
        <ul class="dash-nav">
          <li><a class="${section==='overview'?'active':''}" onclick="App.renderEmployerDash('overview')" data-page="employer-overview"><span class="icon">🏠</span>Overview</a></li>
          <li><a class="${section==='jobs'?'active':''}" onclick="App.renderEmployerDash('jobs')"><span class="icon">💼</span>My Jobs</a></li>
          <li><a class="${section==='applications'?'active':''}" onclick="App.renderEmployerDash('applications')"><span class="icon">📋</span>Applications</a></li>
          <li><a class="${section==='post'?'active':''}" onclick="App.renderEmployerDash('post')"><span class="icon">➕</span>Post a Job</a></li>
          <li><a class="${section==='profile'?'active':''}" onclick="App.renderEmployerDash('profile')"><span class="icon">⚙️</span>Profile</a></li>
          <li><a onclick="App.logout()"><span class="icon">🚪</span>Logout</a></li>
        </ul>
      </div>
      <div class="dash-content" id="emp-dash-main">
        ${section==='overview' ? empOverview(myJobs, allApps) : ''}
        ${section==='jobs' ? empJobs(myJobs) : ''}
        ${section==='applications' ? empApplications(allApps, myJobs) : ''}
        ${section==='post' ? empPostJob() : ''}
        ${section==='profile' ? empProfile() : ''}
      </div>
    </div>`;
    page('page-employer-dash');
  };

  const empOverview = (myJobs, allApps) => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;margin-bottom:20px">Welcome back, ${esc(S.user.name)}! 👋</h3>
    <div class="stat-grid">
      <div class="stat-card"><div class="icon">💼</div><div class="num">${myJobs.length}</div><div class="label">Active Jobs</div></div>
      <div class="stat-card"><div class="icon">📋</div><div class="num">${allApps.length}</div><div class="label">Total Applications</div></div>
      <div class="stat-card"><div class="icon">🔍</div><div class="num">${allApps.filter(a=>a.status==='reviewing').length}</div><div class="label">Under Review</div></div>
      <div class="stat-card"><div class="icon">✅</div><div class="num">${allApps.filter(a=>a.status==='accepted').length}</div><div class="label">Accepted</div></div>
    </div>
    <div class="card">
      <div style="font-family:'Fraunces',serif;font-weight:700;margin-bottom:16px">Recent Applications</div>
      ${allApps.length===0?`<div class="empty"><div class="icon">📭</div><h3>No applications yet</h3></div>`:
        `<div class="table-wrap"><table>
          <thead><tr><th>Applicant</th><th>Job</th><th>Applied</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${allApps.slice(0,5).map(a=>{
            const j = myJobs.find(j=>j.id===a.jobId);
            const dA = Math.floor((Date.now()-a.appliedAt)/86400000);
            return `<tr>
              <td><div class="font-bold">${esc(a.applicantName)}</div><div class="text-sm text-muted">${esc(a.email)}</div></td>
              <td>${esc(j?.title||'–')}</td>
              <td>${dA===0?'Today':dA+'d ago'}</td>
              <td><span class="badge ${a.status==='pending'?'badge-amber':a.status==='reviewing'?'badge-blue':a.status==='accepted'?'badge-green':'badge-red'}">${a.status}</span></td>
              <td>
                <select class="form-control" style="padding:5px 10px;font-size:.8rem;width:auto" onchange="App.updateAppStatus('${a.id}',this.value)">
                  <option ${a.status==='pending'?'selected':''}>pending</option>
                  <option ${a.status==='reviewing'?'selected':''}>reviewing</option>
                  <option ${a.status==='accepted'?'selected':''}>accepted</option>
                  <option ${a.status==='rejected'?'selected':''}>rejected</option>
                </select>
              </td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>`}
    </div>`;

  const empJobs = (myJobs) => `
    <div class="flex justify-between items-center mb-4">
      <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700">My Job Listings</h3>
      <button class="btn btn-primary btn-sm" onclick="App.renderEmployerDash('post')">+ Post New Job</button>
    </div>
    <div class="card">
      ${myJobs.length===0?`<div class="empty"><div class="icon">💼</div><h3>No jobs posted yet</h3><p>Post your first job!</p></div>`:
        `<div class="table-wrap"><table>
          <thead><tr><th>Title</th><th>Location</th><th>Type</th><th>Apps</th><th>Posted</th><th>Actions</th></tr></thead>
          <tbody>${myJobs.map(j=>{
            const d = Math.floor((Date.now()-j.posted)/86400000);
            const apps = getApps().filter(a=>a.jobId===j.id);
            return `<tr>
              <td><div class="font-bold">${esc(j.title)}</div><div class="text-sm text-muted">${esc(j.company)}</div></td>
              <td>${esc(j.location)}</td>
              <td><span class="badge badge-gray">${j.type}</span></td>
              <td><span class="badge badge-blue">${apps.length}</span></td>
              <td>${d===0?'Today':d+'d ago'}</td>
              <td class="flex gap-2"><button class="btn btn-ghost btn-sm" onclick="App.viewJob('${j.id}')">👁</button><button class="btn btn-danger btn-sm" onclick="App.deleteJob('${j.id}')">🗑</button></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>`}
    </div>`;

  const empApplications = (allApps, myJobs) => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">All Applications</h3>
    <div class="card">
      ${allApps.length===0?`<div class="empty"><div class="icon">📋</div><h3>No applications yet</h3></div>`:
        `<div class="table-wrap"><table>
          <thead><tr><th>Applicant</th><th>Job</th><th>Resume</th><th>Applied</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>${allApps.map(a=>{
            const j=myJobs.find(j=>j.id===a.jobId);
            const d=Math.floor((Date.now()-a.appliedAt)/86400000);
            return `<tr>
              <td><div class="font-bold">${esc(a.applicantName)}</div><div class="text-sm text-muted">${esc(a.email)}</div></td>
              <td>${esc(j?.title||'–')}</td>
              <td><span class="badge badge-gray">📄 ${esc(a.resumeName)}</span></td>
              <td>${d===0?'Today':d+'d ago'}</td>
              <td><span class="badge ${a.status==='pending'?'badge-amber':a.status==='reviewing'?'badge-blue':a.status==='accepted'?'badge-green':'badge-red'}">${a.status}</span></td>
              <td><select class="form-control" style="padding:5px 10px;font-size:.8rem;width:auto" onchange="App.updateAppStatus('${a.id}',this.value)">
                <option ${a.status==='pending'?'selected':''}>pending</option>
                <option ${a.status==='reviewing'?'selected':''}>reviewing</option>
                <option ${a.status==='accepted'?'selected':''}>accepted</option>
                <option ${a.status==='rejected'?'selected':''}>rejected</option>
              </select></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>`}
    </div>`;

  const empPostJob = () => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">Post a New Job</h3>
    <div class="card">
      <form id="post-job-form">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Job Title *</label><input id="pj-title" class="form-control" placeholder="e.g. Senior React Developer" required></div>
          <div class="form-group"><label class="form-label">Company *</label><input id="pj-company" class="form-control" value="${esc(S.user.company||S.user.name)}" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Location *</label><input id="pj-location" class="form-control" placeholder="e.g. Hyderabad, India" required></div>
          <div class="form-group"><label class="form-label">Salary Range</label><input id="pj-salary" class="form-control" placeholder="e.g. ₹8L–14L/yr"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Job Type</label>
            <select id="pj-type" class="form-control"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div>
          <div class="form-group"><label class="form-label">Work Mode</label>
            <select id="pj-mode" class="form-control"><option>On-site</option><option>Remote</option><option>Hybrid</option></select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Category</label>
            <select id="pj-cat" class="form-control">
              <option>Engineering</option><option>Design</option><option>Product</option>
              <option>Marketing</option><option>Data Science</option><option>Sales</option><option>Other</option>
            </select></div>
          <div class="form-group"><label class="form-label">Application Deadline</label><input type="date" id="pj-deadline" class="form-control"></div>
        </div>
        <div class="form-group"><label class="form-label">Job Description *</label>
          <textarea id="pj-desc" class="form-control" rows="5" placeholder="Describe the role, responsibilities, and your team..." required></textarea></div>
        <div class="form-group"><label class="form-label">Requirements (one per line)</label>
          <textarea id="pj-req" class="form-control" rows="4" placeholder="3+ years React experience&#10;Strong TypeScript skills&#10;Agile methodology"></textarea></div>
        <div class="form-group"><label class="form-label">Skills/Tags (comma separated)</label>
          <input id="pj-tags" class="form-control" placeholder="React, TypeScript, Node.js, MongoDB"></div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-ghost" onclick="App.renderEmployerDash('jobs')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-lg">🚀 Publish Job</button>
        </div>
      </form>
    </div>`;

  const empProfile = () => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">Account Profile</h3>
    <div class="card">
      <form id="profile-form">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Full Name</label><input id="prof-name" class="form-control" value="${esc(S.user.name)}"></div>
          <div class="form-group"><label class="form-label">Company Name</label><input id="prof-company" class="form-control" value="${esc(S.user.company||'')}"></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label><input id="prof-email" class="form-control" value="${esc(S.user.email)}" type="email"></div>
        <div class="form-group"><label class="form-label">Company Website</label><input id="prof-web" class="form-control" placeholder="https://yourcompany.com"></div>
        <div class="form-group"><label class="form-label">About Company</label><textarea id="prof-about" class="form-control" rows="4" placeholder="Tell candidates about your company culture, mission..."></textarea></div>
        <button type="submit" class="btn btn-primary mt-4">💾 Save Profile</button>
      </form>
    </div>`;

  /* ── Candidate Dash ─────────────────────────────────── */
  const renderCandidateDash = (section='overview') => {
    S.dashSection = section;
    const myApps = getApps().filter(a=>a.userId===S.user.id);
    const el = document.getElementById('page-candidate-dash');
    el.innerHTML = `
    <div class="dash-layout">
      <div class="dash-sidebar">
        <div class="profile-card" style="margin-bottom:16px">
          <div class="profile-avatar">${S.user.avatar}</div>
          <div class="profile-name">${esc(S.user.name)}</div>
          <div class="profile-role">Job Seeker</div>
        </div>
        <ul class="dash-nav">
          <li><a class="${section==='overview'?'active':''}" onclick="App.renderCandidateDash('overview')"><span class="icon">🏠</span>Overview</a></li>
          <li><a class="${section==='applications'?'active':''}" onclick="App.renderCandidateDash('applications')"><span class="icon">📋</span>My Applications</a></li>
          <li><a class="${section==='profile'?'active':''}" onclick="App.renderCandidateDash('profile')"><span class="icon">👤</span>My Profile</a></li>
          <li><a onclick="App.page('page-jobs')"><span class="icon">🔍</span>Browse Jobs</a></li>
          <li><a onclick="App.logout()"><span class="icon">🚪</span>Logout</a></li>
        </ul>
      </div>
      <div class="dash-content">
        ${section==='overview' ? candOverview(myApps) : ''}
        ${section==='applications' ? candApplications(myApps) : ''}
        ${section==='profile' ? candProfile() : ''}
      </div>
    </div>`;
    page('page-candidate-dash');
    if (section==='overview') {
      document.getElementById('cand-post-form-area') && initCandPostJobForm();
    }
  };

  const candOverview = (myApps) => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;margin-bottom:20px">Hello, ${esc(S.user.name)}! 🌿</h3>
    <div class="stat-grid">
      <div class="stat-card"><div class="icon">📤</div><div class="num">${myApps.length}</div><div class="label">Applications Sent</div></div>
      <div class="stat-card"><div class="icon">🔍</div><div class="num">${myApps.filter(a=>a.status==='reviewing').length}</div><div class="label">Under Review</div></div>
      <div class="stat-card"><div class="icon">✅</div><div class="num">${myApps.filter(a=>a.status==='accepted').length}</div><div class="label">Accepted</div></div>
      <div class="stat-card"><div class="icon">💼</div><div class="num">${getJobs().length}</div><div class="label">Jobs Available</div></div>
    </div>
    <div class="card mb-4">
      <div style="font-family:'Fraunces',serif;font-weight:700;margin-bottom:16px">Recent Applications</div>
      ${myApps.length===0?`<div class="empty"><div class="icon">📭</div><h3>No applications yet</h3><p><a onclick="App.page('page-jobs')" style="color:var(--g700);cursor:pointer">Browse jobs</a> to start applying!</p></div>`:
        myApps.slice(0,3).map(a=>{
          const j=getJobs().find(j=>j.id===a.jobId);
          const d=Math.floor((Date.now()-a.appliedAt)/86400000);
          return `<div style="display:flex;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="App.viewJob('${a.jobId}')">
            <div style="flex:1"><div class="font-bold">${esc(j?.title||'–')}</div><div class="text-sm text-muted">${esc(j?.company)} • Applied ${d===0?'today':d+'d ago'}</div></div>
            <span class="badge ${a.status==='pending'?'badge-amber':a.status==='reviewing'?'badge-blue':a.status==='accepted'?'badge-green':'badge-red'}">${a.status}</span>
          </div>`;
        }).join('')}
    </div>
    <div class="card" style="background:linear-gradient(135deg,var(--g50),var(--g100));border-color:var(--g200)">
      <div style="font-weight:700;color:var(--g800);margin-bottom:6px">🌿 Complete your profile</div>
      <div style="font-size:.88rem;color:var(--n500);margin-bottom:14px">A complete profile gets 3x more recruiter views.</div>
      <button class="btn btn-primary btn-sm" onclick="App.renderCandidateDash('profile')">Update Profile →</button>
    </div>`;

  const candApplications = (myApps) => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">My Applications</h3>
    <div class="card">
      ${myApps.length===0?`<div class="empty"><div class="icon">📭</div><h3>No applications yet</h3><p>Start browsing and applying for jobs!</p><button class="btn btn-primary mt-4" onclick="App.page('page-jobs')">Browse Jobs</button></div>`:
        myApps.map(a=>{
          const j=getJobs().find(j=>j.id===a.jobId);
          const idx=j? Math.abs(j.id.charCodeAt(1))%LOGOS.length:0;
          const d=Math.floor((Date.now()-a.appliedAt)/86400000);
          return `<div style="display:flex;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;">
            <div class="company-logo" style="background:${LOGOS[idx]};width:44px;height:44px;border-radius:10px;font-size:1.1rem;flex-shrink:0">${EMOJIS[idx]}</div>
            <div style="flex:1;min-width:200px">
              <div class="font-bold">${esc(j?.title||'Job deleted')}</div>
              <div class="text-sm text-muted">${esc(j?.company)} • ${esc(j?.location)}</div>
              <div class="text-sm text-muted mt-2">Applied ${d===0?'today':d+'d ago'} • Resume: ${esc(a.resumeName)}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span class="badge ${a.status==='pending'?'badge-amber':a.status==='reviewing'?'badge-blue':a.status==='accepted'?'badge-green':'badge-red'}" style="font-size:.82rem;padding:5px 14px">${a.status}</span>
              ${j?`<button class="btn btn-ghost btn-sm" onclick="App.viewJob('${j.id}')">View Job</button>`:''}
            </div>
          </div>`;
        }).join('')}
    </div>`;

  const candProfile = () => `
    <h3 style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">My Profile</h3>
    <div class="card">
      <form id="cand-profile-form">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Full Name</label><input id="cp-name" class="form-control" value="${esc(S.user.name)}"></div>
          <div class="form-group"><label class="form-label">Email</label><input id="cp-email" class="form-control" value="${esc(S.user.email)}" type="email"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Phone</label><input id="cp-phone" class="form-control" placeholder="+91 9876543210"></div>
          <div class="form-group"><label class="form-label">Location</label><input id="cp-loc" class="form-control" placeholder="Hyderabad, India"></div>
        </div>
        <div class="form-group"><label class="form-label">Professional Title</label><input id="cp-title" class="form-control" placeholder="e.g. Full Stack Developer"></div>
        <div class="form-group"><label class="form-label">Skills (comma separated)</label>
          <input id="cp-skills" class="form-control" value="${esc((S.user.skills||[]).join(', '))}" placeholder="React, Node.js, Python..."></div>
        <div class="form-group"><label class="form-label">Years of Experience</label>
          <select id="cp-exp" class="form-control"><option>0–1 years</option><option>1–3 years</option><option>3–5 years</option><option>5–8 years</option><option>8+ years</option></select></div>
        <div class="form-group"><label class="form-label">Bio / Summary</label><textarea id="cp-bio" class="form-control" rows="4" placeholder="Tell employers about yourself..."></textarea></div>
        <div class="form-group"><label class="form-label">LinkedIn</label><input id="cp-linkedin" class="form-control" placeholder="https://linkedin.com/in/yourname"></div>
        <div class="form-group"><label class="form-label">GitHub</label><input id="cp-github" class="form-control" placeholder="https://github.com/yourname"></div>
        <div class="upload-zone mt-4" onclick="document.getElementById('resume-upload').click()" style="margin-bottom:16px">
          <div class="icon">📄</div>
          <p><strong>Upload Resume</strong></p>
          <p>PDF, DOC, DOCX — Max 5MB</p>
          <input type="file" id="resume-upload" style="display:none" accept=".pdf,.doc,.docx">
        </div>
        <button type="submit" class="btn btn-primary">💾 Save Profile</button>
      </form>
    </div>`;

  /* ── Events wired after render ──────────────────────── */
  const wirePostJobForm = () => {
    document.getElementById('post-job-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const tags = document.getElementById('pj-tags').value.split(',').map(s=>s.trim()).filter(Boolean);
      const reqs = document.getElementById('pj-req').value.split('\n').map(s=>s.trim()).filter(Boolean);
      const job = {
        id:'j'+Date.now(), title: document.getElementById('pj-title').value.trim(),
        company: document.getElementById('pj-company').value.trim(),
        companyId: S.user.id, createdBy: S.user.id,
        location: document.getElementById('pj-location').value.trim(),
        type: document.getElementById('pj-type').value,
        mode: document.getElementById('pj-mode').value,
        category: document.getElementById('pj-cat').value,
        salary: document.getElementById('pj-salary').value||'Competitive',
        desc: document.getElementById('pj-desc').value.trim(),
        requirements: reqs, tags,
        deadline: document.getElementById('pj-deadline').value||'2025-12-31',
        posted: Date.now(), status:'active', applications:0,
      };
      const jobs=[...getJobs(), job]; saveJobs(jobs);
      toast('Job published! 🎉','success');
      setTimeout(()=>toast('📧 Confirmation email sent.','email'),800);
      renderEmployerDash('jobs');
    });

    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const users=getUsers();
      const ui=users.findIndex(u=>u.id===S.user.id);
      if(ui>=0){
        users[ui].name=document.getElementById('prof-name').value;
        users[ui].company=document.getElementById('prof-company').value;
        ls('jb_users',users); S.user=users[ui]; ls('jb_session',S.user);
        toast('Profile saved!','success');
      }
    });
  };

  const wireCandidateForm = () => {
    document.getElementById('cand-profile-form')?.addEventListener('submit',(e)=>{
      e.preventDefault();
      const users=getUsers();
      const ui=users.findIndex(u=>u.id===S.user.id);
      if(ui>=0){
        users[ui].name=document.getElementById('cp-name').value;
        ls('jb_users',users); S.user=users[ui]; ls('jb_session',S.user);
        toast('Profile updated! 🌿','success');
      }
    });
  };

  const updateAppStatus = (appId, status) => {
    const apps=getApps();
    const a=apps.find(a=>a.id===appId);
    if(a){ a.status=status; saveApps(apps); toast('Status updated.','success'); }
    if(status==='accepted') setTimeout(()=>toast('📧 Acceptance email sent to applicant.','email'),600);
    if(status==='rejected') setTimeout(()=>toast('📧 Rejection email sent to applicant.','email'),600);
  };

  const deleteJob = (id) => {
    if(!confirm('Delete this job posting?')) return;
    saveJobs(getJobs().filter(j=>j.id!==id));
    toast('Job deleted.','info');
    renderEmployerDash('jobs');
  };

  /* ── Helpers ────────────────────────────────────────── */
  const esc = (s) => { if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

  const animNum = (id, target) => {
    const el=document.getElementById(id); if(!el) return;
    let n=0; const step=Math.ceil(target/25);
    const t=setInterval(()=>{ n=Math.min(n+step,target); el.textContent=n.toLocaleString(); if(n>=target)clearInterval(t); },50);
  };

  const closeMobileMenu = () => document.getElementById('mobile-menu')?.classList.remove('open');

  /* ── MutationObserver for dynamic forms ─────────────── */
  const observer = new MutationObserver(() => { wirePostJobForm(); wireCandidateForm(); });

  /* ── Init ───────────────────────────────────────────── */
  const init = () => {
    seed();
    const sess=ls('jb_session');
    if(sess){ const u=getUsers().find(u=>u.id===sess.id); if(u) S.user=u; }
    renderNav();

    // Observe dash content for dynamic forms
    document.querySelectorAll('[id$="-dash"]').forEach(el => observer.observe(el,{childList:true,subtree:true}));

    // Search
    document.getElementById('search-input')?.addEventListener('input', filterJobs);
    document.getElementById('filter-cat')?.addEventListener('change', filterJobs);
    document.getElementById('sort-jobs')?.addEventListener('change', filterJobs);
    document.querySelectorAll('.filter-type,.filter-mode').forEach(cb=>cb.addEventListener('change',filterJobs));

    // Close dropdown on outside click
    document.addEventListener('click', () => document.getElementById('user-dropdown')?.classList.remove('open'));

    // Mobile hamburger
    document.getElementById('hamburger')?.addEventListener('click',()=>document.getElementById('mobile-menu')?.classList.toggle('open'));

    // Hero search
    document.getElementById('hero-search-btn')?.addEventListener('click', doHeroSearch);
    document.getElementById('hero-search')?.addEventListener('keydown',(e)=>{ if(e.key==='Enter') doHeroSearch(); });

    // Tag clicks
    document.querySelectorAll('.hero-tag').forEach(t=>t.addEventListener('click',()=>{
      document.getElementById('hero-search').value=t.textContent;
      doHeroSearch();
    }));

    initAuth();
    initHome();
    filterJobs();
    page('page-home');
  };

  return {
    init, page, logout, showAuth, openDash,
    filterJobs, viewJob, goBack, doHeroSearch, filterByCompany,
    openApply, applyNext, applyPrev, handleResumeUpload, submitApplication,
    renderEmployerDash, renderCandidateDash,
    updateAppStatus, deleteJob,
  };
})();

document.addEventListener('DOMContentLoaded', App.init);

// ─────────────────────────────────────────────
//  QuizMaster — Main App Logic
// ─────────────────────────────────────────────

const App = (() => {

  // ── State ──────────────────────────────────
  let state = {
    currentUser: null,
    users: [],
    quizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    userAnswers: [],
    timerInterval: null,
    timeLeft: 0,
    quizStarted: false,
  };

  // ── Seed Data ──────────────────────────────
  const seedData = () => {
    const users = JSON.parse(localStorage.getItem('qm_users') || '[]');
    if (!users.find(u => u.email === 'demo@quiz.com')) {
      users.push({ id: 'u0', name: 'Demo User', email: 'demo@quiz.com', password: 'demo123', avatar: 'D', joinedAt: Date.now() });
      localStorage.setItem('qm_users', JSON.stringify(users));
    }

    const quizzes = JSON.parse(localStorage.getItem('qm_quizzes') || '[]');
    if (quizzes.length === 0) {
      const seeds = [
        {
          id: 'q1', title: 'JavaScript Fundamentals', category: 'Programming',
          description: 'Test your knowledge of core JS concepts including variables, functions, and closures.',
          createdBy: 'u0', creatorName: 'Demo User', createdAt: Date.now() - 86400000 * 2,
          timeLimit: 120, attempts: 142,
          questions: [
            { id: 'qq1', text: 'Which keyword declares a block-scoped variable in JavaScript?', options: ['var', 'let', 'define', 'local'], correct: 1 },
            { id: 'qq2', text: 'What does "===" check compared to "=="?', options: ['Length only', 'Value only', 'Type and value', 'Reference only'], correct: 2 },
            { id: 'qq3', text: 'Which method is used to add an element to the end of an array?', options: ['push()', 'append()', 'add()', 'insert()'], correct: 0 },
            { id: 'qq4', text: 'What is a closure in JavaScript?', options: ['A syntax error', 'A function with access to its outer scope', 'A built-in method', 'A loop construct'], correct: 1 },
            { id: 'qq5', text: 'Which of these is NOT a primitive type in JavaScript?', options: ['string', 'boolean', 'object', 'number'], correct: 2 },
          ]
        },
        {
          id: 'q2', title: 'World Geography Quiz', category: 'General Knowledge',
          description: 'How well do you know the capitals, countries, and geography of the world?',
          createdBy: 'u0', creatorName: 'Demo User', createdAt: Date.now() - 86400000,
          timeLimit: 0, attempts: 89,
          questions: [
            { id: 'qq6', text: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2 },
            { id: 'qq7', text: 'Which is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
            { id: 'qq8', text: 'Which country has the most natural lakes?', options: ['Russia', 'Canada', 'USA', 'Brazil'], correct: 1 },
            { id: 'qq9', text: 'What is the tallest mountain in the world?', options: ['K2', 'Kilimanjaro', 'Mount Everest', 'Mont Blanc'], correct: 2 },
          ]
        },
        {
          id: 'q3', title: 'Science & Physics', category: 'Science',
          description: 'A fun quiz covering basic physics, chemistry and science trivia.',
          createdBy: 'u0', creatorName: 'Demo User', createdAt: Date.now() - 3600000,
          timeLimit: 180, attempts: 56,
          questions: [
            { id: 'qq10', text: 'What is the speed of light in a vacuum?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'], correct: 0 },
            { id: 'qq11', text: 'What is the chemical symbol for Gold?', options: ['Gd', 'Go', 'Au', 'Ag'], correct: 2 },
            { id: 'qq12', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Saturn', 'Mars'], correct: 3 },
          ]
        },
      ];
      localStorage.setItem('qm_quizzes', JSON.stringify(seeds));
    }
  };

  // ── Local Storage Helpers ──────────────────
  const getUsers = () => JSON.parse(localStorage.getItem('qm_users') || '[]');
  const getQuizzes = () => JSON.parse(localStorage.getItem('qm_quizzes') || '[]');
  const saveUsers = (u) => localStorage.setItem('qm_users', JSON.stringify(u));
  const saveQuizzes = (q) => localStorage.setItem('qm_quizzes', JSON.stringify(q));
  const getSession = () => JSON.parse(localStorage.getItem('qm_session') || 'null');
  const saveSession = (u) => localStorage.setItem('qm_session', JSON.stringify(u));
  const clearSession = () => localStorage.removeItem('qm_session');

  // ── Navigation ─────────────────────────────
  const showPage = (id) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
    updateNavActive(id);
  };

  const updateNavActive = (id) => {
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === id);
    });
  };

  // ── Auth ───────────────────────────────────
  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    state.currentUser = user;
    saveSession(user);
    renderNav();
    return { ok: true };
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    const user = {
      id: 'u' + Date.now(),
      name, email, password,
      avatar: name.charAt(0).toUpperCase(),
      joinedAt: Date.now()
    };
    users.push(user);
    saveUsers(users);
    state.currentUser = user;
    saveSession(user);
    renderNav();
    return { ok: true };
  };

  const logout = () => {
    state.currentUser = null;
    clearSession();
    renderNav();
    showPage('page-home');
    toast('Logged out successfully.', 'info');
  };

  // ── Nav Render ─────────────────────────────
  const renderNav = () => {
    const authArea = document.getElementById('nav-auth');
    const mobileAuthArea = document.getElementById('mobile-auth');
    if (!authArea) return;

    if (state.currentUser) {
      authArea.innerHTML = `
        <div class="user-menu">
          <div class="user-avatar" id="user-avatar-btn" title="${state.currentUser.name}">${state.currentUser.avatar}</div>
          <div class="user-dropdown" id="user-dropdown">
            <div class="dropdown-item"><span>👤</span> ${state.currentUser.name}</div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" onclick="App.nav('page-myquizzes')"><span>📋</span> My Quizzes</div>
            <div class="dropdown-item" onclick="App.nav('page-create')"><span>✏️</span> Create Quiz</div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item danger" onclick="App.logout()"><span>🚪</span> Logout</div>
          </div>
        </div>`;
      document.getElementById('user-avatar-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('user-dropdown').classList.toggle('open');
      });
      if (mobileAuthArea) mobileAuthArea.innerHTML = `<button onclick="App.logout()">🚪 Logout</button>`;
    } else {
      authArea.innerHTML = `
        <a class="btn btn-ghost btn-sm" onclick="App.nav('page-login')">Login</a>
        <a class="btn btn-primary btn-sm" onclick="App.nav('page-register')">Sign Up</a>`;
      if (mobileAuthArea) mobileAuthArea.innerHTML = `
        <a onclick="App.nav('page-login')">🔐 Login</a>
        <a onclick="App.nav('page-register')">✨ Sign Up</a>`;
    }
  };

  // ── Toast ──────────────────────────────────
  const toast = (msg, type = 'info') => {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.style.opacity = '0', 2800);
    setTimeout(() => t.remove(), 3200);
  };

  // ── Quiz CRUD ──────────────────────────────
  const saveQuiz = (quizData) => {
    const quizzes = getQuizzes();
    const existing = quizzes.findIndex(q => q.id === quizData.id);
    if (existing >= 0) quizzes[existing] = quizData;
    else quizzes.unshift(quizData);
    saveQuizzes(quizzes);
  };

  const deleteQuiz = (id) => {
    const quizzes = getQuizzes().filter(q => q.id !== id);
    saveQuizzes(quizzes);
  };

  // ── Render Quiz List ───────────────────────
  const renderQuizList = (containerId, filterFn = null) => {
    const quizzes = getQuizzes();
    const filtered = filterFn ? quizzes.filter(filterFn) : quizzes;
    const el = document.getElementById(containerId);
    if (!el) return;

    if (filtered.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-title">No quizzes found</div>
          <div class="empty-sub">Be the first to create a quiz!</div>
          <a class="btn btn-primary" onclick="App.nav('page-create')">Create Quiz</a>
        </div>`;
      return;
    }

    el.innerHTML = filtered.map(q => `
      <div class="quiz-card" onclick="App.openQuiz('${q.id}')">
        <div class="quiz-card-category">${q.category || 'General'}</div>
        <div class="quiz-card-title">${escHtml(q.title)}</div>
        <div class="quiz-card-desc">${escHtml(q.description || 'No description provided.')}</div>
        <div class="quiz-card-meta">
          <span>❓ ${q.questions.length} questions</span>
          ${q.timeLimit ? `<span>⏱ ${q.timeLimit}s</span>` : '<span>⏱ No limit</span>'}
          <span>🎯 ${q.attempts || 0} attempts</span>
        </div>
        <div class="quiz-card-actions">
          <button class="btn btn-primary btn-sm w-full" onclick="event.stopPropagation(); App.startQuiz('${q.id}')">
            ▶ Take Quiz
          </button>
          ${state.currentUser && q.createdBy === state.currentUser.id ? `
          <button class="btn btn-ghost btn-sm btn-icon" title="Edit" onclick="event.stopPropagation(); App.editQuiz('${q.id}')">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="event.stopPropagation(); App.deleteQuizConfirm('${q.id}')">🗑️</button>
          ` : ''}
        </div>
      </div>`).join('');
  };

  // ── Quiz Creation ──────────────────────────
  const initCreatePage = (editId = null) => {
    if (!state.currentUser) {
      toast('Please login to create a quiz.', 'error');
      nav('page-login'); return;
    }

    let editData = null;
    if (editId) {
      editData = getQuizzes().find(q => q.id === editId);
    }

    const page = document.getElementById('page-create');
    page.innerHTML = `
      <div class="container">
        <div class="page-header">
          <h2>${editData ? 'Edit Quiz' : '✨ Create New Quiz'}</h2>
          <p>${editData ? 'Update your quiz details and questions.' : 'Build a quiz with questions and multiple-choice answers.'}</p>
        </div>

        <div class="card mb-4">
          <h3 style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:20px;">Quiz Details</h3>
          <div class="form-group">
            <label class="form-label">Quiz Title *</label>
            <input type="text" id="qz-title" class="form-control" placeholder="Enter an engaging quiz title..." maxlength="100" value="${editData ? escHtml(editData.title) : ''}">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="qz-category" class="form-control">
                ${['General Knowledge','Science','Programming','History','Geography','Math','Sports','Entertainment','Other'].map(c =>
                  `<option ${editData && editData.category===c?'selected':''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Time Limit (seconds, 0 = none)</label>
              <input type="number" id="qz-time" class="form-control" placeholder="e.g. 120" min="0" max="3600" value="${editData ? editData.timeLimit : '0'}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="qz-desc" class="form-control" placeholder="Briefly describe what this quiz covers..." rows="3">${editData ? escHtml(editData.description||'') : ''}</textarea>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4" style="margin-bottom:16px;">
          <h3 style="font-family:'Syne',sans-serif;font-weight:700;">Questions</h3>
          <button class="btn btn-ghost btn-sm" onclick="App.addQuestion()">+ Add Question</button>
        </div>

        <div id="questions-container"></div>

        <div style="margin-top:24px;" class="flex gap-3 justify-between flex-wrap">
          <button class="btn btn-ghost" onclick="App.nav('page-myquizzes')">Cancel</button>
          <div class="flex gap-3">
            <button class="btn btn-ghost" onclick="App.addQuestion()">+ Add Question</button>
            <button class="btn btn-primary btn-lg" onclick="App.saveQuizForm('${editData ? editData.id : ''}')">
              ${editData ? '💾 Save Changes' : '🚀 Publish Quiz'}
            </button>
          </div>
        </div>
      </div>`;

    window._questions = editData ? JSON.parse(JSON.stringify(editData.questions)) : [];
    if (editData) { editData.questions.forEach((_, i) => renderQuestionCard(i)); }
    else { addQuestion(); }

    showPage('page-create');
  };

  window._questions = [];
  let _qCounter = 0;

  const addQuestion = () => {
    const q = { id: 'q' + Date.now() + _qCounter++, text: '', options: ['', '', '', ''], correct: 0 };
    window._questions.push(q);
    renderQuestionCard(window._questions.length - 1);
  };

  const renderQuestionCard = (idx) => {
    const q = window._questions[idx];
    const container = document.getElementById('questions-container');
    if (!container) return;

    // Remove old card if exists
    const old = document.getElementById(`qcard-${q.id}`);
    if (old) old.remove();

    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `qcard-${q.id}`;
    card.innerHTML = `
      <div class="question-header">
        <span class="question-num">Question ${idx + 1}</span>
        <button class="btn btn-danger btn-sm btn-icon" onclick="App.removeQuestion('${q.id}')" title="Remove">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Question Text *</label>
        <textarea class="form-control q-text" placeholder="Type your question here..." rows="2"
          onchange="App.updateQuestion('${q.id}','text',this.value)"
          oninput="App.updateQuestion('${q.id}','text',this.value)">${escHtml(q.text)}</textarea>
      </div>
      <label class="form-label">Answer Options *</label>
      <div class="options-grid">
        ${['A','B','C','D'].map((ltr, i) => `
          <div class="option-input">
            <span class="option-label-badge">${ltr}</span>
            <input type="text" class="form-control" placeholder="Option ${ltr}..." value="${escHtml(q.options[i] || '')}"
              oninput="App.updateOption('${q.id}',${i},this.value)">
          </div>`).join('')}
      </div>
      <div class="correct-answer-select">
        <label class="form-label">Correct Answer</label>
        <select class="form-control" onchange="App.updateQuestion('${q.id}','correct',parseInt(this.value))">
          ${['A','B','C','D'].map((ltr, i) => `<option value="${i}" ${q.correct===i?'selected':''}>${ltr}: ${escHtml(q.options[i]||'(empty)')}</option>`).join('')}
        </select>
      </div>`;
    container.appendChild(card);
  };

  const updateQuestion = (id, key, val) => {
    const q = window._questions.find(q => q.id === id);
    if (q) q[key] = val;
    // refresh correct-answer select
    if (key === 'correct') return;
  };

  const updateOption = (id, idx, val) => {
    const q = window._questions.find(q => q.id === id);
    if (q) {
      q.options[idx] = val;
      // update select label
      const card = document.getElementById(`qcard-${id}`);
      if (card) {
        const sel = card.querySelector('select');
        if (sel) sel.options[idx].text = ['A','B','C','D'][idx] + ': ' + (val || '(empty)');
      }
    }
  };

  const removeQuestion = (id) => {
    if (window._questions.length <= 1) { toast('At least 1 question required.', 'error'); return; }
    window._questions = window._questions.filter(q => q.id !== id);
    document.getElementById(`qcard-${id}`)?.remove();
    // re-number
    document.querySelectorAll('.question-card').forEach((card, i) => {
      const numEl = card.querySelector('.question-num');
      if (numEl) numEl.textContent = `Question ${i + 1}`;
    });
  };

  const saveQuizForm = (editId = '') => {
    const title = document.getElementById('qz-title').value.trim();
    const category = document.getElementById('qz-category').value;
    const timeLimit = parseInt(document.getElementById('qz-time').value) || 0;
    const description = document.getElementById('qz-desc').value.trim();

    if (!title) { toast('Please enter a quiz title.', 'error'); return; }
    if (window._questions.length === 0) { toast('Add at least one question.', 'error'); return; }

    for (let i = 0; i < window._questions.length; i++) {
      const q = window._questions[i];
      if (!q.text.trim()) { toast(`Question ${i+1}: Enter the question text.`, 'error'); return; }
      const filled = q.options.filter(o => o.trim()).length;
      if (filled < 2) { toast(`Question ${i+1}: Add at least 2 options.`, 'error'); return; }
    }

    const quizData = {
      id: editId || ('qz' + Date.now()),
      title, category, timeLimit, description,
      createdBy: state.currentUser.id,
      creatorName: state.currentUser.name,
      createdAt: editId ? (getQuizzes().find(q=>q.id===editId)?.createdAt || Date.now()) : Date.now(),
      questions: window._questions,
      attempts: editId ? (getQuizzes().find(q=>q.id===editId)?.attempts || 0) : 0,
    };

    saveQuiz(quizData);
    toast(editId ? 'Quiz updated!' : 'Quiz published! 🎉', 'success');
    nav('page-myquizzes');
  };

  const editQuiz = (id) => { initCreatePage(id); };

  const deleteQuizConfirm = (id) => {
    if (confirm('Delete this quiz? This cannot be undone.')) {
      deleteQuiz(id);
      toast('Quiz deleted.', 'info');
      renderQuizList('quiz-grid-all');
      renderQuizList('my-quiz-grid', q => q.createdBy === state.currentUser?.id);
    }
  };

  // ── Open Quiz (detail) ─────────────────────
  const openQuiz = (id) => {
    const quiz = getQuizzes().find(q => q.id === id);
    if (!quiz) { toast('Quiz not found.', 'error'); return; }
    state.currentQuiz = quiz;

    const page = document.getElementById('page-quiz-detail');
    page.innerHTML = `
      <div class="container">
        <div class="card" style="margin-bottom:20px;">
          <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;">
            <div style="flex:1">
              <div class="quiz-card-category" style="margin-bottom:8px;">${quiz.category}</div>
              <div style="font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;margin-bottom:8px;">${escHtml(quiz.title)}</div>
              <div style="color:var(--text-muted);margin-bottom:16px;">${escHtml(quiz.description || '')}</div>
              <div class="quiz-card-meta">
                <span>👤 ${escHtml(quiz.creatorName)}</span>
                <span>❓ ${quiz.questions.length} questions</span>
                ${quiz.timeLimit ? `<span>⏱ ${quiz.timeLimit}s limit</span>` : '<span>⏱ No time limit</span>'}
                <span>🎯 ${quiz.attempts} attempts</span>
              </div>
            </div>
          </div>
          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-lg" onclick="App.startQuiz('${quiz.id}')">▶ Start Quiz</button>
            <button class="btn btn-ghost" onclick="App.nav('page-quizzes')">← Back to Quizzes</button>
          </div>
        </div>
        <div class="card">
          <h3 style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:16px;">Questions Preview</h3>
          ${quiz.questions.map((q, i) => `
            <div style="padding:12px 0;border-bottom:1px solid var(--border-light);">
              <div style="font-weight:600;margin-bottom:6px;">${i+1}. ${escHtml(q.text)}</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${q.options.map((o, oi) => `<span class="badge ${oi===q.correct?'badge-green':'badge-purple'}">${['A','B','C','D'][oi]}: ${escHtml(o)}</span>`).join('')}
              </div>
            </div>`).join('')}
        </div>
      </div>`;
    showPage('page-quiz-detail');
  };

  // ── Start Quiz ─────────────────────────────
  const startQuiz = (id) => {
    const quiz = getQuizzes().find(q => q.id === id);
    if (!quiz) { toast('Quiz not found.', 'error'); return; }

    // increment attempts
    const quizzes = getQuizzes();
    const qz = quizzes.find(q => q.id === id);
    if (qz) { qz.attempts = (qz.attempts || 0) + 1; saveQuizzes(quizzes); }

    state.currentQuiz = quiz;
    state.currentQuestionIndex = 0;
    state.userAnswers = new Array(quiz.questions.length).fill(null);
    state.quizStarted = true;

    renderQuizTakingPage();
    showPage('page-take');

    if (quiz.timeLimit > 0) startTimer(quiz.timeLimit);
  };

  const renderQuizTakingPage = () => {
    const quiz = state.currentQuiz;
    const page = document.getElementById('page-take');
    page.innerHTML = `
      <div class="container">
        <div class="quiz-take-header">
          <div class="flex justify-between items-center flex-wrap gap-3">
            <div>
              <div class="quiz-take-title">${escHtml(quiz.title)}</div>
              <div class="quiz-take-meta">${quiz.category} • ${quiz.questions.length} questions</div>
            </div>
            <div id="timer-display" class="${quiz.timeLimit ? '' : 'hidden'}">
              <div class="timer-badge" id="timer-badge">⏱ --:--</div>
            </div>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-label">
              <span id="progress-text">Question 1 of ${quiz.questions.length}</span>
              <span id="progress-pct">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill" style="width:0%"></div>
            </div>
          </div>
        </div>
        <div id="question-area"></div>
        <div class="quiz-nav" id="quiz-nav">
          <button class="btn btn-ghost" id="btn-prev" onclick="App.prevQuestion()" disabled>← Previous</button>
          <div id="btn-skip" style="display:flex;gap:8px;">
            <button class="btn btn-ghost" onclick="App.skipQuestion()">Skip →</button>
          </div>
          <button class="btn btn-primary" id="btn-next" onclick="App.nextQuestion()">Next →</button>
        </div>
      </div>`;
    renderQuestion();
  };

  const renderQuestion = () => {
    const quiz = state.currentQuiz;
    const idx = state.currentQuestionIndex;
    const q = quiz.questions[idx];
    const selected = state.userAnswers[idx];
    const answered = selected !== null;

    // Progress
    const pct = Math.round((idx / quiz.questions.length) * 100);
    document.getElementById('progress-text').textContent = `Question ${idx + 1} of ${quiz.questions.length}`;
    document.getElementById('progress-pct').textContent = pct + '%';
    document.getElementById('progress-fill').style.width = pct + '%';

    // Nav buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSkip = document.getElementById('btn-skip');
    btnPrev.disabled = idx === 0;
    const isLast = idx === quiz.questions.length - 1;
    btnNext.textContent = isLast ? '🏁 Finish Quiz' : 'Next →';
    btnNext.className = isLast ? 'btn btn-accent' : 'btn btn-primary';
    btnSkip.style.display = answered ? 'none' : 'flex';

    const area = document.getElementById('question-area');
    area.innerHTML = `
      <div class="question-container">
        <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;font-weight:600;">QUESTION ${idx+1}</div>
        <div class="question-text">${escHtml(q.text)}</div>
        <div class="options-list" id="options-list">
          ${q.options.map((opt, oi) => {
            let cls = '';
            if (answered) {
              if (oi === q.correct) cls = 'correct';
              else if (oi === selected && selected !== q.correct) cls = 'wrong';
              else if (oi === selected) cls = 'selected';
            } else if (oi === selected) cls = 'selected';
            return `
            <button class="option-btn ${cls}" onclick="App.selectAnswer(${oi})" ${answered ? 'disabled' : ''}>
              <div class="option-circle">${['A','B','C','D'][oi]}</div>
              <span>${escHtml(opt)}</span>
              ${answered && oi === q.correct ? '<span style="margin-left:auto">✓</span>' : ''}
              ${answered && oi === selected && oi !== q.correct ? '<span style="margin-left:auto">✗</span>' : ''}
            </button>`;
          }).join('')}
        </div>
        ${answered ? `
          <div class="feedback-box ${selected === q.correct ? 'correct-fb' : 'wrong-fb'}">
            ${selected === q.correct ? '🎉 Correct!' : `❌ Incorrect. Correct: ${['A','B','C','D'][q.correct]}: ${escHtml(q.options[q.correct])}`}
          </div>` : ''}
      </div>`;
  };

  const selectAnswer = (optIdx) => {
    if (state.userAnswers[state.currentQuestionIndex] !== null) return;
    state.userAnswers[state.currentQuestionIndex] = optIdx;
    renderQuestion();
  };

  const nextQuestion = () => {
    const quiz = state.currentQuiz;
    const isLast = state.currentQuestionIndex === quiz.questions.length - 1;
    if (isLast) { showResults(); return; }
    state.currentQuestionIndex++;
    renderQuestion();
  };

  const prevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderQuestion();
    }
  };

  const skipQuestion = () => {
    const quiz = state.currentQuiz;
    const isLast = state.currentQuestionIndex === quiz.questions.length - 1;
    if (isLast) { showResults(); return; }
    state.currentQuestionIndex++;
    renderQuestion();
  };

  // ── Timer ──────────────────────────────────
  const startTimer = (seconds) => {
    state.timeLeft = seconds;
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      const badge = document.getElementById('timer-badge');
      if (!badge) { clearInterval(state.timerInterval); return; }
      const m = Math.floor(state.timeLeft / 60).toString().padStart(2,'0');
      const s = (state.timeLeft % 60).toString().padStart(2,'0');
      badge.textContent = `⏱ ${m}:${s}`;
      badge.className = `timer-badge ${state.timeLeft <= 10 ? 'urgent' : ''}`;
      if (state.timeLeft <= 0) { clearInterval(state.timerInterval); toast('Time\'s up!', 'error'); setTimeout(showResults, 800); }
    }, 1000);
  };

  // ── Results ────────────────────────────────
  const showResults = () => {
    clearInterval(state.timerInterval);
    const quiz = state.currentQuiz;
    const answers = state.userAnswers;
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const total = quiz.questions.length;
    const pct = Math.round((correct / total) * 100);
    const skipped = answers.filter(a => a === null).length;

    let grade, gradeColor, message;
    if (pct >= 90) { grade = '🏆 Excellent!'; gradeColor = '#FFD166'; message = 'Outstanding performance! You really know your stuff.'; }
    else if (pct >= 75) { grade = '🌟 Great Job!'; gradeColor = 'var(--success)'; message = 'Well done! You have a strong grasp of the material.'; }
    else if (pct >= 50) { grade = '👍 Good Effort'; gradeColor = 'var(--primary-light)'; message = 'Not bad! A little more practice and you\'ll ace it.'; }
    else { grade = '📚 Keep Studying'; gradeColor = 'var(--accent)'; message = 'Don\'t give up! Review the material and try again.'; }

    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference * (1 - pct / 100);
    const strokeColor = pct >= 75 ? '#06D6A0' : pct >= 50 ? '#6C3FE8' : '#EF476F';

    const page = document.getElementById('page-results');
    page.innerHTML = `
      <div class="container">
        <div class="results-hero">
          <div class="score-ring">
            <svg viewBox="0 0 120 120" width="140" height="140">
              <circle class="ring-bg" cx="60" cy="60" r="54"/>
              <circle class="ring-fill" cx="60" cy="60" r="54"
                stroke="${strokeColor}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashOffset}"
                style="stroke-dashoffset:${dashOffset}"/>
            </svg>
            <div class="score-text">
              <div class="score-num">${pct}%</div>
              <div class="score-label">Score</div>
            </div>
          </div>
          <div class="result-grade" style="color:${gradeColor}">${grade}</div>
          <div class="result-message">${message}</div>
          <div class="results-breakdown">
            <div class="breakdown-item">
              <div class="breakdown-num color-success">${correct}</div>
              <div class="breakdown-label">Correct</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-num color-danger">${total - correct - skipped}</div>
              <div class="breakdown-label">Wrong</div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-num color-muted">${skipped}</div>
              <div class="breakdown-label">Skipped</div>
            </div>
          </div>
          <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="App.startQuiz('${quiz.id}')">🔄 Retake Quiz</button>
            <button class="btn btn-ghost" onclick="App.nav('page-quizzes')">Browse Quizzes</button>
          </div>
        </div>

        <div class="card">
          <h3 style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:20px;">Answer Review</h3>
          <div class="review-list">
            ${quiz.questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correct;
              const isSkipped = userAns === null;
              return `
              <div class="review-item ${isSkipped ? '' : isCorrect ? 'correct' : 'wrong'}">
                <div class="review-q">${i+1}. ${escHtml(q.text)}</div>
                <div class="review-answers">
                  ${isSkipped ? '<span style="color:var(--text-dim)">⏭ Skipped</span>' : `
                    <span class="${isCorrect?'review-correct':'review-wrong'}">
                      Your answer: ${['A','B','C','D'][userAns]}: ${escHtml(q.options[userAns])} ${isCorrect?'✓':'✗'}
                    </span>`}
                  ${!isCorrect ? `<br><span class="review-correct">✓ Correct: ${['A','B','C','D'][q.correct]}: ${escHtml(q.options[q.correct])}</span>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    showPage('page-results');
  };

  // ── Escape HTML ────────────────────────────
  const escHtml = (str) => {
    if (str === undefined || str === null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  };

  // ── Nav helper ─────────────────────────────
  const nav = (pageId) => {
    closeMobileMenu();
    if (pageId === 'page-create') { initCreatePage(); return; }
    if (pageId === 'page-quizzes') {
      renderQuizList('quiz-grid-all');
    }
    if (pageId === 'page-myquizzes') {
      if (!state.currentUser) { toast('Please login first.', 'error'); showPage('page-login'); return; }
      renderQuizList('my-quiz-grid', q => q.createdBy === state.currentUser.id);
    }
    showPage(pageId);
  };

  const closeMobileMenu = () => {
    document.getElementById('mobile-menu')?.classList.remove('open');
  };

  // ── Auth Forms ─────────────────────────────
  const initAuthForms = () => {
    // Login
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const result = login(email, password);
      if (result.ok) {
        toast('Welcome back! 🎉', 'success');
        nav('page-home');
      } else {
        document.getElementById('login-error').textContent = result.msg;
      }
    });

    // Register
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      const errEl = document.getElementById('reg-error');

      if (!name || !email || !password) { errEl.textContent = 'All fields are required.'; return; }
      if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; return; }
      if (password !== confirm) { errEl.textContent = 'Passwords do not match.'; return; }

      const result = register(name, email, password);
      if (result.ok) {
        toast('Account created! Welcome 🎉', 'success');
        nav('page-home');
      } else {
        errEl.textContent = result.msg;
      }
    });
  };

  // ── Search ─────────────────────────────────
  const initSearch = () => {
    const input = document.getElementById('quiz-search');
    const catFilter = document.getElementById('cat-filter');
    if (!input) return;

    const doFilter = () => {
      const q = input.value.toLowerCase();
      const cat = catFilter?.value || '';
      renderQuizList('quiz-grid-all', (quiz) => {
        const matchQ = !q || quiz.title.toLowerCase().includes(q) || (quiz.description||'').toLowerCase().includes(q);
        const matchC = !cat || quiz.category === cat;
        return matchQ && matchC;
      });
    };

    input.addEventListener('input', doFilter);
    catFilter?.addEventListener('change', doFilter);
  };

  // ── Init ───────────────────────────────────
  const init = () => {
    seedData();

    // Restore session
    const session = getSession();
    if (session) {
      const user = getUsers().find(u => u.id === session.id);
      if (user) state.currentUser = user;
    }

    renderNav();
    initAuthForms();
    renderQuizList('quiz-grid-all');
    initSearch();

    // Home page quiz preview
    renderQuizList('home-quiz-grid');

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      document.getElementById('user-dropdown')?.classList.remove('open');
    });

    // Mobile menu toggle
    document.getElementById('hamburger')?.addEventListener('click', () => {
      document.getElementById('mobile-menu')?.classList.toggle('open');
    });

    showPage('page-home');
  };

  return {
    init, nav, login, logout, register,
    addQuestion, removeQuestion, updateQuestion, updateOption,
    saveQuizForm, editQuiz, deleteQuizConfirm, openQuiz,
    startQuiz, selectAnswer, nextQuestion, prevQuestion, skipQuestion,
    showResults, toast,
  };
})();

document.addEventListener('DOMContentLoaded', App.init);

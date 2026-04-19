# 🌿 HireGreen — Job Board Platform

A complete, production-ready job board website built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Home Page** — Hero, featured jobs, categories, company logos, how-it-works
- **Job Listings** — Searchable, filterable job board with sidebar filters
- **Job Detail** — Full job page with requirements, skills, company info
- **Employer Dashboard** — Post jobs, manage listings, review applications, update status
- **Candidate Dashboard** — Profile management, track all applications
- **Application Process** — 4-step wizard: Profile → Cover Letter → Resume → Review
- **Email Notifications** — Simulated email toasts for application/status events
- **User Authentication** — Login / Register with role selection (Employer / Candidate)
- **Mobile Responsive** — Fully responsive across all screen sizes

## 🎨 Design

- Light green + teal color palette
- Fraunces (serif display) + Plus Jakarta Sans (body)
- Card-based layout with subtle green shadows
- Smooth animations and micro-interactions

## 📁 File Structure

```
jobboard/
├── index.html        ← Main app (all pages)
├── css/
│   └── style.css     ← Complete design system
└── js/
    └── app.js        ← Full application logic
```

## 💾 Data Storage

All data is stored in browser `localStorage`:
- `jb_users` — User accounts
- `jb_jobs` — Job listings
- `jb_applications` — Job applications
- `jb_session` — Current user session

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Employer | employer@demo.com | demo123 |
| Job Seeker | candidate@demo.com | demo123 |

## 🌐 Deployment

### Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `jobboard/` folder onto the Netlify dashboard
3. Your site is live instantly!

### GitHub Pages
1. Create a new GitHub repository
2. Upload all files
3. Go to Settings → Pages → Source: main branch
4. Your site is live at `https://yourusername.github.io/repo-name`

### 000WebHost / Hostinger
1. Sign up for free hosting
2. Upload files via File Manager
3. Set `index.html` as the homepage

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Google Fonts (Fraunces, Plus Jakarta Sans)
- **Storage**: Browser localStorage
- **No dependencies** — works offline, no build step needed

## 📱 Browser Support

Works on all modern browsers: Chrome, Firefox, Safari, Edge

---

Built with ❤️ for internship project — HireGreen 2025

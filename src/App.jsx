import { useEffect, useState } from 'react'
import Canvas3D from './components/Canvas3D.jsx'
import { createHeroScene } from './three/HeroScene.js'
import useScrollReveal from './hooks/useScrollReveal'
import initCustomCursor from './utils/customCursor'
import { initTilt } from './utils/tilt'
import { initCounters } from './utils/animateCounter'
import profileNotebook from './assets/Perfil - Busto com notebook.png'
import profileCoding from './assets/Perfil - Busto programando.png'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#skills', label: 'Skills' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#experiencia', label: 'Experiência' },
  { href: '#blog', label: 'Blog' },
  { href: '#contato', label: 'Contato' },
]

const SKILL_TABS = ['Frontend', 'Backend', 'Cloud', 'DevOps', 'Observability', 'AI', 'Data Engineering']

const SKILLS_BY_TAB = {
  Frontend: [
    { name: 'TypeScript', icon: 'TS', color: '#3b82f6' },
    { name: 'JavaScript', icon: 'JS', color: '#f7df1e' },
    { name: 'Vue.js', icon: '▲', color: '#42b883' },
    { name: 'React', icon: '⚛', color: '#61dafb' },
    { name: 'HTML5', icon: '5', color: '#e34f26' },
    { name: 'CSS3', icon: '3', color: '#2965f1' },
    { name: 'Tailwind CSS', icon: '~', color: '#38bdf8' },
    { name: 'Sass', icon: 'S', color: '#cc6699' },
    { name: 'Vite', icon: '⚡', color: '#a78bfa' },
  ],
  Backend: [
    { name: 'Node.js', icon: 'N', color: '#3c873a' },
    { name: 'Python', icon: 'Py', color: '#3776ab' },
    { name: 'Bash', icon: '$', color: '#8b93a7' },
    { name: 'REST APIs', icon: '{}', color: '#38bdf8' },
  ],
  Cloud: [
    { name: 'AWS', icon: 'AWS', color: '#ff9900' },
    { name: 'Azure', icon: 'Az', color: '#0078d4' },
    { name: 'GCP', icon: 'GCP', color: '#4285f4' },
    { name: 'Terraform', icon: 'Tf', color: '#7b42bc' },
  ],
  DevOps: [
    { name: 'Docker', icon: 'Do', color: '#2496ed' },
    { name: 'Kubernetes', icon: 'K8s', color: '#326ce5' },
    { name: 'GitLab CI/CD', icon: 'CI', color: '#fc6d26' },
    { name: 'Ansible', icon: 'An', color: '#ee0000' },
  ],
  Observability: [
    { name: 'Grafana', icon: 'Gr', color: '#f46800' },
    { name: 'Zabbix', icon: 'Zx', color: '#d40000' },
    { name: 'Dynatrace', icon: 'Dy', color: '#1496ff' },
    { name: 'PagerDuty', icon: 'Pd', color: '#06ac38' },
  ],
  AI: [
    { name: 'AI Ops', icon: 'AI', color: '#8b5cf6' },
    { name: 'LLMs', icon: 'LLM', color: '#38bdf8' },
    { name: 'Automação', icon: '⚙', color: '#a78bfa' },
  ],
  'Data Engineering': [
    { name: 'SQL', icon: 'SQL', color: '#00758f' },
    { name: 'ETL', icon: 'ETL', color: '#8b93a7' },
    { name: 'Dashboards', icon: '▤', color: '#38bdf8' },
  ],
}

const PROJECTS = [
  { tag: 'AI Ops', title: 'AI Ops Platform', desc: 'Plataforma de AIOps com detecção de anomalias, alertas inteligentes e recomendações automáticas.' },
  { tag: 'Telecom', title: 'Telecom Operations Center', desc: 'Central de operações para redes de telecom, com dashboards em tempo real e SLAs monitorados.' },
  { tag: 'Observability', title: 'Intelligent Observability Platform', desc: 'Plataforma de observabilidade que unifica métricas, logs e traces com insights de IA.' },
  { tag: 'DevOps', title: 'DevOps Automation Platform', desc: 'Automação de pipelines, GitOps e infraestrutura como código com métricas de confiabilidade.' },
  { tag: 'Cloud', title: 'Cloud Reliability Dashboard', desc: 'Dashboard executivo com métricas de confiabilidade, custos, performance e infraestrutura multi-cloud.' },
]

const EXPERIENCES = [
  {
    badge: 'Atual',
    logo: 'vivo',
    company: 'Telefônica Brasil',
    role: 'Full Stack Engineer',
    focus: 'AI, DevOps & Automation',
    period: '08/2025 — Atual',
    bullets: [
      'Desenvolvimento de sistemas internos escaláveis e ferramentas de gestão',
      'APIs, integrações e automações',
      'Dashboards operacionais e relatórios',
      'Ambientes críticos e alta disponibilidade',
    ],
  },
  {
    badge: null,
    logo: 'EQUIFAX',
    company: 'BoaVista',
    role: 'Site Reliability Engineer',
    focus: 'Cloud, Automation & Observability',
    period: '08/2024 — 08/2025',
    bullets: [
      'Observabilidade e ferramentas de gestão',
      'Automação com Python e Bash',
      'CI/CD e práticas de DevOps',
      'Análise de incidentes e troubleshooting',
    ],
  },
  {
    badge: null,
    logo: 'EQUIFAX',
    company: 'BoaVista',
    role: 'Infrastructure & Observability Analyst',
    focus: null,
    period: '10/2020 — 08/2024',
    bullets: [
      'Monitoramento e suporte de infraestrutura crítica',
      'Análise de incidentes e causa raiz',
      'Colaboração com times de SRE e Segurança',
      'Dynatrace, Grafana, Zabbix, PagerDuty',
    ],
  },
]

const BLOG_POSTS = [
  { tag: 'OBSERVABILITY', title: 'Como implementar observabilidade de verdade', date: '24 Mai 2024', time: '5 min de leitura' },
  { tag: 'KUBERNETES', title: 'Kubernetes na prática: escalando aplicações com segurança', date: '18 Mai 2024', time: '7 min de leitura' },
  { tag: 'AI OPS', title: 'AIOps: o futuro da operação de TI já começou', date: '10 Mai 2024', time: '6 min de leitura' },
  { tag: 'DEVOPS', title: 'Pipelines como código: boas práticas com GitLab CI/CD', date: '02 Mai 2024', time: '6 min de leitura' },
  { tag: 'TELECOM', title: 'Desafios de engenharia em sistemas de Telecom', date: '25 Abr 2024', time: '8 min de leitura' },
]

const ANOMALIES = [
  { label: 'CPU Usage', value: 92 },
  { label: 'Memory Leak', value: 87 },
  { label: 'Latency High', value: 75 },
  { label: 'Disk I/O', value: 68 },
]

const LOGS = [
  { time: '10:24:31', level: 'INFO', msg: 'Service A healthy' },
  { time: '10:24:29', level: 'WARN', msg: 'Service B latency detected' },
  { time: '10:24:12', level: 'INFO', msg: 'Deploy staging finished' },
  { time: '10:23:58', level: 'AUTO', msg: 'Auto remediation triggered' },
]

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#home" className="header__logo">
          <span className="header__mark">RN</span>
          <span className="header__name">
            RENATO<br />NAGASSAKI
          </span>
        </a>

        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </nav>

        <div className="header__actions">
          <button className="btn btn--outline btn--sm">
            Baixar CV <span className="icon-download">↓</span>
          </button>
          <button className="icon-btn" aria-label="Alternar tema">◐</button>
          <button className="icon-btn header__burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>☰</button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="hero section">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">Full Stack &amp; AI Engineer</p>
          <h1 className="hero__title">
            Construo <span className="text-grad">sistemas inteligentes</span><br />
            para ambientes críticos
          </h1>
          <p className="hero__subtitle">
            Full Stack &amp; AI Engineer · DevOps · SRE · Cloud · Observability
          </p>
          <div className="hero__cta">
            <a href="#projetos" className="btn btn--primary">Ver Projetos</a>
            <a href="#contato" className="btn btn--ghost">Entrar em Contato</a>
          </div>
          <div className="hero__stats">
            <div><strong className="count" data-count-to="99">0</strong><span>% Uptime</span></div>
            <div><strong className="count" data-count-to="20">0</strong><span>Projetos</span></div>
            <div><strong className="count" data-count-to="7">0</strong><span>Anos</span></div>
            <div><strong className="count" data-count-to="24">0</strong><span>Horas / dia</span></div>
          </div>
        </div>

        <div className="hero__visual">
          <Canvas3D className="hero__canvas" sceneFactory={createHeroScene} />
          <div className="floating-card fc--1"><span className="floating-card__label">AI Ops</span><strong>12</strong><span className="floating-card__sub">Automações desenvolvidas</span></div>
          <div className="floating-card fc--2"><span className="floating-card__label">SRE</span><strong>98%</strong><span className="floating-card__sub">Uptime médio</span></div>
          <div className="floating-card fc--3"><span className="floating-card__label">Cloud</span><strong>47</strong><span className="floating-card__sub">Recursos provisionados</span></div>
          <div className="floating-card fc--4"><span className="floating-card__label">Observability</span><strong>2.4M</strong><span className="floating-card__sub">eventos processados</span></div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre" className="about section">
      <div className="container about__grid">
        <div className="about__content">
          <p className="eyebrow">Sobre mim</p>
          <h2>Apaixonado por resolver problemas complexos com tecnologia</h2>
          <p className="about__text">
            Atuo na criação de sistemas escaláveis, automações inteligentes e soluções orientadas a
            dados em ambientes críticos. Minha missão é gerar impacto real através da engenharia,
            automação e IA.
          </p>
          <a href="#experiencia" className="btn btn--primary">Saiba mais</a>

          <div className="about__stats">
            <div><strong className="count" data-count-to="99">0</strong><span>Sistemas Críticos</span></div>
            <div><strong className="count" data-count-to="20">0</strong><span>Entregas</span></div>
            <div><strong>Telecom</strong><span>Domínio</span></div>
            <div><strong>AI &amp; Automação</strong><span>Foco</span></div>
          </div>

        </div>

        <div className="about__visual">
          <div className="about__panel tilt-card">
            <div className="about__portrait-wrap">
              <img className="about__portrait" src={profileNotebook} alt="Renato Nagassaki com notebook" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  const [active, setActive] = useState('Frontend')
  return (
    <section id="skills" className="skills section">
      <div className="container">
        <h2 className="text-center">Tecnologias que uso para construir o <span className="text-grad">futuro</span></h2>

        <div className="skills__tabs">
          {SKILL_TABS.map((tab) => (
            <button
              key={tab}
              className={`skills__tab ${active === tab ? 'is-active' : ''}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="skills__grid">
          {SKILLS_BY_TAB[active].map((s) => (
            <div className="skill-card" key={s.name}>
              <span className="skill-card__icon" style={{ color: s.color }}>{s.icon}</span>
              <span>{s.name}</span>
            </div>
          ))}
        </div>

        <div className="skills__footer">
          <div><strong>30+</strong><span>Tecnologias</span></div>
          <div><strong>Contínuo</strong><span>Aprendizado</span></div>
          <div><strong>Engenharia</strong><span>Como padrão</span></div>
          <div><strong>Impacto</strong><span>Como objetivo</span></div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projetos" className="projects section">
      <div className="container">
        <div className="projects__head">
          <div>
            <p className="eyebrow">Projetos em destaque</p>
            <h2>Soluções reais para problemas complexos</h2>
          </div>
          <div className="projects__filters">
            <button className="pill pill--active">Todos</button>
            <button className="icon-btn">‹</button>
            <button className="icon-btn">›</button>
          </div>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((p) => (
            <article className="project-card" key={p.title}>
              <div className="project-card__preview">
                <span className="project-card__tag">{p.tag}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <a href="#projetos" className="project-card__link">Ver projeto →</a>
            </article>
          ))}
        </div>

        <div className="dots">
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i === 0 ? 'is-active' : ''} />)}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experiencia" className="experience section">
      <div className="container">
        <p className="eyebrow">Experiência</p>
        <h2>Minha jornada profissional</h2>

        <div className="timeline">
          {EXPERIENCES.map((e, i) => (
            <div className="timeline__item" key={i}>
              <span className="timeline__dot" />
              <div className="timeline-card">
                {e.badge && <span className="timeline-card__badge">{e.badge}</span>}
                <div className={`timeline-card__logo ${e.logo === 'vivo' ? 'logo--vivo' : 'logo--equifax'}`}>{e.logo}</div>
                <p className="timeline-card__company">{e.company}</p>
                <h3>{e.role}</h3>
                {e.focus && <p className="timeline-card__focus">{e.focus}</p>}
                <p className="timeline-card__period">{e.period}</p>
                <ul>
                  {e.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AiLab() {
  return (
    <section id="ai-lab" className="ai-lab section">
      <div className="container">
        <p className="eyebrow">AI &amp; Observability Lab</p>
        <h2>Inteligência para ambientes críticos</h2>

        <div className="ai-lab__grid">
          <div className="ai-lab__stats">
            <div className="stat-card">
              <span className="stat-card__label">Anomalias Detectadas</span>
              <strong className="count" data-count-to="12">0</strong>
              <span className="stat-card__trend up">+25% vs ontem</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Incidentes Previstos</span>
              <strong className="count" data-count-to="7">0</strong>
              <span className="stat-card__trend">Alta probabilidade</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Eventos Processados</span>
              <strong className="count" data-count-to="2400000">0</strong>
              <span className="stat-card__trend">em tempo real</span>
            </div>
            <div className="stat-card stat-card--confidence">
              <span className="stat-card__label">Confiança do Modelo</span>
              <strong className="count" data-count-to="98">0</strong>
            </div>
          </div>

          <div className="ai-lab__visual">
            <div className="ai-lab__portrait tilt-card">
              <img src={profileCoding} alt="Renato Nagassaki programando" />
            </div>
          </div>

          <div className="ai-lab__panels">
            <div className="panel">
              <h4>Top Anomalias</h4>
              {ANOMALIES.map((a) => (
                <div className="panel__bar" key={a.label}>
                  <span>{a.label}</span>
                  <div className="panel__track"><div style={{ width: `${a.value}%` }} /></div>
                  <strong>{a.value}%</strong>
                </div>
              ))}
            </div>

            <div className="panel">
              <h4>Previsão de Incidentes</h4>
              <svg viewBox="0 0 200 60" className="panel__spark" preserveAspectRatio="none">
                <polyline points="0,45 25,38 50,42 75,25 100,30 125,15 150,20 175,8 200,12" />
              </svg>
            </div>

            <div className="panel panel--logs">
              <h4>Logs em Tempo Real</h4>
              <ul>
                {LOGS.map((l) => (
                  <li key={l.time}>
                    <span className="log__time">{l.time}</span>
                    <span className={`log__level log__level--${l.level.toLowerCase()}`}>{l.level}</span>
                    <span>{l.msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Blog() {
  return (
    <section id="blog" className="blog section">
      <div className="container">
        <div className="blog__head">
          <div>
            <p className="eyebrow">Blog</p>
            <h2>Compartilho conhecimento para gerar impacto</h2>
          </div>
          <a href="#blog" className="link-more">Ver todos os artigos →</a>
        </div>

        <div className="blog__grid">
          {BLOG_POSTS.map((p) => (
            <article className="blog-card" key={p.title}>
              <div className="blog-card__cover"><span>{p.tag}</span></div>
              <h3>{p.title}</h3>
              <p className="blog-card__meta">{p.date} · {p.time}</p>
            </article>
          ))}
        </div>

        <div className="dots">
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i === 0 ? 'is-active' : ''} />)}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }
  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section id="contato" className="contact section">
      <div className="container contact__grid">
        <div className="contact__info">
          <p className="eyebrow">Contato</p>
          <h2>Vamos construir algo incrível juntos?</h2>

          <ul className="contact__list">
            <li>
              <span className="contact__icon">✉</span>
              <div><strong>Email</strong><span>renato.nagassaki@hotmail.com</span></div>
            </li>
            <li>
              <span className="contact__icon">in</span>
              <div><strong>LinkedIn</strong><span>linkedin.com/in/renato-nagassaki</span></div>
            </li>
            <li>
              <span className="contact__icon">⌥</span>
              <div><strong>GitHub</strong><span>github.com/renatonagassaki</span></div>
            </li>
          </ul>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <h3>Envie uma mensagem</h3>
          <label>
            Nome
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
          </label>
          <label>
            Assunto
            <input name="assunto" value={form.assunto} onChange={handleChange} placeholder="Sobre o que você quer falar?" />
          </label>
          <label>
            Mensagem
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} rows={5} placeholder="Escreva sua mensagem..." required />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            {sent ? 'Mensagem enviada ✓' : 'Enviar mensagem'}
          </button>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bg" />
      <div className="container footer__inner">
        <div className="footer__mark">RN</div>
        <h3>RENATO NAGASSAKI</h3>
        <p className="footer__role">Full Stack &amp; AI Engineer</p>
        <p className="footer__tag">Construo sistemas inteligentes para ambientes críticos</p>

        <div className="footer__social">
          <a href="https://linkedin.com/in/renato-nagassaki" aria-label="LinkedIn">in</a>
          <a href="https://github.com/renatonagassaki" aria-label="GitHub">gh</a>
          <a href="mailto:renato.nagassaki@hotmail.com" aria-label="Email">@</a>
          <a href="#home" aria-label="Telegram">tg</a>
        </div>

        <nav className="footer__nav">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>

        <p className="footer__copy">© 2025 Renato Nagassaki. Todos os direitos reservados.</p>
      </div>
      <a href="#home" className="footer__top" aria-label="Voltar ao topo">↑</a>
    </footer>
  )
}

export default function App() {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Renato Nagassaki — Full Stack & AI Engineer'
    const cursor = initCustomCursor()
    const teardownTilt = initTilt()
    const teardownCounters = initCounters()

    // add global UI overlays
    const progressEl = document.createElement('div')
    progressEl.className = 'scroll-progress'
    document.body.appendChild(progressEl)

    const noiseEl = document.createElement('div')
    noiseEl.className = 'noise-overlay'
    document.body.appendChild(noiseEl)

    const gridEl = document.createElement('div')
    gridEl.className = 'grid-pattern'
    document.body.appendChild(gridEl)

    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? (window.scrollY / h) * 100 : 0
      progressEl.style.width = p + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      if (cursor && cursor.destroy) cursor.destroy()
      if (typeof teardownTilt === 'function') teardownTilt()
      if (typeof teardownCounters === 'function') teardownCounters()
      window.removeEventListener('scroll', onScroll)
      if (progressEl && progressEl.parentNode) progressEl.parentNode.removeChild(progressEl)
      if (noiseEl && noiseEl.parentNode) noiseEl.parentNode.removeChild(noiseEl)
      if (gridEl && gridEl.parentNode) gridEl.parentNode.removeChild(gridEl)
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <AiLab />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

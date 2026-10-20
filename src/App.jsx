import { useMemo, useState } from 'react'
import './App.css'

const areas = [
  { id: 'all', label: 'All study tasks' },
  { id: 'summaries', label: 'Summarise lectures' },
  { id: 'writing', label: 'Formulate & improve' },
  { id: 'create', label: 'Create content' },
  { id: 'practice', label: 'Practice & flashcards' },
  { id: 'research', label: 'Research & projects' },
  { id: 'present', label: 'Presentations' },
]

const tools = [
  { id: 'claude', name: 'Claude', maker: 'Anthropic', mark: 'C', color: 'peach', score: 91, privacy: 'Careful', tags: ['writing', 'summaries', 'research'], best: 'Thoughtful explanations & writing', detail: 'Strong at turning complex material into clear explanations and helping you shape a draft.', ratings: [94, 86, 88, 82], note: 'Learning mode can guide students through a problem instead of jumping straight to an answer.' },
  { id: 'notebooklm', name: 'NotebookLM', maker: 'Google', mark: 'N', color: 'blue', score: 89, privacy: 'Source-based', tags: ['summaries', 'practice', 'research'], best: 'Your own course materials', detail: 'Build a notebook from your readings and notes, then ask questions grounded in those sources.', ratings: [92, 88, 91, 84], note: 'A good fit when you want responses tied to sources you supplied.' },
  { id: 'chatgpt', name: 'ChatGPT', maker: 'OpenAI', mark: '✳', color: 'mint', score: 87, privacy: 'Check settings', tags: ['writing', 'create', 'practice', 'summaries', 'present'], best: 'Flexible study support', detail: 'Use it to brainstorm, explain concepts, generate practice questions, or work through a problem.', ratings: [86, 90, 86, 86], note: 'Study mode is designed to coach step by step, though it can still make mistakes.' },
  { id: 'gemini', name: 'Gemini', maker: 'Google', mark: '✦', color: 'lilac', score: 84, privacy: 'Check settings', tags: ['create', 'research', 'present', 'summaries'], best: 'Multimodal study tasks', detail: 'A general assistant for working with text and other formats, including brainstorming and presentations.', ratings: [84, 83, 85, 84], note: 'Review answers and check which account and data settings apply to your use.' },
  { id: 'perplexity', name: 'Perplexity', maker: 'Perplexity AI', mark: 'P', color: 'dark', score: 81, privacy: 'Source-based', tags: ['research', 'summaries'], best: 'Starting a web research trail', detail: 'Search-oriented answers with linked sources can help you find leads for further reading.', ratings: [78, 80, 84, 82], note: 'Citations are useful leads; open the original source and verify it.' },
  { id: 'copilot', name: 'Copilot', maker: 'Microsoft', mark: '∞', color: 'rainbow', score: 77, privacy: 'Check settings', tags: ['create', 'present', 'writing'], best: 'Microsoft workflow tasks', detail: 'An assistant that can fit naturally into Microsoft’s productivity ecosystem.', ratings: [76, 82, 78, 76], note: 'Features and data handling can differ by account type and institution.' },
]

const criteria = ['Learning support', 'Quality & clarity', 'Source transparency', 'Privacy clarity']

function Logo({ tool, small = false }) {
  return <span className={`tool-mark ${tool.color} ${small ? 'small' : ''}`} aria-hidden="true">{tool.mark}</span>
}

function App() {
  const [page, setPage] = useState('explore')
  const [area, setArea] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(['claude', 'notebooklm', 'chatgpt'])
  const [goal, setGoal] = useState('research')
  const [privacy, setPrivacy] = useState('balanced')
  const [showSources, setShowSources] = useState(false)
  const filtered = useMemo(() => tools.filter((tool) => (area === 'all' || tool.tags.includes(area)) && `${tool.name} ${tool.maker} ${tool.best}`.toLowerCase().includes(query.toLowerCase())), [area, query])
  const recommendations = useMemo(() => tools.filter((tool) => tool.tags.includes(goal)).sort((a, b) => b.ratings[3] - a.ratings[3]), [goal])
  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#explore" onClick={(event) => { event.preventDefault(); setPage('explore') }}><span className="brand-icon">a</span><span>atlas<span className="brand-dot">.</span><small>AI FOR STUDY</small></span></a>
        <div className="side-label">YOUR GUIDE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={page === 'explore' ? 'active' : ''} onClick={() => setPage('explore')}><span>⌕</span> Explore tools</button>
          <button className={page === 'compare' ? 'active' : ''} onClick={() => setPage('compare')}><span>▤</span> Compare tools <i>{selected.length}</i></button>
          <button className={page === 'match' ? 'active' : ''} onClick={() => setPage('match')}><span>✳</span> Find my match</button>
        </nav>
        <div className="side-rule" />
        <div className="side-label">YOUR SHORTLIST</div>
        {selected.slice(0, 3).map((id) => { const tool = tools.find((item) => item.id === id); return <button className="shortlist-item" key={id} onClick={() => setPage('compare')}><Logo tool={tool} small />{tool.name}<span className="mini-score">{tool.score}</span></button> })}
        <div className="sidebar-bottom"><div className="help-icon">?</div><div><strong>Make a smarter choice</strong><p>Clear, student-first AI tool reviews.</p></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Student toolkit <span>/</span> {page === 'explore' ? 'Explore tools' : page === 'compare' ? 'Compare tools' : 'Find my match'}</div><div className="top-actions"><span className="updated"><span className="live-dot" /> REVIEWED FOR STUDENTS</span><button className="avatar">S</button></div></header>

        {page === 'explore' && <section className="page-content">
          <div className="eyebrow"><span>✳</span> THE STUDENT AI TOOLKIT</div>
          <div className="hero-row"><div><h1>Find your next<br /><em>study sidekick.</em></h1><p className="hero-copy">A clearer way to choose AI tools for the way you actually study. Compare what they’re good at, where to be careful, and how they handle your data.</p><button className="primary-btn" onClick={() => setPage('match')}>Find my match <span>↗</span></button><span className="hero-note">No sign-up. Just a better starting point.</span></div><div className="hero-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-core">a<span>.</span></div><div className="float-card float-top"><span className="float-spark">✳</span><div><b>Study smarter</b><small>Not just faster</small></div><span className="float-check">✓</span></div><div className="float-card float-bottom"><span className="shield">◇</span><div><b>Privacy, in plain words</b><small>Know before you share</small></div></div></div></div>
          <div className="survey-strip"><div className="survey-avatars"><span>C</span><span>G</span><span>N</span></div><p><b>Built around how students really learn.</b> In your survey, students most often named Claude, ChatGPT and Gemini.</p><button onClick={() => setShowSources(!showSources)}>{showSources ? 'Hide research notes' : 'See research notes'} <span>↗</span></button></div>
          {showSources && <div className="research-note"><b>What this prototype uses:</b> your survey (35 tool responses; 34 task responses) sets the ranking categories. Public product documentation was checked for learning features. Scores below are illustrative mock ratings, not measured evaluations.</div>}
          <div className="section-head"><div><div className="eyebrow muted">PICK A STUDY MOMENT</div><h2>What are you working on?</h2></div><span className="section-aside">RANKED FOR YOUR TASK <span>↓</span></span></div>
          <div className="area-chips">{areas.map((item) => <button key={item.id} className={area === item.id ? 'selected' : ''} onClick={() => setArea(item.id)}>{item.label}</button>)}</div>
          <div className="ranking-head"><div><h3>Student favourites</h3><span>{filtered.length} tools · ranked by fit for your task</span></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" /></label></div>
          <div className="tool-list">{filtered.map((tool, index) => <article className="tool-row" key={tool.id}><div className="rank-num">{String(index + 1).padStart(2, '0')}</div><Logo tool={tool} /><div className="tool-info"><div className="tool-title">{tool.name}<span className="maker">{tool.maker}</span></div><p>{tool.best}</p></div><div className="privacy-pill"><span />{tool.privacy}</div><div className="score-block"><strong>{tool.score}</strong><small>FIT SCORE</small></div><button className={`compare-toggle ${selected.includes(tool.id) ? 'chosen' : ''}`} aria-label={`${selected.includes(tool.id) ? 'Remove' : 'Add'} ${tool.name} ${selected.includes(tool.id) ? 'from' : 'to'} comparison`} onClick={() => toggleSelected(tool.id)}>{selected.includes(tool.id) ? '✓' : '+'}</button></article>)}</div>
          <div className="ranking-foot"><span><i /> Scores are prototype examples</span><button onClick={() => setPage('compare')}>Compare your shortlist <span>→</span></button></div>
          <footer><span>ATLAS · AI, with a little more clarity.</span><span>Made for curious students <b>✳</b></span></footer>
        </section>}

        {page === 'compare' && <section className="page-content subpage"><div className="eyebrow"><span>02</span> SIDE BY SIDE</div><h1 className="sub-title">A little more <em>perspective.</em></h1><p className="sub-copy">Compare up to three tools across the things that matter for student work.</p><div className="compare-table"><div className="compare-labels"><div className="table-title">YOUR SHORTLIST <span>{selected.length} / 3</span></div><div className="criteria-label">Best for</div>{criteria.map((item) => <div className="criteria-label" key={item}>{item}</div>)}<div className="criteria-label">Privacy note</div></div>{selected.map((id) => { const tool = tools.find((item) => item.id === id); return <div className="compare-column" key={id}><button className="remove-tool" onClick={() => setSelected(selected.filter((item) => item !== id))}>×</button><Logo tool={tool} /><h3>{tool.name}</h3><small>{tool.maker}</small><div className="compare-best">{tool.best}</div>{tool.ratings.map((rating, index) => <div className="rating-cell" key={criteria[index]}><div className="rating-bar"><i style={{ width: `${rating}%` }} /></div><b>{rating}</b></div>)}<div className="privacy-copy"><span className="privacy-dot" />{tool.privacy}<p>{tool.note}</p></div></div> })}{selected.length < 3 && <button className="add-column" onClick={() => setPage('explore')}><span>＋</span>Add a tool</button>}</div><div className="method-callout"><span>✳</span><p><b>How to read this:</b> Ratings are mock data for the prototype. A real ranking should publish its criteria, evidence, review date and privacy sources for every tool.</p></div><button className="text-back" onClick={() => setPage('explore')}>← Back to all tools</button></section>}

        {page === 'match' && <section className="page-content subpage match-page"><div className="eyebrow"><span>03</span> YOUR STUDY, YOUR RULES</div><h1 className="sub-title">Let’s find your <em>fit.</em></h1><p className="sub-copy">A couple of quick choices. No account, no judgement.</p><div className="match-layout"><div className="quiz-card"><div className="step-label">YOUR MAIN STUDY TASK <span>01 / 02</span></div><h2>What are you working on?</h2><div className="goal-grid">{areas.filter((item) => item.id !== 'all').map((item) => <button key={item.id} className={goal === item.id ? 'goal-selected' : ''} onClick={() => setGoal(item.id)}><span>{item.id === 'summaries' ? '▤' : item.id === 'writing' ? '✎' : item.id === 'create' ? '✧' : item.id === 'practice' ? '↻' : item.id === 'research' ? '⌕' : '▧'}</span>{item.label}{goal === item.id && <b>✓</b>}</button>)}</div><div className="step-label second-step">PRIVACY COMFORT <span>02 / 02</span></div><h2>How cautious do you want to be?</h2><div className="privacy-options"><button className={privacy === 'balanced' ? 'privacy-selected' : ''} onClick={() => setPrivacy('balanced')}><span>◉</span><b>Keep it balanced</b><small>Useful guidance, no deep dive.</small></button><button className={privacy === 'strict' ? 'privacy-selected' : ''} onClick={() => setPrivacy('strict')}><span>◇</span><b>Privacy first</b><small>Prioritise source transparency.</small></button></div></div><div className="match-results"><div className="result-heading"><span>YOUR STARTING POINT</span><span className="result-spark">✳</span></div><h3>Worth a closer look</h3><p>Based on your task and privacy preference.</p>{recommendations.slice(0, 3).map((tool, index) => <div className="result-tool" key={tool.id}><span className="result-rank">0{index + 1}</span><Logo tool={tool} small /><div><b>{tool.name}</b><small>{tool.best}</small></div><span className="result-score">{tool.score}</span></div>)}<div className="match-disclaimer">A starting point, not a verdict. Check course rules and each tool’s current settings before sharing materials.</div><button className="primary-btn full" onClick={() => { setSelected(recommendations.slice(0, 3).map((tool) => tool.id)); setPage('compare') }}>Compare these tools <span>→</span></button></div></div><button className="text-back" onClick={() => setPage('explore')}>← Back to explore</button></section>}
      </main>
    </div>
  )
}

export default App

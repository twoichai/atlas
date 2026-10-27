import { useEffect, useMemo, useState } from 'react'
import './App.css'
import './interactive.css'
import './ratings.css'
import './logos.css'
import './features.css'
import './brand-theme.css'

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
  { id: 'claude', name: 'Claude', maker: 'Anthropic', mark: 'C', color: 'peach', score: 91, studentRating: 4.6, ratingCount: 28, privacy: 'Check settings', privacyDetail: 'Check which account you are using and review its current data controls before sharing course files or personal information.', url: 'https://claude.ai/', tags: ['writing', 'summaries', 'research'], best: 'Thoughtful explanations & writing', detail: 'Strong at turning complex material into clear explanations and helping you shape a draft.', ratings: [94, 86, 88, 82], note: 'Learning mode can guide students through a problem instead of jumping straight to an answer.' },
  { id: 'notebooklm', name: 'NotebookLM', maker: 'Google', mark: 'N', color: 'blue', score: 89, studentRating: 4.5, ratingCount: 19, privacy: 'Review uploads', privacyDetail: 'Think about whether you are allowed to upload the readings, lecture notes, or other files you add to a notebook. Avoid personal or confidential content.', url: 'https://notebooklm.google.com/', tags: ['summaries', 'practice', 'research'], best: 'Your own course materials', detail: 'Build a notebook from your readings and notes, then ask questions grounded in those sources.', ratings: [92, 88, 91, 84], note: 'A good fit when you want responses tied to sources you supplied.' },
  { id: 'chatgpt', name: 'ChatGPT', maker: 'OpenAI', mark: '✳', color: 'mint', score: 87, studentRating: 4.4, ratingCount: 31, privacy: 'Check settings', privacyDetail: 'Review the data controls for your account before uploading files. Do not include personal, confidential, or unpublished information.', url: 'https://chatgpt.com/', tags: ['writing', 'create', 'practice', 'summaries', 'present'], best: 'Flexible study support', detail: 'Use it to brainstorm, explain concepts, generate practice questions, or work through a problem.', ratings: [86, 90, 86, 86], note: 'Study mode is designed to coach step by step, though it can still make mistakes.' },
  { id: 'gemini', name: 'Gemini', maker: 'Google', mark: '✦', color: 'lilac', score: 84, studentRating: 4.2, ratingCount: 18, privacy: 'Account-dependent', privacyDetail: 'Available features and data protections can differ between a personal Google account and a school account. Check which one you are using.', url: 'https://gemini.google.com/', tags: ['create', 'research', 'present', 'summaries'], best: 'Multimodal study tasks', detail: 'A general assistant for working with text and other formats, including brainstorming and presentations.', ratings: [84, 83, 85, 84], note: 'Review answers and check which account and data settings apply to your use.' },
  { id: 'perplexity', name: 'Perplexity', maker: 'Perplexity AI', mark: 'P', color: 'dark', score: 81, studentRating: 4.3, ratingCount: 11, privacy: 'Review queries', privacyDetail: 'Search prompts can contain sensitive details too. Keep queries general and review the current privacy controls for your account.', url: 'https://www.perplexity.ai/', tags: ['research', 'summaries'], best: 'Starting a web research trail', detail: 'Search-oriented answers with linked sources can help you find leads for further reading.', ratings: [78, 80, 84, 82], note: 'Citations are useful leads; open the original source and verify it.' },
  { id: 'copilot', name: 'Copilot', maker: 'Microsoft', mark: '∞', color: 'rainbow', score: 77, studentRating: 4.0, ratingCount: 9, privacy: 'Account-dependent', privacyDetail: 'Data protections can differ between a personal Microsoft account and a school or university account. Check your institution’s guidance.', url: 'https://copilot.microsoft.com/', tags: ['create', 'present', 'writing'], best: 'Microsoft workflow tasks', detail: 'An assistant that can fit naturally into Microsoft’s productivity ecosystem.', ratings: [76, 82, 78, 76], note: 'Features and data handling can differ by account type and institution.' },
]

const criteria = ['Learning support', 'Quality & clarity', 'Source transparency', 'Privacy clarity']
const priceProfiles = {
  claude: { band: 'affordable', label: 'Free + paid options (demo)', studentOffer: false, offerLabel: 'No sample offer shown', rank: 1 },
  notebooklm: { band: 'free', label: 'Free-first example', studentOffer: false, offerLabel: 'No sample offer shown', rank: 0 },
  chatgpt: { band: 'flexible', label: 'Free + paid options (demo)', studentOffer: true, offerLabel: 'Sample student offer', rank: 2 },
  gemini: { band: 'affordable', label: 'Free + paid options (demo)', studentOffer: true, offerLabel: 'Sample student offer', rank: 1 },
  perplexity: { band: 'affordable', label: 'Free + paid options (demo)', studentOffer: false, offerLabel: 'No sample offer shown', rank: 1 },
  copilot: { band: 'free', label: 'Free-first example', studentOffer: true, offerLabel: 'Sample education offer', rank: 0 },
}
const toolMechanics = {
  claude: { summary: 'Learning mode guides you with questions and hints, helping you reason through a problem instead of immediately giving the solution. It can also help structure research and study materials.', source: 'Anthropic · Claude for Education', url: 'https://www.anthropic.com/news/introducing-claude-for-education' },
  notebooklm: { summary: 'Add sources such as PDFs, websites, or notes to a notebook. Its chat answers are grounded in those sources and include citations that take you back to the supporting passage.', source: 'Google · Gemini Notebook help', url: 'https://support.google.com/gemininotebook/answer/16164461?hl=en' },
  chatgpt: { summary: 'Study mode asks about your goals and current understanding, then guides you with questions, hints, explanations, and checks for understanding. You can also ask it to use uploaded files; it can still make mistakes or give a direct answer.', source: 'OpenAI · Study mode help', url: 'https://help.openai.com/en/articles/11780217-study-mode' },
  gemini: { summary: 'Study notebooks use your learning goal and uploaded study materials to create diagnostic quizzes and short interactive lessons, then adapt recommendations as you track progress.', source: 'Google · Study notebooks help', url: 'https://support.google.com/gemini/answer/16972047?hl=en' },
  perplexity: { summary: 'For a research question, Pro Search performs multiple web searches, synthesizes findings, and links to original sources. Follow-up questions can refine the research while keeping the conversation context.', source: 'Perplexity · What is Pro Search?', url: 'https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search' },
  copilot: { summary: 'The Study and Learn Agent uses scaffolded conversation to help you work through course content, asking questions and offering activities such as quizzes and flashcards. It can ground responses in uploaded materials and cite them; access depends on education account eligibility.', source: 'Microsoft · Study and Learn Agent', url: 'https://support.microsoft.com/en-us/education/copilot/study-learn-agent' },
}
const matchReasons = {
  research: { notebooklm: 'Start from your own course materials and ask questions grounded in them.', perplexity: 'Find source links and research leads, then verify them in the original publications.', claude: 'Useful for unpacking complex readings and shaping a first draft.' },
  summaries: { notebooklm: 'Work from your lecture notes and readings, with answers tied to those materials.', chatgpt: 'Turn a topic or notes into a structured explanation, then check it against class material.', claude: 'Ask for a clear explanation of difficult concepts in your notes.' },
  writing: { claude: 'Get help clarifying ideas and revising a draft while keeping your own argument.', chatgpt: 'Brainstorm, outline, or ask for feedback on a draft.', copilot: 'Could fit well if your writing already happens in Microsoft tools.' },
  practice: { chatgpt: 'Generate practice questions or ask for hints one step at a time.', notebooklm: 'Create revision prompts around the material you supplied.', claude: 'Talk through a difficult question and request hints before an explanation.' },
  create: { chatgpt: 'Explore ideas and create a first draft or visual concept to refine.', gemini: 'A flexible starting point for creating and working across content formats.', copilot: 'Worth exploring when your assignment uses Microsoft productivity tools.' },
  present: { gemini: 'Use it to explore a presentation structure and supporting material.', copilot: 'May fit naturally into a Microsoft based presentation workflow.', chatgpt: 'Build an outline and practice explaining the key points.' },
}

function Logo({ tool, small = false }) {
  return <span className={`tool-mark brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><img src={`/logos/${tool.id === 'chatgpt' ? 'chatgpt' : tool.id}.svg`} alt="" /></span>
}

function App() {
  const [page, setPage] = useState('explore')
  const [area, setArea] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(['claude', 'notebooklm', 'chatgpt'])
  const [goal, setGoal] = useState('research')
  const [privacy, setPrivacy] = useState('balanced')
  const [budget, setBudget] = useState('flexible')
  const [prioritizeStudentDeals, setPrioritizeStudentDeals] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [activeTool, setActiveTool] = useState(null)
  const [privacyTool, setPrivacyTool] = useState(null)
  const [sortBy, setSortBy] = useState('fit')
  const [ratingTool, setRatingTool] = useState(null)
  const [ratingScore, setRatingScore] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [userRatings, setUserRatings] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('kompas-user-ratings') || window.localStorage.getItem('atlas-user-ratings') || '{}') } catch { return {} }
  })
  const [showAiExplainer, setShowAiExplainer] = useState(false)
  const [hoverAiExplainer, setHoverAiExplainer] = useState(false)
  useEffect(() => { window.localStorage.setItem('kompas-user-ratings', JSON.stringify(userRatings)) }, [userRatings])
  const filtered = useMemo(() => tools.filter((tool) => (area === 'all' || tool.tags.includes(area)) && `${tool.name} ${tool.maker} ${tool.best}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sortBy === 'student' ? b.studentRating - a.studentRating : sortBy === 'price' ? priceProfiles[a.id].rank - priceProfiles[b.id].rank : b.score - a.score), [area, query, sortBy])
  const taskMatches = useMemo(() => tools.filter((tool) => tool.tags.includes(goal)), [goal])
  const recommendations = useMemo(() => {
    const inBudget = taskMatches.filter((tool) => budget === 'free' ? priceProfiles[tool.id].band === 'free' : budget === 'affordable' ? priceProfiles[tool.id].band !== 'flexible' : true)
    const candidates = inBudget.length ? inBudget : taskMatches
    return [...candidates].sort((a, b) => {
      if (prioritizeStudentDeals && priceProfiles[a.id].studentOffer !== priceProfiles[b.id].studentOffer) return priceProfiles[b.id].studentOffer ? 1 : -1
      if (privacy === 'strict' && a.ratings[3] !== b.ratings[3]) return b.ratings[3] - a.ratings[3]
      if (budget !== 'flexible' && priceProfiles[a.id].rank !== priceProfiles[b.id].rank) return priceProfiles[a.id].rank - priceProfiles[b.id].rank
      return b.score - a.score
    })
  }, [taskMatches, budget, prioritizeStudentDeals, privacy])
  const noBudgetMatch = budget !== 'flexible' && !taskMatches.some((tool) => budget === 'free' ? priceProfiles[tool.id].band === 'free' : priceProfiles[tool.id].band !== 'flexible')
  const getMatchReason = (tool) => {
    const taskReason = matchReasons[goal]?.[tool.id] || `This tool can support ${areas.find((item) => item.id === goal)?.label.toLowerCase()}. Review its limits before relying on it.`
    const budgetReason = noBudgetMatch ? 'No tool in the sample list exactly fits this budget, so these are the closest task matches.' : budget === 'free' ? 'This matches your free-first preference in the sample data.' : budget === 'affordable' ? 'This is ranked with lower-cost options in mind in the sample data.' : 'You said any budget is okay.'
    const offerReason = prioritizeStudentDeals ? priceProfiles[tool.id].studentOffer ? 'The demo flags a student or education offer; verify current eligibility.' : 'No student offer is shown for this tool in the demo.' : ''
    return [taskReason, budgetReason, offerReason].filter(Boolean).join(' ')
  }
  const openRating = (tool) => { setRatingTool(tool); setRatingScore(userRatings[tool.id]?.score || 0); setRatingComment(userRatings[tool.id]?.comment || ''); setRatingSubmitted(false) }
  const submitRating = () => { if (!ratingScore || !ratingTool) return; setUserRatings((current) => ({ ...current, [ratingTool.id]: { score: ratingScore, comment: ratingComment.trim() } })); setRatingSubmitted(true) }
  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#explore" onClick={(event) => { event.preventDefault(); setPage('explore') }}><span className="brand-icon">k</span><span>kompas<span className="brand-dot">.</span><small>AI FOR STUDY</small></span></a>
        <div className="side-label">YOUR GUIDE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={page === 'explore' ? 'active' : ''} onClick={() => setPage('explore')}><span>⌕</span> Explore tools</button>
          <button className={page === 'compare' ? 'active' : ''} onClick={() => setPage('compare')}><span>▤</span> Compare tools <i>{selected.length}</i></button>
          <button className={page === 'match' ? 'active' : ''} onClick={() => setPage('match')}><span>✳</span> Find my match</button>
          <button className={page === 'researchers' ? 'active' : ''} onClick={() => setPage('researchers')}><span>◎</span> Research team</button>
        </nav>
        <div className="side-rule" />
        <div className="side-label">YOUR SHORTLIST</div>
        {selected.slice(0, 3).map((id) => { const tool = tools.find((item) => item.id === id); return <button className="shortlist-item" key={id} onClick={() => setPage('compare')}><Logo tool={tool} small />{tool.name}<span className="mini-score">{tool.score}</span></button> })}
        <div className="sidebar-bottom"><div className="help-icon">?</div><div><strong>Make a smarter choice</strong><p>Clear, student-first AI tool reviews.</p></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Student toolkit <span>/</span> {page === 'explore' ? 'Explore tools' : page === 'compare' ? 'Compare tools' : page === 'researchers' ? 'Research team' : 'Find my match'}</div><div className="top-actions"><span className="updated"><span className="live-dot" /> STUDENT-FIRST GUIDE</span><button className="avatar">S</button></div></header>

        {page === 'explore' && <section className="page-content">
          <div className="eyebrow"><span>✳</span> THE STUDENT AI TOOLKIT</div>
          <div className="hero-row"><div><h1>Find your next<br /><em>study sidekick.</em></h1><p className="hero-copy">A clearer way to choose AI tools for the way you actually study. Compare what they’re good at, where to be careful, and how they handle your data.</p><button className="primary-btn" onClick={() => setPage('match')}>Find my match <span>↗</span></button><span className="hero-note">No sign-up. Just a better starting point.</span></div><div className="hero-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-core">a<span>.</span></div><div className="float-card float-top"><span className="float-spark">✳</span><div><b>Study smarter</b><small>Not just faster</small></div><span className="float-check">✓</span></div><div className="float-card float-bottom"><span className="shield">◇</span><div><b>Privacy, in plain words</b><small>Know before you share</small></div></div></div></div>
          <div className="survey-strip"><div className="survey-avatars"><span>C</span><span>G</span><span>N</span></div><p><b>Built around how students really learn.</b> In your survey, students most often named Claude, ChatGPT and Gemini.</p><button onClick={() => setShowSources(!showSources)}>{showSources ? 'Hide research notes' : 'See research notes'} <span>↗</span></button></div>
          {showSources && <div className="research-note"><b>What this service uses:</b> your survey (35 tool responses; 34 task responses) sets the ranking categories. Public product documentation was checked for learning features. Scores are illustrative assessments based on the criteria shown. See each tool profile for provider documentation.</div>}
          <div className="section-head"><div><div className="eyebrow muted">PICK A STUDY MOMENT</div><h2>What are you working on?</h2></div><span className="section-aside">RANKED FOR YOUR TASK <span>↓</span></span></div>
          <div className="area-chips">{areas.map((item) => <button key={item.id} className={area === item.id ? 'selected' : ''} onClick={() => setArea(item.id)}>{item.label}</button>)}</div>
          <div className="ranking-head"><div><h3>Explore AI tools</h3><span>{filtered.length} tools · student feedback · survey-informed examples</span></div><div className="ranking-controls"><label className="sort-control"><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="fit">Kompas fit</option><option value="student">Student rating</option><option value="price">Price</option></select></label><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" /></label></div></div>
          <div className="tool-list">{filtered.map((tool, index) => <article className="tool-row" key={tool.id}><div className="rank-num">{String(index + 1).padStart(2, '0')}</div><Logo tool={tool} /><button className="tool-info tool-profile-trigger" onClick={() => setActiveTool(tool)} aria-label={`View ${tool.name} profile`}><span className="tool-title">{tool.name}<span className="maker">{tool.maker}</span></span><span className="tool-info-copy">{tool.best}</span><span className="tool-community-rating"><span>★ {tool.studentRating.toFixed(1)}</span> · {tool.ratingCount} example ratings</span><span className="profile-link">View profile & rate <b>↗</b></span></button><button className="privacy-pill" onClick={() => setPrivacyTool(tool)} title="Open privacy guidance"><span className="status-light" aria-hidden="true" />{tool.privacy}</button><div className="score-block"><strong>{tool.score}</strong><small>FIT SCORE</small></div><button className={`compare-toggle ${selected.includes(tool.id) ? 'chosen' : ''}`} aria-label={`${selected.includes(tool.id) ? 'Remove' : 'Add'} ${tool.name} ${selected.includes(tool.id) ? 'from' : 'to'} comparison`} onClick={() => toggleSelected(tool.id)}>{selected.includes(tool.id) ? '✓' : '+'}</button></article>)}</div>
          <div className="ranking-foot"><span><i /> Illustrative fit scores</span><button onClick={() => setPage('compare')}>Compare your shortlist <span>→</span></button></div>
          <footer><span>KOMPAS · AI, with a little more clarity.</span><span>Made for curious students <b>✳</b></span></footer>
        </section>}

        {page === 'compare' && <section className="page-content subpage">
          <div className="eyebrow"><span>02</span> SIDE BY SIDE</div>
          <h1 className="sub-title">A little more <em>perspective.</em></h1>
          <p className="sub-copy">Compare up to three tools across the things that matter for student work.</p>
          <div className="compare-explainer-row">
            <div className="ai-explainer" onMouseEnter={() => setHoverAiExplainer(true)} onMouseLeave={() => setHoverAiExplainer(false)}>
              <button className="ai-explainer-trigger" aria-expanded={showAiExplainer || hoverAiExplainer} aria-controls="ai-how-it-works" onClick={() => setShowAiExplainer((open) => !open)}><span>ⓘ</span> How do AI answers work?</button>
              {(showAiExplainer || hoverAiExplainer) && <div className="ai-popover" id="ai-how-it-works" role="note"><b>In brief</b><ol><li>During training, a model learns patterns from large collections of data.</li><li>When you ask a question, it uses your prompt and context to predict a response piece by piece.</li><li>It can sound confident and still be wrong. Check important claims and open sources yourself.</li></ol><p>Some tools can also search the web or use files you provide. Those sources still need checking.</p></div>}
            </div>
          </div>
          <div className="compare-table">
            <div className="compare-labels"><div className="table-title">YOUR SHORTLIST <span>{selected.length} / 3</span></div><div className="criteria-label">Best for</div>{criteria.map((item) => <div className="criteria-label" key={item}>{item}</div>)}<div className="criteria-label">Privacy note</div></div>
            {selected.map((id) => { const tool = tools.find((item) => item.id === id); return <div className="compare-column" key={id}><button className="remove-tool" onClick={() => setSelected(selected.filter((item) => item !== id))}>×</button><Logo tool={tool} /><h3>{tool.name}</h3><small>{tool.maker}</small><button className="compare-detail-link" onClick={() => setActiveTool(tool)}>View profile ↗</button><div className="compare-best">{tool.best}</div>{tool.ratings.map((rating, index) => <div className="rating-cell" key={criteria[index]}><div className="rating-bar"><i style={{ width: `${rating}%` }} /></div><b>{rating}</b></div>)}<div className="privacy-copy"><span className="privacy-dot" />{tool.privacy}<p>{tool.note}</p><button className="compare-detail-link" onClick={() => setPrivacyTool(tool)}>Privacy guide ↗</button></div></div> })}
            {selected.length < 3 && <button className="add-column" onClick={() => setPage('explore')}><span>＋</span>Add a tool</button>}
          </div>
          <div className="method-callout"><span>✳</span><p><b>How to read this:</b> Fit scores use the criteria shown here. Each profile links to provider documentation; check the source for current feature details.</p></div>
          <button className="text-back" onClick={() => setPage('explore')}>← Back to all tools</button>
        </section>}

        {page === 'match' && <section className="page-content subpage match-page">
          <div className="eyebrow"><span>03</span> YOUR STUDY, YOUR RULES</div>
          <h1 className="sub-title">Let’s find your <em>fit.</em></h1>
          <p className="sub-copy">Choose what matters to you. No account, no judgement.</p>
          <div className="match-layout">
            <div className="quiz-card">
              <div className="step-label">YOUR MAIN STUDY TASK <span>01 / 03</span></div>
              <h2>What are you working on?</h2>
              <div className="goal-grid">{areas.filter((item) => item.id !== 'all').map((item) => <button key={item.id} className={goal === item.id ? 'goal-selected' : ''} onClick={() => setGoal(item.id)}><span>{item.id === 'summaries' ? '▤' : item.id === 'writing' ? '✎' : item.id === 'create' ? '✧' : item.id === 'practice' ? '↻' : item.id === 'research' ? '⌕' : '▧'}</span>{item.label}{goal === item.id && <b>✓</b>}</button>)}</div>
              <div className="step-label second-step">PRIVACY COMFORT <span>02 / 03</span></div>
              <h2>How cautious do you want to be?</h2>
              <div className="privacy-options"><button className={privacy === 'balanced' ? 'privacy-selected' : ''} onClick={() => setPrivacy('balanced')}><span>◉</span><b>Keep it balanced</b><small>Useful guidance, no deep dive.</small></button><button className={privacy === 'strict' ? 'privacy-selected' : ''} onClick={() => setPrivacy('strict')}><span>◇</span><b>Privacy first</b><small>Prioritise privacy clarity.</small></button></div>
              <div className="step-label second-step">BUDGET & STUDENT DISCOUNTS <span>03 / 03</span></div>
              <h2>What price range works for you?</h2>
              <div className="budget-options">
                <button className={budget === 'free' ? 'budget-selected' : ''} onClick={() => setBudget('free')}><b>Free first</b><small>Only free-first examples</small></button>
                <button className={budget === 'affordable' ? 'budget-selected' : ''} onClick={() => setBudget('affordable')}><b>Prefer affordable</b><small>Prioritise lower-cost examples</small></button>
                <button className={budget === 'flexible' ? 'budget-selected' : ''} onClick={() => setBudget('flexible')}><b>Flexible</b><small>Show any price profile</small></button>
              </div>
              <label className="deal-toggle"><input type="checkbox" checked={prioritizeStudentDeals} onChange={(event) => setPrioritizeStudentDeals(event.target.checked)} /><span><b>Prioritise student discounts</b><small>Bring sample student or education offers to the top.</small></span></label>
              <p className="pricing-disclaimer">Prices and student eligibility change by plan and region. Confirm current terms with each provider.</p>
            </div>
            <div className="match-results">
              <div className="result-heading"><span>YOUR STARTING POINT</span><span className="result-spark">✳</span></div>
              <h3>Worth a closer look</h3>
              <p>Based on your task, privacy preference and budget.</p>
              {noBudgetMatch && <p className="privacy-preference-note">No sample tool matches this budget for your task. These are the closest task matches instead.</p>}
              {recommendations.slice(0, 3).map((tool, index) => <div className="recommendation-item" key={tool.id}><button className="result-tool" onClick={() => setActiveTool(tool)} aria-label={`View ${tool.name} details`}><span className="result-rank">0{index + 1}</span><Logo tool={tool} small /><span className="result-tool-name"><b>{tool.name}</b><small>{tool.best}</small></span><span className="result-score">{tool.score}</span><span className="result-arrow">↗</span></button><p className="result-why"><b>Why it fits:</b> {getMatchReason(tool)}</p></div>)}
              {privacy === 'strict' && <p className="privacy-preference-note">You chose Privacy first. Give extra weight to account controls and data handling before uploading files.</p>}
              <div className="match-disclaimer">A starting point, not a verdict. Prices and student offers vary by plan and region; verify details with each provider.</div>
              <button className="primary-btn full" onClick={() => { setSelected(recommendations.slice(0, 3).map((tool) => tool.id)); setPage('compare') }}>Compare these tools <span>→</span></button>
            </div>
          </div>
          <button className="text-back" onClick={() => setPage('explore')}>← Back to explore</button>
        </section>}

        {page === 'researchers' && <section className="page-content subpage research-team-page">
          <div className="eyebrow"><span>04</span> THE PEOPLE BEHIND THE METHOD</div>
          <h1 className="sub-title">Good guidance starts with <em>good questions.</em></h1>
          <p className="sub-copy">Meet the expertise behind Kompas and the principles that guide every review.</p>
          <article className="researcher-card featured-researcher"><img className="researcher-photo" src="photo123.png" alt="Portrait of Dr. Nora Weiss" /><div className="researcher-profile-copy"><span className="researcher-field">LEARNING SCIENCES · HUMAN-CENTERED AI</span><h2>Dr. Nora Weiss</h2><p className="researcher-role">Research lead · Learning sciences</p><p>Dr. Weiss studies how people learn with digital tools. At Kompas, she brings learning science and responsible AI evaluation together to review how study tools guide students, explain their limits, and treat course materials.</p><div className="researcher-contribution"><b>Areas of focus</b><span>Learning support · source transparency · privacy-aware study</span></div></div></article>
          <div className="research-method"><div><span>01</span><b>Evidence first</b><p>Use current provider documentation and relevant research as review sources.</p></div><div><span>02</span><b>Student tasks</b><p>Assess tools against real study needs, not one-size-fits-all claims.</p></div><div><span>03</span><b>Show the limits</b><p>Publish criteria, sources, review dates, and known uncertainties.</p></div></div>
          <button className="text-back" onClick={() => setPage('explore')}>← Back to explore</button>
        </section>}

        {(activeTool || privacyTool) && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setActiveTool(null); setPrivacyTool(null) } }}><section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" onClick={() => { setActiveTool(null); setPrivacyTool(null) }} aria-label="Close dialog">×</button>{activeTool ? <><div className="dialog-kicker">KOMPAS TOOL PROFILE <span>SOURCES & FEATURES</span></div><div className="dialog-tool-heading"><Logo tool={activeTool} /><div><h2 id="dialog-title">{activeTool.name}</h2><p>{activeTool.maker}</p></div><div className="dialog-fit"><strong>{activeTool.score}</strong><small>EXAMPLE FIT</small></div></div><p className="dialog-summary">{activeTool.detail}</p><div className="dialog-best"><span>GOOD STARTING POINT FOR</span><b>{activeTool.best}</b></div><div className="how-tool-works"><div className="dialog-rating-title">HOW THIS TOOL WORKS <span>From provider documentation</span></div><p>{toolMechanics[activeTool.id].summary}</p><a href={toolMechanics[activeTool.id].url} target="_blank" rel="noreferrer">{toolMechanics[activeTool.id].source} ↗</a></div><div className="price-profile"><div><span>PRICE & ACCESS</span><b>{priceProfiles[activeTool.id].label}</b></div><div><span>STUDENT ACCESS</span><b>{priceProfiles[activeTool.id].offerLabel}</b></div></div><div className="student-pulse"><div><strong>★ {activeTool.studentRating.toFixed(1)}</strong><small>STUDENT RATING · {activeTool.ratingCount} EXAMPLE RATINGS</small></div>{userRatings[activeTool.id] && <span className="saved-user-rating">Your rating: {userRatings[activeTool.id].score}/5 · saved here</span>}<button onClick={() => { openRating(activeTool); setActiveTool(null) }}>{userRatings[activeTool.id] ? 'Edit your rating' : 'Rate this tool'} <b>↗</b></button></div><div className="dialog-rating-title">REVIEW CRITERIA <span>Illustrative assessment · methodology shown</span></div><div className="dialog-ratings">{activeTool.ratings.map((rating, index) => <div className="dialog-rating" key={criteria[index]}><span>{criteria[index]}</span><div className="rating-bar"><i style={{ width: `${rating}%` }} /></div><b>{rating}</b></div>)}</div><div className="dialog-caution"><span>Keep in mind</span><p>{activeTool.note}</p></div><button className="dialog-privacy" onClick={() => { setPrivacyTool(activeTool); setActiveTool(null) }}><span className="status-light" />Privacy: {activeTool.privacy}<b>Read the privacy guide →</b></button><div className="dialog-actions"><a href={activeTool.url} target="_blank" rel="noreferrer">Visit official site ↗</a><button className="primary-btn" onClick={() => { if (!selected.includes(activeTool.id) && selected.length < 3) setSelected([...selected, activeTool.id]); setActiveTool(null); setPage('compare') }}>{selected.includes(activeTool.id) ? 'View comparison' : selected.length < 3 ? 'Add to comparison' : 'View shortlist'} <span>→</span></button></div></> : <><div className="dialog-kicker">PRIVACY GUIDE <span>GENERAL GUIDANCE · NOT AN AUDIT</span></div><h2 id="dialog-title" className="privacy-dialog-title">The privacy traffic light</h2><p className="dialog-summary">The traffic light explains which kinds of information are safer to enter into an AI tool. It is not a security rating of the providers.</p><div className="traffic-guide"><div><span className="traffic-dot green" /><section><b>Green · Public information</b><p>General questions and information already in the public domain are the safest place to start.</p></section></div><div><span className="traffic-dot yellow" /><section><b>Yellow · Check your account and settings</b><p>Review privacy controls and data retention. A university account may offer different protections.</p></section></div><div><span className="traffic-dot red" /><section><b>Red · Do not share</b><p>Do not enter passwords, personal data, confidential documents, or unpublished research data.</p></section></div></div><div className="tool-privacy-note"><b>{privacyTool.name}: {privacyTool.privacy}</b><p>{privacyTool.privacyDetail}</p></div><p className="privacy-footnote">Provider policies and account options can change. Always check the provider’s current privacy information and your university’s rules before using it.</p><div className="dialog-actions"><a href={privacyTool.url} target="_blank" rel="noreferrer">Visit official website ↗</a><button className="primary-btn" onClick={() => setPrivacyTool(null)}>Got it <span>✓</span></button></div></>}</section></div>}

        {ratingTool && <div className="modal-backdrop rating-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRatingTool(null) }}><section className="detail-dialog rating-dialog" role="dialog" aria-modal="true" aria-labelledby="rating-title"><button className="dialog-close" onClick={() => setRatingTool(null)} aria-label="Close rating form">×</button><div className="dialog-kicker">STUDENT FEEDBACK <span>service · SAVED LOCALLY</span></div><h2 id="rating-title" className="privacy-dialog-title">{ratingSubmitted ? 'Thanks for sharing.' : `Rate ${ratingTool.name}`}</h2>{ratingSubmitted ? <><p className="dialog-summary">Your {ratingScore}-star rating is saved in this browser only. It is not sent to Kompas or shown to other users.</p>{ratingComment.trim() && <div className="rating-note-preview">“{ratingComment.trim()}”</div>}<button className="primary-btn full" onClick={() => { const tool = ratingTool; setRatingTool(null); setActiveTool(tool) }}>Back to tool profile <span>→</span></button></> : <><p className="dialog-summary">How was it for your study task? Your feedback helps show what students value.</p><div className="star-picker" role="radiogroup" aria-label="Rating from one to five stars">{[1, 2, 3, 4, 5].map((star) => <button key={star} role="radio" aria-checked={ratingScore === star} className={star <= ratingScore ? 'star-on' : ''} onClick={() => setRatingScore(star)} aria-label={`${star} out of 5 stars`}>★</button>)}</div><label className="rating-comment-label">Optional note<textarea value={ratingComment} onChange={(event) => setRatingComment(event.target.value)} maxLength={240} placeholder="What worked well, or what should other students know?" /></label><p className="rating-privacy-note">Please don’t include personal or confidential information. This service saves your rating only in this browser; it does not submit it to a shared service.</p><div className="dialog-actions"><button className="cancel-rating" onClick={() => setRatingTool(null)}>Cancel</button><button className="primary-btn" disabled={!ratingScore} onClick={submitRating}>Save my rating <span>→</span></button></div></>}</section></div>}
      </main>
    </div>
  )
}

export default App

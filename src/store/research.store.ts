import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ResearchSession, ResearchConfig, ResearchDepth, AgentRole,
  ResearchStatus, ResearchAgent, TimelineEvent, ResearchSource,
  Citation, OutlineSection, Finding, AgentActivity, OutlineSectionStatus,
} from '@/types/research'

// ── Agent sequence & durations ────────────────────────────────────────────────
const AGENT_SEQUENCE: AgentRole[] = [
  'planner', 'researcher', 'web_search', 'critic', 'writer', 'citation', 'reviewer',
]

const AGENT_DURATIONS: Record<ResearchDepth, Record<AgentRole, number>> = {
  quick:    { planner: 4,  researcher: 6,  web_search: 5,  critic: 3,  writer: 5,  citation: 3,  reviewer: 4  },
  standard: { planner: 6,  researcher: 10, web_search: 8,  critic: 5,  writer: 10, citation: 4,  reviewer: 5  },
  deep:     { planner: 8,  researcher: 18, web_search: 14, critic: 8,  writer: 16, citation: 6,  reviewer: 8  },
}

const AGENT_META: Record<AgentRole, { name: string; description: string; initialTask: string }> = {
  planner:    { name: 'Planner',    description: 'Analyzes the query and creates an execution plan',      initialTask: 'Analyzing research query...' },
  researcher: { name: 'Researcher', description: 'Coordinates research and synthesizes information',     initialTask: 'Formulating search strategies...' },
  web_search: { name: 'Web Search', description: 'Searches for relevant sources across the web',         initialTask: 'Constructing search queries...' },
  critic:     { name: 'Critic',     description: 'Evaluates source quality and verifies factual claims', initialTask: 'Evaluating collected sources...' },
  writer:     { name: 'Writer',     description: 'Generates structured research content and narrative',  initialTask: 'Building document outline...' },
  citation:   { name: 'Citation',   description: 'Formats citations and builds the bibliography',        initialTask: 'Identifying citation points...' },
  reviewer:   { name: 'Reviewer',   description: 'Reviews output for quality and completeness',         initialTask: 'Reviewing document structure...' },
}

// ── Mock data pools ───────────────────────────────────────────────────────────
const MOCK_SOURCES: Omit<ResearchSource, 'agentRole'>[] = [
  { id: 'src-1', title: 'Recent Advances and Future Perspectives on Emerging Technologies',
    url: 'https://www.nature.com/articles/example-1', domain: 'nature.com', sourceType: 'academic',
    relevanceScore: 96, publicationDate: '2024-11-15', isVerified: true,
    authors: ['Chen, J.', 'Williams, A.', 'Patel, R.'],
    snippet: 'This comprehensive review examines state-of-the-art methodologies and identifies critical gaps that require further investigation.' },
  { id: 'src-2', title: 'Industry Analysis: Global Market Trends and Impact Assessment',
    url: 'https://www.mckinsey.com/insights/example-2', domain: 'mckinsey.com', sourceType: 'web',
    relevanceScore: 89, publicationDate: '2025-01-20', isVerified: true,
    authors: ['McKinsey Global Institute'],
    snippet: 'Organizations that leverage modern approaches see 40% improvement in efficiency and 25% cost reduction within 18 months.' },
  { id: 'src-3', title: 'Systematic Literature Review: Methodologies and Best Practices',
    url: 'https://scholar.google.com/example-3', domain: 'scholar.google.com', sourceType: 'academic',
    relevanceScore: 91, publicationDate: '2024-08-03', isVerified: true,
    authors: ['Johnson, M.', 'Lee, S.K.'],
    snippet: 'A systematic review of 127 peer-reviewed publications reveals consistent patterns in adoption strategies and success factors.' },
  { id: 'src-4', title: 'Technical Deep Dive: Architecture Patterns and Implementation Strategies',
    url: 'https://arxiv.org/abs/example-4', domain: 'arxiv.org', sourceType: 'academic',
    relevanceScore: 93, publicationDate: '2025-02-11', isVerified: false,
    authors: ['Zhang, W.', 'Kumar, P.', 'Anderson, T.'],
    snippet: 'We propose a novel architectural framework addressing scalability challenges, demonstrating 3x performance improvement.' },
  { id: 'src-5', title: 'Regulatory Landscape and Compliance Considerations for Modern Applications',
    url: 'https://www.wired.com/story/example-5', domain: 'wired.com', sourceType: 'web',
    relevanceScore: 78, publicationDate: '2024-12-05', isVerified: true, authors: [],
    snippet: 'Regulatory bodies are adapting frameworks to address emerging challenges, creating compliance obligations and opportunities.' },
  { id: 'src-6', title: 'Empirical Study: User Adoption Patterns and Behavioral Insights',
    url: 'https://www.sciencedirect.com/article/example-6', domain: 'sciencedirect.com', sourceType: 'academic',
    relevanceScore: 85, publicationDate: '2024-09-17', isVerified: true,
    authors: ['Brown, K.', 'Taylor, E.', 'Nguyen, H.'],
    snippet: 'Analysis of 50,000 user interactions reveals that onboarding friction accounts for 62% of early abandonment.' },
  { id: 'src-7', title: 'Economic Impact Analysis: Cost-Benefit Framework and ROI Metrics',
    url: 'https://hbr.org/example-7', domain: 'hbr.org', sourceType: 'web',
    relevanceScore: 82, publicationDate: '2025-03-08', isVerified: true,
    authors: ['Harvard Business Review'],
    snippet: 'Organizations report average ROI of 340% over three years, with break-even typically achieved within 14 months.' },
  { id: 'src-8', title: 'Ethical Implications and Governance Frameworks: A Critical Analysis',
    url: 'https://www.thelancet.com/example-8', domain: 'thelancet.com', sourceType: 'academic',
    relevanceScore: 88, publicationDate: '2024-07-22', isVerified: false,
    authors: ['Martinez, D.', 'Wilson, J.'],
    snippet: 'Ethical considerations must be embedded throughout the design lifecycle with attention to bias mitigation and accountability.' },
]

const MOCK_CITATIONS_POOL: Omit<Citation, 'sourceId' | 'agentRole'>[] = [
  { id: 'cit-1', text: 'Chen et al. (2024) demonstrate that modern methodologies achieve statistically significant improvements over baseline approaches.',
    context: 'Supporting evidence for primary hypothesis in Section 2.1', pageNumber: 4 },
  { id: 'cit-2', text: 'As noted by the McKinsey Global Institute (2025), organizations leveraging this approach see 40% improvement in operational efficiency.',
    context: 'Industry validation in Section 3.2' },
  { id: 'cit-3', text: 'The systematic review by Johnson & Lee (2024) synthesizes findings from 127 publications, providing strong convergent validity.',
    context: 'Literature review foundation, Section 1.3', pageNumber: 12 },
  { id: 'cit-4', text: 'Zhang et al. (2025) propose a novel architectural framework demonstrating 3x performance improvement over prior state-of-the-art.',
    context: 'Technical comparison in Section 4.1', pageNumber: 7 },
  { id: 'cit-5', text: 'Regulatory compliance requirements vary significantly by jurisdiction (Wired, 2024), necessitating a flexible governance approach.',
    context: 'Regulatory section, Chapter 5' },
]

// ── Helper functions ──────────────────────────────────────────────────────────
function nowIso(): string { return new Date().toISOString() }
function uid(): string { return Math.random().toString(36).slice(2, 10) }

function mkActivity(message: string, type: AgentActivity['type'] = 'info'): AgentActivity {
  return { id: uid(), timestamp: nowIso(), message, type }
}

function mkTlEvent(
  type: TimelineEvent['type'], title: string, description: string, agentRole: AgentRole,
): TimelineEvent {
  return { id: uid(), type, title, description, timestamp: nowIso(), agentRole }
}

function buildOutlineSkeleton(topic: string): OutlineSection[] {
  const short = topic.length > 45 ? topic.slice(0, 45) + '...' : topic
  return [
    { id: 'out-1', title: 'Executive Summary', level: 1, status: 'planned' },
    { id: 'out-2', title: `Introduction to ${short}`, level: 1, status: 'planned',
      subsections: [
        { id: 'out-2-1', title: 'Background and Context', level: 2, status: 'planned' },
        { id: 'out-2-2', title: 'Research Objectives and Scope', level: 2, status: 'planned' },
      ] },
    { id: 'out-3', title: 'Literature Review', level: 1, status: 'planned',
      subsections: [
        { id: 'out-3-1', title: 'Foundational Concepts', level: 2, status: 'planned' },
        { id: 'out-3-2', title: 'Key Developments and Milestones', level: 2, status: 'planned' },
        { id: 'out-3-3', title: 'Identified Research Gaps', level: 2, status: 'planned' },
      ] },
    { id: 'out-4', title: 'Methodology and Analytical Framework', level: 1, status: 'planned',
      subsections: [
        { id: 'out-4-1', title: 'Research Design', level: 2, status: 'planned' },
        { id: 'out-4-2', title: 'Data Collection and Sources', level: 2, status: 'planned' },
      ] },
    { id: 'out-5', title: 'Findings and Analysis', level: 1, status: 'planned',
      subsections: [
        { id: 'out-5-1', title: 'Primary Findings', level: 2, status: 'planned' },
        { id: 'out-5-2', title: 'Comparative Analysis', level: 2, status: 'planned' },
        { id: 'out-5-3', title: 'Critical Evaluation', level: 2, status: 'planned' },
      ] },
    { id: 'out-6', title: 'Discussion and Implications', level: 1, status: 'planned',
      subsections: [
        { id: 'out-6-1', title: 'Theoretical Implications', level: 2, status: 'planned' },
        { id: 'out-6-2', title: 'Practical Recommendations', level: 2, status: 'planned' },
      ] },
    { id: 'out-7', title: 'Conclusions and Future Directions', level: 1, status: 'planned' },
    { id: 'out-8', title: 'References and Bibliography', level: 1, status: 'planned' },
  ]
}

// ── Build initial session ────────────────────────────────────────────────────
function buildInitialSession(config: ResearchConfig): ResearchSession {
  const id = `res-${uid()}`
  const durations = AGENT_DURATIONS[config.depth]
  const topicSnippet = config.topic.length > 60 ? config.topic.slice(0, 60) + '...' : config.topic

  const agents: ResearchAgent[] = AGENT_SEQUENCE.map((role, i) => ({
    id: `agent-${role}`,
    role,
    name: AGENT_META[role].name,
    description: AGENT_META[role].description,
    status: i === 0 ? 'running' : 'waiting',
    currentTask: i === 0 ? AGENT_META[role].initialTask : 'Waiting to start...',
    targetDuration: durations[role],
    durationSeconds: 0,
    activities: i === 0
      ? [mkActivity(`Received research request: "${topicSnippet}"`)]
      : [],
    startedAt: i === 0 ? nowIso() : undefined,
  }))

  return {
    id, config, status: 'planning', progress: 0,
    agents,
    timeline: [
      mkTlEvent('query_planned', 'Research initiated', `Topic: "${topicSnippet}"`, 'planner'),
    ],
    sources: [], citations: [], outline: [], findings: [],
    startedAt: nowIso(), elapsedSeconds: 0,
  }
}

// ── Milestone event applicator ────────────────────────────────────────────────
function applyMilestone(
  session: ResearchSession,
  agentIdx: number,
  pct: 0.25 | 0.5 | 0.75,
): ResearchSession {
  const agent = session.agents[agentIdx]
  const role = agent.role
  const topic = session.config.topic.slice(0, 50)

  const newActs: AgentActivity[] = []
  const newTl: TimelineEvent[] = []
  let updatedTask = agent.currentTask
  let newSources: ResearchSource[] = []
  const newFindings: Finding[] = []

  if (role === 'planner') {
    if (pct === 0.25) {
      newActs.push(mkActivity(`Query complexity assessed: ${session.config.depth} depth selected`))
      updatedTask = 'Decomposing research objectives...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity(`Identified 5 key research areas for: "${topic}"`))
      newTl.push(mkTlEvent('query_planned', 'Research plan created', 'Objectives decomposed into actionable sub-tasks', 'planner'))
      updatedTask = 'Drafting agent task assignments...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Assigned specialized roles to 6 downstream agents'))
      updatedTask = 'Finalizing execution schedule...'
    }
  } else if (role === 'researcher') {
    if (pct === 0.25) {
      newActs.push(mkActivity(`Generated 8 targeted search queries for "${topic}"`))
      updatedTask = 'Coordinating information gathering...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('Dispatched parallel search tasks to Web Search agent'))
      newTl.push(mkTlEvent('web_searching', 'Research coordination active', 'Multiple parallel search strategies deployed', 'researcher'))
      updatedTask = 'Synthesizing preliminary results...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Cross-referencing findings from multiple domains'))
      updatedTask = 'Preparing synthesis report...'
    }
  } else if (role === 'web_search') {
    if (pct === 0.25) {
      newActs.push(mkActivity(`Searching: "${topic} – overview and key concepts"`))
      updatedTask = 'Fetching initial results...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('Retrieved 24 candidate sources; filtering by relevance'))
      newTl.push(mkTlEvent('source_found', '24 candidate sources retrieved', 'Applying relevance filtering and deduplication', 'web_search'))
      updatedTask = 'Ranking source relevance...'
      newSources = MOCK_SOURCES.slice(0, 4).map(s => ({ ...s, agentRole: 'web_search' as AgentRole }))
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Applying domain-authority and recency filters'))
      updatedTask = 'Finalizing source selection...'
    }
  } else if (role === 'critic') {
    if (pct === 0.25) {
      newActs.push(mkActivity(`Evaluating ${session.sources.length} collected sources for credibility`))
      updatedTask = 'Verifying factual claims...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('Cross-referencing 18 factual claims across sources'))
      newTl.push(mkTlEvent('fact_verified', 'Fact-checking in progress', 'Cross-referencing claims across multiple independent sources', 'critic'))
      updatedTask = 'Flagging inconsistencies...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('2 low-confidence claims flagged for additional verification', 'warning'))
      updatedTask = 'Generating quality assessment report...'
    }
  } else if (role === 'writer') {
    if (pct === 0.25) {
      newActs.push(mkActivity('Writing Introduction and Executive Summary sections'))
      newTl.push(mkTlEvent('writing', 'Writing phase started', 'Generating structured content from research synthesis', 'writer'))
      updatedTask = 'Composing introduction...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('Composing Literature Review and Methodology sections'))
      updatedTask = 'Writing main analysis sections...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Drafting Findings, Discussion, and Conclusion sections'))
      updatedTask = 'Finalizing narrative flow...'
    }
  } else if (role === 'citation') {
    if (pct === 0.25) {
      newActs.push(mkActivity('Identified 14 in-text citation points'))
      updatedTask = 'Formatting references (APA 7th ed.)...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('Generated formatted citations for 8 primary sources'))
      newTl.push(mkTlEvent('citation_generated', 'Citations generated', 'In-text citations formatted and cross-referenced', 'citation'))
      updatedTask = 'Building bibliography...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Verified DOI links for 6 academic sources', 'success'))
      updatedTask = 'Finalizing bibliography...'
    }
  } else if (role === 'reviewer') {
    if (pct === 0.25) {
      newActs.push(mkActivity('Reviewing overall document structure and coherence'))
      updatedTask = 'Checking citation accuracy...'
    } else if (pct === 0.5) {
      newActs.push(mkActivity('All factual claims verified against primary sources'))
      newTl.push(mkTlEvent('reviewing', 'Quality review underway', 'Evaluating readability, accuracy, and completeness', 'reviewer'))
      updatedTask = 'Final readability assessment...'
    } else if (pct === 0.75) {
      newActs.push(mkActivity('Readability score: 72/100 (Professional grade)', 'success'))
      updatedTask = 'Completing final review...'
    }
  }

  // Update outline for writer milestones
  let updatedOutline = session.outline
  if (role === 'writer' && session.outline.length > 0) {
    const setStatus = (sections: OutlineSection[], idx: number, threshold: number, status: OutlineSectionStatus): OutlineSection[] =>
      sections.map((s, i) => ({
        ...s,
        status: i < threshold ? (i < idx ? 'completed' as const : status) : s.status,
        subsections: s.subsections?.map(sub => ({
          ...sub,
          status: i < threshold ? (i < idx ? 'completed' as const : status) : sub.status,
        })),
      }))
    if (pct === 0.25) updatedOutline = setStatus(session.outline, 0, 2, 'writing')
    else if (pct === 0.5) updatedOutline = setStatus(session.outline, 2, 5, 'writing')
    else if (pct === 0.75) updatedOutline = setStatus(session.outline, 5, 8, 'writing')
  }

  return {
    ...session,
    outline: updatedOutline,
    timeline: newTl.length > 0 ? [...session.timeline, ...newTl] : session.timeline,
    sources: newSources.length > 0 ? [...session.sources, ...newSources] : session.sources,
    findings: newFindings.length > 0 ? [...session.findings, ...newFindings] : session.findings,
    agents: session.agents.map((a, i) =>
      i === agentIdx ? { ...a, currentTask: updatedTask, activities: [...a.activities, ...newActs] } : a
    ),
  }
}

// ── Agent completion applicator ───────────────────────────────────────────────
function applyAgentCompletion(session: ResearchSession, agentIdx: number): ResearchSession {
  const agent = session.agents[agentIdx]
  const role = agent.role

  const newTl: TimelineEvent[] = []
  const newActs: AgentActivity[] = []
  let newSources: ResearchSource[] = []
  let newCitations: Citation[] = []
  const newFindings: Finding[] = []
  let updatedOutline = session.outline

  if (role === 'planner') {
    newActs.push(mkActivity('Research plan finalized — 7 agents ready for execution', 'success'))
    newTl.push(mkTlEvent('query_planned', 'Research plan finalized', 'Agent execution pipeline configured and ready', 'planner'))
    newFindings.push({
      id: `finding-${uid()}`, agentRole: 'planner',
      title: 'Research Scope & Objectives Defined',
      content: `The research on the specified topic has been scoped into 5 primary investigation areas. ${session.config.depth === 'deep' ? '18 sub-questions were generated for comprehensive coverage.' : '8 sub-questions were generated for focused coverage.'}`,
      confidence: 'high', timestamp: nowIso(), relatedSourceIds: [],
    })
    updatedOutline = buildOutlineSkeleton(session.config.topic)
  } else if (role === 'researcher') {
    newActs.push(mkActivity('Research synthesis complete — 12 key insights documented', 'success'))
    newTl.push(mkTlEvent('doc_analyzed', 'Research synthesis complete', 'Key insights extracted and cross-referenced', 'researcher'))
    const existingIds = new Set(session.sources.map(s => s.id))
    newSources = MOCK_SOURCES.slice(4, 7).filter(s => !existingIds.has(s.id)).map(s => ({ ...s, agentRole: 'researcher' as AgentRole }))
    newFindings.push({
      id: `finding-${uid()}`, agentRole: 'researcher',
      title: 'Key Research Insights Synthesized',
      content: 'Cross-domain analysis reveals three consistent patterns: (1) adoption barriers are primarily organizational rather than technical, (2) ROI timelines average 14-18 months, and (3) successful implementations share a phased deployment approach.',
      confidence: 'high', timestamp: nowIso(),
      relatedSourceIds: MOCK_SOURCES.slice(0, 4).map(s => s.id),
    })
  } else if (role === 'web_search') {
    newActs.push(mkActivity(`${Math.min(6, session.sources.length + 2)} high-relevance sources selected from 24 candidates`, 'success'))
    newTl.push(mkTlEvent('source_found', 'Web search complete', 'Top sources selected for further analysis', 'web_search'))
    const existingIds = new Set(session.sources.map(s => s.id))
    newSources = MOCK_SOURCES.slice(3, 6).filter(s => !existingIds.has(s.id)).map(s => ({ ...s, agentRole: 'web_search' as AgentRole }))
  } else if (role === 'critic') {
    newActs.push(mkActivity('Quality assessment complete — sources verified, 1 claim revised', 'success'))
    newTl.push(mkTlEvent('fact_verified', 'Fact-checking complete', 'All primary claims verified; 1 low-confidence claim revised', 'critic'))
    newFindings.push({
      id: `finding-${uid()}`, agentRole: 'critic',
      title: 'Source Quality Assessment',
      content: 'Of the collected sources, 5/8 have been verified as high-confidence (peer-reviewed or authoritative organizations). Two sources require caveats regarding recency. One statistical claim was revised after cross-reference analysis.',
      confidence: 'verified', timestamp: nowIso(),
      relatedSourceIds: MOCK_SOURCES.slice(0, 5).map(s => s.id),
    })
  } else if (role === 'writer') {
    newActs.push(mkActivity('All 7 document sections drafted (approx. 2,400 words)', 'success'))
    newTl.push(mkTlEvent('writing', 'First draft complete', 'All outline sections written (~2,400 words)', 'writer'))
    updatedOutline = (updatedOutline.length > 0 ? updatedOutline : session.outline).map(s => ({
      ...s, status: 'completed' as const,
      wordCount: s.wordCount ?? (180 + Math.floor(Math.random() * 220)),
      subsections: s.subsections?.map(sub => ({
        ...sub, status: 'completed' as const,
        wordCount: sub.wordCount ?? (80 + Math.floor(Math.random() * 120)),
      })),
    }))
    newFindings.push({
      id: `finding-${uid()}`, agentRole: 'writer',
      title: 'Draft Report Generated',
      content: 'The complete research draft has been generated with 7 major sections. Total word count: approximately 2,400 words across all sections, with all outline items addressed.',
      confidence: 'medium', timestamp: nowIso(), relatedSourceIds: [],
    })
  } else if (role === 'citation') {
    newActs.push(mkActivity('14 citations formatted; bibliography with 8 entries generated', 'success'))
    newTl.push(mkTlEvent('citation_generated', 'Bibliography complete', '14 in-text citations and full bibliography generated', 'citation'))
    const srcIds = session.sources.map(s => s.id)
    newCitations = MOCK_CITATIONS_POOL.slice(0, 5).map((c, i) => ({
      ...c, sourceId: srcIds[i % Math.max(srcIds.length, 1)] ?? 'src-1', agentRole: 'citation' as AgentRole,
    }))
  } else if (role === 'reviewer') {
    newActs.push(mkActivity('Research complete — quality score: 87/100 (Excellent)', 'success'))
    newTl.push(mkTlEvent('completed', 'Research complete', 'All quality checks passed. Report ready for export.', 'reviewer'))
    newFindings.push({
      id: `finding-${uid()}`, agentRole: 'reviewer',
      title: 'Final Quality Assessment',
      content: 'The research report achieves a quality score of 87/100. All factual claims are supported by cited sources. The narrative is coherent and follows a logical progression. Recommendations are actionable and grounded in evidence.',
      confidence: 'verified', timestamp: nowIso(),
      relatedSourceIds: session.sources.slice(0, 3).map(s => s.id),
    })
  }

  // Complete current agent
  const updatedAgents = session.agents.map((a, i) =>
    i === agentIdx
      ? { ...a, status: 'completed' as const, completedAt: nowIso(), activities: [...a.activities, ...newActs] }
      : a
  )

  // Start next agent
  const nextIdx = agentIdx + 1
  let finalAgents = updatedAgents
  if (nextIdx < finalAgents.length) {
    finalAgents = finalAgents.map((a, i) =>
      i === nextIdx
        ? { ...a, status: 'running' as const, startedAt: nowIso(), currentTask: AGENT_META[a.role].initialTask,
            activities: [mkActivity(`Starting: received handoff from ${AGENT_META[updatedAgents[agentIdx].role].name}`)] }
        : a
    )
  }

  return {
    ...session,
    agents: finalAgents,
    outline: updatedOutline,
    timeline: newTl.length > 0 ? [...session.timeline, ...newTl] : session.timeline,
    sources: newSources.length > 0 ? [...session.sources, ...newSources] : session.sources,
    citations: newCitations.length > 0 ? [...session.citations, ...newCitations] : session.citations,
    findings: newFindings.length > 0 ? [...session.findings, ...newFindings] : session.findings,
  }
}

// ── Compute one simulation tick ───────────────────────────────────────────────
function computeTick(session: ResearchSession): ResearchSession | null {
  if (['paused', 'completed', 'cancelled', 'failed'].includes(session.status)) return null

  const agentIdx = session.agents.findIndex(a => a.status === 'running' || a.status === 'retrying')
  if (agentIdx === -1) {
    return { ...session, status: 'completed', progress: 100, completedAt: nowIso() }
  }

  const agent = session.agents[agentIdx]
  const newDuration = agent.durationSeconds + 1
  const target = agent.targetDuration

  let updated: ResearchSession = {
    ...session,
    elapsedSeconds: session.elapsedSeconds + 1,
    agents: session.agents.map((a, i) => i === agentIdx ? { ...a, durationSeconds: newDuration } : a),
  }

  // Check milestones
  const milestones: Array<{ pct: 0.25 | 0.5 | 0.75; sec: number }> = [
    { pct: 0.25, sec: Math.max(1, Math.round(target * 0.25)) },
    { pct: 0.5,  sec: Math.max(2, Math.round(target * 0.5)) },
    { pct: 0.75, sec: Math.max(3, Math.round(target * 0.75)) },
  ]
  for (const { pct, sec } of milestones) {
    if (newDuration === sec) { updated = applyMilestone(updated, agentIdx, pct); break }
  }

  // Check completion
  if (newDuration >= target) {
    updated = applyAgentCompletion(updated, agentIdx)
    const allDone = updated.agents.every(a => ['completed', 'failed', 'skipped'].includes(a.status))
    if (allDone) updated = { ...updated, status: 'completed', progress: 100, completedAt: nowIso() }
  }

  // Recalculate progress
  if (updated.status !== 'completed') {
    const totalTarget = updated.agents.reduce((s, a) => s + a.targetDuration, 0)
    const completedSecs = updated.agents.filter(a => a.status === 'completed').reduce((s, a) => s + a.targetDuration, 0)
    const running = updated.agents.find(a => a.status === 'running' || a.status === 'retrying')
    const runningFrac = running ? (running.durationSeconds / running.targetDuration) * running.targetDuration : 0
    updated = { ...updated, progress: Math.min(99, Math.round(((completedSecs + runningFrac) / totalTarget) * 100)) }
  }

  // Update session status from running agent role
  const runningRole = updated.agents.find(a => a.status === 'running')?.role
  if (runningRole && updated.status !== 'completed') {
    const statusMap: Record<AgentRole, ResearchStatus> = {
      planner: 'planning', researcher: 'researching', web_search: 'researching',
      critic: 'researching', writer: 'writing', citation: 'reviewing', reviewer: 'reviewing',
    }
    updated = { ...updated, status: statusMap[runningRole] }
  }

  return updated
}

// ── Zustand store ─────────────────────────────────────────────────────────────
interface ResearchStoreState {
  sessions: Record<string, ResearchSession>
  startExecution:  (config: ResearchConfig) => string
  tickExecution:   (sessionId: string) => void
  pauseExecution:  (sessionId: string) => void
  resumeExecution: (sessionId: string) => void
  cancelExecution: (sessionId: string) => void
  retryAgent:      (sessionId: string, agentRole: AgentRole) => void
  removeSession:   (sessionId: string) => void
}

export const useResearchStore = create<ResearchStoreState>()(
  persist(
    (set, get) => ({
      sessions: {},

      startExecution: (config) => {
        const session = buildInitialSession(config)
        set(s => ({ sessions: { ...s.sessions, [session.id]: session } }))
        return session.id
      },

      tickExecution: (sessionId) => {
        const session = get().sessions[sessionId]
        if (!session) return
        const next = computeTick(session)
        if (next) set(s => ({ sessions: { ...s.sessions, [sessionId]: next } }))
      },

      pauseExecution: (sessionId) => set(s => {
        const session = s.sessions[sessionId]
        if (!session || session.status === 'completed') return s
        return { sessions: { ...s.sessions, [sessionId]: { ...session, status: 'paused', pausedAt: nowIso() } } }
      }),

      resumeExecution: (sessionId) => set(s => {
        const session = s.sessions[sessionId]
        if (!session || session.status !== 'paused') return s
        const runningRole = session.agents.find(a => a.status === 'running')?.role
        const statusMap: Record<AgentRole, ResearchStatus> = {
          planner: 'planning', researcher: 'researching', web_search: 'researching',
          critic: 'researching', writer: 'writing', citation: 'reviewing', reviewer: 'reviewing',
        }
        const status: ResearchStatus = runningRole ? statusMap[runningRole] : 'researching'
        return { sessions: { ...s.sessions, [sessionId]: { ...session, status, pausedAt: undefined } } }
      }),

      cancelExecution: (sessionId) => set(s => {
        const session = s.sessions[sessionId]
        if (!session) return s
        return { sessions: { ...s.sessions, [sessionId]: { ...session, status: 'cancelled' } } }
      }),

      retryAgent: (sessionId, agentRole) => set(s => {
        const session = s.sessions[sessionId]
        if (!session) return s
        const updatedAgents = session.agents.map(a =>
          a.role === agentRole && a.status === 'failed'
            ? { ...a, status: 'retrying' as const, durationSeconds: 0,
                activities: [...a.activities, mkActivity('Retrying agent...', 'warning')] }
            : a
        )
        return { sessions: { ...s.sessions, [sessionId]: { ...session, status: 'researching', agents: updatedAgents } } }
      }),

      removeSession: (sessionId) => set(s => {
        const { [sessionId]: _removed, ...rest } = s.sessions
        return { sessions: rest }
      }),
    }),
    { name: 'research-store', partialize: (s) => ({ sessions: s.sessions }) }
  )
)
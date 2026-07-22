import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'
import { useResearchSession, useResearchSimulation } from '../hooks'
import { useResearchStore } from '@/store/research.store'
import {
  WorkspaceHeader,
  AgentExecutionPanel,
  ResearchTimeline,
  SourcesPanel,
  CitationsPanel,
  OutlinePanel,
  FindingsPanel,
} from '../components'

type PanelTab = 'timeline' | 'sources' | 'citations' | 'outline' | 'findings'

const TABS: { value: PanelTab; label: string }[] = [
  { value: 'timeline',  label: 'Timeline'  },
  { value: 'sources',   label: 'Sources'   },
  { value: 'citations', label: 'Citations' },
  { value: 'outline',   label: 'Outline'   },
  { value: 'findings',  label: 'Findings'  },
]

// ── Cancel confirmation dialog ────────────────────────────────────────────────
function CancelDialog({ onConfirm, onDismiss }: { onConfirm: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cancel Research?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Cancelling will stop all agent execution. Any progress made so far will still be visible but the research will not complete.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Cancel Research
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResearchWorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const session = useResearchSession(sessionId)
  const [activeTab, setActiveTab] = useState<PanelTab>('timeline')
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const pauseExecution  = useResearchStore(s => s.pauseExecution)
  const resumeExecution = useResearchStore(s => s.resumeExecution)
  const cancelExecution = useResearchStore(s => s.cancelExecution)
  const retryAgent      = useResearchStore(s => s.retryAgent)

  // Start the simulation clock
  useResearchSimulation(sessionId)

  // ── Tab badge counts ──────────────────────────────────────────────────────
  const tabCounts: Partial<Record<PanelTab, number>> = {
    sources:   session?.sources.length ?? 0,
    citations: session?.citations.length ?? 0,
    outline:   session?.outline.length ?? 0,
    findings:  session?.findings.length ?? 0,
    timeline:  session?.timeline.length ?? 0,
  }

  if (!sessionId || !session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Session not found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This research session no longer exists or the ID is invalid.
        </p>
        <Link
          to={ROUTES.RESEARCH}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Research
        </Link>
      </div>
    )
  }

  function handleCancel() {
    setShowCancelDialog(true)
  }

  function confirmCancel() {
    cancelExecution(session!.id)
    setShowCancelDialog(false)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back nav */}
        <Link
          to={ROUTES.RESEARCH}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Research Sessions
        </Link>

        {/* Workspace header */}
        <WorkspaceHeader
          session={session}
          onPause={() => pauseExecution(session.id)}
          onResume={() => resumeExecution(session.id)}
          onCancel={handleCancel}
        />

        {/* ── Completion banner ── */}
        {session.status === 'completed' && (
          <div className="rounded-2xl border border-green-200 dark:border-green-800/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-green-800 dark:text-green-200">
                  Research Complete!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                  All {session.agents.length} agents finished successfully. Your research report is ready to generate.
                </p>
              </div>
              <button
                onClick={() => navigate(ROUTES.REPORTS)}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 dark:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors shrink-0"
              >
                <FileText className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* ── Cancelled banner ── */}
        {session.status === 'cancelled' && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This research session was cancelled. You can{' '}
              <Link to={ROUTES.RESEARCH_NEW} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                start a new session
              </Link>{' '}
              at any time.
            </p>
          </div>
        )}

        {/* ── Main 2-col layout ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* Left: Agent execution panel (2/5 columns) */}
          <div className="xl:col-span-2">
            <div className="sticky top-24">
              <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Agent Pipeline
              </h2>
              <AgentExecutionPanel
                agents={session.agents}
                onRetry={role => retryAgent(session.id, role)}
              />
            </div>
          </div>

          {/* Right: Tab panel (3/5 columns) */}
          <div className="xl:col-span-3">
            {/* Tab bar */}
            <div className="mb-4 flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
              {TABS.map(tab => {
                const count = tabCounts[tab.value]
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                      activeTab === tab.value
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 -mb-px'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-b-2 border-transparent -mb-px',
                    )}
                  >
                    {tab.label}
                    {typeof count === 'number' && count > 0 && (
                      <span className={cn(
                        'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                        activeTab === tab.value
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              {activeTab === 'timeline'  && <ResearchTimeline events={session.timeline} />}
              {activeTab === 'sources'   && <SourcesPanel sources={session.sources} />}
              {activeTab === 'citations' && <CitationsPanel citations={session.citations} sources={session.sources} />}
              {activeTab === 'outline'   && <OutlinePanel outline={session.outline} />}
              {activeTab === 'findings'  && <FindingsPanel findings={session.findings} />}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelDialog && (
        <CancelDialog
          onConfirm={confirmCancel}
          onDismiss={() => setShowCancelDialog(false)}
        />
      )}
    </>
  )
}

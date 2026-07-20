import {
  useDashboardStats,
  useRecentSessions,
  useRecentReports,
  useActivityFeed,
  useResearchProgress,
  useNotifications,
} from '../hooks'
import {
  WelcomeSection,
  StatsGrid,
  RecentSessionsWidget,
  RecentReportsWidget,
  ActivityFeedWidget,
  ResearchProgressWidget,
  QuickActionsPanel,
  NotificationsPanel,
} from '../components'

export default function DashboardPage() {
  const stats    = useDashboardStats()
  const sessions = useRecentSessions()
  const reports  = useRecentReports()
  const activity = useActivityFeed()
  const progress = useResearchProgress()
  const notifs   = useNotifications()

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <WelcomeSection />

      {/* Stats row */}
      <StatsGrid
        stats={stats.data}
        isLoading={stats.isPending}
        isError={stats.isError}
      />

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — takes 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <RecentSessionsWidget
            sessions={sessions.data}
            isLoading={sessions.isPending}
            isError={sessions.isError}
          />
          <RecentReportsWidget
            reports={reports.data}
            isLoading={reports.isPending}
            isError={reports.isError}
          />
          <ActivityFeedWidget
            items={activity.data}
            isLoading={activity.isPending}
            isError={activity.isError}
          />
        </div>

        {/* Right column — takes 1/3 */}
        <div className="space-y-6">
          <ResearchProgressWidget
            items={progress.data}
            isLoading={progress.isPending}
            isError={progress.isError}
          />
          <QuickActionsPanel />
          <NotificationsPanel
            notifications={notifs.data}
            isLoading={notifs.isPending}
            isError={notifs.isError}
          />
        </div>
      </div>
    </div>
  )
}
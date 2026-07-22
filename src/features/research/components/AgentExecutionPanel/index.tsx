import AgentCard from '../AgentStatus'
import type { ResearchAgent, AgentRole } from '@/types/research'

interface AgentExecutionPanelProps {
  agents: ResearchAgent[]
  onRetry?: (role: AgentRole) => void
}

export default function AgentExecutionPanel({ agents, onRetry }: AgentExecutionPanelProps) {
  const waiting   = agents.filter(a => a.status === 'waiting').length
  const running   = agents.filter(a => a.status === 'running' || a.status === 'retrying').length
  const completed = agents.filter(a => a.status === 'completed').length
  const failed    = agents.filter(a => a.status === 'failed').length

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Waiting',   count: waiting,   dot: 'bg-gray-400' },
          { label: 'Running',   count: running,   dot: 'bg-blue-500' },
          { label: 'Completed', count: completed, dot: 'bg-green-500' },
          ...(failed > 0 ? [{ label: 'Failed', count: failed, dot: 'bg-red-500' }] : []),
        ].map(item => (
          <span key={item.label} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className={`h-2 w-2 rounded-full ${item.dot}`} />
            {item.label} ({item.count})
          </span>
        ))}
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onRetry={onRetry} />
        ))}
      </div>
    </div>
  )
}

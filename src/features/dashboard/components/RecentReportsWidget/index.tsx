import { Link } from 'react-router-dom'
import { FileText, FileType2, File, Download, Eye, ChevronRight, BookOpen } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import type { DashboardReport, ReportFormat } from '../../types'

const FORMAT_CONFIG: Record<ReportFormat, { Icon: React.ElementType; label: string; color: string }> = {
  pdf:      { Icon: FileText,  label: 'PDF',      color: 'text-red-500' },
  docx:     { Icon: FileType2, label: 'DOCX',     color: 'text-blue-500' },
  markdown: { Icon: File,      label: 'Markdown', color: 'text-gray-500' },
}

function ReportCard({ report }: { report: DashboardReport }) {
  const fmt = FORMAT_CONFIG[report.format]

  return (
    <div className='flex items-start gap-4 py-4 first:pt-0 last:pb-0'>
      <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>
        <fmt.Icon className={cn('h-4 w-4', fmt.color)} aria-hidden='true' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-start gap-2'>
          <p className='text-sm font-semibold text-gray-900 dark:text-white leading-snug'>
            {report.title}
          </p>
          <Badge variant='default' size='sm'>{fmt.label}</Badge>
        </div>

        <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2'>
          {report.summary}
        </p>

        <div className='mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500'>
          <span>{formatRelativeTime(report.createdAt)}</span>
          <span>{report.pageCount} pages</span>
          <span>{report.citationCount} citations</span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Link to={ROUTES.REPORTS} title='Preview'>
          <Button size='xs' variant='ghost' leftIcon={<Eye className='h-3 w-3' />}>
            View
          </Button>
        </Link>
        <Button
          size='xs'
          variant='ghost'
          leftIcon={<Download className='h-3 w-3' />}
          title='Export (coming soon)'
          disabled
        >
          Export
        </Button>
      </div>
    </div>
  )
}

function ReportSkeleton() {
  return (
    <div className='flex items-start gap-4 py-4'>
      <Skeleton variant='rect' width={32} height={32} className='rounded-lg shrink-0' />
      <div className='flex-1 space-y-2'>
        <Skeleton width='75%' height={14} />
        <Skeleton width='90%' height={11} />
        <Skeleton width='40%' height={10} />
      </div>
    </div>
  )
}

interface Props {
  reports?: DashboardReport[]
  isLoading: boolean
  isError: boolean
}

export default function RecentReportsWidget({ reports, isLoading, isError }: Props) {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col'>
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-white'>Recent Reports</h2>
        <Link
          to={ROUTES.REPORTS}
          className='flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline rounded'
        >
          View all
          <ChevronRight className='h-3.5 w-3.5' aria-hidden='true' />
        </Link>
      </div>

      <div className='divide-y divide-gray-100 dark:divide-gray-700/50 px-5'>
        {isLoading && Array.from({ length: 3 }).map((_, i) => <ReportSkeleton key={i} />)}

        {isError && (
          <p className='py-8 text-center text-sm text-red-500'>Failed to load reports.</p>
        )}

        {!isLoading && !isError && (!reports || reports.length === 0) && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <BookOpen className='h-9 w-9 text-gray-300 dark:text-gray-600 mb-3' aria-hidden='true' />
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>No reports yet</p>
            <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
              Complete a research session to generate your first report.
            </p>
          </div>
        )}

        {!isLoading && reports?.map((r) => <ReportCard key={r.id} report={r} />)}
      </div>
    </div>
  )
}

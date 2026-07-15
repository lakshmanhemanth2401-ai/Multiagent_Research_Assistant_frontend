import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Microscope,
  FileText,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useSettingsStore } from '@/store/settings.store'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'

const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.CHAT,      label: 'Chat',       icon: MessageSquare },
  { path: ROUTES.RESEARCH,  label: 'Research',   icon: Microscope },
  { path: ROUTES.REPORTS,   label: 'Reports',    icon: FileText },
  { path: ROUTES.FILES,     label: 'Files',      icon: FolderOpen },
]

const BOTTOM_ITEMS = [
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

type NavItemProps = { path: string; label: string; icon: React.ElementType; collapsed: boolean; onClick?: () => void }

function NavItem({ path, label, icon: Icon, collapsed, onClick }: NavItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          collapsed && 'justify-center',
          isActive
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

function SidebarContent({
  collapsed,
  onClose,
}: {
  collapsed: boolean
  onClose?: () => void
}) {
  const { toggleSidebar } = useSettingsStore()

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-4',
          collapsed ? 'justify-center' : 'gap-3',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Microscope className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            Research AI
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-0.5 border-t border-gray-200 dark:border-gray-700 p-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} collapsed={collapsed} onClick={onClose} />
        ))}

        {/* Desktop collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'hidden md:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
            'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
            collapsed && 'justify-center',
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-900 transition-[width] duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-white dark:bg-gray-900 shadow-2xl">
            <SidebarContent collapsed={false} onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  )
}

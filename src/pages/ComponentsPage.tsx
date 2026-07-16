import { useState } from 'react'
import {
  Microscope, Search, Bell, Star, Trash2, Edit, Download,
  Plus, LayoutDashboard, MessageSquare, Settings, FolderOpen, FileText,
} from 'lucide-react'
import {
  Button, Badge, Spinner, Skeleton, Avatar,
  Input, Textarea, Select, Checkbox, Radio, RadioGroup, Toggle, FormField,
  Card, Alert, ProgressBar, EmptyState, ErrorState,
  Modal, Drawer, Tooltip, DropdownMenu,
  Tabs, Accordion, Breadcrumb, Pagination,
  useToast, SearchBar, FileUpload, ConfirmDialog,
} from '@/components/common'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Row({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div>
      {label && <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export default function ComponentsPage() {
  const toast = useToast()

  // State
  const [modalOpen, setModalOpen]         = useState(false)
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [confirmOpen, setConfirmOpen]     = useState(false)
  const [checked, setChecked]             = useState(false)
  const [toggled, setToggled]             = useState(false)
  const [radioVal, setRadioVal]           = useState('a')
  const [page, setPage]                   = useState(3)
  const [progress, setProgress]           = useState(65)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="mx-auto max-w-4xl px-6 pt-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Microscope className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Component Playground</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Day 3 — UI component library showcase for the Research Assistant design system
          </p>
        </div>

        {/* ── BUTTONS ── */}
        <Section title="Button">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Sizes">
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button leftIcon={<Plus className="h-4 w-4" />}>With icon</Button>
            <Button rightIcon={<Download className="h-4 w-4" />} variant="outline">Download</Button>
            <Button fullWidth variant="secondary">Full width</Button>
          </Row>
        </Section>

        {/* ── BADGE ── */}
        <Section title="Badge">
          <Row label="Variants">
            {(['default','primary','success','warning','danger','info'] as const).map((v) => (
              <Badge key={v} variant={v}>{v}</Badge>
            ))}
          </Row>
          <Row label="With dot">
            {(['success','warning','danger','info'] as const).map((v) => (
              <Badge key={v} variant={v} dot>{v}</Badge>
            ))}
          </Row>
          <Row label="Sizes">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Row>
        </Section>

        {/* ── SPINNER & SKELETON ── */}
        <Section title="Spinner & Skeleton">
          <Row label="Spinner sizes">
            {(['xs','sm','md','lg','xl'] as const).map((s) => (
              <Spinner key={s} size={s} />
            ))}
          </Row>
          <Row label="Skeleton">
            <div className="w-full space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton lines={3} />
              <div className="flex gap-3">
                <Skeleton variant="circle" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          </Row>
        </Section>

        {/* ── AVATAR ── */}
        <Section title="Avatar">
          <Row label="Sizes">
            {(['xs','sm','md','lg','xl'] as const).map((s) => (
              <Avatar key={s} size={s} name="John Doe" />
            ))}
          </Row>
          <Row label="With status">
            <Avatar name="Alice" status="online" />
            <Avatar name="Bob" status="busy" />
            <Avatar name="Carol" status="away" />
            <Avatar name="Dave" status="offline" />
          </Row>
          <Row label="Fallback icon">
            <Avatar size="md" />
            <Avatar size="lg" />
          </Row>
        </Section>

        {/* ── FORM ── */}
        <Section title="Form Elements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Search className="h-4 w-4" />} />
            <Input label="Error state" placeholder="Required" error="This field is required" required />
            <Input label="With hint" placeholder="Hint below" hint="This is a helpful hint text." />
            <Select
              label="Select option"
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
                { value: 'c', label: 'Option C', disabled: true },
              ]}
              placeholder="Choose…"
            />
            <Textarea label="Textarea" placeholder="Write something…" rows={3} />
            <div className="space-y-3">
              <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Remember me" description="Stay logged in for 30 days" />
              <Toggle checked={toggled} onChange={setToggled} label="Notifications" description="Receive email updates" />
            </div>
          </div>
          <RadioGroup
            name="demo"
            value={radioVal}
            onChange={setRadioVal}
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B', description: 'Extra description here' },
              { value: 'c', label: 'Option C (disabled)', disabled: true },
            ]}
          />
        </Section>

        {/* ── CARD ── */}
        <Section title="Card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Card.Header action={<Button size="xs" variant="ghost"><Edit className="h-4 w-4" /></Button>}>
                <p className="font-semibold text-gray-900 dark:text-white">Card Title</p>
                <p className="text-xs text-gray-500">Subtitle here</p>
              </Card.Header>
              <Card.Body>
                <p className="text-sm text-gray-600 dark:text-gray-400">Card body content goes here. This is the main area of the card.</p>
              </Card.Body>
              <Card.Footer>
                <div className="flex justify-end gap-2">
                  <Button size="xs" variant="outline">Cancel</Button>
                  <Button size="xs">Save</Button>
                </div>
              </Card.Footer>
            </Card>
            <Card hoverable padding="md">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Hoverable card</p>
              <p className="text-sm text-gray-500">Hover to see shadow effect. Uses padding="md".</p>
            </Card>
          </div>
        </Section>

        {/* ── ALERT ── */}
        <Section title="Alert">
          {(['success','error','warning','info'] as const).map((v) => (
            <Alert key={v} variant={v} title={`${v.charAt(0).toUpperCase() + v.slice(1)} Alert`} onClose={() => {}}>
              This is a {v} alert message with dismiss button.
            </Alert>
          ))}
        </Section>

        {/* ── PROGRESS BAR ── */}
        <Section title="Progress Bar">
          <ProgressBar value={progress} showValue label="Upload progress" />
          <ProgressBar value={80} variant="success" size="sm" label="Storage used" showValue />
          <ProgressBar value={45} variant="warning" size="xs" />
          <ProgressBar value={20} variant="danger" animated label="Critical" showValue />
          <div className="flex gap-4 items-center mt-2">
            <Button size="xs" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>−10%</Button>
            <Button size="xs" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
          </div>
        </Section>

        {/* ── EMPTY & ERROR STATE ── */}
        <Section title="Empty & Error States">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <EmptyState
                icon={<FolderOpen className="h-8 w-8" />}
                title="No files yet"
                description="Upload your first file to get started."
                action={{ label: 'Upload file', onClick: () => {} }}
              />
            </Card>
            <Card>
              <ErrorState
                title="Failed to load"
                description="Could not connect to the server."
                error="Connection refused at port 8000"
                onRetry={() => {}}
              />
            </Card>
          </div>
        </Section>

        {/* ── TABS ── */}
        <Section title="Tabs">
          <Tabs
            tabs={[
              { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
              { key: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" />, badge: <Badge variant="danger" size="sm">3</Badge> },
              { key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
              { key: 'disabled', label: 'Disabled', disabled: true },
            ]}
          >
            {(key) => (
              <Card padding="md">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Content for <strong>{key}</strong> tab
                </p>
              </Card>
            )}
          </Tabs>
          <Tabs
            variant="pill"
            tabs={[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'archived', label: 'Archived' },
            ]}
          />
        </Section>

        {/* ── ACCORDION ── */}
        <Section title="Accordion">
          <Accordion
            defaultOpen={['q1']}
            items={[
              { key: 'q1', title: 'What is the Research Assistant?', content: 'A multi-agent AI platform for conducting deep research using autonomous agents.' },
              { key: 'q2', title: 'How many agents can run in parallel?', content: 'Up to 5 agents can run simultaneously, each specializing in a different aspect of research.' },
              { key: 'q3', title: 'What file formats are supported?', content: 'PDF, DOCX, TXT, MD, CSV, and JSON formats are supported for document ingestion.' },
            ]}
          />
        </Section>

        {/* ── BREADCRUMB ── */}
        <Section title="Breadcrumb">
          <Breadcrumb items={[{ label: 'Research', href: '/research' }, { label: 'Session #42' }]} />
          <Breadcrumb showHome={false} items={[{ label: 'Files', href: '/files' }, { label: 'Documents', href: '/files/docs' }, { label: 'report.pdf' }]} />
        </Section>

        {/* ── PAGINATION ── */}
        <Section title="Pagination">
          <Pagination page={page} totalPages={10} onChange={setPage} />
          <Pagination page={page} totalPages={5} onChange={setPage} siblingCount={2} />
        </Section>

        {/* ── SEARCH BAR ── */}
        <Section title="Search Bar">
          <SearchBar placeholder="Search research sessions…" fullWidth onSearch={(v) => toast(`Searching: "${v}"`, 'info')} />
        </Section>

        {/* ── TOOLTIP ── */}
        <Section title="Tooltip">
          <Row>
            {(['top','right','bottom','left'] as const).map((p) => (
              <Tooltip key={p} content={`Tooltip ${p}`} placement={p}>
                <Button size="sm" variant="outline">{p}</Button>
              </Tooltip>
            ))}
          </Row>
        </Section>

        {/* ── DROPDOWN ── */}
        <Section title="Dropdown Menu">
          <DropdownMenu
            trigger={<Button variant="outline" rightIcon={<Settings className="h-4 w-4" />}>Actions</Button>}
            items={[
              { key: 'edit',     label: 'Edit',     icon: <Edit className="h-4 w-4" />,     onClick: () => toast('Edit clicked', 'info') },
              { key: 'download', label: 'Download', icon: <Download className="h-4 w-4" />, onClick: () => toast('Download clicked', 'success') },
              { key: 'star',     label: 'Favourite', icon: <Star className="h-4 w-4" />,   onClick: () => toast('Starred!', 'success') },
              { key: 'divider',  label: '',          divider: true },
              { key: 'delete',   label: 'Delete',   icon: <Trash2 className="h-4 w-4" />,  onClick: () => setConfirmOpen(true), danger: true },
            ]}
          />
        </Section>

        {/* ── TOAST ── */}
        <Section title="Toast Notifications">
          <Row>
            {(['success','error','warning','info'] as const).map((t) => (
              <Button key={t} size="sm" variant="outline" onClick={() => toast(`This is a ${t} toast`, t)}>
                {t}
              </Button>
            ))}
          </Row>
        </Section>

        {/* ── MODAL & DRAWER ── */}
        <Section title="Modal & Drawer">
          <Row>
            <Button onClick={() => setModalOpen(true)} leftIcon={<Bell className="h-4 w-4" />}>
              Open Modal
            </Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              Confirm Dialog
            </Button>
          </Row>
        </Section>

        {/* ── FILE UPLOAD ── */}
        <Section title="File Upload">
          <FileUpload accept=".pdf,.docx,.txt" multiple maxSizeMB={10} onFilesSelected={(f) => toast(`${f.length} file(s) selected`, 'success')} />
        </Section>
      </div>

      {/* ── MODALS ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Sample Modal"
        description="This demonstrates the modal component."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setModalOpen(false); toast('Saved!', 'success') }}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Enter name" />
          <Textarea label="Description" placeholder="Write something…" rows={3} />
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Settings Drawer"
        side="right"
        footer={
          <Button fullWidth onClick={() => { setDrawerOpen(false); toast('Settings saved', 'success') }}>
            Save settings
          </Button>
        }
      >
        <div className="space-y-4">
          <Toggle label="Dark mode" description="Toggle application theme" checked={toggled} onChange={setToggled} />
          <Toggle label="Notifications" description="Receive email updates" />
          <Toggle label="Analytics" description="Help us improve the product" />
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); toast('Item deleted', 'error') }}
        title="Delete this item?"
        description="This action is permanent and cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}

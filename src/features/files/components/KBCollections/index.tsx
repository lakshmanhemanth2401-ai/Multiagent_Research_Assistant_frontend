import { useState } from 'react'
import {
  Plus, MoreVertical, Pencil, Trash2, BookOpen, FileText, HardDrive, Check, X,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useFilesStore } from '../store'
import type { KBCollection, KBDocument } from '../types'
import { formatFileSize } from '../FileCard'

interface CollectionCardProps {
  col: KBCollection
  docs: KBDocument[]
  onOpen: () => void
}

function CollectionCard({ col, docs, onOpen }: CollectionCardProps) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [renaming, setRenaming]   = useState(false)
  const [newName, setNewName]     = useState(col.name)
  const [showConfirm, setShowConfirm] = useState(false)

  const { renameCollection, deleteCollection } = useFilesStore()
  const totalSize = docs.reduce((s, d) => s + d.size, 0)
  const indexed   = docs.filter(d => d.indexingStatus === 'indexed').length

  function saveRename() {
    if (newName.trim() && newName !== col.name) renameCollection(col.id, newName.trim())
    setRenaming(false)
  }

  function confirmDelete() {
    deleteCollection(col.id)
    setShowConfirm(false)
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-sm transition-shadow relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
          {renaming ? (
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setRenaming(false) }}
              onBlur={saveRename}
              className="flex-1 min-w-0 rounded border border-primary-400 bg-transparent px-1.5 py-0.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-400"
            />
          ) : (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{col.name}</h3>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                <button
                  onClick={() => { setMenuOpen(false); setRenaming(true); setNewName(col.name) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" /> Rename
                </button>
                <button
                  onClick={() => { setMenuOpen(false); setShowConfirm(true) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {col.description && (
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{col.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{col.documentIds.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Docs</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatFileSize(totalSize)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{indexed}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Indexed</p>
        </div>
      </div>

      {/* Open button */}
      <button
        onClick={onOpen}
        className="mt-4 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        View Documents
      </button>

      {/* Delete confirm */}
      {showConfirm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/95 dark:bg-gray-800/95 p-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Delete collection?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Documents will not be deleted.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Collection document assignment modal ──────────────────────────────────────
function AssignModal({
  collection, allDocs, onClose,
}: { collection: KBCollection; allDocs: KBDocument[]; onClose: () => void }) {
  const { addDocToCollection, removeDocFromCollection } = useFilesStore()
  const ready = allDocs.filter(d => d.status === 'ready')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Documents in "{collection.name}"
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {ready.length === 0 ? (
            <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No ready documents available.</p>
          ) : ready.map(doc => {
            const inCollection = collection.documentIds.includes(doc.id)
            return (
              <label key={doc.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={inCollection}
                  onChange={() => inCollection
                    ? removeDocFromCollection(doc.id, collection.id)
                    : addDocToCollection(doc.id, collection.id)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{doc.fileType.toUpperCase()}</p>
                </div>
                {inCollection && <Check className="h-4 w-4 text-primary-500 shrink-0" />}
              </label>
            )
          })}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose}
            className="w-full rounded-xl bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── KBCollections (main component) ───────────────────────────────────────────
interface KBCollectionsProps {
  documents: KBDocument[]
  onFilterByCollection?: (colId: string | undefined) => void
}

export default function KBCollections({ documents, onFilterByCollection }: KBCollectionsProps) {
  const collections    = useFilesStore(s => s.collections)
  const createCollection = useFilesStore(s => s.createCollection)

  const [creating, setCreating]       = useState(false)
  const [newName, setNewName]         = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [openColId, setOpenColId]     = useState<string | null>(null)

  function handleCreate() {
    if (!newName.trim()) return
    createCollection(newName.trim(), newDesc.trim() || undefined)
    setNewName(''); setNewDesc(''); setCreating(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Knowledge Collections</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Organize documents into thematic groups</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Collection
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-2xl border border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/20 p-4 space-y-2">
          <input
            autoFocus
            placeholder="Collection name *"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500"
          />
          <input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-primary-500"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setCreating(false); setNewName(''); setNewDesc('') }}
              className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!newName.trim()}
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
              Create
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {collections.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-12 text-center">
          <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No collections yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create a collection to organize your documents</p>
        </div>
      )}

      {/* Collection grid */}
      {collections.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map(col => {
            const colDocs = documents.filter(d => col.documentIds.includes(d.id))
            return (
              <CollectionCard
                key={col.id}
                col={col}
                docs={colDocs}
                onOpen={() => {
                  setOpenColId(col.id)
                  onFilterByCollection?.(col.id)
                }}
              />
            )
          })}
        </div>
      )}

      {/* Uncollected docs */}
      {documents.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uncollected</span>
              <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                {documents.filter(d => d.collectionIds.length === 0).length}
              </span>
            </div>
            <button
              onClick={() => onFilterByCollection?.(undefined)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              View in library
            </button>
          </div>
        </div>
      )}

      {/* Assign modal */}
      {openColId && (() => {
        const col = collections.find(c => c.id === openColId)
        if (!col) return null
        return (
          <AssignModal
            collection={col}
            allDocs={documents}
            onClose={() => setOpenColId(null)}
          />
        )
      })()}
    </div>
  )
}

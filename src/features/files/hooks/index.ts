import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFilesStore } from '../store'
import { deleteDocumentApi, renameDocumentApi } from '../api'
import { QUERY_KEYS } from '@/utils/constants'
import type { KBDocument, DocumentFilter, DocumentSort } from '../types'

// ── Derived document list with client-side filter + sort ──────────────────────
export function useDocuments(filter: DocumentFilter, sort: DocumentSort) {
  const raw = useFilesStore(s => s.documents)
  return useMemo(() => {
    let docs = [...raw]

    // Search
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase()
      docs = docs.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.originalName.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    // File type filter
    if (filter.fileTypes.length > 0) {
      docs = docs.filter(d => filter.fileTypes.includes(d.fileType))
    }

    // Status filter
    if (filter.statuses.length > 0) {
      docs = docs.filter(d => filter.statuses.includes(d.status))
    }

    // Collection filter
    if (filter.collectionId) {
      docs = docs.filter(d => d.collectionIds.includes(filter.collectionId!))
    }

    // Sort
    docs.sort((a, b) => {
      let cmp = 0
      if (sort.field === 'name') cmp = a.name.localeCompare(b.name)
      else if (sort.field === 'size') cmp = a.size - b.size
      else if (sort.field === 'uploadedAt') cmp = a.uploadedAt.localeCompare(b.uploadedAt)
      else if (sort.field === 'fileType') cmp = a.fileType.localeCompare(b.fileType)
      return sort.direction === 'asc' ? cmp : -cmp
    })

    return docs
  }, [raw, filter, sort])
}

export function useDocument(id: string | undefined): KBDocument | undefined {
  return useFilesStore(s => id ? s.documents.find(d => d.id === id) : undefined)
}

export function useUploads() {
  return useFilesStore(s => s.uploads)
}

export function useKBCollections() {
  return useFilesStore(s => s.collections)
}

// ── Mutations (wrapped so they can later call real APIs) ──────────────────────
export function useDeleteDocument() {
  const deleteDoc = useFilesStore(s => s.deleteDocument)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDocumentApi(id)
      deleteDoc(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS }),
  })
}

export function useRenameDocument() {
  const renameDoc = useFilesStore(s => s.renameDocument)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await renameDocumentApi(id, name)
      renameDoc(id, name)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS }),
  })
}

// Stats helper
export function useLibraryStats() {
  const documents = useFilesStore(s => s.documents)
  return useMemo(() => {
    const total = documents.length
    const totalSize = documents.reduce((sum, d) => sum + d.size, 0)
    const ready = documents.filter(d => d.status === 'ready').length
    const indexed = documents.filter(d => d.indexingStatus === 'indexed').length
    const failed = documents.filter(d => d.status === 'failed').length
    return { total, totalSize, ready, indexed, failed }
  }, [documents])
}

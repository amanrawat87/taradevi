'use client'
import AIAssistantButton from '../../../components/dashboard/AIAssistantButton'
import { useState, useEffect } from 'react'
import Breadcrumb from '../../../components/dashboard/Breadcrumb'
import DataTable from '../../../components/dashboard/DataTable'
import TableToolbar from '../../../components/dashboard/TableToolbar'
import Toast from '../../../components/dashboard/Toast'
import RichEditor from '../../../components/dashboard/RichEditor'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Switch } from '../../../components/ui/switch'
import { FloatingInput, FloatingTextarea, FloatingSelect } from '../../../components/ui/floating-input'
import { SlugInput } from '../../../components/dashboard/SlugInput'
import { SortInput } from '../../../components/dashboard/SortInput'
import { Edit2, Trash2, Plus, ImageIcon } from 'lucide-react'
import ConfirmDeleteModal from '../../../components/dashboard/ConfirmDeleteModal'

const BASE_URL = ''

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  author: '', category: '', publishedAt: '',
  alt: '', bread_heading: '',
  isPublished: true, sort: 0,
  metatag: '', metakeywords: '', metaDescription: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', twitterCard: 'summary_large_image',
  robots: 'index, follow', schema: '',
}

function BlogModal({ blog, nextSort = 1, onClose, onSave, saving }) {
  const [form, setForm] = useState(blog ? {
    ...blog,
    metakeywords: Array.isArray(blog.metakeywords) ? blog.metakeywords.join(', ') : (blog.metakeywords || ''),
    schema: blog.schemaMarkup ? JSON.stringify(blog.schemaMarkup, null, 2) : '',
  } : { ...EMPTY, sort: nextSort })

  const [activeTab, setActiveTab] = useState('general')
  // Slug is "linked" only when creating a new blog
  const [slugLinked, setSlugLinked] = useState(!blog)
  const [sortIsAuto, setSortIsAuto] = useState(!blog)

  // image states
  const [coverFile, setCoverFile] = useState(null)
  const [breadFile, setBreadFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(blog?.coverImage || '')
  const [breadPreview, setBreadPreview] = useState(blog?.breadImage || '')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleFile(e, setFile, setPreview) {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...form }, { coverFile, breadFile })
  }

  const tabs = [
    { key: 'general', label: 'General Info' },
    { key: 'seo',     label: 'SEO Settings' },
    { key: 'schema',  label: 'Schema' },
  ]

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{blog ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
          <p className="text-muted-foreground text-sm">Fill out the information below to {blog ? 'update' : 'create'} this blog post.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          
          <div className="flex gap-6 border-b border-border px-2">
            {tabs.map(t => (
              <button
                key={t.key} type="button"
                onClick={() => setActiveTab(t.key)}
                className={`py-3 text-[14px] font-semibold transition-colors relative ${
                  activeTab === t.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
                {activeTab === t.key && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md" />}
              </button>
            ))}
          </div>

          <div className="py-2 space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput 
                    label="Title *" 
                    required 
                    value={form.title} 
                    onChange={e => {
                      f('title', e.target.value)
                      if (slugLinked) f('slug', toSlug(e.target.value))
                    }} 
                    rightElement={<AIAssistantButton context="Blog Post" field="Catchy Blog Post Title" onGenerate={(val) => {
                      f('title', val)
                      if (slugLinked) f('slug', toSlug(val))
                    }} />}
                  />
                  <SlugInput
                    label="Slug *"
                    required
                    value={form.slug}
                    isEditing={!!blog}
                    linked={slugLinked}
                    onToggleLink={() => {
                      const nextLinked = !slugLinked
                      setSlugLinked(nextLinked)
                      if (nextLinked) f('slug', toSlug(form.title))
                    }}
                    onChange={v => {
                      setSlugLinked(false)
                      f('slug', v)
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput label="Category" value={form.category} onChange={e => f('category', e.target.value)} />
                  <FloatingInput label="Author" value={form.author} onChange={e => f('author', e.target.value)} />
                </div>

                <FloatingTextarea label="Excerpt (Short description)" value={form.excerpt} onChange={e => f('excerpt', e.target.value)} rows={3} rightElement={<AIAssistantButton context={form.title} field="SEO-friendly short excerpt for blog" onGenerate={(val) => f('excerpt', val)} />} />

                <div className="space-y-2 w-full overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-foreground/80 block">Content</label>
                    <AIAssistantButton context={form.title} field="Full HTML Blog Post Content" onGenerate={(val) => f('content', val)} />
                  </div>
                  <div className="border border-input/60 rounded-xl overflow-hidden shadow-sm w-full">
                    <RichEditor value={form.content} onChange={v => f('content', v)} placeholder="Blog content..." minHeight={350} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-input/60 rounded-xl p-6 bg-muted/10">
                    <label className="text-sm font-semibold text-foreground/80 mb-1 block">Cover Image</label>
                    <p className="text-[11px] text-muted-foreground mb-3">Main blog thumbnail</p>
                    <input type="file" accept="image/*" onChange={e => handleFile(e, setCoverFile, setCoverPreview)} className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input" />
                    {coverPreview && (
                      <img src={coverPreview} alt="cover preview" className="mt-4 max-h-32 rounded-lg border border-border shadow-sm object-cover" />
                    )}
                  </div>
                  <div className="border border-input/60 rounded-xl p-6 bg-muted/10">
                    <label className="text-sm font-semibold text-foreground/80 mb-1 block">Breadcrumb Banner Image</label>
                    <p className="text-[11px] text-muted-foreground mb-3">Top banner image for this post</p>
                    <input type="file" accept="image/*" onChange={e => handleFile(e, setBreadFile, setBreadPreview)} className="flex h-11 w-full rounded-xl border border-input/60 bg-background px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary cursor-pointer hover:border-input" />
                    {breadPreview && (
                      <img src={breadPreview} alt="bread preview" className="mt-4 max-h-32 rounded-lg border border-border shadow-sm object-cover" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput label="Image ALT Text" value={form.alt} onChange={e => f('alt', e.target.value)} rightElement={<AIAssistantButton context={form.title} field="SEO alt text for blog image" onGenerate={(val) => f('alt', val)} />} />
                  <FloatingInput label="Breadcrumb Heading" value={form.bread_heading} onChange={e => f('bread_heading', e.target.value)} rightElement={<AIAssistantButton context={form.title || 'Blog Post'} field="Breadcrumb Heading" onGenerate={(val) => f('bread_heading', val)} />} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FloatingInput type="date" label="Published Date" value={form.publishedAt} onChange={e => f('publishedAt', e.target.value)} />
                  <SortInput
                    label="Sort Order"
                    value={form.sort}
                    isEditing={Boolean(blog)}
                    isAuto={sortIsAuto}
                    onManualEdit={() => setSortIsAuto(false)}
                    onChange={v => f('sort', v)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput label="Meta Title" value={form.metatag} onChange={e => f('metatag', e.target.value)} rightElement={<AIAssistantButton context={form.title} field="SEO Meta Title" onGenerate={(val) => f('metatag', val)} />} />
                  <FloatingInput label="Canonical URL" value={form.canonicalUrl} onChange={e => f('canonicalUrl', e.target.value)} />
                </div>
                <FloatingTextarea label="Meta Description" value={form.metaDescription} onChange={e => f('metaDescription', e.target.value)} rows={2} rightElement={<AIAssistantButton context={form.title} field="SEO Meta Description" onGenerate={(val) => f('metaDescription', val)} />} />
                <FloatingInput label="Meta Keywords (Comma separated)" value={form.metakeywords} onChange={e => f('metakeywords', e.target.value)} rightElement={<AIAssistantButton context={form.title} field="SEO Meta Keywords (comma separated)" onGenerate={(val) => f('metakeywords', val)} />} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingSelect label="Robots" value={form.robots} onChange={e => f('robots', e.target.value)}>
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </FloatingSelect>
                  <FloatingSelect label="Twitter Card" value={form.twitterCard} onChange={e => f('twitterCard', e.target.value)}>
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                  </FloatingSelect>
                </div>

                <h4 className="font-semibold text-foreground mt-8 mb-2">Open Graph</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput label="OG Title" value={form.ogTitle} onChange={e => f('ogTitle', e.target.value)} rightElement={<AIAssistantButton context={form.title} field="OpenGraph Title" onGenerate={(val) => f('ogTitle', val)} />} />
                  <FloatingInput label="OG Description" value={form.ogDescription} onChange={e => f('ogDescription', e.target.value)} rightElement={<AIAssistantButton context={form.title} field="OpenGraph Description" onGenerate={(val) => f('ogDescription', val)} />} />
                </div>
              </div>
            )}

            {activeTab === 'schema' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <FloatingTextarea 
                  label="Schema JSON-LD" 
                  value={form.schema} 
                  onChange={e => f('schema', e.target.value)} 
                  rows={15} 
                  className="font-mono text-xs"
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "Post Title"\n}`}
                  rightElement={<AIAssistantButton context={form.title} field="" isSchema={true} onGenerate={(val) => f('schema', val)} />}
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-6 border-t border-border mt-6">
            <Button variant="ghost" type="button" onClick={onClose} disabled={saving} className="rounded-full px-6 text-muted-foreground hover:bg-muted/50 font-medium">Cancel</Button>
            <Button type="submit" disabled={saving} className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
              {saving ? 'Saving...' : 'Save Blog Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function BlogManagementPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  
  // Standardization states
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'single', id: null })

  function addToast(message, type = 'success') {
    setToasts(t => [...t, { id: Date.now(), message, type }])
  }

  useEffect(() => { fetchBlogs() }, [])

  async function fetchBlogs() {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/blog`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setRows(json.data || json || [])
    } catch (err) {
      addToast('Could not load blogs: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form, { coverFile, breadFile }) {
    try {
      setSaving(true)

      const fd = new FormData()
      fd.append('title',         form.title        || '')
      fd.append('slug',          form.slug         || '')
      fd.append('excerpt',       form.excerpt      || '')
      fd.append('content',       form.content      || '')
      fd.append('author',        form.author       || '')
      fd.append('category',      form.category     || '')
      fd.append('alt',           form.alt          || '')
      fd.append('bread_heading', form.bread_heading|| '')
      fd.append('publishedAt',   form.publishedAt  || '')
      fd.append('sort',          form.sort         || 0)
      
      const isEdit = Boolean(form._id)
      
      if (!isEdit) {
        fd.append('isPublished', 'true')
      } else {
        fd.append('isPublished', form.isPublished ? 'true' : 'false')
      }
      
      // SEO
      fd.append('metatag',         form.metatag        || '')
      fd.append('metaDescription', form.metaDescription || '')
      fd.append('canonicalUrl',    form.canonicalUrl   || '')
      fd.append('ogTitle',         form.ogTitle        || '')
      fd.append('ogDescription',   form.ogDescription  || '')
      fd.append('twitterCard',     form.twitterCard    || 'summary_large_image')
      fd.append('robots',          form.robots         || 'index, follow')
      
      fd.append('metakeywords', JSON.stringify(
        form.metakeywords
          ? form.metakeywords.split(',').map(k => k.trim()).filter(Boolean)
          : []
      ))
      
      fd.append('schemaMarkup', form.schema || '{}')

      if (coverFile) fd.append('coverImage', coverFile)
      if (breadFile) fd.append('breadImage', breadFile)

      const url    = isEdit ? `${BASE_URL}/api/blog/${form._id}` : `${BASE_URL}/api/blog`
      const method = isEdit ? 'PUT' : 'POST'

      const res  = await fetch(url, { method, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')

      addToast(isEdit ? 'Blog updated!' : 'Blog created!')
      setModal(null)
      fetchBlogs()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      setConfirmModal({ isOpen: false, type: 'single', id: null })
      setDeletingId(id)
      const res  = await fetch(`${BASE_URL}/api/blog/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')
      addToast('Deleted.', 'warning')
      setRows(r => r.filter(x => x._id !== id))
      setSelectedIds(prev => prev.filter(x => x !== id))
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleBulkDelete() {
    try {
      setConfirmModal({ isOpen: false, type: 'bulk', id: null })
      setBulkDeleting(true)
      await Promise.all(selectedIds.map(id => fetch(`${BASE_URL}/api/blog/${id}`, { method: 'DELETE' })))
      setRows(r => r.filter(x => !selectedIds.includes(x._id)))
      setSelectedIds([])
      addToast('Blog posts deleted.', 'warning')
    } catch (err) {
      alert('Error deleting some posts: ' + err.message)
    } finally {
      setBulkDeleting(false)
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      setTogglingId(id)
      const existing = rows.find(x => x._id === id)
      const fd = new FormData()
      fd.append('title', existing?.title || '')
      fd.append('slug', existing?.slug || '')
      fd.append('isPublished', (!currentStatus).toString())
      const res = await fetch(`${BASE_URL}/api/blog/${id}`, { method: 'PUT', body: fd })
      if (!res.ok) throw new Error(await res.text())
      setRows(r => r.map(x => x._id === id ? { ...x, isPublished: !currentStatus } : x))
      addToast('Status updated!')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) setSelectedIds([])
    else setSelectedIds(filteredData.map(x => x._id))
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filteredData = rows
    .filter(r => 
      r.title?.toLowerCase().includes(search.toLowerCase()) || 
      r.category?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sort === 'a-z') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'z-a') return (b.title || '').localeCompare(a.title || '')
      return (a.sort || 0) - (b.sort || 0)
    })

  const columns = [
    {
      key: 'cover',
      label: 'Cover',
      render: (row) => (
        <div className="w-16 h-12 rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center">
          {row.coverImage ? (
            <img src={row.coverImage} className="w-full h-full object-cover" alt={row.alt} />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
          )}
        </div>
      )
    },
    {
      key: 'details',
      label: 'Post Details',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[14px] text-foreground">{row.title}</span>
          <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{row.excerpt || '—'}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge variant="outline" className="bg-muted text-foreground/80 font-medium">
          {row.category || 'Uncategorized'}
        </Badge>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <span className="text-xs font-medium text-muted-foreground">
          {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {togglingId === row._id ? (
            <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
          ) : (
            <Switch 
              checked={row.isPublished}
              onCheckedChange={() => handleToggleStatus(row._id, row.isPublished)}
            />
          )}
        </div>
      )
    },
    {
      key: 'actions',
      align: 'right',
      label: 'Action',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); setModal(row); }} className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'single', id: row._id }); }} disabled={deletingId === row._id} className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 disabled:opacity-50">
            {deletingId === row._id ? <span className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <Breadcrumb 
        title="Blog Management" 
        subtitle={`Manage your blog posts (${rows.filter(r => r.isPublished).length} published)`}
        crumbs={[{ label: 'Blog Management' }]} 
      />
      
      <TableToolbar 
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setConfirmModal({ isOpen: true, type: 'bulk', id: null })}
        bulkDeleting={bulkDeleting}
        onAdd={() => setModal('new')}
        addLabel="Add Post"
      />

      <DataTable 
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={(row) => setModal(row)}
        actions={false}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelect}
      />

      {modal && (
        <BlogModal
          blog={modal === 'new' ? null : modal}
          nextSort={rows.reduce((max, r) => Math.max(max, Number(r.sort) || 0), 0) + 1}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        isDeleting={confirmModal.type === 'single' ? deletingId === confirmModal.id : bulkDeleting}
        onClose={() => setConfirmModal({ isOpen: false, type: 'single', id: null })}
        onConfirm={() => confirmModal.type === 'single' ? handleDelete(confirmModal.id) : handleBulkDelete()}
        title={confirmModal.type === 'single' ? "Delete Blog Post" : "Bulk Delete"}
        message={confirmModal.type === 'single' 
          ? "Are you sure you want to delete this blog post? This action cannot be undone." 
          : `Are you sure you want to delete ${selectedIds.length} blog posts? This action cannot be undone.`}
      />
      <Toast toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}

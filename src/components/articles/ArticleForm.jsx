import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createArticle, updateArticle } from '../../services/articlesService'
import { slugify } from '../../utils/slugify'
import { CATEGORIES } from '../../constants/categories'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Toast from '../ui/Toast'

export default function ArticleForm({ article = null }) {
  const { userProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    excerpt: article?.excerpt ?? '',
    content: article?.content ?? '',
    category: article?.category ?? '',
    tags: article?.tags?.join(', ') ?? '',
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!article && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }))
    }
  }, [form.title, article])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'El título es requerido.'
    if (!form.excerpt.trim()) next.excerpt = 'El resumen es requerido.'
    if (!form.content.trim()) next.content = 'El contenido es requerido.'
    else if (form.content.trim().length < 100) next.content = 'El contenido debe tener al menos 100 caracteres.'
    if (!form.category) next.category = 'Selecciona una categoría.'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    setServerError('')

    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const data = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        tags,
      }

      if (article) {
        await updateArticle(article.id, data)
      } else {
        await createArticle(data, userProfile)
      }

      navigate('/panel')
    } catch {
      setToast({ type: 'error', message: 'Error al guardar el artículo. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const isLoading = saving

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Input
        id="title"
        name="title"
        label="Título *"
        placeholder="Un título evocador..."
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <Input
        id="slug"
        name="slug"
        label="Slug (URL)"
        placeholder="generado-automaticamente"
        value={form.slug}
        onChange={handleChange}
        error={errors.slug}
      />

      <Textarea
        id="excerpt"
        name="excerpt"
        label="Resumen *"
        placeholder="Una introducción breve y elegante..."
        rows={3}
        value={form.excerpt}
        onChange={handleChange}
        error={errors.excerpt}
      />

      <Textarea
        id="content"
        name="content"
        label="Contenido *"
        placeholder="Escribe tu artículo aquí..."
        rows={14}
        value={form.content}
        onChange={handleChange}
        error={errors.content}
      />

      <Select
        id="category"
        name="category"
        label="Categoría *"
        placeholder="Selecciona una categoría"
        options={CATEGORIES}
        value={form.category}
        onChange={handleChange}
        error={errors.category}
      />

      <Input
        id="tags"
        name="tags"
        label="Etiquetas (separadas por coma)"
        placeholder="perfume, lujo, tendencias"
        value={form.tags}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/panel')}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {article ? 'Guardar cambios' : 'Crear artículo'}
        </Button>
      </div>
    </form>
  )
}

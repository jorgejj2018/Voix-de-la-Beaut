import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import ArticleCard from '../../components/articles/ArticleCard'
import ArticleGrid from '../../components/articles/ArticleGrid'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatDate'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../context/AuthContext'
import { getPublishedArticlesQuery } from '../../services/articlesService'
import { CATEGORIES } from '../../constants/categories'

const publishedQuery = getPublishedArticlesQuery()

const CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80',
    category: 'Belleza',
    title: 'El arte del ritual',
    subtitle: 'Una exploración del lujo cotidiano en la belleza moderna',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    category: 'Moda',
    title: 'La silueta de 2026',
    subtitle: 'Tendencias que redefinen la elegancia esta temporada',
  },
  {
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&q=80',
    category: 'Perfumería',
    title: 'El perfume y la memoria',
    subtitle: 'Fragancias que narran historias imborrables',
  },
]

function HeroCarousel() {
  const { currentUser } = useAuth()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % CAROUSEL_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = CAROUSEL_SLIDES[current]

  return (
    <div className="relative h-[75vh] overflow-hidden bg-[#1A1A1B]">
      {CAROUSEL_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt={s.title} className="h-full w-full object-cover opacity-50" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {slide.category}
        </span>
        <h2 className="font-display text-4xl font-bold text-white md:text-6xl">{slide.title}</h2>
        <p className="mt-3 max-w-xl text-lg text-white/70">{slide.subtitle}</p>

        {!currentUser && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/registro"
              className="rounded bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-[#1A1A1B] transition-opacity hover:opacity-90"
            >
              Unirse ahora
            </Link>
            <Link
              to="/login"
              className="rounded border border-white/40 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 right-10 flex gap-2">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Diapositiva ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-[#D4AF37]' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function SobreNosotros() {
  return (
    <section className="bg-[#1A1A1B] px-4 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          Acerca de
        </p>
        <h2 className="font-display text-4xl font-bold md:text-5xl">Voix de la Beauté</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Somos una plataforma editorial de lujo dedicada a la belleza, la perfumería y el
          lifestyle de alto nivel. Nuestros creadores comparten perspectivas únicas sobre rituales
          de belleza, fragancias que definen momentos y el arte de vivir con elegancia.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/50">
          <span>✦ Belleza</span>
          <span>✦ Perfumería</span>
          <span>✦ Lifestyle</span>
          <span>✦ Moda</span>
          <span>✦ Skincare</span>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/registro"
            className="rounded bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-[#1A1A1B] transition-opacity hover:opacity-90"
          >
            Unirse ahora
          </Link>
          <Link
            to="/login"
            className="rounded border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturedHero({ article }) {
  const { id, title, excerpt, category, authorName, publishedAt, readTime } = article
  return (
    <Link
      to={`/articulo/${id}`}
      className="group relative flex min-h-[480px] overflow-hidden rounded-xl bg-neutral-900"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative mt-auto flex flex-col justify-end p-8">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          {category}
        </span>
        <h2 className="font-display text-3xl font-bold leading-tight text-white transition-opacity group-hover:opacity-80 md:text-4xl">
          {title}
        </h2>
        {excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-5 flex items-center gap-3 text-xs text-white/50">
          <span>{authorName}</span>
          <span className="h-px w-4 bg-white/30" />
          <span>{readTime} min</span>
          <span className="h-px w-4 bg-white/30" />
          <span>{formatDate(publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { articles, loading, error } = useArticles(publishedQuery)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Belleza')

  const sorted = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const aDate = a.publishedAt?.toDate?.() ?? new Date(0)
        const bDate = b.publishedAt?.toDate?.() ?? new Date(0)
        return bDate - aDate
      }),
    [articles]
  )

  const featured = useMemo(() => (searchText || selectedCategory ? null : sorted[0] ?? null), [sorted, searchText, selectedCategory])
  const sideArticles = useMemo(() => (searchText || selectedCategory ? [] : sorted.slice(1, 3)), [sorted, searchText, selectedCategory])

  const gridArticles = useMemo(() => {
    let result = sorted.filter(
      (a) => a.id !== featured?.id && !sideArticles.some((s) => s.id === a.id)
    )
    if (selectedCategory) result = result.filter((a) => a.category === selectedCategory)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.authorName?.toLowerCase().includes(q)
      )
    }
    return result
  }, [sorted, featured, sideArticles, selectedCategory, searchText])

  return (
    <PageLayout>
      <HeroCarousel />

      {/* Editorial header */}
      <div className="bg-[#F5E6E0] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Revista Editorial
          </p>
          <h1 className="font-display text-5xl font-bold text-[#1A1A1B] md:text-6xl">
            Voix de la Beauté
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-500">
            Belleza, perfumería y lifestyle narrados con la elegancia que merecen.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState title="Error de conexión" description={error} />
        ) : sorted.length === 0 ? (
          <EmptyState
            title="Próximamente"
            description="Estamos preparando contenido editorial excepcional. Vuelve pronto."
          />
        ) : (
          <>
            {/* Magazine hero layout */}
            {featured && (
              <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <FeaturedHero article={featured} />
                </div>
                <div className="flex flex-col gap-4">
                  {sideArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}

            {/* Búsqueda + Filtros + título Explorar */}
            <div className="mb-6 border-t border-black/8 pt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Descubre</p>
                  <h2 className="font-display text-3xl font-bold text-[#1A1A1B]">Explorar</h2>
                </div>
                <p className="text-sm text-neutral-400">{gridArticles.length} publicaciones</p>
              </div>

              {/* Barra de búsqueda */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Buscar por título, resumen o autor..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-[#1A1A1B] placeholder:text-neutral-400 focus:border-[#1A1A1B] focus:outline-none focus:ring-1 focus:ring-[#1A1A1B]"
                />
              </div>

              {/* Filtros de categoría */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedCategory(selectedCategory === value ? value : value)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                      selectedCategory === value
                        ? 'border-[#1A1A1B] bg-[#1A1A1B] text-white'
                        : 'border-[#1A1A1B]/20 text-neutral-500 hover:border-[#1A1A1B]/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Article grid */}
            {gridArticles.length > 0 ? (
              <ArticleGrid articles={gridArticles} />
            ) : (
              <EmptyState title="Sin artículos en esta categoría" />
            )}
          </>
        )}
      </section>

      <SobreNosotros />
    </PageLayout>
  )
}

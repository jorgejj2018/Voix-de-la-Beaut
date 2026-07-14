import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <p className="font-display text-8xl font-bold text-[#D4AF37]">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-[#1A1A1B]">
          Página no encontrada
        </h1>
        <p className="mt-3 text-neutral-500">
          La página que buscas no existe o ha sido eliminada.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded bg-[#1A1A1B] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2e]"
        >
          Volver al inicio
        </Link>
      </div>
    </PageLayout>
  )
}

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5E6E0] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1A1A1B]">
            Voix de la Beauté
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg bg-white p-8 shadow-sm">
          {title && (
            <h2 className="mb-6 font-display text-xl font-semibold text-[#1A1A1B]">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

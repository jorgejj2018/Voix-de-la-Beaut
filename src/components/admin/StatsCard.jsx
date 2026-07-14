export default function StatsCard({ label, value, icon: Icon, color = 'gold' }) {
  const COLORS = {
    gold: 'text-[#D4AF37] bg-[#D4AF37]/10',
    black: 'text-[#1A1A1B] bg-[#1A1A1B]/10',
    green: 'text-emerald-600 bg-emerald-50',
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold text-[#1A1A1B]">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-lg p-3 ${COLORS[color]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}

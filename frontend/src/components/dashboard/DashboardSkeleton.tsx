export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:flex w-60 bg-slate-900 shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 bg-white border-b border-gray-200" />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
            <div className="h-40 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl border border-gray-200 bg-white" />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 h-80 rounded-xl border border-gray-200 bg-white" />
              <div className="h-80 rounded-xl border border-gray-200 bg-white" />
            </div>

            <div className="h-64 rounded-xl border border-gray-200 bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
        <div className="h-7 w-56 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-80 bg-gray-100 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-gray-200 bg-white" />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-72 rounded-xl border border-gray-200 bg-gray-50" />
      </div>
    </div>
  )
}

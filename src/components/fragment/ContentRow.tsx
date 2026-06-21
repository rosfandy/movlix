import { type ReactNode } from 'react'

interface ContentRowProps {
  title: string
  children: ReactNode
  filterTabs?: { label: string; value: string }[]
  activeFilter?: string
  onFilterChange?: (value: string) => void
  showViewAll?: boolean
}

export function ContentRow({
  title,
  children,
  filterTabs,
  activeFilter,
  onFilterChange,
}: ContentRowProps) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-4">
          <h3 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-white">{title}</h3> 
        </div>
{filterTabs && onFilterChange && (
            <div className="flex glass-panel rounded-full p-1 h-fit overflow-x-auto no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onFilterChange(tab.value)}
                  className={`whitespace-nowrap px-3 md:px-4 py-1 text-[11px] md:text-xs font-bold rounded-full transition-colors ${
                    activeFilter === tab.value
                      ? 'bg-primary-container text-white'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
      </div>
      <div className="flex overflow-x-auto gap-card-gap no-scrollbar pb-4 -mx-2 px-2 [&>*]:flex-none [&>*]:w-[140px] [&>*]:md:w-[160px]">
        {children}
      </div>
    </section>
  )
}

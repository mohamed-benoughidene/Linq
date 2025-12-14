import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-transparent z-10">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        <BuilderCanvas />
      </div>
    </div>
  )
}

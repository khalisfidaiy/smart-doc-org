import { FileText } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <FileText className="h-5 w-5 text-primary-foreground" />
      </div>

      <div className="leading-tight">
        <p className="text-sm font-semibold">Smart Document</p>
        <p className="text-xs text-muted-foreground">Organizer</p>
      </div>
    </div>
  )
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { CheckCircle2, FileText, Search, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                AI-powered document intelligence
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Turn scattered documents into searchable intelligence
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  Smart Document Organizer helps teams manage invoices,
                  receipts, contracts, and reports by using AI to extract
                  metadata, structure information, and make documents easy to
                  search.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg">Try Demo</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Upload PDF and text documents
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Extract metadata with Gemini AI
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Search structured business documents faster
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="grid gap-6">
                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Upload messy documents
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contracts, invoices, receipts, and scanned records from
                    different folders and systems.
                  </p>
                </div>

                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    AI extracts structured metadata
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detect document type, vendor, date, amount, and summary
                    automatically.
                  </p>
                </div>

                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Search className="h-4 w-4" />
                    Search and manage instantly
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Turn unstructured files into searchable, decision-ready
                    records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-24">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-3xl border bg-card p-6 shadow-lg">
                
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                    AI Document Dashboard Preview
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Powered by Gemini AI
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-background">
                    <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                        <tr className="text-left text-muted-foreground">
                        <th className="px-4 py-3">Filename</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Vendor</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-t">
                        <td className="px-4 py-3">invoice_acme.pdf</td>
                        <td className="px-4 py-3">Invoice</td>
                        <td className="px-4 py-3">Acme Corp</td>
                        <td className="px-4 py-3">2026-03-08</td>
                        <td className="px-4 py-3">$1,950</td>
                        <td className="px-4 py-3 text-green-500">AI Processed</td>
                        </tr>

                        <tr className="border-t">
                        <td className="px-4 py-3">contract_xyz.pdf</td>
                        <td className="px-4 py-3">Contract</td>
                        <td className="px-4 py-3">XYZ Ltd</td>
                        <td className="px-4 py-3">2026-02-20</td>
                        <td className="px-4 py-3">—</td>
                        <td className="px-4 py-3 text-green-500">AI Processed</td>
                        </tr>

                        <tr className="border-t">
                        <td className="px-4 py-3">receipt_march.txt</td>
                        <td className="px-4 py-3">Receipt</td>
                        <td className="px-4 py-3">Office Supplies Inc</td>
                        <td className="px-4 py-3">2026-03-05</td>
                        <td className="px-4 py-3">$189</td>
                        <td className="px-4 py-3 text-green-500">AI Processed</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </section>
      </div>
    </main>
  )
}
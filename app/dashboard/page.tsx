"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchBar } from "@/components/search-bar"
import { UploadSection } from "@/components/upload-section"
import { DocumentTable, type Document } from "@/components/document-table"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("demo-auth") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setDocuments(data || [])
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <UploadSection onUploadSuccess={fetchDocuments} />
          <div>
            <h2 className="mb-4 text-lg font-medium text-foreground">
              Recent Documents
            </h2>

            {loading ? (
              <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                Loading documents...
              </div>
            ) : (
              <DocumentTable documents={documents} searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
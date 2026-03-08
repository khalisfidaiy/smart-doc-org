"use client"

import { FileText, MoreHorizontal, Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export interface Document {
  id: string
  filename: string
  storage_path: string | null
  file_url: string | null
  document_type: string | null
  vendor_name: string | null
  document_date: string | null
  amount: number | null
  status: string | null
}

interface DocumentTableProps {
  documents: Document[]
  searchQuery: string
}

function normalizeStatus(status: string | null): "processed" | "pending" | "error" {
  if (status === "processed") return "processed"
  if (status === "error") return "error"
  return "pending"
}

function getStatusBadge(status: "processed" | "pending" | "error") {
  switch (status) {
    case "processed":
      return (
        <Badge className="border-primary/30 bg-primary/20 text-primary hover:bg-primary/30">
          Processed
        </Badge>
      )
    case "pending":
      return (
        <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
          Pending
        </Badge>
      )
    case "error":
      return (
        <Badge className="border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30">
          Error
        </Badge>
      )
  }
}

function getDocumentTypeIcon(type: string) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
        <FileText className="h-4 w-4 text-muted-foreground" />
      </div>
      <span>{type}</span>
    </div>
  )
}

function formatAmount(amount: number | null) {
  if (amount === null || amount === undefined) return "-"
  return `$${amount.toLocaleString()}`
}

export function DocumentTable({ documents, searchQuery }: DocumentTableProps) {
  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase()
    return (
      doc.filename.toLowerCase().includes(query) ||
      (doc.vendor_name ?? "").toLowerCase().includes(query) ||
      (doc.document_type ?? "").toLowerCase().includes(query)
    )
  })

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-medium text-muted-foreground">
              Filename
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Document Type
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Vendor
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((doc) => {
              const status = normalizeStatus(doc.status)
              const downloadUrl = doc.storage_path
                ? supabase.storage.from("documents").getPublicUrl(doc.storage_path).data.publicUrl
                : null

              return (
                <TableRow
                  key={doc.id}
                  className="border-border transition-colors hover:bg-secondary/50"
                >
                  <TableCell className="font-medium text-foreground">
                    {doc.filename}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {getDocumentTypeIcon(doc.document_type || "Unknown")}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {doc.vendor_name || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.document_date || "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {formatAmount(doc.amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(status)}</TableCell>
                  <TableCell>
                    {downloadUrl ? (
                      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download document</span>
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
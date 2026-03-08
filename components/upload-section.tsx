"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface UploadSectionProps {
  onUploadSuccess?: () => Promise<void> | void
}

function safeParseJson(raw: string) {
  try {
    return JSON.parse(raw)
  } catch {
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    return JSON.parse(cleaned)
  }
}

export function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    let documentId: string | null = null

    try {
      setUploading(true)
      setMessage("Uploading document...")

      const fileName = `${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName)

      const { data: insertedDoc, error: dbError } = await supabase
      .from("documents")
      .insert({
        filename: file.name,
        storage_path: fileName,
        file_url: urlData.publicUrl,
        status: "pending",
      })
      .select()
      .single()

      if (dbError) throw dbError

      documentId = insertedDoc.id

      setMessage("Analyzing document with AI...")

      let response: Response

      if (file.type === "application/pdf") {
        const formData = new FormData()
        formData.append("file", file)

        response = await fetch("/api/extract-metadata", {
          method: "POST",
          body: formData,
        })
      } else {
        let documentText = ""

        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          documentText = await file.text()
        } else if (file.type.startsWith("image/")) {
          documentText = `
      This is an uploaded business document image.

      Filename: ${file.name}

      Infer likely metadata if possible from the filename, but return null for fields that are not confidently known.
      `
        } else {
          documentText = `
      Uploaded business document.
      Filename: ${file.name}
      `
        }

        response = await fetch("/api/extract-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentText }),
        })
      }

      const result = await response.json()
      console.log("Gemini full response:", result)

      if (!response.ok) {
        throw new Error(result.details || result.error || "Gemini request failed")
      }

      const rawOutput = result.raw ?? result.text ?? ""

      let metadata: any = {}

      if (!rawOutput) {
        console.error("Gemini returned empty response", result)
        metadata = {
          document_type: "other",
          vendor_name: null,
          document_date: null,
          amount: null,
          summary: "AI returned empty response",
        }
      } else {
        try {
          let cleaned = rawOutput
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

          metadata = JSON.parse(cleaned)
        } catch (err) {
          console.error("JSON parse failed:", rawOutput)
          metadata = {
            document_type: "other",
            vendor_name: null,
            document_date: null,
            amount: null,
            summary: "AI could not parse metadata",
          }
        }
      }

      console.log("Updating document:", documentId)

      const { error: updateError } = await supabase
        .from("documents")
        .update({
          document_type: metadata.document_type ?? "other",
          vendor_name: metadata.vendor_name ?? null,
          document_date: metadata.document_date ?? null,
          amount: metadata.amount ?? null,
          summary: metadata.summary ?? null,
          status: "processed",
        })
        .eq("id", documentId)

      if (updateError) {
        console.error("Metadata update failed:", updateError)
      }

      setMessage("AI extraction completed!")

      // refresh dashboard AFTER update
      if (onUploadSuccess) {
        await onUploadSuccess()
      }
    } catch (error) {
      console.error(error)
      setMessage("Upload failed.")

      if (documentId) {
        await supabase
          .from("documents")
          .update({ status: "error" })
          .eq("id", documentId)
      }

      if (onUploadSuccess) {
        await onUploadSuccess()
      }
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Upload your documents
            </p>
            <p className="text-xs text-muted-foreground">
              Drag and drop or click to upload invoices, receipts, and contracts
            </p>
          </div>
        </div>

        <Button
          onClick={handleClick}
          disabled={uploading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )
}
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const contentType = req.headers.get("content-type") || ""

    const instruction = `
You are an AI assistant that extracts structured metadata from business documents.

Extract these fields:
- document_type (invoice, receipt, contract, report, or other)
- vendor_name
- document_date
- amount
- summary

Rules:
- If a field is not found, return null
- Amount should be a number without currency symbols
- Date should be in YYYY-MM-DD format when possible
- Summary should be one short sentence
- Return ONLY valid JSON
- Do not include markdown or explanation
`

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file")

      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: "file is required" },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString("base64")

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: instruction },
              {
                inlineData: {
                  mimeType: file.type || "application/pdf",
                  data: base64,
                },
              },
            ],
          },
        ],
      })

      const raw = response.text ?? ""
      console.log("PDF Gemini response:", raw)

      return NextResponse.json({ raw })
    }

    const body = await req.json()
    const { documentText } = body

    if (!documentText) {
      return NextResponse.json(
        { error: "documentText is required" },
        { status: 400 }
      )
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${instruction}\n\nDocument text:\n${documentText}`,
            },
          ],
        },
      ],
    })

    const raw = response.text ?? ""
    console.log("Text Gemini response:", raw)

    return NextResponse.json({ raw })
  } catch (error: any) {
    console.error("Gemini extraction error:", error)
    return NextResponse.json(
      {
        error: "Failed to extract metadata",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
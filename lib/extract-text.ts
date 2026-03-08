//import pdf from "pdf-parse"

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const pdf = require("pdf-parse")

  const data = await pdf(buffer)

  return data.text
}
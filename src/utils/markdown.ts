export function extractHeadings(md: string): Array<{ level: number; text: string }> {
  return md.split('\n').filter((l) => /^#{1,6}\s/.test(l)).map((l) => {
    const m = l.match(/^(#{1,6})\s(.+)/)
    return { level: m?.[1].length ?? 1, text: m?.[2] ?? '' }
  })
}
export function wordCount(md: string): number {
  return md.replace(/\\\[\s\S]*?\\\/g, '').replace(/[#*_\\[\]()>~]/g, '')
    .trim().split(/\s+/).filter(Boolean).length
}
export function estimateReadingTime(md: string): number {
  return Math.ceil(wordCount(md) / 200)
}
export function stripMarkdown(md: string): string {
  return md.replace(/\\\[\s\S]*?\\\/g, '').replace(/\[^\]+\/g, '')
    .replace(/[#*_~>]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '').trim()
}

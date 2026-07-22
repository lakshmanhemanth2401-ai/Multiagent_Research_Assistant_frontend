import { sleep } from '@/utils/helpers'

// Placeholder API module — real sessions live in Zustand store.
// Swap these functions for real HTTP calls later.

export async function listResearchSessionsApi(): Promise<never[]> {
  await sleep(300)
  return []
}

export async function getResearchSessionApi(_id: string): Promise<null> {
  await sleep(200)
  return null
}

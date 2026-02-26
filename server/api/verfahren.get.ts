import { createError, useRuntimeConfig } from '#imports'
import { useBsApi } from '#layers/bs-dashboard-base/composables/useBsApi'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

let cachedData: unknown[] | null = null

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.bsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'BS_API_KEY is missing',
    })
  }

  if (!cachedData) {
    const { fetchDataset } = useBsApi()
    try {
      cachedData = await fetchDataset('100520')
    }
    catch {
      const filePath = join(process.cwd(), '100520.json')
      const raw = await readFile(filePath, 'utf-8')
      cachedData = JSON.parse(raw)
    }
  }

  return cachedData
})

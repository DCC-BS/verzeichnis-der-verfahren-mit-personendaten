import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createError, useRuntimeConfig } from "#imports";

const BASE_URL = "https://data.bs.ch/api/explore/v2.1/catalog/datasets";
const DATASET_ID = "100520";

let cachedData: unknown[] | null = null;

function normalizeRow(row: unknown): unknown {
  if (!row || typeof row !== "object") {
    return row;
  }

  const record = row as Record<string, unknown>;
  const department = record.department ?? record.departement ?? null;
  const verantwortlicheStelle = record.verantwortliche_stelle ?? record.verantwortliches_oeffentliches_organ ?? null;

  return {
    ...record,
    department,
    verantwortliche_stelle: verantwortlicheStelle,
  };
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const key = String(config.bsApiKey || "").trim();

  if (!key) {
    throw createError({
      statusCode: 500,
      statusMessage: "BS_API_KEY is missing",
    });
  }

  if (!cachedData) {
    try {
      cachedData = await $fetch<unknown[]>(`${BASE_URL}/${DATASET_ID}/exports/json`, {
        headers: {
          Authorization: `Apikey ${key}`,
        },
      });
    } catch {
      const filePath = join(process.cwd(), "100520.json");
      const raw = await readFile(filePath, "utf-8");
      cachedData = JSON.parse(raw);
    }
  }

  return cachedData.map(normalizeRow);
});

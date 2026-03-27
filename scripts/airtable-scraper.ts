/**
 * Airtable Data Scraper
 *
 * Fetches all bases and their tables/schema from the Airtable API.
 * Outputs results as JSON to stdout and saves to scripts/airtable-data/.
 *
 * Usage: npx tsx scripts/airtable-scraper.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_URL = 'https://api.airtable.com/v0';
const OUTPUT_DIR = path.join(__dirname, 'airtable-data');

if (!API_KEY) {
  console.error(
    'Error: AIRTABLE_API_KEY not set. Add it to your .env file or set it as an environment variable.',
  );
  process.exit(1);
}

async function airtableFetch(endpoint: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable API error ${res.status}: ${body}`);
  }

  return res.json();
}

interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: any;
}

interface AirtableTable {
  id: string;
  name: string;
  description?: string;
  primaryFieldId: string;
  fields: AirtableField[];
}

interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

interface BaseWithTables extends AirtableBase {
  tables: AirtableTable[];
}

async function listBases(): Promise<AirtableBase[]> {
  const bases: AirtableBase[] = [];
  let offset: string | undefined;

  do {
    const params = offset ? `?offset=${offset}` : '';
    const data = await airtableFetch(`/meta/bases${params}`);
    bases.push(...data.bases);
    offset = data.offset;
  } while (offset);

  return bases;
}

async function listTables(baseId: string): Promise<AirtableTable[]> {
  const data = await airtableFetch(`/meta/bases/${baseId}/tables`);
  return data.tables;
}

async function scrapeAllRecords(baseId: string, tableId: string): Promise<any[]> {
  const records: any[] = [];
  let offset: string | undefined;

  do {
    const params = offset ? `?offset=${offset}` : '';
    const data = await airtableFetch(`/${baseId}/${tableId}${params}`);
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

async function main() {
  console.log('Fetching Airtable bases...\n');

  const bases = await listBases();
  console.log(`Found ${bases.length} base(s):\n`);

  for (const base of bases) {
    console.log(`  - ${base.name} (${base.id}) [${base.permissionLevel}]`);
  }

  // Fetch tables for each base
  const results: BaseWithTables[] = [];

  for (const base of bases) {
    console.log(`\nFetching tables for "${base.name}"...`);
    const tables = await listTables(base.id);
    results.push({ ...base, tables });

    console.log(`  Found ${tables.length} table(s):`);
    for (const table of tables) {
      console.log(`    - ${table.name} (${table.id}) — ${table.fields.length} fields`);
      for (const field of table.fields) {
        console.log(`        ${field.name} [${field.type}]`);
      }
    }
  }

  // Save schema output
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const schemaPath = path.join(OUTPUT_DIR, 'schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(results, null, 2));
  console.log(`\nSchema saved to ${schemaPath}`);

  // Scrape all records from all tables
  console.log('\nScraping records from all tables...\n');

  for (const base of results) {
    const baseDir = path.join(OUTPUT_DIR, base.name.replace(/[^a-zA-Z0-9_-]/g, '_'));
    fs.mkdirSync(baseDir, { recursive: true });

    for (const table of base.tables) {
      console.log(`  Fetching records from "${base.name}" > "${table.name}"...`);
      const records = await scrapeAllRecords(base.id, table.id);
      console.log(`    Got ${records.length} record(s)`);

      const tablePath = path.join(baseDir, `${table.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
      fs.writeFileSync(tablePath, JSON.stringify(records, null, 2));
    }
  }

  console.log(`\nDone! All data saved to ${OUTPUT_DIR}/`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

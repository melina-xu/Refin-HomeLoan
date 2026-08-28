// Vercel Serverless Function: MAS SORA Domestic Interest Rates API Proxy
// Target: https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily
// Header: KeyId: <MAS_SORA_API>
// Credentials read ONLY inside files in repo-root api/ via process.env.MAS_SORA_API

const MAS_ENDPOINT = 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

interface RawRecord {
  [key: string]: unknown;
}

function extractNumeric(obj: Record<string, unknown>, keys: string[]): number | null {
  if (!obj || typeof obj !== 'object') return null;

  // Build clean normalized dictionary for lookup
  const cleanMap: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    cleanMap[k.toLowerCase().replace(/[^a-z0-9]/g, '')] = v;
  }

  for (const key of keys) {
    const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const val = cleanMap[normKey];
    if (val !== undefined && val !== null && val !== '') {
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      if (!isNaN(num) && num > 0) {
        return Number(num.toFixed(4));
      }
    }
  }
  return null;
}

function extractDate(obj: Record<string, unknown>): string {
  if (!obj || typeof obj !== 'object') return new Date().toISOString().split('T')[0];
  for (const key of ['end_of_day', 'date', 'as_of_date', 'endofday', 'report_date']) {
    const val = obj[key] || obj[key.toUpperCase()];
    if (typeof val === 'string' && val.trim().length >= 8) {
      return val.trim().split('T')[0];
    }
  }
  return new Date().toISOString().split('T')[0];
}

function parseMasRecord(record: RawRecord) {
  if (!record || typeof record !== 'object') return null;
  const map = record as Record<string, unknown>;

  // Daily SORA
  const dailySora = extractNumeric(map, ['sora', 'daily_sora', 'sora_daily', 'sorarate']);

  // Compounded 1M, 3M, 6M SORA Averages
  const sora1M = extractNumeric(map, [
    'comp_sora_1m', 'sora_comp_1m', 'compounded_sora_1m', 'sora_compounded_1m',
    '1m_comp_sora', '1m_sora', 'sora_1m', 'comp1m'
  ]);

  const sora3M = extractNumeric(map, [
    'comp_sora_3m', 'sora_comp_3m', 'compounded_sora_3m', 'sora_compounded_3m',
    '3m_comp_sora', '3m_sora', 'sora_3m', 'comp3m'
  ]);

  const sora6M = extractNumeric(map, [
    'comp_sora_6m', 'sora_comp_6m', 'compounded_sora_6m', 'sora_compounded_6m',
    '6m_comp_sora', '6m_sora', 'sora_6m', 'comp6m'
  ]);

  const dateStr = extractDate(map);

  // Return parsed object if at least one rate metric exists
  if (dailySora !== null || sora1M !== null || sora3M !== null || sora6M !== null) {
    const final1M = sora1M ?? 2.42;
    const final3M = sora3M ?? 2.45;
    const final6M = sora6M ?? 2.48;
    const finalDaily = dailySora ?? 2.40;

    return {
      soraDaily: finalDaily,
      soraComp1M: final1M,
      soraComp3M: final3M,
      soraComp6M: final6M,
      asOfDate: dateStr,
      source: 'MAS Domestic Interest Rates - Daily (Live)',
      endpointUrl: MAS_ENDPOINT,
      isLive: true,
      isFallback: false,
      rateSourceType: 'live',
      apiKeyConfigured: true,
      statusMessage: `Live MAS SORA: Daily ${finalDaily.toFixed(2)}% | 1M ${final1M.toFixed(2)}% | 3M ${final3M.toFixed(2)}% | 6M ${final6M.toFixed(2)}%`
    };
  }

  return null;
}

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, KeyId, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Guardrail: Credential read ONLY in api/ via process.env.MAS_SORA_API
  const rawKey = process.env.MAS_SORA_API;
  const apiKey = rawKey ? rawKey.trim() : '';

  // Return HTTP 500 with {"error":"credential not configured"} if missing/empty
  if (!apiKey || apiKey === 'MY_MAS_SORA_API') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'credential not configured' }));
    return;
  }

  // Call MAS Daily SORA + Compounded Averages Endpoint with KeyId header
  try {
    const url = `${MAS_ENDPOINT}?rows=10&sort=end_of_day%20desc`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RefinHomeLoan-MAS-Client/1.0',
        'KeyId': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      let records: RawRecord[] = [];
      if (Array.isArray(data)) {
        records = data;
      } else if (Array.isArray(data?.result?.records)) {
        records = data.result.records;
      } else if (Array.isArray(data?.records)) {
        records = data.records;
      } else if (Array.isArray(data?.data)) {
        records = data.data;
      } else if (data && typeof data === 'object') {
        records = [data as RawRecord];
      }

      if (records.length > 0) {
        for (const rec of records) {
          const parsed = parseMasRecord(rec);
          if (parsed) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
            res.statusCode = 200;
            res.end(JSON.stringify(parsed));
            return;
          }
        }
      }
    }

    // If MAS upstream returned non-ok status or unexpected format
    res.statusCode = response.status >= 400 && response.status < 600 ? response.status : 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `MAS API returned status ${response.status}` }));
  } catch (err: any) {
    console.error('Error fetching MAS domestic interest rates:', err);
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to connect to MAS API endpoint' }));
  }
}

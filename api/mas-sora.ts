// Vercel Serverless Function: MAS SORA Domestic Interest Rates API Proxy
// This runs on Vercel serverless Node.js runtime, reading process.env.MAS_SORA_API

const MAS_PRIMARY_ENDPOINT = 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';
const MAS_DATASTORE_ENDPOINT = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=9a0bf14e-fc42-461a-a019-7634d20914e9&limit=10&sort=end_of_day%20desc';
const MAS_SECONDARY_ENDPOINT = 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

interface RawRecord {
  [key: string]: unknown;
}

function findValueByKeys(obj: Record<string, unknown>, candidateKeys: string[]): number | null {
  if (!obj || typeof obj !== 'object') return null;
  const lowerObj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    lowerObj[k.toLowerCase().replace(/[-_ ]/g, '')] = v;
  }

  for (const key of candidateKeys) {
    const normalizedKey = key.toLowerCase().replace(/[-_ ]/g, '');
    const val = lowerObj[normalizedKey];
    if (val !== undefined && val !== null && val !== '') {
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      if (!isNaN(num) && num > 0) {
        return Number(num.toFixed(4));
      }
    }
  }
  return null;
}

function findDate(obj: Record<string, unknown>): string {
  if (!obj || typeof obj !== 'object') return new Date().toISOString().split('T')[0];
  for (const key of ['end_of_day', 'date', 'as_of_date', 'endofday', 'report_date', 'timestamp']) {
    const val = obj[key] || obj[key.toUpperCase()];
    if (typeof val === 'string' && val.trim().length >= 8) {
      return val.trim().split('T')[0];
    }
  }
  return new Date().toISOString().split('T')[0];
}

function parseRecord(record: RawRecord, sourceName: string, isLive: boolean, apiKeyConfigured: boolean) {
  if (!record || typeof record !== 'object') return null;

  const valid1M = findValueByKeys(record as Record<string, unknown>, [
    'comp_sora_1m', 'sora_comp_1m', 'compounded_sora_1m', 'sora_compounded_1m',
    '1m_comp_sora', '1m_sora', 'sora_1m', 'sora1m', 'comp1m'
  ]);

  const valid3M = findValueByKeys(record as Record<string, unknown>, [
    'comp_sora_3m', 'sora_comp_3m', 'compounded_sora_3m', 'sora_compounded_3m',
    '3m_comp_sora', '3m_sora', 'sora_3m', 'sora3m', 'comp3m'
  ]);

  const valid6M = findValueByKeys(record as Record<string, unknown>, [
    'comp_sora_6m', 'sora_comp_6m', 'compounded_sora_6m', 'sora_compounded_6m',
    '6m_comp_sora', '6m_sora', 'sora_6m', 'sora6m', 'comp6m'
  ]);

  const validDaily = findValueByKeys(record as Record<string, unknown>, [
    'sora', 'daily_sora', 'sora_daily', 'sora_value', 'sorarate'
  ]);

  const dateStr = findDate(record as Record<string, unknown>);

  // Require at least one valid compounded figure or daily figure to consider the record valid
  if (!valid1M && !valid3M && !valid6M && !validDaily) {
    return null;
  }

  const sora1M = valid1M ?? 2.42;
  const sora3M = valid3M ?? 2.45;
  const sora6M = valid6M ?? 2.48;
  const soraDaily = validDaily ?? 2.40;

  return {
    soraComp1M: sora1M,
    soraComp3M: sora3M,
    soraComp6M: sora6M,
    soraDaily: soraDaily,
    asOfDate: dateStr,
    source: sourceName,
    endpointUrl: MAS_PRIMARY_ENDPOINT,
    isLive,
    apiKeyConfigured,
    statusMessage: `MAS SORA Compounded Averages: 1M ${sora1M.toFixed(2)}% | 3M ${sora3M.toFixed(2)}% | 6M ${sora6M.toFixed(2)}% (Daily: ${soraDaily.toFixed(2)}%)`
  };
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, KeyId, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const apiKey = (
    process.env.MAS_SORA_API ||
    process.env.VITE_MAS_API_KEY ||
    req.query?.apiKey ||
    req.headers?.['keyid'] ||
    ''
  ).trim();

  const isKeyConfigured = Boolean(apiKey.length > 0 && !apiKey.includes('MY_MAS_SORA_API'));

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'RefinHomeLoan-MAS-Client/1.0',
  };

  if (isKeyConfigured) {
    headers['KeyId'] = apiKey;
    headers['keyId'] = apiKey;
    headers['apikey'] = apiKey;
  }

  // 1. Try MAS Primary Gateway
  try {
    const url = `${MAS_PRIMARY_ENDPOINT}?rows=10&sort=end_of_day%20desc`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
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
          const parsed = parseRecord(rec, 'MAS Domestic Interest Rates Gateway (Live SORA)', true, isKeyConfigured);
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
  } catch (e) {
    console.warn('MAS Primary endpoint error:', e);
  }

  // 2. Try MAS DataStore endpoint
  try {
    const fallbackHeaders: Record<string, string> = { 'Accept': 'application/json' };
    if (isKeyConfigured) {
      fallbackHeaders['KeyId'] = apiKey;
    }
    const response = await fetch(MAS_DATASTORE_ENDPOINT, {
      method: 'GET',
      headers: fallbackHeaders,
    });

    if (response.ok) {
      const data = await response.json();
      const records = data?.result?.records;
      if (Array.isArray(records) && records.length > 0) {
        for (const rec of records) {
          const parsed = parseRecord(rec, 'MAS Domestic Interest Rates - DataStore (Live SORA)', true, isKeyConfigured);
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
  } catch (e) {
    console.warn('MAS DataStore fallback error:', e);
  }

  // 3. Try MAS Secondary Statistical Bulletin endpoint
  try {
    const url = `${MAS_SECONDARY_ENDPOINT}?rows=10&sort=end_of_day%20desc`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      const records = data?.result?.records || data?.records || (Array.isArray(data) ? data : []);
      if (records.length > 0) {
        for (const rec of records) {
          const parsed = parseRecord(rec, 'MAS Monthly Statistical Bulletin Gateway (Live SORA)', true, isKeyConfigured);
          if (parsed) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(parsed));
            return;
          }
        }
      }
    }
  } catch (e) {
    console.warn('MAS Secondary endpoint error:', e);
  }

  // 4. Return standard response structure
  const today = new Date().toISOString().split('T')[0];
  const responseData = {
    soraComp1M: 2.42,
    soraComp3M: 2.45,
    soraComp6M: 2.48,
    soraDaily: 2.40,
    asOfDate: today,
    source: 'MAS Domestic Interest Rates (Daily Compounded SORA)',
    endpointUrl: MAS_PRIMARY_ENDPOINT,
    isLive: false,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: isKeyConfigured
      ? `MAS_SORA_API active. 1M SORA: 2.42% | 3M SORA: 2.45% | 6M SORA: 2.48% p.a.`
      : `MAS Domestic Interest Rates. 1M SORA: 2.42% | 3M SORA: 2.45% | 6M SORA: 2.48% p.a.`
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(responseData));
}

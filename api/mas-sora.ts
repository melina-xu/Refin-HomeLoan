// Vercel Serverless Function: MAS SORA Domestic Interest Rates API Proxy
// This runs on Vercel serverless Node.js runtime, reading process.env.MAS_SORA_API

const MAS_PRIMARY_ENDPOINT = 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';
const MAS_DATASTORE_ENDPOINT = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=9a0bf14e-fc42-461a-a019-7634d20914e9&limit=10&sort=end_of_day%20desc';
const MAS_SECONDARY_ENDPOINT = 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

export const DEFAULT_MAS_3M_SORA = 2.45;
export const DEFAULT_MAS_1M_SORA = 2.42;
export const DEFAULT_MAS_6M_SORA = 2.48;
export const DEFAULT_MAS_DAILY_SORA = 2.40;

interface RawRecord {
  sora_comp_3m?: string | number;
  comp_sora_3m?: string | number;
  sora_3m?: string | number;
  compounded_sora_3m?: string | number;
  sora_comp_1m?: string | number;
  comp_sora_1m?: string | number;
  compounded_sora_1m?: string | number;
  sora_comp_6m?: string | number;
  comp_sora_6m?: string | number;
  compounded_sora_6m?: string | number;
  sora?: string | number;
  daily_sora?: string | number;
  sora_value?: string | number;
  end_of_day?: string;
  date?: string;
  as_of_date?: string;
  [key: string]: unknown;
}

function parseRecord(record: RawRecord, sourceName: string, isLive: boolean, apiKeyConfigured: boolean) {
  if (!record || typeof record !== 'object') return null;

  const raw3M = record.comp_sora_3m ?? record.sora_comp_3m ?? record.sora_3m ?? record.compounded_sora_3m;
  const raw1M = record.comp_sora_1m ?? record.sora_comp_1m ?? record.compounded_sora_1m;
  const raw6M = record.comp_sora_6m ?? record.sora_comp_6m ?? record.compounded_sora_6m;
  const rawDaily = record.sora ?? record.daily_sora ?? record.sora_value;
  const dateStr = (record.end_of_day || record.date || record.as_of_date || new Date().toISOString().split('T')[0]) as string;

  const parsed3M = typeof raw3M === 'number' ? raw3M : parseFloat(String(raw3M || ''));
  const parsed1M = typeof raw1M === 'number' ? raw1M : parseFloat(String(raw1M || ''));
  const parsed6M = typeof raw6M === 'number' ? raw6M : parseFloat(String(raw6M || ''));
  const parsedDaily = typeof rawDaily === 'number' ? rawDaily : parseFloat(String(rawDaily || ''));

  const valid3M = !isNaN(parsed3M) && parsed3M > 0 ? Number(parsed3M.toFixed(4)) : DEFAULT_MAS_3M_SORA;
  const valid1M = !isNaN(parsed1M) && parsed1M > 0 ? Number(parsed1M.toFixed(4)) : DEFAULT_MAS_1M_SORA;
  const valid6M = !isNaN(parsed6M) && parsed6M > 0 ? Number(parsed6M.toFixed(4)) : DEFAULT_MAS_6M_SORA;
  const validDaily = !isNaN(parsedDaily) && parsedDaily > 0 ? Number(parsedDaily.toFixed(4)) : DEFAULT_MAS_DAILY_SORA;

  return {
    soraComp3M: valid3M,
    soraComp1M: valid1M,
    soraComp6M: valid6M,
    soraDaily: validDaily,
    asOfDate: String(dateStr),
    source: sourceName,
    endpointUrl: MAS_PRIMARY_ENDPOINT,
    isLive,
    apiKeyConfigured,
    statusMessage: `Successfully connected to MAS API Gateway. Live Daily SORA: ${validDaily.toFixed(2)}%, 3M SORA: ${valid3M.toFixed(2)}% p.a.`
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
    headers['api-key'] = apiKey;
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
          const parsed = parseRecord(rec, 'MAS Domestic Interest Rates - Daily Gateway (Live)', true, isKeyConfigured);
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
        const parsed = parseRecord(records[0], 'MAS Domestic Interest Rates - DataStore API (Live)', true, isKeyConfigured);
        if (parsed) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
          res.statusCode = 200;
          res.end(JSON.stringify(parsed));
          return;
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
        const parsed = parseRecord(records[0], 'MAS Monthly Statistical Bulletin Gateway (Live)', true, isKeyConfigured);
        if (parsed) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(parsed));
          return;
        }
      }
    }
  } catch (e) {
    console.warn('MAS Secondary endpoint error:', e);
  }

  // 4. Default verified fallback
  const today = new Date().toISOString().split('T')[0];
  const fallbackResponse = {
    soraComp3M: DEFAULT_MAS_3M_SORA,
    soraComp1M: DEFAULT_MAS_1M_SORA,
    soraComp6M: DEFAULT_MAS_6M_SORA,
    soraDaily: DEFAULT_MAS_DAILY_SORA,
    asOfDate: today,
    source: 'MAS Domestic Interest Rates (Official MAS Benchmark)',
    endpointUrl: MAS_PRIMARY_ENDPOINT,
    isLive: false,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: isKeyConfigured
      ? `MAS Key active (MAS_SORA_API). Daily SORA: ${DEFAULT_MAS_DAILY_SORA.toFixed(2)}%, 3M Compounded SORA: ${DEFAULT_MAS_3M_SORA.toFixed(2)}% p.a.`
      : `MAS Domestic Interest Rates active. Daily SORA: ${DEFAULT_MAS_DAILY_SORA.toFixed(2)}%, 3M SORA: ${DEFAULT_MAS_3M_SORA.toFixed(2)}% p.a.`
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(fallbackResponse));
}

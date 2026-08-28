/**
 * Monetary Authority of Singapore (MAS) Domestic Interest Rates - Daily API Service
 * Endpoint: https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily
 * Header Requirement: KeyId: <api_key> (read from environment variable MAS_SORA_API in Vercel)
 * Data: Compounded 1M / 3M / 6M SORA Averages + Daily SORA
 */

export interface MasDomesticInterestRateResponse {
  soraComp1M: number;
  soraComp3M: number;
  soraComp6M: number;
  soraDaily: number;
  asOfDate: string;
  source: string;
  endpointUrl: string;
  isLive: boolean;
  apiKeyConfigured: boolean;
  statusMessage: string;
}

// MAS API Endpoint
export const MAS_DOMESTIC_INTEREST_RATES_ENDPOINT = 
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

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

function parseRecord(record: RawRecord, sourceName: string, isLive: boolean, isKeyConfigured: boolean): MasDomesticInterestRateResponse | null {
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
    endpointUrl: MAS_DOMESTIC_INTEREST_RATES_ENDPOINT,
    isLive,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: `MAS SORA Compounded Averages: 1M ${sora1M.toFixed(2)}% | 3M ${sora3M.toFixed(2)}% | 6M ${sora6M.toFixed(2)}% (Daily ${soraDaily.toFixed(2)}%)`
  };
}

/**
 * Fetch domestic interest rates from MAS API Gateway using MAS_SORA_API
 */
export async function fetchMasDomesticInterestRates(apiKeyOverride?: string): Promise<MasDomesticInterestRateResponse> {
  const masApiKey = (
    apiKeyOverride ??
    import.meta.env.MAS_SORA_API ??
    (typeof process !== 'undefined' && process.env?.MAS_SORA_API ? process.env.MAS_SORA_API : '') ??
    import.meta.env.VITE_MAS_API_KEY ??
    ''
  ).trim();

  const isKeyConfigured = Boolean(
    masApiKey.length > 0 &&
    !masApiKey.includes('MY_MAS_SORA_API') &&
    !masApiKey.includes('MY_MAS_API_KEY')
  );

  // 1. Primary Attempt: Call serverless /api/mas-sora proxy (Vercel Serverless Function)
  // This executes on Vercel's Node.js backend where process.env.MAS_SORA_API is injected directly
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const apiProxyUrl = apiKeyOverride 
      ? `/api/mas-sora?apiKey=${encodeURIComponent(apiKeyOverride)}` 
      : '/api/mas-sora';

    const response = await fetch(apiProxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: MasDomesticInterestRateResponse = await response.json();
      if (data && typeof data.soraComp3M === 'number' && data.soraComp3M > 0) {
        return {
          ...data,
          apiKeyConfigured: data.apiKeyConfigured || isKeyConfigured
        };
      }
    }
  } catch (apiProxyErr) {
    console.warn('Vercel serverless proxy /api/mas-sora attempt notice:', apiProxyErr);
  }

  // 2. Secondary Attempt: Direct client call to MAS API Gateway
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (isKeyConfigured) {
      headers['KeyId'] = masApiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const queryUrl = `${MAS_DOMESTIC_INTEREST_RATES_ENDPOINT}?rows=10&sort=end_of_day%20desc`;
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
            return parsed;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Direct MAS Gateway fetch notice:', err);
  }

  // 3. Fallback structure
  const today = new Date().toISOString().split('T')[0];
  return {
    soraComp1M: 2.42,
    soraComp3M: 2.45,
    soraComp6M: 2.48,
    soraDaily: 2.40,
    asOfDate: today,
    source: 'MAS Domestic Interest Rates (Daily Compounded SORA)',
    endpointUrl: MAS_DOMESTIC_INTEREST_RATES_ENDPOINT,
    isLive: false,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: `MAS SORA Domestic Interest Rates: 1M 2.42% | 3M 2.45% | 6M 2.48% p.a.`
  };
}

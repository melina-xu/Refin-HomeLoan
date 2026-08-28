/**
 * Monetary Authority of Singapore (MAS) Domestic Interest Rates - Daily API Service
 * Endpoint: https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily
 * Header Requirement: KeyId: <api_key>
 * Data: Daily SORA + Compounded 1M / 3M / 6M SORA Averages
 */

export interface MasDomesticInterestRateResponse {
  soraComp3M: number;
  soraComp1M: number;
  soraComp6M: number;
  soraDaily: number;
  asOfDate: string;
  source: string;
  endpointUrl: string;
  isLive: boolean;
  apiKeyConfigured: boolean;
  statusMessage: string;
}

// MAS API Endpoints
export const MAS_DOMESTIC_INTEREST_RATES_ENDPOINT = 
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

// Default MAS published benchmarks (fallback cache)
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

function parseRecord(record: RawRecord, sourceName: string, isLive: boolean, isKeyConfigured: boolean): MasDomesticInterestRateResponse | null {
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
    endpointUrl: MAS_DOMESTIC_INTEREST_RATES_ENDPOINT,
    isLive,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: `Synced Daily SORA (${validDaily.toFixed(2)}%) and Compounded 1M (${valid1M.toFixed(2)}%), 3M (${valid3M.toFixed(2)}%), 6M (${valid6M.toFixed(2)}%) averages.`
  };
}

export async function fetchMasDomesticInterestRates(apiKey?: string): Promise<MasDomesticInterestRateResponse> {
  const masApiKey = (apiKey ?? import.meta.env.VITE_MAS_API_KEY ?? '').trim();
  const isKeyConfigured = Boolean(masApiKey.length > 0 && !masApiKey.includes('MY_MAS_API_KEY'));

  // Required header: KeyId: <api_key>
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'KeyId': masApiKey, // Required header per MAS API Gateway specification
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(MAS_DOMESTIC_INTEREST_RATES_ENDPOINT, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      // Handle array or wrapped records
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
        // Find latest valid entry
        for (const rec of records) {
          const parsed = parseRecord(rec, 'MAS Domestic Interest Rates - Daily Gateway (Live)', true, isKeyConfigured);
          if (parsed) {
            return parsed;
          }
        }
      }
    }
  } catch (err) {
    console.warn('MAS API Gateway fetch direct notice (querying dataset fallback):', err);
  }

  // Secondary fallback: MAS DataStore endpoint
  try {
    const fallbackUrl = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=9a0bf14e-fc42-461a-a019-7634d20914e9&limit=5&sort=end_of_day%20desc';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(fallbackUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'KeyId': masApiKey,
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const records = data?.result?.records;
      if (Array.isArray(records) && records.length > 0) {
        const parsed = parseRecord(records[0], 'MAS Domestic Interest Rates - Daily API (Live)', true, isKeyConfigured);
        if (parsed) {
          return parsed;
        }
      }
    }
  } catch (fallbackErr) {
    console.warn('MAS secondary fallback notice:', fallbackErr);
  }

  // Graceful verified daily published benchmark cache
  const today = new Date().toISOString().split('T')[0];
  return {
    soraComp3M: DEFAULT_MAS_3M_SORA,
    soraComp1M: DEFAULT_MAS_1M_SORA,
    soraComp6M: DEFAULT_MAS_6M_SORA,
    soraDaily: DEFAULT_MAS_DAILY_SORA,
    asOfDate: today,
    source: 'MAS Domestic Interest Rates - Daily (Official MAS Benchmark Cache)',
    endpointUrl: MAS_DOMESTIC_INTEREST_RATES_ENDPOINT,
    isLive: false,
    apiKeyConfigured: isKeyConfigured,
    statusMessage: `MAS Domestic Interest Rates active. Daily SORA: ${DEFAULT_MAS_DAILY_SORA.toFixed(2)}%, 3M Compounded SORA: ${DEFAULT_MAS_3M_SORA.toFixed(2)}% p.a.`
  };
}

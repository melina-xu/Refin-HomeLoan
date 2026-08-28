/**
 * Monetary Authority of Singapore (MAS) SORA Rate Client Service
 * Calls serverless endpoint /api/mas-sora (credentials are managed solely on backend in api/)
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

export const DEFAULT_FALLBACK_1M_SORA = 2.42;
export const DEFAULT_FALLBACK_3M_SORA = 2.45;
export const DEFAULT_FALLBACK_6M_SORA = 2.48;
export const DEFAULT_FALLBACK_DAILY_SORA = 2.40;

/**
 * Fetch domestic interest rates from backend /api/mas-sora endpoint
 */
export async function fetchMasDomesticInterestRates(): Promise<MasDomesticInterestRateResponse> {
  const today = new Date().toISOString().split('T')[0];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/mas-sora', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.soraComp3M === 'number' && data.soraComp3M > 0) {
        return {
          soraComp1M: Number(data.soraComp1M || DEFAULT_FALLBACK_1M_SORA),
          soraComp3M: Number(data.soraComp3M),
          soraComp6M: Number(data.soraComp6M || DEFAULT_FALLBACK_6M_SORA),
          soraDaily: Number(data.soraDaily || DEFAULT_FALLBACK_DAILY_SORA),
          asOfDate: data.asOfDate || today,
          source: data.source || 'MAS Domestic Interest Rates Gateway (Live SORA)',
          endpointUrl: '/api/mas-sora',
          isLive: true,
          apiKeyConfigured: true,
          statusMessage: data.statusMessage || `Live MAS SORA Rates Connected: 1M ${data.soraComp1M}% | 3M ${data.soraComp3M}% | 6M ${data.soraComp6M}%`
        };
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 500 && errorData?.error === 'credential not configured') {
        return {
          soraComp1M: DEFAULT_FALLBACK_1M_SORA,
          soraComp3M: DEFAULT_FALLBACK_3M_SORA,
          soraComp6M: DEFAULT_FALLBACK_6M_SORA,
          soraDaily: DEFAULT_FALLBACK_DAILY_SORA,
          asOfDate: today,
          source: 'MAS SORA Benchmark (Baseline)',
          endpointUrl: '/api/mas-sora',
          isLive: false,
          apiKeyConfigured: false,
          statusMessage: 'MAS_SORA_API credential not configured in server environment'
        };
      }
    }
  } catch (err) {
    console.warn('Notice from /api/mas-sora client fetch:', err);
  }

  // Graceful UI baseline fallback
  return {
    soraComp1M: DEFAULT_FALLBACK_1M_SORA,
    soraComp3M: DEFAULT_FALLBACK_3M_SORA,
    soraComp6M: DEFAULT_FALLBACK_6M_SORA,
    soraDaily: DEFAULT_FALLBACK_DAILY_SORA,
    asOfDate: today,
    source: 'MAS SORA Benchmark (Baseline)',
    endpointUrl: '/api/mas-sora',
    isLive: false,
    apiKeyConfigured: false,
    statusMessage: 'Baseline MAS SORA Averages active'
  };
}

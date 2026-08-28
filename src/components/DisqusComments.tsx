import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, ExternalLink } from 'lucide-react';

interface DisqusCommentsProps {
  pageUrl?: string;
  pageIdentifier?: string;
  title?: string;
}

interface DisqusPageConfig {
  url?: string;
  identifier?: string;
  title?: string;
}

interface DisqusContext {
  page: DisqusPageConfig;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (params: { reload: boolean; config?: (this: DisqusContext) => void }) => void;
    };
    disqus_config?: (this: DisqusContext) => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  pageUrl,
  pageIdentifier = 'refin-homeloan-main',
  title = 'Mortgage Arbitrage & Refinancing Discussion'
}) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    try {
      // Determine canonical URL safely
      let currentUrl = pageUrl;
      if (!currentUrl) {
        try {
          currentUrl = window.location.href;
        } catch {
          currentUrl = 'https://refi-cyan.vercel.app';
        }
      }

      // Configure disqus
      window.disqus_config = function (this: DisqusContext) {
        this.page.url = currentUrl;
        this.page.identifier = pageIdentifier;
        this.page.title = title;
      };

      if (window.DISQUS) {
        // If Disqus script is already present, trigger reset for new identifier/url
        window.DISQUS.reset({
          reload: true,
          config: function (this: DisqusContext) {
            this.page.url = currentUrl;
            this.page.identifier = pageIdentifier;
            this.page.title = title;
          }
        });
      } else {
        const d = document;
        const scriptId = 'disqus-embed-script';
        let existingScript = d.getElementById(scriptId) as HTMLScriptElement | null;
        
        if (!existingScript) {
          const s = d.createElement('script');
          s.id = scriptId;
          s.src = 'https://https-refi-cyan-vercel-app.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.async = true;
          s.crossOrigin = 'anonymous';

          s.onerror = () => {
            setLoadError(true);
          };

          (d.head || d.body).appendChild(s);
        }
      }
    } catch (err) {
      console.warn('Disqus embed initialization notice:', err);
    }
  }, [pageUrl, pageIdentifier, title, retryCount]);

  const handleRetry = () => {
    setLoadError(false);
    const existing = document.getElementById('disqus-embed-script');
    if (existing) {
      existing.remove();
    }
    setRetryCount(prev => prev + 1);
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-16 py-12" id="disqus-discussion-section">
      <div className="bg-[#1e2020] border-2 border-[#333535] p-6 lg:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#333535] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#121414] border border-[#444933] flex items-center justify-center text-[#c3f400]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#c3f400] font-bold">
                  COMMUNITY DISCUSSION & INQUIRIES
                </span>
              </div>
              <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold uppercase text-white">
                Mortgage Strategy & Rate Exchange
              </h3>
            </div>
          </div>
          <span className="font-['JetBrains_Mono'] text-xs text-[#8e9379]">
            Powered by Disqus
          </span>
        </div>

        {/* Error Fallback Notice if third-party script is blocked or network errors occur */}
        {loadError ? (
          <div className="bg-[#121414] border border-[#444933] p-5 font-['JetBrains_Mono'] text-xs space-y-3">
            <p className="text-[#c4c9ac]">
              Disqus comments widget could not connect directly (often due to browser ad-blocking or sandboxed preview protections).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="bg-[#c3f400] text-[#161e00] px-3.5 py-1.5 font-bold uppercase hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
              <a
                href="https://disqus.com/home/forums/https-refi-cyan-vercel-app/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#c3f400] hover:underline flex items-center gap-1 py-1.5"
              >
                Open Disqus Discussion Forum <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Disqus Embed Container */
          <div className="pt-2">
            <div id="disqus_thread" className="min-h-[220px]"></div>
            <noscript>
              Please enable JavaScript to view the{' '}
              <a href="https://disqus.com/?ref_noscript" className="text-[#c3f400] underline" rel="noreferrer" target="_blank">
                comments powered by Disqus.
              </a>
            </noscript>
          </div>
        )}
      </div>
    </section>
  );
};

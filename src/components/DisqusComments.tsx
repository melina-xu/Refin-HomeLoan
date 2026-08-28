import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface DisqusCommentsProps {
  pageUrl?: string;
  pageIdentifier?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  pageUrl,
  pageIdentifier,
}) => {
  useEffect(() => {
    // Execute Disqus Universal Code exactly as provided
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://https-refi-cyan-vercel-app.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(+new Date()));
    (d.head || d.body).appendChild(s);
  }, [pageUrl, pageIdentifier]);

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

        {/* Disqus Thread */}
        <div className="pt-2">
          <div id="disqus_thread"></div>
          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-[#c3f400] underline" rel="noreferrer" target="_blank">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </section>
  );
};

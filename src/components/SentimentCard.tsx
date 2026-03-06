import { memo } from 'react';
import { SentimentResult } from '@/types/movie';

const SentimentCard = memo(function SentimentCard({ sentiment }: { sentiment: SentimentResult }) {
    return (
        <div className="animate-fade-up relative overflow-hidden w-full max-w-full flex justify-center">
            <div className="relative z-10 w-full mx-auto">
                <div className="flex flex-col w-full text-left">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter mb-4">Summary</h3>
                    <p className="text-[13px] md:text-[15px] lg:text-base leading-[1.7] md:leading-[1.8] text-white/80 font-medium tracking-wide mb-6">
                        {sentiment.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                        <p className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white/20">
                            AI-generated from user reviews
                        </p>
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/10" />
                        <p className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                            {sentiment.classification} Vibe
                        </p>
                        {sentiment.model && (
                            <>
                                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/10" />
                                <p className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white/20">
                                    {sentiment.model}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SentimentCard;

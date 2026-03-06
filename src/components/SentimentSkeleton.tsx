import { memo } from 'react';
import { Brain } from 'lucide-react';

const SentimentSkeleton = memo(function SentimentSkeleton() {
    return (
        <div className="md:border md:border-white/5 md:bg-white/[0.02] p-0 md:p-8 min-h-[200px] md:rounded-md max-w-full">
            <div className="max-w-[76%] md:max-w-full mx-auto md:mx-0">
                {/* Header row */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="hidden md:block">
                            <Brain size={15} className="shrink-0 text-white/10" />
                        </div>
                        <div className="space-y-2 flex flex-col items-center md:items-start">
                            <div className="h-2 w-20 bg-white/5 shimmer" />
                            <div className="h-3.5 w-36 bg-white/10 shimmer" />
                        </div>
                    </div>
                    <div className="w-10 h-10 border border-white/5 shimmer rounded-md hidden md:block" />
                </div>

                {/* Divider */}
                <div className="hidden md:block border-t border-white/5 mb-6" />

                {/* Summary shimmer lines */}
                <div className="space-y-2.5 mb-8">
                    <div className="h-3 w-full bg-white/[0.04] shimmer" />
                    <div className="h-3 w-5/6 bg-white/[0.04] shimmer mx-auto md:mx-0" />
                    <div className="h-3 w-3/4 bg-white/[0.04] shimmer mx-auto md:mx-0" />
                </div>

                {/* Footer shimmer */}
                <div className="h-2 w-28 bg-white/[0.03] shimmer mx-auto md:mx-0" />
            </div>
        </div>
    );
});

export default SentimentSkeleton;

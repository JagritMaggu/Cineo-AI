import { memo } from 'react';
import { Brain } from 'lucide-react';

const SentimentSkeleton = memo(function SentimentSkeleton() {
    return (
        <div className="border border-white/5 bg-white/[0.02] p-6 md:p-8 min-h-[200px] rounded-md">

            {/* Header row */}
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                    <Brain size={15} className="shrink-0 text-white/10" />
                    <div className="space-y-2">
                        <div className="h-2 w-20 bg-white/5 shimmer" />
                        <div className="h-3.5 w-36 bg-white/10 shimmer" />
                    </div>
                </div>
                <div className="w-10 h-10 border border-white/5 shimmer rounded-md" />
            </div>

            {/* Divider */}
            <div className="border-t border-white/5 mb-6" />

            {/* Summary shimmer lines */}
            <div className="space-y-2.5 mb-8">
                <div className="h-3 w-full bg-white/[0.04] shimmer" />
                <div className="h-3 w-5/6 bg-white/[0.04] shimmer" />
                <div className="h-3 w-3/4 bg-white/[0.04] shimmer" />
            </div>

            {/* Footer shimmer */}
            <div className="h-2 w-28 bg-white/[0.03] shimmer" />
        </div>
    );
});

export default SentimentSkeleton;

import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = memo(function ErrorState({ message }: { message: string }) {
    return (
        <div className="animate-fade-up border border-rose-500/20 bg-rose-500/[0.03] p-5 flex items-start gap-4 text-rose-400 rounded-md">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 opacity-70" />
            <div>
                <p className="font-black text-xs uppercase tracking-widest mb-1.5">
                    {message.toLowerCase().includes('not found') ? 'Movie Not Found' : 'Something Went Wrong'}
                </p>
                <p className="text-xs text-rose-400/60 font-light">{message}</p>
                <p className="text-[10px] text-rose-400/30 mt-2 uppercase tracking-wider">
                    IMDb IDs start with &ldquo;tt&rdquo; — e.g. tt0468569
                </p>
            </div>
        </div>
    );
});

export default ErrorState;

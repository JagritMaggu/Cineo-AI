import { memo } from 'react';

const LoadingState = memo(function LoadingState() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
});

export default LoadingState;

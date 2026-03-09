export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`${sizes[size]} relative`}>
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-violet-400 animate-spin" />
                <div className="absolute inset-1 rounded-full border-t-2 border-cyan-400 animate-spin"
                    style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
            </div>
            {text && <p className="text-star-white/60 text-sm font-outfit">{text}</p>}
        </div>
    );
}

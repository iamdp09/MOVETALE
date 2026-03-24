import { motion } from 'framer-motion';

const RatingChart = ({ rating = 0, maxRating = 10, size = 60, strokeWidth = 4, variant = 'default', className = '' }) => {
    const percentage = (rating / maxRating) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (pct) => {
        if (pct >= 70) return { main: '#22C55E', glow: 'rgba(34, 197, 94, 0.3)', bg: 'rgba(34, 197, 94, 0.1)' };
        if (pct >= 50) return { main: '#EAB308', glow: 'rgba(234, 179, 8, 0.3)', bg: 'rgba(234, 179, 8, 0.1)' };
        if (pct >= 30) return { main: '#F97316', glow: 'rgba(249, 115, 22, 0.3)', bg: 'rgba(249, 115, 22, 0.1)' };
        return { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.3)', bg: 'rgba(239, 68, 68, 0.1)' };
    };

    const colors = getColor(percentage);

    // Sizes for different variants
    const configs = {
        default: { size: 60, strokeWidth: 4, fontSize: 'text-base', subSize: 'text-[8px]' },
        large: { size: 120, strokeWidth: 6, fontSize: 'text-3xl', subSize: 'text-xs' },
        small: { size: 40, strokeWidth: 3, fontSize: 'text-xs', subSize: 'text-[6px]' },
        card: { size: 44, strokeWidth: 3, fontSize: 'text-[11px]', subSize: 'text-[6px]' },
    };

    const config = configs[variant] || configs.default;
    const s = variant === 'default' ? size : config.size;
    const sw = variant === 'default' ? strokeWidth : config.strokeWidth;
    const r = (s - sw) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (percentage / 100) * c;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* Glow effect for larger variants */}
            {(variant === 'large' || variant === 'default') && (
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-40"
                    style={{ background: colors.glow }}
                />
            )}

            <svg
                width={s}
                height={s}
                viewBox={`0 0 ${s} ${s}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={s / 2}
                    cy={s / 2}
                    r={r}
                    fill="rgba(18, 18, 18, 0.8)"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={sw}
                />
                {/* Animated progress arc */}
                <motion.circle
                    cx={s / 2}
                    cy={s / 2}
                    r={r}
                    fill="none"
                    stroke={colors.main}
                    strokeWidth={sw}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    style={{
                        filter: `drop-shadow(0 0 6px ${colors.glow})`,
                    }}
                />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className={`${config.fontSize} font-bold leading-none`}
                    style={{ color: colors.main }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    {rating > 0 ? rating.toFixed(1) : 'NR'}
                </motion.span>
                {variant !== 'card' && variant !== 'small' && (
                    <span className={`${config.subSize} text-muted mt-0.5`}>
                        / {maxRating}
                    </span>
                )}
            </div>
        </div>
    );
};

export default RatingChart;

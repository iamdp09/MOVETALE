import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

const segments = [
    { label: 'Skip', color: '#F472B6', darkColor: '#831843' },
    { label: 'Timepass', color: '#FBBF24', darkColor: '#78350F' },
    { label: 'Go for it', color: '#34D399', darkColor: '#064E3B' },
    { label: 'Perfection', color: '#A78BFA', darkColor: '#4C1D95' },
];

const MoveTaleMeter = ({ rating = 0, maxRating = 10, voteCount = 0, totalVotes = 0, className = '' }) => {
    const percentage = Math.round((rating / maxRating) * 100);

    // Determine which segment the rating falls into and compute legend percentages
    const getSegmentPercentages = (pct) => {
        if (pct >= 80) return [0, 1, 13, 87];
        if (pct >= 60) return [2, 5, pct, 100 - pct - 7];
        if (pct >= 40) return [5, 15, pct, 100 - pct - 20];
        if (pct >= 20) return [10, pct, 100 - pct - 10, 0];
        return [pct, 100 - pct, 0, 0];
    };

    const legendPercents = getSegmentPercentages(percentage);

    // Determine the dominant color based on percentage
    const getDominantColor = (pct) => {
        if (pct >= 75) return '#A78BFA';
        if (pct >= 50) return '#34D399';
        if (pct >= 25) return '#FBBF24';
        return '#F472B6';
    };

    const dominantColor = getDominantColor(percentage);

    // SVG arc calculations
    const width = 280;
    const height = 170;
    const centerX = width / 2;
    const centerY = 150;
    const outerRadius = 120;
    const innerRadius = 85;
    const strokeWidth = outerRadius - innerRadius;
    const midRadius = (outerRadius + innerRadius) / 2;

    // Create arc path for SVG
    const polarToCartesian = (cx, cy, r, angle) => {
        const rad = ((angle - 180) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    const describeArc = (cx, cy, r, startAngle, endAngle) => {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    // Segment angles (semicircle from 0 to 180 degrees)
    // The segments are proportional: Skip (small), Timepass (small), Go for it (medium), Perfection (large)
    const segmentAngles = [
        { start: 0, end: 20 },     // Skip
        { start: 22, end: 55 },    // Timepass
        { start: 57, end: 100 },   // Go for it
        { start: 102, end: 180 },  // Perfection
    ];

    // Progress angle based on percentage
    const progressAngle = (percentage / 100) * 180;

    return (
        <div className={`bg-surface rounded-2xl border border-white/5 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">MoveTale Meter</h3>
                <button className="text-muted hover:text-white transition-colors">
                    <Share2 size={18} />
                </button>
            </div>

            {/* Semicircle Gauge */}
            <div className="flex justify-center">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Background segments (dark) */}
                    {segmentAngles.map((seg, idx) => (
                        <path
                            key={`bg-${idx}`}
                            d={describeArc(centerX, centerY, midRadius, seg.start, seg.end)}
                            fill="none"
                            stroke={segments[idx].darkColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            opacity={0.4}
                        />
                    ))}

                    {/* Animated progress arc */}
                    {segmentAngles.map((seg, idx) => {
                        const segStart = seg.start;
                        const segEnd = seg.end;
                        // Only draw if progress reaches this segment
                        if (progressAngle <= segStart) return null;
                        const clampedEnd = Math.min(progressAngle, segEnd);

                        return (
                            <motion.path
                                key={`progress-${idx}`}
                                d={describeArc(centerX, centerY, midRadius, segStart, clampedEnd)}
                                fill="none"
                                stroke={segments[idx].color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.2, delay: idx * 0.15, ease: 'easeOut' }}
                                style={{
                                    filter: `drop-shadow(0 0 8px ${segments[idx].color}40)`,
                                }}
                            />
                        );
                    })}

                    {/* Center percentage text */}
                    <motion.text
                        x={centerX}
                        y={centerY - 30}
                        textAnchor="middle"
                        fill={dominantColor}
                        fontSize="42"
                        fontWeight="700"
                        fontFamily="Inter, sans-serif"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {percentage}%
                    </motion.text>

                    {/* Votes text */}
                    <motion.text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="13"
                        fontFamily="Inter, sans-serif"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {voteCount || Math.floor(totalVotes * percentage / 100)}/{totalVotes || voteCount || 0} Votes
                    </motion.text>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
                {segments.map((seg, idx) => (
                    <motion.div
                        key={seg.label}
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + idx * 0.1 }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: seg.color }}
                        />
                        <span className="text-xs text-muted">{seg.label}</span>
                        <span className="text-xs text-white font-medium">{legendPercents[idx]}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MoveTaleMeter;

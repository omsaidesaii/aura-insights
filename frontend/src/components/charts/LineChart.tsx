interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
}

export const LineChart = ({ data, color = '#3B82F6', height = 240 }: LineChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
          No data available
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;
  const width = 475;
  const chartHeight = height - 60;
  const padding = 20;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (width - 2 * padding);
    const y =
      padding +
      chartHeight -
      ((item.value - minValue) / range) * (chartHeight - 2 * padding);
    return { x, y, value: item.value, label: item.label };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPathData =
    pathData +
    ` L ${points[points.length - 1].x} ${chartHeight + padding} L ${points[0].x} ${chartHeight + padding} Z`;

  return (
    <div className="flex min-h-[240px] flex-1 flex-col gap-4 py-4">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Area fill */}
        <path
          d={areaPathData}
          fill={`url(#gradient-${color.replace('#', '')})`}
          opacity={0.2}
        />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            className="hover:r-6 transition-all"
          />
        ))}
        {/* Gradient definition */}
        <defs>
          <linearGradient
            id={`gradient-${color.replace('#', '')}`}
            x1="0"
            x2="0"
            y1="0"
            y2={height}
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      {/* Labels */}
      <div className="flex justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark px-4">
        {points
          .filter((_, index) => index % Math.ceil(points.length / 5) === 0)
          .map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
      </div>
    </div>
  );
};


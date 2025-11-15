interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}

export const PieChart = ({ data, size = 200 }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
          No data available
        </p>
      </div>
    );
  }

  let currentAngle = -90; // Start from top
  const radius = size / 2 - 10;
  const center = size / 2;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate path for pie slice
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      pathData,
      percentage,
      label: item.label,
      color: item.color,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}
      </svg>
      <div className="flex flex-col gap-2 w-full">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                {segment.label}
              </span>
            </div>
            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              {segment.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


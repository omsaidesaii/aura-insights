interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  maxHeight?: number;
  color?: string;
}

export const BarChart = ({ data, color = '#135bec', maxHeight: _maxHeight }: BarChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-end justify-center gap-4 px-4 pb-4">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div
            key={index}
            className="flex h-full w-full flex-col items-center justify-end gap-2"
          >
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.2,
              }}
            />
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
              {item.label}
            </p>
            <p className="text-xs text-text-primary-light dark:text-text-primary-dark font-semibold">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};


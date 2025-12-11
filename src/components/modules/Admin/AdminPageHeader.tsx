interface AdminPageHeaderProps {
  title: string;
  description?: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
}

export default function AdminPageHeader({
  title,
  description,
  stats,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-muted-foreground">{stat.label}:</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


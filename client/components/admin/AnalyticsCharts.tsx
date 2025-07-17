import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Activity,
} from "lucide-react";
import type { AnalyticsData } from "@/services/analytics";

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

const COLORS = ["#003780", "#ff6b35", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const getChartData = () => {
    return data.chartData[timeRange];
  };

  const getTimeRangeLabel = () => {
    const labels = {
      daily: "7 Hari Terakhir",
      weekly: "4 Minggu Terakhir",
      monthly: "6 Bulan Terakhir",
      yearly: "2 Tahun Terakhir",
    };
    return labels[timeRange];
  };

  const calculateTrend = () => {
    const chartData = getChartData();
    if (chartData.length < 2) return { trend: 0, isPositive: true };

    const latest = chartData[chartData.length - 1]?.visitors || 0;
    const previous = chartData[chartData.length - 2]?.visitors || 0;
    const trend = previous === 0 ? 0 : ((latest - previous) / previous) * 100;

    return {
      trend: Math.abs(trend),
      isPositive: trend >= 0,
    };
  };

  const trendData = calculateTrend();

  return (
    <div className="space-y-6">
      {/* Main Visitor Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grafik Pengunjung Website
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getTimeRangeLabel()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={trendData.isPositive ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {trendData.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trendData.trend.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {(["daily", "weekly", "monthly", "yearly"] as TimeRange[]).map(
              (range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={
                    timeRange === range
                      ? "bg-automotive-blue hover:bg-automotive-blue-dark"
                      : ""
                  }
                >
                  {range === "daily" && "Harian"}
                  {range === "weekly" && "Mingguan"}
                  {range === "monthly" && "Bulanan"}
                  {range === "yearly" && "Tahunan"}
                </Button>
              ),
            )}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#003780" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#003780" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorPageViews"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey={
                    timeRange === "daily"
                      ? "date"
                      : timeRange === "weekly"
                        ? "week"
                        : timeRange === "monthly"
                          ? "month"
                          : "year"
                  }
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#003780"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  strokeWidth={2}
                  name="Pengunjung Unik"
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#ff6b35"
                  fillOpacity={1}
                  fill="url(#colorPageViews)"
                  strokeWidth={2}
                  name="Halaman Dilihat"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Halaman Populer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topPages}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ page, percentage }) => `${page} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="views"
                  >
                    {data.topPages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {data.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type === "visitor" ? "Pengunjung" : "Konten"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const performanceData = [
  { month: 'Ene', btc: 100, medusa: 100 },
  { month: 'Feb', btc: 115, medusa: 145 },
  { month: 'Mar', btc: 125, medusa: 210 },
  { month: 'Abr', btc: 118, medusa: 280 },
  { month: 'May', btc: 130, medusa: 350 },
  { month: 'Jun', btc: 125, medusa: 420 },
  { month: 'Jul', btc: 135, medusa: 485 },
  { month: 'Ago', btc: 128, medusa: 520 },
  { month: 'Sep', btc: 140, medusa: 580 },
  { month: 'Oct', btc: 155, medusa: 650 },
  { month: 'Nov', btc: 180, medusa: 700 },
  { month: 'Dic', btc: 195, medusa: 720 }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[rgba(1,0,82,0.95)] border border-[rgba(185,184,235,0.3)] rounded-[12px] p-4 shadow-xl">
        <p className="text-white font-['Inter'] text-sm font-semibold mb-2">
          {payload[0].payload.month} 2024
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[rgba(204,204,224,0.7)] font-['Inter'] text-xs">
              {entry.name}:
            </span>
            <span className="text-white font-['Inter'] text-sm font-bold">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart() {
  return (
    <div className="relative bg-[rgba(27,26,100,0.5)] rounded-[24px] border border-[rgba(185,184,235,0.2)] p-8 overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h3 className="font-['Cormorant_Garamond'] text-[36px] font-bold text-white mb-2">
            Comparativa de Rentabilidad 2024
          </h3>
          <p className="font-['Inter'] text-[16px] text-[rgba(204,204,224,0.7)]">
            Inversión inicial de 100% normalizada a Enero 2024
          </p>
        </div>

        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={performanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(185,184,235,0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="rgba(185,184,235,0.5)"
              style={{
                fontSize: '12px',
                fontFamily: 'Inter',
                fill: 'rgba(185,184,235,0.7)'
              }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(185,184,235,0.2)' }}
            />
            <YAxis 
              stroke="rgba(185,184,235,0.5)"
              style={{
                fontSize: '12px',
                fontFamily: 'Inter',
                fill: 'rgba(185,184,235,0.7)'
              }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(185,184,235,0.2)' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontFamily: 'Inter',
                fontSize: '14px'
              }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="btc" 
              stroke="#f7931a"
              strokeWidth={3}
              name="Bitcoin"
              dot={{ fill: '#f7931a', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="medusa" 
              stroke="#6366f1"
              strokeWidth={3}
              name="Medusa Capital"
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Stats destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[rgba(185,184,235,0.15)]">
          <div className="text-center">
            <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-1 uppercase tracking-wider">
              BTC Rentabilidad
            </p>
            <p className="font-['Cormorant_Garamond'] text-[32px] font-bold text-[#f7931a]">
              +95%
            </p>
          </div>
          <div className="text-center">
            <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-1 uppercase tracking-wider">
              Medusa Capital
            </p>
            <p className="font-['Cormorant_Garamond'] text-[32px] font-bold text-[#6366f1]">
              +620%
            </p>
          </div>
          <div className="text-center">
            <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-1 uppercase tracking-wider">
              Outperformance
            </p>
            <p className="font-['Cormorant_Garamond'] text-[32px] font-bold text-[#4dff88]">
              +525%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

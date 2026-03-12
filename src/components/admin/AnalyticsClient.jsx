"use client"

import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AnalyticsClient({ data }) {

    if (!data || data.length === 0) {
        return (
            <div className="flex h-100 items-center justify-center rounded-2xl border border-dashed bg-gray-50">
                <p className="text-muted-foreground">Not enough data to generate analytics yet.</p>
            </div>
        )
    }

    const safeData = data.map(item => ({
        name: item.name,
        revenue: typeof item.revenue === 'number' ? item.revenue : Number(item.revenue),
        orders: typeof item.orders === 'number' ? item.orders : Number(item.orders)
    }));

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className=" text-2xl font-bold text-foreground">Analytics Overview</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <Card className="rounded-2xl border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                        <CardDescription>Monthly revenue generated from sales.</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <div style={{ width: '100%', height: '350px' }}
                            className="mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={safeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Orders Volume</CardTitle>
                        <CardDescription>Number of successful orders per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: '100%', height: '350px' }}
                            className="mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={safeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="orders"
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
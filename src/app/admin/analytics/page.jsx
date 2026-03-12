import { getAnalyticsData } from "@/lib/actions/admin.actions"
import AnalyticsClient from "@/components/admin/AnalyticsClient"

export const metadata = {
    title: 'Analytics | Admin Dashboard',
}

export default async function AdminAnalyticsPage() {
    const graphData = await getAnalyticsData();

    return (
        <AnalyticsClient data={graphData} />
    )
}
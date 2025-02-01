import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import Layout from '@/components/Layout';
import { analyticsApi } from '@/services/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [lendingTrends, setLendingTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularBooksRes, lendingTrendsRes] = await Promise.all([
          analyticsApi.getPopularBooks(),
          analyticsApi.getLendingTrends()
        ]);

        setPopularBooks(popularBooksRes.data);
        setLendingTrends(lendingTrendsRes.data.map((trend: { borrowedDate: string | number | Date; }) => ({
          ...trend,
          date: format(new Date(trend.borrowedDate), 'MMM dd')
        })));
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Most Borrowed Books</h2>
          <BarChart width={500} height={300} data={popularBooks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="_count.lendings" fill="#4F46E5" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Lending Trends</h2>
          <LineChart width={500} height={300} data={lendingTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="_count.id" stroke="#4F46E5" />
          </LineChart>
        </div>
      </div>
    </Layout>
  );
}

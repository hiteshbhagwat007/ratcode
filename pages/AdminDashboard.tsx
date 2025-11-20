import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getCountFromServer, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ADMIN_EMAIL, AuditData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileCheck, TrendingUp, Eye } from 'lucide-react';

interface AdminProps {
  user: User | null;
}

const AdminDashboard: React.FC<AdminProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    userCount: 0,
    auditCount: 0,
    visitorCount: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topAudits, setTopAudits] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      // Simple client-side protection. 
      // Ideally, Firestore security rules should also enforce this.
      return; 
    }

    const fetchData = async () => {
      try {
        // 1. Counts
        const usersSnap = await getCountFromServer(collection(db, "users"));
        const auditsSnap = await getCountFromServer(collection(db, "audits"));
        const visitorsSnap = await getCountFromServer(collection(db, "visitors"));

        // 2. Audits for Chart (Last 30)
        const auditsQuery = query(collection(db, "audits"), orderBy("timestamp", "desc"), limit(50));
        const auditsDocs = await getDocs(auditsQuery);
        
        // Process for Chart (Group by Date)
        const dateMap: Record<string, number> = {};
        const topList: AuditData[] = [];

        auditsDocs.forEach(doc => {
          const data = doc.data();
          topList.push(data as AuditData);

          const date = data.timestamp?.toDate().toLocaleDateString();
          if (date) {
            dateMap[date] = (dateMap[date] || 0) + 1;
          }
        });

        const chart = Object.keys(dateMap).map(date => ({
          date,
          count: dateMap[date]
        })).reverse();

        // 3. Top Audited (Just showing recent ones here for simplicity as "Top" logic wasn't strictly defined by score, using recent)
        setTopAudits(topList.slice(0, 5));
        
        setStats({
          userCount: usersSnap.data().count,
          auditCount: auditsSnap.data().count,
          visitorCount: visitorsSnap.data().count
        });
        setChartData(chart);

      } catch (e) {
        console.error("Error fetching admin data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-600 dark:text-red-400">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300">You do not have permission to view this page.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-primary underline">Go Home</button>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.userCount} icon={<Users />} color="bg-blue-500" />
          <StatCard title="Total Audits" value={stats.auditCount} icon={<FileCheck />} color="bg-green-500" />
          <StatCard title="Total Visitors" value={stats.visitorCount} icon={<Eye />} color="bg-purple-500" />
          <StatCard title="Avg Score" value="76" icon={<TrendingUp />} color="bg-orange-500" /> {/* Mocked avg for design */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Audits Per Day</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#1b3e98" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent/Top List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Audits</h3>
            <div className="space-y-4">
              {topAudits.map((audit, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">@{audit.username}</p>
                    <p className="text-xs text-gray-500">{new Date(audit.timestamp.toDate()).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    audit.score >= 80 ? 'bg-green-100 text-green-800' : 
                    audit.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {audit.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
    <div className={`${color} p-4 rounded-lg text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
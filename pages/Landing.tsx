import React from 'react';
import { loginWithGoogle } from '../firebaseConfig';
import { ShieldCheck, BarChart2, FileText } from 'lucide-react';

const Landing: React.FC = () => {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-black dark:to-gray-900 px-4">
      <div className="text-center max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Optimize Your <span className="text-primary">Instagram</span> Presence
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Get an instant, AI-powered audit of your Instagram profile. 
          Identify growth gaps, improve engagement, and download professional reports in seconds.
        </p>
        
        <div className="pt-4">
          <button 
            onClick={handleLogin}
            className="px-8 py-4 bg-primary hover:bg-blue-800 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Free Audit with Google
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
          <FeatureCard 
            icon={<ShieldCheck className="text-primary" size={32} />}
            title="Instant Scoring"
            desc="Get a 0-100 score based on proven engagement metrics."
          />
          <FeatureCard 
            icon={<FileText className="text-primary" size={32} />}
            title="PDF Reports"
            desc="Generate beautiful branded PDF reports for you or your clients."
          />
          <FeatureCard 
            icon={<BarChart2 className="text-primary" size={32} />}
            title="Growth Analytics"
            desc="Track your improvements over time with detailed history."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{desc}</p>
  </div>
);

export default Landing;
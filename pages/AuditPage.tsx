import React, { useState } from 'react';
import AuditForm from '../components/AuditForm';
import AuditResult from '../components/AuditResult';
import { AuditData } from '../types';
import { User } from 'firebase/auth';

interface AuditPageProps {
  user: User;
}

const AuditPage: React.FC<AuditPageProps> = ({ user }) => {
  const [result, setResult] = useState<AuditData | null>(null);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Ready to analyze an account? Fill in the details below.
          </p>
        </div>

        {result ? (
          <AuditResult data={result} onReset={() => setResult(null)} />
        ) : (
          <AuditForm userId={user.uid} onComplete={setResult} />
        )}
      </div>
    </div>
  );
};

export default AuditPage;
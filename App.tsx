import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, recordVisitor } from './firebaseConfig';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import AuditPage from './pages/AuditPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Record visit on app load
    recordVisitor();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <Navbar user={user} />
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/audit" /> : <Landing />} 
          />
          <Route 
            path="/audit" 
            element={user ? <AuditPage user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={<AdminDashboard user={user} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
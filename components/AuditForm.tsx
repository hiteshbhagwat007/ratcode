import React, { useState } from 'react';
import { AuditData } from '../types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AuditFormProps {
  userId: string;
  onComplete: (data: AuditData) => void;
}

const AuditForm: React.FC<AuditFormProps> = ({ userId, onComplete }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [postsPerWeek, setPostsPerWeek] = useState<number>(0);
  const [reelRatio, setReelRatio] = useState<number>(0);
  const [hasProfilePic, setHasProfilePic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Audit Logic ---
    let score = 0;
    const suggestions: string[] = [];

    // 1. Bio length 80+ (+20)
    if (bio.length >= 80) {
      score += 20;
    } else {
      suggestions.push("Expand your bio to at least 80 characters to better describe your brand.");
    }

    // 2. Profile Picture (+20)
    if (hasProfilePic) {
      score += 20;
    } else {
      suggestions.push("Add a high-quality profile picture to build trust.");
    }

    // 3. Posts per week >= 3 (+30)
    if (postsPerWeek >= 3) {
      score += 30;
    } else {
      suggestions.push("Increase posting frequency to at least 3 times per week.");
    }

    // 4. Reel ratio >= 0.5 (+30)
    if (reelRatio >= 0.5) {
      score += 30;
    } else {
      suggestions.push("Focus on video content. Aim for Reels to be at least 50% of your posts.");
    }

    const auditData: AuditData = {
      userId,
      username,
      bio,
      postsPerWeek,
      reelRatio,
      hasProfilePic,
      score,
      suggestions,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "audits"), auditData);
      // Pass data back to parent to show results (use regular date for display since serverTimestamp is async)
      onComplete({ ...auditData, timestamp: new Date() });
    } catch (error) {
      console.error("Error saving audit:", error);
      alert("Failed to save audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">New Audit</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram Username</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">@</span>
            <input 
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-8 w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
              placeholder="instagram_user"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio Text</label>
          <textarea 
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white h-24 resize-none"
            placeholder="Paste the current bio here..."
          />
          <p className="text-xs text-right text-gray-400 mt-1">{bio.length} chars</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posts per Week</label>
            <input 
              required
              type="number" 
              min="0"
              value={postsPerWeek}
              onChange={(e) => setPostsPerWeek(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reel Ratio (0.0 - 1.0)</label>
            <input 
              required
              type="number" 
              min="0"
              max="1"
              step="0.1"
              value={reelRatio}
              onChange={(e) => setReelRatio(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
              placeholder="e.g. 0.5"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <input 
            type="checkbox" 
            checked={hasProfilePic}
            onChange={(e) => setHasProfilePic(e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary rounded"
            id="pfp_check"
          />
          <label htmlFor="pfp_check" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Has a clear Profile Picture?
          </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform hover:scale-[1.02] ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-800 shadow-blue-500/30'}`}
        >
          {loading ? 'Analyzing...' : 'Generate Audit Score'}
        </button>
      </form>
    </div>
  );
};

export default AuditForm;
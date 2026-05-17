import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BrainCircuit, Clock, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

const StudyPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.get('/studyplan/generate');
      setPlan(res.data);
    } catch (err) {
      console.error("Error generating plan", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mt-0 mt-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-600" />
            AI Study Scheduler
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Your personalized daily study plan optimized by our ML model.</p>
        </div>
        <button onClick={generatePlan} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 self-start md:self-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate Plan
        </button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Analyzing your performance data via ML model...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Target</h2>
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-center">
                 <Clock className="w-10 h-10 text-blue-600 mb-3" />
                 <p className="text-sm font-semibold text-blue-800 mb-1">Recommended Time</p>
                 <p className="text-4xl font-black text-gray-900">{Math.round(plan?.daily_study_time_minutes || 0)} <span className="text-lg text-gray-500 font-medium">mins</span></p>
              </div>
              
              <h3 className="font-bold text-gray-900 mt-8 mb-4">AI Recommendations</h3>
              <ul className="space-y-3">
                {plan?.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm font-medium text-gray-700">
                    <BrainCircuit className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Action Plan</h2>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl border bg-white border-gray-200 flex items-center justify-between transition-all hover:shadow-md cursor-pointer">
                <div className="flex items-center gap-4">
                  <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-blue-500"></button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-700">Study</span>
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.round((plan?.daily_study_time_minutes || 60) * 0.6)} mins</span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Core Subjects & Theory</h4>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="p-5 rounded-xl border bg-white border-gray-200 flex items-center justify-between transition-all hover:shadow-md cursor-pointer">
                <div className="flex items-center gap-4">
                  <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-blue-500"></button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-purple-100 text-purple-700">Practice</span>
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.round((plan?.daily_study_time_minutes || 60) * 0.4)} mins</span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Problem Solving & Aptitude</h4>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
               <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-gray-800 transition-colors">
                 Start Study Session
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;

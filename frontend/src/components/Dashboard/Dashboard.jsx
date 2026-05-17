import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { BookOpen, Calendar, Target, Award, ArrowRight, Clock, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Classes Today', value: summary?.classes_today || 0, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Study Topics', value: summary?.study_plan_topics || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tests This Week', value: summary?.tests_this_week || 0, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Overall Progress', value: `${summary?.overall_progress_pct || 0}%`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <header className="mb-10 md:mt-0 mt-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}. Here's your academic and placement summary.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
            <Link to="/timetable" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
             <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-l-blue-500 hover:bg-gray-100 transition-colors">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-bold text-gray-900 text-lg">Your Schedule is Ready!</h4>
                  <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                    Check the Timetable tab to add your classes.
                  </p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
          </div>
          
          <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100 mb-6 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-900 font-bold mb-1">Up Next: View your personalized ML study plan</p>
                <div className="flex items-center gap-2 text-xs font-medium text-blue-800 bg-blue-100 w-fit px-3 py-1.5 rounded-full mt-3">
                  <Clock className="w-3.5 h-3.5" /> Start Learning
                </div>
              </div>
            </div>
          </div>

          <Link to="/study-plan" className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
            View Full Study Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

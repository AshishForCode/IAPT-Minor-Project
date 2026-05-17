import React, { useState, useEffect } from 'react';
import { Briefcase, Building, ExternalLink, Plus, X } from 'lucide-react';
import api from '../../services/api';

const PlacementTracker = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', status: 'Applied' });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get('/placement/applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/placement/applications', formData);
      setShowModal(false);
      setFormData({ company: '', role: '', status: 'Applied' });
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-amber-100 text-amber-800';
      case 'offer': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mt-0 mt-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Placement Tracker
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Manage your job applications and interview preparation.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md shadow-blue-600/20 transition-colors flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" /> Add Application
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Applied</p>
            <p className="text-3xl font-black text-gray-900">{applications.length}</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-sm font-semibold text-gray-500 mb-1">Interviews</p>
            <p className="text-3xl font-black text-amber-600">{applications.filter(a => a.status.toLowerCase() === 'interview').length}</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-sm font-semibold text-gray-500 mb-1">Offers</p>
            <p className="text-3xl font-black text-emerald-600">{applications.filter(a => a.status.toLowerCase() === 'offer').length}</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-sm font-semibold text-gray-500 mb-1">Success Rate</p>
            <p className="text-3xl font-black text-purple-600">
              {applications.length ? Math.round((applications.filter(a => a.status.toLowerCase() === 'offer').length / applications.length)*100) : 0}%
            </p>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No applications tracked yet. Start applying!</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold w-1/4">Company & Role</th>
                  <th className="p-4 font-semibold w-1/6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.app_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{app.company}</p>
                          <p className="text-xs font-medium text-gray-500">{app.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Log New Application</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddApp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role / Position</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded-lg p-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">Save Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementTracker;

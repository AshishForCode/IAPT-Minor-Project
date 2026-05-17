import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, MoreVertical, X } from 'lucide-react';
import api from '../../services/api';

const Timetable = () => {
  const [view, setView] = useState('week');
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '', day: 'Monday', date: '', start_time: '', end_time: '', location: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await api.get('/timetable/');
      setSchedule(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/timetable/', formData);
      setShowModal(false);
      setFormData({ subject: '', day: 'Monday', date: '', start_time: '', end_time: '', location: '' });
      fetchTimetable();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding slot');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this slot?')) {
      try {
        await api.delete(`/timetable/?id=${id}`);
        fetchTimetable();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mt-0 mt-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academic Timetable</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Manage your weekly classes and lab sessions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button onClick={() => setView('day')} className={`px-4 py-2 rounded-md transition-colors ${view === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Day</button>
            <button onClick={() => setView('week')} className={`px-4 py-2 rounded-md transition-colors ${view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Week</button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Add Slot</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 border-b border-gray-100">
          {days.map((day) => (
            <div key={day} className="px-6 py-4 text-center font-semibold text-gray-700 border-r border-gray-100 last:border-0 hidden md:block">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">
          {days.map((day) => (
            <div key={day} className="border-r border-gray-100 last:border-0 p-4 space-y-4">
              <div className="md:hidden font-bold text-gray-900 mb-2 pb-2 border-b">{day}</div>
              {schedule.filter(s => s.day === day).map((slot, idx) => (
                <div key={slot.timetable_id || idx} className={`p-4 rounded-xl border bg-blue-50 border-blue-200 transition-transform hover:-translate-y-1 hover:shadow-md relative group`}>
                  <button onClick={() => handleDelete(slot.timetable_id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="font-bold text-base leading-tight mb-3 text-gray-900">{slot.subject}</h3>
                  <div className="space-y-1.5 opacity-90 text-gray-700">
                    <p className="text-sm font-medium flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {slot.start_time} - {slot.end_time}</p>
                    <p className="text-sm font-medium flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {slot.location}</p>
                  </div>
                </div>
              ))}
              
              {schedule.filter(s => s.day === day).length === 0 && (
                <div className="h-full min-h-[100px] rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                  <p className="text-sm font-medium text-gray-400">No classes</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Timetable Slot</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Day</label>
                  <select className="w-full border rounded-lg p-2" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" className="w-full border rounded-lg p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input required type="time" className="w-full border rounded-lg p-2" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input required type="time" className="w-full border rounded-lg p-2" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">Save Slot</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;

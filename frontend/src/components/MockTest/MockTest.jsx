import React, { useState, useEffect } from 'react';
import { FileEdit, Clock, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';
import api from '../../services/api';

const MockTest = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get('/mocktests/');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mt-0 mt-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <FileEdit className="w-8 h-8 text-blue-600" />
            Mock Test Engine
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Practice under timed conditions and review your performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border">No mock tests available right now.</div>
        ) : tests.map(test => (
          <div key={test.mock_test_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
            <div className={`h-2 bg-blue-500`} />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  test.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {test.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{test.test_name}</h3>
              
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {test.duration} mins</div>
                <div className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {test.questions_count} Qs</div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <button className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                   Start Test <PlayCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTest;

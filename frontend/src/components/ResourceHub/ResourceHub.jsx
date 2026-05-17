import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Download, ExternalLink } from 'lucide-react';
import api from '../../services/api';

const ResourceHub = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources/');
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': return Video;
      case 'article': return FileText;
      default: return Download;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mt-0 mt-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Resource Hub
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Curated study materials, guides, and video lectures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border">No resources available right now.</div>
        ) : resources.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <div key={resource.resource_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-50 text-blue-500`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 leading-tight mb-4 flex-1 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{resource.type}</span>
                <a href={resource.url || '#'} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceHub;

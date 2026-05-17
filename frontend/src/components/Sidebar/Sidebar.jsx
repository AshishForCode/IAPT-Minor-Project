import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  BrainCircuit, 
  Briefcase, 
  FileEdit, 
  BookOpen, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/study-plan', icon: BrainCircuit, label: 'AI Study Plan' },
    { path: '/placement', icon: Briefcase, label: 'Placement Prep' },
    { path: '/mock-tests', icon: FileEdit, label: 'Mock Tests' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40 w-72 bg-gray-900 text-white flex flex-col h-full transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pt-16 md:pt-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
            IAPT
          </h1>
          <p className="text-gray-400 text-sm mt-1 ml-11">Placement Tracker</p>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">MAIN MENU</div>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-blue-400 truncate">{user?.role || 'User'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

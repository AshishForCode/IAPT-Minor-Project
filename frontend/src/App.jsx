import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import Timetable from './components/Timetable/Timetable';
import StudyPlan from './components/StudyPlan/StudyPlan';
import PlacementTracker from './components/PlacementTracker/PlacementTracker';
import MockTest from './components/MockTest/MockTest';
import ResourceHub from './components/ResourceHub/ResourceHub';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
      <Route path="/study-plan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
      <Route path="/placement" element={<ProtectedRoute><PlacementTracker /></ProtectedRoute>} />
      <Route path="/mock-tests" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourceHub /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogIn, Lock, Mail, BrainCircuit } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-6">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your IAPT dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center justify-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3.5 px-4 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all font-semibold shadow-lg shadow-blue-600/30"
            >
              Sign In <LogIn className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

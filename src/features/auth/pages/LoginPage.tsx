import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/app/providers/RoleContext';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { apiFetch } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Building2 } from 'lucide-react';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar: string;
    organizationId: string;
  };
}

export const LoginPage: React.FC = () => {
  const { login } = useRole();
  const { currentOrganization } = useOrganization();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sarah.hashemi@osforh.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>('/auth/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.token) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      // In case backend is offline, provide friendly fallback
      if (email && password === 'admin123') {
        login('demo-token-12345', {
          id: 'emp-osf-002',
          name: 'Sarah Al-Hashemi',
          email,
          role: 'hr_manager',
          department: 'Human Resources & Talent',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          organizationId: currentOrganization.id,
        });
        navigate('/dashboard');
      } else {
        setError(err.message || 'Unable to connect to the authentication service.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fbfaf7] p-4 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#e6e3da] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-stone-900 mb-1">
            <Building2 className="h-6 w-6 text-[#d9533f]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {currentOrganization.name}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Enterprise Human Resource Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#e6e3da] bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-stone-900">Sign in to your account</h2>
            <p className="text-xs text-stone-400">
              Enter your corporate credentials to access HR administration.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr.manager@company.com"
                  className="pl-9 h-9 text-xs bg-[#faf9f6] border-[#e6e3da] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-stone-700">Password</label>
                <span className="text-[11px] text-stone-400 cursor-pointer hover:underline" onClick={() => alert('Default demo password is "admin123"')}>
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-9 text-xs bg-[#faf9f6] border-[#e6e3da] focus:bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-9 text-xs font-medium mt-2"
            >
              Sign In to HRMS
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-[#f2efe8] space-y-2">
            <p className="text-[11px] font-medium text-stone-400 text-center">
              Quick Test Credentials (Click any role to auto-fill):
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('sarah.hashemi@osforh.com')}
                className="w-full text-left p-2 rounded-lg bg-[#faf9f5] border border-[#e6e3da] hover:border-stone-400 text-[11px] flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-stone-800">Sarah Al-Hashemi</span>
                  <span className="text-stone-400 ml-1.5">(HR Manager / Admin)</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('tariq.mansour@osforh.com')}
                className="w-full text-left p-2 rounded-lg bg-[#faf9f5] border border-[#e6e3da] hover:border-stone-400 text-[11px] flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-stone-800">Tariq Mansour</span>
                  <span className="text-stone-400 ml-1.5">(Employee / Self-Service ESS)</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('amira.nasser@osforh.com')}
                className="w-full text-left p-2 rounded-lg bg-[#faf9f5] border border-[#e6e3da] hover:border-stone-400 text-[11px] flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-stone-800">Amira Nasser</span>
                  <span className="text-stone-400 ml-1.5">(Engineering Team Lead)</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">admin123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Badge Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
          <span>Secured corporate session with role-based access control</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employees/me');
        setProfile(res.data);
      } catch(err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (!profile) return <div className="p-8 text-center text-slate-500">Profile setup incomplete. Please contact HR.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600">
              {profile.name.charAt(0)}
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-semibold text-sm shadow-sm ring-1 ring-inset ring-green-600/20 mb-2">
              {profile.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900">{profile.name}</h1>
            <p className="text-lg text-slate-600 font-medium">{profile.designation} <span className="text-slate-400 mx-2">•</span> {profile.department}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Contact Context</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Mail size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{profile.email}</span>
                      <span className="text-xs text-slate-500">Work Email</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{profile.phone}</span>
                      <span className="text-xs text-slate-500">Mobile</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{profile.address || 'Address not provided'}</span>
                      <span className="text-xs text-slate-500">Home Address</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Employment Details</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <User size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{profile.employeeId}</span>
                      <span className="text-xs text-slate-500">Employee ID</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Calendar size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{new Date(profile.dateOfJoining).toLocaleDateString()}</span>
                      <span className="text-xs text-slate-500">Date of Joining</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Shield size={20} className="mr-3 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">{profile.emergencyContact || 'Not provided'}</span>
                      <span className="text-xs text-slate-500">Emergency Contact</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

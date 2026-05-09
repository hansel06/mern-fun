import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Lock, Save, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  // Delete Account State
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Update name if user context changes
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      setProfileLoading(true);
      const res = await usersAPI.updateProfile({ name });
      
      // Update local auth context by "re-logging in" with new user data
      const token = localStorage.getItem('token');
      if (token && res.user) {
        login(token, res.user);
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(undefined);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      await usersAPI.updatePassword({ currentPassword, newPassword });
      
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all events you have hosted. Type "DELETE" to confirm.'
    );

    if (confirmation === 'DELETE') {
      try {
        setDeleteLoading(true);
        await usersAPI.deleteAccount();
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-primary">Account Settings</h1>
          <p className="text-text-secondary mt-1">Manage your profile and security preferences.</p>
        </div>

        <div className="space-y-8">
          {/* General Information Card */}
          <div className="bg-surface-elevated rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-surface flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-text-primary">General Information</h2>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-text-secondary">{user?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleProfileSubmit} className="flex-1 w-full space-y-5">
                  <Input
                    id="name"
                    type="text"
                    label="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      isLoading={profileLoading}
                      className="flex items-center gap-2"
                      disabled={name === user?.name}
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-surface-elevated rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-surface flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Security</h2>
            </div>
            
            <div className="p-6 md:p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
                <Input
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    id="newPassword"
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  
                  <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                {passwordError && (
                  <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                    {passwordError}
                  </div>
                )}
                
                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={passwordLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-surface-elevated rounded-2xl shadow-sm border border-danger/20 overflow-hidden mt-8">
            <div className="px-6 py-5 border-b border-danger/20 bg-danger/5 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h2 className="text-xl font-bold text-danger">Danger Zone</h2>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Delete Account</h3>
                <p className="text-text-secondary mt-1 max-w-xl">
                  Permanently delete your account, all your created events, and remove your RSVPs from other events. This action cannot be undone.
                </p>
              </div>
              <Button 
                variant="danger" 
                onClick={handleDeleteAccount}
                isLoading={deleteLoading}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

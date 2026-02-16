import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserQuery } from '../store/apiSlice';
import { User, Mail, MapPin, Building, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { id } = useParams(); // Gets '1' from /profile/1
  const { data: user, isLoading, isError } = useGetUserQuery(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  if (isLoading) return <div className="p-8">Loading Profile...</div>;
  if (isError) return <div className="p-8 text-red-500">User not found.</div>;

  const handleSave = () => {
    // In a real app, you'd use a mutation: const [updateUser] = useUpdateUserMutation();
    // For now, we'll toggle the UI state to show it "saved" locally.
    setIsEditing(false);
    alert(`Success! Name updated to: ${tempName || user.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header / Cover Photo Area */}
      <div className="h-44 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl"></div>
      
      <div className="bg-white px-8 pb-8 rounded-b-2xl border border-gray-100 shadow-sm -mt-12">
        <div className="flex justify-between items-end">
          <div className="relative">
            <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-lg">
              <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                <User size={48} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setIsEditing(!isEditing);
              setTempName(user.name);
            }}
            className="mb-4 flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
          </button>
        </div>

        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
              </div>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">{tempName || user.name}</h1>
              <p className="text-gray-500">@{user.username.toLowerCase()}</p>
            </>
          )}
        </div>

        <hr className="my-8 border-gray-100" />

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600"><Mail size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-3 bg-white rounded-lg shadow-sm text-green-600"><MapPin size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
              <p className="font-medium">{user.address.city}, {user.address.street}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600"><Building size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Company</p>
              <p className="font-medium">{user.company.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
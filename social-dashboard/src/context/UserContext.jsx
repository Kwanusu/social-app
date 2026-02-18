
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Function to manually refresh user data after profile updates
  const refreshUser = async () => {
    await auth.currentUser?.reload();
    setUser({ ...auth.currentUser });
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);


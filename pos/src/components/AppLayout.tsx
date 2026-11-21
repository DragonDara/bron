import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';
import { usePOSStore } from '../store/pos-store';

const AppLayout = () => {
  const location = useLocation();
  const { isUpdatingOrder, resetOrderState } = usePOSStore();
  
  useEffect(() => {
    const isPosScreen = location.pathname === '/register';
    if (!isPosScreen && isUpdatingOrder) {
      resetOrderState();
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-inter">
      <Header />
      <div className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;

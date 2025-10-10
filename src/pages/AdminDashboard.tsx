import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Wyloguj
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Użytkownicy</h3>
              <p className="text-blue-700">Zarządzaj użytkownikami systemu</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Zakłady</h3>
              <p className="text-green-700">Przeglądaj i zarządzaj zakładami</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Promocje</h3>
              <p className="text-purple-700">Dodawaj i edytuj promocje</p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Raporty</h3>
              <p className="text-yellow-700">Generuj raporty finansowe</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Ustawienia</h3>
              <p className="text-red-700">Konfiguracja systemu</p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wsparcie</h3>
              <p className="text-indigo-700">Zarządzaj zgłoszeniami</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informacje o administratorze</h3>
            <p className="text-gray-700">
              Zalogowany jako: <span className="font-semibold">{user?.name} {user?.lastName}</span>
            </p>
            <p className="text-gray-700">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-gray-700">
              ID użytkownika: <span className="font-semibold">{user?.userId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

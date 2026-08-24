import React from 'react';


const Header = ({ title, user }) => {

  return (

    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
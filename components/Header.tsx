import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user?: User;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">
                    GlicoControl
                </h1>
                <p className="mt-2 text-md text-gray-600">
                    Seu assistente pessoal para controle de glicemia.
                </p>
            </div>
            {user && onLogout && (
                <div className="flex items-center mt-4 sm:mt-0">
                    <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full mr-3" />
                    <div className="text-sm">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sair
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
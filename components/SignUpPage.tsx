import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config';
import Header from './Header';

declare const google: any;

interface SignUpPageProps {
    onSignUp: (user: User) => void;
    onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }: SignUpPageProps) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [scriptError, setScriptError] = useState<string | null>(null);

    useEffect(() => {
        const initializeGSI = () => {
            if (typeof google === 'undefined' || !google.accounts) {
                setScriptError("Não foi possível carregar o serviço de cadastro do Google. Verifique sua conexão ou desative bloqueadores de anúncio.");
                console.error("Google Identity Services script not loaded.");
                return;
            }
            setScriptError(null);
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response: any) => {
                        try {
                            const credential = jwtDecode<any>(response.credential);
                            const user: User = {
                                id: credential.sub,
                                email: credential.email,
                                name: credential.name,
                                picture: credential.picture,
                            };
                            onSignUp(user);
                        } catch (error) {
                            console.error("Error decoding credential:", error);
                            setScriptError("Ocorreu um erro ao processar suas credenciais. Tente novamente.");
                        }
                    },
                });
                if (googleButtonRef.current) {
                    google.accounts.id.renderButton(
                        googleButtonRef.current,
                        { theme: 'filled_blue', size: 'large', type: 'standard', text: 'signup_with', shape: 'rectangular', logo_alignment: 'left' }
                    );
                }
            } catch (error) {
                console.error("Error initializing Google Sign-Up:", error);
                setScriptError("Ocorreu um erro inesperado ao configurar o cadastro.");
            }
        };
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const intervalId = setInterval(() => {
                if (typeof google !== 'undefined' && google.accounts) {
                    clearInterval(intervalId);
                    initializeGSI();
                }
            }, 100);
        } else {
            setScriptError("O script de cadastro do Google não foi encontrado na página.");
        }
    }, [onSignUp]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto text-center">
                <Header />
                <main className="mt-12 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">Crie sua conta</h2>
                    <p className="text-gray-600 mb-8">
                        Cadastre-se com sua conta Google para começar a usar o GlicoControl.
                    </p>
                    <div ref={googleButtonRef} className="flex justify-center"></div>
                    {scriptError && (
                        <div className="mt-6 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded-md">
                            <strong>Erro de Cadastro:</strong> {scriptError}
                        </div>
                    )}
                    <button className="mt-8 text-blue-600 underline" onClick={onSwitchToLogin}>
                        Já tem conta? Faça login
                    </button>
                </main>
            </div>
        </div>
    );
};

export default SignUpPage; 
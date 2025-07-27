import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config';
import Header from './Header';

declare const google: any;

interface LoginPageProps {
    onLogin: (user: User) => void;
    switchToSignUp?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, switchToSignUp }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [scriptError, setScriptError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for the google script to be ready
        const initializeGSI = () => {
            if (typeof google === 'undefined' || !google.accounts) {
                setScriptError("Não foi possível carregar o serviço de login do Google. Verifique sua conexão ou desative bloqueadores de anúncio.");
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
                            onLogin(user);
                        } catch (error) {
                            console.error("Error decoding credential:", error);
                            setScriptError("Ocorreu um erro ao processar suas credenciais. Tente novamente.");
                        }
                    },
                });

                if (googleButtonRef.current) {
                    google.accounts.id.renderButton(
                        googleButtonRef.current,
                        { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'rectangular', logo_alignment: 'left' }
                    );
                }
            } catch (error) {
                console.error("Error initializing Google Sign-In:", error);
                if (error instanceof Error && error.message.includes('idpiframe_initialization_failed')) {
                     setScriptError("O login com Google falhou. Certifique-se de que os cookies de terceiros estão habilitados no seu navegador.");
                } else {
                    setScriptError("Ocorreu um erro inesperado ao configurar o login.");
                }
            }
        };
        
        // The Google script is loaded asynchronously. We need to check for it.
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const intervalId = setInterval(() => {
                if (typeof google !== 'undefined' && google.accounts) {
                    clearInterval(intervalId);
                    initializeGSI();
                }
            }, 100);
        } else {
             setScriptError("O script de login do Google não foi encontrado na página.");
        }

    }, [onLogin]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-md mx-auto text-center">
                <Header />
                <main className="mt-12 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">Bem-vindo(a)!</h2>
                    <p className="text-gray-600 mb-8">
                        Faça login com sua conta Google para salvar e acessar seu histórico de medições.
                    </p>
                    <div ref={googleButtonRef} className="flex justify-center"></div>

                    {scriptError && (
                         <div className="mt-6 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded-md">
                            <strong>Erro de Login:</strong> {scriptError}
                        </div>
                    )}

                    {(!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('exemplo') || GOOGLE_CLIENT_ID === '633254532634-725d8sgmai3113jdrmjemprg2355101a.apps.googleusercontent.com') && (
                        <div className="mt-6 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded-md">
                            <strong>Atenção Desenvolvedor:</strong> O login não funcionará. Você deve substituir o 
                            <code>GOOGLE_CLIENT_ID</code> de exemplo no arquivo <code>config.ts</code> e configurar as Origens JavaScript Autorizadas no Google Cloud Console.
                        </div>
                    )}
                    {switchToSignUp && (
                        <button className="mt-8 text-blue-600 underline" onClick={switchToSignUp}>
                            Não tem conta? Cadastre-se
                        </button>
                    )}
                </main>
             </div>
        </div>
    );
};

export default LoginPage;
import React, { useState } from 'react';
import { ZapIcon, MailIcon } from './Icons';

interface LoginPageProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === 'julio@admin.com' && password === 'julio@admin') {
            onLoginSuccess();
        } else {
            setError('Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                    <div className="text-center">
                        <div className="flex justify-center items-center space-x-2 mb-4">
                            <ZapIcon className="h-10 w-10 text-brand-green" />
                            <span className="text-3xl font-bold text-brand-dark">LeadGenius Energia</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700">Acesso à Área do Vendedor</h2>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                    placeholder="E-mail"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                    placeholder="Senha"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                     <div className="text-center">
                        <button onClick={onBack} className="text-sm font-medium text-brand-blue hover:text-blue-700">
                            Voltar à Landing Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
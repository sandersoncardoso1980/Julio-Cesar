import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { CheckCircleIcon } from './Icons';

interface SettingsPageProps {
    settings: AppSettings;
    onSave: (settings: AppSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleOurPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            ourPlan: { ...prev.ourPlan, [name]: parseFloat(value) }
        }));
    };

    const handleCompetitorChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedCompetitors = [...localSettings.competitors];
        updatedCompetitors[index] = { ...updatedCompetitors[index], [name]: parseFloat(value) };
        setLocalSettings(prev => ({ ...prev, competitors: updatedCompetitors }));
    };

    const handleSavingsPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSettings(prev => ({ ...prev, landingPageSavingsPercentage: parseFloat(e.target.value) / 100 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Configurações da Aplicação</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Nosso Plano: LeadGenius Energia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="energyPrice" className="block text-sm font-medium text-gray-700">Preço Energia (€/kWh)</label>
                            <input
                                type="number"
                                id="energyPrice"
                                name="energyPrice"
                                value={localSettings.ourPlan.energyPrice}
                                onChange={handleOurPlanChange}
                                step="0.001"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            />
                        </div>
                        <div>
                            <label htmlFor="gasPrice" className="block text-sm font-medium text-gray-700">Preço Gás (€/m³)</label>
                            <input
                                type="number"
                                id="gasPrice"
                                name="gasPrice"
                                value={localSettings.ourPlan.gasPrice}
                                onChange={handleOurPlanChange}
                                step="0.001"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Calculadora da Landing Page</h3>
                     <div>
                        <label htmlFor="savingsPercentage" className="block text-sm font-medium text-gray-700">Poupança Média Exibida (%)</label>
                        <input
                            type="number"
                            id="savingsPercentage"
                            name="savingsPercentage"
                            value={Math.round(localSettings.landingPageSavingsPercentage * 100)}
                            onChange={handleSavingsPercentageChange}
                            step="1"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                         <p className="text-xs text-gray-500 mt-1">Esta é a percentagem usada para a estimativa de poupança na página inicial.</p>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Preços dos Concorrentes</h3>
                    <div className="space-y-4">
                        {localSettings.competitors.map((comp, index) => (
                             <div key={comp.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <span className="font-medium text-gray-700">{comp.name}</span>
                                <div>
                                    <label className="block text-xs text-gray-600">Energia (€/kWh)</label>
                                    <input
                                        type="number"
                                        name="energyPrice"
                                        value={comp.energyPrice}
                                        onChange={(e) => handleCompetitorChange(index, e)}
                                        step="0.001"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    />
                                </div>
                                 <div>
                                    <label className="block text-xs text-gray-600">Gás (€/m³)</label>
                                    <input
                                        type="number"
                                        name="gasPrice"
                                        value={comp.gasPrice}
                                        onChange={(e) => handleCompetitorChange(index, e)}
                                        step="0.001"
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex justify-end items-center">
                    {showSuccess && (
                        <div className="flex items-center text-green-600 mr-4 transition-opacity duration-300">
                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                            <span>Alterações guardadas!</span>
                        </div>
                    )}
                    <button type="submit" className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300">
                        Guardar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;

import React from 'react';
import { AppSettings, Lead } from '../types';
import { UserIcon, EuroIcon, ZapIcon } from './Icons';

interface ProposalExplanationProps {
    settings: AppSettings;
    sampleLead: Lead;
}

const ProposalExplanation: React.FC<ProposalExplanationProps> = ({ settings, sampleLead }) => {
    
    // Find competitor prices, fallback to first competitor if not found
    const energyCompetitor = settings.competitors.find(c => c.name === sampleLead.currentEnergyProvider) || settings.competitors[0];
    const gasCompetitor = settings.competitors.find(c => c.name === sampleLead.currentGasProvider) || settings.competitors[0];

    // Simplification: Estimate consumption based on bill and competitor price
    const estimatedKwh = sampleLead.avgEnergyBill / energyCompetitor.energyPrice;
    const estimatedM3 = sampleLead.avgGasBill / gasCompetitor.gasPrice;

    // Calculate new bills with our plan
    const newEnergyBill = estimatedKwh * settings.ourPlan.energyPrice;
    const newGasBill = estimatedM3 * settings.ourPlan.gasPrice;
    const newTotalBill = newEnergyBill + newGasBill;

    // Calculate savings
    const currentTotalBill = sampleLead.avgEnergyBill + sampleLead.avgGasBill;
    const monthlySavings = currentTotalBill - newTotalBill;
    const annualSavings = monthlySavings * 12;


    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark">Como Calculamos a Proposta de Poupança</h2>
                <p className="text-gray-600 mt-2">Este guia explica, de forma simples, o processo para gerar uma proposta personalizada para cada lead.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex items-center">
                    <div className="bg-brand-blue text-white rounded-full h-12 w-12 flex items-center justify-center">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">Lead de Exemplo: {sampleLead.fullName}</h3>
                        <p className="text-sm text-gray-500">{sampleLead.postalCode} | Fatura Total Atual: <strong>€{currentTotalBill.toFixed(2)}</strong></p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <StepCard
                    step="1"
                    title="Analisar Custos Atuais do Lead"
                    description="Começamos por identificar os custos mensais que o lead tem com os seus fornecedores atuais."
                >
                    <div className="flex space-x-4">
                        <Metric title="Fatura de Energia" value={`€${sampleLead.avgEnergyBill.toFixed(2)}`} subtitle={`com ${sampleLead.currentEnergyProvider}`} />
                        <Metric title="Fatura de Gás" value={`€${sampleLead.avgGasBill.toFixed(2)}`} subtitle={`com ${sampleLead.currentGasProvider}`} />
                    </div>
                </StepCard>

                <StepCard
                    step="2"
                    title="Estimar o Consumo"
                    description="Com base nos custos e nos preços conhecidos dos concorrentes, estimamos o consumo mensal do lead. (Ex: Consumo kWh = Fatura € / Preço kWh do concorrente)."
                >
                     <div className="flex space-x-4">
                        <Metric title="Consumo Estimado Energia" value={`${estimatedKwh.toFixed(2)} kWh`} />
                        <Metric title="Consumo Estimado Gás" value={`${estimatedM3.toFixed(2)} m³`} />
                    </div>
                </StepCard>

                 <StepCard
                    step="3"
                    title="Calcular a Nova Fatura com o Nosso Plano"
                    description="Aplicamos os nossos preços (configurados por si) ao consumo estimado para encontrar o novo custo mensal."
                >
                     <div className="flex space-x-4">
                        <Metric title="Nova Fatura Energia" value={`€${newEnergyBill.toFixed(2)}`} subtitle={`(Nosso preço: €${settings.ourPlan.energyPrice.toFixed(3)}/kWh)`} />
                        <Metric title="Nova Fatura Gás" value={`€${newGasBill.toFixed(2)}`} subtitle={`(Nosso preço: €${settings.ourPlan.gasPrice.toFixed(3)}/m³)`} />
                    </div>
                </StepCard>

                 <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-r-lg shadow-lg">
                    <div className="flex items-center">
                        <div className="bg-green-500 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">
                           €
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-green-800">Resultado Final: A Poupança</h3>
                            <p className="text-green-700">A proposta é a diferença entre o custo antigo e o novo, apresentada em valores mensais e anuais para maior impacto.</p>
                        </div>
                    </div>
                     <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-600">Custo Atual Total</p>
                            <p className="text-xl font-bold text-gray-800">€{currentTotalBill.toFixed(2)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-green-700">Novo Custo Total</p>
                            <p className="text-xl font-bold text-green-800">€{newTotalBill.toFixed(2)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-brand-orange">Poupança Anual</p>
                            <p className="text-2xl font-extrabold text-brand-orange">€{annualSavings.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepCard: React.FC<{ step: string, title: string, description: string, children: React.ReactNode }> = ({ step, title, description, children }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
            <div className="flex items-center">
                <div className="bg-gray-200 text-brand-blue font-bold rounded-full h-8 w-8 flex items-center justify-center">
                    {step}
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="mt-2 text-gray-600">{description}</p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                {children}
            </div>
        </div>
    </div>
);

const Metric: React.FC<{ title: string, value: string, subtitle?: string }> = ({ title, value, subtitle }) => (
    <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-bold text-brand-dark">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
);

export default ProposalExplanation;

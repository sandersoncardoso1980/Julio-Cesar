import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, Priority, AppSettings, HousingType, TariffType } from '../types';
import { PhoneIcon, MailIcon, UserIcon, ZapIcon, EuroIcon } from './Icons';
import SettingsPage from './SettingsPage';
import ProposalExplanation from './ProposalExplanation';
import { supabase } from '../lib/supabase';
import { LeadStatusLabels, PriorityLabels, HousingTypeLabels, TariffTypeLabels } from '../constants';


interface BackofficeProps {
    leads: Lead[];
    appSettings: AppSettings;
    onSaveSettings: (settings: AppSettings) => void;
}

type ActiveTab = 'leads' | 'calculator' | 'settings';

const KpiCard: React.FC<{ title: string; value: string; subtext: string }> = ({ title, value, subtext }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-brand-dark mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
);

const LeadListItem: React.FC<{ lead: Lead }> = ({ lead }) => {
    const [expanded, setExpanded] = useState(false);

    const priorityClasses = {
        [Priority.HIGH]: 'bg-red-100 text-red-800 border-red-500',
        [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-500',
        [Priority.LOW]: 'bg-green-100 text-green-800 border-green-500',
    };

    const statusClasses = {
        [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
        [LeadStatus.CONTACTED]: 'bg-purple-100 text-purple-800',
        [LeadStatus.SCHEDULED]: 'bg-indigo-100 text-indigo-800',
        [LeadStatus.CONVERTED]: 'bg-green-100 text-green-800',
        [LeadStatus.NURTURING]: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
                    {/* Main Info */}
                    <div className="flex-grow min-w-[200px]">
                        <p className="font-bold text-brand-dark">{lead.fullName}</p>
                        <p className="text-sm text-gray-500">{lead.postalCode}</p>
                    </div>
                    
                    {/* Status indicators */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <span title={`Score: ${lead.score}`} className={`px-3 py-1 text-sm font-semibold rounded-full text-center ${priorityClasses[lead.priority]} border ${priorityClasses[lead.priority].replace('bg-', 'border-')}`}>
                            {lead.score}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusClasses[lead.status]}`}>
                            {LeadStatusLabels[lead.status]}
                        </span>
                    </div>

                    {/* Date and Actions */}
                    <div className="flex items-center gap-4 flex-shrink-0 w-full justify-end sm:w-auto">
                        <div className="hidden sm:block text-sm text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                        </div>
                        <div className="flex items-center space-x-1">
                            <a href={`tel:${lead.phone}`} className="p-2 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded-full" aria-label={`Ligar para ${lead.fullName}`}><PhoneIcon className="h-5 w-5"/></a>
                            <a href={`mailto:${lead.email}`} className="p-2 text-gray-500 hover:text-brand-blue hover:bg-gray-100 rounded-full" aria-label={`Enviar email para ${lead.fullName}`}><MailIcon className="h-5 w-5"/></a>
                        </div>
                    </div>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2 text-gray-900">Detalhes do Lead:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-800">
                        <div className="break-words"><strong className="block text-gray-500">Email:</strong> {lead.email}</div>
                        <div className="break-words"><strong className="block text-gray-500">Telefone:</strong> {lead.phone}</div>
                        <div className="break-words"><strong className="block text-gray-500">Habitação:</strong> {HousingTypeLabels[lead.housingType as HousingType]} ({lead.occupants}p)</div>
                        <div className="break-words"><strong className="block text-gray-500">Potência:</strong> {lead.contractedPower} kVA</div>
                        <div className="break-words"><strong className="block text-gray-500">Fatura Energia:</strong> €{lead.avgEnergyBill}</div>
                        <div className="break-words"><strong className="block text-gray-500">Fatura Gás:</strong> €{lead.avgGasBill}</div>
                        <div className="break-words"><strong className="block text-gray-500">Fornecedor:</strong> {lead.currentEnergyProvider}</div>
                        <div className="break-words"><strong className="block text-gray-500">Tarifa:</strong> {TariffTypeLabels[lead.tariffType as TariffType]}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

const LeadsList: React.FC<{leads: Lead[]}> = ({ leads }) => {
    const [filter, setFilter] = useState({
        location: '',
        status: 'all',
        priority: 'all',
    });

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => filter.location ? lead.postalCode.toLowerCase().includes(filter.location.toLowerCase()) : true)
            .filter(lead => filter.status !== 'all' ? lead.status === filter.status : true)
            .filter(lead => filter.priority !== 'all' ? lead.priority === filter.priority : true)
            .sort((a, b) => b.score - a.score);
    }, [leads, filter]);

    return (
        <>
             <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input 
                        type="text" 
                        placeholder="Filtrar por Localidade..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}
                    />
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                        <option value="all">Todos os Status</option>
                        {Object.entries(LeadStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                     <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
                        <option value="all">Todas as Prioridades</option>
                        {Object.entries(PriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <button className="bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Exportar CSV</button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredLeads.map(lead => <LeadListItem key={lead.id} lead={lead} />)}
            </div>
             {filteredLeads.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">Nenhum lead encontrado com os filtros atuais.</p>
                </div>
            )}
        </>
    )
}

const Backoffice: React.FC<BackofficeProps> = ({ leads, appSettings, onSaveSettings }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('leads');
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    const leadsToday = leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;
    const conversionRate = leads.length > 0 ? (leads.filter(l => l.status === LeadStatus.CONVERTED).length / leads.length * 100).toFixed(1) : "0.0";

    const renderContent = () => {
        switch (activeTab) {
            case 'leads':
                return <LeadsList leads={leads} />;
            case 'calculator':
                return <ProposalExplanation settings={appSettings} sampleLead={leads[0]} />;
            case 'settings':
                return <SettingsPage settings={appSettings} onSave={onSaveSettings} />;
            default:
                return null;
        }
    }

    const getTabClass = (tabName: ActiveTab) => 
        `px-4 py-2 font-semibold rounded-md transition-colors duration-300 ${
            activeTab === tabName 
            ? 'bg-brand-blue text-white shadow' 
            : 'text-gray-600 hover:bg-gray-200'
        }`;

    return (
        <div className="bg-gray-100 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                     <h1 className="text-2xl font-bold text-brand-dark">Painel de Gestão</h1>
                     <button onClick={handleLogout} className="text-sm font-semibold text-gray-600 hover:text-brand-orange">Sair</button>
                </div>
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('leads')} className={getTabClass('leads')}>Leads</button>
                        <button onClick={() => setActiveTab('calculator')} className={getTabClass('calculator')}>Guia de Cálculo</button>
                        <button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>Configurações</button>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'leads' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KpiCard title="Total de Leads" value={leads.length.toString()} subtext="Desde o início" />
                        <KpiCard title="Leads Captados Hoje" value={leadsToday.toString()} subtext="Novas oportunidades" />
                        <KpiCard title="Taxa de Conversão" value={`${conversionRate}%`} subtext="Média geral" />
                        <KpiCard title="Leads Prioritários" value={leads.filter(l => l.priority === Priority.HIGH).length.toString()} subtext="Ação imediata necessária" />
                    </div>
                )}
                
                {renderContent()}
            </main>
        </div>
    );
};

export default Backoffice;
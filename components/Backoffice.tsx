import React, { useState, useMemo, useEffect } from 'react';
import { Lead, LeadStatus, Priority, AppSettings, HousingType, TariffType } from '../types';
import { PhoneIcon, MailIcon, ClockIcon, CalendarIcon, TrendingUpIcon } from './Icons';
import SettingsPage from './SettingsPage';
import ProposalExplanation from './ProposalExplanation';
import { supabase } from '../lib/supabase';
import { LeadStatusLabels, PriorityLabels, HousingTypeLabels, TariffTypeLabels } from '../constants';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';

interface BackofficeProps {
    leads: Lead[];
    appSettings: AppSettings;
    onSaveSettings: (settings: AppSettings) => void;
}

type ActiveTab = 'leads' | 'calculator' | 'settings';

// Types para os dados dos gráficos
interface ChartData {
    leadsByDay: Array<{ date: string; count: number; avgTime: number }>;
    statusData: Array<{ name: string; value: number; avgTime: number }>;
    timeOnPageData: Array<{ range: string; count: number; avgTime: number }>;
    timeTrendData: Array<{ date: string; avgTime: number; leads: number }>;
    engagementData: Array<{ status: string; avgTime: number; count: number }>;
    loading: boolean;
}

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
                    <div className="flex-grow min-w-[200px]">
                        <p className="font-bold text-brand-dark">{lead.fullName}</p>
                        <p className="text-sm text-gray-500">{lead.postalCode}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <span title={`Score: ${lead.score}`} className={`px-3 py-1 text-sm font-semibold rounded-full text-center ${priorityClasses[lead.priority]} border ${priorityClasses[lead.priority].replace('bg-', 'border-')}`}>
                            {lead.score}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusClasses[lead.status]}`}>
                            {LeadStatusLabels[lead.status]}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 w-full justify-end sm:w-auto">
                        <div className="hidden sm:block text-sm text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4" />
                            <span>{lead.timeOnPage}s</span>
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
                        <div className="break-words"><strong className="block text-gray-500">Tempo na Página:</strong> {lead.timeOnPage} segundos</div>
                        <div className="break-words"><strong className="block text-gray-500">Visitou Calculadora:</strong> {lead.visitedCalculator ? 'Sim' : 'Não'}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

const LeadsList: React.FC<{leads: Lead[]}> = ({ leads }) => {
    const [filter, setFilter] = useState({
        name: '',
        status: 'all',
        priority: 'all',
    });

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => filter.name ? 
                lead.fullName.toLowerCase().includes(filter.name.toLowerCase())
                : true
            )
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
                        placeholder="🔍 Buscar por nome..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
                        value={filter.name}
                    />
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                        onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                        value={filter.status}
                    >
                        <option value="all">Todos os Status</option>
                        {Object.entries(LeadStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                     <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                        onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
                        value={filter.priority}
                    >
                        <option value="all">Todas as Prioridades</option>
                        {Object.entries(PriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <button className="bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                        Exportar CSV
                    </button>
                </div>
                
                <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
                    <span>
                        {filteredLeads.length} de {leads.length} leads encontrados
                        {filter.name && ` para "${filter.name}"`}
                    </span>
                    
                    {(filter.name !== '' || filter.status !== 'all' || filter.priority !== 'all') && (
                        <button 
                            onClick={() => setFilter({ name: '', status: 'all', priority: 'all' })}
                            className="text-xs text-brand-blue hover:text-blue-700 underline"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {filteredLeads.map(lead => <LeadListItem key={lead.id} lead={lead} />)}
            </div>
            
            {filteredLeads.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    {filter.name || filter.status !== 'all' || filter.priority !== 'all' ? (
                        <>
                            <p className="text-gray-500 mb-2">Nenhum lead encontrado com os filtros atuais.</p>
                            <button 
                                onClick={() => setFilter({ name: '', status: 'all', priority: 'all' })}
                                className="text-brand-blue hover:text-blue-700 underline text-sm"
                            >
                                Limpar filtros para ver todos os leads
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-500">Nenhum lead cadastrado no sistema.</p>
                    )}
                </div>
            )}
        </>
    )
}

const Backoffice: React.FC<BackofficeProps> = ({ leads, appSettings, onSaveSettings }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('leads');
    const [chartData, setChartData] = useState<ChartData>({
        leadsByDay: [],
        statusData: [],
        timeOnPageData: [],
        timeTrendData: [],
        engagementData: [],
        loading: true
    });
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Buscar dados para os gráficos
    useEffect(() => {
        const fetchChartData = async () => {
            setChartData(prev => ({ ...prev, loading: true }));

            try {
                console.log('Buscando dados do Supabase...');
                
                const { data: allLeads, error } = await supabase
                    .from('leads')
                    .select('*')
                    .order('createdAt', { ascending: false });

                if (error) {
                    console.error('Erro ao buscar dados:', error);
                    processChartData(leads);
                    return;
                }

                console.log('Dados recebidos do Supabase:', allLeads?.length);
                processChartData(allLeads || []);
                
            } catch (error) {
                console.error('Erro ao processar dados:', error);
                processChartData(leads);
            }
        };

        const processChartData = (leadsData: Lead[]) => {
            // Processar dados para gráfico de leads por dia (últimos 14 dias) com tempo médio
            const last14Days = Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            }).reverse();

            const leadsByDay = last14Days.map(date => {
                const dayLeads = leadsData.filter(lead => {
                    if (!lead.createdAt) return false;
                    const leadDate = new Date(lead.createdAt).toISOString().split('T')[0];
                    return leadDate === date;
                });
                
                const count = dayLeads.length;
                const avgTime = count > 0 
                    ? Math.round(dayLeads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / count)
                    : 0;

                return {
                    date: new Date(date).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' }),
                    count,
                    avgTime
                };
            });

            // Processar dados para gráfico de status com tempo médio
            const statusData = Object.values(LeadStatus).map(status => {
                const statusLeads = leadsData.filter(lead => lead.status === status);
                const value = statusLeads.length;
                const avgTime = value > 0 
                    ? Math.round(statusLeads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / value)
                    : 0;

                return {
                    name: LeadStatusLabels[status],
                    value,
                    avgTime
                };
            }).filter(d => d.value > 0);

            // Processar dados para gráfico de tempo na página
            const timeRanges = [
                { range: '0-30s', min: 0, max: 30 },
                { range: '30-60s', min: 30, max: 60 },
                { range: '1-2min', min: 60, max: 120 },
                { range: '2-5min', min: 120, max: 300 },
                { range: '5+ min', min: 300, max: Infinity },
            ];

            const timeOnPageData = timeRanges.map(({ range, min, max }) => {
                const rangeLeads = leadsData.filter(lead => {
                    const time = lead.timeOnPage || 0;
                    return time >= min && time < max;
                });
                
                const count = rangeLeads.length;
                const avgTime = count > 0 
                    ? Math.round(rangeLeads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / count)
                    : 0;

                return {
                    range,
                    count,
                    avgTime
                };
            });

            // NOVO: Dados de tendência de tempo ao longo do tempo
            const timeTrendData = last14Days.map(date => {
                const dayLeads = leadsData.filter(lead => {
                    if (!lead.createdAt) return false;
                    const leadDate = new Date(lead.createdAt).toISOString().split('T')[0];
                    return leadDate === date;
                });
                
                const leadsCount = dayLeads.length;
                const avgTime = leadsCount > 0 
                    ? Math.round(dayLeads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / leadsCount)
                    : 0;

                return {
                    date: new Date(date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }),
                    avgTime,
                    leads: leadsCount
                };
            });

            // NOVO: Dados de engajamento por status
            const engagementData = Object.values(LeadStatus).map(status => {
                const statusLeads = leadsData.filter(lead => lead.status === status);
                const count = statusLeads.length;
                const avgTime = count > 0 
                    ? Math.round(statusLeads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / count)
                    : 0;

                return {
                    status: LeadStatusLabels[status],
                    avgTime,
                    count
                };
            }).filter(d => d.count > 0);

            setChartData({
                leadsByDay,
                statusData,
                timeOnPageData,
                timeTrendData,
                engagementData,
                loading: false
            });
        };

        if (activeTab === 'leads') {
            fetchChartData();
        }
    }, [activeTab, leads]);

    // Cálculo de KPIs
    const leadsToday = leads.filter(l => {
        const today = new Date().toDateString();
        const leadDate = new Date(l.createdAt).toDateString();
        return leadDate === today;
    }).length;
    
    const conversionRate = leads.length > 0 ? 
        (leads.filter(l => l.status === LeadStatus.CONVERTED).length / leads.length * 100).toFixed(1) : "0.0";

    const avgTimeOnPage = leads.length > 0 
        ? Math.round(leads.reduce((sum, lead) => sum + (lead.timeOnPage || 0), 0) / leads.length)
        : 0;

    const maxTimeOnPage = leads.length > 0 
        ? Math.max(...leads.map(lead => lead.timeOnPage || 0))
        : 0;

    const STATUS_COLORS: Record<string, string> = {
        [LeadStatusLabels[LeadStatus.NEW]]: '#3b82f6',
        [LeadStatusLabels[LeadStatus.CONTACTED]]: '#8b5cf6',
        [LeadStatusLabels[LeadStatus.SCHEDULED]]: '#6366f1',
        [LeadStatusLabels[LeadStatus.CONVERTED]]: '#10b981',
        [LeadStatusLabels[LeadStatus.NURTURING]]: '#6b7280',
    };

    const TIME_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#c7d2fe', '#dbeafe'];

    const renderContent = () => {
        switch (activeTab) {
            case 'leads':
                return (
                    <>
                        {/* KPIs - ADICIONADOS novos KPIs de tempo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                            <KpiCard title="Total de Leads" value={leads.length.toString()} subtext="Desde o início" />
                            <KpiCard title="Leads Hoje" value={leadsToday.toString()} subtext="Novas oportunidades" />
                            <KpiCard title="Taxa de Conversão" value={`${conversionRate}%`} subtext="Média geral" />
                            <KpiCard title="Tempo Médio" value={`${avgTimeOnPage}s`} subtext="Na página" />
                            <KpiCard title="Tempo Máximo" value={`${maxTimeOnPage}s`} subtext="Recorde de engajamento" />
                            <KpiCard title="Visitou Calculadora" value={leads.filter(l => l.visitedCalculator).length.toString()} subtext="Taxa de uso" />
                        </div>

                        {/* GRÁFICOS COM DADOS REAIS */}
                        {chartData.loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                                        <div className="animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                            <div className="h-48 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* 1. Evolução de Leads e Tempo por Dia */}
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                                            <CalendarIcon className="h-5 w-5" />
                                            Leads e Tempo Médio (Últimos 14 dias)
                                        </h3>
                                        {chartData.leadsByDay.some(day => day.count > 0) ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <ComposedChart data={chartData.leadsByDay}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                                    <Tooltip 
                                                        formatter={(value, name) => {
                                                            if (name === 'count') return [value, 'Leads'];
                                                            if (name === 'avgTime') return [`${value}s`, 'Tempo Médio'];
                                                            return [value, name];
                                                        }}
                                                    />
                                                    <Bar 
                                                        yAxisId="left"
                                                        dataKey="count" 
                                                        fill="#3b82f6" 
                                                        radius={[8, 8, 0, 0]} 
                                                        name="count"
                                                    />
                                                    <Line 
                                                        yAxisId="right"
                                                        type="monotone" 
                                                        dataKey="avgTime" 
                                                        stroke="#10b981" 
                                                        strokeWidth={3}
                                                        dot={{ fill: '#10b981' }}
                                                        name="avgTime"
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-gray-500">
                                                Sem dados disponíveis para os últimos 14 dias
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Status dos Leads com Tempo Médio */}
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-lg font-bold text-brand-dark mb-4">🎯 Status vs Tempo Médio</h3>
                                        {chartData.statusData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={chartData.statusData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                                    <Tooltip 
                                                        formatter={(value, name) => {
                                                            if (name === 'value') return [value, 'Leads'];
                                                            if (name === 'avgTime') return [`${value}s`, 'Tempo Médio'];
                                                            return [value, name];
                                                        }}
                                                    />
                                                    <Bar 
                                                        yAxisId="left"
                                                        dataKey="value" 
                                                        fill="#3b82f6" 
                                                        radius={[8, 8, 0, 0]} 
                                                        name="value"
                                                    />
                                                    <Line 
                                                        yAxisId="right"
                                                        type="monotone" 
                                                        dataKey="avgTime" 
                                                        stroke="#10b981" 
                                                        strokeWidth={2}
                                                        dot={{ fill: '#10b981' }}
                                                        name="avgTime"
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-gray-500">
                                                Sem dados de status disponíveis
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* 3. Tendência de Tempo na Página */}
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                                            <TrendingUpIcon className="h-5 w-5" />
                                            Evolução do Tempo Médio
                                        </h3>
                                        {chartData.timeTrendData.some(item => item.leads > 0) ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <AreaChart data={chartData.timeTrendData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <Tooltip formatter={(value) => [`${value}s`, 'Tempo Médio']} />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="avgTime" 
                                                        stroke="#8b5cf6" 
                                                        fill="#8b5cf6" 
                                                        fillOpacity={0.3}
                                                        strokeWidth={3}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-gray-500">
                                                Sem dados de tendência disponíveis
                                            </div>
                                        )}
                                    </div>

                                    {/* 4. Distribuição de Tempo na Página */}
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                                            <ClockIcon className="h-5 w-5" />
                                            Distribuição de Tempo
                                        </h3>
                                        {chartData.timeOnPageData.some(item => item.count > 0) ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={chartData.timeOnPageData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                                    <Tooltip 
                                                        formatter={(value, name) => {
                                                            if (name === 'count') return [value, 'Leads'];
                                                            if (name === 'avgTime') return [`${value}s`, 'Tempo Médio'];
                                                            return [value, name];
                                                        }}
                                                    />
                                                    <Bar 
                                                        yAxisId="left"
                                                        dataKey="count" 
                                                        fill="#10b981" 
                                                        radius={[8, 8, 0, 0]} 
                                                        name="count"
                                                    />
                                                    <Line 
                                                        yAxisId="right"
                                                        type="monotone" 
                                                        dataKey="avgTime" 
                                                        stroke="#f59e0b" 
                                                        strokeWidth={2}
                                                        dot={{ fill: '#f59e0b' }}
                                                        name="avgTime"
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-gray-500">
                                                Sem dados de tempo na página disponíveis
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 5. Engajamento por Status */}
                                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                                    <h3 className="text-lg font-bold text-brand-dark mb-4">📊 Engajamento por Status</h3>
                                    {chartData.engagementData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={chartData.engagementData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                                <YAxis 
                                                    type="category" 
                                                    dataKey="status" 
                                                    tick={{ fontSize: 12 }}
                                                    width={120}
                                                />
                                                <Tooltip 
                                                    formatter={(value, name) => {
                                                        if (name === 'avgTime') return [`${value}s`, 'Tempo Médio'];
                                                        if (name === 'count') return [value, 'Leads'];
                                                        return [value, name];
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="avgTime" 
                                                    fill="#6366f1" 
                                                    radius={[0, 8, 8, 0]} 
                                                    name="avgTime"
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-48 flex items-center justify-center text-gray-500">
                                            Sem dados de engajamento disponíveis
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Lista de Leads */}
                        <LeadsList leads={leads} />
                    </>
                );
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
                {renderContent()}
            </main>
        </div>
    );
};

export default Backoffice;

import React, { useState, useEffect, useRef } from 'react';
import { NewLeadData, LeadStatus, HousingType, TariffType } from '../types';
import { useLeadScoring } from '../hooks/useLeadScoring';
import { CheckCircleIcon, UserIcon, EuroIcon, ZapIcon, PhoneIcon, MailIcon, MapPinIcon, HomeIcon, LightningIcon, ClockIcon } from './Icons';
import { HousingTypeLabels, TariffTypeLabels } from '../constants';

interface LeadFormProps {
    onNewLead: (lead: NewLeadData) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onNewLead }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        postalCode: '',
        housingType: HousingType.APARTMENT,
        occupants: 1,
        currentEnergyProvider: '',
        currentGasProvider: '',
        avgEnergyBill: 50,
        avgGasBill: 20,
        contractedPower: 3.45,
        tariffType: TariffType.SIMPLE,
        yearsWithProvider: 1,
        changeHistory: 0,
    });
    const [submitted, setSubmitted] = useState(false);
    const [activeTime, setActiveTime] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const { calculateScore } = useLeadScoring();
    
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef<NodeJS.Timeout>();
    
    const providerOptionsArray = ['EDP', 'Galp', 'Endesa', 'Iberdrola', 'Repsol', 'Outro'];
    const providerOptionsMap = Object.fromEntries(providerOptionsArray.map(opt => [opt, opt]));

    // Timer preciso para tracking de tempo ativo
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActiveTime(Math.round((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Formatação do tempo para exibição
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumeric = ['occupants', 'avgEnergyBill', 'avgGasBill', 'contractedPower', 'yearsWithProvider', 'changeHistory'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const nextStep = () => {
        setStep(s => s + 1);
        // Scroll para o topo ao mudar de passo
        
    };

    const prevStep = () => {
        setStep(s => s - 1);
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);

        // Pequeno delay para melhor UX
        //await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const { score, priority } = calculateScore({ 
                ...formData, 
                visitedCalculator: true, 
                timeOnPage: activeTime 
            });

            const newLeadData: NewLeadData = {
                ...formData,
                occupants: Number(formData.occupants),
                avgEnergyBill: Number(formData.avgEnergyBill),
                avgGasBill: Number(formData.avgGasBill),
                contractedPower: Number(formData.contractedPower),
                yearsWithProvider: Number(formData.yearsWithProvider),
                changeHistory: Number(formData.changeHistory),
                score,
                priority,
                status: LeadStatus.NEW,
                contactHistory: [],
                visitedCalculator: true,
                timeOnPage: activeTime, // Usando o tempo ativo preciso
            };

            await onNewLead(newLeadData);
            setSubmitted(true);
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Erro ao enviar formulário. Tente novamente.');
        } finally {
            setIsCalculating(false);
        }
    };

    // Validação de email
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

   const isValidPhone = (phone: string) => {
    return true; // Aceita qualquer valor, mesmo vazio
};

    // Verificar se o passo atual é válido
    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.fullName.trim() !== '' && 
                       isValidEmail(formData.email) && 
                       isValidPhone(formData.phone) && 
                       formData.postalCode.trim() !== '';
            case 2:
                return formData.currentEnergyProvider !== '' && 
                       formData.currentGasProvider !== '';
            case 3:
                return formData.avgEnergyBill > 0 && 
                       formData.avgGasBill >= 0 && 
                       formData.contractedPower >= 1.15;
            default:
                return false;
        }
    };
    
    if (submitted) {
        return (
            <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-lg mx-auto">
                <CheckCircleIcon className="h-16 w-16 text-brand-green mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-dark">Obrigado!</h2>
                <p className="text-gray-600 mt-2">A sua simulação foi enviada com sucesso. Um dos nossos especialistas entrará em contacto em breve para apresentar a sua poupança.</p>
                <div className="mt-4 text-sm text-gray-500">
                    <p>Tempo no formulário: {formatTime(activeTime)}</p>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <UserIcon className="h-6 w-6" />
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputWithIcon 
                                Icon={UserIcon} 
                                name="fullName" 
                                placeholder="Nome Completo" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                required 
                                error={formData.fullName.trim() === '' && formData.fullName !== '' ? 'Nome é obrigatório' : undefined}
                            />
                            <InputWithIcon 
                                Icon={MailIcon} 
                                name="email" 
                                type="email" 
                                placeholder="exemplo@email.com" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                error={formData.email !== '' && !isValidEmail(formData.email) ? 'Email inválido' : undefined}
                            />
                            <InputWithIcon 
                                Icon={PhoneIcon} 
                                name="phone" 
                                type="tel" 
                                placeholder="912 345 678" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                                error={formData.phone !== '' && !isValidPhone(formData.phone) ? 'Telefone inválido' : undefined}
                            />
                            <InputWithIcon 
                                Icon={MapPinIcon} 
                                name="postalCode" 
                                placeholder="1000-001" 
                                value={formData.postalCode} 
                                onChange={handleChange} 
                                required 
                                error={formData.postalCode.trim() === '' && formData.postalCode !== '' ? 'Código postal é obrigatório' : undefined}
                            />
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <HomeIcon className="h-6 w-6" />
                            Sobre a sua Habitação
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectInput 
                                label="Tipo de Habitação" 
                                name="housingType" 
                                value={formData.housingType} 
                                onChange={handleChange} 
                                options={HousingTypeLabels} 
                                icon={<HomeIcon className="h-5 w-5" />}
                            />
                            <NumberInput 
                                label="Número de Ocupantes" 
                                name="occupants" 
                                value={formData.occupants} 
                                onChange={handleChange} 
                                min={1} 
                                max={10}
                                icon={<UserIcon className="h-5 w-5" />}
                            />
                            <SelectInput 
                                label="Fornecedor Atual (Energia)" 
                                name="currentEnergyProvider" 
                                value={formData.currentEnergyProvider} 
                                onChange={handleChange} 
                                options={providerOptionsMap} 
                                required
                                error={formData.currentEnergyProvider === '' ? 'Selecione um fornecedor' : undefined}
                                icon={<LightningIcon className="h-5 w-5" />}
                            />
                            <SelectInput 
                                label="Fornecedor Atual (Gás)" 
                                name="currentGasProvider" 
                                value={formData.currentGasProvider} 
                                onChange={handleChange} 
                                options={providerOptionsMap} 
                                required
                                error={formData.currentGasProvider === '' ? 'Selecione um fornecedor' : undefined}
                                icon={<ZapIcon className="h-5 w-5" />}
                            />
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                         <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <EuroIcon className="h-6 w-6" />
                            Dados de Consumo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NumberInput 
                                label="Fatura Média de Energia (€)" 
                                name="avgEnergyBill" 
                                value={formData.avgEnergyBill} 
                                onChange={handleChange} 
                                min={0} 
                                step={5}
                                icon={<LightningIcon className="h-5 w-5" />}
                                helpText="Valor mensal aproximado"
                            />
                            <NumberInput 
                                label="Fatura Média de Gás (€)" 
                                name="avgGasBill" 
                                value={formData.avgGasBill} 
                                onChange={handleChange} 
                                min={0} 
                                step={5}
                                icon={<ZapIcon className="h-5 w-5" />}
                                helpText="Deixe 0 se não tem gás"
                            />
                            <NumberInput 
                                label="Potência Contratada (kVA)" 
                                name="contractedPower" 
                                value={formData.contractedPower} 
                                onChange={handleChange} 
                                min={1.15} 
                                step={1.15}
                                icon={<LightningIcon className="h-5 w-5" />}
                                helpText="Encontre na sua fatura"
                            />
                            <SelectInput 
                                label="Tipo de Tarifa" 
                                name="tariffType" 
                                value={formData.tariffType} 
                                onChange={handleChange} 
                                options={TariffTypeLabels} 
                                icon={<ClockIcon className="h-5 w-5" />}
                            />
                            <NumberInput 
                                label="Anos com fornecedor atual" 
                                name="yearsWithProvider" 
                                value={formData.yearsWithProvider} 
                                onChange={handleChange} 
                                min={0} 
                                max={50}
                                icon={<ClockIcon className="h-5 w-5" />}
                            />
                            <NumberInput 
                                label="Nº de mudanças nos últimos 5 anos" 
                                name="changeHistory" 
                                value={formData.changeHistory} 
                                onChange={handleChange} 
                                min={0} 
                                max={10}
                                icon={<UserIcon className="h-5 w-5" />}
                                helpText="Quantas vezes mudou de fornecedor"
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-black bg-opacity-20 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-6">
                 <h2 className="text-3xl font-bold text-white">Simulação Inteligente</h2>
                 <p className="text-white text-opacity-80 mt-2">Preencha os campos para receber uma proposta personalizada.</p>
                 
                 {/* Indicador de tempo */}
                 <div className="mt-4 flex justify-center items-center gap-2 text-sm text-white text-opacity-70">
                    <ClockIcon className="h-4 w-4" />
                    <span>Tempo no formulário: {formatTime(activeTime)}</span>
                 </div>
            </div>

            {/* Progresso */}
            <div className="mb-6">
                <div className="flex justify-between items-center text-white mb-2">
                    <span className={`w-1/3 text-center text-sm ${step >= 1 ? 'font-bold text-brand-orange' : 'text-white text-opacity-60'}`}>
                        Dados Pessoais
                    </span>
                    <span className={`w-1/3 text-center text-sm ${step >= 2 ? 'font-bold text-brand-orange' : 'text-white text-opacity-60'}`}>
                        Habitação
                    </span>
                    <span className={`w-1/3 text-center text-sm ${step >= 3 ? 'font-bold text-brand-orange' : 'text-white text-opacity-60'}`}>
                        Consumo
                    </span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mt-2">
                    <div 
                        className="bg-gradient-to-r from-brand-orange to-brand-green h-3 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="min-h-[300px]">
                    {renderStep()}
                </div>

                <div className="flex justify-between items-center mt-8">
                    {step > 1 ? (
                        <button 
                            type="button" 
                            onClick={prevStep} 
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-white border-opacity-30"
                        >
                            Anterior
                        </button>
                    ) : (
                        <div></div>
                    )}
                    
                    {step < 3 ? (
                        <button 
                            type="button" 
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className={`font-bold py-3 px-8 rounded-full transition-all duration-300 ${
                                isStepValid() 
                                    ? 'bg-brand-orange hover:bg-orange-600 text-white transform hover:scale-105' 
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                        >
                            Próximo
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            disabled={!isStepValid() || isCalculating}
                            className={`font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2 ${
                                isStepValid() && !isCalculating
                                    ? 'bg-brand-green hover:bg-green-600 text-white transform hover:scale-105' 
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                        >
                            {isCalculating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Calculando...
                                </>
                            ) : (
                                <>
                                    <ZapIcon className="h-5 w-5" />
                                    Enviar Simulação
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

// Helper sub-components atualizados
interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon: React.FC<{className?: string}>;
    error?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({ Icon, error, ...props }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </span>
        <input 
            {...props} 
            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 transition-colors ${
                error 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-brand-orange focus:border-brand-orange'
            }`} 
        />
        {error && (
            <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
    </div>
);

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    helpText?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, icon, helpText, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            {icon}
            {label}
        </label>
        <input 
            type="number" 
            {...props} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-gray-800 transition-colors"
        />
        {helpText && (
            <p className="mt-1 text-xs text-white text-opacity-70">{helpText}</p>
        )}
    </div>
);

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Record<string, string>;
    icon?: React.ReactNode;
    error?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, icon, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            {icon}
            {label}
        </label>
        <select 
            {...props} 
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 transition-colors ${
                error 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-brand-orange focus:border-brand-orange'
            }`}
        >
            {props.required && <option value="">Selecione...</option>}
            {Object.entries(options).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
        {error && (
            <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
    </div>
);

export default LeadForm;

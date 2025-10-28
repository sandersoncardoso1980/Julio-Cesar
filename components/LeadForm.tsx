import React, { useState } from 'react';
import { NewLeadData, LeadStatus, HousingType, TariffType } from '../types';
import { useLeadScoring } from '../hooks/useLeadScoring';
import { CheckCircleIcon, UserIcon, EuroIcon, ZapIcon, PhoneIcon, MailIcon, MapPinIcon } from './Icons';

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
    const { calculateScore } = useLeadScoring();
    const startTime = useState(Date.now())[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumeric = ['occupants', 'avgEnergyBill', 'avgGasBill', 'contractedPower', 'yearsWithProvider', 'changeHistory'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        const { score, priority } = calculateScore({ ...formData, visitedCalculator: true, timeOnPage });

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
            timeOnPage,
        };

        onNewLead(newLeadData);
        setSubmitted(true);
    };
    
    if (submitted) {
        return (
            <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-lg mx-auto">
                <CheckCircleIcon className="h-16 w-16 text-brand-green mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-dark">Obrigado!</h2>
                <p className="text-gray-600 mt-2">A sua simulação foi enviada com sucesso. Um dos nossos especialistas entrará em contacto em breve para apresentar a sua poupança.</p>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-6">Dados Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputWithIcon Icon={UserIcon} name="fullName" placeholder="Nome Completo" value={formData.fullName} onChange={handleChange} required />
                            <InputWithIcon Icon={MailIcon} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <InputWithIcon Icon={PhoneIcon} name="phone" type="tel" placeholder="Telefone" value={formData.phone} onChange={handleChange} required />
                            <InputWithIcon Icon={MapPinIcon} name="postalCode" placeholder="Código Postal" value={formData.postalCode} onChange={handleChange} required />
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-6">Sobre a sua Habitação</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectInput label="Tipo de Habitação" name="housingType" value={formData.housingType} onChange={handleChange} options={Object.values(HousingType)} />
                            <NumberInput label="Número de Ocupantes" name="occupants" value={formData.occupants} onChange={handleChange} min={1} />
                            <SelectInput label="Fornecedor Atual (Energia)" name="currentEnergyProvider" value={formData.currentEnergyProvider} onChange={handleChange} options={['EDP', 'Galp', 'Endesa', 'Outro']} required/>
                            <SelectInput label="Fornecedor Atual (Gás)" name="currentGasProvider" value={formData.currentGasProvider} onChange={handleChange} options={['EDP', 'Galp', 'Endesa', 'Outro']} required/>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                         <h3 className="text-xl font-semibold text-white mb-6">Dados de Consumo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NumberInput label="Fatura Média de Energia (€)" name="avgEnergyBill" value={formData.avgEnergyBill} onChange={handleChange} min={0} step={5} />
                            <NumberInput label="Fatura Média de Gás (€)" name="avgGasBill" value={formData.avgGasBill} onChange={handleChange} min={0} step={5} />
                            <NumberInput label="Potência Contratada (kVA)" name="contractedPower" value={formData.contractedPower} onChange={handleChange} min={1.15} step={1.15} />
                            <SelectInput label="Tipo de Tarifa" name="tariffType" value={formData.tariffType} onChange={handleChange} options={Object.values(TariffType)} />
                            <NumberInput label="Anos com fornecedor atual" name="yearsWithProvider" value={formData.yearsWithProvider} onChange={handleChange} min={0} />
                            <NumberInput label="Nº de mudanças nos últimos 5 anos" name="changeHistory" value={formData.changeHistory} onChange={handleChange} min={0} />
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
            </div>
            <div className="mb-6">
                <div className="flex justify-between items-center text-white">
                    <span className={`w-1/3 text-center ${step >= 1 ? 'font-bold' : ''}`}>Pessoal</span>
                    <span className={`w-1/3 text-center ${step >= 2 ? 'font-bold' : ''}`}>Habitação</span>
                    <span className={`w-1/3 text-center ${step >= 3 ? 'font-bold' : ''}`}>Consumo</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
                    <div className="bg-brand-orange h-2 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="min-h-[200px]">
                    {renderStep()}
                </div>
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} className="bg-gray-200 hover:bg-gray-300 text-brand-dark font-bold py-2 px-6 rounded-full transition duration-300">Anterior</button>
                    ) : <div></div>}
                    {step < 3 ? (
                        <button type="button" onClick={nextStep} className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300">Próximo</button>
                    ) : (
                        <button type="submit" className="bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300">Enviar Simulação</button>
                    )}
                </div>
            </form>
        </div>
    );
};

// Helper sub-components
const InputWithIcon: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { Icon: React.FC<{className?:string}> }> = ({ Icon, ...props }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input {...props} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange text-gray-800" />
    </div>
);

const NumberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <input type="number" {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange text-gray-800" />
    </div>
);

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange text-gray-800">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default LeadForm;
import React from 'react';
import { Lead, AppSettings, NewLeadData } from '../types';
import { ZapIcon, EuroIcon, ChevronDownIcon, CheckCircleIcon, ShieldIcon, LockIcon, StarIcon, UserIcon } from './Icons';
import { FAQS, TESTIMONIALS } from '../constants';
import LeadForm from './LeadForm';

// --- Sub-components defined outside the main component ---

const Header: React.FC<{ onBackofficeClick: () => void }> = ({ onBackofficeClick }) => (
    <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                    <ZapIcon className="h-8 w-8 text-brand-green" />
                    <span className="text-xl sm:text-2xl font-bold text-brand-dark">LeadGenius Energia</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                     <button
                        onClick={onBackofficeClick}
                        className="p-2 text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Área do Vendedor"
                    >
                        <UserIcon className="h-6 w-6"/>
                    </button>
                    <a href="#simulacao" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-sm sm:text-base">
                        Simular Agora
                    </a>
                </div>
            </div>
        </div>
    </header>
);

const Hero: React.FC = () => (
    <section className="bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-tight">
                Poupe até <span className="text-brand-green">30%</span> na sua Fatura de Energia e Gás
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Descubra em menos de 2 minutos quanto pode economizar. Mudar é simples, rápido e gratuito.
            </p>
            <a href="#simulacao" className="mt-8 inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-xl text-lg transition duration-300 transform hover:scale-105">
                Faça a Simulação e Comece a Poupar
            </a>
        </div>
    </section>
);

const Calculator: React.FC<{savingsPercentage: number}> = ({ savingsPercentage }) => {
    const [bill, setBill] = React.useState(100);
    const savings = (bill * savingsPercentage * 12).toFixed(2); 

    return (
        <section id="calculadora" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">Calculadora de Poupança Interativa</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Arraste o slider para o valor médio da sua fatura mensal (luz + gás) e veja a sua poupança anual estimada.</p>
                <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <label htmlFor="bill-slider" className="text-lg font-medium text-gray-700">Fatura Mensal Média:</label>
                        <span className="text-2xl font-bold text-brand-blue">€{bill}</span>
                    </div>
                    <input
                        id="bill-slider"
                        type="range"
                        min="20"
                        max="500"
                        value={bill}
                        onChange={(e) => setBill(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-brand-blue"
                    />
                    <div className="mt-8 bg-green-100 border-l-4 border-brand-green p-6 rounded-r-lg">
                        <p className="text-lg text-green-800">Poupança Anual Estimada:</p>
                        <p className="text-4xl font-extrabold text-brand-green">€{savings}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ComparisonTable: React.FC<{ settings: AppSettings }> = ({ settings }) => (
    <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-dark text-center mb-10">Compare e Comprove</h2>
            <div className="overflow-x-auto">
                <table className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="bg-brand-blue text-white">
                            <th className="p-4 text-left font-semibold">Característica</th>
                            <th className="p-4 text-center font-semibold border-l border-blue-400">
                                <div className="flex items-center justify-center"><ZapIcon className="h-5 w-5 mr-2" /> {settings.ourPlan.name}</div>
                            </th>
                            {settings.competitors.map(c => <th key={c.name} className="p-4 text-center font-semibold border-l border-blue-400">{c.name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">Preço Energia (kWh)</td>
                            <td className="p-4 text-center font-bold text-brand-green">€{settings.ourPlan.energyPrice.toFixed(3)}</td>
                            {settings.competitors.map(c => <td key={c.name} className="p-4 text-center text-gray-600">€{c.energyPrice.toFixed(3)}</td>)}
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">Preço Gás (m³)</td>
                            <td className="p-4 text-center font-bold text-brand-green">€{settings.ourPlan.gasPrice.toFixed(3)}</td>
                             {settings.competitors.map(c => <td key={c.name} className="p-4 text-center text-gray-600">€{c.gasPrice.toFixed(3)}</td>)}
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">Adesão Online</td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">Sem Fidelização</td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-gray-300 mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-brand-green mx-auto" /></td>
                            <td className="p-4 text-center"><CheckCircleIcon className="h-6 w-6 text-gray-300 mx-auto" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);


const TrustBadges: React.FC = () => (
    <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-gray-500 font-semibold mb-8">Confiança e Segurança Garantidas</h3>
            <div className="flex justify-around items-start max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center text-gray-600 w-1/3 px-1">
                    <ShieldIcon className="h-10 w-10 sm:h-12 sm:w-12 text-brand-blue opacity-75 mb-2"/>
                    <p className="text-xs sm:text-sm font-medium">Regulado pela ERSE</p>
                </div>
                <div className="flex flex-col items-center text-center text-gray-600 w-1/3 px-1">
                    <LockIcon className="h-10 w-10 sm:h-12 sm:w-12 text-brand-blue opacity-75 mb-2"/>
                    <p className="text-xs sm:text-sm font-medium">Pagamento Seguro</p>
                </div>
                <div className="flex flex-col items-center text-center text-gray-600 w-1/3 px-1">
                   <StarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-brand-blue opacity-75 mb-2"/>
                    <p className="text-xs sm:text-sm font-medium">Satisfação Garantida</p>
                </div>
            </div>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-dark text-center mb-10">O que os Nossos Clientes Dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <p className="text-gray-600 mb-6 relative">
                          <span className="absolute -top-4 -left-4 text-6xl text-brand-blue opacity-10">“</span>
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center">
                            <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4"/>
                            <div>
                                <p className="font-bold text-brand-dark">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <h2 className="text-3xl font-bold text-brand-dark text-center mb-10">Perguntas Frequentes</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100">
                                <span>{faq.question}</span>
                                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} />
                            </button>
                            {openIndex === index && (
                                <div className="p-5 bg-white text-gray-600">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const Footer: React.FC = () => (
    <footer className="bg-brand-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} LeadGenius Energia. Todos os direitos reservados.</p>
            <p className="mt-2 text-gray-400">Uma solução inovadora para a gestão de leads no setor energético.</p>
        </div>
    </footer>
);


// --- Main LandingPage Component ---

interface LandingPageProps {
    onNewLead: (lead: NewLeadData) => void;
    onBackofficeClick: () => void;
    settings: AppSettings;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNewLead, onBackofficeClick, settings }) => {
    return (
        <div className="bg-brand-light">
            <Header onBackofficeClick={onBackofficeClick} />
            <main>
                <Hero />
                <Calculator savingsPercentage={settings.landingPageSavingsPercentage} />
                <ComparisonTable settings={settings} />
                <section id="simulacao" className="py-16 bg-brand-blue">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <LeadForm onNewLead={onNewLead} />
                    </div>
                </section>
                <TestimonialsSection />
                <TrustBadges />
                <FaqSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
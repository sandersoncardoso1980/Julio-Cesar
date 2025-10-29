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
                        <p className="text-xs text-gray-500 mt-4 italic max-w-md mx-auto leading-relaxed">
    <strong>Nota:</strong> A <em>Poupança Anual Estimada</em> é meramente indicativa e baseia-se numa percentagem média de poupança. 
    Cada fornecedor utiliza os seus próprios parâmetros de cálculo, como o número de moradores, o consumo mensal real, 
    a potência contratada, tarifas horárias e outros fatores. O valor final pode variar.
</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
const PartnersSection: React.FC = () => {
    const partners = [
        { name: 'Galp', src: '/assets/partners/galp.png' },
        { name: 'Plenitude', src: '/assets/partners/plenitude.png' },
        { name: 'Endesa', src: '/assets/partners/endesa.png' },
        { name: 'Energia', src: '/assets/partners/energia.png' },
        { name: 'Repsol', src: '/assets/partners/repsol.jpeg' },
        { name: 'Audax', src: '/assets/partners/audax.jpeg' },
        { name: 'Iberdrola', src: '/assets/partners/iberdrola.jpg' },
        { name: 'Yes Energy', src: '/assets/partners/yes.png' },
        { name: 'EDP', src: '/assets/partners/edp.jpeg' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-dark text-center mb-10">
                    Nossos Parceiros no Setor Energético
                </h2>

                {/* Grid com responsividade + dicas aplicadas */}
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 items-center justify-items-center 
                                opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="flex items-center justify-center p-4 bg-gray-50 rounded-lg 
                                       shadow-sm hover:shadow-md transition-shadow duration-300"
                            title={partner.name}
                        >
                            <img
                                src={partner.src}
                                alt={`Logo ${partner.name}`}
                                className="h-12 w-auto object-contain 
                                           transition-transform duration-300 ease-out
                                           hover:scale-150" // ← ZOOM AQUI!
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
                    Trabalhamos com as principais empresas do mercado para garantir a melhor oferta para si.
                </p>
            </div>
        </section>
    );
};



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

const ValuePropositionSection: React.FC = () => {
    const benefits = [
        {
            icon: <ZapIcon className="h-8 w-8 text-brand-green" />,
            title: "Análise Personalizada",
            desc: "Estudamos o seu consumo real e comparamos todas as tarifas do mercado."
        },
        {
            icon: <ShieldIcon className="h-8 w-8 text-brand-green" />,
            title: "100% Imparcial",
            desc: "Somos parceiros de todas as empresas. Escolhemos a melhor para si, sem comissões ocultas."
        },
        {
            icon: <EuroIcon className="h-8 w-8 text-brand-green" />,
            title: "Sem Custos, Sem Fidelização",
            desc: "Mudança gratuita. Pode sair quando quiser. Zero riscos."
        },
        {
            icon: <CheckCircleIcon className="h-8 w-8 text-brand-green" />,
            title: "Tudo Online em 2 Minutos",
            desc: "Simule, escolha e adira sem sair de casa. Nós tratamos do resto."
        }
    ];

    return (
        <section className="py-16 bg-brand-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4">
                    Porquê Escolher o Nosso Serviço?
                </h2>
                <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                    Não vendemos um plano. <strong>Vendemos poupança.</strong> Analisamos <em>todas</em> as opções e entregamos a melhor para si.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 
                group-hover:bg-blue-100 group-hover:bg-opacity-90 
                transition-all duration-300">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="#simulacao"
                        className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-xl text-lg transition duration-300 transform hover:scale-105"
                    >
                        Simule Grátis e Descubra a Sua Poupança
                    </a>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto italic">
                    <strong>Nota:</strong> Trabalhamos com <strong>Galp, EDP, Iberdrola, Endesa, Repsol, Audax, Plenitude, Yes Energy</strong> e outras. 
                    A melhor oferta é sempre a que mais poupa <em>no seu caso específico</em>.
                </p>
            </div>
        </section>
    );
};


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
    <PartnersSection /> {/* ← Aqui os parceiros, logo após o Hero */}
    <ValuePropositionSection />
    <Calculator savingsPercentage={settings.landingPageSavingsPercentage} />
    
    
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
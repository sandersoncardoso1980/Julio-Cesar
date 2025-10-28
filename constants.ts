import { Lead, Competitor, FaqItem, Testimonial, LeadStatus, Priority, HousingType, TariffType } from './types';

export const INITIAL_COMPETITORS: Competitor[] = [
    { name: 'EDP', logoUrl: 'https://via.placeholder.com/100x40?text=EDP', energyPrice: 0.16, gasPrice: 0.08 },
    { name: 'Galp', logoUrl: 'https://via.placeholder.com/100x40?text=Galp', energyPrice: 0.17, gasPrice: 0.09 },
    { name: 'Endesa', logoUrl: 'https://via.placeholder.com/100x40?text=Endesa', energyPrice: 0.155, gasPrice: 0.085 },
];

export const INITIAL_OUR_PLAN = {
    name: 'LeadGenius Energia',
    energyPrice: 0.14, // 15-20% cheaper
    gasPrice: 0.07,
};

export const LANDING_PAGE_SAVINGS_PERCENTAGE = 0.22; // 22% average saving

export const FAQS: FaqItem[] = [
    {
        question: 'A mudança de fornecedor tem custos?',
        answer: 'Não, a mudança de comercializador de energia é um processo totalmente gratuito e não implica qualquer alteração na sua instalação ou contador.'
    },
    {
        question: 'Vou ficar sem luz ou gás durante a mudança?',
        answer: 'Não haverá qualquer interrupção no fornecimento de energia. O processo é puramente administrativo e transparente para o consumidor.'
    },
    {
        question: 'Quanto tempo demora o processo de mudança?',
        answer: 'Normalmente, o processo de mudança de comercializador demora entre 1 a 3 semanas a ser concluído, sem que precise de se preocupar com nada.'
    },
    {
        question: 'Preciso de mudar o contador?',
        answer: 'Não é necessária qualquer alteração técnica na sua casa. O seu contador e a sua instalação elétrica e de gás permanecem exatamente os mesmos.'
    }
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: 'O processo foi incrivelmente rápido e fácil. Estou a poupar mais de 25€ por mês na minha fatura de eletricidade. Recomendo vivamente!',
        name: 'Ana Silva',
        location: 'Lisboa',
        avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    {
        quote: 'Finalmente uma empresa que explica tudo de forma clara. A calculadora de poupança foi muito precisa e o apoio ao cliente 5 estrelas.',
        name: 'João Martins',
        location: 'Porto',
        avatarUrl: 'https://i.pravatar.cc/150?img=3'
    },
    {
        quote: 'Estava hesitante em mudar, mas a equipa da LeadGenius tornou tudo simples. A poupança é real e comecei a ver a diferença logo na primeira fatura.',
        name: 'Sofia Costa',
        location: 'Faro',
        avatarUrl: 'https://i.pravatar.cc/150?img=5'
    }
];

export const MOCK_LEADS: Lead[] = [
    {
        id: '1',
        fullName: 'Carlos Mendes',
        email: 'carlos.mendes@example.com',
        phone: '912345678',
        postalCode: '1000-001 Lisboa',
        housingType: HousingType.APARTMENT,
        occupants: 2,
        currentEnergyProvider: 'EDP',
        currentGasProvider: 'Galp',
        avgEnergyBill: 85,
        avgGasBill: 40,
        contractedPower: 6.9,
        tariffType: TariffType.BI_HOURLY,
        score: 92,
        status: LeadStatus.NEW,
        priority: Priority.HIGH,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        visitedCalculator: true, timeOnPage: 185, yearsWithProvider: 3, changeHistory: 0,
        contactHistory: [],
    },
    {
        id: '2',
        fullName: 'Beatriz Almeida',
        email: 'beatriz.almeida@example.com',
        phone: '923456789',
        postalCode: '4000-002 Porto',
        housingType: HousingType.APARTMENT,
        occupants: 3,
        currentEnergyProvider: 'Endesa',
        currentGasProvider: 'Endesa',
        avgEnergyBill: 110,
        avgGasBill: 50,
        contractedPower: 4.6,
        tariffType: TariffType.SIMPLE,
        score: 75,
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        visitedCalculator: true, timeOnPage: 110, yearsWithProvider: 1, changeHistory: 2,
        contactHistory: [],
    },
    {
        id: '3',
        fullName: 'Diogo Ferreira',
        email: 'diogo.ferreira@example.com',
        phone: '934567890',
        postalCode: '3000-003 Coimbra',
        housingType: HousingType.HOUSE,
        occupants: 4,
        currentEnergyProvider: 'Galp',
        currentGasProvider: 'Galp',
        avgEnergyBill: 150,
        avgGasBill: 70,
        contractedPower: 10.35,
        tariffType: TariffType.SIMPLE,
        score: 88,
        status: LeadStatus.CONTACTED,
        priority: Priority.HIGH,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        visitedCalculator: true, timeOnPage: 250, yearsWithProvider: 5, changeHistory: 0,
        contactHistory: [{ id: 'c1', date: new Date().toISOString(), type: 'call', notes: 'Primeiro contacto realizado. Mostrou interesse.' }],
    },
    {
        id: '4',
        fullName: 'Inês Sousa',
        email: 'ines.sousa@example.com',
        phone: '965432109',
        postalCode: '8000-004 Faro',
        housingType: HousingType.HOUSE,
        occupants: 5,
        currentEnergyProvider: 'EDP',
        currentGasProvider: 'EDP',
        avgEnergyBill: 45,
        avgGasBill: 20,
        contractedPower: 3.45,
        tariffType: TariffType.SIMPLE,
        score: 35,
        status: LeadStatus.NURTURING,
        priority: Priority.LOW,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        visitedCalculator: false, timeOnPage: 45, yearsWithProvider: 2, changeHistory: 1,
        contactHistory: [],
    },
];

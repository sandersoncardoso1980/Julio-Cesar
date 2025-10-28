import { Competitor, FaqItem, Testimonial } from './types';

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

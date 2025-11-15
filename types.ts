export enum HousingType {
    APARTMENT = 'APARTMENT',
    HOUSE = 'HOUSE',
}

export enum TariffType {
    SIMPLE = 'SIMPLE',
    BI_HOURLY = 'BI_HOURLY',
    TRI_HOURLY = 'TRI_HOURLY',
}

export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    SCHEDULED = 'SCHEDULED',
    CONVERTED = 'CONVERTED',
    NURTURING = 'NURTURING',
}

export enum Priority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}

export interface ContactHistoryEntry { // ← CORRIGIDO o nome
    id: string;
    date: string;
    notes: string;
    type: 'call' | 'email' | 'visit';
}

export interface Lead {
    id: string;
    // Personal Data
    fullName: string;
    email: string;
    phone: string;
    postalCode: string;
    housingType: HousingType;
    occupants: number;
    // Consumption Data
    currentEnergyProvider: string;
    currentGasProvider: string;
    avgEnergyBill: number;
    avgGasBill: number;
    contractedPower: number;
    tariffType: TariffType;
    // Additional fields from form
    yearsWithProvider: number; // ← MOVIDO para ficar junto com outros dados
    changeHistory: number; // ← MOVIDO para ficar junto com outros dados
    // Internal Data
    score: number;
    status: LeadStatus;
    priority: Priority;
    contactHistory: ContactHistoryEntry[]; // ← CORRIGIDO o tipo
    createdAt: string;
    // Engagement Data (for scoring)
    visitedCalculator: boolean;
    timeOnPage: number; // in seconds
}

// Para novos leads, incluir todos os campos exceto id e createdAt
export type NewLeadData = Omit<Lead, 'id' | 'createdAt'>;

export interface Competitor {
    name: string;
    logoUrl: string;
    energyPrice: number; // price per kWh
    gasPrice: number; // price per m³
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    location: string;
    avatarUrl: string;
}

export interface AppSettings {
    ourPlan: {
        name: string;
        energyPrice: number;
        gasPrice: number;
    };
    competitors: Competitor[];
    landingPageSavingsPercentage: number;
}

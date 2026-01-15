export type Profile = {
    id: string;
    role: 'admin' | 'editor' | 'agent';
    full_name: string;
    avatar_url?: string;
    email: string;
};

export type PropertyStatus = 'captado' | 'visitado' | 'vendido' | 'financiado' | 'en_tramite';

export type Property = {
    id: string;
    title: string;
    address: string;
    price: number;
    status: PropertyStatus;
    agent_id: string;
    owner_name: string;
    created_at: string;
    image_url?: string;
    // Joins
    agent?: Profile;
};

export type Transaction = {
    id: string;
    property_id: string;
    buyer_name: string;
    final_price: number;
    commission_amount: number;
    notary_name: string;
    surveyor_name: string;
    signature_date: string;
    status: 'pendiente' | 'completado' | 'cancelado';
    property?: Property;
};

export type Expense = {
    id: string;
    description: string;
    amount: number;
    category: 'marketing' | 'operativo' | 'personal' | 'otros';
    linked_property_id?: string;
    created_at: string;
};

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
export type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
};

export type PropertyActivity = {
    id: string;
    property_id: string;
    performed_by?: string;
    type: string;
    notes: string;
    created_at: string;
};

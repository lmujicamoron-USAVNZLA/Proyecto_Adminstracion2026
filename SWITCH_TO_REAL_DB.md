# 🔄 How to Switch from Mock Data to Real Database

Currently, the application is using **Mock Data** (simulated data) in `src/pages/Properties/PropertyList.tsx` and other files.
Follow these steps when you are ready to connect a real Supabase database.

## 1. Credentials Setup
Create a file named `.env` in the root folder (`inmo-crm`) and add your keys:
```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Update `PropertyList.tsx`
Open `src/pages/Properties/PropertyList.tsx`.

**Remove Mock Data:**
```typescript
// DELETE THIS SECTION
const MOCK_PROPERTIES: Property[] = [ ... ];
```

**Add Supabase Fetching:**
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const PropertyList = () => {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        getProperties();
    }, []);

    async function getProperties() {
        const { data, error } = await supabase
            .from('properties')
            .select('*');
        
        if (data) setProperties(data);
    }

    // Replace MOCK_PROPERTIES.map with properties.map in the JSX
    // ...
}
```

## 3. Update `Dashboard.tsx`
Similar to above, replace the static `data` array with a `useEffect` that fetches sales data from your `transactions` table.

## 4. Verification
Once these changes are made, the app will read directly from your database. If the database is empty, the screens will be empty until you add data via Supabase dashboard or the app forms.

import { createContext, useContext } from 'react';
import { Schema } from '../core/schema/schema';

export interface SchemaContext {
    schema: Schema;
}

export const SchemaContext = createContext<SchemaContext | null>(null);

export function SchemaContextProvider({ children, schema }: { children: React.ReactNode; schema: Schema }) {
    return <SchemaContext.Provider value={{ schema }}>{children}</SchemaContext.Provider>;
}

export function useSchemaContext(): SchemaContext {
    const schemaContext = useContext(SchemaContext);
    if (!schemaContext) {
        throw new Error('useSchemaContext must be used in SchemaContextProvider');
    }

    return schemaContext;
}

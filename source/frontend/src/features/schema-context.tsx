import { createContext, useContext } from 'react';
import { Schema } from '../core/schema/schema';
import { Transformation } from '../core/schema/transform/transformations/transformation';

export interface SchemaContext {
    schema: Schema;
    updateSchema: (transformations: Transformation[]) => void;
}

export const SchemaContext = createContext<SchemaContext | null>(null);

export function SchemaContextProvider({
    children,
    schema,
    updateSchema,
}: {
    children: React.ReactNode;
    schema: Schema;
    updateSchema: (transformations: Transformation[]) => void;
}) {
    return <SchemaContext.Provider value={{ schema, updateSchema }}>{children}</SchemaContext.Provider>;
}

export function useSchemaContext(): SchemaContext {
    const context = useContext(SchemaContext);
    if (!context) {
        throw new Error('useSchemaContext must be used in SchemaContextProvider');
    }

    return context;
}

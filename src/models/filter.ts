export type Filter = {
    id: string | null;
    condition: string | null;
    value: string | null;
}


export const createEmptyFilter = (): Filter => {
    return {
        id: null,
        condition: null,
        value: null
    }
}

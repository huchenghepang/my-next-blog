export interface CategoryInfo {
    id: number; name: string; parent_id: number | null
}

export type CategoryList = CategoryInfo[]


interface CategoryInfo{
    id: number;
    name: string;
    parent_id: number | null;
    level: number;
    slug: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}

export type CategoryRows = CategoryInfo[]
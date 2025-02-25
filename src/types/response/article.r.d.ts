export interface ArticleInfoResponse {
    reading: number;
    id: number;
    category_id: number;
    comment_count: number;
    create_time: Date;
    is_archive: boolean;
    name: string;
    updated_time: null;
    note_tags: NoteTag[];
    article_categories: ArticleCategories;
    comments: any[];
}

export interface ArticleCategories {
    id: number;
    level: number;
    name: string;
}

export interface NoteTag {
    tags: Tags;
}

export interface Tags {
    id: number;
    name: string;
}

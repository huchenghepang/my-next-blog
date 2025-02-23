export interface CreateArticleParams {
    title: string;
    createdAt: Date;
    category: number;
    tags: string[];
    content: string;
    summary:string;
    directory: Directory[];
    isArchived:boolean
}

export interface Directory {
    text: string;
    level: number;
    line: number;
}

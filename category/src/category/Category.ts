export type Category = {
    id: string;
    name: string;
    description: string;
    imageBytes: Uint8Array;
    tags: string[];
    createdAt: number;
    updatedAt: number;
};
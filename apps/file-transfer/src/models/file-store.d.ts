export type StoredFile = {
    storedName: string;
    size: number;
    uploadedAt: string;
};
export declare class FileStore {
    private readonly dir;
    constructor(dir: string);
    get rootDir(): string;
    list(): StoredFile[];
    resolve(name: string): string | null;
    exists(name: string): boolean;
    delete(name: string): boolean;
}
//# sourceMappingURL=file-store.d.ts.map
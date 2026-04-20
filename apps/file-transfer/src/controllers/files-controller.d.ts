import type { Request, Response } from 'express';
import type { Server } from 'socket.io';
import { FileStore } from '../models/file-store';
export type UploadedFile = {
    originalName: string;
    storedName: string;
    size: number;
    uploadedAt: string;
};
type FilenameParams = {
    filename: string;
};
export declare class FilesController {
    private readonly store;
    private readonly io;
    constructor(store: FileStore, io: Server);
    list: (_req: Request, res: Response) => void;
    upload: (req: Request, res: Response) => void;
    download: (req: Request<FilenameParams>, res: Response) => void;
    preview: (req: Request<FilenameParams>, res: Response) => void;
    remove: (req: Request<FilenameParams>, res: Response) => void;
}
export {};
//# sourceMappingURL=files-controller.d.ts.map
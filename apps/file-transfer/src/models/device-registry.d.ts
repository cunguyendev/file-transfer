export type DeviceInfo = {
    id: string;
    ip: string;
    userAgent: string;
    connectedAt: string;
};
export declare class DeviceRegistry {
    private readonly devices;
    add(info: DeviceInfo): void;
    remove(id: string): void;
    list(): DeviceInfo[];
}
//# sourceMappingURL=device-registry.d.ts.map
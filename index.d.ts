export default backloop;
declare function backloop(hostname?: string, port?: number): {
    name: string;
    apply: ConfigEnv;
    config(options: UserConfigExport): void;
};
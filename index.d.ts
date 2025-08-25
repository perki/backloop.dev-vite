export default backloop;
declare function backloop(hostname?: string): {
    name: string;
    apply: string;
    config(options: any): void;
};
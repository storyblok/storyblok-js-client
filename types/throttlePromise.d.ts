import { ThrottleFn } from './interfaces';
declare type Queue = {
    resolve: (args: any) => any;
    reject: (args: any) => any;
    args: any[];
    self: any;
};
interface IThrottle {
    abort: () => any;
    (args: []): Promise<Queue>;
    name: string;
    AbortError?: () => void;
}
declare function throttledQueue(fn: ThrottleFn, limit: number, interval: number): IThrottle;
export default throttledQueue;

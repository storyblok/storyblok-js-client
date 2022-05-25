interface IParam extends Object {
    [key: string]: any;
}
export declare class Helpers {
    /**
        * @method stringify
        * @param  {Object} obj
        * @param  {String} prefix
        * @param  {Boolean} isArray
        * @return {String} Stringified object
        */
    stringify(obj: IParam, prefix?: string, isArray?: boolean): string;
}
export {};

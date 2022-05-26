interface IParams extends Object {
    [key: string]: any;
}
export declare class SbHelpers {
    /**
        * @method stringify
        * @param  {Object} params
        * @param  {String} prefix
        * @param  {Boolean} isArray
        * @return {String} Stringified object
        */
    stringify(params: IParams, prefix?: string, isArray?: boolean): string;
}
export {};

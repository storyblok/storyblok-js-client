import { ISchema, IRichtext } from './interfaces';
interface ITag extends Element {
    [key: string]: any;
}
declare class RichTextResolver {
    private marks;
    private nodes;
    constructor(schema?: ISchema);
    addNode(key: string, schema: ISchema): void;
    addMark(key: string, schema: ISchema): void;
    render(data?: IRichtext): string;
    renderNode(item: IRichtext): string;
    renderTag(tags: ITag[], ending: string): string;
    renderOpeningTag(tags: ITag[]): string;
    renderClosingTag(tags: ITag[]): string;
    getMatchingNode(item: IRichtext): any;
    getMatchingMark(item: IRichtext): any;
}
export default RichTextResolver;

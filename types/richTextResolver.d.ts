import { ISbSchema, ISbRichtext } from './interfaces';
declare class RichTextResolver {
    private marks;
    private nodes;
    constructor(schema?: ISbSchema);
    addNode(key: string, schema: ISbSchema): void;
    addMark(key: string, schema: ISbSchema): void;
    render(data?: ISbRichtext): string;
    private renderNode;
    private renderTag;
    private renderOpeningTag;
    private renderClosingTag;
    private getMatchingNode;
    private getMatchingMark;
}
export default RichTextResolver;

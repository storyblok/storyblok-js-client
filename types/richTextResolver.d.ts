import { ISchema, IRichtext } from './interfaces';
declare class RichTextResolver {
    private marks;
    private nodes;
    constructor(schema?: ISchema);
    addNode(key: string, schema: ISchema): void;
    addMark(key: string, schema: ISchema): void;
    render(data?: IRichtext): string;
    private renderNode;
    private renderTag;
    private renderOpeningTag;
    private renderClosingTag;
    private getMatchingNode;
    private getMatchingMark;
}
export default RichTextResolver;

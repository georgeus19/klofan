import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showEntityToLiteralDiagramHelp(help: Help) {
    return help.showHelp(
        <TextContent>
            Drag mouse from source node handles to target node handles to create a property between
            source entity and target literal.
        </TextContent>
    );
}

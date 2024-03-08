import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showEntityToEntityDiagramHelp(help: Help) {
    return help.showHelp(
        <TextContent>
            Drag mouse from source node handles to target node handles to create a property between
            corresponding entities.
        </TextContent>
    );
}

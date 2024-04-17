import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showUpdateEntitiesUrisHelp(help: Help) {
    help.showHelp(
        <TextContent>
            Create pattern for computing URIs of entities. The values in input are concatenated from
            top to bottom to create final URIs. The inputs can be dragged to change ordering.
            <br></br>
            <br></br>
            Pattern consists of either literal values or string provided by user. If a property has
            multiple literals they are joined by '-'. Spaces in literal are joined by '_'.
            <br></br>
            <br></br>
            Below, you can the final URIs.
        </TextContent>
    );
}

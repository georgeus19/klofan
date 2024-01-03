import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showUpdateEntityInstancesUrisHelp(help: Help) {
    help.showHelp(
        <TextContent>
            Create rules/mappings for assigning uris to instances of chosen entity.
            <br></br>
            Below can be seen instances which did not match any rule/mapping.
        </TextContent>
    );
}

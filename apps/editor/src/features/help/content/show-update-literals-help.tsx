import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showUpdateLiteralsHelp(help: Help) {
    help.showHelp(
        <TextContent>
            Update property literals. Either put language or type to all literals or select Pattern
            option.
            <br></br>
            <br></br>
            Pattern allows you to write Match and Replacement pattern to also change the values. The
            pattern must be Javascript Regexp strings. The replacement typically uses references
            ($1, $2) to point to matched string in brackets=(). Only matched literals are changed.
        </TextContent>
    );
}

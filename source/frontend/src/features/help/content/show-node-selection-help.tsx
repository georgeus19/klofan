import { Help } from '../use-help';
import { TextContent } from './text-content';

export function showNodeSelectionHelp(help: Help) {
    help.showHelp(<TextContent>Select a node in the diagram.</TextContent>);
}

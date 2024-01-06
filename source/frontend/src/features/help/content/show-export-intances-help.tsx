import { Help } from '../use-help';

export function showExportInstancesHelp(help: Help) {
    return help.showHelp(
        <div>
            Instance uris are generally dependent on their counterpart in schema. Either set entity or property uris explicitly or the default will be
            used. The default for entity (and their instances) is to use blank nodes. Properties have default uris.
            <b>Invalid uris are used as they are. It is user's responsibility to provide functional uris.</b> Uri based on entity or property looks
            like:
            <div className='text-center font-bold'>[entityUri/propertyUri]/[instanceIndex]</div>
            The default property uri assignment looks like:
            <div className='text-center font-bold'>[defaultPropertyUri]/[internalPropertyId]</div>
            Entity instance uris in addition can be set explicitly without relying on entity uris. Explicit uris are always preferred to derived uris
            (or nonexistent uris - blank nodes) in the export algorithm.
        </div>
    );
}

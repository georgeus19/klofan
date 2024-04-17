import { Help } from '../use-help';

export function showExportInstancesHelp(help: Help) {
    return help.showHelp(
        <div>
            Instance uris are generally dependent on their counterpart in schema. Either set entity
            set or property set uris explicitly or the default will be used. The default for entity
            set (and their instances) is to use blank nodes. Property sets have default uris.
            <b>
                Invalid uris are used as they are. It is user's responsibility to provide functional
                uris.
            </b>{' '}
            Uri based on entity set or property set looks like:
            <div className='text-center font-bold'>
                [entitySetUri/propertySetUri]/[instanceIndex]
            </div>
            The default property uri assignment looks like:
            <div className='text-center font-bold'>
                [defaultPropertySetUri]/[internalPropertySetId]
            </div>
            Entity uris in addition can be set explicitly without relying on entity set uris.
            Explicit uris are always preferred to derived uris (or nonexistent uris - blank nodes)
            in the export algorithm.
        </div>
    );
}

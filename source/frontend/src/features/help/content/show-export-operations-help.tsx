import { Help } from '../use-help';

export function showExportOperationsHelp(help: Help) {
    return help.showHelp(
        <div>
            <div>
                User operations can saved and reused. Any operations that change the imported data is called data transformations. These
                transformations can be exported alone so they can be applied on data with the same structure e.g. using console app. The use case is
                to import a portion of data and then run transformations on the whole if the data are large - in that case do not use manual versions
                of transformations (e.g. move property transformation).
            </div>
            <div>
                Other operations serve to preserve the state of the application. If all options are selected, the progress can be loaded with no
                changes with even undo/redo fully functional.
            </div>
            <div>Operations are always taken from the last import that resetted loaded data. Or from the beginning if no import happened.</div>
        </div>
    );
}

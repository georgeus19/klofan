import 'reactflow/dist/style.css';
import { ManualActionsPane } from '../manual-actions-pane/manual-actions-pane';
import { Help } from '../help/help';
import { EditorContextProvider } from './editor-context';
import { Diagram } from '../diagram/diagram';
import { RecommendationsPane } from '../recommendations/recommendations-pane';
import { RecommendationsContextProvider } from '../recommendations/recommendations-context';
import { ManualActionsSelect } from '../manual-actions-select/manual-actions-select.tsx';
import { RecommendationsErrorBoundary } from '../recommendations/error/recommendations-error-boundary.tsx';
import { EditorErrorBoundary } from './error/editor-error-boundary.tsx';

/**
 * Component holding all editor functionality.
 * @see EditorContextProvider which contains editor logic in hook and passes it down using react context.
 */
export default function Editor() {
    return (
        <EditorContextProvider>
            <RecommendationsContextProvider>
                <div className='grow flex'>
                    <RecommendationsErrorBoundary>
                        <RecommendationsPane className='w-96 relative'></RecommendationsPane>
                    </RecommendationsErrorBoundary>
                    <EditorErrorBoundary>
                        <div className='grow bg-blue-50 flex flex-col z-0'>
                            <ManualActionsSelect></ManualActionsSelect>
                            <Diagram className='bg-slate-100 grow z-0'></Diagram>
                        </div>
                        <ManualActionsPane></ManualActionsPane>
                        <Help className='absolute top-10 right-96 m-1 w-96'></Help>
                    </EditorErrorBoundary>
                </div>
            </RecommendationsContextProvider>
        </EditorContextProvider>
    );
}

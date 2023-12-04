export interface EntityInstanceToLiteralInstanceDiagramHelpContent {
    type: 'entity-instance-to-literal-instance-diagram-content';
}

export function EntityInstanceToLiteralInstanceDiagramHelp() {
    return (
        <div>
            Drag mouse from source node handles to target node handles to create a property instance between source entity instance and target
            literal.
        </div>
    );
}

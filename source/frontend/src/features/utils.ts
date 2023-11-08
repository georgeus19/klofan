import { Position, Node as ReactFlowNode } from 'reactflow';
// Code taken from examples on react flow example page - https://reactflow.dev/examples/edges/floating-edges

interface Point {
    x: number;
    y: number;
}

const defaultWidth = 10;
const defaultHeight = 10;
const defaultX = 0;
const defaultY = 0;

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: ReactFlowNode, targetNode: ReactFlowNode): Point {
    // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
    const { width: intersectionNodeWidth, height: intersectionNodeHeight, positionAbsolute: intersectionNodePosition } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;

    const w = (intersectionNodeWidth ?? defaultWidth) / 2;
    const h = (intersectionNodeHeight ?? defaultHeight) / 2;

    const x2 = (intersectionNodePosition?.x ?? defaultX) + w;
    const y2 = (intersectionNodePosition?.y ?? defaultY) + h;
    const x1 = (targetPosition?.x ?? defaultX) + (targetNode.width ?? defaultWidth) / 2;
    const y1 = (targetPosition?.y ?? defaultY) + (targetNode.height ?? defaultHeight) / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: ReactFlowNode, intersectionPoint: Point) {
    const n = { ...node, ...node.positionAbsolute };
    const nx = Math.round(n.x ?? defaultX);
    const ny = Math.round(n.y ?? defaultY);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + (n.width ?? defaultWidth) - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    // Originally n.y ??? instead of ny
    if (py >= ny + (n.height ?? defaultHeight) - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: ReactFlowNode, target: ReactFlowNode) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

import { v4 as uuid } from 'uuid'
import {
    TreeNode,
    TreeViewValue,
    TreeRootNode,
    TreeNodeSelectionState,
    TreeLeafNode,
    TreeAnyNode,
    TreeNotRootNode,
    NodeId,
    TreeNotLeafNode,
    TreeLike,
    TreeLikeLeafNode,
} from './types'

export function parseToRoot<T extends TreeViewValue>({
    userNodes,
    childrenField,
}: {
    userNodes: T[] | undefined,
    childrenField: string
}): TreeRootNode<T> {
    const root: TreeRootNode<T> = {
        nodeId: `__root-node__`,
        children: []
    }

    if (!userNodes?.length) {
        return root
    }

    const parse = (value: T, parent: TreeNotLeafNode<T>, depth: number = 0): TreeNotRootNode<T> => {
        const children = value[childrenField] ?? []

        const isLeaf = !children.length

        const node: any = {
            ...value,
            nodeId: value.nodeId || uuid(),
            parent,
            depth,
        }

        if (isLeaf) {
            delete node.children
        } else {
            node.children = children.map((child: T) => parse(child, node, depth + 1)) ?? []
        }


        return isLeaf ? node as TreeLeafNode<T> : node as TreeNode<T>
    }

    root.children = userNodes.map(userNode => parse(userNode, root))

    return root
}

/**
 * Обход в глубину (Прямой обход)
 * @param nodes
 * @param cb
 * @param condition функция условия для продолжения обхода вглубь
 */
export function treeTraverseDepthFirstPreOrder<T extends TreeLike>(
    nodes: T[],
    cb: (node: T) => void,
    condition: (node: T) => boolean = () => true
): void {
    for (let node of nodes) {
        cb(node)
        if ('children' in node && condition(node)) treeTraverseDepthFirstPreOrder(node.children as T[], cb, condition)
    }
}
/**
 * Обход в глубину (Обратный обход)
 * @param nodes
 * @param cb
 * @param condition функция условия для продолжения обхода вглубь
 */
export function treeTraverseDepthFirstPostOrder<T extends TreeLike>(
    nodes: T[],
    cb: (node: T) => void,
    condition: (node: T) => boolean = () => true
): void {
    for (let node of nodes) {
        if ('children' in node && condition(node)) treeTraverseDepthFirstPostOrder(node.children as T[], cb, condition)
        cb(node)
    }
}
/**
 * Обход в ширину
 * @param nodes
 * @param cb
 * @param condition функция условия для продолжения обхода вглубь
 */
export function treeTraverseBreadthFirst<T extends TreeLike>(
    nodes: T[],
    cb: (node: T) => void,
    condition: (node: T) => boolean = () => true
): void {
    const queue: T[] = []

    queue.push(...nodes)

    while (queue.length > 0) {
        const tempNode = queue.shift()!
        cb(tempNode)
        if ('children' in tempNode && condition(tempNode)) {
            queue.push(...tempNode.children as T[])
        }
    }
}

export function treeContains<T extends TreeLike>(node: T, checkedNode: T): boolean {
    let contains = false
    treeTraverseBreadthFirst([node], node => {
        if (node.nodeId === checkedNode.nodeId) contains = true
    })
    return contains
}

/**
 * Получить конечные узлы
 * @param nodes
 * @returns
 */
export function getLeafNodes<T extends TreeLike>(nodes: T[]): TreeLikeLeafNode<T>[] {
    const leafs: TreeLikeLeafNode<T>[] = []
    treeTraverseBreadthFirst(nodes, node => {
        if (nodeIsLeaf(node)) leafs.push(node)
    })
    return leafs
}
/**
 * Выпрямляет дерево в плоский массив
 * @param nodes
 * @returns
 */
export function flatTree<T extends TreeViewValue>(nodes: TreeAnyNode<T>[]): TreeAnyNode<T>[] {
    if (!nodes) return []

    const ns: TreeAnyNode<T>[] = []
    treeTraverseDepthFirstPostOrder(nodes, node => ns.push(node))
    return ns
}

export function nodeIsLeaf<T extends TreeLike>(
    node: T
): node is TreeLikeLeafNode<T> {
    return !node.children || !node.children.length
}

export function nodeIsRoot<T extends TreeViewValue>(
    node: TreeAnyNode<T>
): node is TreeRootNode<T> {
    // @ts-ignore
    return !node.parent
}

export function nodeIsSelected<T extends TreeViewValue>(
    node: TreeAnyNode<T>,
    selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
): boolean {
    if (nodeIsLeaf(node)) {
        return selectionMap.get(node.nodeId) === 1
    }

    return node.children!.every(child => selectionMap.get(child.nodeId) === 1)
}

/** Проверяет на неопределенность состояния выборки за максимум O(n) операций */
export function nodeIsIndeterminated<T extends TreeViewValue>(
    node: TreeAnyNode<T>,
    selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
): boolean {
    if (nodeIsLeaf(node)) {
        return selectionMap.get(node.nodeId) === 0
    }

    let falsy = false, trusty = false, i = 0

    while (i < node.children!.length) {
        const childSelectionState = selectionMap.get(node.children![i].nodeId)
        if (childSelectionState === 0) {
            trusty = true
            falsy = true
            break
        }
        if (childSelectionState === 1) trusty = true
        if ((childSelectionState ?? -1) === -1) falsy = true
        if (falsy && trusty) break
        i++
    }

    return falsy && trusty
}

export function getRoot<T extends TreeViewValue>(node: TreeAnyNode<T>): TreeRootNode<T> {
    return nodeIsRoot(node) ? node : getRoot(node.parent)
}

export function updateSelectionUp<T extends TreeViewValue>(
    node: TreeAnyNode<T>,
    selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
    disabledSet: Set<NodeId<T>>
) {
    if (nodeIsRoot(node)) {
        return
    }

    const parent = node.parent as TreeNotLeafNode<T>

    if (parent.children.length === 1) {
        selectionMap.set(parent.nodeId, selectionMap.get(node.nodeId) ?? -1)
        updateSelectionUp(parent, selectionMap, disabledSet)
        return
    }

    let parentNodeNewSelectionState: TreeNodeSelectionState

    if (nodeIsSelected(parent, selectionMap)) parentNodeNewSelectionState = 1
    else if (nodeIsIndeterminated(parent, selectionMap)) parentNodeNewSelectionState = 0
    else parentNodeNewSelectionState = -1

    if ((selectionMap.get(parent.nodeId) ?? -1) === parentNodeNewSelectionState) {
        return
    }

    selectionMap.set(parent.nodeId, parentNodeNewSelectionState)
    updateSelectionUp(parent, selectionMap, disabledSet)
}

export function updateSelectionDown<T extends TreeViewValue>(
    node: TreeAnyNode<T>,
    selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
    disabledSet: Set<NodeId<T>>
) {
    if (nodeIsLeaf(node)) {
        return
    }

    const currentNodeSelectionState = selectionMap.get(node.nodeId) ?? -1

    node.children!.forEach((child: TreeNotRootNode<T>) => {
        if (!disabledSet.has(child.nodeId)) selectionMap.set(child.nodeId, currentNodeSelectionState)
        updateSelectionDown(child, selectionMap, disabledSet)
    })

    // после спуска изменений выборки задизейбленные узлы не стали "выбранными", состояние "выбран" для узла невозможно
    if (nodeIsIndeterminated(node, selectionMap)) selectionMap.set(node.nodeId, 0)
}

export function getHiddenSet<T extends TreeViewValue>(
    nodes: TreeNotRootNode<T>[],
    filterFn?: (node: TreeNotRootNode<T>) => boolean
) {
    const set = new Set<NodeId<T>>()
    if (filterFn) {
        treeTraverseDepthFirstPostOrder(nodes, node => {
            if (!filterFn(node)) {
                if (!nodeIsLeaf(node) && (node as TreeNotLeafNode<T>).children.some(child => !set.has(child.nodeId))) {
                    return
                }
                set.add(node.nodeId)
            }
        })
    }
    return set
}

export function setsEqual<T = any>(a: Set<T>, b: Set<T>) {
    return a.size === b.size && [...a].every(value => b.has(value))
}

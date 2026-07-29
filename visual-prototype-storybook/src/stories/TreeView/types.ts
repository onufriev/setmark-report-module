import React from 'react'

export type TreeNodeId = string | number

export type TreeViewValue = {
    [key: string]: any
    nodeId?: TreeNodeId
}

export type NodeId<T extends TreeViewValue = TreeViewValue> = T["nodeId"] extends undefined ? string : T["nodeId"]

export type TreeViewProps<T extends TreeViewValue = TreeViewValue> = {
    value?: T[]
    /**
     * Поле в данных, содержащее выводимое название узла
     * @default "label"
     **/
    labelField?: string
    /**
     * Поле в данных, содержащее массив дочерних узлов
     * @default "children"
     **/
    childrenField?: string
    /** Раскрывать дерево при первом рендере */
    defaultExpanded?: boolean
    /** Отключает отображение кнопки развертки (свернуть/развернуть всё) */
    disableExpandAllButton?: boolean

    selectable?: boolean
    /** Включает режим выбора одного листового узла */
    radio?: boolean
    /**
     * Выборка узлов.
     * При изменении дерева выборка актуализируется на основе defaultSelectionModel.
     * Следовательно, если дерево может измениться, передавайте текущую выборку и в selectionModel и в defaultSelectionModel.
     * ❗ Является временным решением.
     */
    selectionModel?: NodeId<T>[]
    defaultSelectionModel?: NodeId<T>[]
    onSelect?: (keys: NodeId<T>[], initialNode?: TreeAnyNode<T>) => void
    /**
     * Режим выборки узлов
     * @value all отбираются все выбранные узлы
     * @value leaf отбираются только конечные (листовые) выбранные узлы
     * @value root отбираются только родительские узлы с полной выборкой
     * @default 'all'
     */
    selectionMode?: TreeViewSelectionMode
    isDisabled?: (node: TreeNotRootNode<T>) => boolean

    disabled?: boolean

    /** Включает возможность "выбора" узла нажатием на него */
    pickable?: boolean
    /** Начальное значение в режиме uncontrolled */
    defaultPickModel?: NodeId<T> | null
    pickModel?: NodeId<T> | null
    onPick?: (nodeId: NodeId<T> | null) => void

    /** Рендер-функция для содержимого узла */
    renderNode?: (node: TreeNotRootNode<T>) => React.ReactNode

    /** Отключает отображение корневого чекбокса (выбрать всё) */
    disableRoot?: boolean
    /** Возможность задать текст для корневого чекбокса (по умолчанию выбрать всё) */
    rootCheckboxLabel?: string
    /** Виртуализация дерева. Если работаете с большими списками, обязательно включайте. */
    virtualized?: boolean
    /**
     * Высота строки
     * @default 36
     */
    rowHeight?: number

    /* TODO Функция фильтрации узлов */
    filterFn?: ((node: TreeNotRootNode<T>) => boolean) | undefined
    noOptionText?: string
    renderNoOption?: () => React.ReactNode

    apiRef?: React.MutableRefObject<TreeViewApiRef<T>>
}

export interface TreeViewApiRef<T extends TreeViewValue = TreeViewValue> {
    getNodeById: (id: NodeId<T>) => TreeNotRootNode<T>
    getLeafNodesByNode: (node: TreeNotRootNode<T>) => TreeLeafNode<T>[]
    getNodeSelectionState: (node: TreeAnyNode<T>) => TreeNodeSelectionState | null
    isNodeContains: (testNode: TreeAnyNode<T>, containerNode: TreeAnyNode<T>) => boolean
    isNodeIntersects: (nodeA: TreeAnyNode<T>, nodeB: TreeAnyNode<T>) => boolean
    selectNodeById: (nodeId: NodeId<T>) => void
    deselectNodeById: (nodeId: NodeId<T>) => void
    setNodeSelectionStateById: (nodeId: NodeId<T>, selectionState: TreeNodeSelectionState) => void
}

export type TreeViewNodeProps<T extends TreeViewValue> = {
    node: TreeNotRootNode<T>
} & Pick<TreeViewProps<T>, 'pickable' | 'selectable' | 'radio' | 'renderNode' | 'labelField'>

export type TreeViewState<T extends TreeViewValue>= {
    disabledSet: Set<NodeId<T>>
    selectionMap: Map<NodeId<T>, TreeNodeSelectionState>
    changeSelectionModel: (node: TreeAnyNode<T>, selected: boolean) => void
    expandSet: Set<NodeId<T>>
    changeExpandModel: (node: TreeNode<T>, expanded: boolean) => void
    pickModel: NodeId<T> | null
    changePickModel: (node: TreeNotRootNode<T> | null) => void
}

export type TreeViewSelectionMode = 'all' | 'leaf' | 'root'

export type TreeNodeBase<T extends TreeViewValue> = T & {
    nodeId: NodeId<T>
    depth: number
}

export type TreeRootNode<T extends TreeViewValue> = {
    nodeId: string,
    children: TreeNotRootNode<T>[]
}

export type TreeNode<T extends TreeViewValue> = TreeNodeBase<T> & {
    parent: TreeNode<T> | TreeRootNode<T>
    children: TreeNotRootNode<T>[]
}

export type TreeLeafNode<T extends TreeViewValue> = TreeNodeBase<T> & {
    parent: TreeNode<T> | TreeRootNode<T>
    children?: []
}

export type TreeAnyNode<T extends TreeViewValue> = TreeRootNode<T> | TreeNode<T> | TreeLeafNode<T>

export type TreeNotRootNode<T extends TreeViewValue> = TreeNode<T> | TreeLeafNode<T>

export type TreeNotLeafNode<T extends TreeViewValue> = TreeRootNode<T> | TreeNode<T>

/**
 * -1 - не выбрано
 *  1 - выбрано
 *  0 - не определено (смешанная выборка дочерних узлов)
 */
export type TreeNodeSelectionState = -1 | 0 | 1

export interface TreeLike {
    [key: string]: any
    parent?: TreeLike
    children?: TreeLike[]
}

export type TreeLikeLeafNode<T extends TreeLike> = T & {
    children?: []
}

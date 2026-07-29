import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import isEqual from 'lodash/isEqual'
import {
    TreeViewCheckbox,
    TreeViewContainer,
    TreeViewBodyContainer,
    TreeViewRow,
    TreeViewRowContent,
    TreeViewRowIcon,
    TreeViewBody
} from './components'
import TreeViewNode from './TreeViewNode'
import { TreeViewRootStateContext } from './contexts'
import {
    TreeViewState,
    TreeViewValue,
    TreeRootNode,
    TreeNode,
    TreeNodeSelectionState,
    TreeNotRootNode,
    TreeAnyNode,
    TreeViewProps,
    TreeNotLeafNode,
    TreeViewSelectionMode,
    NodeId,
} from './types'
import {
    getHiddenSet,
    getLeafNodes,
    nodeIsLeaf,
    nodeIsRoot,
    parseToRoot,
    setsEqual,
    treeContains,
    treeTraverseDepthFirstPostOrder,
    treeTraverseDepthFirstPreOrder,
    updateSelectionDown,
    updateSelectionUp
} from './utils'
import { useLocale } from '../LocaleProvider'
import { Typography } from '../Typography'
import useResizeObserver from '../../utils/useResizeObserver'
import useControlled from '../../utils/useControlled'
import { Link } from '../Link'
import { Box } from '../Box'
import classNames from 'classnames'
import useForceUpdate from '../../utils/useForceUpdate'

function TreeView<T extends TreeViewValue = TreeViewValue>(
    props: Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onSelect'> & TreeViewProps<T>
) {
    const {
        id,

        value,

        labelField = 'label',
        childrenField = 'children',

        defaultExpanded,

        disableExpandAllButton,

        selectable,
        radio,
        selectionMode = 'all',
        defaultSelectionModel = [],
        selectionModel,
        onSelect,
        isDisabled,

        disabled,

        pickable,
        pickModel: pickModelProps,
        defaultPickModel = null,
        onPick,

        renderNode,
        disableRoot,
        rootCheckboxLabel,
        virtualized,
        rowHeight = 36,

        filterFn,
        noOptionText,
        renderNoOption,

        apiRef,

        className,

        ...restProps
    } = props

    const nodeProps = {
        labelField,
        selectable,
        radio,
        pickable,
        renderNode,
    }

    const rowStyle = {
        minHeight: `${rowHeight}px`
    }

    const { t } = useLocale()

    const bodyContainerRef = useRef<HTMLDivElement>(null)

    const bodyContainerSize = useResizeObserver({ ref: bodyContainerRef })

    const initRoot = (): TreeRootNode<T> => {
        return parseToRoot<T>({
            userNodes: value,
            childrenField,
        })
    }

    const [root, setRoot] = useState<TreeRootNode<T>>(initRoot)

    const getRootMap = (root: TreeRootNode<T>): Map<NodeId<T>, TreeAnyNode<T>> => {
        const map = new Map()
        treeTraverseDepthFirstPreOrder([root], node => map.set(node.nodeId, node))
        return map
    }

    /** Представление дерева в виде словаря для эффективного доступа к узлу через его идентификатор */
    const rootMapRef = useRef<Map<NodeId<T>, TreeAnyNode<T>>>(getRootMap(root))

    /** Обработчик изменения входных параметров от пользователя */
    useEffect(() => {
        const newRoot = parseToRoot<T>({
            userNodes: value,
            childrenField,
        })

        if (isEqual(newRoot, root)) {
            return
        }

        setRoot(newRoot)

        rootMapRef.current = getRootMap(newRoot)

        // актуализируем состояние выборки
        const newSelectionMap = initSelectionMap()
        const newSelectionSet = getSelectionSetByTree(newSelectionMap, selectionMode)

        selectionMapRef.current = newSelectionMap
        setSelectionSet(newSelectionSet)

        if (!setsEqual(selectionSet, newSelectionSet)) {
            onSelect?.([...newSelectionSet.values()])
        }

        // актуализируем развертку
        const newExpandSet = new Set(expandSet)
        newExpandSet.forEach(nodeId => {
            if (!rootMapRef.current.has(nodeId)) {
                newExpandSet.delete(nodeId)
            }
        })
        setExpandSet(newExpandSet)

        // актуализируем выбранный узел
        if (pickModel && !rootMapRef.current.has(pickModel)) {
            setPickModel(null)
            onPick?.(null)
        }
    }, [value, childrenField])

    /** Набор идентификаторов всех неактивных узлов */
    const disabledSet = useMemo<Set<NodeId<T>>>(() => {
        const set: Set<NodeId<T>> = new Set()
        if (disabled) {
            treeTraverseDepthFirstPreOrder(root.children, node => set.add(node.nodeId))
        } else if (isDisabled) {
            treeTraverseDepthFirstPostOrder(
                root.children,
                node => {
                    if (isDisabled(node)) {
                        set.add(node.nodeId)

                        if (!nodeIsLeaf(node)) {
                            treeTraverseDepthFirstPreOrder(
                                (node as TreeNotLeafNode<T>).children,
                                child => set.add(child.nodeId)
                            )
                        }
                    } else {
                        if (
                            !nodeIsRoot(node) &&
                            !nodeIsLeaf(node) &&
                            !(node as TreeNode<T>).children.some(child => !set.has(child.nodeId))
                        ) {
                            set.add((node as TreeNotRootNode<T>).nodeId)
                        }
                    }
                }
            )
        }
        return set
    }, [root, disabled, isDisabled])

    const lastSelectionModeRef = useRef(selectionMode)

    /** Обновляет состояние выборки дерева согласно **желаемому** новому значению */
    const updateSelectionMapByNode = (
        selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
        node: TreeAnyNode<T>,
        selectedState: TreeNodeSelectionState
    ) => {
        selectionMap.set(node.nodeId, selectedState)
        updateSelectionDown(node, selectionMap, disabledSet)
        updateSelectionUp(node, selectionMap, disabledSet)
        return selectionMap
    }

    /** Словарь состояния выборки дерева */
    const initSelectionMap = (): Map<NodeId<T>, TreeNodeSelectionState> => {
        let newSelectionMap = new Map()

        if (!defaultSelectionModel.length) return newSelectionMap

        defaultSelectionModel.forEach(nodeId => {
            const node = rootMapRef.current.get(nodeId)!
            if (!node) return
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, 1)
        })

        return newSelectionMap
    }

    const selectionMapRef = useRef<Map<NodeId<T>, TreeNodeSelectionState>>(initSelectionMap())

    /** Набор идентификаторов выбранных узлов */
    const initSelectionSet = (): Set<NodeId<T>> => {
        return new Set()
    }

    const [selectionSet, setSelectionSet] = useState<Set<NodeId<T>>>(initSelectionSet)

    /** Обработчик изменения выборки от пользователя */
    useEffect(() => {
        // selection uncontrolled, не обрабатываем
        if (selectionModel == null) {
            return
        }

        if (selectionModel.length === 0) {
            // нужно обнулить
            if (selectionSet.size > 0) {
                let newSelectionMap = new Map(selectionMapRef.current)
                newSelectionMap = updateSelectionMapByNode(newSelectionMap, root, -1)
                selectionMapRef.current = newSelectionMap
                setSelectionSet(new Set())
            }

            return
        }

        const selectionSetProps = new Set(selectionModel)

        const addedNodeIds = selectionModel.filter(nodeId => !selectionSet.has(nodeId))
        const removedNodeIds = [...selectionSet.values()].filter(nodeId => !selectionSetProps.has(nodeId))

        // ничего не изменилось
        if (!removedNodeIds.length && !addedNodeIds.length) {
            return
        }

        let newSelectionMap = new Map(selectionMapRef.current)

        addedNodeIds.forEach(addedNodeId => {
            const node = rootMapRef.current.get(addedNodeId)!
            if (!node) return
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, 1)
        })

        removedNodeIds.forEach(addedNodeId => {
            const node = rootMapRef.current.get(addedNodeId)!
            if (!node) return
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, -1)
        })

        selectionMapRef.current = newSelectionMap

        const newSelectionSet = updateSelectionSetByTree(newSelectionMap)

        if (!setsEqual(selectionSetProps, newSelectionSet)) {
            onSelect?.([...newSelectionSet.values()])
        }
    }, [selectionModel])

    useEffect(() => {
        if (lastSelectionModeRef.current === selectionMode) {
            return
        }

        const newSelectionSet = updateSelectionSetByTree(selectionMapRef.current)

        if (!setsEqual(selectionSet, newSelectionSet)) {
            onSelect?.([...newSelectionSet.values()])
        }
    }, [selectionMode])

    const handleSelectAllChange = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        let newSelectionMap = new Map(selectionMapRef.current)
        newSelectionMap = updateSelectionMapByNode(newSelectionMap, root, selectAny ? -1 : 1)
        selectionMapRef.current = newSelectionMap

        const newSelectionSet = updateSelectionSetByTree(newSelectionMap)
        onSelect?.([...newSelectionSet.values()])
    }

    const changeSelectionModel = (node: TreeAnyNode<T>, selected: boolean) => {
        let newSelectionMap = new Map(selectionMapRef.current)
        if (radio) {
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, root, -1)
        }
        newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, selected ? 1 : -1)
        selectionMapRef.current = newSelectionMap

        const newSelectionSet = updateSelectionSetByTree(newSelectionMap)
        onSelect?.([...newSelectionSet.values()], node)
    }

    const getSelectionSetByTree = (
        selectionMap: Map<NodeId<T>, TreeNodeSelectionState>,
        selectionMode: TreeViewSelectionMode
    ): Set<NodeId<T>>  => {
        const selectionSet: Set<NodeId<T>> = new Set()

        if (selectionMode === 'leaf') {
            [...selectionMap.entries()]
                .forEach(([nodeId, selectedState]) => {
                    if (nodeIsLeaf(rootMapRef.current.get(nodeId)!) && selectedState === 1) {
                        selectionSet.add(nodeId)
                    }
                })
        } else if (selectionMode === 'root') {
            [...selectionMap.entries()]
                .forEach(([nodeId, selectedState]) => {
                    const currentNode = rootMapRef.current.get(nodeId)!

                    if (
                        !nodeIsRoot(currentNode) &&
                        selectedState === 1 &&
                        (selectionMap.get((currentNode.parent as TreeNotRootNode<T>).nodeId) !== 1 || nodeIsRoot(currentNode.parent!))
                    ) {
                        selectionSet.add(nodeId)
                    }
                })
        } else {
            [...selectionMap.entries()]
                .forEach(([nodeId, selectedState]) => {
                    if (!nodeIsRoot(rootMapRef.current.get(nodeId)!) && selectedState === 1) {
                        selectionSet.add(nodeId)
                    }
                })
        }

        return selectionSet
    }

    /** Обновляет набор выбранных узлов соглано состоянию дерева и текущего режима */
    const updateSelectionSetByTree = (selectionMap: Map<NodeId<T>, TreeNodeSelectionState>): Set<NodeId<T>> => {
        const selectionSet = getSelectionSetByTree(selectionMap, selectionMode)

        setSelectionSet(selectionSet)

        return selectionSet
    }

    /** Набор идентификаторов развернутых узлов */
    const initExpandSet = (): Set<NodeId<T>> => {
        const set: Set<NodeId<T>> = new Set()

        if (defaultExpanded) {
            treeTraverseDepthFirstPreOrder(root.children, node => !nodeIsLeaf(node) && set.add((node as TreeNode<T>).nodeId))
        }

        return set
    }

    const [expandSet, setExpandSet] = useState<Set<NodeId<T>>>(initExpandSet)

    const changeExpandModel = (node: TreeNode<T>, expanded: boolean) => {
        if (expanded) expandSet.add(node.nodeId)
        else expandSet.delete(node.nodeId)

        setExpandSet(new Set(expandSet))
    }

    const expanded = expandSet.size > 0

    const expandAll = () => {
        const set: Set<NodeId<T>> = new Set()
        treeTraverseDepthFirstPreOrder(root.children, node => !nodeIsLeaf(node) && set.add((node as TreeNode<T>).nodeId))
        setExpandSet(new Set(set))
    }

    const collapseAll = () => {
        setExpandSet(new Set())
    }

    /** Идентификатор узла, на котором стоит фокус (последний по которому нажали) */
    const [pickModel, setPickModel] = useControlled<NodeId<T> | null>({
        controlled: pickModelProps,
        default: defaultPickModel as NodeId<T> | null
    })

    const changePickModel = (node: TreeNotRootNode<T> | null) => {
        const nodeId = node?.nodeId ?? null
        setPickModel(nodeId)
        onPick?.(nodeId)
    }

    /** Набор идентификаторов отображаемых узлов согласно фильтрации */
    const initHiddenSet = (): Set<NodeId<T>> => {
        return new Set()
    }

    const [hiddenSet, setHiddenSet] = useState<Set<NodeId<T>>>(initHiddenSet)

    useEffect(() => {
        setHiddenSet(getHiddenSet(root.children, filterFn))
    }, [filterFn])

    const forceUpdate = useForceUpdate()

    useImperativeHandle(apiRef, () => Object.freeze({
        getNodeById: (nodeId: NodeId<T>) => {
            return rootMapRef.current.get(nodeId) as TreeNotRootNode<T>
        },
        getLeafNodesByNode: (node: TreeNotRootNode<T>) => {
            return getLeafNodes([node])
        },
        getNodeSelectionState: (node: TreeAnyNode<T>) => {
            return selectionMapRef.current.get(node.nodeId) ?? null
        },
        isNodeContains: (testNode: TreeAnyNode<T>, containerNode: TreeAnyNode<T>) => {
            return treeContains(testNode, containerNode)
        },
        isNodeIntersects: (nodeA: TreeAnyNode<T>, nodeB: TreeAnyNode<T>) => {
            return treeContains(nodeA, nodeB) || treeContains(nodeB, nodeA)
        },
        getSelection: (selectionMode: TreeViewSelectionMode) => {
            const selectionSet = getSelectionSetByTree(selectionMapRef.current, selectionMode)
            return [...selectionSet.values()]
        },
        selectNodeById: (nodeId: NodeId<T>) => {
            const node = rootMapRef.current.get(nodeId)
            if (!node) return
            let newSelectionMap = new Map(selectionMapRef.current)
            if (radio) {
                newSelectionMap = updateSelectionMapByNode(newSelectionMap, root, -1)
            }
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, 1)
            // нужно подумать, стоит ли тут эмиттить новую выборку
            selectionMapRef.current = newSelectionMap
            forceUpdate()
        },
        deselectNodeById: (nodeId: NodeId<T>) => {
            const node = rootMapRef.current.get(nodeId)
            if (!node) return
            let newSelectionMap = new Map(selectionMapRef.current)
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, -1)
            // нужно подумать, стоит ли тут эмиттить новую выборку
            selectionMapRef.current = newSelectionMap
            forceUpdate()
        },
        setNodeSelectionStateById: (nodeId: NodeId<T>, selectionState: TreeNodeSelectionState) => {
            const node = rootMapRef.current.get(nodeId)
            if (!node) return
            let newSelectionMap = new Map(selectionMapRef.current)
            newSelectionMap = updateSelectionMapByNode(newSelectionMap, node, selectionState)
            // нужно подумать, стоит ли тут эмиттить новую выборку
            selectionMapRef.current = newSelectionMap
            forceUpdate()
        },
    }), [apiRef, rootMapRef.current, selectionMapRef.current])

    const state: TreeViewState<T> = {
        disabledSet,
        selectionMap: selectionMapRef.current,
        changeSelectionModel,
        expandSet,
        changeExpandModel,
        pickModel,
        changePickModel,
    }

    /** Представление дерева в виде плоского списка для рендеринга */
    const flatTree = useMemo(() => {
        const rows: TreeAnyNode<T>[] = []

        if (!disableRoot && selectable && !radio && !hiddenSet.size && root.children.length > 0) {
            rows.push(root)
        }

        treeTraverseDepthFirstPreOrder(
            root.children,
            node => !hiddenSet.has((node as TreeNode<T>).nodeId) && rows.push(node),
            node => hiddenSet.size !== 0 || expandSet.has((node as TreeNode<T>).nodeId)
        )

        return rows
    }, [root, expandSet, disableRoot, selectable, hiddenSet])

    const selectDisabled = disabled
    const selected = selectionMapRef.current.get(root.nodeId) ?? -1
    const selectAll = selected === 1
    const selectAny = selected === 1 || selected === 0

    const rootNode = (
        <TreeViewRow
            id={id && `${id}RootNode`}
            key="rootNode"
            style={rowStyle}
        >
            <TreeViewRowIcon>
                <TreeViewCheckbox
                    id={id && `${id}SelectAllCheckbox`}
                    checked={selectAny}
                    indeterminate={selectAny && !selectAll}
                    disabled={selectDisabled}
                    onChange={handleSelectAllChange}
                    disableRipple
                    native
                />
            </TreeViewRowIcon>
            <TreeViewRowContent>
                <Typography
                    noWrap
                >
                    { rootCheckboxLabel ? rootCheckboxLabel : t('treeView.all') }
                </Typography>
            </TreeViewRowContent>
        </TreeViewRow>
    )

    const noOption = renderNoOption?.() ?? (
        <TreeViewRow
            id={id && `${id}NoOption`}
            key="noOption"
            style={rowStyle}
        >
            <TreeViewRowContent>
                <Typography
                    noWrap
                    color="textSecondary"
                >
                    { noOptionText ?? t('treeView.noOption') }
                </Typography>
            </TreeViewRowContent>
        </TreeViewRow>
    )

    const hasNoChildren = flatTree.length === 0
    const hasRootNode = flatTree.length > 0 && nodeIsRoot(flatTree[0])
    const childrenZeroDepth = !hasNoChildren && !hasRootNode && !root.children.some(child => !nodeIsLeaf(child))
    const hasDeepChildren = root.children.length > 0 && root.children.some(child => !nodeIsLeaf(child))

    return (
        <TreeViewRootStateContext.Provider value={state}>
            <TreeViewContainer
                id={id}
                data-testid="TreeView"
                className={classNames(
                    className,
                    childrenZeroDepth && 'tree-view--children-zero-depth',
                )}
                {...restProps}
            >
                { !disableExpandAllButton && hasDeepChildren ? (
                    <Box py={1} px={1.5}>
                        <Link
                            id={id && `${id}ExpandAllButton`}
                            component="button"
                            color="primary"
                            onClick={() => expanded ? collapseAll() : expandAll()}
                        >
                            { expanded ? t('treeView.collapseAll') : t('treeView.expandAll') }
                        </Link>
                    </Box>
                ) : null }

                <TreeViewBodyContainer
                    id={id && `${id}BodyContainer`}
                    ref={bodyContainerRef}
                >
                    { hasNoChildren ? noOption : null }
                    { !hasNoChildren && !virtualized ? (
                        <TreeViewBody>
                            { flatTree.map(node => {
                                if (nodeIsRoot(node)) {
                                    return rootNode
                                }

                                return (
                                    <TreeViewNode
                                        key={`tree-view-node-${node.nodeId}`}
                                        id={id && `${id}-${node.nodeId}-Node`}
                                        style={rowStyle}
                                        node={node}
                                        {...nodeProps}
                                    />
                                )
                            }) }
                        </TreeViewBody>
                    ) : null }
                    { !hasNoChildren && virtualized ? (
                        <FixedSizeList
                            style={{ overflow: bodyContainerSize.height ? 'auto' : 'visible' }}
                            height={bodyContainerSize.height || 0}
                            width="100%"
                            itemCount={flatTree.length}
                            itemSize={rowHeight}
                            itemData={flatTree}
                        >{({ index, style, data }) => {
                            const node = data[index]

                            if (nodeIsRoot(node)) {
                                return rootNode
                            }

                            return (
                                <TreeViewNode
                                    key={`tree-view-node-${node.nodeId}`}
                                    style={style}
                                    id={id && `${id}-${node.nodeId}-Node`}
                                    node={node}
                                    {...nodeProps}
                                />
                            )
                        }}</FixedSizeList>
                    ) : null }
                </TreeViewBodyContainer>
            </TreeViewContainer>
        </TreeViewRootStateContext.Provider>
    )
}

export default TreeView

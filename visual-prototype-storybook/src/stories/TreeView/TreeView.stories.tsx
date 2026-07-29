import React, { useEffect, useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import { Stack } from '../Stack'
import { TextInput } from '../TextInput'
import { Table } from '../Table'
import { Box } from '../Box'
import { Button } from '../Button'
import { FakeNode, getFakeNodes, getManyFakeNodes, GroupingNodeVO, ObjectVO } from './__mocks__/fake-nodes'
import fakeGroupingTree from './__mocks__/fake-grouping-tree.json'
import { getGroupingName, getLocalizedGroupValueName, Groupings, ORDERED_GROUPINGS } from './__mocks__/grouping-utils'
import uniqBy from 'lodash/uniqBy'
import { action } from '@storybook/addon-actions'
import {
    TreeView,
    TreeAnyNode, TreeLeafNode, TreeViewProps, TreeNotRootNode,
    treeGetLeafNodes, treeNodeIsLeaf, treeTraverseDepthFirstPostOrder,
    TreeViewListItemContent,
    useTreeViewApiRef,
} from './index'
import { RequiredProps } from '../../typings/utils'

export default {
    title: 'Form/TreeView',
    component: TreeView,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Uncontrolled: Story<TreeViewProps<FakeNode>> = (args) => (
    <ContentBox height={'50%'}>
        <TreeView {...args} />
    </ContentBox>
)

const TemplateNarrow: Story<TreeViewProps<FakeNode>> = (args) => (
    <ContentBox height={'50%'} width={400}>
        <TreeView {...args} />
    </ContentBox>
)

export const Default: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
Default.args = {
    value: getFakeNodes(),
    labelField: 'name',
    childrenField: 'children',
}

export const Pickable: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
Pickable.args = {
    value: getFakeNodes(),
    labelField: 'name',
    childrenField: 'children',
    pickable: true,
}

export const Virtualized: Story<TreeViewProps<FakeNode>> = TemplateNarrow.bind({})
Virtualized.args = {
    value: getManyFakeNodes(true),
    labelField: 'name',
    childrenField: 'children',
    virtualized: true,
}

export const CustomRenderer: Story<TreeViewProps<FakeNode>> = TemplateNarrow.bind({})
CustomRenderer.args = {
    value: getManyFakeNodes(),
    labelField: 'name',
    childrenField: 'children',
    virtualized: true,
    rowHeight: 42,
    renderNode: (node) => (
        <TreeViewListItemContent
            primaryText={node.name}
            secondaryText={node.address}
            thirdText={node.children?.length || ''}
        />
    )
}

export const Selectable: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
Selectable.args = {
    value: getManyFakeNodes(),
    labelField: 'name',
    childrenField: 'children',
    selectable: true,
    isDisabled: node => String(node.nodeId).includes('.1.'),
    virtualized: true,
}

export const Radio = Uncontrolled.bind({})
Radio.args = {
    value: getFakeNodes(),
    labelField: 'name',
    childrenField: 'children',
    selectable: true,
    radio: true,
    isDisabled: node => String(node.nodeId).includes('.1.'),
    virtualized: true,
}

export const OneNode: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
OneNode.args = {
    value: [
        {
            nodeId: 1,
            name: 'Region 1'
        }
    ],
    labelField: 'name',
    childrenField: 'children',
    selectable: true
}

export const RootChildrenLeafs: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
RootChildrenLeafs.args = {
    value: [
        {
            nodeId: 1,
            name: 'Region 1'
        },
        {
            nodeId: 2,
            name: 'Region 2'
        },
        {
            nodeId: 3,
            name: 'Region 3'
        },
        {
            nodeId: 4,
            name: 'Region 4'
        },
    ],
    labelField: 'name',
    childrenField: 'children',
    selectable: true
}

export const MixedNodes: Story<TreeViewProps<FakeNode>> = Uncontrolled.bind({})
MixedNodes.args = {
    value: [
        {
            nodeId: 10,
            name: 'Region 1'
        },
        {
            nodeId: 20,
            name: 'Region 2',
            children: [
                {
                    nodeId: 2,
                    name: 'City 2',
                    children: [
                        {
                            nodeId: 3,
                            name: 'Shop 3',
                        },
                        {
                            nodeId: 4,
                            name: 'Shop 4',
                        },
                        {
                            nodeId: 5,
                            name: 'Shop 5',
                        },
                        {
                            nodeId: 6,
                            name: 'Shop 6',
                        }
                    ]
                },
                {
                    nodeId: 7,
                    name: 'City 7',
                    children: [
                        {
                            nodeId: 8,
                            name: 'Shop 8',
                        },
                        {
                            nodeId: 9,
                            name: 'Shop 9',
                        },
                    ]
                }
            ]
        },
        {
            nodeId: 30,
            name: 'Region 3'
        },
        {
            nodeId: 40,
            name: 'Region 4'
        },
    ],
    labelField: 'name',
    childrenField: 'children',
    selectable: true
}

export const Search: Story<TreeViewProps<FakeNode>> = () => {
    const [tree] = useState(getManyFakeNodes())
    const [searchSrt, setSearchSrt] = useState('.0.5.')

    return (
        <ContentBox height={400}>
            <Stack spacing={2} direction="column" style={{ height: '100%' }}>
                <TextInput
                    placeholder="Поиск по названию узла"
                    value={searchSrt}
                    onValueChange={value => setSearchSrt(value)}
                    clearable
                />
                <TreeView<FakeNode>
                    value={tree}
                    labelField="name"
                    childrenField="children"
                    filterFn={node => node.name.toLowerCase().includes(searchSrt.toLowerCase())}
                    selectable
                    virtualized
                />
            </Stack>
        </ContentBox>
    )
}

function convertFlatDataToTree(orderedGroups: Groupings[], items: GroupingNodeVO[], parent?: any): any[] {
    const isGroupingsEmpty = orderedGroups.length === 0

    const [curGroup, ...restGroups] = orderedGroups
    const currentGroupId = isGroupingsEmpty ? Groupings.All : curGroup
    const currentGroupItems = isGroupingsEmpty ? items : uniqBy(items, currentGroupId as keyof GroupingNodeVO)

    const isLeaf = restGroups.length === 0

    const tree = currentGroupItems.map(groupItem => {
        const groupValue = groupItem[currentGroupId]

        const nodeId = {
            ...parent?.nodeId,
            [currentGroupId]: groupValue
        }

        const node: any = {
            nodeId,
            group: currentGroupId,
            value: groupItem,
        }

        if (!isLeaf) {
            node.children = convertFlatDataToTree(restGroups, items.filter(item => item[currentGroupId] === groupValue), node)
        }

        return node
    })

    return tree
}

const handleSelectionAction = action('onSelect')
const handlePickAction = action('onPick')

type GroupingNode = {
    nodeId: string
    group: string
    value: GroupingNodeVO
    amount: number
    children: GroupingNode[]
}

type GroupingNodeId = string

const idToString = (id: object) => JSON.stringify(id)
const idToObject = (id: string) => JSON.parse(id)

const defaultId = idToString({
    startPrice: 1637100000000
})

export const Set10GroupingTree: Story<TreeViewProps<GroupingNode>> = () => {

    const treeViewRef = useTreeViewApiRef<GroupingNode>()
    const treeManualChangeRef = useRef(false)

    const [tree, setTree] = useState<GroupingNode[]>(() => {
        const groupingTree = fakeGroupingTree // await getFakeGroupingTree()
        const tree = convertFlatDataToTree(ORDERED_GROUPINGS, groupingTree)
        treeTraverseDepthFirstPostOrder(tree, node => {
            node.nodeId = idToString(node.nodeId)
            if (treeNodeIsLeaf(node)) {
                node.amount = node.value.amount
            } else {
                // @ts-ignore
                node.amount = node.children.reduce((acc, cur) => acc + cur.amount, 0)
            }
        })
        return tree
    })

    // эмулятор запросов получения объектов
    const requestRef = useRef((() => {
        const objectsMap = new Map()

        const leafs = treeGetLeafNodes(tree)

        let startIndex = 0
        for (const leaf of leafs) {
            const objects = [...new Array(leaf.amount)].map((_, i) => {
                const index = startIndex + i
                return {
                    id: String(index),
                    label: `Object ${index}`
                }
            })
            objectsMap.set(leaf.nodeId, objects)
            startIndex += leaf.amount
        }

        return (leafNodes: TreeLeafNode<GroupingNode>[]): Promise<ObjectVO[]> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(leafNodes.reduce((acc, leafNode) => [...acc, ...objectsMap.get(leafNode.nodeId)], [] as ObjectVO[]))
                }, 1)
            })
        }
    })())

    const [objects, setObjects] = useState<ObjectVO[]>([])
    const [treeSelection, setTreeSelection] = useState<GroupingNodeId[]>([defaultId])
    const [pickedNodeId, setPickedNodeId] = useState<GroupingNodeId | null>()
    const [tableSelection, setTableSelection] = useState<string[]>([])

    const [extendSelectionMap, setExtendSelectionMap] = useState<Map<GroupingNodeId, { includes: string[]; excludes: string[] }>>(new Map())

    const handlePick = (nodeId: GroupingNodeId | null) => {
        setTableSelection([])

        setPickedNodeId(nodeId)
        handlePickAction(nodeId)

        if (nodeId) fetchObjects(nodeId)
        else setObjects([])
    }

    const fetchObjects = async (nodeId: GroupingNodeId) => {
        const node = treeViewRef.current.getNodeById(nodeId)

        const leafNodes = treeViewRef.current.getLeafNodesByNode(node)
        const objects = await requestRef.current(leafNodes)

        setObjects(objects)

        // получить сфокусированный узел
        const pickedNode = treeViewRef.current.getNodeById(nodeId)

        updateTableSelectionByTree(pickedNode, objects)
    }

    const handleTreeSelection = (nodeIds: GroupingNodeId[], initialNode?: TreeAnyNode<GroupingNode>) => {
        setTreeSelection(nodeIds)
        handleSelectionAction(nodeIds)

        if (!pickedNodeId) return

        // получить сфокусированный узел
        const pickedNode = treeViewRef.current.getNodeById(pickedNodeId)

        if (initialNode && !treeViewRef.current.isNodeIntersects(initialNode, pickedNode)) {
            return
        }

        updateTableSelectionByTree(pickedNode, objects)
    }

    const updateTableSelectionByTree = (pickedNode: TreeNotRootNode<GroupingNode>, objects: ObjectVO[]) => {
        // получить листовые узлы под фокусом
        const pickedNodeLeafNodes = treeViewRef.current.getLeafNodesByNode(pickedNode)

        const newTableSelection: string[] = []

        const objectsIds = objects.map(v => v.id)

        for (const leafNode of pickedNodeLeafNodes) {
            const leafNodeObjectIds = objectsIds.splice(0, leafNode.amount)

            const selectionState = treeViewRef.current.getNodeSelectionState(leafNode)
            if (selectionState === 1) {
                newTableSelection.push(...leafNodeObjectIds)
            } else if (selectionState === 0) {
                const extendData = extendSelectionMap.get(leafNode.nodeId)
                if (extendData) {
                    newTableSelection.push(...(extendData.includes.length > 0
                        ? extendData.includes
                        : leafNodeObjectIds.filter(id => !extendData.excludes.includes(id))
                    ))
                }
            }
        }

        setTableSelection(newTableSelection)
    }

    const handleTableSelection = (objectIds) => {
        setTableSelection(objectIds)

        if (!pickedNodeId) return

        // получить сфокусированный узел
        const pickedNode = treeViewRef.current.getNodeById(pickedNodeId)
        // получить листовые узлы под фокусом
        const pickedNodeLeafNodes = treeViewRef.current.getLeafNodesByNode(pickedNode)

        const objectsIds = objects.map(v => v.id)

        const treeSelectionCopy = treeSelection.slice()

        for (const leafNode of pickedNodeLeafNodes) {
            const leafNodeObjectIds = objectsIds.splice(0, leafNode.amount)

            const excludes = leafNodeObjectIds.filter(id => !objectIds.includes(id))
            const includes = leafNodeObjectIds.filter(id => objectIds.includes(id))

            if (excludes.length === leafNodeObjectIds.length || includes.length === leafNodeObjectIds.length) {
                extendSelectionMap.delete(leafNode.nodeId)

                treeManualChangeRef.current = true

                if (excludes.length > 0) {
                    const index = treeSelectionCopy.findIndex(nodeId => nodeId === leafNode.nodeId)
                    if (index > -1) {
                        treeSelectionCopy.splice(index, 1)
                    }

                    treeViewRef.current.setNodeSelectionStateById(leafNode.nodeId, -1)
                } else {
                    const index = treeSelectionCopy.findIndex(nodeId => nodeId === leafNode.nodeId)
                    if (index === -1) {
                        treeSelectionCopy.push(leafNode.nodeId)
                    }

                    treeViewRef.current.setNodeSelectionStateById(leafNode.nodeId, 1)
                }
            } else {
                if (includes.length > excludes.length) {
                    extendSelectionMap.set(leafNode.nodeId, {
                        excludes: excludes,
                        includes: [],
                    })
                } else {
                    extendSelectionMap.set(leafNode.nodeId, {
                        excludes: [],
                        includes: includes,
                    })
                }

                const index = treeSelectionCopy.findIndex(nodeId => nodeId === leafNode.nodeId)
                if (index > -1) {
                    treeSelectionCopy.splice(index, 1)
                }

                treeViewRef.current.setNodeSelectionStateById(leafNode.nodeId, 0)
            }
        }

        setTreeSelection(treeSelectionCopy)
        setExtendSelectionMap(extendSelectionMap)
    }

    const handlePrint = () => {
        const selection = [
            ...treeSelection.map(nodeId => idToObject(nodeId)),
            ...[...extendSelectionMap.entries()].map(([nodeId, extendData]) => {
                return {
                    ...idToObject(nodeId),
                    ...extendData
                }
            })
        ]

        console.log('selection', selection)
    }

    return (
        <ContentBox height={600} display="flex" flexDirection="column">
            <Box display="flex" flexGrow={1} border="1px solid" borderColor="divider">
                <Box width={'60%'}>
                    <TreeView<GroupingNode>
                        apiRef={treeViewRef}
                        value={tree}
                        rowHeight={40}
                        renderNode={node => (
                            <TreeViewListItemContent
                                primaryText={getLocalizedGroupValueName(node.group, node.value)}
                                secondaryText={getGroupingName(node.group)}
                                thirdText={node.amount}
                            />
                        )}
                        selectable
                        defaultSelectionModel={treeSelection}
                        onSelect={handleTreeSelection}
                        pickable
                        pickModel={pickedNodeId}
                        onPick={handlePick}
                        virtualized
                        disableRoot
                        selectionMode="leaf"
                    />
                </Box>
                <Box flexGrow={1} borderLeft="1px solid" borderColor="divider">
                    <Table
                        rows={objects}
                        getRowId={row => row.id}
                        columns={[
                            {
                                field: 'label',
                                headerName: 'Название',
                            },
                        ]}
                        selectable
                        selectionModel={tableSelection}
                        onSelectionModelChange={handleTableSelection}
                        virtualized
                    />
                </Box>
            </Box>
            <Box mt={1}>
                <Button fullWidth color="primary" onClick={handlePrint}>Вывести в консоль выборку</Button>
            </Box>
        </ContentBox>
    )
}

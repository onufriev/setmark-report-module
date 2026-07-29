import React from 'react'
import { ArrowDropDown, ArrowRight } from '../icons'
import { Typography } from '../Typography'
import { useTreeViewRootState } from './hooks'
import { TreeViewNodeProps, TreeViewValue } from './types'
import {
    TreeViewCheckbox,
    TreeViewExpandButton,
    TreeViewRadio,
    TreeViewRow,
    TreeViewRowContent,
    TreeViewRowIcon
} from './components'
import { nodeIsLeaf } from './utils'
import isEqual from 'lodash/isEqual'
import classNames from 'classnames'

function TreeViewNode<T extends TreeViewValue>(props: React.HTMLAttributes<HTMLDivElement> & TreeViewNodeProps<T>) {
        const {
            id,
            node,
            labelField,
            selectable,
            radio,
            pickable,
            renderNode,
            ...restProps
        } = props

        const {
            nodeId,
            depth,
        } = node

        const {
            selectionMap,
            changeSelectionModel,
            expandSet,
            changeExpandModel,
            pickModel,
            changePickModel,
            disabledSet,
        } = useTreeViewRootState()

        const isLeaf = nodeIsLeaf(node)

        const selected = selectionMap?.get(nodeId) ?? -1
        const nodeIsAnySelected = selected === 1 || selected === 0
        const nodeIsAllSelected = selected === 1

        const nodeIsPicked = isEqual(pickModel, nodeId)
        const nodeIsExpanded = isLeaf ? true : expandSet?.has(nodeId)

        const nodeIsDisabled = disabledSet?.has(nodeId) ?? false

        const handleRootClick = (evt: React.MouseEvent) => {
            if (!pickable) return

            changePickModel?.(nodeIsPicked ? null : node)
        }

        const handleExpandClick = (evt: React.MouseEvent) => {
            if (isLeaf) return

            evt.stopPropagation()
            changeExpandModel?.(node, !nodeIsExpanded)
        }

        const handleRadioChange = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            changeSelectionModel?.(node, true)
        }

        const handleCheckboxChange = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (isLeaf) {
                changeSelectionModel?.(node, !nodeIsAnySelected)
                return
            }

            changeSelectionModel?.(node, !nodeIsAnySelected)
        }

        const handleClick = (evt: React.MouseEvent) => {
            evt.stopPropagation()
        }

        let content

        if (renderNode) {
            content = renderNode(node)
        } else {
            content = defaultNodeRenderer(node[labelField!])
        }

        return (
            <TreeViewRow
                {...restProps}
                id={id}
                role="node"
                onClick={handleRootClick}
                $depth={depth}
                $pickable={pickable}
                $selectable={selectable}
                $radio={radio}
                $isLeaf={isLeaf}
                className={classNames(
                    nodeIsPicked && 'tree-view-node--is-picked',
                )}
            >
                <TreeViewRowIcon>
                    { !isLeaf ? (
                        <TreeViewExpandButton
                            id={id && `${id}ExpandButton`}
                            onClick={handleExpandClick}
                        >
                            { nodeIsExpanded ? <ArrowDropDown /> : <ArrowRight /> }
                        </TreeViewExpandButton>
                    ) : null }
                    { selectable && radio && isLeaf ? (
                        <TreeViewRadio
                            id={id && `${id}SelectRadio`}
                            checked={nodeIsAllSelected}
                            onChange={handleRadioChange}
                            onClick={handleClick}
                            disableRipple
                            native
                            value={node.nodeId}
                            disabled={nodeIsDisabled}
                        />
                    ) : null }
                    { selectable && !radio ? (
                        <TreeViewCheckbox
                            id={id && `${id}SelectCheckbox`}
                            checked={nodeIsAnySelected}
                            indeterminate={nodeIsAnySelected && !nodeIsAllSelected}
                            onChange={handleCheckboxChange}
                            onClick={handleClick}
                            disableRipple
                            native
                            disabled={nodeIsDisabled}
                        />
                    ) : null }
                </TreeViewRowIcon>
                <TreeViewRowContent
                    id={id && `${id}Content`}
                >
                    { content }
                </TreeViewRowContent>
            </TreeViewRow>
        )
    }

export default TreeViewNode

function defaultNodeRenderer (str?: string): React.ReactNode {
    return str && (
        <Typography noWrap>{ str }</Typography>
    )
}

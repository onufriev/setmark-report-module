import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTableRootProps } from '../../hooks'
import { TableColSizeData, TableData, TableProps } from '../../types'
import { BaseTableHeaderCell } from './BaseTableHeaderCell'
import { useLocale } from '../../../LocaleProvider'
import { Menu } from '../../../Menu'
import { MenuItem, MenuItemProps } from '../../../MenuItem'
import { Checkbox, CheckboxProps } from '../../../Checkbox'
import { CheckboxClasses } from '../../../../core/classes'
import { getColWidthStyle } from '../../utils'

export type SelectionVariant = 'all' | 'perPage' | 'none'

export type TableHeaderCellCheckboxProps = {
    id?: string
    columnSize?: TableColSizeData
    selected: boolean
    indeterminate: boolean
    onSelect: (selected?: SelectionVariant) => void
}

export function TableHeaderCheckboxCell<T extends TableData>(props: TableHeaderCellCheckboxProps) {
    const { id, columnSize, selected, indeterminate, onSelect } = props

    const { t } = useLocale()

    const rootProps = useTableRootProps() as TableProps<T>

    const {
        pagination,
        disableSelectionAdditionalControls,
        components, componentsProps,
    } = rootProps

    const checkboxRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)

    const showMenu = () => setOpen(true)
    const hideMenu = () => setOpen(false)

    const additionalControlsEnabled = pagination && !disableSelectionAdditionalControls

    const styles = getColWidthStyle(columnSize)

    const { HeaderCheckbox } = components!
    const { headerCheckbox = {} } = componentsProps!

    return (
        <StyledTableHeaderCellCheckbox
            id={id}
            style={styles}
        >
            { HeaderCheckbox ? <HeaderCheckbox {...headerCheckbox} /> : (
                <>
                    <StyledCheckbox
                        id={id && `${id}Checkbox`}
                        checked={selected}
                        indeterminate={indeterminate}
                        inputRef={checkboxRef}
                        onClick={evt => {
                            evt.preventDefault()
                            evt.stopPropagation()

                            if (additionalControlsEnabled) showMenu()
                            else onSelect()
                        }}
                    />

                    { additionalControlsEnabled && (
                        <Menu
                            id={id && `${id}Menu`}
                            onClose={hideMenu}
                            onClick={hideMenu}
                            open={open}
                            anchorEl={checkboxRef.current}
                        >
                            <MenuItem id={id && `${id}AllMenuItem`} onClick={() => onSelect('all')}>
                                { t('table.selectAll') }
                            </MenuItem>
                            <MenuItem id={id && `${id}PerPageMenuItem`} onClick={() => onSelect('perPage')}>
                                { t('table.selectAllOnPage') }
                            </MenuItem>
                            <MenuItem id={id && `${id}NoneMenuItem`} onClick={() => onSelect('none')}>
                                { t('table.deselectAll') }
                            </MenuItem>
                        </Menu>
                    )}
                </>
            )}
        </StyledTableHeaderCellCheckbox>
    )
}

const StyledTableHeaderCellCheckbox = styled(BaseTableHeaderCell)`
    justify-content: center;
`

const StyledCheckbox = styled(Checkbox)<CheckboxProps>`
    &.${CheckboxClasses.root} {
        padding: 6px;
    }
`

export type TablePaginationCheckboxProps = CheckboxProps & {
    onSelect?: (selected?: string) => void
    /**
     * Опции действий
     * По-умолчанию: all - выбрать всё, perPage - выбрать всё на странице, none - снять выделение
     */
    options?: Array<MenuItemProps & {
        label: string
        value: string
    }>
}

export const TablePaginationCheckbox = (props: TablePaginationCheckboxProps) => {
    const { t } = useLocale()

    const {
        id,
        checked,
        indeterminate,
        onClick,
        onSelect,
        options = [
            {
                value: 'all',
                label: t('table.selectAll'),
                id: props.id && `${props.id}AllMenuItem`
            },
            {
                value: 'perPage',
                label: t('table.selectAllOnPage'),
                id: props.id && `${props.id}PerPageMenuItem`
            },
            {
                value: 'none',
                label: t('table.deselectAll'),
                id: props.id && `${props.id}NoneMenuItem`
            },
        ],
        ...restProps
    } = props

    const checkboxRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)

    const showMenu = () => setOpen(true)
    const hideMenu = () => setOpen(false)

    return (
        <>
            <StyledCheckbox
                id={id}
                checked={checked}
                indeterminate={indeterminate}
                inputRef={checkboxRef}
                onClick={evt => {
                    showMenu()
                    onClick?.(evt)
                }}
                {...restProps}
            />

            <Menu
                id={id && `${id}Menu`}
                onClose={hideMenu}
                onClick={hideMenu}
                open={open}
                anchorEl={checkboxRef.current}
            >
                { options.map(option => {
                    const { value, label, onClick, ...restProps } = option
                    return (
                        <MenuItem
                            key={option.value}
                            onClick={evt => {
                                onSelect?.(option.value)
                                onClick?.(evt)
                            }}
                            {...restProps}
                        >
                            { option.label }
                        </MenuItem>
                    )
                }) }
            </Menu>
        </>
    )
}

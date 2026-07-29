import React, { FC } from 'react'
import {
    Tabs as MuiTabs,
    TabsProps as MuiTabsProps
} from '@material-ui/core'
import styled, { css } from 'styled-components'
import { IconButtonClasses, TabClasses } from '../../core/classes'
import { MakeStyled } from '../../typings/utils'

export type TabsProxyProps = {
    showRemoveButton?: boolean
} & MuiTabsProps

const Tabs: FC<TabsProxyProps> = (props): JSX.Element => {
    const { showRemoveButton } = props
    return <StyledTabs $showRemoveButton={showRemoveButton} data-testid="Tabs" {...props} />
}

export default Tabs

const StyledTabs = styled(MuiTabs)<MakeStyled<TabsProxyProps>>`

    .${TabClasses.root} {
        min-height: ${props => props.theme.spacing(6)}px;
        padding-top: 6px;
    }

    .${TabClasses.wrapper} {
        line-height: 18px;
    }

    .${TabClasses.root}.${TabClasses.selected} {
        .${IconButtonClasses.root} {
            color: ${props => props.theme.palette.primary.main}
        }
    }

    .${TabClasses.root}.${TabClasses.disabled} {
        .${IconButtonClasses.root} {
            color: ${props => props.theme.palette.text.disabled}
        }
    }

    ${props => {
        if (props.orientation === 'vertical') {
            return css`
                max-height: calc(100% - 40px)
                flex-shrink: 0;
                border-right: 1px solid ${props => props.theme.palette.divider};
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;

                .${TabClasses.wrapper} {
                    text-transform: none;
                    text-align: left;
                    letter-spacing: normal;
                    flex-direction: ${props.$showRemoveButton ? 'row-reverse' : 'row'};
                    align-items: center;
                    justify-content: space-between;
                }

                .${IconButtonClasses.root} {
                    margin-bottom: 0;
                    margin-left: ${props => props.theme.spacing(1)}px;
                }

                .${TabClasses.root}:not(.${TabClasses.selected}):not(.${TabClasses.disabled}) {
                    color: ${props => props.theme.palette.text.primary};
                }
            `
        } else {
            return css`
                width: ${props.variant === 'fullWidth' ? '100%' : 'auto'};
                border-top-right-radius: inherit;
                border-top-left-radius: inherit;
                background-color: ${props => props.theme.palette.overlay.type3};

                .${TabClasses.wrapper} {
                    flex-direction: ${props.$showRemoveButton ? 'row-reverse' : 'row'};
                }
            `
        }
    }}
`

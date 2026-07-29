import React, { FC } from 'react'
import { Meta } from '@storybook/react'
import { Box } from '../Box'
import { Typography } from '../Typography'

export default {
    title: 'Colors',
    parameters: {
        docs: {
            description: {
                component: 'Цвета используемые в теме',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=2207%3A0',
        },
    },
} as Meta

const widthBox = 118
const heightBox = 125

export const Example: FC<void> = () => (
    <Box>
        <Box display={'flex'} justifyContent={'space-between'} width={1}>
            <Box>
                <Typography variant={'h5'}>Primary:</Typography>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'primary.main'} />
                    <Typography variant={'body1'}>primary.main</Typography>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'primary.contrastText'} />
                    <Box>primary.contrastText</Box>
                </Box>
            </Box>
            <Box>
                <Typography variant={'h5'}>Background:</Typography>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'background.default'} />
                    <Box>background.default</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'background.paper'} />
                    <Box>background.paper</Box>
                </Box>
            </Box>
            <Box>
                <Typography variant={'h5'}>Text:</Typography>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'text.primary'} />
                    <Box>text.primary</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'text.secondary'} />
                    <Box>text.secondary</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'text.disabled'} />
                    <Box>text.disabled</Box>
                </Box>
            </Box>

            <Box>
                <Typography variant={'h5'}>Overlay:</Typography>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'overlay.type1'} />
                    <Box>overlay.type1</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'overlay.type2'} />
                    <Box>overlay.type2</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'overlay.type3'} />
                    <Box>overlay.type3</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'overlay.hover'} />
                    <Box>overlay.hover</Box>
                </Box>
            </Box>
            <Box>
                <Typography variant={'h5'}>Other:</Typography>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'divider'} />
                    <Box>divider</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'success.main'} />
                    <Box>success.main</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'error.main'} />
                    <Box>error.main</Box>
                </Box>
                <Box>
                    <Box width={widthBox} height={heightBox} bgcolor={'divider'} />
                    <Box>divider</Box>
                </Box>
            </Box>
        </Box>
    </Box>
)

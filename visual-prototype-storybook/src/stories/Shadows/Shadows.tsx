import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core'
import { Box } from '../Box'

const useStyles = makeStyles((theme) => ({
    common: {
        marginBottom: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

const Shadows: FC = () => {
    const styles = useStyles()

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box
                boxShadow={3}
                width={1}
                height={56}
                bgcolor="primary.main"
                className={styles.common}
            >
                shadows 3
            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <Box
                    boxShadow={0}
                    width={400}
                    height={100}
                    bgcolor="background.paper"
                    className={styles.common}
                >
                    shadows 0
                </Box>
                <Box
                    boxShadow={1}
                    width={400}
                    height={100}
                    bgcolor="background.paper"
                    className={styles.common}
                >
                    shadows 1
                </Box>
                <Box
                    boxShadow={2}
                    width={400}
                    height={100}
                    bgcolor="background.paper"
                    className={styles.common}
                >
                    shadows 2
                </Box>
            </Box>
        </Box>
    )
}

export default Shadows

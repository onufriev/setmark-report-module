import React, { ComponentProps } from 'react'
import Link from './Link'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Link',
    component: Link,
} as Meta

const Template: Story<ComponentProps<typeof Link>> = (args) => (
    <Link {...args} onClick={action('click')}>
        Link
    </Link>
)

export const Example = Template.bind({})
Example.args = {
    underline: 'none',
}

module.exports = {
    stories: [
        '../src/stories/**/*.stories.mdx',
        '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
        '../src/setmark/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        {
            name: '@storybook/addon-essentials',
            options: {
                docs: {
                    configureJSX: true
                },
                backgrounds: false,
                measure: false
            }
        },
        'storybook-addon-designs',
        'storybook-addon-themes'
    ],
    typescript: {
        check: true,
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) =>
                prop.parent
                    ? /@material-ui/.test(prop.parent.fileName) ||
                      !/node_modules/.test(prop.parent.fileName)
                    : true,
            compilerOptions: {
                allowSyntheticDefaultImports: true
            }
        }
    }
}

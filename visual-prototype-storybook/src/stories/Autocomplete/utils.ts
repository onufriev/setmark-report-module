import { AutocompleteCreateFilterOptionsConfig, AutocompleteFilterOptions } from './types'

export function createFilterOptions<T>(config: AutocompleteCreateFilterOptionsConfig<T> = {}): AutocompleteFilterOptions<T> {
    const {
        ignoreCase = true,
        limit,
        matchFrom = 'any',
        stringify,
        trim = false,
    } = config

    return (options, { inputValue, getOptionLabel }) => {
        if (!options) return []

        let input = trim ? inputValue.trim() : inputValue

        if (ignoreCase) {
            input = input.toLowerCase()
        }

        const filteredOptions = options.filter((option) => {
            let candidate = (stringify || getOptionLabel)(option)

            if (ignoreCase) {
                candidate = candidate.toLowerCase()
            }

            return matchFrom === 'start' ? candidate.indexOf(input) === 0 : candidate.indexOf(input) > -1
        })

        return typeof limit === 'number' ? filteredOptions.slice(0, limit) : filteredOptions
    }
}

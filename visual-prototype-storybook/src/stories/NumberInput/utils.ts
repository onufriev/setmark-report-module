import isNil from 'lodash/isNil'

export type NumberInputDataType = 'int' | 'decimal' | 'currency' | 'unit'
export const INT: NumberInputDataType = 'int'
export const DECIMAL: NumberInputDataType = 'decimal'
export const CURRENCY: NumberInputDataType = 'currency'
export const UNIT: NumberInputDataType = 'unit'

export const NUMBER_REGEX = /^[\+\-]?\d*\.?\d*(?:[Ee][\+\-]?\d+)?$/
export const NUMBER_INPUT_REGEX = /^[\+\-]?\d*\.?\d*(?:[Ee][\+\-]?\d*)?$/

export const parseStringToNumber = (value: string, type?: string): number | bigint | null => {
    if (!value) return null

    const cleared = value
        .trim()
        .replace(/\s/g, '')

    if (!NUMBER_REGEX.test(cleared) || Number.isNaN(+cleared)) {
        return null
    }

    return type === 'bigint' ? BigInt(cleared) : +cleared
}

/**
 * @deprecated
 */
export const stringToNumber = (value: string): number | null => {
    if (!value)
        return null
    try {
        const result = Number(value.replace(/,/g, '.').replace(/\s/g, ''))
        return isNaN(result) ? null : result
    }
    catch (error) {
        return null
    }
}

/**
 * @deprecated
 */
export const createFormattedNumberMask = (dataType: NumberInputDataType, rounding?: number): RegExp => {
    if (rounding === void 0) { rounding = 0 }
    let fraction = ''
    if (dataType === DECIMAL && rounding > 0) {
        fraction = "[,.]?\\d{0," + Math.floor(rounding) + "}"
    }
    const minus = dataType === DECIMAL ? '-?' : ''
    /**
     * Любое сочетание цифр и пробелов, т.к. в результате редактирование пользователь может степерь любую часть
     */
    const mainDigit = '[\\s\\d]*'
    const mask = "^" + minus + mainDigit + fraction + "$"
    return new RegExp(mask)
}

/**
 * @deprecated
 */
export const createNumberMask = (dataType: NumberInputDataType, rounding?: number): RegExp => {
    if (rounding === void 0) { rounding = 0 }
    let fraction = ''
    if (dataType === DECIMAL && rounding > 0) {
        fraction = "[,.]?\\d{0," + Math.floor(rounding) + "}"
    }
    const minus = dataType === DECIMAL ? '-?' : ''
    const mask = "^" + minus + "\\d*" + fraction + "$"
    return new RegExp(mask)
}

/**
 * @deprecated
 */
export const fixNumberBoundaries = (value: number | null, min?: number | null, max?: number | null, dataType?: NumberInputDataType, rounding?: number): number | null => {
    if (min === void 0) { min = null }
    if (max === void 0) { max = null }
    if (dataType === void 0) { dataType = INT }
    if (rounding === void 0) { rounding = 0 }
    let fixedValue = value
    if (isNil(fixedValue))
        fixedValue = 0
    if (!isNil(min) && Number(value) < min)
        fixedValue = min
    if (!isNil(max) && Number(value) > max)
        fixedValue = max
    if (dataType === INT || (dataType === DECIMAL && rounding === 0)) {
        fixedValue = Math.floor(fixedValue)
    }
    else if (dataType === DECIMAL) {
        let formattedValue = String(fixedValue)
        let formattedValueSplitted = formattedValue.split('.')
        if (formattedValue.indexOf('.') > -1 && formattedValueSplitted[1].length > rounding) {
            formattedValue = formattedValueSplitted[0] + "." + formattedValueSplitted[1].substr(0, rounding)
            fixedValue = stringToNumber(formattedValue)
        }
    }
    return fixedValue
}

export function isValidNumber (value?: number | bigint): boolean {
    return !Number.isNaN(value) && ((typeof value === 'number' && Number.isFinite(value)) || typeof value === 'bigint')
}

/** Аналог Math.min и Math.max для BigInt */
const bigIntMax = (...nums: Array<bigint | number>) => nums.reduce((m, e) => e > m ? e : m)
const bigIntMin = (...nums: Array<bigint | number>) => nums.reduce((m, e) => e < m ? e : m)

/** Ограничивает число заданным диапазоном */
export function minmax <T extends number | bigint> (value: T, min?: T, max?: T) {
    if (isNil(min) && isNil(max)) return value

    if (typeof value === 'bigint' || typeof max === 'bigint' || typeof min === 'bigint') {
        if (isNil(min)) return bigIntMin(value, max!)
        if (isNil(max)) return bigIntMax(value, min!)
        return bigIntMin(bigIntMax(value, min), max)
    }

    if (isNil(min)) return Math.min(value, max!)
    if (isNil(max)) return Math.max(value, min!)
    return Math.min(Math.max(value, min), max)
}

/** Подрезает число до указанной длины после запятой */
export function truncate (value: number, length: number = 2): number {
    if (length === 0) return Math.trunc(value)

    let [int, frac] = String(value).split('.')

    if (!frac || frac.length <= length) return value

    if (!int) int = '0'

    return Number(`${int}.${frac.slice(0, length)}`)
}

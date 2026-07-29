import {
    NUMBER_INPUT_REGEX,
    NUMBER_REGEX,
    truncate,
    isValidNumber,
    parseStringToNumber,
    minmax
} from './utils'

describe('[NumberInput] utils', () => {

    it('number regex', () => {
        expect(NUMBER_REGEX.test('0')).toBe(true)
        expect(NUMBER_REGEX.test('1')).toBe(true)
        expect(NUMBER_REGEX.test('100')).toBe(true)
        expect(NUMBER_REGEX.test('100.')).toBe(true)
        expect(NUMBER_REGEX.test('100.1')).toBe(true)
        expect(NUMBER_REGEX.test('100.1535474')).toBe(true)
        expect(NUMBER_REGEX.test('-1')).toBe(true)
        expect(NUMBER_REGEX.test('-0')).toBe(true)
        expect(NUMBER_REGEX.test('+1')).toBe(true)
        expect(NUMBER_REGEX.test('+0')).toBe(true)
        expect(NUMBER_REGEX.test('1e10')).toBe(true)
        expect(NUMBER_REGEX.test('1.e10')).toBe(true)
        expect(NUMBER_REGEX.test('1.1e10')).toBe(true)
        expect(NUMBER_REGEX.test('1.10e10')).toBe(true)
        expect(NUMBER_REGEX.test('1e-10')).toBe(true)
        expect(NUMBER_REGEX.test('1e+10')).toBe(true)
        expect(NUMBER_REGEX.test('-1e10')).toBe(true)
        expect(NUMBER_REGEX.test('-1e-10')).toBe(true)
        expect(NUMBER_REGEX.test('-1e+10')).toBe(true)
        expect(NUMBER_REGEX.test('+1e10')).toBe(true)
        expect(NUMBER_REGEX.test('+1e-10')).toBe(true)
        expect(NUMBER_REGEX.test('+1e+10')).toBe(true)
        expect(NUMBER_REGEX.test('100,12')).toBe(false)
        expect(NUMBER_REGEX.test('1200a153')).toBe(false)
        expect(NUMBER_REGEX.test('-1200a153')).toBe(false)
        expect(NUMBER_REGEX.test('+1200a153')).toBe(false)
    })

    it('number input regex', () => {
        expect(NUMBER_INPUT_REGEX.test('-')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('0')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('100')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('100.')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('100.1')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('100.1535474')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('-1')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('-0')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+1')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+0')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1.e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1.1e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1.10e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1e-10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('1e+10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('-1e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('-1e-10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('-1e+10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+1e10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+1e-10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('+1e+10')).toBe(true)
        expect(NUMBER_INPUT_REGEX.test('100,12')).toBe(false)
        expect(NUMBER_INPUT_REGEX.test('1200a153')).toBe(false)
        expect(NUMBER_INPUT_REGEX.test('-1200a153')).toBe(false)
        expect(NUMBER_INPUT_REGEX.test('+1200a153')).toBe(false)
    })

    it('truncate', () => {
        expect(truncate(10, 2)).toBe(10)
        expect(truncate(10.1, 2)).toBe(10.1)
        expect(truncate(10.12, 2)).toBe(10.12)
        expect(truncate(10.123, 2)).toBe(10.12)

        expect(truncate(-10, 2)).toBe(-10)
        expect(truncate(-10.1, 2)).toBe(-10.1)
        expect(truncate(-10.12, 2)).toBe(-10.12)
        expect(truncate(-10.123, 2)).toBe(-10.12)

        expect(truncate(0, 2)).toBe(0)
        expect(truncate(.1, 2)).toBe(.1)
        expect(truncate(.12, 2)).toBe(.12)
        expect(truncate(.123, 2)).toBe(.12)

        expect(truncate(-10.125, 0)).toBe(-10)
        expect(truncate(10.125, 0)).toBe(10)
        expect(truncate(.015, 0)).toBe(0)
        expect(truncate(0.103, 0)).toBe(0)
    })

    it('isValidNumber', () => {
        expect(isValidNumber(231)).toBe(true)
        expect(isValidNumber(-231)).toBe(true)
        expect(isValidNumber(0)).toBe(true)
        expect(isValidNumber(1000000000000000000n)).toBe(true)
        expect(isValidNumber(-1000000000000000000n)).toBe(true)
        expect(isValidNumber(Infinity)).toBe(false)
        expect(isValidNumber(-Infinity)).toBe(false)
        expect(isValidNumber(undefined)).toBe(false)
        expect(isValidNumber(NaN)).toBe(false)
    })

    it('parseStringToNumber', () => {
        expect(parseStringToNumber('0')).toBe(0)
        expect(parseStringToNumber('10')).toBe(10)
        expect(parseStringToNumber('-32310')).toBe(-32310)
        expect(parseStringToNumber('1000000000000000023232', 'bigint')).toBe(1000000000000000023232n)
        expect(parseStringToNumber('-1000000000000000023232', 'bigint')).toBe(-1000000000000000023232n)
    })

    it('minmax', () => {
        expect(minmax(10, 1, 2)).toBe(2)
        expect(minmax(1, 2, 3)).toBe(2)
        expect(minmax(10, 1, 100)).toBe(10)
        expect(minmax(10000000000000000n, 1000000000000000n, 1000000000000000000n)).toBe(10000000000000000n)
        expect(minmax(10000000000000000n, 100000000000000000n, 1000000000000000000n)).toBe(100000000000000000n)
        expect(minmax(100000000000000000000n, 100000000000000000n, 1000000000000000000n)).toBe(1000000000000000000n)
    })
})

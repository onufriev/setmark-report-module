import { getFixedPageIfOutOfRange } from './utils'

describe('[Table] utils', () => {
    it('getFixedPageIfOutOfRange, total = 0', () => {
        expect(getFixedPageIfOutOfRange(0, 10, 0)).toEqual(0)
        expect(getFixedPageIfOutOfRange(1, 10, 0)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 10, 0)).toEqual(0)
    })

    it('getFixedPageIfOutOfRange, pageSize = 10', () => {
        expect(getFixedPageIfOutOfRange(-1, 10, 11)).toEqual(0)

        expect(getFixedPageIfOutOfRange(1, 10, 11)).toEqual(1)
        expect(getFixedPageIfOutOfRange(2, 10, 11)).toEqual(1)
        expect(getFixedPageIfOutOfRange(3, 10, 11)).toEqual(1)

        expect(getFixedPageIfOutOfRange(0, 10, 10)).toEqual(0)
        expect(getFixedPageIfOutOfRange(1, 10, 10)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 10, 10)).toEqual(0)

        expect(getFixedPageIfOutOfRange(1, 10, 9)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 10, 9)).toEqual(0)
        expect(getFixedPageIfOutOfRange(3, 10, 9)).toEqual(0)

        expect(getFixedPageIfOutOfRange(4, 10, 39)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 10, 40)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 10, 41)).toEqual(4)
    })

    it('getFixedPageIfOutOfRange, pageSize = 25', () => {
        expect(getFixedPageIfOutOfRange(-1, 25, 26)).toEqual(0)

        expect(getFixedPageIfOutOfRange(1, 25, 26)).toEqual(1)
        expect(getFixedPageIfOutOfRange(2, 25, 26)).toEqual(1)
        expect(getFixedPageIfOutOfRange(3, 25, 26)).toEqual(1)

        expect(getFixedPageIfOutOfRange(0, 25, 25)).toEqual(0)
        expect(getFixedPageIfOutOfRange(1, 25, 25)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 25, 25)).toEqual(0)

        expect(getFixedPageIfOutOfRange(1, 25, 24)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 25, 24)).toEqual(0)
        expect(getFixedPageIfOutOfRange(3, 25, 24)).toEqual(0)

        expect(getFixedPageIfOutOfRange(4, 25, 99)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 25, 100)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 25, 101)).toEqual(4)
    })

    it('getFixedPageIfOutOfRange, pageSize = 50', () => {
        expect(getFixedPageIfOutOfRange(-1, 50, 51)).toEqual(0)

        expect(getFixedPageIfOutOfRange(1, 50, 51)).toEqual(1)
        expect(getFixedPageIfOutOfRange(2, 50, 51)).toEqual(1)
        expect(getFixedPageIfOutOfRange(3, 50, 51)).toEqual(1)

        expect(getFixedPageIfOutOfRange(0, 50, 50)).toEqual(0)
        expect(getFixedPageIfOutOfRange(1, 50, 50)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 50, 50)).toEqual(0)

        expect(getFixedPageIfOutOfRange(0, 50, 49)).toEqual(0)
        expect(getFixedPageIfOutOfRange(1, 50, 49)).toEqual(0)
        expect(getFixedPageIfOutOfRange(2, 50, 49)).toEqual(0)

        expect(getFixedPageIfOutOfRange(4, 50, 199)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 50, 200)).toEqual(3)
        expect(getFixedPageIfOutOfRange(4, 50, 201)).toEqual(4)
    })
})

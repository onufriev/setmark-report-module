/**
 * https://github.com/nuragic/Intl.NumberFormatParse
 */

const SYMBOLS: Record<string, string> = {
    unit: 'unit',
    currency: 'currency',
    percent: 'percentSign',
}

export default class NumberFormatParse {
    formatter: Intl.NumberFormat
    numeralRegExp: RegExp = new RegExp('')
    groupRegExp: RegExp = new RegExp('')
    decimalRegExp: RegExp = new RegExp('')
    symbolKey: string = ''
    symbol: string = ''

    private indexMap: Map<string, number>

    constructor (locale: string, options?: Intl.NumberFormatOptions) {
        options = {
            style: 'decimal',
            ...options
        }

        this.formatter = new Intl.NumberFormat(locale, options)

        const parts = this.formatter.formatToParts(12345.6789)

        const groupPart = parts.find((d) => d.type === 'group')
        const decimalPart = parts.find((d) => d.type === 'decimal')

        const numerals = [
            ...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210),
        ].reverse()

        this.indexMap = new Map(numerals.map((digit, i) => [digit, i]))

        this.numeralRegExp = new RegExp(`[${numerals.join('')}]`, 'g')

        if (groupPart) {
            this.groupRegExp = new RegExp(`[${groupPart.value}]`, 'g')
        }

        if (decimalPart) {
            this.decimalRegExp = new RegExp(`[${decimalPart.value}]`)
        }

        if (options.style != null && options.style !== 'decimal') {
            this.symbolKey = SYMBOLS[options.style]
            this.symbol = parts.find(part => part.type === this.symbolKey)?.value || ''
        }
    }

    parse (str: string) {
        const parsed = str
            .trim()
            // заменяем любые пробелы на неразрывной пробел
            .replace(/[\s]/g, '\u00a0')
            // @ts-ignore
            .replace(this.groupRegExp, '')
            // @ts-ignore
            .replace(this.decimalRegExp, '.')
            .replace(this.numeralRegExp, substr => String(this.getIndex(substr)))

        return parsed ? +parsed : NaN
    }

    stringify (num: number) {
        if (this.symbolKey) {
            const parts = this.formatToParts(num)
            return parts
                .map((p) => (p.type === this.symbolKey ? '' : p.value))
                .join('')
                .trim()
        }

        return this.format(num)
    }

    format (num: number) {
        if (num == null || Number.isNaN(num) || !Number.isFinite(num)) {
            throw new RangeError('Invalid number!')
        }
        return this.formatter.format(num)
    }

    formatToParts (num: number) {
        if (num == null || Number.isNaN(num) || !Number.isFinite(num)) {
            throw new RangeError('Invalid number!')
        }
        return this.formatter.formatToParts(num)
    }

    resolvedOptions () {
        return this.formatter.resolvedOptions()
    }

    private getIndex (digit: string): number {
        return this.indexMap.get(digit)!
    }
}

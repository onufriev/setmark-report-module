import faker from 'faker'

export type ShopVO = {
    id: number
    number: number
    name: string
    city: string
}

export const mockFilterRequest = () => {
    let items = getFakeOptions(500)

    return (value?: string) => new Promise<string[]>(resolve => {
        setTimeout(() => {
            if (value) resolve(items.filter(item => item.toLowerCase().includes(value.toLowerCase())))
            else resolve(items)
        }, 500)
    })
}

export const mockInfiniteRequest = () => {
    let items = getFakeOptions(500)

    return (value: string, page: number, itemsOnPage: number) => new Promise<{
        items: string[]
        itemsOnPage: number
        page: number
        totalCount: number
    }>(resolve => {
        const filtered = value ? items.filter(item => item.toLowerCase().includes(value.toLowerCase())) : items
        setTimeout(() => {
            resolve({
                items: filtered.slice(itemsOnPage * page, itemsOnPage * (page + 1)),
                itemsOnPage,
                page,
                totalCount: filtered.length
            })
        }, 500)
    })
}

interface RequestOptions {
    signal?: AbortSignal
    delay?: number
    randomError?: boolean
}

export const mockShopRequests = (fakeShopsCount: number = 500) => {
    let items = getFakeShops(fakeShopsCount)

    return {
        items,
        getShops: (value?: string, options: RequestOptions = {}) => new Promise<ShopVO[]>((resolve, reject) => {
            const { signal, delay = 500, randomError } = options
            if (signal) {
                signal.addEventListener('abort', () => reject(new Error('Request aborted')), { once: true })
            }

            setTimeout(() => {
                if (signal?.aborted) return

                if (randomError && Math.random() < 0.4) {
                    reject(new Error('Request error'))
                }

                if (value) {
                    resolve(items.filter(item =>
                        item.name.toLowerCase().includes(value.toLowerCase()) ||
                        String(item.number).includes(value.toLowerCase())
                    ))
                } else {
                    resolve(items)
                }
            }, delay)
        }),
        getShopsByNumbers: (numbers: number[], options: RequestOptions = {}) => new Promise<ShopVO[]>((resolve, reject) => {
            const { signal, delay = 2000, randomError } = options
            if (signal) {
                signal.addEventListener('abort', () => reject(new Error('Request aborted')), { once: true })
            }

            setTimeout(() => {
                if (signal?.aborted) return

                if (randomError && Math.random() < 0.4) {
                    reject(new Error('Request error'))
                }

                if (numbers?.length > 0) {
                    resolve(items.filter(item => numbers.includes(item.number)))
                } else {
                    resolve(items)
                }
            }, delay)
        }),
    }
}

export const getFakeFixedOptions = (count: number = 100): string[] => [...new Array(count)]
    .map((_, index) => `Value ${index}`)

export const getFakeOptions = (count: number = 100): string[] => [...new Array(count)]
    .map((_, index) => `${faker.name.firstName()} ${faker.name.lastName()}`)

export const getFakeShops = (count: number = 100): ShopVO[] => [...new Array(count)]
    .map((_, index) => ({
        id: index,
        number: index + 1,
        name: faker.company.companyName(),
        city: faker.address.cityName()
    }))

export const delay = (timeout: number) => new Promise((res) => setTimeout(res, timeout))

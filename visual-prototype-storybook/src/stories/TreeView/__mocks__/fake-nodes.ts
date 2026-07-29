import faker from 'faker'
import fakeGroupingTree from './fake-grouping-tree.json'

export interface FakeNode {
    nodeId: number | string
    name: string
    address?: string
    children?: FakeNode[]
}

export function getFakeNodes (): FakeNode[] {
    return [
        {
            nodeId: 1,
            name: 'Region 1',
            children: [
                {
                    nodeId: 2,
                    name: 'City 2',
                    children: [
                        {
                            nodeId: 3,
                            name: 'Shop 3',
                        },
                        {
                            nodeId: 4,
                            name: 'Shop 4',
                        },
                        {
                            nodeId: 5,
                            name: 'Shop 5',
                        },
                        {
                            nodeId: 6,
                            name: 'Shop 6',
                        }
                    ]
                },
                {
                    nodeId: 7,
                    name: 'City 7',
                    children: [
                        {
                            nodeId: 8,
                            name: 'Shop 8',
                        },
                        {
                            nodeId: 9,
                            name: 'Shop 9',
                        },
                    ]
                }
            ]
        },
        {
            nodeId: 10,
            name: 'Region 10',
            children: [
                {
                    nodeId: 11,
                    name: 'City 11',
                    children: [
                        {
                            nodeId: 12,
                            name: 'Shop 12',
                        },
                        {
                            nodeId: 13,
                            name: 'Shop 13',
                        },
                    ]
                },
                {
                    nodeId: 14,
                    name: 'City 14',
                    children: [
                        {
                            nodeId: 15,
                            name: 'Shop 15',
                        },
                        {
                            nodeId: 16,
                            name: 'Shop 16',
                        },
                        {
                            nodeId: 17,
                            name: 'Shop 17',
                        },
                        {
                            nodeId: 18,
                            name: 'Shop 18',
                        }
                    ]
                }
            ]
        }
    ]
}

export function getManyFakeNodes (longName?: boolean): FakeNode[] {
    return [...new Array(faker.datatype.number({ min: 2, max: 6 }))].map((_, i1) => ({
        nodeId: `${i1}`,
        name: `Country ${i1}` + (longName ? ` __ ${faker.lorem.paragraph(1)}` : ''),
        address: faker.address.country(),
        children: [...new Array(faker.datatype.number({ min: 5, max: 15 }))].map((_, i2) => ({
            nodeId: `${i1}.${i2}`,
            name: `Region ${i1}.${i2}` + (longName ? ` __ ${faker.lorem.paragraph(1)}` : ''),
            address: faker.address.state(),
            children: [...new Array(faker.datatype.number({ min: 10, max: 30 }))].map((_, i3) => ({
                nodeId: `${i1}.${i2}.${i3}`,
                name: `City ${i1}.${i2}.${i3}` + (longName ? ` __ ${faker.lorem.paragraph(1)}` : ''),
                address: faker.address.city(),
                children: [...new Array(faker.datatype.number({ min: 20, max: 60 }))].map((_, i4) => ({
                    nodeId: `${i1}.${i2}.${i3}.${i4}`,
                    name: `Shop ${i1}.${i2}.${i3}.${i4}` + (longName ? ` __ ${faker.lorem.paragraph(1)}` : ''),
                    address: faker.address.streetAddress(),
                }))
            }))
        }))
    }))
}

export function getFakeTopology () {
    return {
        "formats": [
            {
                "nodeId": 1,
                "name": "Формат сети"
            }
        ],
        "regions": [
            {
                "nodeId": 2389,
                "name": "TestRegion",
                "shopsCount": 2
            }
        ],
        "cities": [
            {
                "nodeId": 2390,
                "name": "TestCity",
                "timeZone": "0",
                "region": {
                    "nodeId": 2389,
                    "name": "TestRegion",
                    "shopsCount": 2
                },
                "shopsCount": 2
            }
        ],
        "shops": [
            {
                "nodeId": -2,
                "number": 3207,
                "name": "VirtShop",
                "twentyFourHour": false,
                "city": {
                    "nodeId": 2390,
                    "name": "TestCity",
                    "timeZone": "0",
                    "region": {
                        "nodeId": 2389,
                        "name": "TestRegion",
                        "shopsCount": 2
                    },
                    "shopsCount": 2
                },
                "format": {
                    "nodeId": 1,
                    "name": "Формат сети"
                },
                "physicalAdress": null,
                "centrumUrl": null,
                "version": {
                    "productVersion": 10,
                    "productSubversion": 3,
                    "releaseVersion": 0,
                    "patchVersion": 0
                },
                "address": "200100, Spb ul. Savushkina 2104",
                "virtual": true
            },
            {
                "nodeId": -1,
                "number": 3208,
                "name": "RealShop",
                "twentyFourHour": false,
                "city": {
                    "nodeId": 2390,
                    "name": "TestCity",
                    "timeZone": "0",
                    "region": {
                        "nodeId": 2389,
                        "name": "TestRegion",
                        "shopsCount": 2
                    },
                    "shopsCount": 2
                },
                "format": {
                    "nodeId": 1,
                    "name": "Формат сети"
                },
                "physicalAdress": null,
                "centrumUrl": null,
                "version": {
                    "productVersion": 10,
                    "productSubversion": 3,
                    "releaseVersion": 13,
                    "patchVersion": 0
                },
                "address": "199100, Spb, Savushkina, 112",
                "virtual": false
            }
        ]
    }
}

export interface GroupingNodeVO {
    amount?: number
    includes?: string[] | null
    excludes?: string[] | null
    goodsType?: string | null
    goodsTypeName?: string | null
    goodsSubType?: string | null
    startPrice?: number | null
    startAction?: number | null
    priceNumber?: number | null
    directionPriceChange?: number | null
    section?: string | null
    sectionName?: string | null
    goodsGroup?: string | null
    goodsGroupName?: string | null
    action?: string | null
    priceTag?: string | null
}

export function getFakeGroupingTree (): Promise<GroupingNodeVO[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(fakeGroupingTree as GroupingNodeVO[])
        }, 1)
    })
}

export interface ObjectVO {
    id: string
    label: string
}

export function getFakeObjects (count: number = 100): Promise<ObjectVO[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...new Array(count)].map((_, index) => ({
                id: String(index),
                label: `Object ${index}`
            })))
        }, 1)
    })
}

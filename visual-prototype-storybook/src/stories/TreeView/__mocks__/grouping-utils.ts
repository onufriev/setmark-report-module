import { format } from 'date-fns'
import isNil from 'lodash/isNil'
import { GroupingNodeVO } from './fake-nodes'

export enum Groupings {
    /**
     * Фиктивная группировка
     */
    All = 'all',
    /**
     * Начало действия цены
     */
    StartPrice = 'startPrice',
    /**
     * Начало действия акции
     */
    StartAction = 'startAction',
    /**
     * Номер цены
     */
    PriceNumber = 'priceNumber',
    /**
     * Тип товара
     */
    GoodsType = 'goodsType',
    /**
     * Подтип товара
     */
    GoodsSubType = 'goodsSubType',
    /**
     * Секция
     */
    Section = 'section',
    /**
     * Группа товаров
     */
    GoodsGroup = 'goodsGroup',
    /**
     * Акция
     */
    Action = 'action',
    /**
     * Ценник
     */
    PriceTag = 'priceTag',
    /**
     * Направление изменения цен
     */
    DirectionPriceChange = 'directionPriceChange',
}

export const ORDERED_GROUPINGS = [
    Groupings.StartPrice,
    Groupings.PriceNumber,
    Groupings.GoodsType,
    Groupings.GoodsSubType,
    Groupings.Section,
    Groupings.GoodsGroup,
    // Groupings.DirectionPriceChange,
]

export const getGroupingName = (id: string): string => {
    switch (id) {
        case Groupings.All:
            return 'Все записи без группировки'
        case Groupings.StartPrice:
            return 'Начало действия цены'
        case Groupings.StartAction:
            return 'Начало действия акции'
        case Groupings.PriceNumber:
            return 'Номер цены'
        case Groupings.GoodsType:
            return 'Тип товара'
        case Groupings.GoodsSubType:
            return 'Подтип товара'
        case Groupings.Section:
            return 'Секция'
        case Groupings.GoodsGroup:
            return 'Группа товаров'
        case Groupings.Action:
            return 'Акция'
        case Groupings.PriceTag:
            return 'Ценник'
        case Groupings.DirectionPriceChange:
            return 'Направление изменения цен'
        default:
            return ''
    }
}

export const EMPTY_VALUE = 'EmptyValue'

export const PriceNumber0 = 0
export const PriceNumber1 = 1
export const PriceNumber2 = 2
export const PriceNumber3 = 3
export const PriceNumber4 = 4

export const getPriceNumberValueName = (value: GroupingNodeVO['priceNumber']): string => {
    switch (value) {
        case PriceNumber0:
            return 'Нет изменения цены'
        case PriceNumber1:
        case PriceNumber2:
        case PriceNumber3:
        case PriceNumber4:
            return `Изменение цены ${value}`
        default:
            return 'Неизвестное значение'
    }
}

export const getStartActionValueName = (value: GroupingNodeVO['startPrice'] | GroupingNodeVO['startAction']): string => {
    if (!value) return 'Неизвестное значение'

    return format(value, 'dd.MM.yyyy HH')
}

export const getGoodsTypeValueName = (node: GroupingNodeVO): string => {
    const valueFromBack = node[Groupings.GoodsType]

    if (valueFromBack === EMPTY_VALUE) return 'Нет типа'

    // @ts-ignore
    const nameFromBack = node[Groupings.GoodsType + 'Name']

    if (isNil(nameFromBack)) return 'Неизвестное значение'

    return nameFromBack
}

export const GoodsSubTypeChild = 'child'
export const GoodsSubTypeEnergyDrink = 'energy'
export const GoodsSubTypePyrotechnics = 'pyro'
export const GoodsSubTypeExcise = 'excise'
export const GoodsSubTypeSocial = 'social'

export const getGoodsSubTypeValueName = (value: GroupingNodeVO['goodsSubType']): string => {
    switch (value) {
        case EMPTY_VALUE:
            return 'Нет подтипа'
        case GoodsSubTypeChild:
            return 'Детский'
        case GoodsSubTypeEnergyDrink:
            return 'Энергетик'
        case GoodsSubTypePyrotechnics:
            return 'Пиротехника'
        case GoodsSubTypeExcise:
            return 'Акцизный'
        case GoodsSubTypeSocial:
            return 'Социальный'
        default:
            return 'Прочие'
    }
}

export const getGoodsGroupValueName = (node: GroupingNodeVO): string => {
    const valueFromBack = node[Groupings.GoodsGroup]

    if (valueFromBack === EMPTY_VALUE) return 'Нет группы'

    // @ts-ignore
    const nameFromBack = node[Groupings.GoodsGroup + 'Name']

    if (isNil(nameFromBack)) return 'Неизвестное значение'

    return nameFromBack
}

export const getSectionValueName = (node: GroupingNodeVO): string => {
    const valueFromBack = node[Groupings.Section]

    if (valueFromBack === EMPTY_VALUE) return 'Нет секции'

    // @ts-ignore
    const nameFromBack = node[Groupings.Section + 'Name']

    if (isNil(nameFromBack)) return 'Неизвестное значение'

    return nameFromBack
}

export const getActionValueName = (node: GroupingNodeVO): string => {
    const valueFromBack = node[Groupings.Action]

    if (valueFromBack === EMPTY_VALUE) return 'Нет акции'

    if (isNil(valueFromBack)) return 'Неизвестное значение'

    return valueFromBack
}

export const PriceTagAdditional = 'ADDITIONAL'
export const PriceTagReplacement = 'REPLACEMENT'

export const getPriceTagValueName = (value: GroupingNodeVO['priceTag']): string => {
    switch (value) {
        case PriceTagAdditional:
            return 'ДОП'
        case PriceTagReplacement:
            return 'ЗАМ'
        default:
            return 'Неизвестное значение'
    }
}

export const DirectionPriceChangeNoChanged = 0
export const DirectionPriceChangeIncrease = 1
export const DirectionPriceChangeDecrease = 2
export const DirectionPriceChangeMixed = 3

export const getDirectionPriceChangeValueName = (value: GroupingNodeVO['directionPriceChange']): string => {
    switch (value) {
        case DirectionPriceChangeNoChanged:
            return 'Без изменений'
        case DirectionPriceChangeIncrease:
            return 'Увеличение цен'
        case DirectionPriceChangeDecrease:
            return 'Уменьшение цен'
        case DirectionPriceChangeMixed:
            return 'Смешанное направление'
        default:
            return 'Неизвестное значение'
    }
}

export function getLocalizedGroupValueName(groupId: string, groupValue: GroupingNodeVO): string {
    switch (groupId) {
        case Groupings.All:
            return getGroupingName(Groupings.All)
        case Groupings.StartPrice:
        case Groupings.StartAction:
            return getStartActionValueName(groupValue[groupId])
        case Groupings.PriceNumber:
            return getPriceNumberValueName(groupValue[groupId])
        case Groupings.GoodsSubType:
            return getGoodsSubTypeValueName(groupValue[groupId])
        case Groupings.PriceTag:
            return getPriceTagValueName(groupValue[groupId])
        case Groupings.DirectionPriceChange:
            return getDirectionPriceChangeValueName(groupValue[groupId])
        case Groupings.GoodsType:
            return getGoodsTypeValueName(groupValue)
        case Groupings.Section:
            return getSectionValueName(groupValue)
        case Groupings.GoodsGroup:
            return getGoodsGroupValueName(groupValue)
        case Groupings.Action:
            return getActionValueName(groupValue)
        default:
            // @ts-ignore
            return groupValue[groupId + 'Name'] || 'Неизвестное значение'
    }
}

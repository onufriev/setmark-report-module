import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import isNil from 'lodash/isNil'
import { v4 as uuid } from 'uuid'
import { Key } from 'react'

/**
 * Возвращает значение поля объекта при указании пути к этому полю,
 * если @param item не является объектом, возвращается item
 * если путь не указан, то возвращается сам объект
 * Используется для визуализации объектов в компонентах.
 *
 * @param item объект, значение поля которого нужно узнать, может иметь простой тип(string, number, boolean)
 * @param {string} field полный путь к извлекаемому значению, например: "someField.internalField.otherField.value"
 * @returns {any}
 */
// @ts-ignore
export const getFieldValue = <T>(item: T, field: string = null): any => {
    if (isNil(item) || !field || (typeof item !== 'object' && typeof item !== 'function')) {
        return item
    }

    return get(item, field)
}

/**
 * Превращает объект в строковое представление, в соответствии с заданными параметрами.
 * Используется для визуализации объектов в компонентах.
 *
 * @param {T} item объект, который нужно превратить в строку
 * @param {string} labelField полный путь к извлекаемому значению, например: "someField.internalField.otherField.value"
 * @param {(item: T) => string} labelFunction функция, которая задает логику трансформации объекта в строку
 * @returns {string}
 */
export const itemToLabel = <T>(
    item: T,
    // @ts-ignore
    labelField: string = null,
    // @ts-ignore
    labelFunction: (item: T) => string = null,
): string => {
    if (!item) return ''

    if (labelFunction) return labelFunction(item)

    let value: any = getFieldValue<T>(item, labelField)

    if (!value) return ''

    if (typeof value === 'string') {
        return value
    }

    return value.toLocaleString()
}

/**
 * Превращает объект в строку или число, в соответствии с заданными параметрами.
 * Используется для проброса value в такие компоненты как SelectInput, либо для генерации key.
 *
 * @returns {string}
 * @param option
 * @param valueField
 * @param valueFunction
 */
export const itemToValue = <T>(
    option: T,
    // @ts-ignore
    valueField: string = null,
    // @ts-ignore
    valueFunction: (option: T) => string | number = null,
): string | number => {
    if (valueFunction) {
        return valueFunction(option)
    }

    let fieldValue: any = getFieldValue<T>(option, valueField)

    if (typeof fieldValue === 'number') {
        return fieldValue as number
    }

    return fieldValue.toString()
}

/**
 * Сортирует элементы в массиве по указанным параметрам, если параметры не указаны - возвращает массив без изменений
 *
 * @param items сортируема коллекция
 * @param {string[]} sortingFields список полей элементов массива, которые поочередно участвуют в сортировке
 * @param {(a: any, b: any) => number} sortingFunction произвольная функция сортировки элементво
 * @returns {any[]}
 */
export const sortItems = <T extends object>(
    items: T[],
    sortingFields: keyof T[] | null = null,
    // @ts-ignore
    sortingFunction: (a: any, b: any) => number = null,
): T[] => {
    // @ts-ignore
    if (!items) return null

    if (sortingFunction) {
        return items.concat().sort(sortingFunction)
    }
    if (sortingFields) {
        return sortBy(items, sortingFields) as T[]
    }
    return items
}

/**
 * Вычисляет уникальный идентификатор элемента коллекции для внутренних потребностей React.
 * Если не указаны параметры, генерирует произвольный uid.
 *
 * @param {T} item элементы, для которого нужно вычислить уникальный идентификатор
 * @param {string} keyField полный путь к извлекаемому значению, например: "someField.internalField.otherField.value"
 * @param {(item: T) => string} keyFunction произвольная функция для вычисления key элемента
 * @returns {string}
 */
export const getKey = <T>(
    item: T,
    // @ts-ignore
    keyField: string = null,
    // @ts-ignore
    keyFunction: (item: T) => Key = null,
): Key => {
    // @ts-ignore
    if (!item) return uuid()

    if (keyFunction) return keyFunction(item)
    if (keyField) {
        let key: Key = get(item, keyField)
        if (
            // @ts-ignore
            (typeof key === 'string' && key) ||
            typeof key === 'number'
        ) {
            return key
        }
    }

    // @ts-ignore
    return uuid()
}

export const normalise = (value: number, min: number, max: number) => (value - min) * 100 / (max - min)

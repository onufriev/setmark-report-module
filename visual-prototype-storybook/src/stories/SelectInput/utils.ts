import { Key } from 'react'
import { v4 as uuid } from 'uuid'
import { SelectOptionValue } from './SelectInput'

/**
 * Возвращает значение поля объекта при указании пути к этому полю,
 * если @param item не является объектом, возвращается item
 * если путь не указан, то возвращается сам объект
 * Используется для визуализации объектов в компонентах.
 *
 * @param item объект, значение поля которого нужно узнать, может иметь простой тип(string, number, boolean)
 * @param {string} field полный путь к извлекаемому значению, например: "someField.internalField.otherField.value"
 */
export const getFieldValue = <T, F extends keyof T>(item: T, field?: F): T[F] | T => {
    if (
        item === null ||
        item === undefined ||
        !field ||
        (typeof item !== 'object' && typeof item !== 'function')
    ) {
        return item
    }

    return item[field]
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
export const optionToLabel = <T, F extends keyof T>(
    item: T,
    labelField?: F,
    labelFunction?: (item: T) => string,
): string => {
    if (labelFunction) {
        return labelFunction(item)
    }

    const value = getFieldValue(item, labelField)

    if (value == null) return ''

    if (typeof value === 'string') {
        return value
    }

    return String(value)
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
export const optionToValue = <T, F extends keyof T>(
    option: T,
    valueField?: F,
    valueFunction?: (option: T) => SelectOptionValue,
): SelectOptionValue => {
    if (valueFunction) {
        return valueFunction(option)
    }

    const fieldValue = getFieldValue(option, valueField)

    if (typeof fieldValue === 'number') {
        return fieldValue as number
    }

    return String(fieldValue)
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
export const getKey = <T, F extends keyof T>(
    item: T,
    keyField?: F,
    keyFunction?: (item: T) => Key,
): Key => {
    if (!item) return uuid()

    if (keyFunction) return keyFunction(item)

    if (keyField) {
        const key = getFieldValue(item, keyField)

        if (
            key !== undefined &&
            key !== null &&
            (typeof key === 'string' || typeof key === 'number')
        ) {
            return key
        }
    }

    return uuid()
}

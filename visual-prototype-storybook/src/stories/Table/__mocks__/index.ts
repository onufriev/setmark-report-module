import { addDays } from 'date-fns'

export type FakeTableData = {
    id: number
    string: string
    number: number
    date: Date
}

export const get_fake_table_data = (count: number = 100): FakeTableData[] => {
    const baseDate = new Date(2000, 0, 1, 0, 0, 0) // 01.01.2000

    return [...new Array(count)].map((_, i) => {
        const id = i + 1
        return {
            id,
            string: `${id} string field`,
            number: 100000 + id,
            date: addDays(baseDate, i) // добавляем по дню к каждой новой записи
        }
    })
}

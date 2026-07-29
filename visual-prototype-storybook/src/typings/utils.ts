export type MakeStyled<T> = {
    [P in keyof T as `$${string & P}`]: T[P]
}

export type NullableProps<T, K extends keyof T> = {
    [P in keyof Omit<T, K>]: T[P]
} & {
    [P in keyof Pick<T, K>]+?: T[P]
}

export type RequiredProps<T, K extends keyof T> = {
    [P in keyof Omit<T, K>]: T[P]
} & {
    [P in keyof Pick<T, K>]-?: T[P]
}

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

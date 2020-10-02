import { writable } from 'svelte/store'

export type highlightType = 'win' | 'error' | 'ok' | 'empty'
export type playerType = 'white' | 'black' | 'empty'

const _boardSize = 10
export const boardSize = writable(_boardSize)
export const animating = writable(false)
export const winLength = writable(5)
export const winner = writable('empty' as playerType)
export const whoIsNext = writable('white' as playerType)

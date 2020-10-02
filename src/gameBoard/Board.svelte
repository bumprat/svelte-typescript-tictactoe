<script context="module" lang="ts">
  export type cellType = {
    row: number
    col: number
    fill?: playerType
    highlight?: highlightType
  }
</script>

<script lang="ts">
  import type { playerType, highlightType } from './store'
  import { winLength, winner, whoIsNext, boardSize } from './store'
  import Cell from './Cell.svelte'
  $winner = 'empty'
  $whoIsNext = 'white'
  let cells: cellType[]
  cells = []
  new Array($boardSize)
    .fill(0)
    .map((_, i) => i + 1)
    .forEach(row => {
      new Array($boardSize)
        .fill(0)
        .map((_, i) => i + 1)
        .forEach(col => {
          cells.push({
            row,
            col,
            fill: 'empty',
            highlight: 'empty'
          })
        })
    })
  const maxRow = Math.max(...cells.map(c => c.row))
  const maxCol = Math.max(...cells.map(c => c.col))
  const getCellByPosition = (row: number, col: number) =>
    cells.find(c => c.row === row && c.col === col)
  const checkWin = () => {
    let winCells: (cellType | undefined)[] = []
    cells.some(c => {
      if (c.fill === 'empty') return false
      const down = new Array($winLength)
        .fill(0)
        .map((_, i) => {
          return getCellByPosition(c.row + i, c.col)
        })
        .filter(cc => cc && cc.fill === c.fill)
      if (down.length === $winLength) {
        winCells = down
        return true
      }
      const right = new Array($winLength)
        .fill(0)
        .map((_, i) => {
          return getCellByPosition(c.row, c.col + i)
        })
        .filter(cc => cc && cc.fill === c.fill)
      if (right.length === $winLength) {
        winCells = right
        return true
      }
      const corner1 = new Array($winLength)
        .fill(0)
        .map((_, i) => {
          return getCellByPosition(c.row + i, c.col + i)
        })
        .filter(cc => cc && cc.fill === c.fill)
      if (corner1.length === $winLength) {
        winCells = corner1
        return true
      }
      const corner2 = new Array($winLength)
        .fill(0)
        .map((_, i) => {
          return getCellByPosition(c.row + i, c.col - i)
        })
        .filter(cc => cc && cc.fill === c.fill)
      if (corner2.length === $winLength) {
        winCells = corner2
        return true
      }
      return false
    })
    if (winCells.length > 0) {
      $winner = (winCells[0] as cellType).fill || 'empty'
      winCells.forEach(c => c && (c.highlight = 'win'))
      cells = cells
    }
  }
</script>

<style>
  .board {
    border-collapse: collapse;
  }
  .message {
    margin: 0.3rem;
  }
</style>

{#if $winner === 'empty'}
  <div class="message">Player {$whoIsNext}'s turn</div>
{:else}
  <div class="message">Player {$winner} wins</div>
{/if}

<div class="board">
  {#each new Array(maxRow).fill(0).map((_, i) => i + 1) as row}
    <div class="row">
      {#each new Array(maxCol).fill(0).map((_, i) => i + 1) as col}
        <Cell
          on:put={checkWin}
          cell={cells.find(c => c.row === row && c.col === col)} />
      {/each}
    </div>
  {/each}
</div>

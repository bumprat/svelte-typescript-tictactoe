<script lang="ts">
  import classnames from 'classnames'
  import type { cellType } from './Board.svelte'
  import { whoIsNext, winner, animating } from './store'
  import { createEventDispatcher } from 'svelte'
  import { quintIn } from 'svelte/easing'
  import { xlink_attr } from 'svelte/internal'
  export let cell: cellType
  const dispatch = createEventDispatcher()
  const putPiece = () => {
    if (cell.fill === 'empty' && $winner === 'empty' && !$animating) {
      cell.fill = $whoIsNext
      $animating = true
    }
  }
  const onput = () => {
    $animating = false
    dispatch('put', { cell })
    if ($winner === 'empty') {
      $whoIsNext = $whoIsNext === 'white' ? 'black' : 'white'
    }
  }
  const checkValid = () => {
    if (cell.highlight !== 'win') {
      if (cell.fill === 'empty') {
        cell.highlight = 'ok'
      } else {
        cell.highlight = 'error'
      }
    }
  }
  const clearCheck = () => {
    if (cell.highlight !== 'win') {
      cell.highlight = 'empty'
    }
  }
  const flyIn = (node, { direction, duration }) => {
    return {
      duration,
      css: (t: number, u: number) => {
        const { x, y } = {
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 },
          top: { x: 0, y: -1 },
          bottom: { x: 0, y: 1 }
        }[direction]
        return `
          transform: translate(${x * 10 * (1 - quintIn(t))}rem, ${
          y * 10 * (1 - quintIn(t))
        }rem) scale(${(1 - quintIn(t)) * 10 + 1});
          opacity: ${quintIn(t)};
        `
      }
    }
  }
  const unique = {}
</script>

<style>
  .cell {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    background-color: #ccc;
    box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.2);
    user-select: none;
    cursor: pointer;
  }

  .cell-circle {
    color: red;
  }

  .cell-cross {
    color: blue;
  }

  .cell-ok {
    background-color: #afa;
  }

  .cell-error {
    background-color: #faa;
  }

  .cell-win {
    background-color: #0f0;
  }

  .piece {
    height: 1rem;
    width: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0.1rem 0.1rem 0.1rem 0px rgba(0, 0, 0, 0.2);
  }

  .piece-white {
    background: radial-gradient(
          circle at 0.2rem 0.2rem,
          rgba(255, 255, 255, 0.8) 0%,
          rgba(255, 255, 255, 0.2) 60%,
          rgba(255, 255, 255, 0) 60%
        )
        no-repeat,
      radial-gradient(
          circle at 0.3rem 0.3rem,
          rgba(255, 255, 255, 0.3) 10%,
          rgba(255, 255, 255, 0) 10%,
          rgba(0, 0, 0, 0.5) 100%
        )
        no-repeat,
      radial-gradient(
          circle at center,
          rgba(0, 0, 0, 0) 50%,
          rgba(0, 0, 0, 0.8) 100%
        )
        no-repeat,
      white;
  }

  .piece-black {
    background: radial-gradient(
          circle at 0.2rem 0.2rem,
          rgba(255, 255, 255, 0.8) 0%,
          rgba(255, 255, 255, 0.2) 60%,
          rgba(255, 255, 255, 0) 60%
        )
        no-repeat,
      radial-gradient(
          circle at 0.3rem 0.3rem,
          rgba(255, 255, 255, 0.3) 10%,
          rgba(255, 255, 255, 0) 10%,
          rgba(0, 0, 0, 0.5) 100%
        )
        no-repeat,
      radial-gradient(
          circle at center,
          rgba(0, 0, 0, 0) 50%,
          rgba(0, 0, 0, 0.8) 100%
        )
        no-repeat,
      black;
  }
</style>

<div
  class={classnames('cell', `cell-${cell.fill}`, `cell-${cell.highlight}`)}
  on:click={putPiece}
  on:mouseenter={checkValid}
  on:mouseout={clearCheck}>
  {#if cell.fill !== 'empty'}
    {#key unique}
      <div
        in:flyIn={{ direction: cell.fill === 'white' ? 'left' : 'right', duration: 500 }}
        on:introend={onput}
        class={`piece piece-${cell.fill}`} />
    {/key}
  {/if}
</div>

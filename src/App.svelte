<script lang="ts">
  import Board from './gameBoard/Board.svelte'
  import { boardSize, winLength } from './gameBoard/store'
  let unique = {}
</script>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
    white-space: nowrap;
  }
  :global(body) {
    background-color: #000;
    color: white;
  }
</style>

<main>
  <label>
    board size
    <input
      type="range"
      bind:value={$boardSize}
      on:input={() => {
        $winLength = Math.min($winLength, $boardSize)
        unique = {}
      }}
      max={20}
      min={3} />
    {$boardSize}
  </label>
  <label>
    condition for winning
    <input
      type="range"
      bind:value={$winLength}
      on:input={() => {
        $boardSize = Math.max($winLength, $boardSize)
        unique = {}
      }}
      max={5}
      min={3} />
    {$winLength}
  </label>
  {#key unique}
    <Board />
  {/key}
</main>

<script>
  import EditableParagraph from "./EditableParagraph.svelte";
  export let answer;
  export let toggleCorrectness = (_) => {};
  export let deleteMe = (_) => {};
  export let textUpdate = () => {};
  export let autofocus = false;
  export let type = "MC";
  export let position = 0;
  export let last = false;
  export let moveUp = () => {};
  export let moveDown = () => {};
</script>

<li class="answer">
  {#if type === "ORD"}
    <span class="order">{position + 1}.</span>
    <button class="order-btn" disabled={position === 0} on:click={moveUp}
      >↑</button
    >
    <button class="order-btn" disabled={last} on:click={moveDown}>↓</button>
  {:else}
    <label class="distractor">
      <input
        class="custom-radio"
        type={type === "MA" ? "checkbox" : "radio"}
        checked={answer.isCorrect}
        on:change={toggleCorrectness}
      />
    </label>
  {/if}
  <EditableParagraph bind:content={answer.text} {textUpdate} {autofocus} />
  <button class="link-btn" id="delete-distractor-btn" on:click={deleteMe}
    >Delete</button
  >
</li>

<style>
  .answer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  label.distractor {
    display: flex;
    align-items: center; /* Vertically align items */
    gap: 10px; /* Add space between the radio button and the text*/
  }

  .custom-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ccc;
    display: inline-block;
    margin-right: 10px;
    position: relative;
    transition: border-color 0.2s ease;
    visibility: hidden;
    margin: 0px;
  }

  input[type="radio"]::after,
  input[type="checkbox"]::after {
    background-color: transparent;
    font-size: 1rem;

    visibility: visible;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  input[type="radio"]:hover::after,
  input[type="checkbox"]:hover::after {
    border: 1px dashed black;
  }

  input[type="radio"]:checked::after,
  input[type="checkbox"]:checked::after {
    content: "\2714";
    color: #4caf50;
    font-size: 1.2rem;
    background-color: transparent;
  }

  input[type="radio"]:not(:checked)::after,
  input[type="checkbox"]:not(:checked)::after {
    content: "\2718";
    color: #a2240b;
  }

  .order {
    margin-right: 6px;
  }

  .order-btn {
    padding: 0 6px;
    margin-right: 4px;
    cursor: pointer;
  }

  #delete-distractor-btn {
    color: #a2240b;
    font-size: 80%;
    cursor: pointer;
    display: none;
  }

  #delete-distractor-btn {
    margin-left: auto;
  }

  li:hover #delete-distractor-btn {
    display: inline;
  }
</style>

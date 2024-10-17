<script>
  import EditableParagraph from "./EditableParagraph.svelte";
  export let answer;
  export let toggleCorrectness = (_) => {};
  export let deleteMe = (_) => {};
  export let textUpdate = () => {};
</script>

<li class="answer">
  <label class="distractor">
    <input
      class="custom-radio"
      type="radio"
      checked={answer.isCorrect}
      on:change={toggleCorrectness}
    />
  </label>
  <EditableParagraph bind:content={answer.text} {textUpdate} />
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

  input[type="radio"]::after {
    background-color: transparent;
    font-size: 1rem;

    visibility: visible;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  input[type="radio"]:hover::after {
    border: 1px dashed black;
  }

  input[type="radio"]:checked::after {
    content: "\2714";
    color: #4caf50;
    font-size: 1.2rem;
    background-color: transparent;
  }

  input[type="radio"]:not(:checked)::after {
    content: "\2718";
    color: #a2240b;
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

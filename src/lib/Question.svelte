<script>
  import EditableParagraph from "./EditableParagraph.svelte";
  export let mcq;
  export let index;
  export let deleteQuestion = (_) => {};
  export let mcqChanged = (_, __) => {};

  function updateMCQ() {
    mcqChanged(mcq, index);

    mcq = { ...mcq };
  }

  const deleteDistractor = (index) => {
    mcq.answers.splice(index, 1);
    updateMCQ();
  };
  function toggleCorrectness(index) {
    console.log(mcq);
    mcq.answers.forEach((answer, i) => {
      answer.isCorrect = i === index;
      console.log(answer, i, index);
      console.log(mcq.question);
    });

    updateMCQ();
  }

  function handleTextUpdate() {
    console.log("handleTextUpdate", mcq);
    updateMCQ();
  }

  console.log("rerendering Question", mcq);
</script>

<div class="mcq-container">
  <div class="question-head">
    <label for="question">Question: {index}</label>
    <button
      class="link-btn"
      id="delete-btn"
      on:click={() => deleteQuestion(index)}>Delete</button
    >
  </div>
  <EditableParagraph bind:content={mcq.question} {handleTextUpdate} />

  <ol class="answers">
    {#each mcq.answers as answer, distractor_index}
      <li class="answer">
        <label class="distractor">
          <input
            class="custom-radio"
            type="radio"
            checked={answer.isCorrect}
            on:change={() => toggleCorrectness(distractor_index)}
          />
          <EditableParagraph bind:content={answer.text} {handleTextUpdate} />
        </label>
        <button
          class="link-btn"
          id="delete-distractor-btn"
          on:click={() => deleteDistractor(distractor_index)}>Delete</button
        >
      </li>
    {/each}
  </ol>
</div>

<style>
  .mcq-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .question {
    margin-bottom: 0.125rem;
    font-weight: bold;
  }

  .question-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 80%;
  }

  .answers .answer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  ol {
    padding-inline-start: 1em; /* Indent list items by 40px */
  }

  label.distractor {
    display: flex;
    align-items: center; /* Vertically align items */
    gap: 10px; /* Add space between the radio button and the text */
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

  #delete-btn,
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

  .mcq-container:hover #delete-btn {
    display: inline;
  }
</style>

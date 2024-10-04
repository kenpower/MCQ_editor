<script>
  import EditableParagraph from "./EditableParagraph.svelte";
  import Distractor from "./Distractor.svelte";
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

  function textUpdate() {
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
  <EditableParagraph bind:content={mcq.question} {textUpdate} />

  <ol class="answers">
    {#each mcq.answers as answer, distractor_index}
      <Distractor
        {answer}
        toggleCorrectness={() => toggleCorrectness(distractor_index)}
        deleteMe={() => deleteDistractor(distractor_index)}
        {textUpdate}
      />
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

  .question-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 80%;
  }

  ol {
    padding-inline-start: 1em; /* Indent list items by 40px */
  }

  #delete-btn {
    color: #a2240b;
    font-size: 80%;
    cursor: pointer;
    display: none;
  }

  .mcq-container:hover #delete-btn {
    display: inline;
  }
</style>

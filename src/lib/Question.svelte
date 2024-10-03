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
  <div class="question">
    <label for="question">Question:</label>
    <button on:click={deleteQuestion(index)}>Delete</button>
    <EditableParagraph bind:content={mcq.question} {handleTextUpdate} />
  </div>

  <ol class="answers">
    {#each mcq.answers as answer, index}
      <li class="answer">
        <EditableParagraph bind:content={answer.text} {handleTextUpdate} />
        <label>
          <input
            class="custom-radio"
            type="radio"
            checked={answer.isCorrect}
            on:change={() => toggleCorrectness(index)}
          />
        </label>
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

  .answers .answer {
    display: flex;
    align-items: center;
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
  }

  input[type="radio"]:checked,
  .custom-radio {
    border-color: #4caf50; /* Green border when checked */
  }

  input[type="radio"]:checked::after {
    content: "\2713";
    color: white;
    background-color: #4caf50;
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  input[type="radio"]:not(:checked),
  .custom-radio::after {
    content: "\2718";
    color: white;
    background-color: #a2240b;
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
</style>

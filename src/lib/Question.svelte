<script>
  import EditableParagraph from "./EditableParagraph.svelte";
  export let mcq;

  function updateAnswerText(index, event) {
    mcq.answers[index].text = event.target.value;
  }

  function toggleCorrectness(index) {
    mcq = mcq.answers.forEach((answer, i) => {
      answer.isCorrect = i === index;
    });
  }

  function updateQuestionText(event) {
    mcq.question = event.target.value;
  }
</script>

<div class="mcq-container">
  <div class="question">
    <label for="question">Question:</label>
    <EditableParagraph bind:content={mcq.question} />
  </div>

  <div class="answers">
    <h3>Answers:</h3>
    {#each mcq.answers as answer, index}
      <div class="answer">
        <EditableParagraph bind:content={answer.text} />

        <label>
          <input
            class="custom-radio"
            type="radio"
            checked={answer.isCorrect}
            on:change={() => toggleCorrectness(index)}
          />
          {answer.isCorrect}
        </label>
      </div>
    {/each}
  </div>
</div>

<style>
  .mcq-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .question {
    margin-bottom: 1rem;
  }

  .answers .answer {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
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

  input[type="radio"]:checked,
  .custom-radio::after {
    content: "\2713"; /* Unicode for checkmark */
    color: white;
    background-color: #4caf50; /* Green background when checked */
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
</style>

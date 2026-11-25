<script>
  import { tick } from "svelte";
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
    if (mcq.type === "MA") {
      mcq.answers[index].isCorrect = !mcq.answers[index].isCorrect;
    } else {
      mcq.answers.forEach((answer, i) => {
        answer.isCorrect = i === index;
      });
    }

    updateMCQ();
  }

  function moveAnswer(from, to) {
    if (to < 0 || to >= mcq.answers.length) return;
    const [moved] = mcq.answers.splice(from, 1);
    mcq.answers.splice(to, 0, moved);
    updateMCQ();
  }

  function textUpdate() {
    console.log("handleTextUpdate", mcq);
    updateMCQ();
  }

  let focusIndex = null;
  const addDistractor = async () => {
    mcq.answers.push(
      mcq.type === "ORD" ? { text: "" } : { text: "", isCorrect: false }
    );
    // mark which index should be autofocused when rendered
    focusIndex = mcq.answers.length - 1;
    updateMCQ();
    // wait for DOM to update so child can perform focus
    await tick();
    // clear focusIndex after a short delay to avoid keeping it set
    focusIndex = null;
  };

  console.log("rerendering Question", mcq);
</script>

<div class="mcq-container">
  <div class="question-head">
    <label for="question">Question: {index} ({mcq.type})</label>
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
        type={mcq.type}
        position={distractor_index}
        last={distractor_index === mcq.answers.length - 1}
        moveUp={() => moveAnswer(distractor_index, distractor_index - 1)}
        moveDown={() => moveAnswer(distractor_index, distractor_index + 1)}
        toggleCorrectness={() => toggleCorrectness(distractor_index)}
        deleteMe={() => deleteDistractor(distractor_index)}
        {textUpdate}
      />
    {/each}
    <button class="link-btn" id="add-btn" on:click={() => addDistractor()}
      >Add New Distractor</button
    >
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
  }

  .link-btn {
    font-size: 80%;
    cursor: pointer;
    visibility: hidden;
  }

  .mcq-container:hover #delete-btn,
  .mcq-container:hover #add-btn {
    visibility: visible;
  }
</style>

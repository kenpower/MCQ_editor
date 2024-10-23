<script>
  import { parse } from "svelte/compiler";
  import Question from "./Question.svelte";

  function loadMcqArray() {
    const storedData = localStorage.getItem("mcqArray");
    console.log("storedData", storedData);
    let mcqFromStorage = [];
    try {
      mcqFromStorage = JSON.parse(storedData ?? "[]");
    } catch (error) {
      console.error("Error parsing mcqArray from localStorage:", error);
    }

    console.log("mcqFromStorage", mcqFromStorage);
    return mcqFromStorage;
  }

  const clean = (text) => {
    //remove MC→TEXT→
    text = text.replace(/MC\tTEXT\t/g, "MC\t");

    //remove answer numbering/lettering
    text = text.replace(/\t[a-zA-Z]:/g, "\t");

    return text;
  };

  // Function to parse the input into mcq objects
  function parseInput(mcqRawInput) {
    let linesWithErrors = [];
    let parsedQuestions = mcqRawInput
      .split("\n")
      .map((line) => {
        console.log("line", line);
        line = clean(line);
        const parts = line.split("\t");
        if (parts.length >= 4 && (parts.length - 2) % 2 === 0) {
          return {
            type: parts[0],
            question: parts[1],
            answers: parts.slice(2).reduce((acc, val, index, array) => {
              // We process each pair of elements, i.e., (text, correctness)
              if (index % 2 === 0) {
                acc.push({
                  text: val,
                  // check if begins with "correct..." ignore case
                  isCorrect: array[index + 1]
                    .toLowerCase()
                    .startsWith("correct"),
                });
              }

              return acc;
            }, []),
          };
        }
        linesWithErrors.push(line);
        return null; // If the line doesn't follow the expected format, return null
      })
      .filter((mcq) => mcq !== null); // Filter out null entries for invalid lines

    return { parsedQuestions, linesWithErrors };
  }

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const shuffle_answers = (mcqs) => {
    mcqs.forEach((mcq) => (mcq.answers = shuffle(mcq.answers)));
    return mcqs;
  };

  const mcqChanged = (mcq, index) => {
    mcqArray[index] = mcq;
    saveChanges();
  };

  const deleteQuestion = (index) => {
    console.log("deleteQuestion", index);
    mcqArray.splice(index, 1);
    saveChanges();
  };

  function saveChanges() {
    localStorage.setItem("mcqArray", JSON.stringify(mcqArray)); // Save to localStorage
    mcqArray = [...mcqArray]; // Trigger reactivity
  }
  const process_input = () => {
    const { parsedQuestions, linesWithErrors } = parseInput(
      unShowWhiteSpace(inputBoxContent)
    );
    console.log("parsed", parsedQuestions);
    console.log("linesWithError", linesWithErrors);
    console.log("mcqArray", mcqArray);
    mcqArray = [...mcqArray, ...shuffle_answers(parsedQuestions)];
    inputBoxContent = showWhiteSpace(linesWithErrors.join("\n"));
    saveChanges();
  };

  const showWhiteSpace = (text) => {
    return text
      .replace(/\t/g, "→") // Replace tabs with arrows
      .replace(/ /g, "·"); // Replace spaces with dots
  };

  const unShowWhiteSpace = (text) => {
    return text
      .replace(/→/g, "\t") // Replace arrows with tabs
      .replace(/·/g, " "); // Replace dots with spaces
  };

  // Function to update localStorage whenever the input value changes
  function handleInput(event) {
    const textarea = event.target;
    let rawContent = unShowWhiteSpace(textarea.value);
    const cursorPosition = textarea.selectionStart;
    const beforeCursorContent = rawContent.slice(0, cursorPosition);
    const matchesBeforeCursor = (beforeCursorContent.match(/ {4}/g) || [])
      .length;
    rawContent = rawContent.replace(/ {4}/g, "\t"); // 4 space = tab

    textarea.value = showWhiteSpace(rawContent);
    localStorage.setItem("inputValue", rawContent);

    textarea.selectionStart = textarea.selectionEnd =
      cursorPosition - matchesBeforeCursor * 3;
  }

  const save_output_as_tsv = () => {
    let output = mcqArray
      .map((mcq) => {
        const answers = mcq.answers
          .map(
            (answer) =>
              `${answer.text}\t${answer.isCorrect ? "correct" : "incorrect"}`
          )
          .join("\t");
        return `${mcq.type}\t${mcq.question}\t${answers}`;
      })
      .join("\n");

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `mcqs_${dateTime}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAll = () => {
    mcqArray = [];
    saveChanges();
  };

  let inputBoxContent = showWhiteSpace(
    localStorage.getItem("inputValue") || ""
  );

  let mcqArray = loadMcqArray();
</script>

<div class="mcq-parser">
  <textarea
    bind:value={inputBoxContent}
    on:input={handleInput}
    placeholder="Paste MCQ lines here (TSV format)"
    rows="10"
    cols="50"
  ></textarea>

  {#if inputBoxContent.length > 0}
    <button on:click={process_input}>Parse MCQs</button>
  {/if}

  {#if mcqArray.length > 0}
    <h3>Parsed MCQs:</h3>
    <ul>
      {#each mcqArray as mcq, index}
        <Question {mcq} {index} {mcqChanged} {deleteQuestion} />
      {/each}
    </ul>
    <div><button on:click={save_output_as_tsv}>Save MCQs</button></div>

    <hr />

    <button class="link-btn delete-btn" on:click={deleteAll}>Delete All</button>
  {/if}
</div>

<style>
  .mcq-parser {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    font-family: inherit;
    padding: 10px;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    margin-bottom: 10px;
  }
</style>

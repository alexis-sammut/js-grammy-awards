// Function to load HTML header and footer dynamically
function loadHTML(id, file, callback) {
  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not OK");
      return response.text();
    })
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (typeof callback === "function") callback();
    })
    .catch((error) => {
      console.error(`Could not load ${file}:`, error);
    });
}

// Load header.html first, and then configure the light mode logic in its callback as the switch is in the header
loadHTML("header", "header.html", function () {
  const currentPage = window.location.pathname.split("/").pop();

  // Function to highlight the current page's navigation link
  function boldenCurrentNav(pageName) {
    const navElement = document.getElementById(pageName);
    if (navElement) {
      const strongElement = document.createElement("strong");
      strongElement.textContent = navElement.textContent;
      navElement.replaceWith(strongElement);
    }
  }

  // Check for the specific page being displayed and highlight its corresponding nav link
  if (currentPage === "index.html") {
    boldenCurrentNav("home");
  } else if (currentPage === "2024_grammys.html") {
    boldenCurrentNav("g2024");
  } else if (currentPage === "2025_grammys.html") {
    boldenCurrentNav("g2025");
  } else if (currentPage === "historical_moments.html") {
    boldenCurrentNav("historical_moments");
  } else if (currentPage === "quiz.html") {
    boldenCurrentNav("quiz");
  } else if (currentPage === "crossword.html") {
    boldenCurrentNav("crossword");
  }

  // Start of Light Mode logic
  const modeSwitch = document.getElementById("mode_switch");

  // Function to handle the switch toggle
  function switchMode() {
    document.body.classList.toggle("light-mode");

    const isLightMode = document.body.classList.contains("light-mode");

    // Save the mode to localStorage
    localStorage.setItem("themePreference", isLightMode ? "light" : "dark");
  }

  if (modeSwitch) {
    modeSwitch.addEventListener("click", switchMode);
  } else {
    console.error(
      "Error: 'mode_switch' element not found after header loaded!"
    );
  }

  // Function to apply the theme based on preference
  function applyTheme(isLightMode) {
    if (isLightMode) {
      modeSwitch.checked = true;
      document.body.classList.add("light-mode");
    } else {
      modeSwitch.checked = false;
      document.body.classList.remove("light-mode");
    }
  }
  // Check localStorage for the preference and apply it
  const savedTheme = localStorage.getItem("themePreference") === "light";

  applyTheme(savedTheme);
});

// Load footer.html, along with the feedback form logic
loadHTML("footer", "footer.html", function () {
  const feedbackForm = document.getElementById("feedbackForm");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const feedbackField = document.getElementById("feedback");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const feedbackError = document.getElementById("feedbackError");
  const formSuccessMessage = document.getElementById("formSuccessMessage");

  // Function to display an error message
  function showError(element, message) {
    element.textContent = message;
    element.previousElementSibling.previousElementSibling.classList.add(
      "invalid"
    );
  }

  // Function to clear an error message
  function clearError(element) {
    element.textContent = "";
    element.previousElementSibling.previousElementSibling.classList.remove(
      "invalid"
    );
  }

  // Function to validate the name field
  function validateName() {
    if (nameField.value.trim() === "") {
      showError(nameError, "Name is required.");
      return false;
    } else {
      clearError(nameError);
      return true;
    }
  }

  // Function to validate the email field
  function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value.trim() === "") {
      showError(emailError, "Email is required.");
      return false;
    } else if (!emailPattern.test(emailField.value.trim())) {
      showError(emailError, "Please enter a valid email address.");
      return false;
    } else {
      clearError(emailError);
      return true;
    }
  }

  // Function to validate the feedback field
  function validateFeedback() {
    if (feedbackField.value.trim() === "") {
      showError(feedbackError, "Feedback is required.");
      return false;
    } else {
      clearError(feedbackError);
      return true;
    }
  }
  nameField.addEventListener("input", validateName);
  emailField.addEventListener("input", validateEmail);
  feedbackField.addEventListener("input", validateFeedback);

  // Function to handle form submission
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isFeedbackValid = validateFeedback();

    if (isNameValid && isEmailValid && isFeedbackValid) {
      formSuccessMessage.textContent = "Thank you for your feedback!";
      feedbackForm.reset();
      setTimeout(() => {
        formSuccessMessage.textContent = "";
        formSuccessMessage.style.display = "none";
      }, 5000);
    }
  });
});

// Function to load the quiz logic only if the current page is quiz.html
function quiz() {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "quiz.html") {
    const questions = [
      {
        question: "When were the first Grammy Awards held?",
        answers: [
          { text: "1949", correct: false },
          { text: "1959", correct: false },
          { text: "1969", correct: true },
          { text: "1979", correct: false },
        ],
      },
      {
        question:
          "Which artist holds the record for the most Grammy wins in history?",
        answers: [
          { text: "Beyoncé", correct: true },
          { text: "Taylor Swift", correct: false },
          { text: "Stevie Wonder", correct: false },
          { text: "Adele", correct: false },
        ],
      },
      {
        question:
          "Which album won Album of the Year at the 2024 Grammy Awards?",
        answers: [
          { text: "Midnights by Taylor Swift", correct: false },
          { text: "Renaissance by Beyoncé", correct: true },
          { text: "30 by Adele", correct: false },
          { text: "Harry's House by Harry Styles", correct: false },
        ],
      },
      {
        question: 'What are the "Big Four" Grammy Awards?',
        answers: [
          {
            text: "Best Pop Solo Performance Best Rock Album, Best Rap Song, Best Country Duo/Group Performance",
            correct: false,
          },
          {
            text: "Best Music Video, Best Alternative Music Album, Best R&B Performance, Best Latin Pop Album",
            correct: false,
          },
          {
            text: "Best New Artist, Record of the Year, Album of the Year, Song of the Year",
            correct: true,
          },
          {
            text: "Best Classical Instrumental Solo, Best Jazz Vocal Album, Best Reggae Album, Best World Music Album",
            correct: false,
          },
        ],
      },
      {
        question:
          "Who was the youngest individual artist to win a Grammy Award?",
        answers: [
          { text: "Billie Eilish", correct: true },
          { text: "Justin Bieber", correct: false },
          { text: "Ariana Grande", correct: false },
          { text: "Ed Sheeran", correct: false },
        ],
      },
      {
        question: "Which artist won the most Grammys in a single night?",
        answers: [
          { text: "Whitney Houston", correct: false },
          { text: "Kendrick Lamar", correct: false },
          { text: "Taylor Swift", correct: false },
          { text: "Michael Jackson", correct: true },
        ],
      },
      {
        question: "Who won the first-ever Grammy for Album of the Year?",
        answers: [
          { text: "Frank Sinatra", correct: true },
          { text: "Ella Fitzgerald", correct: false },
          { text: "The Beatles", correct: false },
          { text: "Stevie Wonder", correct: false },
        ],
      },
      {
        question:
          "Which legendary conductor holds the record for the most Grammy wins by a male artist?",
        answers: [
          { text: "Herbert von Karajan", correct: false },
          { text: "Zubin Mehta", correct: false },
          { text: "Gustavo Dudamel", correct: false },
          { text: "Georg Solti", correct: true },
        ],
      },
      {
        question:
          "Which song was the first-ever winner of the Grammy for Song of the Year?",
        answers: [
          { text: "Yesterday by The Beatles", correct: false },
          {
            text: "Nel blu, dipinto di blu (Volare) by Domenico Modugno",
            correct: true,
          },
          {
            text: "Bridge Over Troubled Water by Simon & Garfunkel",
            correct: false,
          },
          {
            text: "Killing Me Softly with His Song by Roberta Flack",
            correct: false,
          },
        ],
      },
      {
        question:
          "Who won the Grammy for Best New Artist at the 2024 Grammy Awards?",
        answers: [
          { text: "Olivia Rodrigo", correct: false },
          { text: "Victoria Monét", correct: true },
          { text: "Phoebe Bridgers", correct: false },
          { text: "Doja Cat", correct: false },
        ],
      },
    ];

    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const quizSummary = document.getElementById("summary");
    const facbeookLink = document.getElementById("facebook-link");
    const xLink = document.getElementById("x-link");
    const linkedinLink = document.getElementById("linkedin-link");

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
      quizSummary.style.display = "none";
      currentQuestionIndex = 0;
      score = 0;
      nextButton.innerHTML = "Next";
      showQuestion();
    }

    function showQuestion() {
      resetAnswers();
      let currentQuestion = questions[currentQuestionIndex];
      let questionNo = currentQuestionIndex + 1;
      questionElement.innerHTML =
        questionNo + "/10 " + currentQuestion.question;

      currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
          button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", function (e) {
          const selectedButton = e.target;
          const correct = selectedButton.dataset.correct === "true";
          if (correct) {
            selectedButton.classList.add("correct");
            score++;
          } else {
            selectedButton.classList.add("incorrect");
          }
          Array.from(answerButtons.children).forEach((button) => {
            if (button.dataset.correct === "true") {
              button.classList.add("correct");
            }
            button.disabled = true;
          });
          nextButton.style.display = "block";
        });
      });
    }

    function resetAnswers() {
      nextButton.style.display = "none";
      while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
      }
    }
    function showScore() {
      resetAnswers();
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";

      facbeookLink.href =
        "https://www.facebook.com/sharer/sharer.php?u=https://alexis-sammut.github.io/js-grammy-awards/quiz.html";
      xLink.href = `https://twitter.com/intent/tweet?text=I%20scored%20${score}/10%20on%20the%20Grammy%20Quiz!%20Test%20your%20knowledge%20here:&url=https://alexis-sammut.github.io/js-grammy-awards/quiz.html&hashtags=QuizTime,Grammys`;
      linkedinLink.href =
        "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fquiz.html&title=Grammy%20Awards%20Quiz&summary=Think%20you%27re%20a%20Grammy%20expert%3F%20Take%20this%20quiz%20to%20prove%20your%20music%20trivia%20skills%20and%20see%20how%20well%20you%20know%20the%20history%20of%20the%20Grammys!&source=Grammy%20Awards%3A%20Winners%20%26%20Records";

      quizSummary.style.display = "block";
    }

    function handleNextButton() {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        showScore();
      }
    }
    nextButton.addEventListener("click", () => {
      if (currentQuestionIndex < questions.length) {
        handleNextButton();
      } else {
        startQuiz();
      }
    });

    startQuiz();
  }
}

quiz();

// Function to initialize carousels on the historical moments page
function historicalMoments() {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "historical_moments.html") {
    // Function to actually initialize a singular carousel
    function initCarousel(carouselId) {
      const carousel = document.getElementById(carouselId);

      const slideContainer = carousel.querySelector(
        ".slide-container1, .slide-container2, .slide-container3"
      );
      const slides = slideContainer.querySelectorAll(".slide");
      const prevBtn = carousel.querySelector(".carousel-prev-btn");
      const nextBtn = carousel.querySelector(".carousel-next-btn");

      let currentSlideIndex = 0;
      const totalSlides = slides.length;

      function updateCarousel() {
        const offset = -currentSlideIndex * 100;
        slideContainer.style.transform = `translateX(${offset}%)`;
      }

      function showNextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateCarousel();
      }

      function showPrevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
      }

      prevBtn.addEventListener("click", showPrevSlide);
      nextBtn.addEventListener("click", showNextSlide);

      updateCarousel();
    }
    initCarousel("jlo-carousel");
    initCarousel("lady_gaga-carousel");
    initCarousel("queen_latifah-carousel");
  }
}

historicalMoments();

// Function to initialize the crossword logic on the crossword page
function crossword() {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "crossword.html") {
    const oneAcross = document.getElementById("one-across");
    const twoAcross = document.getElementById("two-across");
    const fourAcross = document.getElementById("four-across");
    const fiveAcross = document.getElementById("five-across");
    const sixAcross = document.getElementById("six-across");

    const oneDown = document.getElementById("one-down");
    const threeDown = document.getElementById("three-down");
    const fourDown = document.getElementById("four-down");
    const sixDown = document.getElementById("six-down");

    const cluesContainer = document.querySelector(".clues");
    const cluesTitle = cluesContainer.querySelector("h2");

    const allClueSpans = cluesContainer.querySelectorAll("span");

    const crosswordSummary = document.getElementById("summary");

    // Object to store the actual clues
    const cluesData = {
      "one-across": {
        text: "1 Across: Person who performs songs vocally",
        direction: "across",
        id: "one-across",
      },
      "two-across": {
        text: "2 Across: Grande known for hits like '7 Rings' and 'Thank U, Next'",
        direction: "across",
        id: "two-across",
      },
      "four-across": {
        text: "4 Across: Past tense of performing an instrument or song",
        direction: "across",
        id: "four-across",
      },
      "five-across": {
        text: "5 Across: Unit measuring sound intensity (abbreviation)",
        direction: "across",
        id: "five-across",
      },
      "six-across": {
        text: "6 Across: To alter or adjust audio or video content",
        direction: "across",
        id: "six-across",
      },
      "one-down": {
        text: "1 Down: Small portion of a sound or song reused in new music",
        direction: "down",
        id: "one-down",
      },
      "three-down": {
        text: "3 Down: Blues singer,sings 'Feeling Good'",
        direction: "down",
        id: "three-down",
      },
      "four-down": {
        text: "4 Down: Welsh singer known for “Gangsta’s Paradise” (last name: Numan)",
        direction: "down",
        id: "four-down",
      },
      "six-down": {
        text: "6 Down: Music genre blending rhythm and blues",
        direction: "down",
        id: "six-down",
      },
    };

    // Track which clue (across/down) was last shown for a cell
    const cellClickTracker = {};

    let currentActiveInput = null;

    // Define the solution
    const crosswordSolution = {
      "cell-one": "S",
      "cell-two": "I",
      "cell-three": "N",
      "cell-four": "G",
      "cell-five": "E",
      "cell-six": "R",
      "cell-seven": "A",
      "cell-eight": "R",
      "cell-nine": "I",
      "cell-ten": "A",
      "cell-eleven": "N",
      "cell-twelve": "A",
      "cell-thirteen": "M",
      "cell-fifteen": "N",
      "cell-sixteen": "R",
      "cell-eighteen": "N",
      "cell-nineteen": "P",
      "cell-twenty": "L",
      "cell-twenty-one": "A",
      "cell-twenty-two": "Y",
      "cell-twenty-three": "E",
      "cell-twenty-four": "D",
      "cell-twenty-five": "L",
      "cell-twenty-nine": "D",
      "cell-thirty": "B",
      "cell-thirty-one": "E",
      "cell-thirty-two": "D",
      "cell-thirty-three": "I",
      "cell-thirty-four": "T",
    };

    const words = {
      "one-across": {
        cells: [
          "cell-one",
          "cell-two",
          "cell-three",
          "cell-four",
          "cell-five",
          "cell-six",
        ],
        solution: "SINGER",
      },
      "two-across": {
        cells: [
          "cell-seven",
          "cell-eight",
          "cell-nine",
          "cell-ten",
          "cell-eleven",
          "cell-twelve",
        ],
        solution: "ARIANA",
      },
      "four-across": {
        cells: [
          "cell-nineteen",
          "cell-twenty",
          "cell-twenty-one",
          "cell-twenty-two",
          "cell-twenty-three",
          "cell-twenty-four",
        ],
        solution: "PLAYED",
      },
      "five-across": {
        cells: ["cell-twenty-nine", "cell-thirty"],
        solution: "DB",
      },
      "six-across": {
        cells: [
          "cell-thirty-one",
          "cell-thirty-two",
          "cell-thirty-three",
          "cell-thirty-four",
        ],
        solution: "EDIT",
      },
      "one-down": {
        cells: [
          "cell-one",
          "cell-seven",
          "cell-thirteen",
          "cell-nineteen",
          "cell-twenty-five",
          "cell-thirty-one",
        ],
        solution: "SAMPLE",
      },
      "three-down": {
        cells: ["cell-three", "cell-nine", "cell-fifteen", "cell-twenty-one"],
        solution: "NINA",
      },
      "four-down": {
        cells: ["cell-four", "cell-ten", "cell-sixteen", "cell-twenty-two"],
        solution: "GARY",
      },
      "six-down": {
        cells: [
          "cell-six",
          "cell-twelve",
          "cell-eighteen",
          "cell-twenty-four",
          "cell-thirty",
        ],
        solution: "RANDB",
      },
    };

    // Keep track of completed words
    const completedWords = new Set();
    let correctWordCount = 0;
    const totalWords = Object.keys(words).length;

    function displayClue(cellId, clueIdToDisplay, direction) {
      allClueSpans.forEach((span) => {
        span.style.display = "none";
      });

      const targetClueSpan = document.getElementById(clueIdToDisplay);
      const clueInfo = cluesData[clueIdToDisplay];

      if (targetClueSpan && clueInfo) {
        targetClueSpan.textContent = clueInfo.text;
        targetClueSpan.style.display = "block";

        cluesContainer.style.display = "block";
        cluesTitle.style.display = "block";

        cellClickTracker[cellId] = direction;
      } else {
        allClueSpans.forEach((span) => (span.textContent = ""));
      }
    }

    // Function to check if a word is correct
    function checkWord(wordId) {
      if (completedWords.has(wordId)) {
        return;
      }

      const word = words[wordId];
      if (!word) return;

      let currentWord = "";
      let allCellsFilled = true;

      word.cells.forEach((cellId) => {
        const inputElement = document
          .getElementById(cellId)
          .querySelector("input");
        if (inputElement && inputElement.value) {
          currentWord += inputElement.value.toUpperCase();
        } else {
          allCellsFilled = false;
        }
      });

      if (allCellsFilled && currentWord === word.solution.toUpperCase()) {
        word.cells.forEach((cellId) => {
          const cell = document.getElementById(cellId);
          const inputElement = cell.querySelector("input");
          if (inputElement) {
            cell.classList.add("correct-word");
            inputElement.disabled = true;
          }
        });
        completedWords.add(wordId);
        correctWordCount++;

        if (correctWordCount === totalWords) {
          crosswordSolved();
        }
      }
    }

    // Add event listeners to each cell
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const inputElement = cell.querySelector("input");

      if (inputElement) {
        inputElement.addEventListener("click", function (event) {
          event.stopPropagation();

          if (currentActiveInput === this) {
            this.focus();
          } else {
            currentActiveInput = this;
            this.focus();
          }

          const clickedCell = this.parentElement;
          const cellId = clickedCell.id;

          let acrossClueId = null;
          let downClueId = null;

          switch (cellId) {
            case "cell-one":
              acrossClueId = "one-across";
              downClueId = "one-down";
              break;
            case "cell-two":
              acrossClueId = "one-across";
              break;
            case "cell-three":
              acrossClueId = "one-across";
              downClueId = "three-down";
              break;
            case "cell-four":
              acrossClueId = "one-across";
              downClueId = "four-down";
              break;
            case "cell-five":
              acrossClueId = "one-across";
              break;
            case "cell-six":
              acrossClueId = "one-across";
              downClueId = "six-down";
              break;

            case "cell-seven":
              acrossClueId = "two-across";
              downClueId = "one-down";
              break;
            case "cell-eight":
              acrossClueId = "two-across";
              break;
            case "cell-nine":
              acrossClueId = "two-across";
              downClueId = "three-down";
              break;
            case "cell-ten":
              acrossClueId = "two-across";
              downClueId = "four-down";
              break;
            case "cell-eleven":
              acrossClueId = "two-across";
              break;
            case "cell-twelve":
              acrossClueId = "two-across";
              downClueId = "six-down";
              break;

            case "cell-thirteen":
              downClueId = "one-down";
              break;
            case "cell-fifteen":
              downClueId = "three-down";
              break;
            case "cell-sixteen":
              downClueId = "four-down";
              break;
            case "cell-eighteen":
              downClueId = "six-down";
              break;

            case "cell-nineteen":
              acrossClueId = "four-across";
              downClueId = "one-down";
              break;
            case "cell-twenty":
              acrossClueId = "four-across";
              break;
            case "cell-twenty-one":
              acrossClueId = "four-across";
              downClueId = "three-down";
              break;
            case "cell-twenty-two":
              acrossClueId = "four-across";
              downClueId = "four-down";
              break;
            case "cell-twenty-three":
              acrossClueId = "four-across";
              break;
            case "cell-twenty-four":
              acrossClueId = "four-across";
              downClueId = "six-down";
              break;

            case "cell-twenty-five":
              downClueId = "one-down";
              break;
            case "cell-twenty-nine":
              acrossClueId = "five-across";
              break;
            case "cell-thirty":
              acrossClueId = "five-across";
              downClueId = "six-down";
              break;

            case "cell-thirty-one":
              acrossClueId = "six-across";
              downClueId = "one-down";
              break;
            case "cell-thirty-two":
              acrossClueId = "six-across";
              break;
            case "cell-thirty-three":
              acrossClueId = "six-across";
              break;
            case "cell-thirty-four":
              acrossClueId = "six-across";
              break;
          }

          const lastDisplayedDirection = cellClickTracker[cellId];
          let clueToShowId = null;
          let newDirection = null;

          const hasAcross = acrossClueId && cluesData[acrossClueId];
          const hasDown = downClueId && cluesData[downClueId];

          if (hasAcross && hasDown) {
            if (lastDisplayedDirection === "across") {
              clueToShowId = downClueId;
              newDirection = "down";
            } else {
              clueToShowId = acrossClueId;
              newDirection = "across";
            }
          } else if (hasAcross) {
            clueToShowId = acrossClueId;
            newDirection = "across";
          } else if (hasDown) {
            clueToShowId = downClueId;
            newDirection = "down";
          }

          if (clueToShowId) {
            displayClue(cellId, clueToShowId, newDirection);
          } else {
            allClueSpans.forEach((span) => (span.textContent = ""));
            cluesContainer.style.display = "none";
          }
        });

        inputElement.addEventListener("input", function () {
          this.value = this.value.toUpperCase();

          const currentCellId = this.parentElement.id;

          for (const wordId in words) {
            if (words[wordId].cells.includes(currentCellId)) {
              checkWord(wordId);
            }
          }
        });
      }
    });

    document.addEventListener("click", function (event) {
      const clickedInsideCell = event.target.closest(".cell");
      const clickedInsideClues = event.target.closest(".clues");
      const clickedInsideControls = event.target.closest(".controls");

      if (!clickedInsideCell && !clickedInsideClues && !clickedInsideControls) {
        cluesContainer.style.display = "none";
        allClueSpans.forEach((span) => (span.textContent = ""));
        currentActiveInput = null;
      }
    });

    // Function for when the crossword is solved
    function crosswordSolved() {
      cluesContainer.style.display = "none";

      const facbeookLink = document.getElementById("facebook-link");
      const xLink = document.getElementById("x-link");
      const linkedinLink = document.getElementById("linkedin-link");
      facbeookLink.href =
        "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fcrossword.html";
      xLink.href = `https://twitter.com/intent/tweet?text=I%20solved%20the%20Grammy%20Crossword!%20Test%20your%20knowledge%20here%3A&url=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fcrossword.html&hashtags=Crossword%2CGrammys%2CPuzzle`;
      linkedinLink.href =
        "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fcrossword.html&title=Grammy%20Awards%20Crossword%20-%20Test%20Your%20Music%20Knowledge!&summary=Challenge%20yourself%20with%20a%20fun%20crossword%20puzzle%20about%20the%20Grammy%20Awards!&source=Grammy%20Awards%3A%20Winners%20%26%20Records://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fquiz.html&title=Grammy%20Awards%20Quiz&summary=Think%20you%27re%20a%20Grammy%20expert%3F%20Take%20this%20quiz%20to%20prove%20your%20music%20trivia%20skills%20and%20see%20how%20well%20you%20know%20the%20history%20of%20the%20Grammys!&source=Grammy%20Awards%3A%20Winners%20%26%20Records";

      crosswordSummary.style.display = "block";

      const appDiv = document.querySelector(".app");
      const successMessage = document.createElement("p");
      successMessage.textContent = "You've solved the crossword! Well done!";
      successMessage.classList.add("success-message");

      appDiv.insertBefore(successMessage, crosswordSummary);
    }

    // Function to clear all cells and reset the crossword
    function resetCrossword() {
      const crosswordInputs = document.querySelectorAll(
        '.crossword .cell input[type="text"]'
      );

      crosswordInputs.forEach((input) => {
        input.value = "";
        input.disabled = false;
        input.parentElement.classList.remove("correct-word");
      });

      completedWords.clear();
      correctWordCount = 0;
      cluesContainer.style.display = "none";
      allClueSpans.forEach((span) => (span.textContent = ""));

      const successMessage = document.querySelector(".app .success-message");
      if (successMessage) {
        successMessage.remove();
      }
      document.getElementById("summary").style.display = "none";
    }

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetCrossword);

    // Function to reveal the crossword solution

    function revealSolution() {
      const cells = document.querySelectorAll(
        ".crossword .cell input[type='text']"
      );

      cells.forEach((cell) => {
        const cellId = cell.parentElement.id;
        cell.value = crosswordSolution[cellId];
        cell.disabled = true;
        cell.parentElement.classList.add("correct-word");
      });

      correctWordCount = totalWords;
      crosswordSolved();
    }

    const reavealSolutionButton = document.getElementById("solution-button");
    reavealSolutionButton.addEventListener("click", revealSolution);

    document.getElementById("summary").style.display = "none";
  }
}

crossword();

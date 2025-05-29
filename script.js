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
loadHTML(
  "header",
  "header.html",
  function () {
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
    }

    // Start of Light Mode logic
    const modeSwitch = document.getElementById("mode_switch");

    // Function to handle the switch toggle
    function switchMode() {
      document.body.classList.toggle("light-mode");

    // Check if light-mode is active after toggling
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
    // On initial page load (or after header.html is loaded)
    // Check localStorage for the preference and apply it
    const savedTheme = localStorage.getItem("themePreference") === "light";

    applyTheme(savedTheme);
  }
  // End of Light Mode Logic
);

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
    event.preventDefault(); // Prevent default form submission

    // Validate all fields on submit
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
(function () {
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

      facbeookLink.href = 'https://www.facebook.com/sharer/sharer.php?u=https://alexis-sammut.github.io/js-grammy-awards/quiz.html';
      xLink.href = `https://twitter.com/intent/tweet?text=I%20scored%20${score}/10%20on%20the%20Grammy%20Quiz!%20Test%20your%20knowledge%20here:&url=https://alexis-sammut.github.io/js-grammy-awards/quiz.html&hashtags=QuizTime,Grammys`;
      linkedinLink.href = 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Falexis-sammut.github.io%2Fjs-grammy-awards%2Fquiz.html&title=Grammy%20Awards%20Quiz&summary=Think%20you%27re%20a%20Grammy%20expert%3F%20Take%20this%20quiz%20to%20prove%20your%20music%20trivia%20skills%20and%20see%20how%20well%20you%20know%20the%20history%20of%20the%20Grammys!&source=Grammy%20Awards%3A%20Winners%20%26%20Records';
      
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
})();

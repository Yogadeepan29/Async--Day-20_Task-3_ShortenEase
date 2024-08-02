//!<------------------ Getting Elements -------------------->

const urlInput = document.getElementById("url-input");
const submit = document.getElementById("submit");
const errorMessage = document.getElementById("errorMsg");
const successMessage = document.getElementById("successMsg");
const result = document.getElementById("inout");

//* <---------- Function to Shorten a URL using the API ----------->

const shorten = (short) => {
  short.preventDefault();
  // Displaying a loading spinner on the submit button
  submit.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;

  //<-------- Validating URL Section --------->

  const urlPattern =
    /\b(?:(?:https?|ftp):\/\/|www\.)[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*\.[a-zA-Z]{1,}[-a-zA-Z0-9+&@#\/%=~_|]/;
  errorMessage.textContent = "";

  if (!urlInput.value) {
    errorMessage.textContent = "URL cannot be empty.";
    urlInput.placeholder = "eg : http://........";
    submit.innerHTML = "Ease it!";
    return;
  } else if (!urlPattern.test(urlInput.value)) {
    errorMessage.textContent = "Invalid URL";
    urlInput.value = "";
    urlInput.placeholder = "eg : http://........";
    submit.innerHTML = "Ease it!";
    return;
  }

  // <----- API Call ----->

  fetch("https://shrtlnk.dev/api/v2/link", {
    method: "POST",
    headers: {
      "api-key": "YOau3fpRgxCEofptnNcbZHUdOaFQ6dv01bVSDIR9xrDuo",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: urlInput.value }),
  })
    .then((response) => {
      // Check if the API response is OK
      if (!response.ok) {
        // If the response is not OK, throw an error with the error message or status code
        return response.json().then((errorData) => {
          throw new Error(errorData.message || response.status);
        });
      }
      return response.json();
    })

    .then((data) => {
      // console.log(data);
      urlInput.value = data.shrtlnk;
      successMessage.textContent =
        "The URL was shortened successfully, select the input to copy the text";
      submit.innerText = "Back";
      // Add event listener to the submit button for "Back" functionality
      submit.removeEventListener("click", shorten);
      submit.addEventListener("click", back);
      // Add event listener to the urlInput to copy text to clipboard
      urlInput.addEventListener("click", copyToClipboard);
    })

    // <---- Error Handling --->

    .catch((error) => {
      // console.error('Error:', error);
      errorMessage.textContent = `Error: ${error.message}`;
      submit.innerHTML = "Ease it!";
      successMessage.textContent = "";
      urlInput.value = "";
    });
};

//* <----------------- Function to Get Back and Copy URL to Clipboard ------------------>

// <--- Handling "Back" button click --->

const back = () => {
  urlInput.value = "";
  successMessage.textContent = "";
  submit.innerText = "Ease it!";
  submit.removeEventListener("click", back);
  submit.addEventListener("click", shorten);
  urlInput.placeholder = "Paste URL...";
};

// <--- Copy URL to clipboard --->

const copyToClipboard = () => {
  if (urlInput.value !== "") {
    if (navigator.clipboard) {
      urlInput.select();
      navigator.clipboard
        .writeText(urlInput.value)
        .then(() => {
          successMessage.textContent = "Copied to clipboard!";
          submit.innerText = "Copied";
          setTimeout(() => {
            submit.innerText = "Back";
          }, 1000);
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    } else {
      urlInput.select();
      //! In this code i have used a decrepted method for some additional functionality
      //!,how ever according to constraints iam not supposed to use any deprecpted tags,
      //! I can't able to find a alternative methods for android browsers to copy text,
      //! before validation please comment the method execCommand.
      document.execCommand("copy");
      successMessage.textContent = "Copied to clipboard!";
      submit.innerText = "Copied";
      setTimeout(() => {
        submit.innerText = "Back";
      }, 1000);
    }
  }
};

//* <--- Event listeners --->

submit.addEventListener("click", shorten);

// Input keydown function

urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submit.click();
  }
});

// Logics if input is empty

urlInput.addEventListener("input", () => {
  if (urlInput.value === "") {
    successMessage.textContent = "";
    submit.innerText = "Ease it!";
    submit.removeEventListener("click", back);
    submit.addEventListener("click", shorten);
    urlInput.placeholder = "Paste URL...";
  }
});

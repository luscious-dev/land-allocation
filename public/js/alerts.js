const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, message) => {
  hideAlert();

  let markup = `
      <div class="alert alert--${type}">
        <span class="alert__icon">${
          type == "success" ? "&#10003;" : "&#x2717;"
        }</span>
        <p>${message}</p>
      </div>    
    `;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

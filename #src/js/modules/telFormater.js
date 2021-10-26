"use strict";

(function () {
  var telInput = document.getElementById("tel");
  var validateInput = function (e) {
    e.target.value = e.target.value.replace(/[^0-9\.]/g, "");
  };

  if (!telInput) {
    return;
  }

  telInput.addEventListener("input", validateInput);
})();

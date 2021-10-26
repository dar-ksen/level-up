(function () {
  var $timer = document.getElementById("timer");
  if (!$timer) {
    return;
  }

  var countDownDate = new Date().getTime() + 30 * 60 * 1000;

  var x = setInterval(function () {
    var now = new Date().getTime();

    var distance = countDownDate - now;

    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $timer.innerHTML =
      hours + " часа " + minutes + " минут " + seconds + " секунд ";

    if (distance < 0) {
      clearInterval(x);
      $timer.innerHTML = "EXPIRED";
    }
  }, 1000);

  ("use strict");
})();

"use strict";

(function () {
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 3,
    spaceBetween: 10,
    autoHeight: true,
    loop: true,
    breakpoints: {
      480: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
})();

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

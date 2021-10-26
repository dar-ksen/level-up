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

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

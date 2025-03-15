document.addEventListener("DOMContentLoaded", function () {
  var navMenu = document.querySelector(".menu");
  var menuOpen = document.querySelector(".menuOpen");
  var menuClose = document.querySelector(".menuClose");

  menuOpen.addEventListener("click", function () {
    navMenu.style.display = "flex";
    menuOpen.style.display = "none";
    menuClose.style.display = "block";
  });

  menuClose.addEventListener("click", function () {
    navMenu.style.display = "none";
    menuOpen.style.display = "block";
    menuClose.style.display = "none";
  });
});

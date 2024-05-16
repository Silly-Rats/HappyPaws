function currentDiv(n) {
    showDivs(slideIndex = n);
  }
  
  function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("slide" + n);
    var dots = document.getElementsByClassName("w4-hover-opacity");
    if (n > dots.length) {slideIndex = 1}
    if (n < 1) {slideIndex = dots.length}
    for (i = 1; i <= dots.length; i++) {
      var slides = document.getElementsByClassName("slide" + i);
      for (var j = 0; j < slides.length; j++) {
        slides[j].style.display = "none";
      }
    }
    if(x.length > 0) {
      x[0].style.display = "block";
    }
  }


  document.addEventListener("DOMContentLoaded", function() {
    showDivs(1);
  });
  
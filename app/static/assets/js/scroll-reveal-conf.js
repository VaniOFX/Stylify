autosize(document.getElementById("form-comments"));

window.sr = ScrollReveal();
sr.reveal('.navbar', {
    duration: 2000,
    origin: 'bottom'
});
sr.reveal('.home-view-left', {
    duration: 2000,
    origin: 'top',
    distance: '200px'
});
sr.reveal('.home-view-right', {
    duration: 2000,
    origin: 'right',
    distance: '200px'
});
sr.reveal('#testimonial div', {
    duration: 2000,
    delay: 300,
    origin: 'bottom'
});
sr.reveal('.div-left', {
    duration: 2000,
    origin: 'left',
    distance: '200px',
    viewFactor: 0.2
});
sr.reveal('.div-right', {
    duration: 2000,
    origin: 'right',
    distance: '200px',
    viewFactor: 0.2
});
sr.reveal('#results-display', {
    duration: 2000,
    origin: 'right',
    distance: '200px',
    viewFactor: 0.2
}); 

// Smooth Scrolling
$(function () {
  $('a[href*="#"]:not([href="#"])').click(function () {
       if ($(this).attr("href") == "#result-gellery") return;
       if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
           var target = $(this.hash);
           target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
           if (target.length) {
             $('html, body').animate({
                   scrollTop: target.offset().top
               }, 1000);
               return false;
           }
       }
   });
});

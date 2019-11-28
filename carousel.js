$(function() {
  $(".gp_twitter_carousel").each(function() {
    var a = $(this), b = a.data("speed") || 5E3;
    a.carousel({interval:b}).swiperight(function() {
      a.carousel("prev");
    }).swipeleft(function() {
      a.carousel("next");
    }).filter(".start_paused").carousel("pause");
    2 > a.find(".carousel-item").length && a.find(".carousel-indicators, .carousel-control").hide();
  });
});

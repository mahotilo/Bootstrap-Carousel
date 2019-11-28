$.extend(gp_editor, {sortable_area_sel:".carousel-indicators", img_name:"", img_rel:"", edit_links_target:".carousel-inner .carousel-item", make_sortable:!1, auto_start:!0, wake:function() {
  $(gp_editor.edit_div).find(".gp_twitter_carousel").carousel("pause");
}, sleep:function() {
  0 < $("#ckeditor_wrap input[name=auto_start]:checked").length && $(gp_editor.edit_div).find(".gp_twitter_carousel").carousel("cycle");
}, addedImage:function(a) {
  var b = a.find("a:first").attr("href"), c = a.closest(".gp_twitter_carousel"), d = c.find(".carousel-inner"), e = $(".gp_blank_img").data("src") || "", b = $('<div class="carousel-item"><img src="' + e + '" style="background-image:url(' + b + ')"><div class="caption carousel-caption no_caption"></div></div>').appendTo(d);
  a.attr("data-target", "#" + c.attr("id")).attr("data-slide-to", a.siblings().length);
  b.siblings().length || (b.addClass("active"), a.addClass("active"));
}, updateCaption:function(a, b) {
  var c = $(a).find(".caption");
  test = b.replace(/^\s+/, "");
  "" == b ? c.addClass("no_caption") : c.removeClass("no_caption");
}, removeImage:function(a) {
  a = $(a).index();
  var b = $(".gp_editing .carousel-indicators");
  b.children().eq(a).remove();
  $(".gp_editing").carousel("next");
  b.children().each(function(a) {
    $(this).attr("data-slide-to", a).data("slide-to", a);
  });
}, heightChanged:function() {
  $(".gp_editing .gp_twitter_carousel").stop(!0, !0).delay(800).animate({"padding-bottom":this.value});
}, intervalSpeed:function() {
}, sortStop:function() {
  var a = gp_editor.edit_div.find(".carousel-inner"), b = a.find(".carousel-item");
  gp_editor.edit_div.find(gp_editor.sortable_area_sel).children().each(function(a) {
    var d = $(this), e = d.data("slide-to");
    b.eq(e).attr("data-new-position", a);
    d.data("slide-to", a).attr("data-slide-to", a);
  });
  b.sort(function(a, b) {
    return $(a).attr("data-new-position") < $(b).attr("data-new-position");
  }).each(function() {
    a.prepend(this);
  });
}, moveBack:function() {
  var a = $(".gp_editing .carousel-inner .active"), b = a.prev();
  if (b.length) {
    var c = b.html(), d = a.html();
    b.html(d);
    a.html(c);
    c = $(".gp_editing .carousel-indicators li");
    b = c.eq(b.index());
    a = c.eq(a.index());
    c = b.html();
    d = a.html();
    b.html(d);
    a.html(c);
    $(".gp_editing").carousel("prev");
  }
}, moveForward:function() {
  var a = $(".gp_editing .carousel-inner .active"), b = a.next();
  if (b.length) {
    var c = b.html(), d = a.html();
    b.html(d);
    a.html(c);
    c = $(".gp_editing .carousel-indicators li");
    b = c.eq(b.index());
    a = c.eq(a.index());
    c = b.html();
    d = a.html();
    b.html(d);
    a.html(c);
    $(".gp_editing").carousel("next");
  }
}});

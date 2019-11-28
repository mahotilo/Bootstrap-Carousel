(function(e, n, p) {
  "function" === typeof define && define.amd ? define(["jquery"], function(r) {
    p(r, e, n);
    return r.mobile;
  }) : p(e.jQuery, e, n);
})(this, document, function(e, n, p, r) {
  (function(b, w, e, p) {
    function t(c) {
      for (;c && "undefined" !== typeof c.originalEvent;) {
        c = c.originalEvent;
      }
      return c;
    }
    function x(c) {
      for (var E = {}, f, a;c;) {
        f = b.data(c, "virtualMouseBindings");
        for (a in f) {
          f[a] && (E[a] = E.hasVirtualBinding = !0);
        }
        c = c.parentNode;
      }
      return E;
    }
    function A() {
      u && (clearTimeout(u), u = 0);
      u = setTimeout(function() {
        y = u = 0;
        B.length = 0;
        F = !1;
        z = !0;
      }, b.vmouse.resetTimerDuration);
    }
    function k(c, a, f) {
      var d, g;
      if (!(g = f && f[c])) {
        if (f = !f) {
          a: {
            for (f = a.target;f;) {
              if ((g = b.data(f, "virtualMouseBindings")) && (!c || g[c])) {
                break a;
              }
              f = f.parentNode;
            }
            f = null;
          }
        }
        g = f;
      }
      if (g) {
        d = a;
        f = d.type;
        var h, m;
        d = b.Event(d);
        d.type = c;
        c = d.originalEvent;
        g = b.event.props;
        -1 < f.search(/^(mouse|click)/) && (g = r);
        if (c) {
          for (m = g.length, h;m;) {
            h = g[--m], d[h] = c[h];
          }
        }
        -1 < f.search(/mouse(down|up)|click/) && !d.which && (d.which = 1);
        if (-1 !== f.search(/^touch/) && (h = t(c), f = h.touches, h = h.changedTouches, c = f && f.length ? f[0] : h && h.length ? h[0] : p)) {
          for (f = 0, g = I.length;f < g;f++) {
            h = I[f], d[h] = c[h];
          }
        }
        b(a.target).trigger(d);
      }
      return d;
    }
    function a(c) {
      var a = b.data(c.target, "virtualTouchID");
      F || y && y === a || !(a = k("v" + c.type, c)) || (a.isDefaultPrevented() && c.preventDefault(), a.isPropagationStopped() && c.stopPropagation(), a.isImmediatePropagationStopped() && c.stopImmediatePropagation());
    }
    function d(c) {
      var a = t(c).touches, f;
      a && 1 === a.length && (f = c.target, a = x(f), a.hasVirtualBinding && (y = N++, b.data(f, "virtualTouchID", y), u && (clearTimeout(u), u = 0), v = z = !1, f = t(c).touches[0], J = f.pageX, K = f.pageY, k("vmouseover", c, a), k("vmousedown", c, a)));
    }
    function g(c) {
      z || (v || k("vmousecancel", c, x(c.target)), v = !0, A());
    }
    function m(c) {
      if (!z) {
        var a = t(c).touches[0], f = v, d = b.vmouse.moveDistanceThreshold, g = x(c.target);
        (v = v || Math.abs(a.pageX - J) > d || Math.abs(a.pageY - K) > d) && !f && k("vmousecancel", c, g);
        k("vmousemove", c, g);
        A();
      }
    }
    function l(c) {
      if (!z) {
        z = !0;
        var a = x(c.target), b;
        k("vmouseup", c, a);
        v || (b = k("vclick", c, a)) && b.isDefaultPrevented() && (b = t(c).changedTouches[0], B.push({touchID:y, x:b.clientX, y:b.clientY}), F = !0);
        k("vmouseout", c, a);
        v = !1;
        A();
      }
    }
    function L(c) {
      c = b.data(c, "virtualMouseBindings");
      var a;
      if (c) {
        for (a in c) {
          if (c[a]) {
            return !0;
          }
        }
      }
      return !1;
    }
    function M() {
    }
    function n(c) {
      var e = c.substr(1);
      return {setup:function(f, k) {
        L(this) || b.data(this, "virtualMouseBindings", {});
        b.data(this, "virtualMouseBindings")[c] = !0;
        q[c] = (q[c] || 0) + 1;
        1 === q[c] && C.bind(e, a);
        b(this).bind(e, M);
        G && (q.touchstart = (q.touchstart || 0) + 1, 1 === q.touchstart && C.bind("touchstart", d).bind("touchend", l).bind("touchmove", m).bind("scroll", g));
      }, teardown:function(f, k) {
        --q[c];
        q[c] || C.unbind(e, a);
        G && (--q.touchstart, q.touchstart || C.unbind("touchstart", d).unbind("touchmove", m).unbind("touchend", l).unbind("scroll", g));
        var w = b(this), h = b.data(this, "virtualMouseBindings");
        h && (h[c] = !1);
        w.unbind(e, M);
        L(this) || w.removeData("virtualMouseBindings");
      }};
    }
    w = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" ");
    var I = "clientX clientY pageX pageY screenX screenY".split(" "), r = b.event.props.concat(b.event.mouseHooks ? b.event.mouseHooks.props : []), q = {}, u = 0, J = 0, K = 0, v = !1, B = [], F = !1, z = !1, G = "addEventListener" in e, C = b(e), N = 1, y = 0, H;
    b.vmouse = {moveDistanceThreshold:10, clickDistanceThreshold:10, resetTimerDuration:1500};
    for (var D = 0;D < w.length;D++) {
      b.event.special[w[D]] = n(w[D]);
    }
    G && e.addEventListener("click", function(c) {
      var a = B.length, d = c.target, g, m, h, e, l;
      if (a) {
        for (g = c.clientX, m = c.clientY, H = b.vmouse.clickDistanceThreshold, h = d;h;) {
          for (e = 0;e < a;e++) {
            if (l = B[e], h === d && Math.abs(l.x - g) < H && Math.abs(l.y - m) < H || b.data(h, "virtualTouchID") === l.touchID) {
              c.preventDefault();
              c.stopPropagation();
              return;
            }
          }
          h = h.parentNode;
        }
      }
    }, !0);
  })(e, n, p);
  e.mobile = {};
  (function(b, e) {
    var n = {touch:"ontouchend" in p};
    b.mobile.support = b.mobile.support || {};
    b.extend(b.support, n);
    b.extend(b.mobile.support, n);
  })(e);
  (function(b, e, n) {
    function r(a, d, g) {
      var e = g.type;
      g.type = d;
      b.event.dispatch.call(a, g);
      g.type = e;
    }
    var t = b(p);
    b.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(a, d) {
      b.fn[d] = function(a) {
        return a ? this.bind(d, a) : this.trigger(d);
      };
      b.attrFn && (b.attrFn[d] = !0);
    });
    var x = (e = b.mobile.support.touch) ? "touchstart" : "mousedown", A = e ? "touchend" : "mouseup", k = e ? "touchmove" : "mousemove";
    b.event.special.scrollstart = {enabled:!0, setup:function() {
      function a(a, b) {
        g = b;
        r(d, g ? "scrollstart" : "scrollstop", a);
      }
      var d = this, g, e;
      b(d).bind("touchmove scroll", function(d) {
        b.event.special.scrollstart.enabled && (g || a(d, !0), clearTimeout(e), e = setTimeout(function() {
          a(d, !1);
        }, 50));
      });
    }};
    b.event.special.tap = {tapholdThreshold:750, setup:function() {
      var a = this, d = b(a);
      d.bind("vmousedown", function(g) {
        function e() {
          clearTimeout(p);
        }
        function l() {
          e();
          d.unbind("vclick", k).unbind("vmouseup", e);
          t.unbind("vmousecancel", l);
        }
        function k(b) {
          l();
          n === b.target && r(a, "tap", b);
        }
        if (g.which && 1 !== g.which) {
          return !1;
        }
        var n = g.target, p;
        d.bind("vmouseup", e).bind("vclick", k);
        t.bind("vmousecancel", l);
        p = setTimeout(function() {
          r(a, "taphold", b.Event("taphold", {target:n}));
        }, b.event.special.tap.tapholdThreshold);
      });
    }};
    b.event.special.swipe = {scrollSupressionThreshold:30, durationThreshold:1E3, horizontalDistanceThreshold:30, verticalDistanceThreshold:75, start:function(a) {
      var d = a.originalEvent.touches ? a.originalEvent.touches[0] : a;
      return {time:(new Date).getTime(), coords:[d.pageX, d.pageY], origin:b(a.target)};
    }, stop:function(a) {
      a = a.originalEvent.touches ? a.originalEvent.touches[0] : a;
      return {time:(new Date).getTime(), coords:[a.pageX, a.pageY]};
    }, handleSwipe:function(a, d) {
      d.time - a.time < b.event.special.swipe.durationThreshold && Math.abs(a.coords[0] - d.coords[0]) > b.event.special.swipe.horizontalDistanceThreshold && Math.abs(a.coords[1] - d.coords[1]) < b.event.special.swipe.verticalDistanceThreshold && a.origin.trigger("swipe").trigger(a.coords[0] > d.coords[0] ? "swipeleft" : "swiperight");
    }, setup:function() {
      var a = b(this);
      a.bind(x, function(d) {
        function e(a) {
          m && (l = b.event.special.swipe.stop(a), Math.abs(m.coords[0] - l.coords[0]) > b.event.special.swipe.scrollSupressionThreshold && a.preventDefault());
        }
        var m = b.event.special.swipe.start(d), l;
        a.bind(k, e).one(A, function() {
          a.unbind(k, e);
          m && l && b.event.special.swipe.handleSwipe(m, l);
          m = l = n;
        });
      });
    }};
    b.each({scrollstop:"scrollstart", taphold:"tap", swipeleft:"swipe", swiperight:"swipe"}, function(a, d) {
      b.event.special[a] = {setup:function() {
        b(this).bind(d, b.noop);
      }};
    });
  })(e, this);
});

!function (a, b) {
	function c() {
		var b = f.getBoundingClientRect().width;
		b / i > 540 && (b = 540 * i);
		var c = b / 10;
		f.style.fontSize = c + "px", k.rem = a.rem = c
	}

	var d, e = a.document, f = e.documentElement, g = e.querySelector('meta[name="viewport"]'), h = e.querySelector('meta[name="flexible"]'), i = 0, j = 0, k = b.flexible || (b.flexible = {});
	if (g) {
		console.warn("将根据已有的meta标签来设置缩放比例");
		var l = g.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
		l && (j = parseFloat(l[1]), i = parseInt(1 / j))
	} else if (h) {
		var m = h.getAttribute("content");
		if (m) {
			var n = m.match(/initial\-dpr=([\d\.]+)/), o = m.match(/maximum\-dpr=([\d\.]+)/);
			n && (i = parseFloat(n[1]), j = parseFloat((1 / i).toFixed(2))), o && (i = parseFloat(o[1]), j = parseFloat((1 / i).toFixed(2)))
		}
	}
	if (!i && !j) {
		var p = (a.navigator.appVersion.match(/android/gi), a.navigator.appVersion.match(/iphone/gi)), q = a.devicePixelRatio;
		i = p ? q >= 3 && (!i || i >= 3) ? 3 : q >= 2 && (!i || i >= 2) ? 2 : 1 : 1, j = 1 / i
	}
	if (f.setAttribute("data-dpr", i), !g)if (g = e.createElement("meta"), g.setAttribute("name", "viewport"), g.setAttribute("content", "initial-scale=" + j + ", maximum-scale=" + j + ", minimum-scale=" + j + ", user-scalable=no"), f.firstElementChild)f.firstElementChild.appendChild(g); else {
		var r = e.createElement("div");
		r.appendChild(g), e.write(r.innerHTML)
	}
	a.addEventListener("resize", function () {
		clearTimeout(d), d = setTimeout(c, 300)
	}, !1), a.addEventListener("pageshow", function (a) {
		a.persisted && (clearTimeout(d), d = setTimeout(c, 300))
	}, !1), "complete" === e.readyState ? e.body.style.fontSize = 12 * i + "px" : e.addEventListener("DOMContentLoaded", function () {
		e.body.style.fontSize = 12 * i + "px"
	}, !1), c(), k.dpr = a.dpr = i, k.refreshRem = c, k.rem2px = function (a) {
		var b = parseFloat(a) * this.rem;
		return "string" == typeof a && a.match(/rem$/) && (b += "px"), b
	}, k.px2rem = function (a) {
		var b = parseFloat(a) / this.rem;
		return "string" == typeof a && a.match(/px$/) && (b += "rem"), b
	}



}(window, window.flexible || (window.flexible = {}));

!function (requireConfig) {
    "use strict";

    //requireConfig.baseUrl = "../js";
    requireConfig.paths = {
        wx: "../js/vendor/jweixin-1.0.0",
        zepto: "../js/vendor/zepto.min",
        swiper: "../js/vendor/swiper.min",
        ux: "../js/ux",
      	constant: "../IPconfigure/APIconfigure",
        //ue:'ux'
		//center: 'center',
		
//		regAndLog:'regAndLog',

//      polling:'polling',
//      print:'print',
        //common: "public/common",

       // status: "index/printer.status",
       // number: "index/printer.number",

	//	sdk: "print/print.init",
		//template:'print/render.template',
		//entry:'print/print.entry',

		///space:'space',

		//upload:'upload',

	//	ticket:'ticket/main',

        //password: 'password/password',

      //  centerSet: 'center-set/center-set',

      //  printLog: 'print-log/print-log',

    };
    requireConfig.urlArgs = "r=" + Math.random();
    window.requireConfig = requireConfig
	//@todo 仅用在 gulp 任务生成 flexible.js 版本控制起效
	window.DSVersion = "[1520995180176]";//用来改变内容的hash值
}(window.requireConfig || {});

//JSON.stringify(requireConfig.paths)

var get = {
    on: function(ele, type, handler) {
        return ele.addEventListener ? ele.addEventListener(type, handler, false) : ele.attachEvent("on" + type, handler);
    },
    blind: function(obj, handler) {
        return function() {
            return handler.apply(obj, arguments);
        }
    },
    pageY: function(ele) {
        return ele.offsetTop + (ele.offsetParent ? arguments.callee(ele.offsetParent) : 0);
    },
    pageX: function(ele) {
        return ele.offsetLeft + (ele.offsetParent ? arguments.callee(ele.offsetParent) : 0);
    },
    hasClass: function(ele, cName) {
        var reg = new RegExp("(^| )" + cName + "( |$)");
        return reg.test(ele.className);
    },
    attr: function(ele, attr, value) {
        if (arguments.length == 2) {
            return ele.attributes[attr] ? ele.attributes[attr].nodeValue : undefined;
        } else if (arguments.length == 3) {
            return ele.setAttribute(attr, value);
        }
    }
};

//延时加载函数
function LazyLoad(obj) {
    this.box = typeof obj == "string" ? document.getElementById(obj) : obj;
    this.oImg = this.box.getElementsByTagName("img");
    this.fnLoad = get.blind(this, this.load);
    this.load();
    //绑定事件
    get.on(window, 'scroll', this.fnLoad);
    get.on(window, 'resize', this.fnLoad);
}

//原型
LazyLoad.prototype = {
    load: function() {
        var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var iClientHeight = document.documentElement.clientHeight + iScrollTop;
        var iTop = 0;
        var iBottom = 0;
        var oParent = null;
        var aNotLoaded = this.loaded(0);
        if (this.loaded(1).length !== this.oImg.length) {
            for (var i = 0; i < aNotLoaded.length; i++) {
                oParent = aNotLoaded[i].parentElement || aNotLoaded[i].parentNode;
                iTop = get.pageY(oParent);
                iBottom = iTop + oParent.offsetHeight;
                if ((iTop > iScrollTop && iTop < iClientHeight) || (iBottom > iScrollTop && iBottom < iClientHeight)) {
                    aNotLoaded[i].src = get.attr(aNotLoaded[i], "data-img") || aNotLoaded[i].src;
                    aNotLoaded[i].className = "loaded";
                }
            }
        }
    },
    loaded: function(states) {
        var arr = [];
        for (var i = 0; i < this.oImg.length; i++) {
            !!states ? get.hasClass(this.oImg[i]) && arr.push(this.oImg[i]) : get.hasClass(this.oImg[i]) || arr.push(this.oImg[i]);
        }
        return arr;
    }
}

//实例化
get.on(window, 'load', function() { new LazyLoad("box") });
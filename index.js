var get = {
    on: function(ele, type, handler) {
        return ele.addEventListener ? ele.addEventListener(type, handler, false) : ele.attachEvent("on" + type, handler);
    },
    pageX: function(ele) {
        return ele.offsetLeft + (ele.offsetParent ? arguments.callee(ele.offsetParent) : 0);
    },
    pageY: function(ele) {
        return ele.offsetTop + (ele.offsetParent ? arguments.callee(ele.offsetParent) : 0);
    },
    hasClass: function(ele, cName) {
        var reg = new RegExp("(^| )" + cName + "( |$)");
        return reg.test(ele.className);
    },
    attr: function(ele, attr, value) {
        if (arguments.length == 2) {
            return ele.attributes[attr] ? ele.attributes[attr].nodeValue : undefined;
        } else if (arguments.length == 3) {
            return ele.setAttribute(attr, value)
        }
    },
    blind: function(obj, handler) {
        return function() {
            return handler.apply(obj, arguments);
        }
    }
};

//延时加载
function LazyLoad(obj) {
    this.obj = typeof obj == "string" ? document.getElementById(obj) : obj;
    this.oImg = this.obj.getElementsByTagName("img");
    this.fnLoad = get.blind(this, this.load);
    this.load();
    //绑定事件
    get.on(window, 'scroll', this.fnLoad);
    get.on(window, 'resize', this.fnLoad);
}

//原型
LazyLoad.prototype = {
    load: function() {
        var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动高度
        var iClientHeight = document.documentElement.clientHeight + iScrollTop; //屏幕高度加上滚动高度
        var i = 0;
        var oParent = null;
        var iTop = 0;
        var iBottom = 0;
        var aNotLoaded = this.loaded(0); //所有不含class中不含loaded的img数组
        if (this.loaded(1).length != this.oImg.length) {
            for (i = 0; i < aNotLoaded.length; i++) {
                oParent = aNotLoaded[i].parentElement || aNotLoaded[i].parentNode;
                iTop = get.pageY(oParent);
                iBottom = iTop + oParent.offsetHeight;
                if ((iTop > iScrollTop && iTop < iClientHeight) || (iBottom > iScrollTop && iBottom < iClientHeight)) {
                    aNotLoaded[i].src = get.attr(aNotLoaded[i], 'data-img') || aNotLoaded.src;
                    aNotLoaded[i].className = 'loaded';
                }
            }
        }
    },
    loaded: function(status) {
        var arry = [];
        var i = 0;
        for (i = 0; i < this.oImg.length; i++) {
            !!status ? get.hasClass(this.oImg[i], 'loaded') && arry.push(this.oImg[i]) : get.hasClass(this.oImg[i], 'loaded') || arry.push(this.oImg[i]);
        }
        return arry;
    }
};
//应用
get.on(window, 'load', function() { new LazyLoad('box') })
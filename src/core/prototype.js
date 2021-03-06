/**
 * Created by du on 16/9/28.
 */

export var prototype = {

    ready: function(callback){
        if (/complete|loaded|interactive/.test(document.readyState)
            && document.body) {
            callback($)
        }
        else {
            this.on('DOMContentLoaded', function(){ callback($) }, false)
        }
        return this
    },
    each(callback){
        this.every(function (el, idx) {
            return callback(el, idx) !== false
        })
        return this;
    },

    on(evt, mix,fun){
        if ($.isString(mix)){
            this.each(e => {
                $(e).on(evt, ()=>{
                    var t= event.target;
                    if($(mix,e).indexOf(t)!=-1){
                        fun.call(t,e);
                    }
                }, false);
            })
        }else {
            this.each(e => {
                e.addEventListener(evt, mix, false);
            })
        }
        return this;
    },

    off(event, callback){
        return this.each(e => {
            e.removeEventListener(event, callback, false);
        })
    },

    click(callback){
        return this.on("click", callback);
    },

    eq(index){
        return $(this[index]);
    },

    last(){
        return $(this.pop());
    },

    add(o){
        [].push.apply(this, $(o));
        return this;
    },

    text(s,type){
        type=type||"textContent";
        if(s){
          return  this.each(e=>{
                e[type]=s;
            })
        }else{
            return this[0][type];
        }
    },

    html(s){
      return this.text(s,"innerHTML")  ;
    },

    children(){
        var t = [];
        this.each(e=> {
            t.push.apply(t, e.childNodes);
        });
        return $($.unique(t).filter(e=> {
            return e.nodeType == 1
        }));
    },

    css(mix, value){
        var t = {};
        if (value) {
            t[mix] = value
        } else if ($.isObject(mix)) {
            t = mix;
        }

        if (JSON.stringify(t) != "{}") {
            var s=["height","width","fontSize","top","left","right","bottom"]
            s.forEach(e=>{
                t[e]=t[e]&&parseFloat(t[e])+"px";
            })
            return this.each(e=> {
                $.extend(e.style, t);
            })
        } else {
            return this[0] && getComputedStyle(this[0])[mix];
        }
    },

    hide(){
        return  this.each(e=>{
            $(e).attr("od",$(e).css("display")).css("display","none");
        })
    },

    show(){
       return this.each(e=>{
           $(e).css("display",$(e).attr("od"));
       })
    },

    attr(name, value){
        if (value != undefined) {
            return this.each(e=> {
                e.setAttribute(name, value)
            })
        } else {
            return this[0] && this[0].getAttribute(name);
        }
    },

    removeAttr(name){
        return this.each(e=> {
            e.removeAttribute(name)
        })
    },

    hasClass(cls) {
        return !!this[0].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass(cls) {
        return this.each(f => {
            if (!$(f).hasClass(cls)) {
                f.className += " " + cls
            }
        })
    },

    removeClass(cls) {
        return this.each(f => {
            if ($(f).hasClass(cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                f.className = f.className.replace(reg, ' ');
            }
        })
    },

    find(selector){
        return $(selector, this[0]);
    },
    append(content){
        var to = $(content);
        return this.each(e=> {
            to.each(x=> {
                e.appendChild(x);
            })
        })
    },
    appendTo(s){
        $(s).eq(0).append(this);
        return this;
    },

    before(ref){
        var t = $(ref);
        return this.each(e=> {
            t.parent()[0].insertBefore(e, t[0]);
        })
    },
    remove(){
        this.each(e=>{
            $(e).parent()[0].removeChild(e);
        })
    },
    trigger(event){
        var evt = document.createEvent( 'HTMLEvents' );
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        this[0].dispatchEvent(evt);
        return this;
    },
    animate(styles,speed){
       return $.Deferred((d)=>{
            var start={};
            for(var k in styles){
                start[k]=parseFloat($(this).css(k))
            }
            $.animate(speed,styles,(t)=>{
                for(var i in styles){
                    $(this).css(i,start[i]+t/speed*(styles[i]-start[i]))
                }
                if (t==speed){
                    d.resolve()
                }
            })
        }).promise();
    }
}

var t = ["parentElement", "previousSibling", "nextSibling"]
t.forEach(e=> {
    var i = !e.lastIndexOf("par") ? 6 : 4;
    prototype[e.substr(0, i)] = function () {
        var t = [];
        this.each(ele=> {
            t.push(ele[e]);
        })
        return $($.unique(t));
    }
})
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["38ac3208"],{"0418":function(t,e,n){"use strict";var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-header",{staticClass:"bg-primary-dark1 no-shadow",attrs:{reveal:""}},[s("q-toolbar",{staticClass:"q-pt-xl"},[t.routesWithBackButton.includes(t.currentRoute)?s("q-btn",{staticClass:"q-mr-sm",attrs:{flat:"",round:"",dense:""},on:{click:function(e){return t.$router.replace("first-step")}}},[s("img",{staticClass:"back-button-icon",attrs:{src:n("336c")}})]):t._e(),s("q-toolbar-title",{staticClass:"flex justify-center"},["/signup/third-step"==t.currentRoute?s("h1",[t._v("Авторизация")]):s("h1",[t._v("Регистрация")])]),t.routesWithBackButton.includes(t.currentRoute)?s("q-btn",{staticClass:"q-mr-sm",attrs:{flat:"",round:"",dense:""}}):t._e()],1)],1)},r=[],a={name:"Header",data:function(){return{currentRoute:this.$router.currentRoute.path,routesWithBackButton:["/signup/second-step"]}}},i=a,c=n("2877"),o=n("eebe"),u=n.n(o),l=n("e359"),p=n("65c6"),h=n("9c40"),d=n("6ac5"),f=Object(c["a"])(i,s,r,!1,null,"45075dcc",null);e["a"]=f.exports;u()(f,"components",{QHeader:l["a"],QToolbar:p["a"],QBtn:h["a"],QToolbarTitle:d["a"]})},"045c":function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-page",{staticClass:"flex q-pa-lg"},[n("Header"),n("div",{staticClass:"flex row justify-center content-center full-width"},[n("h2",{staticClass:"flex justify-center full-width q-mt-xl"},[t._v("Введите код")]),n("label",{staticClass:"flex justify-center content-center items-center q-ml-sm pin-label"},[t._v(t._s(t.t1))]),n("label",{staticClass:"flex justify-center content-center items-center q-ml-sm pin-label"},[t._v(t._s(t.t2))]),n("label",{staticClass:"flex justify-center content-center items-center q-ml-sm pin-label"},[t._v(t._s(t.t3))]),n("label",{staticClass:"flex justify-center content-center items-center q-ml-sm pin-label"},[t._v(t._s(t.t4))]),n("q-input",{staticClass:"q-mt-md full-width pin-input",attrs:{pattern:"\\d*",maxlength:"4",autofocus:"",type:"tel",dark:"",borderless:""},model:{value:t.pin,callback:function(e){t.pin=e},expression:"pin"}})],1),n("div",{staticClass:"flex row justify-center items-end full-width"},[n("h3",{directives:[{name:"show",rawName:"v-show",value:t.errorMessage.length>0,expression:"errorMessage.length > 0"}],staticClass:"q-pa-lg full-width"},[t._v(t._s(t.errorMessage))]),n("q-btn",{staticClass:"full-width submit-button",attrs:{label:"Завершить",loading:t.submitting,disable:!t.isButtonActive,"no-caps":""},on:{click:t.save},scopedSlots:t._u([{key:"loading",fn:function(){return[n("q-spinner")]},proxy:!0}])})],1)],1)},r=[],a=(n("a481"),n("967e")),i=n.n(a),c=(n("96cf"),n("fa84")),o=n.n(c),u=n("0418"),l=n("2dd8"),p={name:"SignUpSecondStep",components:{Header:u["a"]},data:function(){return{pin:"",passwordRepeat:"",check:!1,submitting:!1,isButtonActive:!0,errorMessage:"",idrref:this.$config.userIdrref,deviceId:"cb2a8213-9da2-4756-93ea-549ae7cfe6c1",signature:"a80ef6f574652d870113226ba0cbe72c"}},computed:{t1:function(){return this.pin.length>=1?"•":""},t2:function(){return this.pin.length>=2?"•":""},t3:function(){return this.pin.length>=3?"•":""},t4:function(){return 4==this.pin.length?"•":""}},methods:{getStatus:function(){var t=o()(i.a.mark((function t(){var e,n,s,r,a=this;return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.errorMessage="",this.check=!0,e="select * from _reference13 where _cid = '".concat(this.deviceId,"'"),n=Object(l["a"])(e),s={method:"post",url:"http://pn.pronet.kg:1072",data:n},t.next=7,this.$axios(s).then((function(t){var e=t.data.envelope.body.response.data[0]["_status"];return 0==e&&(a.errorMessage="В ожидании"),2==e&&(a.errorMessage="Отклонено"),1==e&&(a.errorMessage="Принято"),a.check=!1,localStorage.status=e,a.errorMessage})).catch((function(t){console.error("Произошла ошибка при запросе статуса терминала: ",JSON.stringify(t)),a.errorMessage="Произошла ошибка при соединении с сервером",a.check=!1}));case 7:return r=t.sent,t.abrupt("return",r);case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),save:function(){var t=o()(i.a.mark((function t(){var e,n=this;return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(console.log("Запушен второй шаг регистрации"),this.submitting=!0,this.isButtonActive=!1,!(0==this.pin.length||this.pin.length<4)){t.next=9;break}return console.warn("Не заполено поле с кодом смс"),this.errorMessage="Введите код с смс",this.submitting=!1,this.isButtonActive=!0,t.abrupt("return");case 9:e={method:"post",url:"http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=2&idrref=".concat(this.idrref,"&pin=").concat(this.pin,"&signature=").concat(this.signature)},this.$axios(e).then((function(t){console.log("Второй шаг регистрации прошел успешно",t);var e=t.data.envelope.body.response.data;if(0==e.length)return n.errorMessage="Неверный пин код. Попробуйте снова",n.submitting=!1,void(n.isButtonActive=!0);var s=t.data.envelope.body.response.data._code;n.$store.commit("setAccount",s),n.submitting=!1,n.isButtonActive=!0,localStorage.idrref=n.$config.userIdrref,localStorage.account=s,n.$router.replace("third-step")})).catch((function(t){console.error("Произошла ошибка при втором шаге регистрации: ",JSON.stringify(t)),n.errorMessage="Произошла ошибка при соединении с сервером",n.submitting=!1,n.isButtonActive=!0}));case 11:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()}},h=p,d=n("2877"),f=n("eebe"),g=n.n(f),A=n("9989"),m=n("27f9"),b=n("9c40"),v=n("0d59"),w=Object(d["a"])(h,s,r,!1,null,"3838cff9",null);e["default"]=w.exports;g()(w,"components",{QPage:A["a"],QInput:m["a"],QBtn:b["a"],QSpinner:v["a"]})},"336c":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAmCAYAAACRWlj1AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFpSURBVHgB3dnNbcJAEIbhb62IC47kIpJFljjQgktICSkhHZBKQgcpwenAHLhg50AqCGckvNlBAYkf27s2h515T1w4PAL/zA5wh4qiSKrqO1+tyhkCS2FghBuP49x+JNx2tzPZdKqXCKRBwAvcsaCQvYENuGPBICP0qANHJaMRPhBAD/DMAQdjzKau9y8IIK+/qAcuS9N0gwByBnLEUU5ArjiqE8gZR7UCueOoRqAEHHUTKAVHXQEl4agzoDQcdQK64P6/sjBm/wMmHYDuOH4pyTgqiuPHTwjFUZEx9ZtSaguhHa7BsixnSkW5vUMmENbpLuqB/AKjzp6Dbki10PrpFUy6epORhrz5LioJ2ThNSEG2zoMSkJ0TPXek05kMZ6TzqRpXpNe5KEek926CG7LX8oUTstfyRWu9tFNI1jaFWHwQU/+g/WDTL2kM3ieT5zkCaPCG9xIZEu5uEdLu6H/X62oOqdHZDgLsD5tCQjgSgxeTAAAAAElFTkSuQmCC"}}]);
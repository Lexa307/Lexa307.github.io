(function(e){function o(o){for(var t,l,i=o[0],c=o[1],s=o[2],p=0,d=[];p<i.length;p++)l=i[p],Object.prototype.hasOwnProperty.call(n,l)&&n[l]&&d.push(n[l][0]),n[l]=0;for(t in c)Object.prototype.hasOwnProperty.call(c,t)&&(e[t]=c[t]);u&&u(o);while(d.length)d.shift()();return a.push.apply(a,s||[]),r()}function r(){for(var e,o=0;o<a.length;o++){for(var r=a[o],t=!0,i=1;i<r.length;i++){var c=r[i];0!==n[c]&&(t=!1)}t&&(a.splice(o--,1),e=l(l.s=r[0]))}return e}var t={},n={app:0},a=[];function l(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,l),r.l=!0,r.exports}l.m=e,l.c=t,l.d=function(e,o,r){l.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:r})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,o){if(1&o&&(e=l(e)),8&o)return e;if(4&o&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(l.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var t in e)l.d(r,t,function(o){return e[o]}.bind(null,t));return r},l.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(o,"a",o),o},l.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},l.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=o,i=i.slice();for(var s=0;s<i.length;s++)o(i[s]);var u=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,o,r){e.exports=r("56d7")},"12c3":function(e,o,r){},"56d7":function(e,o,r){"use strict";r.r(o);r("e260"),r("e6cf"),r("cca6"),r("a79d");var t,n=r("2b0e"),a=function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("div",{attrs:{id:"app"}},[r("ModelViewer",{attrs:{initialFloorType:"keel",initialSideBand:!0,polymerProtection:!1}})],1)},l=[],i=function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("div",{staticClass:"wrapper"},[r("div",{staticClass:"sidebar"},[e._m(0),r("input",{directives:[{name:"model",rawName:"v-model",value:e.floor_type,expression:"floor_type"}],attrs:{name:"floor_type",type:"radio",value:"keel"},domProps:{checked:e._q(e.floor_type,"keel")},on:{change:[function(o){e.floor_type="keel"},e.changeFloor]}}),e._v(" Килевое "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.floor_type,expression:"floor_type"}],attrs:{name:"floor_type",type:"radio",value:"flat"},domProps:{checked:e._q(e.floor_type,"flat")},on:{change:[function(o){e.floor_type="flat"},e.changeFloor]}}),e._v(" Плоское "),e._m(1),r("input",{directives:[{name:"model",rawName:"v-model",value:e.side_band,expression:"side_band"}],attrs:{name:"side_band",type:"checkbox",value:"true"},domProps:{checked:Array.isArray(e.side_band)?e._i(e.side_band,"true")>-1:e.side_band},on:{change:[function(o){var r=e.side_band,t=o.target,n=!!t.checked;if(Array.isArray(r)){var a="true",l=e._i(r,a);t.checked?l<0&&(e.side_band=r.concat([a])):l>-1&&(e.side_band=r.slice(0,l).concat(r.slice(l+1)))}else e.side_band=n},e.setSideBand]}}),e._m(2),r("input",{directives:[{name:"model",rawName:"v-model",value:e.polymer_protect,expression:"polymer_protect"}],attrs:{name:"polymer_protect",type:"checkbox"},domProps:{checked:Array.isArray(e.polymer_protect)?e._i(e.polymer_protect,null)>-1:e.polymer_protect},on:{change:[function(o){var r=e.polymer_protect,t=o.target,n=!!t.checked;if(Array.isArray(r)){var a=null,l=e._i(r,a);t.checked?l<0&&(e.polymer_protect=r.concat([a])):l>-1&&(e.polymer_protect=r.slice(0,l).concat(r.slice(l+1)))}else e.polymer_protect=n},e.setPolymerProtection]}}),e._m(3),r("input",{directives:[{name:"model",rawName:"v-model",value:e.main_color,expression:"main_color"}],attrs:{type:"color"},domProps:{value:e.main_color},on:{input:[function(o){o.target.composing||(e.main_color=o.target.value)},function(o){return e.setMainColor(o)}]}}),e._m(4),r("input",{directives:[{name:"model",rawName:"v-model",value:e.floor_color,expression:"floor_color"}],attrs:{type:"color"},domProps:{value:e.floor_color},on:{input:[function(o){o.target.composing||(e.floor_color=o.target.value)},function(o){return e.setFloorColor(o)}]}}),e._m(5),r("input",{directives:[{name:"model",rawName:"v-model",value:e.nose_color,expression:"nose_color"}],attrs:{type:"color"},domProps:{value:e.nose_color},on:{input:[function(o){o.target.composing||(e.nose_color=o.target.value)},function(o){return e.setNoseColor(o)}]}}),e._m(6),r("input",{directives:[{name:"model",rawName:"v-model",value:e.cone_color,expression:"cone_color"}],attrs:{type:"color"},domProps:{value:e.cone_color},on:{input:[function(o){o.target.composing||(e.cone_color=o.target.value)},function(o){return e.setConeColor(o)}]}})]),r("canvas",{attrs:{id:"renderCanvas"}})])},c=[function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Тип дна")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Боковая полоса")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Полимерная защита дна")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Цвет баллонов")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Цвет дна")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Цвет носовой части")])])},function(){var e=this,o=e.$createElement,r=e._self._c||o;return r("p",[r("b",[e._v("Цвет концевиков баллонов")])])}],s=(r("7db0"),r("d81d"),r("b0c0"),r("ac1f"),r("466d"),r("a942")),u=r("191e"),p=r("b555"),d=r("55f2"),m=r("4aa2"),f=r("9450"),_=r("26b7"),v=(r("752c"),function(e){return t.meshes.find((function(o){return o.name===e}))});function y(e,o){e.isVisible=o;var r=e.getChildMeshes();if(r.length)for(var t=0;t<r.length;t++)r[t].isVisible=o}window.addEventListener("DOMContentLoaded",(function(){var e=document.getElementById("renderCanvas"),o=new s["a"](e,!0),r=function(){var r=new p["a"](o);r.clearColor=new u["a"](1,1,1);var t=new d["a"]("Camera",0,.8,6,u["b"].Zero(),r);return t.attachControl(e,!0),t.lowerRadiusLimit=3,t.upperRadiusLimit=6,t.panningSensibility=0,new m["a"]("light1",new u["b"](0,1,0),r),new f["a"]("DirectionalLight",new u["b"](0,1,0),r),_["a"].ImportMesh(["цилиндр","дно_плоское","дно_киль"],"./models/","лодка_сборка1.glb",r,(function(){var e=v("дно_плоское");y(e,!1);var o=v("полимерная_защита");y(o,!1)})),r};t=r(),console.log(t),o.runRenderLoop((function(){t.render()})),window.addEventListener("resize",(function(){o.resize()}))}));var h={name:"ModelViewer",props:{initialFloorType:String,initialSideBand:Boolean,polymerProtection:Boolean},methods:{changeFloor:function(){var e=v("дно_плоское"),o=v("дно_киль");y(e,!1),y(o,!1);var r="flat"==this.floor_type?e:o;y(r,!0)},setSideBand:function(){var e=v("боковая_полоса");y(e,this.side_band)},setMainColor:function(e){var o=e.target,r=v("цилиндр"),t=o.value.match(/[A-Za-z0-9]{2}/g);t=t.map((function(e){return parseInt(e,16)})),r.material.albedoColor=new u["a"](t[0]/255,t[1]/255,t[2]/255),r.material.specularColor=new u["a"](t[0]/255,t[1]/255,t[2]/255)},setNoseColor:function(e){var o=e.target,r=v("нос"),t=o.value.match(/[A-Za-z0-9]{2}/g);t=t.map((function(e){return parseInt(e,16)})),r.material.albedoColor=new u["a"](t[0]/255,t[1]/255,t[2]/255),r.material.specularColor=new u["a"](t[0]/255,t[1]/255,t[2]/255)},setPolymerProtection:function(){var e=v("полимерная_защита");y(e,this.polymer_protect);var o=v("дно_плоское"),r=v("дно_киль"),n=this.polymer_protect?e.material:t.materials.find((function(e){return"ПВХ_Дно"===e.name})),a=t.materials.find((function(e){return"Черый ПВХ_полимер"===e.name}));this.polymer_protect?(a.albedoColor=e.material.albedoColor,a.specularColor=e.material.specularColor):(a.albedoColor=new u["a"](.007,.007,.007),a.specularColor=new u["a"](.007,.007,.007)),o.material=r.material=n},setConeColor:function(e){var o=e.target,r=v("концевики_баллонов"),t=o.value.match(/[A-Za-z0-9]{2}/g);t=t.map((function(e){return parseInt(e,16)})),r.material.albedoColor=new u["a"](t[0]/255,t[1]/255,t[2]/255),r.material.specularColor=new u["a"](t[0]/255,t[1]/255,t[2]/255)},setFloorColor:function(e){var o=e.target,r=o.value.match(/[A-Za-z0-9]{2}/g);r=r.map((function(e){return parseInt(e,16)}));var n=t.materials.find((function(e){return"ПВХ_Дно"===e.name}));n.albedoColor=new u["a"](r[0]/255,r[1]/255,r[2]/255),n.specularColor=new u["a"](r[0]/255,r[1]/255,r[2]/255)}},data:function(){return{floor_type:this.initialFloorType,side_band:this.initialSideBand,polymer_protect:this.polymerProtection,main_color:"#FFFFFF",nose_color:"#141414",rope_color:"",cone_color:"#141414",floor_color:"#141414"}}},b=h,g=(r("e13e"),r("2877")),w=Object(g["a"])(b,i,c,!1,null,"1891a254",null),C=w.exports,P={name:"App",components:{ModelViewer:C}},x=P,k=Object(g["a"])(x,a,l,!1,null,null,null),F=k.exports;n["a"].config.productionTip=!1;var O=new n["a"];console.log(O),new n["a"]({render:function(e){return e(F)}}).$mount("#app")},e13e:function(e,o,r){"use strict";var t=r("12c3"),n=r.n(t);n.a}});
//# sourceMappingURL=app.d5b14749.js.map
/*! For license information please see 370.eb6dfa9c.chunk.js.LICENSE.txt */
(self.webpackChunkE_Jurnal=self.webpackChunkE_Jurnal||[]).push([[370],{8057:function(e,t,r){"use strict";var a=r(1044),n=r(8329),s=a.ZP.create({baseURL:"https://api.jurnal.pplgsmkn1ciomas.my.id/api/",headers:{Accept:"application/json","Content-Type":"application/json"}});s.interceptors.response.use((function(e){return e}),(function(e){if(401===e.response.status)n.Z.remove("token"),n.Z.remove("user"),n.Z.remove("permissions"),window.location="/";else{if(403!==e.response.status)return Promise.reject(e);window.location="/app/blank"}})),t.Z=s},5524:function(e,t,r){"use strict";var a=r(9439),n=r(2791),s=r(184);t.Z=function(e){var t=e.labelTitle,r=e.labelStyle,l=e.type,i=e.containerStyle,o=e.defaultValue,c=e.placeholder,d=e.updateFormValue,u=e.updateType,m=(0,n.useState)(o),p=(0,a.Z)(m,2),x=p[0],f=p[1];return(0,s.jsxs)("div",{className:"form-control w-full ".concat(i),children:[(0,s.jsx)("label",{className:"label",children:(0,s.jsx)("span",{className:"label-text text-base-content "+r,children:t})}),(0,s.jsx)("input",{type:l||"text",value:x,placeholder:c||"",onChange:function(e){return t=e.target.value,f(t),void d({updateType:u,value:t});var t},className:"input  input-bordered w-full "})]})}},9697:function(e,t,r){"use strict";var a=r(184);t.Z=function(e){var t=e.styleClass,r=e.children;return(0,a.jsx)("p",{className:"text-center  text-error ".concat(t),children:r})}},4856:function(e,t,r){"use strict";var a=r(4165),n=r(5861),s=r(9439),l=r(2791),i=r(7689),o=r(1087),c=r(8329),d=r(5218),u=r(8057),m=r(184);t.Z=function(){var e=(0,l.useState)(""),t=(0,s.Z)(e,2),r=t[0],p=t[1],x=(0,l.useState)(""),f=(0,s.Z)(x,2),h=f[0],g=f[1],b=(0,l.useState)(!1),v=(0,s.Z)(b,2),y=v[0],j=v[1],w=(0,i.s0)(),k=function(){var e=(0,n.Z)((0,a.Z)().mark((function e(t){var n,s,l,i;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),j(!0),e.prev=2,e.next=5,u.Z.post("/login",{name:r,password:h});case 5:200===(n=e.sent).status?(c.Z.set("token",n.data.token),c.Z.set("user",JSON.stringify(n.data.user)),c.Z.set("permissions",JSON.stringify(n.data.permissions)),d.ZP.success("Login Successful!",{position:"top-right",autoClose:4e3}),w("/app/dashboard")):d.ZP.error("Unexpected response status: "+n.status,{position:"top-right",autoClose:4e3}),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(2),i=(null===(s=e.t0.response)||void 0===s||null===(l=s.data)||void 0===l?void 0:l.message)||"An error occurred",console.error("Error Response:",i),d.ZP.error(i,{position:"top-right",autoClose:4e3});case 14:return e.prev=14,j(!1),e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[2,9,14,17]])})));return function(t){return e.apply(this,arguments)}}();return c.Z.get("token")?(w("/app/dashboard"),null):(0,m.jsx)("div",{className:"dark:bg-gray-800",children:(0,m.jsxs)("div",{className:"flex justify-center h-screen",children:[(0,m.jsx)("div",{className:"hidden bg-cover lg:block lg:w-2/3",style:{backgroundImage:"linear-gradient(to right bottom, #3e7cda, #00a6dd, #4bc5ca, #a7ddc3, #eaf2d9)"},children:(0,m.jsx)("div",{className:"flex items-center h-full px-20 bg-gray-900 bg-opacity-40",children:(0,m.jsxs)("div",{children:[(0,m.jsxs)("h2",{className:"text-4xl font-bold text-white dark:text-white  ",children:["E-",(0,m.jsx)("span",{className:"",children:"Jurnal"})]}),(0,m.jsx)("p",{className:"max-w-xl mt-3 text-gray-300",children:"E-Jurnal PKL (Praktik Kerja Lapangan) di SMKN 1 Ciomas adalah sistem digital yang digunakan oleh siswa yang sedang melaksanakan PKL untuk mencatat dan melaporkan kegiatan harian mereka selama periode PKL. Sistem ini menggantikan jurnal manual yang biasanya digunakan oleh siswa."})]})})}),(0,m.jsx)("div",{className:"flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6",children:(0,m.jsxs)("div",{className:"flex-1",children:[(0,m.jsxs)("div",{className:"text-center",children:[(0,m.jsx)("h2",{className:"text-4xl font-bold text-center text-dark dark:text-white ",children:"E-Jurnal"}),(0,m.jsx)("p",{className:"mt-3 text-gray-500 dark:text-gray-300",children:"Sign in to access your account"})]}),(0,m.jsx)("div",{className:"mt-8",children:(0,m.jsxs)("form",{onSubmit:k,children:[(0,m.jsxs)("div",{children:[(0,m.jsx)("label",{htmlFor:"username",className:"block mb-2 text-sm text-gray-600 dark:text-gray-200",children:"Username"}),(0,m.jsx)("input",{type:"text",name:"username",id:"username",placeholder:"Your Username",value:r,onChange:function(e){return p(e.target.value)},className:"block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"})]}),(0,m.jsxs)("div",{className:"mt-6",children:[(0,m.jsx)("div",{className:"flex justify-between mb-2",children:(0,m.jsx)("label",{htmlFor:"password",className:"text-sm text-gray-600 dark:text-gray-200",children:"Password"})}),(0,m.jsx)("input",{type:"password",name:"password",id:"password",value:h,onChange:function(e){return g(e.target.value)},placeholder:"Your Password",className:"block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"})]}),(0,m.jsxs)("div",{className:"mt-6",children:[(0,m.jsx)("button",{type:"submit",className:"w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50",disabled:y,children:"Sign in"}),(0,m.jsx)(o.rU,{to:"/forgot-password",className:"text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline mt-3",children:"Forgot Password"})]})]})})]})})]})})}},5370:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return x}});var a=r(2791),n=r(4942),s=r(1413),l=r(9439),i=r(1087),o=r(184);var c=r(9697),d=r(5524),u=r(9794),m=r.n(u);var p=function(){var e=(0,a.useState)(!1),t=(0,l.Z)(e,2),r=t[0],u=t[1],p=(0,a.useState)(""),x=(0,l.Z)(p,2),f=x[0],h=x[1],g=(0,a.useState)(!1),b=(0,l.Z)(g,2),v=b[0],y=b[1],j=(0,a.useState)({emailId:""}),w=(0,l.Z)(j,2),k=w[0],N=w[1];return(0,o.jsx)("div",{className:"min-h-screen bg-base-200 flex items-center",children:(0,o.jsx)("div",{className:"card mx-auto w-[800px] max-w-5xl  shadow-xl",children:(0,o.jsx)("div",{className:"grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl",children:(0,o.jsxs)("div",{className:"py-24 px-10 ",children:[(0,o.jsx)("h2",{className:"text-2xl font-semibold mb-2 text-center",children:"Forgot Password"}),v&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:"text-center mt-8",children:(0,o.jsx)(m(),{className:"inline-block w-32 text-success"})}),(0,o.jsx)("p",{className:"my-4 text-xl font-bold text-center",children:"Link Sent"}),(0,o.jsx)("p",{className:"mt-4 mb-8 font-semibold text-center",children:"Check your email to reset password"}),(0,o.jsx)("div",{className:"text-center mt-4",children:(0,o.jsx)(i.rU,{to:"/",children:(0,o.jsx)("button",{className:"btn btn-block btn-primary ",children:"Login"})})})]}),!v&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{className:"my-8 font-semibold text-center",children:"We will send password reset link on your email Id"}),(0,o.jsxs)("form",{onSubmit:function(e){return function(e){if(e.preventDefault(),h(""),""===k.emailId.trim())return h("Email Id is required! (use any value)");u(!0),u(!1),y(!0)}(e)},children:[(0,o.jsx)("div",{className:"mb-4",children:(0,o.jsx)(d.Z,{type:"emailId",defaultValue:k.emailId,updateType:"emailId",containerStyle:"mt-4",labelTitle:"Email Id",updateFormValue:function(e){var t=e.updateType,r=e.value;h(""),N((0,s.Z)((0,s.Z)({},k),{},(0,n.Z)({},t,r)))}})}),(0,o.jsx)(c.Z,{styleClass:"mt-12",children:f}),(0,o.jsx)("button",{type:"submit",className:"btn mt-2 w-full btn-primary"+(r?" loading":""),children:"Send Reset Link"})]})]})]})})})})};r(4856);var x=function(){return(0,o.jsx)("div",{className:"",children:(0,o.jsx)(p,{})})}},9794:function(e,t,r){var a=r(215).default,n=["title","titleId"],s=r(2791);var l=s.forwardRef((function(e,t){var r=e.title,l=e.titleId,i=a(e,n);return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",ref:t,"aria-labelledby":l},i),r?s.createElement("title",{id:l},r):null,s.createElement("path",{fillRule:"evenodd",d:"M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z",clipRule:"evenodd"}))}));e.exports=l},215:function(e,t,r){var a=r(7071);e.exports=function(e,t){if(null==e)return{};var r,n,s=a(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s},e.exports.__esModule=!0,e.exports.default=e.exports},7071:function(e){e.exports=function(e,t){if(null==e)return{};var r,a,n={},s=Object.keys(e);for(a=0;a<s.length;a++)r=s[a],t.indexOf(r)>=0||(n[r]=e[r]);return n},e.exports.__esModule=!0,e.exports.default=e.exports},8329:function(e,t,r){"use strict";function a(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)e[a]=r[a]}return e}r.d(t,{Z:function(){return n}});var n=function e(t,r){function n(e,n,s){if("undefined"!==typeof document){"number"===typeof(s=a({},r,s)).expires&&(s.expires=new Date(Date.now()+864e5*s.expires)),s.expires&&(s.expires=s.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var l="";for(var i in s)s[i]&&(l+="; "+i,!0!==s[i]&&(l+="="+s[i].split(";")[0]));return document.cookie=e+"="+t.write(n,e)+l}}return Object.create({set:n,get:function(e){if("undefined"!==typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],a={},n=0;n<r.length;n++){var s=r[n].split("="),l=s.slice(1).join("=");try{var i=decodeURIComponent(s[0]);if(a[i]=t.read(l,i),e===i)break}catch(o){}}return e?a[e]:a}},remove:function(e,t){n(e,"",a({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,a({},this.attributes,t))},withConverter:function(t){return e(a({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}}]);
//# sourceMappingURL=370.eb6dfa9c.chunk.js.map
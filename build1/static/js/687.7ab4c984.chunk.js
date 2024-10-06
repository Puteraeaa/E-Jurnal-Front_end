"use strict";(self.webpackChunke_jurnal=self.webpackChunke_jurnal||[]).push([[687],{6709:(e,s,t)=>{t.d(s,{A:()=>i});var a=t(201),l=t(896);const r=a.A.create({baseURL:"https://api.jurnal.pplgsmkn1ciomas.my.id/api",headers:{Accept:"application/json","Content-Type":"application/json"}});let n=0;r.interceptors.request.use((e=>(n++,console.log(`Total API requests: ${n}`),e))),r.interceptors.response.use((function(e){return e}),(function(e){if(401===e.response.status)l.A.remove("token"),l.A.remove("user"),l.A.remove("permissions"),window.location="/";else{if(403!==e.response.status)return Promise.reject(e);window.location="/app/blank"}}));const i=r},9121:(e,s,t)=>{t.d(s,{A:()=>r});var a=t(7565),l=t(7929);const r=function(e){let{labelTitle:s,labelStyle:t,type:r,containerStyle:n,defaultValue:i,placeholder:o,updateFormValue:d,updateType:c}=e;const[u,m]=(0,a.useState)(i);return(0,l.jsxs)("div",{className:`form-control w-full ${n}`,children:[(0,l.jsx)("label",{className:"label",children:(0,l.jsx)("span",{className:"label-text text-base-content "+t,children:s})}),(0,l.jsx)("input",{type:r||"text",value:u,placeholder:o||"",onChange:e=>{return s=e.target.value,m(s),void d({updateType:c,value:s});var s},className:"input  input-bordered w-full "})]})}},9622:(e,s,t)=>{t.d(s,{A:()=>l});var a=t(7929);const l=function(e){let{styleClass:s,children:t}=e;return(0,a.jsx)("p",{className:`text-center  text-error ${s}`,children:t})}},6438:(e,s,t)=>{t.d(s,{A:()=>u});var a=t(7565),l=t(1030),r=t(896),n=t(1918),i=t(6709);const o=t.p+"static/media/smk.dd9ac09f254833d1ee62.png",d=t.p+"static/media/back.22d77e630d7f9841cef5.jpg";var c=t(7929);const u=function(){const[e,s]=(0,a.useState)(""),[t,u]=(0,a.useState)(""),[m,p]=(0,a.useState)(!1),x=(0,l.Zp)();return(0,a.useEffect)((()=>{r.A.get("token")&&x("/app/dashboard")}),[x]),r.A.get("token")?(x("/app/dashboard"),null):(0,c.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-cover bg-center p-4",style:{backgroundImage:`url(${d})`},children:(0,c.jsx)("div",{className:"bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden w-full max-w-md",children:(0,c.jsxs)("div",{className:"p-6 space-y-6",children:[(0,c.jsxs)("div",{className:"text-center",children:[(0,c.jsx)("img",{src:o,alt:"SMKN 1 Ciomas Logo",className:"w-24 mx-auto"}),(0,c.jsx)("h2",{className:"text-2xl font-bold text-gray-700 mt-4",children:"E-Jurnal SMKN 1 Ciomas"}),(0,c.jsx)("p",{className:"text-sm text-gray-600 mt-2",children:"Sistem Digital untuk Praktik Kerja Lapangan"})]}),(0,c.jsxs)("form",{onSubmit:async s=>{if(s.preventDefault(),navigator.onLine){p(!0);try{const s=await i.A.post("/login",{name:e,password:t});200===s.status?(r.A.set("token",s.data.token),r.A.set("user",JSON.stringify(s.data.user)),r.A.set("permissions",JSON.stringify(s.data.permissions)),n.Ay.success("Login Berhasil!",{position:"top-right",autoClose:4e3}),x("/app/dashboard")):n.Ay.error("Status respons tidak terduga: "+s.status,{position:"top-right",autoClose:4e3})}catch(o){var a,l;const e=(null===(a=o.response)||void 0===a||null===(l=a.data)||void 0===l?void 0:l.message)||"Terjadi kesalahan";console.error("Error Response:",e),n.Ay.error(e,{position:"top-right",autoClose:4e3})}finally{p(!1)}}else n.Ay.error("Tidak ada koneksi internet. Periksa jaringan Anda dan coba lagi.",{position:"top-right",autoClose:4e3})},children:[(0,c.jsxs)("div",{className:"space-y-4",children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{htmlFor:"username",className:"text-sm font-medium text-gray-700",children:"Username"}),(0,c.jsx)("input",{type:"text",id:"username",value:e,onChange:e=>s(e.target.value),placeholder:"Masukkan username",className:"w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500"})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{htmlFor:"password",className:"text-sm font-medium text-gray-700",children:"Password"}),(0,c.jsx)("input",{type:"password",id:"password",value:t,onChange:e=>u(e.target.value),placeholder:"Masukkan password",className:"w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500"})]})]}),(0,c.jsx)("button",{type:"submit",className:"w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300",disabled:m,children:"Login"})]})]})})})}},5559:(e,s,t)=>{t.r(s),t.d(s,{default:()=>u});var a=t(7565),l=t(477),r=t(7929);var n=t(9622),i=t(9121);function o(e,s){let{title:t,titleId:l,...r}=e;return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":l},r),t?a.createElement("title",{id:l},t):null,a.createElement("path",{fillRule:"evenodd",d:"M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",clipRule:"evenodd"}))}const d=a.forwardRef(o);const c=function(){const[e,s]=(0,a.useState)(!1),[t,o]=(0,a.useState)(""),[c,u]=(0,a.useState)(!1),[m,p]=(0,a.useState)({emailId:""});return(0,r.jsx)("div",{className:"min-h-screen bg-base-200 flex items-center",children:(0,r.jsx)("div",{className:"card mx-auto w-[800px] max-w-5xl  shadow-xl",children:(0,r.jsx)("div",{className:"grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl",children:(0,r.jsxs)("div",{className:"py-24 px-10 ",children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold mb-2 text-center",children:"Forgot Password"}),c&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"text-center mt-8",children:(0,r.jsx)(d,{className:"inline-block w-32 text-success"})}),(0,r.jsx)("p",{className:"my-4 text-xl font-bold text-center",children:"Link Sent"}),(0,r.jsx)("p",{className:"mt-4 mb-8 font-semibold text-center",children:"Check your email to reset password"}),(0,r.jsx)("div",{className:"text-center mt-4",children:(0,r.jsx)(l.N_,{to:"/",children:(0,r.jsx)("button",{className:"btn btn-block btn-primary ",children:"Login"})})})]}),!c&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("p",{className:"my-8 font-semibold text-center",children:"We will send password reset link on your email Id"}),(0,r.jsxs)("form",{onSubmit:e=>(e=>{if(e.preventDefault(),o(""),""===m.emailId.trim())return o("Email Id is required! (use any value)");s(!0),s(!1),u(!0)})(e),children:[(0,r.jsx)("div",{className:"mb-4",children:(0,r.jsx)(i.A,{type:"emailId",defaultValue:m.emailId,updateType:"emailId",containerStyle:"mt-4",labelTitle:"Email Id",updateFormValue:e=>{let{updateType:s,value:t}=e;o(""),p({...m,[s]:t})}})}),(0,r.jsx)(n.A,{styleClass:"mt-12",children:t}),(0,r.jsx)("button",{type:"submit",className:"btn mt-2 w-full btn-primary"+(e?" loading":""),children:"Send Reset Link"})]})]})]})})})})};t(6438);const u=function(){return(0,r.jsx)("div",{className:"",children:(0,r.jsx)(c,{})})}}}]);
//# sourceMappingURL=687.7ab4c984.chunk.js.map
"use strict";(self.webpackChunke_jurnal=self.webpackChunke_jurnal||[]).push([[186],{4179:(e,t,a)=>{a.d(t,{A:()=>l});var s=a(7929);const n=function(e){let{styleClass:t,children:a}=e;return(0,s.jsx)("div",{className:`text-xl font-semibold ${t}`,children:a})};const l=function(e){let{title:t,children:a,topMargin:l,TopSideButtons:r}=e;return(0,s.jsxs)("div",{className:"card w-full p-6 bg-base-100 shadow-xl "+(l||"mt-6"),children:[(0,s.jsxs)(n,{styleClass:r?"inline-block":"",children:[t,r&&(0,s.jsx)("div",{className:"inline-block float-right",children:r})]}),(0,s.jsx)("div",{className:"divider mt-2"}),(0,s.jsx)("div",{className:"h-full w-full pb-6 bg-base-100",children:a})]})}},4017:(e,t,a)=>{a.r(t),a.d(t,{default:()=>N});var s=a(7565),n=a(3292),l=a(4963),r=a(477),o=a(4179),i=a(645),d=a(4424),c=a(19),m=a(2400),u=a(7929);const h=e=>{let{lead:t,show:a,onClose:s}=e;const l=(0,n.wA)(),r=()=>{l((0,i.Oo)()),s()};return(0,u.jsx)("div",{className:"modal modal-open overflow-y-auto",children:(0,u.jsxs)("div",{className:"modal-box w-11/12 max-w-5xl h-auto p-6 relative bg-white shadow-lg rounded-lg",children:[(0,u.jsx)("div",{className:"absolute top-4 right-4 z-50",children:(0,u.jsx)("button",{className:"text-gray-500 hover:text-gray-700",onClick:r,children:(0,u.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,u.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})}),(0,u.jsxs)("div",{className:"bg-white p-4 mb-4 shadow rounded",children:[(0,u.jsx)("h3",{className:"text-lg font-semibold mb-6",children:"Info Dasar"}),(0,u.jsx)("table",{className:"w-full",children:(0,u.jsxs)("tbody",{className:"text-sm font-medium text-gray-700",children:[(0,u.jsxs)("tr",{className:"border-b",children:[(0,u.jsx)("td",{className:"py-2 px-4 font-medium",children:"Nama"}),(0,u.jsx)("td",{className:"py-2 px-4",children:t.name})]}),(0,u.jsxs)("tr",{className:"border-b",children:[(0,u.jsx)("td",{className:"py-2 px-4 font-medium",children:"Nomor Telepon"}),(0,u.jsx)("td",{className:"py-2 px-4",children:t.no_hp})]}),(0,u.jsxs)("tr",{className:"border-b",children:[(0,u.jsx)("td",{className:"py-2 px-4 font-medium",children:"Jurusan"}),(0,u.jsx)("td",{className:"py-2 px-4",children:t.departemen_id})]})]})})]}),(0,u.jsx)("div",{className:"modal-action flex justify-center mt-6",children:(0,u.jsx)("button",{className:"btn btn-sm sm:btn-md border-black w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white",onClick:r,children:"Close"})})]})})};var x=a(6709),p=a(896),b=a(7850),f=(a(6804),a(1774)),w=a.n(f);const j=a.p+"static/media/Template import-guru.c95e135bfc677bff5d18.xlsx",g=()=>{(0,n.wA)();const[e,t]=(0,s.useState)(""),[a,l]=(0,s.useState)(1),[i,f]=(0,s.useState)({currentPage:1,perPage:5,total:0}),[g,N]=(0,s.useState)(null),[y,v]=(0,s.useState)(!1),[k,C]=(0,s.useState)([]),[L,A]=(0,s.useState)(!1),[E,_]=(0,s.useState)(null),B=p.A.get("token");(0,s.useEffect)((()=>{S()}),[B,a]);const S=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a;A(!0);try{const t=await x.A.get(`admin/teacher?page=${e}`,{headers:{Authorization:`Bearer ${B}`}});C(t.data.data.data||[]),console.log(t.data.data.data),f({currentPage:t.data.data.current_page,perPage:t.data.data.per_page,total:t.data.data.total})}catch(t){console.error("Error fetching data:",t)}finally{A(!1)}},P=Math.ceil(i.total/i.perPage),M=k.filter((t=>t.name.toLowerCase().includes(e.toLowerCase())||t.no_hp.toLowerCase().includes(e.toLowerCase())||t.departements&&t.departements.name.toLowerCase().includes(e.toLowerCase())));M.slice((a-1)*i.perPage,a*i.perPage);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(b.N9,{}),(0,u.jsxs)(o.A,{title:"Data Guru",topMargin:"mt-2",TopSideButtons:(0,u.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5",children:[(0,u.jsx)("input",{type:"text",className:"input input-bordered input-sm mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto",placeholder:"Search",value:e,onChange:e=>t(e.target.value)}),(0,u.jsx)(r.N_,{to:"/app/data/guru/tambah",children:(0,u.jsx)("button",{className:"btn btn-sm normal-case btn-primary w-full sm:w-auto",children:"Add New"})}),(0,u.jsx)("button",{className:"btn btn-sm normal-case btn-primary w-full sm:w-auto",onClick:()=>document.getElementById("my_modal_5").showModal(),children:"Import Excel"})]}),children:[(0,u.jsx)("div",{className:"overflow-x-auto w-full",children:(0,u.jsxs)("table",{className:"table w-full text-center",children:[(0,u.jsx)("thead",{children:(0,u.jsxs)("tr",{children:[(0,u.jsx)("th",{children:"Nama Guru"}),(0,u.jsx)("th",{children:"Nomer Guru"}),(0,u.jsx)("th",{className:"w-1/4 text-center",children:"Pelajaran"}),(0,u.jsx)("th",{})]})}),(0,u.jsx)("tbody",{className:"text-center",children:L?(0,u.jsx)("tr",{children:(0,u.jsx)("td",{colSpan:"4",className:"text-center",children:"Loading..."})}):M.map((e=>(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{className:"whitespace-normal break-words",children:e.name}),(0,u.jsx)("td",{className:"whitespace-normal break-words",children:e.no_hp}),(0,u.jsx)("td",{className:"whitespace-normal break-words max-w-xs",children:e.departements?e.departements.name:""}),(0,u.jsxs)("td",{className:"flex justify-center space-x-2 sm:space-x-4",children:[(0,u.jsx)("button",{className:"btn btn-sm btn-square btn-warning",onClick:()=>{N(e),v(!0)},children:(0,u.jsx)(m.A,{className:"h-4 w-4"})}),(0,u.jsx)(r.N_,{to:`/app/data/guru/edit/${e.user_id}`,children:(0,u.jsx)("button",{className:"btn btn-sm btn-square btn-primary",children:(0,u.jsx)(c.A,{className:"h-4 w-4"})})}),(0,u.jsx)("button",{className:"btn btn-sm btn-square btn-error",onClick:()=>(async e=>{try{const{isConfirmed:t}=await w().fire({title:"Yakin?",text:"Apakah Anda yakin ingin menghapus data ini?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Hapus!"});if(t){const t=await x.A.delete(`admin/users/${e}`,{headers:{Authorization:`Bearer ${B}`}});b.oR.success(t.data.message,{position:"top-right",duration:4e3}),S(a)}}catch(t){console.error("Error deleting lead:",t),b.oR.error("Failed to delete lead.",{position:"top-right",duration:4e3})}})(e.user_id),children:(0,u.jsx)(d.A,{className:"h-4 w-4"})})]})]},e.id)))})]})}),(0,u.jsx)("div",{className:"flex justify-center mt-4 gap-2",children:(()=>{const e=[];for(let t=1;t<=P;t++)e.push((0,u.jsx)("button",{className:"btn btn-sm "+(t===a?"btn-active":""),onClick:()=>{l(t)},children:t},t));return e})()})]}),y&&(0,u.jsx)(h,{lead:g,onClose:()=>v(!1)}),(0,u.jsx)("dialog",{id:"my_modal_5",className:"modal",children:(0,u.jsxs)("form",{method:"dialog",className:"modal-box",children:[(0,u.jsx)("h3",{className:"font-bold text-lg",children:"Upload Excel File"}),(0,u.jsx)("p",{className:"py-4",children:"Pilih file Excel yang ingin diunggah:"}),(0,u.jsx)("input",{type:"file",accept:".xlsx",onChange:e=>{_(e.target.files[0])},className:"file-input file-input-bordered file-input-primary w-full max-w-xs"}),(0,u.jsxs)("div",{className:"modal-action",children:[(0,u.jsx)("button",{className:"btn",children:"Close"}),(0,u.jsx)("button",{className:"btn btn-primary",type:"button",onClick:async()=>{if(!E)return void b.oR.error("No file selected.",{position:"top-right",duration:4e3});const e=new FormData;e.append("file",E),A(!0);try{await x.A.post("/admin/import",e,{headers:{Authorization:`Bearer ${B}`,"Content-Type":"multipart/form-data"}}),b.oR.success("File uploaded successfully!",{position:"top-right",duration:4e3}),S()}catch(t){console.error("Error uploading file:",t),b.oR.error("Failed to upload file.",{position:"top-right",duration:4e3})}finally{A(!1),_(null)}},children:"Upload"})]}),(0,u.jsx)("button",{className:"btn btn-link mt-4",type:"button",onClick:()=>{const e=document.createElement("a");e.href=j,e.setAttribute("download","Template import-guru.xlsx"),document.body.appendChild(e),e.click(),document.body.removeChild(e)},children:"Download Template"})]})})]})};const N=function(){const e=(0,n.wA)();return(0,s.useEffect)((()=>{e((0,l.wE)({title:"Data Guru"}))}),[]),(0,u.jsx)(g,{})}},6804:()=>{},2400:(e,t,a)=>{a.d(t,{A:()=>l});var s=a(7565);function n(e,t){let{title:a,titleId:n,...l}=e;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":n},l),a?s.createElement("title",{id:n},a):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"}),s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"}))}const l=s.forwardRef(n)},19:(e,t,a)=>{a.d(t,{A:()=>l});var s=a(7565);function n(e,t){let{title:a,titleId:n,...l}=e;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":n},l),a?s.createElement("title",{id:n},a):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"}))}const l=s.forwardRef(n)},4424:(e,t,a)=>{a.d(t,{A:()=>l});var s=a(7565);function n(e,t){let{title:a,titleId:n,...l}=e;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":n},l),a?s.createElement("title",{id:n},a):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"}))}const l=s.forwardRef(n)}}]);
//# sourceMappingURL=186.f977f1f1.chunk.js.map
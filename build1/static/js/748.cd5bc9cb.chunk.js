"use strict";(self.webpackChunke_jurnal=self.webpackChunke_jurnal||[]).push([[748],{5395:(e,a,t)=>{t(3443),t(7929)},9748:(e,a,t)=>{t.r(a),t.d(a,{default:()=>x});var n=t(7565),s=t(3292),r=t(4963),d=t(6709),l=t(896),o=t(1918),c=(t(8758),t(5395),t(1774)),i=t.n(c),m=t(7929);function u(){const[e,a]=(0,n.useState)([]),[t,s]=(0,n.useState)({currentPage:0,perPage:0,total:0}),[r,c]=(0,n.useState)(""),[u,x]=(0,n.useState)(null),[h,g]=(0,n.useState)(""),b=l.A.get("token"),p=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;e||t.currentPage;await d.A.get("admin/departemen",{headers:{Authorization:`Bearer ${b}`}}).then((e=>{a(e.data.data.data),s((()=>({currentPage:e.data.data.current_page,perPage:e.data.data.per_page,total:e.data.data.total})))}))};(0,n.useEffect)((()=>{p()}),[]);return(0,m.jsxs)("div",{className:"container mx-auto my-5",children:[(0,m.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,m.jsx)("div",{className:"md:col-span-2",children:(0,m.jsxs)("div",{className:"bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6",children:[(0,m.jsxs)("p",{className:"border-b pb-2 font-bold text-xl",children:[(0,m.jsx)("i",{className:"fas fa-graduation-cap"})," DATA KEJURUAN"]}),(0,m.jsxs)("p",{className:"text-gray-600 font-semibold mt-2",children:["Jumlah kejuruan yang terdftar di SMK Negeri 1 Ciomas sekarang adalah ",(0,m.jsx)("span",{className:"font-bold",children:t.total})," ","kejuruan."]})]})}),(0,m.jsx)("div",{children:(0,m.jsxs)("button",{onClick:()=>document.getElementById("my_modal_add").showModal(),className:"bg-blue-600 dark:bg-gray-700 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md w-[240px] flex justify-center text-sm md:text-[17px] items-center mb-0 md:w-[400px] md:mb-4",children:[(0,m.jsx)("i",{className:"fa fa-plus-circle mr-2 "})," Tambah Data Jurusan"]})}),(0,m.jsx)("div",{})]}),(0,m.jsx)("div",{className:"mt-1",children:(0,m.jsx)("div",{className:"bg-white dark:bg-[#1c2229] shadow-md rounded-lg overflow-hidden",children:(0,m.jsx)("div",{className:"p-4",children:(0,m.jsx)("div",{className:"overflow-x-auto",children:(0,m.jsxs)("table",{className:"table-auto w-[140%] md:w-full",children:[(0,m.jsx)("thead",{children:(0,m.jsxs)("tr",{className:"bg-[#3b82f5] dark:bg-gray-700 text-black dark:text-white text-sm uppercase font-semibold rounded-lg",children:[(0,m.jsx)("th",{className:"p-2 text-center col-3 ",children:"No."}),(0,m.jsx)("th",{className:"p-2 text-center spacing-1 col-6",children:"Program Name"}),(0,m.jsx)("th",{className:"p-2 text-center col-6",children:"Actions"})]})}),(0,m.jsx)("tbody",{children:e.length>0?e.map(((e,a)=>(0,m.jsxs)("tr",{className:"text-gray-700 dark:text-white",children:[(0,m.jsx)("td",{className:"p-2 text-center font-bold border-b text-xs md:text-sm",children:++a+(t.currentPage-1)*t.perPage}),(0,m.jsx)("td",{className:"p-2 text-center font-bold border-b text-xs md:text-sm",children:e.name}),(0,m.jsxs)("td",{className:"p-2 text-center border-b text-xs md:text-sm ",children:[(0,m.jsx)("button",{className:"bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg text-xs mr-2 md:p-3",onClick:a=>((e,a)=>{a.preventDefault(),x(e),document.getElementById("my_modal_3").showModal()})(e,a),children:(0,m.jsx)("i",{className:"fa fa-pencil-alt"})}),(0,m.jsx)("button",{onClick:a=>(async(e,a)=>{a.preventDefault();try{const{isConfirmed:a}=await i().fire({title:"Yakin?",text:`Apakah Anda yakin ingin menghapus ${e.name}?`,icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Hapus!"});if(a){const a=await d.A.delete(`admin/dapartemen/${e.id}`,{headers:{Authorization:`Bearer ${b}`}});o.oR.success(a.data.message,{position:"top-right",duration:4e3}),p()}}catch(t){}})(e,a),className:"bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-xs md:p-3",children:(0,m.jsx)("i",{className:"fa fa-trash-alt"})})]})]},a))):(0,m.jsx)("tr",{className:"text-gray-700",children:(0,m.jsx)("td",{className:"p-2 text-center font-bold border-b text-xs md:text-sm",colSpan:"3",children:"No data available."})})})]})})})})}),(0,m.jsx)("dialog",{id:"my_modal_3",style:{zIndex:-1},className:"modal",children:(0,m.jsxs)("div",{className:"modal-box",children:[(0,m.jsx)("button",{className:"btn btn-sm btn-circle btn-ghost absolute right-2 top-2",onClick:e=>{e.preventDefault(),document.getElementById("my_modal_3").close()},children:"\u2715"}),(0,m.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),document.getElementById("my_modal_3").close();try{(await i().fire({title:"Memperbarui Program",text:"Apakah Anda yakin ingin Memperbarui Program?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Ya, Perbarui!"})).isConfirmed&&(await d.A.put(`admin/departemen/${u.id}`,{name:u.name},{headers:{Authorization:`Bearer ${b}`}}),o.oR.success("Program updated successfully!",{position:"top-right",duration:4e3}),document.getElementById("my_modal_3").close(),p())}catch(a){}},children:[(0,m.jsx)("h3",{className:"font-bold text-lg text-center",children:"Edit Program"}),(0,m.jsx)("div",{className:"py-4",children:(0,m.jsx)("input",{type:"text",defaultValue:null===u||void 0===u?void 0:u.name,onChange:e=>x({...u,name:e.target.value}),className:"block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",placeholder:"Program Name"})}),(0,m.jsxs)("div",{className:"modal-action",children:[(0,m.jsx)("button",{className:"btn",type:"submit",children:"Save Changes"}),(0,m.jsx)("button",{type:"button",className:"btn btn-outline",onClick:e=>{document.getElementById("my_modal_3").close(),e.preventDefault()},children:"Cancel"})]})]})]})}),(0,m.jsx)("dialog",{id:"my_modal_add",style:{zIndex:-1},className:"modal",children:(0,m.jsx)("div",{className:"modal-box",children:(0,m.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),document.getElementById("my_modal_add").close();try{(await i().fire({title:"Tambah Program",text:"Apakah Anda yakin ingin Menambahkan Program?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Ya, Tambah!"})).isConfirmed&&(await d.A.post("admin/departemen",{name:h},{headers:{Authorization:`Bearer ${b}`}}),o.oR.success("Program added successfully!",{position:"top-right",duration:4e3}),document.getElementById("my_modal_add").close(),p(),g(""))}catch(a){console.log(a.response.data.message)}},children:[(0,m.jsx)("button",{className:"btn btn-sm btn-circle btn-ghost absolute right-2 top-2",type:"button",onClick:e=>{e.preventDefault(),document.getElementById("my_modal_add").close()},children:"\u2715"}),(0,m.jsx)("h3",{className:"font-bold text-lg text-center",children:"Tambah Jurusan"}),(0,m.jsx)("div",{className:"py-4",children:(0,m.jsx)("input",{type:"text",value:h,onChange:e=>g(e.target.value),className:"block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",required:!0,placeholder:"Masukan Nama Jurusan"})}),(0,m.jsxs)("div",{className:"modal-action",children:[(0,m.jsx)("button",{className:"btn",type:"submit",children:"Tambah"}),(0,m.jsx)("button",{type:"button",className:"btn btn-outline",onClick:e=>{e.preventDefault(),document.getElementById("my_modal_add").close()},children:"Batal"})]})]})})})]})}const x=function(){const e=(0,s.wA)();return(0,n.useEffect)((()=>{e((0,r.wE)({title:"Data Jurusan"}))}),[]),(0,m.jsx)(u,{})}}}]);
//# sourceMappingURL=748.cd5bc9cb.chunk.js.map
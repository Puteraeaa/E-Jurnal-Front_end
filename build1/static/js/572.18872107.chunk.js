"use strict";(self.webpackChunke_jurnal=self.webpackChunke_jurnal||[]).push([[572],{9572:(e,a,o)=>{o.r(a),o.d(a,{default:()=>i});var r=o(7565),s=o(1030),n=o(6709),l=o(896),t=o(1918),d=o(7929);const i=()=>{const e=(0,s.Zp)(),[a,o]=(0,r.useState)({roles:"orang tua",password:"",password_confirmation:"",name:"",gender:"",alamat:"",occupation:"",phoneNumber:""}),[i,u]=(0,r.useState)(!1),c=e=>{const{name:a,value:r,type:s,files:n}=e.target;o((e=>({...e,[a]:"file"===s?n[0]:r})))};return(0,d.jsx)("div",{className:"container mx-auto my-10 px-4",children:(0,d.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500",children:[(0,d.jsx)("h1",{className:"text-3xl font-bold text-center mb-4",children:"Tambah Data Orang Tua"}),(0,d.jsx)("p",{className:"text-center border-b pb-4 mb-4",children:"Silakan isi form di bawah untuk menambah data orang tua!"}),(0,d.jsxs)("form",{onSubmit:async o=>{if(o.preventDefault(),a.password===a.password_confirmation){u(!0);try{const o=l.A.get("token");if(!o)return void t.oR.error("Authentication token not found.",{position:"top-right",duration:4e3});await n.A.post("admin/users",a,{headers:{Authorization:`Bearer ${o}`}}),t.oR.success("Parent data added successfully!",{position:"top-right",duration:4e3}),e("/app/data/orangtua")}catch(r){if(r.response){const e=r.response.data.errors;if(console.error("Error response data:",r.response.data),e)for(const[a,o]of Object.entries(e))t.oR.error(`Error in ${a}: ${o.join(", ")}`,{position:"top-right",duration:4e3});else t.oR.error(`Failed to add parent data: ${r.response.data.message||"Please check the form fields."}`,{position:"top-right",duration:4e3})}else t.oR.error("Failed to add parent data.",{position:"top-right",duration:4e3})}finally{u(!1)}}else t.oR.error("Password and confirmation do not match.",{position:"top-right",duration:4e3})},children:[(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Nama Orang Tua"}),(0,d.jsx)("input",{type:"text",name:"name",value:a.name,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Password"}),(0,d.jsx)("input",{type:"password",name:"password",value:a.password,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Konfirmasi Password"}),(0,d.jsx)("input",{type:"password",name:"password_confirmation",value:a.password_confirmation,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Jenis Kelamin"}),(0,d.jsxs)("select",{name:"gender",value:a.gender,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",children:[(0,d.jsx)("option",{value:"",children:"Pilih Jenis Kelamin"}),(0,d.jsx)("option",{value:"Laki-laki",children:"Laki-laki"}),(0,d.jsx)("option",{value:"Perempuan",children:"Perempuan"})]})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Alamat"}),(0,d.jsx)("textarea",{name:"alamat",value:a.alamat,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",rows:"4"})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Pekerjaan"}),(0,d.jsx)("input",{type:"text",name:"occupation",value:a.occupation,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Nomor Telepon"}),(0,d.jsx)("input",{type:"text",name:"phoneNumber",value:a.phoneNumber,onChange:c,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"})]}),(0,d.jsxs)("div",{className:"flex justify-between gap-2",children:[(0,d.jsx)("button",{type:"submit",className:"bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",disabled:i,children:i?"Menyimpan...":"Simpan"}),(0,d.jsx)("button",{type:"button",className:"w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg",onClick:()=>e("/app/data/orangtua"),children:"Cancel"})]})]})]})})}}}]);
//# sourceMappingURL=572.18872107.chunk.js.map
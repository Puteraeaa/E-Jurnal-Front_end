"use strict";(self.webpackChunkE_Jurnal=self.webpackChunkE_Jurnal||[]).push([[610],{4610:function(a,e,n){n.r(e);var t=n(4942),l=n(1413),s=n(9439),i=n(2791),r=n(7689),m=n(184),u=[{id:"01",name:"Budi Santoso",email:"budisantoso@gmail.com",namaAnak:"Andi Santoso"},{id:"02",name:"Joko",email:"Joko.owi@gmail.com",namaAnak:"Rina Joko"}];e.default=function(){var a=(0,r.UO)().id,e=(0,r.s0)(),n=(0,i.useState)({name:"",email:"",namaAnak:""}),o=(0,s.Z)(n,2),c=o[0],d=o[1],b=u.find((function(e){return e.id===a}));(0,i.useEffect)((function(){b?d((0,l.Z)({},b)):e("/404")}),[b,a,e]);var x=function(a){var e=a.target,n=e.name,s=e.value;d((function(a){return(0,l.Z)((0,l.Z)({},a),{},(0,t.Z)({},n,s))}))};return(0,m.jsxs)("div",{className:"container mx-auto px-4 py-6",children:[(0,m.jsx)("h3",{className:"font-bold text-2xl sm:text-3xl text-center mb-10",children:"Edit Data Orang Tua"}),(0,m.jsxs)("form",{onSubmit:function(a){a.preventDefault(),e("/data/guru")},className:"max-w-lg mx-auto space-y-4",children:[(0,m.jsxs)("div",{className:"mb-4",children:[(0,m.jsx)("label",{className:"block mb-2 font-bold",children:"Nama Orang Tua:"}),(0,m.jsx)("input",{type:"text",name:"name",value:c.name,onChange:x,className:"input input-bordered w-full",required:!0})]}),(0,m.jsxs)("div",{className:"mb-4",children:[(0,m.jsx)("label",{className:"block mb-2 font-bold",children:"Email Orang Tua:"}),(0,m.jsx)("input",{type:"email",name:"email",value:c.email,onChange:x,className:"input input-bordered w-full",required:!0})]}),(0,m.jsxs)("div",{className:"mb-4",children:[(0,m.jsx)("label",{className:"block mb-2 font-bold",children:"Nama Anak:"}),(0,m.jsx)("textarea",{name:"alamat",value:c.namaAnak,onChange:x,className:"textarea textarea-bordered w-full",required:!0})]}),(0,m.jsxs)("div",{className:"flex justify-between gap-2",children:[(0,m.jsx)("button",{type:"submit",className:"btn btn-primary w-1/2",onClick:function(){return e("/app/data/orangtua")},children:"Save"}),(0,m.jsx)("button",{type:"button",className:"btn border-black w-1/2",onClick:function(){return e("/app/data/orangtua")},children:"Cancel"})]})]})]})}}}]);
//# sourceMappingURL=610.fa7ef3a1.chunk.js.map
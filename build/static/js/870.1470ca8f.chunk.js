"use strict";(self.webpackChunke_jurnal=self.webpackChunke_jurnal||[]).push([[870],{3870:(e,s,a)=>{a.r(s),a.d(s,{default:()=>x});var l=a(7565),d=a(1030),t=a(477),i=a(6709),r=a(896),c=(a(3422),a(8758)),n=a(5944),m=a.n(n),o=a(7929);const x=()=>{var e,s,a,n,x,h,u,j,v,b,g,p,N,w;const{id:f}=(0,d.g)(),[y,k]=(0,l.useState)({}),[_,H]=(0,l.useState)(!1),A=r.A.get("token");(0,l.useEffect)((()=>{(async()=>{await i.A.get(`admin/jurnal/${f}`,{headers:{Authorization:`Bearer ${A}`}}).then((e=>{k(e.data.data||{})}))})()}),[]);const L=m()(y.start_time,"HH:mm:ss").format("HH:mm"),C=m()(y.end_time,"HH:mm:ss").format("HH:mm"),B=()=>{H(!1)};return(0,o.jsxs)("section",{className:"py-4 px-4 sm:px-6 lg:px-8 ",children:[_&&(0,o.jsx)("div",{className:"fixed inset-0  bg-black bg-opacity-75 flex items-center justify-center z-50",onClick:B,children:(0,o.jsxs)("div",{className:"bg-white p-10 rounded-lg relative w-1/2",children:[(0,o.jsx)("button",{className:"absolute text-3xl top-2 right-2 text-gray-600 hover:text-gray-800",onClick:B,children:"\xd7"}),(0,o.jsx)("img",{src:y.image,alt:"Enlarged view",className:"w-full h-auto "})]})}),(0,o.jsx)("div",{className:"container mx-auto mb-4 bg-white p-4 rounded",children:(0,o.jsx)("div",{className:"text-center",children:(0,o.jsx)("div",{className:"text-black font-poppins",children:(0,o.jsx)("h1",{className:"text-2xl md:text-3xl font-bold mt-1",children:"Jurnal PKL"})})})}),(0,o.jsxs)("div",{className:"container mx-auto flex flex-col md:flex-row gap-4",children:[(0,o.jsx)("div",{className:"md:w-1/3",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg",children:(0,o.jsx)("div",{className:"card-body p-4",children:(0,o.jsxs)("div",{className:"flex items-center mb-4",children:[(0,o.jsx)("img",{src:null!==(e=y.users)&&void 0!==e&&null!==(s=e.students)&&void 0!==s&&s.image&&"https://api.jurnal.pplgsmkn1ciomas.my.id/storage"!==(null===(a=y.users.students)||void 0===a?void 0:a.image)?y.users.students.image:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",alt:y.name,className:"w-16 h-16 rounded-full border-2 border-gray-300 cursor-pointer"}),(0,o.jsxs)("div",{className:"ml-4",children:[(0,o.jsx)("h2",{className:"text-xl md:text-2xl font-semibold",children:y.users?null===(n=y.users.students)||void 0===n?void 0:n.name:""}),(0,o.jsxs)("p",{className:"text-gray-600 text-sm md:text-base",children:[null!==(x=null===(h=y.users)||void 0===h||null===(u=h.students)||void 0===u||null===(j=u.classes)||void 0===j?void 0:j.name)&&void 0!==x?x:"-"," |"," ",null!==(v=null===(b=y.users)||void 0===b||null===(g=b.students)||void 0===g||null===(p=g.industries)||void 0===p?void 0:p.name)&&void 0!==v?v:"-"]})]})]})})})}),(0,o.jsx)("div",{className:"md:w-1/3",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg",children:(0,o.jsx)("div",{className:"card-body p-4",children:(0,o.jsxs)("div",{className:"mb-4",children:[(0,o.jsx)("p",{className:"text-gray-600 text-sm md:text-base",children:"Waktu lama PKL"}),(0,o.jsxs)("h2",{className:"text-xl md:text-2xl font-semibold",children:[L," WIB s/d ",C," WIB"]})]})})})}),(0,o.jsx)("div",{className:"md:w-1/3",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg",children:(0,o.jsxs)("div",{className:"card-body p-4 flex flex-col md:flex-row",children:[(0,o.jsxs)("div",{className:"mb-4",children:[(0,o.jsx)("p",{className:"text-gray-600 text-sm md:text-base",children:"Laporan di upload"}),(0,o.jsx)("h2",{className:"text-xl md:text-2xl font-semibold",children:(null===(N=y.created_at)||void 0===N?void 0:N.slice(0,10))||"N/A"})]}),(0,o.jsxs)("div",{className:"mb-4 ml-0 md:ml-6",children:[(0,o.jsx)("p",{className:"text-gray-600 text-sm md:text-base",children:"Tools"}),(0,o.jsx)("h2",{className:"text-xl md:text-2xl font-semibold",children:y.tools||"N/A"})]})]})})}),(0,c.A)(["murid.index"])&&(0,o.jsx)("div",{className:"md:w-1/7",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg",children:(0,o.jsx)("div",{className:"card-body p-4 flex flex-col md:flex-row",children:(0,o.jsxs)("div",{className:"mb-0 md:mb-4",children:[(0,o.jsx)("p",{className:"text-gray-600 text-sm md:text-base",children:"Action"}),(0,o.jsx)(t.N_,{to:`/app/edit-laporan/${y.id}`,children:(0,o.jsx)("button",{className:"btn btn-sm btn-primary w-36",children:"Edit"})})]})})})})]}),y.image&&"https://api.jurnal.pplgsmkn1ciomas.my.id/storage"!==y.image&&(0,o.jsx)("div",{className:"container mx-auto mt-4",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg w-full md:w-1/3 mx-auto",children:(0,o.jsx)("div",{className:"card-body p-4",children:(0,o.jsx)("img",{src:y.image,alt:"",className:"w-[50%] h-auto object-cover rounded-lg mx-auto cursor-pointer",onClick:()=>{H(!0)}})})})}),(0,o.jsx)("div",{className:"container mx-auto mt-4",children:(0,o.jsx)("div",{className:"card border-0 shadow-lg bg-white rounded-lg",children:(0,o.jsxs)("div",{className:"card-body p-4",children:[(0,o.jsx)("h1",{className:"text-2xl md:text-3xl font-semibold mb-4",children:"Deskripsi Laporan"}),(0,o.jsx)("div",{className:" text-200 ",dangerouslySetInnerHTML:{__html:y.description}}),(0,o.jsx)("p",{}),(0,o.jsxs)("p",{className:"text-gray-600 text-xs md:text-sm mt-2",children:["Laporan di Upload ",(null===y||void 0===y||null===(w=y.created_at)||void 0===w?void 0:w.slice(0,10))||"N/A"]})]})})})]})}},3422:()=>{}}]);
//# sourceMappingURL=870.1470ca8f.chunk.js.map
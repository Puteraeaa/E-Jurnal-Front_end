(self.webpackChunkE_Jurnal=self.webpackChunkE_Jurnal||[]).push([[803],{2512:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(184);var a=function(e){var t=e.styleClass,n=e.children;return(0,r.jsx)("div",{className:"text-xl font-semibold ".concat(t),children:n})};var s=function(e){var t=e.title,n=e.children,s=e.topMargin,i=e.TopSideButtons;return(0,r.jsxs)("div",{className:"card w-full p-6 bg-base-100 shadow-xl "+(s||"mt-6"),children:[(0,r.jsxs)(a,{styleClass:i?"inline-block":"",children:[t,i&&(0,r.jsx)("div",{className:"inline-block float-right",children:i})]}),(0,r.jsx)("div",{className:"divider mt-2"}),(0,r.jsx)("div",{className:"h-full w-full pb-6 bg-base-100",children:n})]})}},7318:function(e,t,n){"use strict";var r=n(9439),a=n(2791),s=n(6293),i=n(6042),l=n(9961),o=n(7626),c=(n(3666),n(8559)),u=n.n(c),d=n(7549),h=(n(8117),n(184)),m=new(u().Icon)({iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41]}),f=function(e){var t=e.setLatLng,n=(0,a.useState)(null),l=(0,r.Z)(n,2),o=l[0],c=l[1];return(0,s.zV)({click:function(e){c(e.latlng),t(e.latlng)}}),null===o?null:(0,h.jsx)(i.J,{position:o,icon:m})},x=function(e){var t=e.provider,n=e.setLatLng,r=(0,s.Sx)();return(0,a.useEffect)((function(){var e=new d.C1({provider:t,style:"bar",autoClose:!0,retainZoomLevel:!1,searchLabel:"Enter address or place",keepResult:!0});return r.addControl(e),r.on("geosearch/showlocation",(function(e){var t=e.location,r=t.x,a=t.y;n({lat:a,lng:r})})),function(){return r.removeControl(e)}}),[r,t,n]),null};t.Z=function(e){var t=e.setLatLng,n=new d.Zm;return(0,h.jsxs)(l.h,{center:[-2.5,118],zoom:5,style:{height:"300px",width:"100%"},children:[(0,h.jsx)(o.I,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:"\xa9 OpenStreetMap contributors"}),(0,h.jsx)(x,{provider:n,setLatLng:t}),(0,h.jsx)(f,{setLatLng:t})]})}},5388:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Z}});var r=n(2791),a=n(9434),s=n(5054),i=n(4165),l=n(5861),o=n(9439),c=n(1087),u=n(2512),d=n(8057),h=n(5217),m=n.n(h),f=n(4120),x=n.n(f),p=n(8329),v=n(2564),g=(n(5462),n(1830)),j=n.n(g),b=(n(7318),n(184)),w=function(){var e=(0,a.v9)((function(e){return e.lead})),t=(e.leads,e.loading),n=e.error,s=((0,a.I0)(),(0,r.useState)("")),h=(0,o.Z)(s,2),f=h[0],g=h[1],w=(0,r.useState)(1),Z=(0,o.Z)(w,2),k=Z[0],L=Z[1],N=(0,r.useState)(null),S=(0,o.Z)(N,2),C=(S[0],S[1],(0,r.useState)(!1)),y=(0,o.Z)(C,2),E=(y[0],y[1],(0,r.useState)(!1)),I=(0,o.Z)(E,2),B=(I[0],I[1],(0,r.useState)([])),A=(0,o.Z)(B,2),M=A[0],z=A[1],P=(0,r.useState)({currentPage:1,perPage:10,total:0}),_=(0,o.Z)(P,2),J=(_[0],_[1]),O=(0,r.useState)(""),R=(0,o.Z)(O,2),T=(R[0],R[1],(0,r.useState)("")),U=(0,o.Z)(T,2),q=(U[0],U[1],(0,r.useState)("")),D=(0,o.Z)(q,2),F=(D[0],D[1],(0,r.useState)("")),H=(0,o.Z)(F,2),W=(H[0],H[1],(0,r.useState)("")),V=(0,o.Z)(W,2),Y=(V[0],V[1],(0,r.useState)("")),G=(0,o.Z)(Y,2),K=(G[0],G[1],(0,r.useState)("")),Q=(0,o.Z)(K,2),X=(Q[0],Q[1],(0,r.useState)("")),$=(0,o.Z)(X,2),ee=($[0],$[1],p.Z.get("token")),te=function(){var e=(0,l.Z)((0,i.Z)().mark((function e(){var t,n=arguments;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.length>0&&void 0!==n[0]?n[0]:1,e.prev=1,e.next=4,d.Z.get("admin/industri",{headers:{Authorization:"Bearer ".concat(ee)}});case 4:t=e.sent,z(t.data.data),console.log(t.data.data),J({currentPage:t.data.current_page,perPage:t.data.per_page,total:t.data.total}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),console.error("Error fetching data:",e.t0);case 13:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(){return e.apply(this,arguments)}}();(0,r.useEffect)((function(){te()}),[]);var ne=function(){var e=(0,l.Z)((0,i.Z)().mark((function e(t){var n,r;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,j().fire({title:"Yakin?",text:"Apakah Anda yakin ingin menghapus data ini?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Hapus!"});case 3:if(n=e.sent,!n.isConfirmed){e.next=11;break}return e.next=8,d.Z.delete("admin/industri/".concat(t),{headers:{Authorization:"Bearer ".concat(ee)}});case 8:r=e.sent,v.Am.success(r.data.message,{position:"top-right",duration:4e3}),te();case 11:e.next=17;break;case 13:e.prev=13,e.t0=e.catch(0),console.error("Error deleting lead:",e.t0),v.Am.error("Failed to delete lead.",{position:"top-right",duration:4e3});case 17:case"end":return e.stop()}}),e,null,[[0,13]])})));return function(t){return e.apply(this,arguments)}}(),re=M.filter((function(e){return e.name.toLowerCase().includes(f.toLowerCase())||e.email.toLowerCase().includes(f.toLowerCase())})),ae=Math.ceil(re.length/8),se=8*(k-1),ie=se+8,le=re.slice(se,ie);return t?(0,b.jsx)("div",{children:"Loading..."}):n?(0,b.jsxs)("div",{children:["Error: ",n]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(u.Z,{title:"Data Industri",topMargin:"mt-2",TopSideButtons:(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row sm:justify-between items-center gap-2",children:[(0,b.jsx)("input",{type:"text",className:"input input-bordered input-sm w-full sm:w-64",placeholder:"Search",value:f,onChange:function(e){g(e.target.value)}}),(0,b.jsx)(c.rU,{to:"/app/data/industri/tambah",children:(0,b.jsx)("button",{className:"btn btn-sm normal-case btn-primary w-full sm:w-auto",children:"Add New"})})]}),children:[(0,b.jsx)("div",{className:"overflow-x-auto w-full",children:(0,b.jsxs)("table",{className:"table w-[150%] md:w-full text-center",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{children:"Nama"}),(0,b.jsx)("th",{children:"Bidang"}),(0,b.jsx)("th",{children:"Alamat"}),(0,b.jsx)("th",{children:"Pembimbing"}),(0,b.jsx)("th",{className:"text-center col-6",children:"No Pembimbing"}),(0,b.jsx)("th",{className:"text-center col-6",children:"Action"})]})}),(0,b.jsx)("tbody",{className:"text-center",children:le.map((function(e){return(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{children:(0,b.jsx)("div",{className:"font-bold",children:e.name})}),(0,b.jsx)("td",{children:e.bidang}),(0,b.jsx)("td",{children:e.alamat}),(0,b.jsx)("td",{children:e.industryMentorName}),(0,b.jsx)("td",{children:e.industryMentorNo}),(0,b.jsxs)("td",{className:"",children:[(0,b.jsx)(c.rU,{to:"/app/data/industri/edit/".concat(e.id),children:(0,b.jsx)("button",{className:"btn btn-square btn-ghost",children:(0,b.jsx)(x(),{className:"w-5"})})}),(0,b.jsx)("button",{className:"btn btn-square btn-ghost",onClick:function(){return ne(e.id)},children:(0,b.jsx)(m(),{className:"w-5"})})]})]},e.id)}))})]})}),(0,b.jsx)("div",{className:"flex justify-center mt-4 gap-2",children:function(){for(var e=[],t=function(t){e.push((0,b.jsx)("button",{className:"btn btn-sm ".concat(t===k?"btn-active":""),onClick:function(){L(t)},children:t},t))},n=1;n<=ae;n++)t(n);return e}()})]}),(0,b.jsx)(v.Ix,{})]})};var Z=function(){var e=(0,a.I0)();return(0,r.useEffect)((function(){e((0,s.Iw)({title:"Data Industri"}))}),[]),(0,b.jsx)(w,{})}},4120:function(e,t,n){var r=n(215).default,a=["title","titleId"],s=n(2791);var i=s.forwardRef((function(e,t){var n=e.title,i=e.titleId,l=r(e,a);return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true",ref:t,"aria-labelledby":i},l),n?s.createElement("title",{id:i},n):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"}))}));e.exports=i},5217:function(e,t,n){var r=n(215).default,a=["title","titleId"],s=n(2791);var i=s.forwardRef((function(e,t){var n=e.title,i=e.titleId,l=r(e,a);return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true",ref:t,"aria-labelledby":i},l),n?s.createElement("title",{id:i},n):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"}))}));e.exports=i}}]);
//# sourceMappingURL=803.c4bf2f67.chunk.js.map
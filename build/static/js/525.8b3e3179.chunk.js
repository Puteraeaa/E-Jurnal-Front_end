(self.webpackChunkE_Jurnal=self.webpackChunkE_Jurnal||[]).push([[525],{7318:function(e,r,t){var n=t(9439),o=t(2791),a=t(6293),l=t(6042),s=t(9961),i=t(7626),d=(t(3666),t(8559)),u=t.n(d),c=t(7549),b=(t(8117),t(184)),m=new(u().Icon)({iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41]}),p=function(e){var r=e.setLatLng,t=(0,o.useState)(null),s=(0,n.Z)(t,2),i=s[0],d=s[1];return(0,a.zV)({click:function(e){d(e.latlng),r(e.latlng)}}),null===i?null:(0,b.jsx)(l.J,{position:i,icon:m})},g=function(e){var r=e.provider,t=e.setLatLng,n=(0,a.Sx)();return(0,o.useEffect)((function(){var e=new c.C1({provider:r,style:"bar",autoClose:!0,retainZoomLevel:!1,searchLabel:"Enter address or place",keepResult:!0});return n.addControl(e),n.on("geosearch/showlocation",(function(e){var r=e.location,n=r.x,o=r.y;t({lat:o,lng:n})})),function(){return n.removeControl(e)}}),[n,r,t]),null};r.Z=function(e){var r=e.setLatLng,t=new c.Zm();return(0,b.jsxs)(s.h,{center:[-2.5,118],zoom:5,style:{height:"300px",width:"100%"},children:[(0,b.jsx)(i.I,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:"\xa9 OpenStreetMap contributors"}),(0,b.jsx)(g,{provider:t,setLatLng:r}),(0,b.jsx)(p,{setLatLng:r})]})}},4334:function(e,r,t){t.r(r);var n=t(4165),o=t(5861),a=t(4942),l=t(1413),s=t(9439),i=t(2791),d=t(7689),u=t(7318),c=t(8057),b=t(8329),m=t(5218),p=t(184),g=b.Z.get("token");r.default=function(){var e=(0,d.s0)(),r=(0,i.useState)({user_id:"",name:"",bidang:"",alamat:"",longitude:"",latitude:"",industryMentorName:"",industryMentorNo:""}),t=(0,s.Z)(r,2),b=t[0],f=t[1],x=function(e){var r=e.target,t=r.name,n=r.value;f((function(e){return(0,l.Z)((0,l.Z)({},e),{},(0,a.Z)({},t,n))}))},h=function(){var r=(0,o.Z)((0,n.Z)().mark((function r(t){var o,a,l,i,d,u;return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t.preventDefault(),r.prev=1,r.next=4,c.Z.post("admin/industri",b,{headers:{Authorization:"Bearer ".concat(g)}});case 4:m.Am.success("Lead added successfully!",{position:"top-right",duration:4e3}),e("/app/data/industri"),r.next=11;break;case 8:if(r.prev=8,r.t0=r.catch(1),r.t0.response)if(console.error("Error response data:",r.t0.response.data),o=r.t0.response.data.errors){for(a=0,l=Object.entries(o);a<l.length;a++)i=(0,s.Z)(l[a],2),d=i[0],u=i[1],console.error("Field: ".concat(d,", Errors: ").concat(u.join(", ")));m.Am.error("Failed to add lead: ".concat(Object.values(o)[0][0]),{position:"top-right",duration:4e3})}else m.Am.error("Failed to add lead: ".concat(r.t0.response.data.message||"Please check the form fields."),{position:"top-right",duration:4e3});else console.error("Error adding lead:",r.t0),m.Am.error("Failed to add lead.",{position:"top-right",duration:4e3});case 11:case"end":return r.stop()}}),r,null,[[1,8]])})));return function(e){return r.apply(this,arguments)}}();return(0,p.jsx)("div",{className:"container mx-auto my-10 px-4",children:(0,p.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500",children:[(0,p.jsx)("h1",{className:"text-3xl font-bold text-center mb-4",children:"Tambah Data Industri"}),(0,p.jsx)("p",{className:"text-center border-b pb-4 mb-4",children:"Silakan isi form di bawah!"}),(0,p.jsxs)("form",{onSubmit:h,children:[(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"User ID"}),(0,p.jsx)("input",{type:"text",name:"user_id",value:b.user_id,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Nama Industri"}),(0,p.jsx)("input",{type:"text",name:"name",value:b.name,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Bidang"}),(0,p.jsx)("input",{type:"text",name:"bidang",value:b.bidang,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Alamat"}),(0,p.jsx)("input",{type:"text",name:"alamat",value:b.alamat,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Longitude"}),(0,p.jsx)("input",{type:"text",name:"longitude",value:b.longitude,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0,readOnly:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Latitude"}),(0,p.jsx)("input",{type:"text",name:"latitude",value:b.latitude,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0,readOnly:!0})]}),(0,p.jsx)("div",{className:"mb-4",children:(0,p.jsx)(u.Z,{setLatLng:function(e){var r=e.lat,t=e.lng;f((function(e){return(0,l.Z)((0,l.Z)({},e),{},{latitude:r,longitude:t})}))}})}),(0,p.jsx)("button",{type:"button",className:"w-full px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg mb-4",onClick:function(){navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){var r=e.coords,t=r.latitude,n=r.longitude;f((function(e){return(0,l.Z)((0,l.Z)({},e),{},{latitude:t.toFixed(6),longitude:n.toFixed(6)})})),m.Am.success("Location added successfully!",{position:"top-right",duration:4e3})}),(function(e){console.error("Error fetching location:",e),m.Am.error("Failed to fetch location. Please enable location services.",{position:"top-right",duration:4e3})})):m.Am.error("Geolocation is not supported by this browser.",{position:"top-right",duration:4e3})},children:"Tambah lokasi dengan posisi anda saat ini"}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"Pembimbing"}),(0,p.jsx)("input",{type:"text",name:"industryMentorName",value:b.industryMentorName,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"mb-4",children:[(0,p.jsx)("label",{className:"block text-gray-700 font-bold mb-2",children:"No Pembimbing"}),(0,p.jsx)("input",{type:"text",name:"industryMentorNo",value:b.industryMentorNo,onChange:x,className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500",required:!0})]}),(0,p.jsxs)("div",{className:"flex justify-between gap-2",children:[(0,p.jsx)("button",{type:"submit",className:"w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg",children:"Save"}),(0,p.jsx)("button",{type:"button",className:"w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg",onClick:function(){return e("/app/data/industri")},children:"Cancel"})]})]})]})})}},5987:function(e,r,t){t.d(r,{Z:function(){return o}});var n=t(3366);function o(e,r){if(null==e)return{};var t,o,a=(0,n.Z)(e,r);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(o=0;o<l.length;o++)t=l[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}}}]);
//# sourceMappingURL=525.8b3e3179.chunk.js.map
/*! For license information please see 143.9e482cb2.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[143],{2143:(e,t,r)=>{r.r(t),r.d(t,{default:()=>g});var n=r(9950),a=r(2678),s=r(4729),o=r(2260),i=r(8429),c=r(300),l=r(2074),d=r(3571),u=r(8091),m=r(3491),p=r(4643),f=r(5996);function h(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}var x=function e(t,r){function n(e,n,a){if("undefined"!==typeof document){"number"===typeof(a=h({},r,a)).expires&&(a.expires=new Date(Date.now()+864e5*a.expires)),a.expires&&(a.expires=a.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var s="";for(var o in a)a[o]&&(s+="; "+o,!0!==a[o]&&(s+="="+a[o].split(";")[0]));return document.cookie=e+"="+t.write(n,e)+s}}return Object.create({set:n,get:function(e){if("undefined"!==typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],n={},a=0;a<r.length;a++){var s=r[a].split("="),o=s.slice(1).join("=");try{var i=decodeURIComponent(s[0]);if(n[i]=t.read(o,i),e===i)break}catch(c){}}return e?n[e]:n}},remove:function(e,t){n(e,"",h({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,h({},this.attributes,t))},withConverter:function(t){return e(h({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"}),v=r(4414);const g=()=>{const e=(0,i.Zp)(),t=x.get("user_email"),[r,h]=(0,n.useState)(!1),[g,w]=(0,n.useState)("undefined"!=t&&t?t:""),[C,b]=(0,n.useState)(""),j=(0,c.wA)(),y=(0,u.A)((e=>d.iD(e))),A=(0,u.A)((()=>d.vF()));return(0,n.useEffect)((()=>{y.isSuccess?A.mutate():y.isError&&m.Ay.error(y.error.message)}),[y.isSuccess,y.isError]),(0,n.useEffect)((()=>{A.data?(j((0,p.TK)({...A.data})),m.Ay.success("\u0110\u0103ng nh\u1eadp th\xe0nh c\xf4ng"),e("/")):A.isError&&m.Ay.error("\u0110\u0103ng nh\u1eadp kh\xf4ng th\xe0nh c\xf4ng")}),[A.isSuccess,A.isError]),(0,v.jsxs)("div",{className:"w-full",children:[(0,v.jsxs)("form",{className:"mx-auto w-full md:max-w-96 space-y-6",method:"post",children:[(0,v.jsx)("input",{id:"input-email",className:"border border-gray-500 py-2 px-3 w-full outline-none",value:g,onChange:e=>(e=>{w(e.target.value)})(e),autoComplete:"email",placeholder:"Email",type:"email",name:"email"}),(0,v.jsxs)("div",{className:"flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary",children:[(0,v.jsx)("input",{id:"input-password",className:"outline-none mr-2 flex-1",type:r?"text":"password",onChange:e=>(e=>{b(e.target.value)})(e),autoComplete:"current-password",value:C,placeholder:"M\u1eadt kh\u1ea9u",name:"password"}),r?(0,v.jsx)(a.A,{onClick:()=>h(!r)}):(0,v.jsx)(s.A,{onClick:()=>h(!r)})]}),(0,v.jsx)("button",{disabled:!g||!C||y.isPending,onClick:e=>{e.preventDefault(),y.mutate({email:g,password:C})},className:`w-full cursor-pointer bg-primary text-white rounded py-3 md:py-2 ${(!g||!C||y.isPending)&&"opacity-40 cursor-default"}`,children:y.isPending?(0,v.jsx)(o.A,{}):"\u0110\u0102NG NH\u1eacP"}),(0,v.jsx)("button",{onClick:e=>(e=>{e.preventDefault(),d.XL(e)})(e),className:"w-full cursor-pointer bg-white text-black rounded py-3 md:py-2 border border-[#747775]",children:(0,v.jsxs)("div",{className:"flex justify-center",children:[(0,v.jsx)("div",{className:"h-5 w-5 mr-5",children:(0,v.jsxs)("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 48 48",className:"block",children:[(0,v.jsx)("path",{fill:"#EA4335",d:"M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"}),(0,v.jsx)("path",{fill:"#4285F4",d:"M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"}),(0,v.jsx)("path",{fill:"#FBBC05",d:"M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"}),(0,v.jsx)("path",{fill:"#34A853",d:"M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"}),(0,v.jsx)("path",{fill:"none",d:"M0 0h48v48H0z"})]})}),(0,v.jsx)("span",{className:"gsi-material-button-contents",children:"Sign in with Google"})]})})]}),(0,v.jsx)("div",{className:"mt-3 mx-auto w-full md:max-w-96",children:(0,v.jsxs)("p",{children:["B\u1ea1n ch\u01b0a c\xf3 t\xe0i kho\u1ea3n?"," ",(0,v.jsx)(l.N_,{to:f.Ay.signUp,className:"text-primary font-semibold",children:"\u0110\u0103ng k\xfd t\xe0i kho\u1ea3n"})]})}),(0,v.jsx)("div",{className:"mt-3 mx-auto w-full md:max-w-96",children:(0,v.jsx)(l.N_,{to:f.Ay.forgotPassword,className:"text-orange-600 font-semibold",children:"Qu\xean m\u1eadt kh\u1ea9u ?"})})]})}},4729:(e,t,r)=>{r.d(t,{A:()=>c});var n=r(8168),a=r(9950);const s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"}},{tag:"path",attrs:{d:"M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"}}]},name:"eye-invisible",theme:"outlined"};var o=r(5085),i=function(e,t){return a.createElement(o.A,(0,n.A)({},e,{ref:t,icon:s}))};const c=a.forwardRef(i)},2678:(e,t,r)=>{r.d(t,{A:()=>c});var n=r(8168),a=r(9950);const s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"}}]},name:"eye",theme:"outlined"};var o=r(5085),i=function(e,t){return a.createElement(o.A,(0,n.A)({},e,{ref:t,icon:s}))};const c=a.forwardRef(i)}}]);
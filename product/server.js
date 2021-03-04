(()=>{"use strict";var e={352:function(e,s,t){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(s,"__esModule",{value:!0});const r=o(t(127)),n=o(t(622)),i=o(t(334)),c=o(t(420));i.default.config();const a=process.env.SERVER||8080,u=r.default();u.use(r.default.static(n.default.join(__dirname,"../public"))),u.listen(a,(function(){console.log("Running UnityRTC-Template-Server on port:",a)})).on("upgrade",((e,s,t)=>{c.default.handleUpgrade(e,s,t,(s=>{c.default.emit("connection",s,e)}))}))},420:function(e,s,t){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(s,"__esModule",{value:!0});const r=o(t(439)),n=t(436),i=t(570),c=o(t(350)),a={},u=new r.default.Server({noServer:!0});function d(e){const s=JSON.parse(e),t=this;switch(s.type){case"offer":return function(e,s){l(e,(()=>{const t=Object.assign(Object.assign({},s),{id:e.id});a[e.room].send(s.target,t)}))}(t,s);case"login":return function(e,s){const{username:t,password:o}=s;t&&o?n.sendTo(e,{type:"success",success:i.SocketSuccessType.Login,token:"Cake is a Lie"}):n.sendTo(e,{type:"error",error:"login",message:"Wrong credentials",code:-1})}(t,s.credentials);case"answer":return function(e,s){l(e,(()=>{const t=Object.assign(Object.assign({},s),{id:e.id});a[e.room].send(s.target,t)}))}(t,s);case"candidate":return function(e,s){l(e,(()=>{const t=Object.assign(Object.assign({},s),{id:e.id});a[e.room].send(s.target,t)}))}(t,s);case"leave":return function(e){l(e,(()=>{a[e.room].leave(e)}))}(t);case"join":return p(t,s);case"create":return function(e,s){a[s.room]&&n.sendTo(e,{type:"error",error:"room",message:"This room already exists",code:1}),a[s.room]=new c.default(s.room,s.password),p(e,s),n.sendTo(e,{type:"success",success:i.SocketSuccessType.RoomCreate})}(t,s)}}function l(e,s){const{room:t}=e;a[t]?s():n.sendTo(e,{type:"error",error:"room",message:"Room is not existing",code:4})}function p(e,s){s.token||n.sendTo(e,a[s.room].join(e,s.password)),a[s.room]?n.sendTo(e,a[s.room].join(e,s.password)):n.sendTo(e,{type:"error",error:"room",message:"Room is not existing",code:4})}u.on("connection",(function(e){e.on("message",d.bind(e))})),s.default=u},350:(e,s,t)=>{Object.defineProperty(s,"__esModule",{value:!0});const o=t(436),r=t(570);s.default=class{constructor(e,s=""){this.name=e,this.password=s,this.users={},this.count=0,this.host=null}join(e,s){if(s!==this.password)return{type:"error",error:"password",message:"incorrect password",code:2};const t=`${this.name}#${this.count}`;return e.id=t,e.room=this.name,this.count++,this.host?this.broadcast(e,{type:"join"}):this.host=t,this.users[t]=e,{type:"success",success:r.SocketSuccessType.Join,id:t}}leave(e){delete this.users[e.id],this.count--,this.count>0&&(this.broadcast(e,{type:"leave"}),this.host=Object.keys(this.users)[0])}broadcast(e,s){const t=Object.assign(Object.assign({},s),{id:null==e?void 0:e.id});for(const s in this.users)e&&s===e.id||o.sendTo(this.users[s],t)}farwell(e){e.id===this.host?this.broadcast(null,{type:"farwell"}):this.send(e.id,{type:"error",message:"You are not host",error:"unothorized",code:-1})}send(e,s){return!!this.users[e]&&(o.sendTo(this.users[e],s),!0)}}},436:(e,s)=>{Object.defineProperty(s,"__esModule",{value:!0}),s.sendTo=void 0,s.sendTo=function(e,s){const t=JSON.stringify(s);e.send(t)}},334:e=>{e.exports=require("dotenv")},127:e=>{e.exports=require("express")},622:e=>{e.exports=require("path")},570:e=>{e.exports=require("unityrtc-types")},439:e=>{e.exports=require("ws")}},s={};!function t(o){if(s[o])return s[o].exports;var r=s[o]={exports:{}};return e[o].call(r.exports,r,r.exports,t),r.exports}(352)})();
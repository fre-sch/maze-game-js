!function(t){var e={};function i(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=2)}([function(t,e,i){t.exports=i.p+"tiles.c23677e84cd3d9924dbbdcf961657b9b.png"},function(t,e,i){},function(t,e,i){"use strict";i.r(e);i(1);function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,i){return e&&r(t.prototype,e),i&&r(t,i),t}var s=function(t,e,i){return Math.max(e,Math.min(i,t))},o=function(t){return~t>>>0},h=function(t,e,i){var n=(1<<i)-1;return t<<(e%=i)&n|(t&n)>>i-e},l=function(t){for(var e=0,i=1779033703^t.length;e<t.length;e++)i=(i=Math.imul(i^t.charCodeAt(e),3432918353))<<13|i>>>19;return function(){return i=Math.imul(i^i>>>16,2246822507),i=Math.imul(i^i>>>13,3266489909),(i^=i>>>16)>>>0}},u=function(){function t(e){n(this,t),this.state=e}return a(t,[{key:"next",value:function(){var t=this.state+=1831565813;return t=Math.imul(t^t>>>15,1|t),(((t^=t+Math.imul(t^t>>>7,61|t))^t>>>14)>>>0)/4294967295}}]),t}(),f=function(){function t(e){n(this,t),void 0!==e&&(e=parseInt(e,36)),e||(e=(new Date).toISOString(),e=l(e)()),this.generator=new u(e)}return a(t,[{key:"next",value:function(){return this.generator.next()}},{key:"getState",value:function(){return this.generator.state.toString(36)}}]),t}();function c(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var d=function(){function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return 0};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.width=e,this.height=i,this.defaultFill=n,this.cells=new Array(this.width*this.height).fill(null).map(n)}var e,i,n;return e=t,(i=[{key:"reset",value:function(){this.cells=new Array(this.width*this.height).fill(null).map(this.defaultFill)}},{key:"within",value:function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height}},{key:"set",value:function(t,e,i){t=s(t,0,this.width-1),e=s(e,0,this.height-1),this.cells[e*this.width+t]=i}},{key:"get",value:function(t,e){return t=s(t,0,this.width-1),e=s(e,0,this.height-1),this.cells[e*this.width+t]}},{key:"getDefault",value:function(t,e,i){return this.within(t,e)?this.cells[e*this.width+t]:i}},{key:"fill",value:function(t,e,i,n,r){t=s(t,0,this.width-1),e=s(e,0,this.height-1),i=s(i,0,this.width-t),n=s(n,0,this.height-e);for(var a=0;a<n;++a)for(var o=0;o<i;++o)this.set(t+o,e+a,r)}}])&&c(e.prototype,i),n&&c(e,n),t}(),v={NorthDoor:Math.pow(2,0),NorthWall:Math.pow(2,1),EastDoor:Math.pow(2,2),EastWall:Math.pow(2,3),SouthDoor:Math.pow(2,4),SouthWall:Math.pow(2,5),WestDoor:Math.pow(2,6),WestWall:Math.pow(2,7),ALL:256};v.North=v.NorthDoor|v.NorthWall,v.East=v.EastDoor|v.EastWall,v.South=v.SouthDoor|v.SouthWall,v.West=v.WestDoor|v.WestWall,v.DOOR_MASK=v.NorthDoor|v.EastDoor|v.SouthDoor|v.WestDoor,v.WALL_MASK=v.NorthWall|v.EastWall|v.SouthWall|v.WestWall;var y=[{x:0,y:-1},{x:0,y:-1},{x:1,y:0},{x:1,y:0},{x:0,y:1},{x:0,y:1},{x:-1,y:0},{x:-1,y:0}],p=function(t,e,i){return{x:t+y[i].x,y:e+y[i].y}},w=function(t){return h(t,4,8)},S=function(t,e,i){var n=i|h(i,1,8);return e=w(e)&n,t&o(n)|e},g=function t(e,i,n,r,a,s){var l=a=w(a);s>0&&(l=function(t,e){var i=Math.floor(t.next()*v.ALL),n=Math.floor(t.next()*v.ALL),r=i&v.DOOR_MASK|e&v.DOOR_MASK;return(n&v.WALL_MASK|e&v.WALL_MASK)&o(h(r,1,8))|r}(i,a)),l=function(t,e,i,n){for(var r=0;r<8;r+=2){var a=1<<r,s=1<<r+1,h=p(e,i,r);if(t.within(h.x,h.y)){var l=t.get(h.x,h.y);0!==l&&(n=S(n,l,a))}else n&=o(a|s)}return n}(e,n,r,l),e.set(n,r,l);for(var u=0;u<8;u++){var f=1<<u,c=p(n,r,u);if(e.within(c.x,c.y)){var d=e.get(c.x,c.y);0!=(l&f)&&f!==a&&0===d&&t(e,i,c.x,c.y,f,s-1)}}};function m(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var M=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.xDown=null,this.yDown=null,this.element=e,this.element.addEventListener("touchstart",this.handleTouchStart.bind(this),!1),this.element.addEventListener("touchmove",this.handleTouchMove.bind(this),!1)}var e,i,n;return e=t,(i=[{key:"handleTouchStart",value:function(t){this.xDown=t.touches[0].clientX,this.yDown=t.touches[0].clientY}},{key:"handleTouchMove",value:function(t){if(this.xDown&&this.yDown&&this.onSwipe){var e=t.touches[0].clientX,i=t.touches[0].clientY;this.xDiff=this.xDown-e,this.yDiff=this.yDown-i,Math.abs(this.xDiff)>Math.abs(this.yDiff)?this.xDiff>0?this.onSwipe(t,"SwipeLeft"):this.onSwipe(t,"SwipeRight"):(this.yDiff>0?this.onSwipe(t,"SwipeUp"):this.onSwipe(t,"SwipeDown"),t.preventDefault()),this.xDown=null,this.yDown=null}}}])&&m(e.prototype,i),n&&m(e,n),t}(),x=i(0),O=i.n(x);function E(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var b,D={ROOM_SIZE:5,SCALE:32,ITERATIONS:12},k=new f(window.location.hash.substr(1)),I=function(t,e,i){return t.get(e,i)*(t.getDefault(e,i-1,1)|t.getDefault(e+1,i,1)<<1|t.getDefault(e,i+1,1)<<2|t.getDefault(e-1,i,1)<<3)},A={offset:{x:0,y:-1},mask:v.North},L={offset:{x:1,y:0},mask:v.East},W={offset:{x:0,y:1},mask:v.South},_={offset:{x:-1,y:0},mask:v.West},R=function(){function t(e){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.canvas=e,this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,this.ctx=this.canvas.getContext("2d"),this.mazeGrid=new d(parseInt(e.width/D.SCALE/D.ROOM_SIZE),parseInt(e.height/D.SCALE/D.ROOM_SIZE)),this.tileGrid=new d(parseInt(e.width/D.SCALE),parseInt(e.width/D.SCALE)),this.player={health:3},window.addEventListener("keydown",function(t){return i.handleInput(t,t.key)}),new M(e).onSwipe=function(t,e){return i.handleInput(t,e)},this.tiles=new Image,this.tiles.onload=function(){i.tileSize=parseInt(i.tiles.naturalWidth/4),i.reset()},this.tiles.src=O.a}var e,i,n;return e=t,(i=[{key:"reset",value:function(t){t&&window.history.pushState(null,null,"#"+k.getState()),this.mazeGrid.reset(),this.tileGrid.reset();var e=parseInt(this.mazeGrid.width/2),i=parseInt(this.mazeGrid.height/2);g(this.mazeGrid,k,e,i,0,D.ITERATIONS),function(t,e){var i=new d(t.width,t.height);i.fill(0,0,i.width,i.height,1);for(var n=0,r=e.height;n<r;n++)for(var a=0,s=e.width;a<s;a++){var o=e.get(a,n);if(0!==o){var h=Math.floor(D.ROOM_SIZE/3),l=a*D.ROOM_SIZE,u=n*D.ROOM_SIZE;i.fill(l+1,u+1,D.ROOM_SIZE-2,D.ROOM_SIZE-2,0),0!=(o&v.NorthDoor)&&i.fill(l+1+h,u,h,1,0),0!=(o&v.NorthWall)&&i.fill(l+1,u,D.ROOM_SIZE-2,1,0),0!=(o&v.EastDoor)&&i.fill(l+D.ROOM_SIZE-1,u+1+h,1,h,0),0!=(o&v.EastWall)&&i.fill(l+D.ROOM_SIZE-1,u+1,1,D.ROOM_SIZE-2,0),0!=(o&v.SouthDoor)&&i.fill(l+1+h,u+D.ROOM_SIZE-1,h,1,0),0!=(o&v.SouthWall)&&i.fill(l+1,u+D.ROOM_SIZE-1,D.ROOM_SIZE-2,1,0),0!=(o&v.WestDoor)&&i.fill(l,u+1+h,1,h,0),0!=(o&v.WestWall)&&i.fill(l,u+1,1,D.ROOM_SIZE-2,0)}}for(var f=0,c=t.height;f<c;f++)for(var y=0,p=t.width;y<p;y++)t.set(y,f,I(i,y,f))}(this.tileGrid,this.mazeGrid),this.player.pos={x:e,y:i},this.generateGems(),this.draw()}},{key:"generateGems",value:function(){for(this.numGems=3+Math.round(9*k.next()),this.gems=[];this.gems.length<this.numGems;){var t={x:parseInt(k.next()*this.mazeGrid.width),y:parseInt(k.next()*this.mazeGrid.height)};0!==this.mazeGrid.get(t.x,t.y)&&this.gems.push(t)}}},{key:"playerMoveBy",value:function(t){var e,i,n,r,a=this.player.pos.x,s=this.player.pos.y;e=500,i=function(e){this.player.pos.x=a+t.x*e,this.player.pos.y=s+t.y*e,1===e&&this.checkGemsCollected(),this.draw()}.bind(this),r=null,n=function(t){null===r&&(r=t);var a=(t-r)/e;a<1?(i(a),window.requestAnimationFrame(n)):i(1)},window.requestAnimationFrame(n)}},{key:"playerMove",value:function(t){var e={x:this.player.pos.x+t.offset.x,y:this.player.pos.y+t.offset.y},i=this.mazeGrid.get(this.player.pos.x,this.player.pos.y),n=0!=(this.mazeGrid.get(e.x,e.y)&w(t.mask));0!=(i&t.mask)&&n&&this.playerMoveBy(t.offset)}},{key:"checkGemsCollected",value:function(){this.gems=this.gems.filter(function(t){return!(t.x===this.player.pos.x&&t.y===this.player.pos.y)}.bind(this)),0===this.gems.length&&this.reset(!0)}},{key:"handleInput",value:function(t,e){switch(e){case"SwipeUp":case"ArrowUp":this.playerMove(A),t.preventDefault();break;case"SwipeDown":case"ArrowDown":this.playerMove(W),t.preventDefault();break;case"SwipeLeft":case"ArrowLeft":this.playerMove(_),t.preventDefault();break;case"SwipeRight":case"ArrowRight":this.playerMove(L),t.preventDefault()}}},{key:"draw",value:function(){this.drawMaze(this.ctx),this.drawGems(this.ctx),this.drawPlayer(this.ctx)}},{key:"drawMaze",value:function(t){t.save(),t.scale(parseInt(D.SCALE/this.tileSize),parseInt(D.SCALE/this.tileSize)),t.fillStyle="black",t.fillRect(0,0,this.canvas.width,this.canvas.height),t.imageSmoothingEnabled=!1;for(var e=0,i=this.tileGrid.height;e<i;e++)for(var n=0,r=this.tileGrid.width;n<r;n++)this.drawTile(t,n,e,this.tileGrid.get(n,e));t.restore()}},{key:"drawTile",value:function(t,e,i,n){var r=n%4*this.tileSize,a=Math.floor(n/4)*this.tileSize;t.drawImage(this.tiles,r,a,this.tileSize,this.tileSize,e*this.tileSize,i*this.tileSize,this.tileSize,this.tileSize)}},{key:"drawPlayer",value:function(t){t.save(),t.fillStyle="rgba(80, 220, 255, 1)";var e=D.ROOM_SIZE*D.SCALE,i=.4*e,n=this.player.pos.x*e,r=this.player.pos.y*e;t.fillRect(n+i,r+i,D.SCALE,D.SCALE),t.restore()}},{key:"drawGems",value:function(t){t.save(),t.fillStyle="rgba(80, 255, 80, 1)";for(var e=D.ROOM_SIZE*D.SCALE,i=.4*e,n=0,r=this.gems.length;n<r;n++){var a=this.gems[n].x*e,s=this.gems[n].y*e;t.fillRect(a+i,s+i,D.SCALE,D.SCALE)}t.restore()}}])&&E(e.prototype,i),n&&E(e,n),t}(),z=document.createElement("div");b=function(t){z.style.display="none",z.removeEventListener("click",b)},z.classList.add("start-screen"),z.addEventListener("click",b),z.innerHTML='\n<div>\n<div class="title">Collect gems in Maze</div>\n<div>Press arrow keys to move.</div>\n<div>Or swipe to move.</div>\n<div>Click or tap to start</div>\n</div>\n';var C=document.createElement("canvas");document.body.appendChild(C),document.body.appendChild(z),window.game=new R(C)}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGVzIiwiaW5zdGFsbGVkTW9kdWxlcyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJpIiwibCIsImNhbGwiLCJtIiwiYyIsImQiLCJuYW1lIiwiZ2V0dGVyIiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsInIiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsInZhbHVlIiwidCIsIm1vZGUiLCJfX2VzTW9kdWxlIiwibnMiLCJjcmVhdGUiLCJrZXkiLCJiaW5kIiwibiIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsIl9fd2VicGFja19leHBvcnRzX18iLCJfY2xhc3NDYWxsQ2hlY2siLCJpbnN0YW5jZSIsIkNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiX2RlZmluZVByb3BlcnRpZXMiLCJ0YXJnZXQiLCJwcm9wcyIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIl9jcmVhdGVDbGFzcyIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsImNsYW1wIiwidmFsIiwibWluIiwibWF4IiwiTWF0aCIsIm5vdCIsInJvdGwiLCJzaGlmdENvdW50Iiwic2l6ZSIsInNpemVNYXNrIiwieG11cjMiLCJzdHIiLCJoIiwiaW11bCIsImNoYXJDb2RlQXQiLCJNdWxiZXJyeTMyIiwic2VlZCIsInRoaXMiLCJzdGF0ZSIsIlJhbmRvbSIsImluaXRTZWVkIiwidW5kZWZpbmVkIiwicGFyc2VJbnQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJnZW5lcmF0b3IiLCJuZXh0IiwidG9TdHJpbmciLCJncmlkX2RlZmluZVByb3BlcnRpZXMiLCJncmlkX0dyaWQiLCJHcmlkIiwid2lkdGgiLCJoZWlnaHQiLCJkZWZhdWx0RmlsbCIsImFyZ3VtZW50cyIsImdyaWRfY2xhc3NDYWxsQ2hlY2siLCJjZWxscyIsIkFycmF5IiwiZmlsbCIsIm1hcCIsIngiLCJ5IiwiZGVmYXVsdFZhbHVlIiwid2l0aGluIiwieDEiLCJ5MSIsInciLCJzZXQiLCJGZWF0dXJlIiwiTm9ydGhEb29yIiwicG93IiwiTm9ydGhXYWxsIiwiRWFzdERvb3IiLCJFYXN0V2FsbCIsIlNvdXRoRG9vciIsIlNvdXRoV2FsbCIsIldlc3REb29yIiwiV2VzdFdhbGwiLCJBTEwiLCJOb3J0aCIsIkVhc3QiLCJTb3V0aCIsIldlc3QiLCJET09SX01BU0siLCJXQUxMX01BU0siLCJPRkZTRVQiLCJvZmZzZXQiLCJkaXIiLCJtYXplZ2VuX3NoaWZ0RmVhdHVyZSIsImZlYXR1cmVzIiwibWF6ZWdlbl9tZXJnZUZlYXR1cmVzIiwiYSIsImIiLCJtYXNrIiwiZ2VuZXJhdGUiLCJncmlkIiwicmFuZG9tIiwicHJldmlvdXMiLCJpdGVyIiwicmFuZG9tRG9vcnMiLCJmbG9vciIsInJhbmRvbVdhbGxzIiwiZG9vcnMiLCJtYXplZ2VuX2dlbmVyYXRlRmVhdHVyZXMiLCJkaXIxIiwiZXhpc3RpbmdGZWF0dXJlcyIsIm1hemVnZW5fbWVyZ2VBZGphY2VudCIsInN3aXBlX2RlZmluZVByb3BlcnRpZXMiLCJTd2lwZSIsImVsZW1lbnQiLCJzd2lwZV9jbGFzc0NhbGxDaGVjayIsInhEb3duIiwieURvd24iLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlVG91Y2hTdGFydCIsImhhbmRsZVRvdWNoTW92ZSIsImV2ZW50IiwidG91Y2hlcyIsImNsaWVudFgiLCJjbGllbnRZIiwib25Td2lwZSIsInhVcCIsInlVcCIsInhEaWZmIiwieURpZmYiLCJhYnMiLCJwcmV2ZW50RGVmYXVsdCIsInRpbGVzIiwidGlsZXNfZGVmYXVsdCIsImdhbWVfZGVmaW5lUHJvcGVydGllcyIsIl9oaWRlU3RhcnRTY3JlZW4iLCJQYXJhbSIsIlJPT01fU0laRSIsIlNDQUxFIiwiSVRFUkFUSU9OUyIsImdhbWVfcmFuZG9tIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwic3Vic3RyIiwiY29tcHV0ZVRpbGUiLCJnZXREZWZhdWx0IiwiTW92ZU5vcnRoIiwiTW92ZUVhc3QiLCJNb3ZlU291dGgiLCJNb3ZlV2VzdCIsImdhbWVfR2FtZSIsIkdhbWUiLCJjYW52YXMiLCJfdGhpcyIsImdhbWVfY2xhc3NDYWxsQ2hlY2siLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwibWF6ZUdyaWQiLCJ0aWxlR3JpZCIsInBsYXllciIsImhlYWx0aCIsImUiLCJoYW5kbGVJbnB1dCIsInN3aXBlRGlyIiwiSW1hZ2UiLCJvbmxvYWQiLCJ0aWxlU2l6ZSIsIm5hdHVyYWxXaWR0aCIsInJlc2V0Iiwic3JjIiwibmV3SGFzaCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJnZXRTdGF0ZSIsImNlbnRlclgiLCJjZW50ZXJZIiwidG1wR3JpZCIsIm15IiwibWgiLCJteCIsIm13IiwiZG9vclNpemUiLCJ0eCIsInR5IiwidGgiLCJ0dyIsImdhbWVfZ2VuZXJhdGVUaWxlcyIsInBvcyIsImdlbmVyYXRlR2VtcyIsImRyYXciLCJudW1HZW1zIiwicm91bmQiLCJnZW1zIiwiZ2VtIiwicHVzaCIsImRlbHRhVmVjdG9yIiwiZHVyYXRpb25NcyIsImZyYW1lRm4iLCJfZnJhbWVGbldyYXBwZXIiLCJpbml0aWFsIiwiaW5pdFgiLCJpbml0WSIsImRlbHRhIiwiY2hlY2tHZW1zQ29sbGVjdGVkIiwidGltZXN0YW1wIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicm9vbUZyb20iLCJjYW5Nb3ZlVG8iLCJwbGF5ZXJNb3ZlQnkiLCJmaWx0ZXIiLCJpbnB1dCIsInBsYXllck1vdmUiLCJkcmF3TWF6ZSIsImRyYXdHZW1zIiwiZHJhd1BsYXllciIsInNhdmUiLCJzY2FsZSIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiZHJhd1RpbGUiLCJyZXN0b3JlIiwidGlsZUlkIiwic3giLCJzeSIsImRyYXdJbWFnZSIsIm9mZnNldE11bHQiLCJyb29tQ2VudGVyT2Zmc2V0IiwiY2FudmFzWCIsImNhbnZhc1kiLCJzdGFydFNjcmVlbiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJpbm5lckhUTUwiLCJtYWluX2NhbnZhcyIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImdhbWUiXSwibWFwcGluZ3MiOiJDQUFTLFNBQVVBLEdBRVQsSUFBSUMsRUFBbUIsR0FHdkIsU0FBU0MsRUFBb0JDLEdBRzVCLEdBQUdGLEVBQWlCRSxHQUNuQixPQUFPRixFQUFpQkUsR0FBVUMsUUFHbkMsSUFBSUMsRUFBU0osRUFBaUJFLEdBQVksQ0FDekNHLEVBQUdILEVBQ0hJLEdBQUcsRUFDSEgsUUFBUyxJQVVWLE9BTkFKLEVBQVFHLEdBQVVLLEtBQUtILEVBQU9ELFFBQVNDLEVBQVFBLEVBQU9ELFFBQVNGLEdBRy9ERyxFQUFPRSxHQUFJLEVBR0pGLEVBQU9ELFFBS2ZGLEVBQW9CTyxFQUFJVCxFQUd4QkUsRUFBb0JRLEVBQUlULEVBR3hCQyxFQUFvQlMsRUFBSSxTQUFTUCxFQUFTUSxFQUFNQyxHQUMzQ1gsRUFBb0JZLEVBQUVWLEVBQVNRLElBQ2xDRyxPQUFPQyxlQUFlWixFQUFTUSxFQUFNLENBQUVLLFlBQVksRUFBTUMsSUFBS0wsS0FLaEVYLEVBQW9CaUIsRUFBSSxTQUFTZixHQUNYLG9CQUFYZ0IsUUFBMEJBLE9BQU9DLGFBQzFDTixPQUFPQyxlQUFlWixFQUFTZ0IsT0FBT0MsWUFBYSxDQUFFQyxNQUFPLFdBRTdEUCxPQUFPQyxlQUFlWixFQUFTLGFBQWMsQ0FBRWtCLE9BQU8sS0FRdkRwQixFQUFvQnFCLEVBQUksU0FBU0QsRUFBT0UsR0FFdkMsR0FEVSxFQUFQQSxJQUFVRixFQUFRcEIsRUFBb0JvQixJQUMvQixFQUFQRSxFQUFVLE9BQU9GLEVBQ3BCLEdBQVcsRUFBUEUsR0FBOEIsaUJBQVZGLEdB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LFNBQ3ZCMEQsRUFBS3RNLEtBQUs0RSxNQUFNd0gsRUFBUyxHQUFLdkwsS0FBSytILFNBQ3ZDWCxFQUFJc0UsVUFBVTFMLEtBQUswRixNQUFPOEYsRUFBSUMsRUFBSXpMLEtBQUsrSCxTQUFVL0gsS0FBSytILFNBQVV4RyxFQUFJdkIsS0FBSytILFNBQVV2RyxFQUFJeEIsS0FBSytILFNBQVUvSCxLQUFLK0gsU0FBVS9ILEtBQUsrSCxZQUUzSCxDQUNEeEssSUFBSyxhQUNMTixNQUFPLFNBQW9CbUssR0FDekJBLEVBQUk0RCxPQUNKNUQsRUFBSThELFVBQVksd0JBQ2hCLElBQUlTLEVBQWE3RixFQUFNQyxVQUFZRCxFQUFNRSxNQUNyQzRGLEVBQWdDLEdBQWJELEVBQ25CRSxFQUFVN0wsS0FBS3dILE9BQU80QixJQUFJN0gsRUFBSW9LLEVBQzlCRyxFQUFVOUwsS0FBS3dILE9BQU80QixJQUFJNUgsRUFBSW1LLEVBQ2xDdkUsRUFBSStELFNBQVNVLEVBQVVELEVBQWtCRSxFQUFVRixFQUFrQjlGLEVBQU1FLE1BQU9GLEVBQU1FLE9BQ3hGb0IsRUFBSWtFLFlBRUwsQ0FDRC9OLElBQUssV0FDTE4sTUFBTyxTQUFrQm1LLEdBQ3ZCQSxFQUFJNEQsT0FDSjVELEVBQUk4RCxVQUFZLHVCQUloQixJQUhBLElBQUlTLEVBQWE3RixFQUFNQyxVQUFZRCxFQUFNRSxNQUNyQzRGLEVBQWdDLEdBQWJELEVBRWQxUCxFQUFJLEVBQUd3QixFQUFJdUMsS0FBS3lKLEtBQUtqTCxPQUFRdkMsRUFBSXdCLEVBQUd4QixJQUFLLENBQ2hELElBQUk0UCxFQUFVN0wsS0FBS3lKLEtBQUt4TixHQUFHc0YsRUFBSW9LLEVBQzNCRyxFQUFVOUwsS0FBS3lKLEtBQUt4TixHQUFHdUYsRUFBSW1LLEVBQy9CdkUsRUFBSStELFNBQVNVLEVBQVVELEVBQWtCRSxFQUFVRixFQUFrQjlGLEVBQU1FLE1BQU9GLEVBQU1FLE9BRzFGb0IsRUFBSWtFLGVBdFR3RTFGLEVBQXNCekgsRUFBWVAsVUFBV2lCLEdBQWlCQyxHQUFhOEcsRUFBc0J6SCxFQUFhVyxHQTBUdkxnSSxFQTFNVCxHQWlOSWlGLEVBQWNDLFNBQVNDLGNBQWMsT0FJekNwRyxFQUFtQixTQUF5QjZCLEdBQzFDcUUsRUFBWUcsTUFBTUMsUUFBVSxPQUM1QkosRUFBWUssb0JBQW9CLFFBQVN2RyxJQUczQ2tHLEVBQVlNLFVBQVVDLElBQUksZ0JBQzFCUCxFQUFZbkgsaUJBQWlCLFFBQVNpQixHQUN0Q2tHLEVBQVlRLFVBQVkseUtBQ3hCLElBQUlDLEVBQWNSLFNBQVNDLGNBQWMsVUFDekNELFNBQVNTLEtBQUtDLFlBQVlGLEdBQzFCUixTQUFTUyxLQUFLQyxZQUFZWCxHQUMxQjVGLE9BQU93RyxLQUFPLElBQUk5RixFQUFVMkYiLCJmaWxlIjoibWFpbi5lY2JhMTU2YTkwZGM0ZmM4N2RkZi5qcyIsInNvdXJjZVJvb3QiOiIifQ==
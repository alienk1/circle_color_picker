# circle_color_picker
==============

```npm i circle_color_picker --save-dev```

parameters default

```js
var picker = new CoreColorPicker('id_element');
```


set parameters

```js
var picker = new CoreColorPicker('id_element',
       {
           width: "300px",      // px || %
           height: "300px",     // px || %
           img: "circle_full"   //circle_white | circle_full | ring_full | ring_transparent
       });
   picker.colorClick(function(event) {
       console.log("color HEX -> " + event.detail.colorHex);
       console.log("R -> " + event.detail.colorRbg[0] + ", G -> " + event.detail.colorRbg[1] + ", B -> " + event.detail.colorRbg[2]);
   });
   picker.colorMove(function (event) {
       // string    -> event.detail.colorHex 
       // int[]     -> event.detail.colorRbg
   });
   ```

## circle_color_picker
==============

```npm i circle_color_picker --save-dev```

### parameters default

```js
var element = document.getElementById('id_element');
var picker = new CoreColorPicker(element);
```
#### default ```width: '100%'```, ```height: '100%'```, ```img: 'circle_full'```.

### set parameters

```js
var element = document.getElementsByClassName('class_name');

var picker = new CoreColorPicker(element,
       {
           width: "300px",      // px || %
           height: "300px",     // px || %
           img: "circle_full"   //circle_white || circle_full || ring_full || ring_transparent
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

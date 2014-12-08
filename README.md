spectangular
============

Press shift-click on every element on the screen to view it's angular context

[Live Demo](https://www.herokuapp.com/spectangular "Spectangular Live Demo")

Installation:
------------
```
bower install spectangular
```

Add reference to dist/spectangular.js after angular.js in your main html file:
```html
<script src="angular.js"></script>
<script src="bower_components/dist/spectangular.js"></script>
```
And there you go!!
<br><b>By default, spectangular only works if the page is localhost or 127.0.0.1.</b>

Further configuration:
---------------------
If you want to enable it on domains other than localhost, configure it so:
```javascript
angular.module('myApp',[]).config(function(spectangular) {
  spectangular.domain('another.domain.com');
  spectangular.domain('10.0.0.4');
});
```
If you want to enable it based on other criteria, simply call the enable / disable functions:
```javascript
angular.module('myApp',[]).config(function(spectangular) {
  spectangular.enable();
  spectangular.disable();
});
```

Note:
-------------
> To be extra descriptive, spectangular decorates the '$controller' service and injects a 'controllerName' attribute to your scopes.<br>
This only happens when spectangular is enabled.


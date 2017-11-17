# SLLGeolocation
TxSLL's geolocation script for online patron registration.

## Requirements
`SLLGeolocation.js` requires both `geoPosition.js` and jQuery. The `geoPosition.js` script serves as a wrapper for the Geolocation API. With it, you are able to support a few more browsers and devices that do not support Geolocation natively. It can also be found at https://github.com/estebanav/javascript-mobile-desktop-geolocation.

The two libraries can be loaded via `<script>` tags before loading the `SLLGeolocation.js` script. Or you can use your own build processes to concatenate and minify the libraries. For convenience, both libraries are also included in this repository in the `vendor/` folder.

`SLLGeolocation.js` also requires you to have a Google Maps API account so that you can load the Google Maps JavaScript API.

## Usage
`SLLGeolocation.js` expects your page to have three HTML elements as noted below. One is a button that will trigger the geolocation prompt, and the other two are used to store the geolocation results in the elements' `data-` tags and to serve as a placeholder for a Google map showing the user's location.

You then use `SLLGeolocation.init()` to initiate the library. The `init()` function sets up a `click` listener for the geolocation button.

Below is a barebones version of your HTML page.

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SLLGeolocation.js</title>
</head>
<body>
  <button id="js-get-location-button">determine my location</button>
  <div id="js-geo-results" data-latitude="" data-longitude="" data-geocoded-address=""></div>
  <div id="js-map-canvas"></div>
  
  <script src="/path/to/your/jquery.min.js">
  <script src="/path/to/your/geoPosition.min.js">
  <script src="https://maps.google.com/maps/api/js?language=en&key=YOUR-API-KEY>
  <script src="/path/to/your/SLLGeolocation.min.js">
  
  <script>
    SLLGeolocation.init();
  </script>
</body>
```

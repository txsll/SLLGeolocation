# SLLGeolocation
TxSLL's geolocation script used during online patron registration to make sure the patron is physically located in a given area &mdash; *e.g.*, Texas. The code in this repository serves only as a barebones starting point. You would need to integrate this into your website as appropriate and, depending on your needs, include security measures.

For example, if your website has an online registration form, you could initially load that form as disabled and hidden. Once the user geolocates to the correct area, you can enable and display the rest of the form for the user to submit. As part of that submission, you can write code to incorporate the geolocation data received. **That is not included in this library and must be added by you.**

## Requirements
`SLLGeolocation.js` requires both `geoPosition.js` and jQuery. The `geoPosition.js` script serves as a wrapper for the Geolocation API. With it, you are able to support a few more browsers and devices that do not support Geolocation natively. It can also be found at https://github.com/estebanav/javascript-mobile-desktop-geolocation.

The two libraries can be loaded via `<script>` tags before loading the `SLLGeolocation.js` script. Or you can use your own build processes to concatenate and minify the libraries. For convenience, both libraries are also included in this repository in the `vendor/` folder.

`SLLGeolocation.js` also requires you to have a Google Maps API account so that you can load the Google Maps JavaScript API.

You must also serve this script over a secure SSL connection. You cannot use the Geolocation API over an unencrypted HTTP connection. Modern browsers (Chrome and Firefox included) do not allow use of the Geolocation API unless the website is secure and served over HTTPS.

## Usage
`SLLGeolocation.js` expects your page to have three HTML elements as noted below. One is a button that will trigger the geolocation prompt, and the other two are used to store the geolocation results in the elements' `data-` tags and to serve as a placeholder for a Google map showing the user's location.

You then use `SLLGeolocation.init()` to initiate the library. The `init()` function sets up a `click` listener for the geolocation button.

Below is a barebones version of what your HTML page will look like.

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SLLGeolocation.js</title>
</head>
<body>
  <button id="js-get-location-button" disabled>determine my location</button>
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
</html>
```

## Security and Disclaimer

This is not a secure, foolproof method of geolocating a user! That is impossible. Malicious users could bypass your geolocation requirements or spoof geolocation data. You should add other security measures to prevent users from manipulating the form in their browser or manipulating the data to be sent via your form. You should also have server-side security measures when processing the form.

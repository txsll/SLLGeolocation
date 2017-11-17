# SLLGeolocation
TxSLL's geolocation script for online patron registration.

## Requirements
`SLLGeolocation.js` requires both `geoPosition.js` and jQuery. The `geoPosition.js` script serves as a wrapper for the Geolocation API. With it, you are able to support a few more browsers and devices that do not support Geolocation natively. It can also be found at https://github.com/estebanav/javascript-mobile-desktop-geolocation.

The two libraries can be loaded via `<script>` tags before loading the `SLLGeolocation.js` script. Or you can use your own build processes to concatenate and minify the libraries.

For convenience, both libraries are also included in this repository in the `vendor/` folder.

## Usage

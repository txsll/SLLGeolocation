/*!
* SLLGeolocation.js - depends on geoPosition.js
* Author: A. Longoria for the Texas State Law Library
* E-mail: alongoria@sll.texas.gov
*/
var SLLGeolocation = {
  Errors: {
    // Error messages to show to the user.
    NO_GEOLOCATION: 'Unfortunately, geolocation is not available on your computer, device, or web browser. Please try using a different browser or internet connection.',
    PERMISSION_DENIED: 'Your location could not be determined because you or your browser have denied permission. Please review your browser settings to ensure you are not automatically denying all geolocation requests.',
    POSITION_UNAVAILABLE: 'Your position is currently unavailable. Please try again, or use a different internet connection if this problem persists.',
    TIMEOUT: 'Timeout error. There may have been a temporary glitch. Please try again, or use a different internet connection if this problem persists.',
    UNKNOWN_ERROR_CODE: 'Unknown error code. Please try again, or use a different internet connection if this problem persists.',
    UNKNOWN_ERROR: 'An unknown error has occured. Please try again, or use a different internet connection if this problem persists.',
    NOT_IN_TEXAS: 'It looks like you may not be in Texas at the moment. Due to licensing agreements, we are able to offer online registration only to Texas residents who are physically located in Texas. Determining your physical location from your internet connection is not exact. If you feel this is an error, please contact the library.',
    DEFAULT: 'We were unable to determine your location. Please try again, or use a different internet connection if this problem persists.'
  },

  geoSuccess: function (p) {
    // We have received geolocation results in the form of latitude/longitude coordinates.
    // We now have to reverse geocode those coordinates to obtain an address.

    var $geoResults = $('#js-geo-results');
    $geoResults.data('latitude', p.coords.latitude);
    $geoResults.data('longitude', p.coords.longitude);

    var pos = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
    var params = { 'location': pos };
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode(params, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var address = results[0].formatted_address;
          $geoResults.data('geocoded-address', address);

          var myOptions = {
            zoom: 7,
            mapTypeControl: true,
            mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
            navigationControl: true,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
          };

          var map = new google.maps.Map(document.getElementById('js-map-canvas'), myOptions);
          map.setCenter(new google.maps.LatLng($geoResults.data('latitude'), $geoResults.data('longitude')));

          var infowindow = new google.maps.InfoWindow({
            content: address
          });

          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'you are here'
          });

          google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
          });

          // Now test whether the geocoded address is an address in Texas.

          if (SLLGeolocation.isTexas(results[0].address_components)) {
            SLLGeolocation.success(address);
          }
          else {
            SLLGeolocation.geoError(SLLGeolocation.Errors.NOT_IN_TEXAS);
          }
        }
      }
      else {
        SLLGeolocation.geoError('Geocoder failed due to: ' + status + '. Please reload this page and try again. If this problem persists, please contact the library.');
      }
    });
  },

  geoError: function (msg) {
    var $myError = $('<p />', {
      'text': 'Geolocation failed! See the error message below for more details.'
    });

    var message = '';

    if (typeof (msg) === 'object') { // geoPosition.js returns an object when it fails.
      if ('message' in msg && msg.message.length) { // Grab the error message if one is provided.
        if (msg.message.indexOf('This site does not have permission to use the Geolocation API') > -1)
          message = SLLGeolocation.Errors.PERMISSION_DENIED;
        else if (msg.message.indexOf('User denied Geolocation') > -1)
          message = SLLGeolocation.Errors.PERMISSION_DENIED;
        else if (msg.message.indexOf('User denied geolocation prompt') > -1)
          message = SLLGeolocation.Errors.PERMISSION_DENIED;
        else if (msg.message.indexOf('This site doesn\'t have permission to ask for your location') > -1)
          message = SLLGeolocation.Errors.PERMISSION_DENIED;
        else
          message = msg.message;
      }
      else { // For certain browsers, geoPosition.js doesn't return a 'message' variable, only a 'code'.
        if ('code' in msg) {
          if (msg.code === msg.PERMISSION_DENIED)
            message = SLLGeolocation.Errors.PERMISSION_DENIED;
          else if (msg.code === msg.POSITION_UNAVAILABLE)
            message = SLLGeolocation.Errors.POSITION_UNAVAILABLE;
          else if (msg.code === msg.TIMEOUT)
            message = SLLGeolocation.Errors.TIMEOUT;
          else
            message = SLLGeolocation.Errors.UNKNOWN_ERROR_CODE;
        }
        else {
          message = SLLGeolocation.Errors.UNKNOWN_ERROR;
        }
      }
    }
    else {
      if (typeof (msg) === 'string' && msg.length) // Use the provided error message.
        message = msg;
      else
        message = SLLGeolocation.Errors.DEFAULT;
    }

    var $myErrorMessage = $('<p />', {
      'html': message
    });

    var $myHelpMessage = $('<p />', {
      'html': 'If you are physically located in Texas at the moment but are receiving error messages when you try to register, view our troubleshooting page for help. On that page you will find a list of common error messages, what they mean, and how you may resolve the issue.'
    });

    $myGeoResults = $('#js-geo-results');

    $myGeoResults.empty().append($myError).append($myErrorMessage).append($myHelpMessage);

    // Any other actions you wish to take when geolocation fails would be here.
  },

  isTexas: function (address_components) {
    // TODO: You will need to edit this function to test for the location you are wanting to match.
    // Be careful because the geocoded address may come in different formats depending on the accuracy of the geocoding service.
    // For example, sometimes it may only return a city name rather than a full address, or it may return a road name. Sometimes the state's full name is returned, and other times it may be a short name like "TX".

    for (var i = 0, len = address_components.length; i < len; i++) {
      var types = address_components[i].types;
      if (types.length && types[0] === 'administrative_area_level_1') {
        if (address_components[i].long_name && address_components[i].long_name.indexOf('Texas') > -1) {
          return true;
        }
        else if (address_components[i].short_name && address_components[i].short_name.indexOf('TX') > -1) {
          return true;
        }
        break;
      }
    }

    return false;
  },

  success: function (address) {
    if (address) {
      var msg = '<p>You\'re in Texas, yay! See the map below for our best guess of your current location: ' + address + '.</p>';
      $('#js-geo-results').empty().html(msg);
    }
  },

  init: function () {
    var $myGeoResults = ('#js-geo-results');
    var $myButton = $('#js-get-location-button');

    // Remove the 'disabled' property for the button.
    $myButton.prop('disabled', false);

    // Add a listener to the 'click' event for the button. When clicked, show the AJAX GIF to indicate work is occurring in the background then call the geolocation API.
    $myButton.on('click', function () {
      var $ajaxImage = $('<img />', {
        'src': '/images/ajax-loader.gif',
        'alt': 'loading...'
      });

      $myGeoResults.empty().append($ajaxImage);

      if (geoPosition.init()) {
        geoPosition.getCurrentPosition(SLLGeolocation.geoSuccess, SLLGeolocation.geoError, { enableHighAccuracy: true });
      }
      else {
        SLLGeolocation.geoError(SLLGeolocation.Errors.NO_GEOLOCATION);
      }
    });
  }
};
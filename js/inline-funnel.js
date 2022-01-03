

Drupal.behaviors.inlineFunnel = {
  attach: function (context, settings) {

    /**
     * Inject given asset files read from manifest.
     *
     * @param string path
     * @param string type
     * @return void
     */
    function loadFile(path, type){
      if (type === "js"){
        var script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", path);
        document.getElementsByTagName("body")[0].appendChild(script);
      }

      if (type === "css"){
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", path);
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }

    /**
     * Load data from endpoint by given host and path and process result by callback.
     *
     * @param string funnelHost
     * @param string path
     * @param function callback
     * @return void
     */
    function fetchData(funnelHost, path, callback) {
      window.addEventListener('DOMContentLoaded', function(event) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', funnelHost + '/' + path + '?' + Date.now(), true);
        xhr.responseType = 'json';

        xhr.onload = function() {
          var status = xhr.status;

          if (status == 200) {
            var data = xhr.response;

            // IE11 hack. It does not parse it automatically.
            if (typeof data == 'string') {
              data = JSON.parse(data)
            }

            // Pass result to callback function.
            callback(data, funnelHost);
          }
          else {
            console.error('status: ' + status);
          }
        };

        xhr.send();
      });
    }

    /**
     * Load asset files from manifest to initialize react app.
     *
     * @param object data
     * @param string funnelHost
     * @return void
     */
    function processManifest(data, funnelHost) {
      if (data.entrypoints === undefined) {
        console.error('Could not find entrypoints');
        return;
      }
      data.entrypoints.map(function(entry) {
        var extension = entry.split('.').pop();
        loadFile(funnelHost + '/' + entry, extension);
      });
    }

    /**
     * Display a message in the div container for unsupported browsers.
     *
     * @param object data
     * @param string funnelHost
     * @return void
     */
    function unsupportedBrowserDescription(data, funnelHost) {
      if (typeof data.html !== 'undefined') {
        document.getElementById('funnel').innerHTML = data.html;
      }
    }

    /**
     * Check if current browser is whitelisted.
     *
     * @return boolean
     */
    function browserIsSupported() {
      // IE 10 and 11.
      if (/Trident\/|MSIE/.test(window.navigator.userAgent)) {
        return false;
      }

      return true;
    }

    // Initialize funnel host from configuration on Drupal block.
    const funnelHost = settings.inline_funnel.funnel_host;

    // Set variables for the inline funnel to read.
    window.funnelHost = funnelHost;
    window.displayMode = 'inline';
    // Add optional parameters, such as fcon normaly sent through the query string to the funnel.
    window.funnelParams = settings.inline_funnel.funnel_params;

    // Fetch and initialize Verisure inline funnel if browser is supported.
    if (browserIsSupported()) {
      fetchData(funnelHost, 'asset-manifest.json', processManifest);
    }
    // Else fetch and display a message to the users.
    else {
      fetchData(funnelHost, 'browser-not-supported/description', unsupportedBrowserDescription);
    }
  }
};

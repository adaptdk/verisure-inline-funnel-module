

Drupal.behaviors.inlineFunnel = {
  attach: function (context, settings) {
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

    function loadFilesFromManifest(inlineBuildPath) {
      window.addEventListener('DOMContentLoaded', function(event) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', inlineBuildPath + '/asset-manifest.json?' + Date.now(), true);
        xhr.responseType = 'json';

        xhr.onload = function() {
          var status = xhr.status;

          if (status == 200) {
            var data = xhr.response;

            // IE11 hack. It does not parse it automatically.
            if (typeof data == 'string') {
              data = JSON.parse(data)
            }

            // Run through the manifest files and add them to the DOM.
            processManifest(data, inlineBuildPath);
          }
          else {
            console.error('status: ' + status);
          }
        };

        xhr.send();
      });
    }

    function processManifest(data, inlineBuildPath) {
      if (data.entrypoints === undefined) {
        console.error('Could not find entrypoints');
        return;
      }
      data.entrypoints.map(function(entry) {
        var extension = entry.split('.').pop();
        loadFile(inlineBuildPath + '/' + entry, extension);
      });
    }

    /**
     * Fetch and display a message in the div container for unsupported browsers.
     */
    function loadUnsupportedBrowserInfo(funnelHost) {
      window.addEventListener('DOMContentLoaded', function(event) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', funnelHost + '/browser-not-supported/description?' + Date.now(), true);
        xhr.responseType = 'json';

        xhr.onload = function() {
          var status = xhr.status;

          if (status == 200) {
            var data = xhr.response;

            // IE11 hack. It does not parse it automatically.
            if (typeof data == 'string') {
              data = JSON.parse(data)
            }

            document.getElementById('funnel').innerHTML = data.html;
          }
          else {
            console.error('status: ' + status);
          }
        };

        xhr.send();
      });
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

    const funnelHost = settings.inline_funnel.funnel_host;

    // Set variables for the inline funnel to read.
    window.funnelHost = funnelHost;
    window.displayMode = 'inline';

    // Load Verisure inline funnel if browser is supported.
    if (browserIsSupported()) {
      loadFilesFromManifest(funnelHost);
    }
    // Else fetch and display a message to the users.
    else {
      loadUnsupportedBrowserInfo(funnelHost);
    }
  }
};

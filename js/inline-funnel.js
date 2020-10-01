

Drupal.behaviors.inlineFunnel = {
  attach: function (context, settings) {
    function loadFile(path, type){
      if (type === "js"){
        const script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", path);
        document.getElementsByTagName("body")[0].appendChild(script);
      }

      if (type === "css"){
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", path);
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }

    function loadFilesFromManifest(inlineBuildPath) {
      window.addEventListener('DOMContentLoaded', (event) => {
        fetch(`${inlineBuildPath}/asset-manifest.json`)
          .then(response => response.json())
          .then(data => {
            if (data.entrypoints === undefined) {
              console.error('Could not find entrypoints');
              return;
            }
            data.entrypoints.map(entry => {
              const extension = entry.split('.').pop();
              loadFile(`${inlineBuildPath}/${entry}`, extension);
            });
          })
          //.catch(error => console.error(error))
          .catch(function() {
             console.log('error');
          });
      });
    }

    const funnelHost = settings.inline_funnel.funnel_host;

    window.funnelHost = funnelHost;
    window.displayMode = 'inline';

    // Load Verisure inline funnel.
    //loadFilesFromManifest(`${funnelHost}/inline/verisure`);
    loadFilesFromManifest(`${funnelHost}`);
  }
};

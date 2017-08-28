const options = <%= JSON.stringify(options) %>;
let variableNames = [];
let lastSetURL = '';
if (options.length) {
  variableNames = options;
}
else {
  variableNames = Object.keys(options)
}


export default function ({isClient, app, route, isServer, isStatic}) {
  // set the initial state from URL (on server but also on client (in case of static app))
  const initialStateToSet = {}
  for (var i = 0; i < variableNames.length; i++) {
    let field = variableNames[i]
    let value = getParamValue(route.fullPath, field)
    if (value) initialStateToSet[field] = value
  }
  
  if (isStatic) {
    // Set the state after a timeout. Otherwise the initial DOM
    setTimeout(function() {Object.assign(app.store.state, initialStateToSet)}, 100)
  }

  if (isServer) {
    Object.assign(app.store.state, initialStateToSet)
  }
  
  // When running on client, just update the URL whenever the store state changes.
  if (isClient) {
    // Update the URL everytimg the state changes
    for (var i = 0; i < variableNames.length; i++) {
      let field = variableNames[i]
      app.store.watch(function(state, getters) {
        let newUrl = getUrlWithParamValue(field, state[field])
        history.replaceState(null, '', newUrl);
        lastSetURL = newUrl;
      })
    }

    // Monitor the URL and re-add our values if URL has changed
    // TODO: attach to some event instead using a polling interval.
    setInterval(function() {
      if (window.location.toString() == lastSetURL) return;
      for (var i = 0; i < variableNames.length; i++) {
        let field = variableNames[i]
        if (!options[field] || !options[field].persist) continue;
        let newUrl = getUrlWithParamValue(field, app.store.state[field])
        history.replaceState(null, '', newUrl);
      }
      lastSetURL = window.location.toString()
    }, 100)
  
  }

}

const getUrlWithParamValue = function(paramName, paramValue) {
  var pattern, url;
  if (paramValue && typeof(paramValue) == 'object') {
    paramValue = JSON.stringify(paramValue);
  }
  url = window.location.toString();
  pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
  if (url.search(pattern) >= 0) {
    if (!paramValue) return url.replace(pattern, '').replace('&&','&').replace('?&','?');
    else return url.replace(pattern, '$1' + encodeURIComponent(paramValue) + '$2');
  } else {
    if (!paramValue) return url;
    else return (url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + encodeURIComponent(paramValue)).replace('&&','&').replace('?&','?');
  }
};

const getParamValue = function(url, paramName) {
   var pattern, result;
   pattern = new RegExp('\\b' + paramName + '=(.*?)(&|$)');
   result = pattern.exec(url);
   if ((result != null ? result.length : void 0) >= 1) {
     var val = decodeURIComponent(result[1]);
     try {
       val = JSON.parse(val);
     }
     catch (e) {
       // Wasnt json. Do nothing.
     }
     if (val == 'false') return false;
     if (typeof val == 'undefined') return null;
     return val;
   }
 };

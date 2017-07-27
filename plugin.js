const stateToExpose = <%= JSON.stringify(options) %>

export default function ({isClient, app, route}) {
  // When running on client, just update the URL whenever the store state changes.
  if (isClient) {
    for (var i = 0; i < stateToExpose.length; i++) {
      let field = stateToExpose[i]
      app.store.watch(function(state, getters) {
        let newUrl = getUrlWithParamValue(field, state[field])
        history.replaceState(null, '', newUrl);
      })
    }
  }
  // and when running on the server, set the initial state from URL
  // TODO: make this work when app is served from serviceworker in PWA mode
  else {
    const initialStateToSet = {}
    for (var i = 0; i < stateToExpose.length; i++) {
      let field = stateToExpose[i]
      let value = getParamValue(route.fullPath, field)
      if (value) initialStateToSet[field] = value
    }
    Object.assign(app.store.state, initialStateToSet) // TODO: do this with a mutation
    // app.store.commit('SET_STATE_FROM_URL', initialStateToSet)
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

# Nuxt Url Sync

Expose and share store state via the browser URL

## Setup

- Add `nuxt-url-sync` dependency using yarn or npm to your project
- Add `nuxt-url-sync` module to `nuxt.config.js`:
```js
  modules: [
    {
      src: 'nuxt-url-sync',
      options: ['selectedItems', 'openCategories']
    }
  ]
```

The above configuration will watch and expose the value of `selectedItems` and `openCategories` of the Vuex store in the browser URL as query parameters (that means, the browser URL will look something like `mydomain.com?selectedItems=xxx&openCategories=xxx`. Makes for easy sharing of Vuex state with other people.

### Persisting params through navigation

Clicking a link (for example generated with `<nuxt-link :to="{query: {foo: 'bar'}}">`) will remove the exposed parameters from the URL. If you want to persist them through navigation, use the following:

```js
  modules: [
    {
      src: 'nuxt-url-sync',
      options: {
        'selectedItems': {persist: true}, 
        'openCategories': {persist: true}
      }
    }
  ]
```

Nuxt URL sync will monitor the URL in an interval, and re-add the Vuex state value if the URL has changed.


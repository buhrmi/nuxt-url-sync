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

The above configuration will watch and expose the value of `selectedItems` and `openCategories` of the Vuex store in the browser URL.

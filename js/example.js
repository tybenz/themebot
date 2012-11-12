var Example = ThemeBot.extend({
  pattern: /\:([^\/\*\n\:]*)\/\*\{(([^-\}]*)-([^-\}]*)-([^-\}]*))\}\*\/;/g,

  spec: [ "group", "subgroup", "prop"]
});

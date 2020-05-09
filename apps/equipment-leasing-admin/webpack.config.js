const swaggerPlugin = require('@nestjs/swagger/plugin');

module.exports = config => {
  const rule = config.module.rules.find(rule => rule.loader === 'ts-loader');
  if (!rule) throw new Error('no ts-loader rule found');
  rule.options.getCustomTransformers = program => ({
    before: [
      swaggerPlugin.before(
        {
          dtoFileNameSuffix: ['.dto.ts', '.ro.ts', '.entity.ts']
        },
        program
      )
    ]
  });
  return config;
};
console.log('webpaxk')
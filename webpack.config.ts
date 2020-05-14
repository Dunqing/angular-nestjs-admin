// const swaggerPlugin = require('@nestjs/swagger/plugin')

// module.exports = config => {
//   const rule = config.module.rules.find(rule => rule.use[0].loader === 'ts-loader');
//   console.log(config.module.rules[0].use, rule)
//   if (!rule) throw new Error('no ts-loader rule found');
//   rule.use[0].options.getCustomTransformers = program => ({
//     before: [
//       swaggerPlugin.before({
//           dtoFileNameSuffix: ['.dto.ts', '.ro.ts', '.entity.ts']
//         },
//         program
//       )
//     ]
//   });
//   return config;
// };
// console.log('webpaxk')

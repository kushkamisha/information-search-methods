require('dotenv').config();
const prompts = require('prompts');
const { query } = require('./database');



async function main() {
  // const name = 'adolf deh';
  // const limit = 3;

  const { name, limit } = await prompts([{
    type: 'text',
    name: 'name',
    message: 'Artist name?',
  }, {
    type: 'number',
    name: 'limit',
    message: 'Search limit?',
    default: 5,
  }]);

  console.log({ name, limit });

  const res = await query(`
  SELECT * FROM artists
  WHERE metaphone(name,6) % metaphone($1,6)
  ORDER BY levenshtein(lower($1), lower(name))
  limit $2;`, [name, limit]);
  console.log(res);
}

main();

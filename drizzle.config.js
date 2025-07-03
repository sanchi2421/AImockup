/**@type { import("drizzle-kit").Config } */
export default {
    schema : './utils/schema.js' ,
    dialect: 'postgresql' ,
    dbCredentials: {
    url: 'postgresql://neondb_owner:npg_5cAHoU8pnaNT@ep-frosty-term-a87ujjb9-pooler.eastus2.azure.neon.tech/projectx?sslmode=require'
}
};

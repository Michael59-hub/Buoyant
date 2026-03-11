// // scripts/export-sqlite.js
// const { PrismaClient } = require('./generated/prisma/client');
// const fs = require('fs');

// const prisma = new PrismaClient();

// async function main() {
//   // Replace 'user' and 'post' with your actual model names
//   const users = await prisma.user.findMany();
//   const products = await prisma.product.findMany();
//   const orders = await prisma.order.findMany();
//   const downloadVerifications = await prisma.downloadVerification.findMany();


//   const data = { users, products, orders, downloadVerifications };

//   fs.writeFileSync('db-dump.json', JSON.stringify(data, null, 2));
//   console.log('✅ SQLite data exported to db-dump.json');
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());


async function passwordHasher(password){
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))
    return Buffer.from(arrayBuffer).toString("base64");
}

passwordHasher("12345").then(hash => console.log(hash));
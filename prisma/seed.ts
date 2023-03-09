import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from 'bcrypt';
import * as csv from 'csvtojson';

const SALT_PASSWORD = 12;

async function main() {
  await csv()
    .fromFile(__dirname + '/data/users.csv')
    .then(async (users) => {
      for (const user of users) {
        await hash(user.password, SALT_PASSWORD, async function (err, hash) {
          user.password = hash;
          await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user,
          });
        });
      }
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

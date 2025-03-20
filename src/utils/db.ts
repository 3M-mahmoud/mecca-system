// // use code deploy

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;



// use code development

// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

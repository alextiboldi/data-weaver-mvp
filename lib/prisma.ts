// prismaClient.ts
import { PrismaClient } from "@prisma/client";
// import { withOptimize } from "@prisma/extension-optimize";

class PrismaSingleton {
  private static prisma: PrismaClient;

  /**
   * Initializes and configures the PrismaClient with the optimize extension.
   */
  private static initialize(): PrismaClient {
    const prisma = new PrismaClient({
      log: ["info", "error"], // Customize logging levels as needed "query", "info", "warn", "error"
    });

    // Apply the withOptimize extension
    // return prisma.$extends(
    //   withOptimize({ apiKey: process.env.PRISMA_OPTIMIZE_API_KEY || "" })
    // ) as PrismaClient;

    return prisma;
  }

  /**
   * Provides a singleton instance of the PrismaClient.
   * Ensures only one instance of the client exists across the application.
   */
  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.prisma) {
      PrismaSingleton.prisma = PrismaSingleton.initialize();
    }
    return PrismaSingleton.prisma;
  }

  /**
   * Gracefully closes the Prisma connection when the application shuts down.
   */
  public static async closeConnection(): Promise<void> {
    if (PrismaSingleton.prisma) {
      await PrismaSingleton.prisma.$disconnect();
    }
  }
}

// Example usage: Export the singleton instance for application-wide use
export const prisma = PrismaSingleton.getInstance();

// Optionally handle application shutdown to close the Prisma connection
process.on("SIGINT", async () => {
  await PrismaSingleton.closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await PrismaSingleton.closeConnection();
  process.exit(0);
});

//############

// import { PrismaClient } from "@prisma/client";
// import { withOptimize } from "@prisma/extension-optimize";

// const getPrismaClient = () => {
//   const prisma = new PrismaClient();

//   return prisma.$extends(
//     withOptimize({
//       apiKey: process.env.PRISMA_OPTIMIZE_API_KEY!,
//     })
//   ) as PrismaClient;
// };

// // @ts-ignore
// export const prisma = global.prisma || getPrismaClient();
// if (process.env.NODE_ENV !== "production") {
//   // @ts-ignore
//   global.prisma = prisma;
// }

//############

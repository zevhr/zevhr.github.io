import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        reviewContents: z.string().min(1),
        type: z.string().min(1),
        image: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          reviewContents: input.reviewContents,
          type: input.type,
          image: input.image,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getOne: publicProcedure
  .input(String)
  .query(({ ctx, input }) => {
    return ctx.db.post.findFirst({
      where: { name: input },
    });
  }),

  getAll: publicProcedure
  .query(({ctx}) => {
    return ctx.db.post.findMany()
  }),

  getAllOfType: publicProcedure
  .input(String)
  .query(({ctx, input}) => {
    return ctx.db.post.findMany({
      where: { type: input }
    })
  })
});

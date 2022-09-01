import { extendType, idArg, nonNull, objectType, stringArg } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field('postedBy', {
      type: 'User',
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id }})
          .postedBy();
      }
    });
    t.nonNull.list.nonNull.field('voters', {
      type: 'User',
      resolve(parent, args, context, info) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id }})
          .voters();
      }
    })
  }
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      }
    });

    t.nullable.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg())
      },
      resolve(parent, args, context, info) {
        return context.prisma.link.findUnique({
          where: {
            id: Number(args.id)
          }
        });
      }
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field('post', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error('Cannot post without logging in.');
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: {
              connect: { id: userId }
            }
          }
        })
        return newLink;
      }
    });

    t.nonNull.field('updateLink', {
      type: 'Link',
      args: {
        id: nonNull(idArg()),
        description: stringArg(),
        url: stringArg()
      },
      resolve(parent, args, context) {
        const { id, description, url } = args;
        const linkToUpdate = context.prisma.link.update({
          where: {
            id: Number(args.id)
          },
          data: {
            description: description || undefined,
            url: url || undefined
          }
        });
        return linkToUpdate;
      }
    });

    t.nonNull.field('deleteLink', {
      type: 'Link',
      args: {
        id: nonNull(idArg())
      },
      resolve(parent, args, context) {
        const removedItem = context.prisma.link.delete({
          where: {
            id: Number(args.id)
          }
        })
        return removedItem;
      }
    });
  },
});


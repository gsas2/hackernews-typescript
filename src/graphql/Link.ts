import { argsToArgsConfig } from "graphql/type/definition";
import { extendType, idArg, intArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from '../../nexus-typegen';

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
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
    })
  },
});

export const LinkDetail = extendType({
  type: "Query",
  definition(t) {
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
    })
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
        const newLink = context.prisma.link.create({
          data: {
            description,
            url
          }
        })
        return newLink;
      }
    });
  },
});

export const LinkUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
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
  },
});


export const LinkDeleteMutation = extendType({
  type: "Mutation",
  definition(t) {
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

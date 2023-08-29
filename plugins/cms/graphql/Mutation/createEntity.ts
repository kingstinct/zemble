import type { Entity, MutationResolvers } from '../schema.generated'

const createEntity: MutationResolvers['createEntity'] = async (_, { name }, { kv, pubsub }) => {
  const entity: Entity = {
    name,
    fields: [
      {
        // @ts-expect-error asdasd f
        __typename: 'IDField',
        isRequired: true,
        name: 'id',
      },
    ],
  }

  await kv('cms-entities').set(name, entity)

  pubsub.publish('reload-schema', {})

  return entity
}

export default createEntity

import { ObjectId } from 'mongodb'

import { Eatables } from '../../models'

import type { Ingredient } from '../../models'
import type {
  MutationResolvers,
} from '../schema.generated'
import type { WithoutId } from 'mongodb'

export const addIngredient: NonNullable<MutationResolvers['addIngredient']> = async (_, {
  title, imageUrls, nutrientsPer100g, servingSizes, ingredientId,
}, { logger }) => {
  const _id = ingredientId ? new ObjectId(ingredientId) : new ObjectId()
  const ingredient: WithoutId<typeof Ingredient> = {
    __typename: 'Ingredient',
    title,
    images: imageUrls?.map((url) => ({ url })) ?? [],
    servingSizes: servingSizes?.map((s) => s) ?? [],
    nutrientsPer100g: nutrientsPer100g?.map(({ nutrient, amountInGrams }) => ({
      nutrient,
      amountInGrams,
    })) ?? [],
  }

  logger.info(ingredient)

  const eatable = await Eatables.findOneAndUpdate({ _id }, {
    $set: ingredient,
    $setOnInsert: { _id },
  }, { upsert: true, returnDocument: 'after' })

  if (!eatable) {
    throw new Error('Could not add ingredient')
  }

  return { ...eatable, ...ingredient }
}

export default addIngredient

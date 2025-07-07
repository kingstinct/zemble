import { schema, types } from 'papr'

import papr from './clients/papr'
import {
  IntakeTime,
  QuantityType,
  ServingSizeType,
} from './graphql/schema.generated'

const NutrientQuantity = types.object({
  nutrient: types.enum(Object.values(QuantityType), { required: true }),
  amountInGrams: types.number({ required: true }),
})

const Image = types.object({
  url: types.string({ required: true }),
})

const ServingSize = types.object({
  type: types.enum(Object.values(ServingSizeType), { required: true }),
  amountInGrams: types.number({ required: true }),
})

enum EatableType {
  Ingredient = 'Ingredient',
  Food = 'Food',
}

const EatableProportion = types.object({
  proportion: types.number({ required: true }),
  eatableId: types.objectId({ required: true }),
})

const baseEatable = {
  _id: types.objectId({ required: true }),
  title: types.string({ required: true }),
  images: types.array(Image, { required: true }),
  servingSizes: types.array(ServingSize, { required: true }),
}

export const Ingredient = types.object(
  {
    __typename: types.string({ required: true }) as `Ingredient`,
    ...baseEatable,
    nutrientsPer100g: types.array(NutrientQuantity, { required: true }),
  },
  { required: true },
)

export const Food = types.object(
  {
    __typename: types.string({ required: true }) as `Food`,
    ...baseEatable,
    ingredients: types.array(EatableProportion, { required: true }),
  },
  { required: true },
)

export const EatableDbType = schema(
  {
    __typename: types.string({
      required: true,
      enum: Object.values(EatableType),
    }) as `Ingredient` | `Food`,
    ...baseEatable,
    nutrientsPer100g: types.array(NutrientQuantity, { required: false }),
    ingredients: types.array(EatableProportion, { required: false }),
  },
  {
    timestamps: true,
  },
)

export type EatableDbType = (typeof EatableDbType)[0]

export const Eatables = papr.model('eatables', EatableDbType)

export const SupplementIntakeDbType = schema(
  {
    _id: types.objectId({ required: true }),
    amountInGrams: types.number({ required: true }),
    foodId: types.objectId({ required: true }),
    intakeTime: types.enum(Object.values(IntakeTime), { required: true }),
    userId: types.objectId({ required: true }),
  },
  {
    timestamps: true,
  },
)

export type SupplementIntakeDbType = (typeof SupplementIntakeDbType)[0]

export const Supplements = papr.model(
  'supplement-intakes',
  SupplementIntakeDbType,
)

export const UserDbType = schema(
  {
    _id: types.objectId({ required: true }),
    email: types.string({ required: true }),
    lastLoginAt: types.date({ required: true }),
    firstLoginAt: types.date({ required: true }),
  },
  {
    timestamps: true,
  },
)

export const Users = papr.model('users', UserDbType)

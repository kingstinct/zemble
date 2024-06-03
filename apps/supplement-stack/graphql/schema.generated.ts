// @ts-nocheck
import '@zemble/core'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { EatableDbType, SupplementIntakeDbType } from '../models';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  ObjectId: { input: string; output: string; }
};

export type Eatable = {
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type EatableProportion = {
  readonly __typename?: 'EatableProportion';
  readonly eatable: Eatable;
  readonly eatableId: Scalars['ObjectId']['output'];
  readonly proportion: Scalars['Float']['output'];
};

export type EatableProportionInput = {
  readonly eatableId: Scalars['ObjectId']['input'];
  readonly proportion: Scalars['Float']['input'];
};

export type Food = Eatable & {
  readonly __typename?: 'Food';
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly ingredients: ReadonlyArray<EatableProportion>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type Image = {
  readonly __typename?: 'Image';
  readonly url: Scalars['String']['output'];
};

export type Ingredient = Eatable & {
  readonly __typename?: 'Ingredient';
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export enum IntakeTime {
  Bedtime = 'BEDTIME',
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Wakeup = 'WAKEUP'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addFood: Food;
  readonly addIngredient: Ingredient;
  readonly addSupplement: SupplementIntake;
};


export type MutationAddFoodArgs = {
  foodId?: InputMaybe<Scalars['ObjectId']['input']>;
  imageUrls?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  ingredients?: InputMaybe<ReadonlyArray<EatableProportionInput>>;
  servingSizes?: InputMaybe<ReadonlyArray<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddIngredientArgs = {
  imageUrls?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  ingredientId?: InputMaybe<Scalars['ObjectId']['input']>;
  nutrientsPer100g?: InputMaybe<ReadonlyArray<NutrientQuantityInput>>;
  servingSizes?: InputMaybe<ReadonlyArray<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddSupplementArgs = {
  amountInGrams: Scalars['Float']['input'];
  foodId: Scalars['ObjectId']['input'];
  intakeTime: IntakeTime;
  supplementId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type NutrientQuantity = {
  readonly __typename?: 'NutrientQuantity';
  readonly amountInGrams: Scalars['Float']['output'];
  readonly nutrient: QuantityType;
};

export type NutrientQuantityInput = {
  readonly amountInGrams: Scalars['Float']['input'];
  readonly nutrient: QuantityType;
};

export enum QuantityType {
  SubjectiveCarbAmount = 'SUBJECTIVE_CARB_AMOUNT',
  SubjectiveEnergyLevel = 'SUBJECTIVE_ENERGY_LEVEL',
  SubjectiveMealSize = 'SUBJECTIVE_MEAL_SIZE',
  SubjectiveMoodLevel = 'SUBJECTIVE_MOOD_LEVEL',
  SubjectiveSleepQuality = 'SUBJECTIVE_SLEEP_QUALITY',
  SubjectiveStressLevel = 'SUBJECTIVE_STRESS_LEVEL',
  SubjectiveWorkoutPerformance = 'SUBJECTIVE_WORKOUT_PERFORMANCE',
  ActiveEnergyBurned = 'activeEnergyBurned',
  AppleExerciseTime = 'appleExerciseTime',
  AppleMoveTime = 'appleMoveTime',
  AppleSleepingWristTemperature = 'appleSleepingWristTemperature',
  AppleStandTime = 'appleStandTime',
  AppleWalkingSteadiness = 'appleWalkingSteadiness',
  AtrialFibrillationBurden = 'atrialFibrillationBurden',
  BasalBodyTemperature = 'basalBodyTemperature',
  BasalEnergyBurned = 'basalEnergyBurned',
  BloodAlcoholContent = 'bloodAlcoholContent',
  BloodGlucose = 'bloodGlucose',
  BloodPressureDiastolic = 'bloodPressureDiastolic',
  BloodPressureSystolic = 'bloodPressureSystolic',
  BodyFatPercentage = 'bodyFatPercentage',
  BodyMass = 'bodyMass',
  BodyMassIndex = 'bodyMassIndex',
  BodyTemperature = 'bodyTemperature',
  CyclingCadence = 'cyclingCadence',
  CyclingFunctionalThresholdPower = 'cyclingFunctionalThresholdPower',
  CyclingPower = 'cyclingPower',
  CyclingSpeed = 'cyclingSpeed',
  DietaryBiotin = 'dietaryBiotin',
  DietaryCaffeine = 'dietaryCaffeine',
  DietaryCalcium = 'dietaryCalcium',
  DietaryCarbohydrates = 'dietaryCarbohydrates',
  DietaryChloride = 'dietaryChloride',
  DietaryCholesterol = 'dietaryCholesterol',
  DietaryChromium = 'dietaryChromium',
  DietaryCopper = 'dietaryCopper',
  DietaryEnergyConsumed = 'dietaryEnergyConsumed',
  DietaryFatMonounsaturated = 'dietaryFatMonounsaturated',
  DietaryFatPolyunsaturated = 'dietaryFatPolyunsaturated',
  DietaryFatSaturated = 'dietaryFatSaturated',
  DietaryFatTotal = 'dietaryFatTotal',
  DietaryFiber = 'dietaryFiber',
  DietaryFolate = 'dietaryFolate',
  DietaryIodine = 'dietaryIodine',
  DietaryIron = 'dietaryIron',
  DietaryMagnesium = 'dietaryMagnesium',
  DietaryManganese = 'dietaryManganese',
  DietaryMolybdenum = 'dietaryMolybdenum',
  DietaryNiacin = 'dietaryNiacin',
  DietaryPantothenicAcid = 'dietaryPantothenicAcid',
  DietaryPhosphorus = 'dietaryPhosphorus',
  DietaryPotassium = 'dietaryPotassium',
  DietaryProtein = 'dietaryProtein',
  DietaryRiboflavin = 'dietaryRiboflavin',
  DietarySelenium = 'dietarySelenium',
  DietarySodium = 'dietarySodium',
  DietarySugar = 'dietarySugar',
  DietaryThiamin = 'dietaryThiamin',
  DietaryVitaminA = 'dietaryVitaminA',
  DietaryVitaminB6 = 'dietaryVitaminB6',
  DietaryVitaminB12 = 'dietaryVitaminB12',
  DietaryVitaminC = 'dietaryVitaminC',
  DietaryVitaminD = 'dietaryVitaminD',
  DietaryVitaminE = 'dietaryVitaminE',
  DietaryVitaminK = 'dietaryVitaminK',
  DietaryWater = 'dietaryWater',
  DietaryZinc = 'dietaryZinc',
  DistanceCycling = 'distanceCycling',
  DistanceDownhillSnowSports = 'distanceDownhillSnowSports',
  DistanceSwimming = 'distanceSwimming',
  DistanceWalkingRunning = 'distanceWalkingRunning',
  DistanceWheelchair = 'distanceWheelchair',
  ElectrodermalActivity = 'electrodermalActivity',
  EnvironmentalAudioExposure = 'environmentalAudioExposure',
  EnvironmentalSoundReduction = 'environmentalSoundReduction',
  FlightsClimbed = 'flightsClimbed',
  ForcedExpiratoryVolume1 = 'forcedExpiratoryVolume1',
  ForcedVitalCapacity = 'forcedVitalCapacity',
  HeadphoneAudioExposure = 'headphoneAudioExposure',
  HeartRate = 'heartRate',
  HeartRateRecoveryOneMinute = 'heartRateRecoveryOneMinute',
  HeartRateVariabilitySdnn = 'heartRateVariabilitySDNN',
  Height = 'height',
  InhalerUsage = 'inhalerUsage',
  InsulinDeliveryBasal = 'insulinDeliveryBasal',
  InsulinDeliveryBolus = 'insulinDeliveryBolus',
  LeanBodyMass = 'leanBodyMass',
  NikeFuel = 'nikeFuel',
  NumberOfAlcoholicBeverages = 'numberOfAlcoholicBeverages',
  NumberOfTimesFallen = 'numberOfTimesFallen',
  OxygenSaturation = 'oxygenSaturation',
  PeakExpiratoryFlowRate = 'peakExpiratoryFlowRate',
  PeripheralPerfusionIndex = 'peripheralPerfusionIndex',
  PhysicalEffort = 'physicalEffort',
  PushCount = 'pushCount',
  RespiratoryRate = 'respiratoryRate',
  RestingHeartRate = 'restingHeartRate',
  ScreenTime = 'screenTime',
  SixMinuteWalkTestDistance = 'sixMinuteWalkTestDistance',
  StairAscentSpeed = 'stairAscentSpeed',
  StairDescentSpeed = 'stairDescentSpeed',
  StepCount = 'stepCount',
  SwimmingStrokeCount = 'swimmingStrokeCount',
  TimeAsleep = 'timeAsleep',
  TimeInDaylight = 'timeInDaylight',
  UnderwaterDepth = 'underwaterDepth',
  UvExposure = 'uvExposure',
  Vo2Max = 'vo2Max',
  WaistCircumference = 'waistCircumference',
  WalkingAsymmetryPercentage = 'walkingAsymmetryPercentage',
  WalkingDoubleSupportPercentage = 'walkingDoubleSupportPercentage',
  WalkingHeartRateAverage = 'walkingHeartRateAverage',
  WalkingSpeed = 'walkingSpeed',
  WalkingStepLength = 'walkingStepLength',
  WaterTemperature = 'waterTemperature'
}

export type Query = {
  readonly __typename?: 'Query';
  readonly mySupplementIntakes: ReadonlyArray<SupplementIntake>;
  readonly searchEatables: ReadonlyArray<Eatable>;
};


export type QuerySearchEatablesArgs = {
  query: Scalars['String']['input'];
};

export type ServingSize = {
  readonly __typename?: 'ServingSize';
  readonly amountInGrams: Scalars['Float']['output'];
  readonly type: ServingSizeType;
};

export type ServingSizeInput = {
  readonly amountInGrams: Scalars['Float']['input'];
  readonly type: ServingSizeType;
};

export enum ServingSizeType {
  Standard = 'STANDARD'
}

export type SupplementIntake = {
  readonly __typename?: 'SupplementIntake';
  readonly _id: Scalars['ObjectId']['output'];
  readonly amountInGrams: Scalars['Float']['output'];
  readonly food: Food;
  readonly foodId: Scalars['ObjectId']['output'];
  readonly intakeTime: IntakeTime;
};

export enum UnitInternal {
  Celsius = 'CELSIUS',
  Count = 'COUNT',
  CountPerMinute = 'COUNT_PER_MINUTE',
  DecibelSoundPressureLevel = 'DECIBEL_SOUND_PRESSURE_LEVEL',
  Gram = 'GRAM',
  InternationalUnit = 'INTERNATIONAL_UNIT',
  Kilocalorie = 'KILOCALORIE',
  MeterPerSecond = 'METER_PER_SECOND',
  Milliliter = 'MILLILITER',
  MillilitrePerKilogramPerMinute = 'MILLILITRE_PER_KILOGRAM_PER_MINUTE',
  Millimeter = 'MILLIMETER',
  MillimetreOfMercury = 'MILLIMETRE_OF_MERCURY',
  MillimolPerLiter = 'MILLIMOL_PER_LITER',
  MillimolPerMol = 'MILLIMOL_PER_MOL',
  Millisecond = 'MILLISECOND',
  Percent = 'PERCENT'
}

export type User = {
  readonly __typename?: 'User';
  readonly _id: Scalars['ObjectId']['output'];
  readonly email: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Eatable: ResolverTypeWrapper<EatableDbType>;
  EatableProportion: ResolverTypeWrapper<Omit<EatableProportion, 'eatable'> & { eatable: ResolversTypes['Eatable'] }>;
  EatableProportionInput: EatableProportionInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Food: ResolverTypeWrapper<EatableDbType>;
  Image: ResolverTypeWrapper<Image>;
  Ingredient: ResolverTypeWrapper<EatableDbType>;
  IntakeTime: IntakeTime;
  Mutation: ResolverTypeWrapper<{}>;
  NutrientQuantity: ResolverTypeWrapper<NutrientQuantity>;
  NutrientQuantityInput: NutrientQuantityInput;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  QuantityType: QuantityType;
  Query: ResolverTypeWrapper<{}>;
  ServingSize: ResolverTypeWrapper<ServingSize>;
  ServingSizeInput: ServingSizeInput;
  ServingSizeType: ServingSizeType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SupplementIntake: ResolverTypeWrapper<SupplementIntakeDbType>;
  UnitInternal: UnitInternal;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Eatable: EatableDbType;
  EatableProportion: Omit<EatableProportion, 'eatable'> & { eatable: ResolversParentTypes['Eatable'] };
  EatableProportionInput: EatableProportionInput;
  Float: Scalars['Float']['output'];
  Food: EatableDbType;
  Image: Image;
  Ingredient: EatableDbType;
  Mutation: {};
  NutrientQuantity: NutrientQuantity;
  NutrientQuantityInput: NutrientQuantityInput;
  ObjectId: Scalars['ObjectId']['output'];
  Query: {};
  ServingSize: ServingSize;
  ServingSizeInput: ServingSizeInput;
  String: Scalars['String']['output'];
  SupplementIntake: SupplementIntakeDbType;
  User: User;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EatableResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Eatable'] = ResolversParentTypes['Eatable']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Food' | 'Ingredient', ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type EatableProportionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EatableProportion'] = ResolversParentTypes['EatableProportion']> = ResolversObject<{
  eatable?: Resolver<ResolversTypes['Eatable'], ParentType, ContextType>;
  eatableId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  proportion?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FoodResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Food'] = ResolversParentTypes['Food']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  ingredients?: Resolver<ReadonlyArray<ResolversTypes['EatableProportion']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFood?: Resolver<ResolversTypes['Food'], ParentType, ContextType, RequireFields<MutationAddFoodArgs, 'title'>>;
  addIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationAddIngredientArgs, 'title'>>;
  addSupplement?: Resolver<ResolversTypes['SupplementIntake'], ParentType, ContextType, RequireFields<MutationAddSupplementArgs, 'amountInGrams' | 'foodId' | 'intakeTime'>>;
}>;

export type NutrientQuantityResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NutrientQuantity'] = ResolversParentTypes['NutrientQuantity']> = ResolversObject<{
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nutrient?: Resolver<ResolversTypes['QuantityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  mySupplementIntakes?: Resolver<ReadonlyArray<ResolversTypes['SupplementIntake']>, ParentType, ContextType>;
  searchEatables?: Resolver<ReadonlyArray<ResolversTypes['Eatable']>, ParentType, ContextType, RequireFields<QuerySearchEatablesArgs, 'query'>>;
}>;

export type ServingSizeResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['ServingSize'] = ResolversParentTypes['ServingSize']> = ResolversObject<{
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ServingSizeType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SupplementIntakeResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['SupplementIntake'] = ResolversParentTypes['SupplementIntake']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  food?: Resolver<ResolversTypes['Food'], ParentType, ContextType>;
  foodId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  intakeTime?: Resolver<ResolversTypes['IntakeTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  Eatable?: EatableResolvers<ContextType>;
  EatableProportion?: EatableProportionResolvers<ContextType>;
  Food?: FoodResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NutrientQuantity?: NutrientQuantityResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ServingSize?: ServingSizeResolvers<ContextType>;
  SupplementIntake?: SupplementIntakeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  ObjectId: { input: string; output: string; }
};

export type Eatable = {
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type EatableProportion = {
  readonly __typename?: 'EatableProportion';
  readonly eatable: Eatable;
  readonly eatableId: Scalars['ObjectId']['output'];
  readonly proportion: Scalars['Float']['output'];
};

export type EatableProportionInput = {
  readonly eatableId: Scalars['ObjectId']['input'];
  readonly proportion: Scalars['Float']['input'];
};

export type Food = Eatable & {
  readonly __typename?: 'Food';
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly ingredients: ReadonlyArray<EatableProportion>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type Image = {
  readonly __typename?: 'Image';
  readonly url: Scalars['String']['output'];
};

export type Ingredient = Eatable & {
  readonly __typename?: 'Ingredient';
  readonly _id: Scalars['ObjectId']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly images: ReadonlyArray<Image>;
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly servingSizes: ReadonlyArray<ServingSize>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export enum IntakeTime {
  Bedtime = 'BEDTIME',
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Wakeup = 'WAKEUP'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addFood: Food;
  readonly addIngredient: Ingredient;
  readonly addSupplement: SupplementIntake;
};


export type MutationAddFoodArgs = {
  foodId?: InputMaybe<Scalars['ObjectId']['input']>;
  imageUrls?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  ingredients?: InputMaybe<ReadonlyArray<EatableProportionInput>>;
  servingSizes?: InputMaybe<ReadonlyArray<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddIngredientArgs = {
  imageUrls?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  ingredientId?: InputMaybe<Scalars['ObjectId']['input']>;
  nutrientsPer100g?: InputMaybe<ReadonlyArray<NutrientQuantityInput>>;
  servingSizes?: InputMaybe<ReadonlyArray<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddSupplementArgs = {
  amountInGrams: Scalars['Float']['input'];
  foodId: Scalars['ObjectId']['input'];
  intakeTime: IntakeTime;
  supplementId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type NutrientQuantity = {
  readonly __typename?: 'NutrientQuantity';
  readonly amountInGrams: Scalars['Float']['output'];
  readonly nutrient: QuantityType;
};

export type NutrientQuantityInput = {
  readonly amountInGrams: Scalars['Float']['input'];
  readonly nutrient: QuantityType;
};

export enum QuantityType {
  SubjectiveCarbAmount = 'SUBJECTIVE_CARB_AMOUNT',
  SubjectiveEnergyLevel = 'SUBJECTIVE_ENERGY_LEVEL',
  SubjectiveMealSize = 'SUBJECTIVE_MEAL_SIZE',
  SubjectiveMoodLevel = 'SUBJECTIVE_MOOD_LEVEL',
  SubjectiveSleepQuality = 'SUBJECTIVE_SLEEP_QUALITY',
  SubjectiveStressLevel = 'SUBJECTIVE_STRESS_LEVEL',
  SubjectiveWorkoutPerformance = 'SUBJECTIVE_WORKOUT_PERFORMANCE',
  ActiveEnergyBurned = 'activeEnergyBurned',
  AppleExerciseTime = 'appleExerciseTime',
  AppleMoveTime = 'appleMoveTime',
  AppleSleepingWristTemperature = 'appleSleepingWristTemperature',
  AppleStandTime = 'appleStandTime',
  AppleWalkingSteadiness = 'appleWalkingSteadiness',
  AtrialFibrillationBurden = 'atrialFibrillationBurden',
  BasalBodyTemperature = 'basalBodyTemperature',
  BasalEnergyBurned = 'basalEnergyBurned',
  BloodAlcoholContent = 'bloodAlcoholContent',
  BloodGlucose = 'bloodGlucose',
  BloodPressureDiastolic = 'bloodPressureDiastolic',
  BloodPressureSystolic = 'bloodPressureSystolic',
  BodyFatPercentage = 'bodyFatPercentage',
  BodyMass = 'bodyMass',
  BodyMassIndex = 'bodyMassIndex',
  BodyTemperature = 'bodyTemperature',
  CyclingCadence = 'cyclingCadence',
  CyclingFunctionalThresholdPower = 'cyclingFunctionalThresholdPower',
  CyclingPower = 'cyclingPower',
  CyclingSpeed = 'cyclingSpeed',
  DietaryBiotin = 'dietaryBiotin',
  DietaryCaffeine = 'dietaryCaffeine',
  DietaryCalcium = 'dietaryCalcium',
  DietaryCarbohydrates = 'dietaryCarbohydrates',
  DietaryChloride = 'dietaryChloride',
  DietaryCholesterol = 'dietaryCholesterol',
  DietaryChromium = 'dietaryChromium',
  DietaryCopper = 'dietaryCopper',
  DietaryEnergyConsumed = 'dietaryEnergyConsumed',
  DietaryFatMonounsaturated = 'dietaryFatMonounsaturated',
  DietaryFatPolyunsaturated = 'dietaryFatPolyunsaturated',
  DietaryFatSaturated = 'dietaryFatSaturated',
  DietaryFatTotal = 'dietaryFatTotal',
  DietaryFiber = 'dietaryFiber',
  DietaryFolate = 'dietaryFolate',
  DietaryIodine = 'dietaryIodine',
  DietaryIron = 'dietaryIron',
  DietaryMagnesium = 'dietaryMagnesium',
  DietaryManganese = 'dietaryManganese',
  DietaryMolybdenum = 'dietaryMolybdenum',
  DietaryNiacin = 'dietaryNiacin',
  DietaryPantothenicAcid = 'dietaryPantothenicAcid',
  DietaryPhosphorus = 'dietaryPhosphorus',
  DietaryPotassium = 'dietaryPotassium',
  DietaryProtein = 'dietaryProtein',
  DietaryRiboflavin = 'dietaryRiboflavin',
  DietarySelenium = 'dietarySelenium',
  DietarySodium = 'dietarySodium',
  DietarySugar = 'dietarySugar',
  DietaryThiamin = 'dietaryThiamin',
  DietaryVitaminA = 'dietaryVitaminA',
  DietaryVitaminB6 = 'dietaryVitaminB6',
  DietaryVitaminB12 = 'dietaryVitaminB12',
  DietaryVitaminC = 'dietaryVitaminC',
  DietaryVitaminD = 'dietaryVitaminD',
  DietaryVitaminE = 'dietaryVitaminE',
  DietaryVitaminK = 'dietaryVitaminK',
  DietaryWater = 'dietaryWater',
  DietaryZinc = 'dietaryZinc',
  DistanceCycling = 'distanceCycling',
  DistanceDownhillSnowSports = 'distanceDownhillSnowSports',
  DistanceSwimming = 'distanceSwimming',
  DistanceWalkingRunning = 'distanceWalkingRunning',
  DistanceWheelchair = 'distanceWheelchair',
  ElectrodermalActivity = 'electrodermalActivity',
  EnvironmentalAudioExposure = 'environmentalAudioExposure',
  EnvironmentalSoundReduction = 'environmentalSoundReduction',
  FlightsClimbed = 'flightsClimbed',
  ForcedExpiratoryVolume1 = 'forcedExpiratoryVolume1',
  ForcedVitalCapacity = 'forcedVitalCapacity',
  HeadphoneAudioExposure = 'headphoneAudioExposure',
  HeartRate = 'heartRate',
  HeartRateRecoveryOneMinute = 'heartRateRecoveryOneMinute',
  HeartRateVariabilitySdnn = 'heartRateVariabilitySDNN',
  Height = 'height',
  InhalerUsage = 'inhalerUsage',
  InsulinDeliveryBasal = 'insulinDeliveryBasal',
  InsulinDeliveryBolus = 'insulinDeliveryBolus',
  LeanBodyMass = 'leanBodyMass',
  NikeFuel = 'nikeFuel',
  NumberOfAlcoholicBeverages = 'numberOfAlcoholicBeverages',
  NumberOfTimesFallen = 'numberOfTimesFallen',
  OxygenSaturation = 'oxygenSaturation',
  PeakExpiratoryFlowRate = 'peakExpiratoryFlowRate',
  PeripheralPerfusionIndex = 'peripheralPerfusionIndex',
  PhysicalEffort = 'physicalEffort',
  PushCount = 'pushCount',
  RespiratoryRate = 'respiratoryRate',
  RestingHeartRate = 'restingHeartRate',
  ScreenTime = 'screenTime',
  SixMinuteWalkTestDistance = 'sixMinuteWalkTestDistance',
  StairAscentSpeed = 'stairAscentSpeed',
  StairDescentSpeed = 'stairDescentSpeed',
  StepCount = 'stepCount',
  SwimmingStrokeCount = 'swimmingStrokeCount',
  TimeAsleep = 'timeAsleep',
  TimeInDaylight = 'timeInDaylight',
  UnderwaterDepth = 'underwaterDepth',
  UvExposure = 'uvExposure',
  Vo2Max = 'vo2Max',
  WaistCircumference = 'waistCircumference',
  WalkingAsymmetryPercentage = 'walkingAsymmetryPercentage',
  WalkingDoubleSupportPercentage = 'walkingDoubleSupportPercentage',
  WalkingHeartRateAverage = 'walkingHeartRateAverage',
  WalkingSpeed = 'walkingSpeed',
  WalkingStepLength = 'walkingStepLength',
  WaterTemperature = 'waterTemperature'
}

export type Query = {
  readonly __typename?: 'Query';
  readonly mySupplementIntakes: ReadonlyArray<SupplementIntake>;
  readonly searchEatables: ReadonlyArray<Eatable>;
};


export type QuerySearchEatablesArgs = {
  query: Scalars['String']['input'];
};

export type ServingSize = {
  readonly __typename?: 'ServingSize';
  readonly amountInGrams: Scalars['Float']['output'];
  readonly type: ServingSizeType;
};

export type ServingSizeInput = {
  readonly amountInGrams: Scalars['Float']['input'];
  readonly type: ServingSizeType;
};

export enum ServingSizeType {
  Standard = 'STANDARD'
}

export type SupplementIntake = {
  readonly __typename?: 'SupplementIntake';
  readonly _id: Scalars['ObjectId']['output'];
  readonly amountInGrams: Scalars['Float']['output'];
  readonly food: Food;
  readonly foodId: Scalars['ObjectId']['output'];
  readonly intakeTime: IntakeTime;
};

export enum UnitInternal {
  Celsius = 'CELSIUS',
  Count = 'COUNT',
  CountPerMinute = 'COUNT_PER_MINUTE',
  DecibelSoundPressureLevel = 'DECIBEL_SOUND_PRESSURE_LEVEL',
  Gram = 'GRAM',
  InternationalUnit = 'INTERNATIONAL_UNIT',
  Kilocalorie = 'KILOCALORIE',
  MeterPerSecond = 'METER_PER_SECOND',
  Milliliter = 'MILLILITER',
  MillilitrePerKilogramPerMinute = 'MILLILITRE_PER_KILOGRAM_PER_MINUTE',
  Millimeter = 'MILLIMETER',
  MillimetreOfMercury = 'MILLIMETRE_OF_MERCURY',
  MillimolPerLiter = 'MILLIMOL_PER_LITER',
  MillimolPerMol = 'MILLIMOL_PER_MOL',
  Millisecond = 'MILLISECOND',
  Percent = 'PERCENT'
}

export type User = {
  readonly __typename?: 'User';
  readonly _id: Scalars['ObjectId']['output'];
  readonly email: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Eatable: ResolverTypeWrapper<EatableDbType>;
  EatableProportion: ResolverTypeWrapper<Omit<EatableProportion, 'eatable'> & { eatable: ResolversTypes['Eatable'] }>;
  EatableProportionInput: EatableProportionInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Food: ResolverTypeWrapper<EatableDbType>;
  Image: ResolverTypeWrapper<Image>;
  Ingredient: ResolverTypeWrapper<EatableDbType>;
  IntakeTime: IntakeTime;
  Mutation: ResolverTypeWrapper<{}>;
  NutrientQuantity: ResolverTypeWrapper<NutrientQuantity>;
  NutrientQuantityInput: NutrientQuantityInput;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  QuantityType: QuantityType;
  Query: ResolverTypeWrapper<{}>;
  ServingSize: ResolverTypeWrapper<ServingSize>;
  ServingSizeInput: ServingSizeInput;
  ServingSizeType: ServingSizeType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SupplementIntake: ResolverTypeWrapper<SupplementIntakeDbType>;
  UnitInternal: UnitInternal;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Eatable: EatableDbType;
  EatableProportion: Omit<EatableProportion, 'eatable'> & { eatable: ResolversParentTypes['Eatable'] };
  EatableProportionInput: EatableProportionInput;
  Float: Scalars['Float']['output'];
  Food: EatableDbType;
  Image: Image;
  Ingredient: EatableDbType;
  Mutation: {};
  NutrientQuantity: NutrientQuantity;
  NutrientQuantityInput: NutrientQuantityInput;
  ObjectId: Scalars['ObjectId']['output'];
  Query: {};
  ServingSize: ServingSize;
  ServingSizeInput: ServingSizeInput;
  String: Scalars['String']['output'];
  SupplementIntake: SupplementIntakeDbType;
  User: User;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EatableResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Eatable'] = ResolversParentTypes['Eatable']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Food' | 'Ingredient', ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type EatableProportionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EatableProportion'] = ResolversParentTypes['EatableProportion']> = ResolversObject<{
  eatable?: Resolver<ResolversTypes['Eatable'], ParentType, ContextType>;
  eatableId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  proportion?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FoodResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Food'] = ResolversParentTypes['Food']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  ingredients?: Resolver<ReadonlyArray<ResolversTypes['EatableProportion']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  images?: Resolver<ReadonlyArray<ResolversTypes['Image']>, ParentType, ContextType>;
  nutrientsPer100g?: Resolver<ReadonlyArray<ResolversTypes['NutrientQuantity']>, ParentType, ContextType>;
  servingSizes?: Resolver<ReadonlyArray<ResolversTypes['ServingSize']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFood?: Resolver<ResolversTypes['Food'], ParentType, ContextType, RequireFields<MutationAddFoodArgs, 'title'>>;
  addIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationAddIngredientArgs, 'title'>>;
  addSupplement?: Resolver<ResolversTypes['SupplementIntake'], ParentType, ContextType, RequireFields<MutationAddSupplementArgs, 'amountInGrams' | 'foodId' | 'intakeTime'>>;
}>;

export type NutrientQuantityResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NutrientQuantity'] = ResolversParentTypes['NutrientQuantity']> = ResolversObject<{
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nutrient?: Resolver<ResolversTypes['QuantityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  mySupplementIntakes?: Resolver<ReadonlyArray<ResolversTypes['SupplementIntake']>, ParentType, ContextType>;
  searchEatables?: Resolver<ReadonlyArray<ResolversTypes['Eatable']>, ParentType, ContextType, RequireFields<QuerySearchEatablesArgs, 'query'>>;
}>;

export type ServingSizeResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['ServingSize'] = ResolversParentTypes['ServingSize']> = ResolversObject<{
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ServingSizeType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SupplementIntakeResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['SupplementIntake'] = ResolversParentTypes['SupplementIntake']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  amountInGrams?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  food?: Resolver<ResolversTypes['Food'], ParentType, ContextType>;
  foodId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  intakeTime?: Resolver<ResolversTypes['IntakeTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  Eatable?: EatableResolvers<ContextType>;
  EatableProportion?: EatableProportionResolvers<ContextType>;
  Food?: FoodResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NutrientQuantity?: NutrientQuantityResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ServingSize?: ServingSizeResolvers<ContextType>;
  SupplementIntake?: SupplementIntakeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


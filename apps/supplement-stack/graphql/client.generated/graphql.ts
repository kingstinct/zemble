/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-nocheck
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
};

export type Eatable = {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  images: Array<Image>;
  nutrientsPer100g: Array<NutrientQuantity>;
  servingSizes: Array<ServingSize>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EatableProportion = {
  __typename?: 'EatableProportion';
  eatable: Eatable;
  eatableId: Scalars['ObjectId']['output'];
  proportion: Scalars['Float']['output'];
};

export type EatableProportionInput = {
  eatableId: Scalars['ObjectId']['input'];
  proportion: Scalars['Float']['input'];
};

export type Food = Eatable & {
  __typename?: 'Food';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  images: Array<Image>;
  ingredients: Array<EatableProportion>;
  nutrientsPer100g: Array<NutrientQuantity>;
  servingSizes: Array<ServingSize>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Image = {
  __typename?: 'Image';
  url: Scalars['String']['output'];
};

export type Ingredient = Eatable & {
  __typename?: 'Ingredient';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  images: Array<Image>;
  nutrientsPer100g: Array<NutrientQuantity>;
  servingSizes: Array<ServingSize>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum IntakeTime {
  Bedtime = 'BEDTIME',
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Wakeup = 'WAKEUP'
}

export type Mutation = {
  __typename?: 'Mutation';
  addFood: Food;
  addIngredient: Ingredient;
  addSupplement: SupplementIntake;
};


export type MutationAddFoodArgs = {
  foodId?: InputMaybe<Scalars['ObjectId']['input']>;
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredients?: InputMaybe<Array<EatableProportionInput>>;
  servingSizes?: InputMaybe<Array<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddIngredientArgs = {
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredientId?: InputMaybe<Scalars['ObjectId']['input']>;
  nutrientsPer100g?: InputMaybe<Array<NutrientQuantityInput>>;
  servingSizes?: InputMaybe<Array<ServingSizeInput>>;
  title: Scalars['String']['input'];
};


export type MutationAddSupplementArgs = {
  amountInGrams: Scalars['Float']['input'];
  foodId: Scalars['ObjectId']['input'];
  intakeTime: IntakeTime;
  supplementId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type NutrientQuantity = {
  __typename?: 'NutrientQuantity';
  amountInGrams: Scalars['Float']['output'];
  nutrient: QuantityType;
};

export type NutrientQuantityInput = {
  amountInGrams: Scalars['Float']['input'];
  nutrient: QuantityType;
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
  __typename?: 'Query';
  mySupplementIntakes: Array<SupplementIntake>;
  searchEatables: Array<Eatable>;
};


export type QuerySearchEatablesArgs = {
  query: Scalars['String']['input'];
};

export type ServingSize = {
  __typename?: 'ServingSize';
  amountInGrams: Scalars['Float']['output'];
  type: ServingSizeType;
};

export type ServingSizeInput = {
  amountInGrams: Scalars['Float']['input'];
  type: ServingSizeType;
};

export enum ServingSizeType {
  Standard = 'STANDARD'
}

export type SupplementIntake = {
  __typename?: 'SupplementIntake';
  _id: Scalars['ObjectId']['output'];
  amountInGrams: Scalars['Float']['output'];
  food: Food;
  foodId: Scalars['ObjectId']['output'];
  intakeTime: IntakeTime;
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
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  email: Scalars['String']['output'];
};

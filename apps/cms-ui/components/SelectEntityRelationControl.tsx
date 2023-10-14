/* eslint-disable functional/immutable-data */
import BottomSheet from '@gorhom/bottom-sheet'
import {
  useEffect, useRef, useState,
} from 'react'
import { Controller } from 'react-hook-form'
import {
  ScrollView,
} from 'react-native'
import {
  Searchbar, Title, useTheme,
} from 'react-native-paper'
import { useQuery } from 'urql'

import { SearchEntries } from './ListOfEntries'
import { GetEntityByNamePluralQuery } from '../app/(tabs)/(content)/[entity]'

import type {
  Control, FieldValues, Path,
} from 'react-hook-form'

type SelectEntityRelationProps<T extends FieldValues> = {
  readonly control: Control<T>,
  readonly fieldName: Path<T>,
  readonly entityNamePlural: string,
  readonly label?: string,
  readonly onChange?: (value: unknown) => void,
  readonly onClose?: () => void
}

function SelectEntityRelation<T extends FieldValues>({
  control, fieldName, entityNamePlural, label = fieldName, onChange: onChangeFromProps, onClose,
}: SelectEntityRelationProps<T>) {
  const bottomSheet = useRef<BottomSheet>(null)
  const theme = useTheme()

  const [{ data }] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entityNamePlural },
    pause: !entityNamePlural,
  })

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (fieldName) {
      // bottomSheet.current?.expand()
    } else {
      bottomSheet.current?.close()
    }
  }, [fieldName])

  const entity = data?.getEntityByNamePlural

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => (
        <BottomSheet
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          ref={bottomSheet}
          snapPoints={[400, 640]}
          keyboardBehavior='interactive'
          onChange={(index) => {
            if (index === -1) {
              onClose?.()
            }
          }}
          keyboardBlurBehavior='restore'
        >
          <Title style={{ margin: 8, marginLeft: 32, marginTop: 0 }}>{label}</Title>
          <Searchbar
            style={{ margin: 8 }}
            value={query}
            onChangeText={setQuery}
            placeholder='Search for entity..'
          />
          <ScrollView>
            {entity ? (
              <SearchEntries
                entity={entity}
                query={query}
                onSelected={(entry) => {
                  onChangeFromProps?.(entry)
                  onChange(entry.id)
                  bottomSheet.current?.close()
                }}
              />
            ) : null}
          </ScrollView>
        </BottomSheet>
      )}
    />
  )
}

export default SelectEntityRelation

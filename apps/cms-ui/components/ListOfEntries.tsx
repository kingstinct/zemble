import {
  View, Text, StyleSheet, Pressable,
} from 'react-native'
import { useQuery } from 'urql'

import { capitalize } from '../utils/text'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', borderColor: 'gray', borderWidth: StyleSheet.hairlineWidth, margin: 10, padding: 10, justifyContent: 'space-between',
  },
  cell: { alignSelf: 'stretch' },
  table: { borderRadius: 10, margin: 10, padding: 10 },
})

type ListOfEntriesProps = {
  readonly pluralizedName: string,
  readonly fields: readonly {readonly name: string, readonly __typename: string, readonly availableFields?: readonly {readonly name: string}[]}[],
  readonly onSelected: (s: Record<string, unknown>) => void
  readonly entityName: string
}

const ArraySubFieldName = ({ entityName, arrayFieldName, subFieldName }: {readonly entityName: string, readonly arrayFieldName: string, readonly subFieldName: string }) => `${capitalize(entityName)}${capitalize(arrayFieldName)}${capitalize(subFieldName)}`.replaceAll(' ', '_')

const ListOfEntries: React.FC<ListOfEntriesProps> = ({
  fields, pluralizedName, entityName, onSelected,
}) => {
  const fs = fields.map((field) => (field.availableFields && field.availableFields.length > 0
    ? `${field.name} { __typename ${field.availableFields.map((f) => {
      const fieldName = f.name.replaceAll(' ', '_')
      return `... on ${ArraySubFieldName({ arrayFieldName: field.name, entityName, subFieldName: f.name })} { ${fieldName} }`
    }).join(' ')} }`
    : field.name))

  const queryName = `getAll${capitalize(pluralizedName)}`

  const [{ data }] = useQuery({
    query: `query GetEntries { ${queryName} { ${fs.join(' ')} } }`,
    variables: {},
  })

  const entries = data?.[queryName] as Record<string, unknown> & readonly {readonly id: string}[] | undefined

  return (
    <View style={styles.table}>
      <View
        style={[styles.row, { backgroundColor: 'black' }]}
      >
        { fields.map((f) => <Text key={f.name} style={[styles.cell, { color: 'white' }]}>{ f.name }</Text>) }
      </View>
      {
        entries?.map((entity) => (
          <Pressable
            accessibilityRole='button'
            key={entity.id}
            onPress={() => onSelected(entity)}
          >
            <View
              style={styles.row}
            >
              { fs.map((f) => (
                <Text
                  key={f}
                  style={styles.cell}
                >
                  { entity[f] ? entity[f].toString() : '(null)' }
                </Text>
              )) }
            </View>
          </Pressable>
        ))
      }
    </View>
  )
}

export default ListOfEntries

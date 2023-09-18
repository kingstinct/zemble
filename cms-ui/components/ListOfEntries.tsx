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
  readonly fields: readonly {readonly name: string, readonly __typename: string}[],
  readonly onSelected: (s: Record<string, unknown>) => void
}

const ListOfEntries: React.FC<ListOfEntriesProps> = ({ fields, pluralizedName, onSelected }) => {
  const fs = fields.map((field) => field.name)

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
        { fs.map((f) => <Text key={f} style={[styles.cell, { color: 'white' }]}>{ f }</Text>) }
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

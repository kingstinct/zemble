import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomColor: 'black', borderBottomWidth: 1, padding: 8, margin: 8,
  },
  booleanFieldInput: {
    flexDirection: 'row', padding: 8, margin: 8, justifyContent: 'space-between',
  },
  booleanFieldSwitch: { marginLeft: 8 },
  title: { padding: 8, margin: 8, fontSize: 24 },
  bottomSheetBackground: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
})

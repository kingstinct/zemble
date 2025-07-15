import type { TextStyle, ViewStyle } from 'react-native'

const Styles = {
  alignItemsCenter: { alignItems: 'center' } satisfies ViewStyle,
  alignSelfCenter: { alignSelf: 'center' } satisfies ViewStyle,
  bold: { fontWeight: 'bold' } satisfies TextStyle,
  borderBottomRadius16: {
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  } satisfies ViewStyle,

  borderBottomRadius32: {
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
  } satisfies ViewStyle,
  borderBottomRadius4: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  } satisfies ViewStyle,
  borderBottomRadius8: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  } satisfies ViewStyle,
  borderRadius16: { borderRadius: 16 } satisfies ViewStyle,
  borderRadius32: { borderRadius: 32 } satisfies ViewStyle,
  borderRadius4: { borderRadius: 4 } satisfies ViewStyle,

  borderRadius8: { borderRadius: 8 } satisfies ViewStyle,
  borderTopRadius16: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  } satisfies ViewStyle,
  borderTopRadius32: {
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  } satisfies ViewStyle,
  borderTopRadius4: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  } satisfies ViewStyle,
  borderTopRadius8: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  } satisfies ViewStyle,
  flexOne: { flex: 1 } satisfies ViewStyle,

  flexRow: { flexDirection: 'row' } satisfies ViewStyle,
  justifyContentCenter: { justifyContent: 'center' } satisfies ViewStyle,
  margin16: { margin: 16 } satisfies ViewStyle,
  margin4: { margin: 4 } satisfies ViewStyle,
  margin8: { margin: 8 } satisfies ViewStyle,
  marginBottom16: { marginBottom: 16 } satisfies ViewStyle,

  marginBottom4: { marginBottom: 4 } satisfies ViewStyle,
  marginBottom8: { marginBottom: 8 } satisfies ViewStyle,
  marginHorizontal16: { marginHorizontal: 16 } satisfies ViewStyle,
  marginHorizontal4: { marginHorizontal: 4 } satisfies ViewStyle,
  marginHorizontal8: { marginHorizontal: 8 } satisfies ViewStyle,
  marginLeft16: { marginLeft: 16 } satisfies ViewStyle,

  marginLeft4: { marginLeft: 4 } satisfies ViewStyle,
  marginLeft8: { marginLeft: 8 } satisfies ViewStyle,
  marginRight16: { marginRight: 16 } satisfies ViewStyle,
  marginRight4: { marginRight: 4 } satisfies ViewStyle,
  marginRight8: { marginRight: 8 } satisfies ViewStyle,
  marginTop16: { marginTop: 16 } satisfies ViewStyle,

  marginTop4: { marginTop: 4 } satisfies ViewStyle,
  marginTop8: { marginTop: 8 } satisfies ViewStyle,
  marginVertical16: { marginVertical: 16 } satisfies ViewStyle,
  marginVertical4: { marginVertical: 4 } satisfies ViewStyle,
  marginVertical8: { marginVertical: 8 } satisfies ViewStyle,
  padding16: { padding: 16 } satisfies ViewStyle,

  padding4: { padding: 4 } satisfies ViewStyle,
  padding8: { padding: 8 } satisfies ViewStyle,
  paddingBottom16: { paddingBottom: 16 } satisfies ViewStyle,
  paddingBottom4: { paddingBottom: 4 } satisfies ViewStyle,
  paddingBottom8: { paddingBottom: 8 } satisfies ViewStyle,
  paddingHorizontal16: { paddingHorizontal: 16 } satisfies ViewStyle,

  paddingHorizontal4: { paddingHorizontal: 4 } satisfies ViewStyle,
  paddingHorizontal8: { paddingHorizontal: 8 } satisfies ViewStyle,
  paddingLeft16: { paddingLeft: 16 } satisfies ViewStyle,
  paddingLeft4: { paddingLeft: 4 } satisfies ViewStyle,
  paddingLeft8: { paddingLeft: 8 } satisfies ViewStyle,
  paddingRight16: { paddingRight: 16 } satisfies ViewStyle,
  paddingRight4: { paddingRight: 4 } satisfies ViewStyle,
  paddingRight8: { paddingRight: 8 } satisfies ViewStyle,
  paddingTop16: { paddingTop: 16 } satisfies ViewStyle,
  paddingTop4: { paddingTop: 4 } satisfies ViewStyle,
  paddingTop8: { paddingTop: 8 } satisfies ViewStyle,
  paddingVertical16: { paddingVertical: 16 } satisfies ViewStyle,
  paddingVertical4: { paddingVertical: 4 } satisfies ViewStyle,
  paddingVertical8: { paddingVertical: 8 } satisfies ViewStyle,
  shadowLight: {
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } satisfies ViewStyle,
  textCenter: { textAlign: 'center' } satisfies TextStyle,

  textLeft: { textAlign: 'left' } satisfies TextStyle,

  width100pct: { width: '100%' } satisfies ViewStyle,
}

export default Styles

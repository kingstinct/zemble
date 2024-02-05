import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'

const Styles = {
  alignItemsCenter: { alignItems: 'center' } as ViewStyle,
  alignSelfCenter: { alignSelf: 'center' } as ViewStyle,
  bold: { fontWeight: 'bold' } as TextStyle,
  borderBottomRadius16: { borderBottomLRightadius: 16, borderBottomLeftRadius: 16 } as ViewStyle,

  borderBottomRadius32: { borderBottomLRightadius: 32, borderBottomLeftRadius: 32 } as ViewStyle,
  borderBottomRadius4: { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 } as ViewStyle,
  borderBottomRadius8: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 } as ViewStyle,
  borderRadius16: { borderRadius: 16 } as ViewStyle,
  borderRadius32: { borderRadius: 32 } as ViewStyle,
  borderRadius4: { borderRadius: 4 } as ViewStyle,

  borderRadius8: { borderRadius: 8 } as ViewStyle,
  borderTopRadius16: { borderTopLRightadius: 16, borderTopLeftRadius: 16 } as ViewStyle,
  borderTopRadius32: { borderTopLRightadius: 32, borderTopLeftRadius: 32 } as ViewStyle,
  borderTopRadius4: { borderTopLeftRadius: 4, borderTopRightRadius: 4 } as ViewStyle,
  borderTopRadius8: { borderTopLeftRadius: 8, borderTopRightRadius: 8 } as ViewStyle,
  flexOne: { flex: 1 } as ViewStyle,

  flexRow: { flexDirection: 'row' } as ViewStyle,
  justifyContentCenter: { justifyContent: 'center' } as ViewStyle,
  margin16: { margin: 16 } as ImageStyle & ViewStyle,
  margin4: { margin: 4 } as ImageStyle & ViewStyle,
  margin8: { margin: 8 } as ImageStyle & ViewStyle,
  marginBottom16: { marginBottom: 16 } as ImageStyle & ViewStyle,

  marginBottom4: { marginBottom: 4 } as ImageStyle & ViewStyle,
  marginBottom8: { marginBottom: 8 } as ImageStyle & ViewStyle,
  marginHorizontal16: { marginHorizontal: 16 } as ImageStyle & ViewStyle,
  marginHorizontal4: { marginHorizontal: 4 } as ImageStyle & ViewStyle,
  marginHorizontal8: { marginHorizontal: 8 } as ImageStyle & ViewStyle,
  marginLeft16: { marginLeft: 16 } as ImageStyle & ViewStyle,

  marginLeft4: { marginLeft: 4 } as ImageStyle & ViewStyle,
  marginLeft8: { marginLeft: 8 } as ImageStyle & ViewStyle,
  marginRight16: { marginRight: 16 } as ImageStyle & ViewStyle,
  marginRight4: { marginRight: 4 } as ImageStyle & ViewStyle,
  marginRight8: { marginRight: 8 } as ImageStyle & ViewStyle,
  marginTop16: { marginTop: 16 } as ImageStyle & ViewStyle,

  marginTop4: { marginTop: 4 } as ImageStyle & ViewStyle,
  marginTop8: { marginTop: 8 } as ImageStyle & ViewStyle,
  marginVertical16: { marginVertical: 16 } as ImageStyle & ViewStyle,
  marginVertical4: { marginVertical: 4 } as ImageStyle & ViewStyle,
  marginVertical8: { marginVertical: 8 } as ImageStyle & ViewStyle,
  padding16: { padding: 16 } as ImageStyle & ViewStyle,

  padding4: { padding: 4 } as ImageStyle & ViewStyle,
  padding8: { padding: 8 } as ImageStyle & ViewStyle,
  paddingBottom16: { paddingBottom: 16 } as ImageStyle & ViewStyle,
  paddingBottom4: { paddingBottom: 4 } as ImageStyle & ViewStyle,
  paddingBottom8: { paddingBottom: 8 } as ImageStyle & ViewStyle,
  paddingHorizontal16: { paddingHorizontal: 16 } as ImageStyle & ViewStyle,

  paddingHorizontal4: { paddingHorizontal: 4 } as ImageStyle & ViewStyle,
  paddingHorizontal8: { paddingHorizontal: 8 } as ImageStyle & ViewStyle,
  paddingLeft16: { paddingLeft: 16 } as ImageStyle & ViewStyle,
  paddingLeft4: { paddingLeft: 4 } as ImageStyle & ViewStyle,
  paddingLeft8: { paddingLeft: 8 } as ImageStyle & ViewStyle,
  paddingRight16: { paddingRight: 16 } as ImageStyle & ViewStyle,
  paddingRight4: { paddingRight: 4 } as ImageStyle & ViewStyle,
  paddingRight8: { paddingRight: 8 } as ImageStyle & ViewStyle,
  paddingTop16: { paddingTop: 16 } as ImageStyle & ViewStyle,
  paddingTop4: { paddingTop: 4 } as ImageStyle & ViewStyle,
  paddingTop8: { paddingTop: 8 } as ImageStyle & ViewStyle,
  paddingVertical16: { paddingVertical: 16 } as ImageStyle & ViewStyle,
  paddingVertical4: { paddingVertical: 4 } as ImageStyle & ViewStyle,
  paddingVertical8: { paddingVertical: 8 } as ImageStyle & ViewStyle,
  shadowLight: {
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  textCenter: { textAlign: 'center' } as TextStyle,

  textLeft: { textAlign: 'left' } as TextStyle,

  width100pct: { width: '100%' } as ViewStyle,
}

export default Styles

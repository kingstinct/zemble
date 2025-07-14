import { Row, Text } from '@zemble/primitives'

import { createThemedStylesHook } from '@zemble/react'

const useStyles = createThemedStylesHook(({ theme }) => ({
  container: {
    alignContent: 'center',
    backgroundColor: theme.colors.background,
  },
}))

const MyComponent = () => {
  const styles = useStyles()

  return (
    <Row style={styles.container}>
      <Text>My text</Text>
    </Row>
  )
}

export default MyComponent

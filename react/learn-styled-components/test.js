
const styled = require('./dist/styled-components.cjs').default

styled.div`
  padding: 10px;
  width: ${10}px
`

styled.div(
  {
    padding: '10px;',
    width: `${10}px`
  }
)

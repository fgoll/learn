import domElements from '../utils/domElements'
import interleave from '../utils/interleave'

function css(styles, ...interpolations) {
  console.log('css', styles, interpolations)

  console.log(interleave(styles, interpolations))
}

function constructWithOptions(componentConstructor, tag, options) {
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args))

  templateFunction.withConfig = config => constructWithOptions(componentConstructor, tag, { ...options, ...config })

  templateFunction.attrs = attrs => constructWithOptions(componentConstructor, tag, {
    ...options,
    attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
  });

  return templateFunction
}

function StyledComponent(tag, options, rules) {
  console.log('StyledComponent', tag, options, rules)
}

const styled = (tag) => constructWithOptions(StyledComponent, tag)

domElements.forEach(domElement => {
  styled[domElement] = styled(domElement)
})

export default styled
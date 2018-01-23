import styled from "styled-components"
import groupProps from "../AnimatedComponent/props"
import parse from "./css"

const CONSTRUCTOR_METHODS = [ "withConfig", "attrs" ]

const delegate = animated => fun => (...css) => animated(fun(...parse(...css)))

export const extend = (animated, target, config = {}) => {
  const delegateThis = delegate(animated(config))
  const result = delegateThis(target)
  CONSTRUCTOR_METHODS.forEach((method) => {
    result[method] = (...args) => delegateThis(target[method](...args))
  })
  return result
}

export default (animated, Tag, config) => {
  const transitionConfig = { }
  let target = styled(Tag)
  if(config) {
    const styledConfig = { ...config }
    if(config.attrs) {
      const props = groupProps(config.attrs)
      styledConfig.attrs = props.props
      transitionConfig.attrs = props.transition
    }
    target = target.withConfig(config)
  }
  return extend(animated, target, transitionConfig)
}

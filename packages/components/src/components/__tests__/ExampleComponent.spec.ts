import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ExampleComponent from '../ExampleComponent.vue'

describe('ExampleComponent', () => {
  it('renders the char repeated count times', () => {
    const wrapper = mount(ExampleComponent, { props: { char: 'A', count: 3 } })
    expect(wrapper.text()).toBe('AAA')
  })

  it('renders nothing when count is 0', () => {
    const wrapper = mount(ExampleComponent, { props: { char: 'X', count: 0 } })
    expect(wrapper.text()).toBe('')
  })

  it('renders a single char when count is 1', () => {
    const wrapper = mount(ExampleComponent, { props: { char: '★', count: 1 } })
    expect(wrapper.text()).toBe('★')
  })
})
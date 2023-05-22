import type { ComponentMeta, ComponentStory } from '@storybook/react'

import LabLayout from './LabLayout'

export const generated: ComponentStory<typeof LabLayout> = (args) => {
  return <LabLayout {...args} />
}

export default {
  title: 'Layouts/LabLayout',
  component: LabLayout,
} as ComponentMeta<typeof LabLayout>

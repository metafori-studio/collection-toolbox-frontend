import { setup, type Preview } from '@storybook/vue3-vite';
import '../src/assets/main.css';
import i18n from '../src/i18n';

setup((app) => {
  app.use(i18n);
});

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Design System', 'Atoms', 'Molecules'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;

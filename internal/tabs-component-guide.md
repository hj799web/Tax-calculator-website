# Tabs Component Guide

## Overview

The `TabsComponent` is a reusable, accessible tab navigation component that provides keyboard navigation, ARIA compliance, and flexible styling options. It's used throughout the application to organize content into manageable sections.

## Features

### Accessibility (WCAG 2.1 AA Compliant)
- Full keyboard navigation (arrow keys, home, end, enter, space)
- Proper ARIA attributes (`role="tablist"`, `aria-controls`, `aria-labelledby`)
- Focus management and screen reader support
- Unique IDs for all interactive elements

### Keyboard Navigation
- **Arrow Keys**: Navigate between tabs (left/right for horizontal, up/down for vertical)
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Enter/Space**: Activate focused tab
- **Tab**: Move focus to next focusable element

### Styling Variants
- **Default**: Standard tab styling
- **Primary**: Enhanced styling with gradients and shadows
- **Custom**: Extensible through CSS custom properties

## Usage

### Basic Implementation

```vue
<template>
  <Tabs
    :items="tabItems"
    v-model="activeTab"
    variant="primary"
  >
    <template #default="{ activeTab: currentTab, getPanelProps }">
      <section
        v-bind="getPanelProps('tab1')"
        v-show="currentTab === 'tab1'"
      >
        <!-- Tab 1 content -->
      </section>
      
      <section
        v-bind="getPanelProps('tab2')"
        v-show="currentTab === 'tab2'"
      >
        <!-- Tab 2 content -->
      </section>
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'

const activeTab = ref('tab1')
const tabItems = [
  { id: 'tab1', label: 'First Tab', panelId: 'panel-1' },
  { id: 'tab2', label: 'Second Tab', panelId: 'panel-2' }
]
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | Required | Array of tab objects with `id`, `label`, and optional `panelId` |
| `modelValue` | String | `''` | Currently active tab ID (v-model) |
| `variant` | String | `'default'` | Styling variant (`'default'` or `'primary'`) |
| `orientation` | String | `'horizontal'` | Tab orientation (`'horizontal'` or `'vertical'`) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | String | Emitted when active tab changes (for v-model) |
| `change` | String | Emitted when tab is activated |

### Slot Props

The default slot receives these props:

| Prop | Type | Description |
|------|------|-------------|
| `activeTab` | String | Currently active tab ID |
| `getPanelProps` | Function | Returns ARIA props for panel elements |
| `getPanelId` | Function | Returns panel ID for a given tab ID |
| `getTabId` | Function | Returns tab ID for a given tab ID |

## Implementation Details

### Tab Items Structure

```javascript
const tabItems = [
  {
    id: 'unique-tab-id',        // Required: Unique identifier
    label: 'Tab Display Name',  // Required: Display text
    panelId: 'panel-id'         // Optional: Custom panel ID (auto-generated if not provided)
  }
]
```

### ARIA Relationships

The component automatically manages ARIA relationships:

```html
<div role="tablist" aria-orientation="horizontal">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-id"
    id="tab-id"
  >
    Tab Label
  </button>
</div>

<section
  role="tabpanel"
  aria-labelledby="tab-id"
  id="panel-id"
  aria-hidden="false"
>
  Panel Content
</section>
```

### Focus Management

- Only the active tab is focusable (`tabindex="0"`)
- Inactive tabs have `tabindex="-1"`
- Focus is automatically managed during keyboard navigation
- Focus returns to the tab list after panel content interaction

## Styling

### CSS Classes

```css
.tabs                    /* Main container */
.tabs__list             /* Tab list container */
.tabs__tab              /* Individual tab button */
.tabs__tab.is-active    /* Active tab state */
.tabs__panels           /* Panels container */
.tabs--primary          /* Primary variant modifier */
.tabs--horizontal       /* Horizontal orientation */
.tabs--vertical         /* Vertical orientation */
```

### Custom Properties

```css
:root {
  --tab-bg: rgba(255, 255, 255, 0.95);
  --tab-border: rgba(17, 24, 39, 0.08);
  --tab-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
  --tab-active-bg: rgba(34, 211, 238, 0.16);
  --tab-active-border: rgba(34, 211, 238, 0.4);
}
```

### Dark Mode Support

```css
.dark .tabs__list {
  background: rgba(15, 23, 42, 0.88);
  border-color: rgba(148, 163, 184, 0.26);
}

.dark .tabs__tab {
  color: rgba(226, 232, 240, 0.78);
}

.dark .tabs__tab.is-active {
  color: #f8fafc;
  background: rgba(34, 211, 238, 0.28);
}
```

## Mobile Responsiveness

### Horizontal Scrolling
- Tab list scrolls horizontally on narrow screens
- Custom scrollbar styling for better UX
- Touch-friendly scrolling with `-webkit-overflow-scrolling: touch`

### Touch Targets
- Minimum 44px touch targets on mobile
- Adequate spacing between tabs
- Optimized padding and font sizes

## Testing

### Manual Testing Checklist

- [ ] Keyboard navigation works in all directions
- [ ] ARIA attributes are correctly set
- [ ] Focus management works properly
- [ ] Screen reader announces tab changes
- [ ] Mobile scrolling works smoothly
- [ ] Dark mode styling is correct
- [ ] Tab switching updates content correctly

### Automated Testing

```javascript
// Example test for keyboard navigation
test('navigates tabs with arrow keys', async () => {
  const { getByRole } = render(TabsComponent, { props: { items: tabItems } })
  
  const tabList = getByRole('tablist')
  const firstTab = getByRole('tab', { name: 'First Tab' })
  
  firstTab.focus()
  await fireEvent.keyDown(firstTab, { key: 'ArrowRight' })
  
  expect(getByRole('tab', { name: 'Second Tab' })).toHaveFocus()
})
```

## Performance Considerations

### Optimization Features
- Efficient reactivity with computed properties
- Debounced updates to prevent excessive re-renders
- Lazy panel loading support
- Memory-efficient ref management

### Best Practices
- Use `v-show` instead of `v-if` for tab panels to maintain state
- Implement lazy loading for heavy tab content
- Avoid complex computations in tab switching logic
- Use `key` attributes for dynamic tab lists

## Migration Guide

### From Custom Tab Implementation

1. Replace custom tab markup with `TabsComponent`
2. Convert tab data to the required `items` format
3. Update event handlers to use the new API
4. Apply appropriate styling variants
5. Test accessibility compliance

### Breaking Changes

- Component name changed from `Tabs` to `TabsComponent` (ESLint compliance)
- Slot API changed to use scoped slots
- ARIA attributes are now automatically managed
- Focus management is handled internally

## Troubleshooting

### Common Issues

**Tabs not switching**
- Check that `v-model` is properly bound
- Verify tab IDs match between items and panel conditions

**Keyboard navigation not working**
- Ensure tab list has focus
- Check that `role="tablist"` is present
- Verify ARIA attributes are correct

**Styling issues**
- Check CSS custom properties are defined
- Verify variant classes are applied
- Ensure proper CSS specificity

**Mobile scrolling problems**
- Check `overflow-x: auto` is set
- Verify touch scrolling is enabled
- Test on actual devices, not just browser dev tools

## Future Enhancements

### Planned Features
- Animation support for tab transitions
- Icon support in tab labels
- Drag-and-drop tab reordering
- Tab persistence across page reloads
- Nested tab support

### API Considerations
- Maintain backward compatibility
- Keep accessibility as priority
- Consider performance impact of new features
- Document all changes thoroughly

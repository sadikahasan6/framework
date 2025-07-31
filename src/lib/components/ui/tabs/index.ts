// src/lib/components/ui/tabs/index.ts
import TabsRoot from './tabs.svelte';
import TabsList from './tabs-list.svelte';
import TabsTrigger from './tabs-trigger.svelte';
import TabsContent from './tabs-content.svelte';

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
};

// Also export individual components
export { TabsRoot, TabsList, TabsTrigger, TabsContent };
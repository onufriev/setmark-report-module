import { TabProps } from './Tabs'

export function findEnabledTab (tabs: TabProps[], currentIndex: number): number {
    for (let i = currentIndex + 1; i < tabs.length; i++) {
        if (!tabs[i].disabled && !tabs[i].hidden) return i
    }

    for (let i = currentIndex - 1; i > -1; i--) {
        if (!tabs[i].disabled && !tabs[i].hidden) return i
    }

    return -1
}

export function tabIsEnabled (tab: TabProps) {
    return tab ? !tab.hidden && !tab.disabled : false
}

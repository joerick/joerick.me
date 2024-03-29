import { reactive } from "vue"

export interface WindowControllerModel {
    activeWindow: WindowModel|null
    windowOrder: WindowModel[]
}

export interface WindowModel {
    id: string
    selectedIcon: IconModel|null
}

export interface IconModel {
    id: string
}

export const desktopWindow = reactive<WindowModel>({
    id: 'desktop',
    selectedIcon: null
})
export const windowController = reactive<WindowControllerModel>({
    activeWindow: desktopWindow,
    windowOrder: [desktopWindow]
})

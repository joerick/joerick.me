import ResizeObserver from 'resize-observer-polyfill'
import { onMounted, onUnmounted, ref, Ref } from 'vue'

export default function useObserveSize(elementRef: Ref<HTMLElement|null|undefined>) {

    const elementSize = ref({ width: 0, height: 0 })
    const observer = new ResizeObserver(_ => {
        const element = elementRef.value
        if (element == null) {
            elementSize.value = {width: 0, height: 0}
        } else {
            elementSize.value = {
                width: element.offsetWidth,
                height: element.offsetHeight,
            }
        }
    })
    onMounted(() => {
        if (!elementRef.value) {
            throw new Error('element inside ref was null/undefined when mounted')
        }
        observer.observe(elementRef.value)
    })
    onUnmounted(() => {
        observer.disconnect()
    })
    return elementSize
}

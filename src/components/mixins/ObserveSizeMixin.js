import ResizeObserver from 'resize-observer-polyfill'

export default {
    data() {
        return {
            elementSize: {width: 0, height: 0},
            __ObserveSizeMixin__observer: null,
        }
    },
    mounted() {
        this.__ObserveSizeMixin__update()
        this.__ObserveSizeMixin__observer = new ResizeObserver(entries => {
            this.__ObserveSizeMixin__update()
        })
        this.__ObserveSizeMixin__observer.observe(this.$el);
    },
    beforeDestroy() {
        this.__ObserveSizeMixin__observer?.disconnect()
    },
    methods: {
        __ObserveSizeMixin__update() {
            const el = this.$el
            this.elementSize = {
                width: el.offsetWidth,
                height: el.offsetHeight,
            }
        }
    },
}

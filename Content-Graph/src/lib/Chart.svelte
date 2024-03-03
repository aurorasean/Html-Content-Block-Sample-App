<script lang="ts" context="module">
    import * as echarts from "echarts";
    import type { ChartEvent } from "./ChartEvent";
    import { onMount, afterUpdate } from "svelte";

    export type EChartsOptions = echarts.EChartsOption;
    export type EChartsTheme = string | object;
    export type EChartsRenderer = "canvas" | "svg";

    export type ChartOptions = {
        theme?: EChartsTheme;
        renderer?: EChartsRenderer;
        options: EChartsOptions;
        events: ChartEvent[];
    };

    const DEFAULT_OPTIONS: Partial<ChartOptions> = {
        theme: undefined,
        renderer: "canvas",
    };

    export function chartable(
        element: HTMLElement,
        echartOptions: ChartOptions,
    ) {
        const { theme, renderer, options, events } = {
            ...DEFAULT_OPTIONS,
            ...echartOptions,
        };

        const echartsInstance = echarts.init(element, theme, { renderer });
        echartsInstance.setOption(options);

        function handleResize() {
            console.log("resize");
            setTimeout(() => {
                echartsInstance.resize();
            }, 1000);
        }

        events.forEach((event) => {
            echartsInstance.on(event.type, event.filter, event.event);
        });
        window.addEventListener("resize", handleResize);

        return {
            destroy() {
                echartsInstance.dispose();
                window.removeEventListener("resize", handleResize);
            },
            update(newOptions: ChartOptions) {
                echartsInstance.setOption({
                    ...echartOptions.options,
                    ...newOptions.options,
                });
            },
        };
    }
</script>

<script lang="ts">
    export let options: echarts.EChartsOption;
    export let events: ChartEvent[];
    export let { theme, renderer } = DEFAULT_OPTIONS;
    // let echartsInstance: any;
    // afterUpdate(() => {
    //     console.log({ update: options, echartsInstance });
    //     echartsInstance?.setOption(options);
    // });
    // onMount(() => {
    //     const element = document.getElementById("chart-render");
    //     echartsInstance = echarts.init(element, theme, { renderer });
    //     echartsInstance.setOption(options);
    //     console.log({ mount: options });
    // });
</script>

<div class="chart" id="parent-chart">
    <!-- <div id="chart-render" /> -->
    <div id="chart-render" class="chart" use:chartable={{ renderer, theme, options, events }} />
</div>

<style>
    .chart {
        height: var(--view-height);
        width: 100%;
    }
    .chart > * {
        height: var(--view-height);
        width: 100%;
    }
    #chart-render > div {
        height: var(--view-height) !important;
        width: 100%;
    }
    #chart-render > div> svg {
        height: var(--view-height) !important;
        width: 100%;
    }
</style>

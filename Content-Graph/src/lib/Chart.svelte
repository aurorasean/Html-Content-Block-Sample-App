<script lang="ts" context="module">
    import * as echarts from "echarts/core";
    import type { EChartsOption } from "echarts";
    import { GraphChart } from "echarts/charts";
    import type { ChartEvent } from "./ChartEvent";

    export type EChartsOptions = EChartsOption;
    export type EChartsTheme = string | object;
    export type EChartsRenderer = "canvas" | "svg";
    import {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
    } from "echarts/components";
    export type ChartOptions = {
        theme?: EChartsTheme;
        renderer?: EChartsRenderer;
        options: EChartsOptions;
        events: ChartEvent[];
    };
    import { LabelLayout, UniversalTransition } from "echarts/features";
    import { SVGRenderer } from "echarts/renderers";
    // Register the required components
    echarts.use([
        GraphChart,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LabelLayout,
        UniversalTransition,
        SVGRenderer,
    ]);
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
    export let options: EChartsOption;
    export let events: ChartEvent[];
    export let { theme, renderer } = DEFAULT_OPTIONS;
</script>

<div class="chart" id="parent-chart">
    <div
        id="chart-render"
        class="chart"
        use:chartable={{ renderer, theme, options, events }}
    />
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
</style>

<script lang="ts">
  import Chart from "./lib/Chart.svelte";
  import { onMount } from "svelte";
  import { LoadData } from "./lib/load";

  import packageData from "../package.json";
  let nodes: any[] = [];
  let edges: any[] = [];
  let loaded = false;

  let selectedHightlight = { id: "-1" };

  const highlightEdges = () => {
    edges.forEach((x) => {
      x.lineStyle = {
        ...x.lineStyle,
        color:
          x.source === selectedHightlight.id ||
          x.target === selectedHightlight.id
            ? "red"
            : "grey",
      };
      x.label = {
        ...x.label,
        color: "grey",
        textBorderColor: "black",
        textBorderWidth: 1,
        textBorderRadius: 4,
        show:
          x.source === selectedHightlight.id ||
          x.target === selectedHightlight.id,
      };
    });
    options = {
      ...options,
      series: [
        {
          // @ts-ignore
          ...options.series[0],
          data: nodes,
          links: edges,
        },
      ],
    };
  };
  let options: echarts.EChartsOption = {
    series: [
      {
        type: "graph",
        layout: "force",
        label: {
          show: true,
        },
        force: {
          repulsion: 100,
          gravity: 0.01,
          friction: 0.1,
          initLayout: "circular",
          layoutAnimation: true,
          edgeLength: 150,
        },
        draggable: true,
        edgeSymbol: ["circle", "arrow"],
        data: nodes,
        links: edges,
      },
    ],
  };
  let events = [
    {
      type: "click",
      filter: {},
      event: (params: any) => {
        const { data } = params;
        selectedHightlight = data;
        highlightEdges();
      },
    },
  ];
  onMount(async () => {
    const { nodes: nTemp, edges: eTemp } = await LoadData();
    nodes = nTemp ?? [];
    edges = eTemp ?? [];
    options = {
      ...options,
      series: [
        {
          // @ts-ignore
          ...options.series[0],
          data: nodes,
          links: edges,
        },
      ],
    };

    loaded = true;
  });
</script>

<main>
  <div class="chart-root">
    <h4>Chart of dependencies V: {packageData.version}</h4>
    <div id="full-d" class="full">
      <Chart {options} {events} renderer="svg" />
    </div>
  </div>
</main>

<style>
  .full {
    width: 100%;
    height: var(--view-height);
  }
  .chart-root {
    height: var(--view-height);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

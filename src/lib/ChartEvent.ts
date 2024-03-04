export interface ChartEvent {
    type: string;
    filter: any;
    event: (params: any) => void;
}
export { };

interface ConfluenceExportView {
    body: {
        export_view: {
            value: string;
        }
    }
}
declare global {
    interface Window {
        // takes an input of a confluence Content Id, and returns the export_view content 
        fetchConfluence: (id: string) => Promise<ConfluenceExportView>;
    }
}
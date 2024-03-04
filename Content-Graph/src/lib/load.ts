function parseTable(html: string): any[] {
    const table = document.createElement('table');
    table.innerHTML = html;
    const rows = Array.from(table.getElementsByTagName('tr'));
    const headers = Array.from(rows.shift()?.getElementsByTagName('th') ?? []).map(th => th.textContent);
    return rows.map(row => {
        const cells = Array.from(row.getElementsByTagName('td'));
        return headers.reduce((obj, header, index) => {
            const cell = cells[index];
            const link = cell.querySelector('a');
            if (link) {
                // @ts-ignore
                obj[`${header}`] = link.textContent;
                // @ts-ignore
                obj[`${header}_url`] = link.href;
            } else {
                const temp = (cell?.textContent ?? '').trim();
                if (temp !== '') {
                    // @ts-ignore
                    obj[header] = cell?.textContent;
                }
            }
            return obj;
        }, {});
    });
}
interface Label {
    show: boolean;
    formatter?: string;
}
interface Node {
    id: string;
    URL?: string;
    label?: Label;
    symbolSize?: number;
}

interface Edge {
    source: string;
    target: string;
    label?: Label;
    lineStyle?: any;
}
const createEdgesAndNodes = (table: any[]) => {
    const edges: Edge[] = [];
    const nodes: Node[] = table.map(x => {
        return {
            id: x.Title,
            URL: x.Title_url,
            symbolSize: 30,
            label: {
                show: true,
                formatter: x.Title
            }
        }
    })
    table.forEach(x => {
        Object.keys(x).forEach(key => {
            if (key.includes('relationship:')) {
                if (nodes.find(n => n.id === x[key]) === undefined) {
                    nodes.push({
                        id: x[key],
                        label: {
                            show: true,
                            formatter: x[key],
                        },
                        symbolSize: 30,
                    });
                }
                const name = key.replace('relationship:', '').trimStart().trimEnd()
                edges.push({
                    source: x.Title,
                    target: x[key],
                    label: {
                        show: false,
                        formatter: `${name}`
                    },
                    lineStyle: {
                        width: 2,
                        color: 'grey',
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10
                    }

                })
            }
        })
    })

    return { nodes, edges }

}

export async function LoadData() {
    try {
        let body = "";
        if (window.fetchConfluence) {
            const data = await window.fetchConfluence('7831683')
            body = data.body.export_view.value;
        } else {
            // debug value
            body = "<div class=\"table-wrap\"><table class=\"aui metadata-summary-macro null\" data-cql=\"null\" data-details-id=\"Render\" data-first-column-heading=\"Title\" data-count-comments=\"false\" data-count-likes=\"false\"data-total-pages=\"1\" data-page-size=\"30\" data-sort-by=\"null\" data-reverse-sort=\"false\" data-blueprint-present=\"false\" data-current-space-key=\"~557058a1ada4e4df744318a9e5882113dc327d\" data-current-content-id=\"7831683\"><thead><tr><th>Title</th><th><p xmlns=\"http://www.w3.org/1999/xhtml\" /></th><th><p xmlns=\"http://www.w3.org/1999/xhtml\"><strong>Name</strong></p></th><th><p xmlns=\"http://www.w3.org/1999/xhtml\"><strong>relationship:is Hosted by</strong></p></th><th><p xmlns=\"http://www.w3.org/1999/xhtml\"><strong>relationship:is dependent on</strong></p></th></tr></thead><tbody><tr><td class=\"title\" data-content-id=\"7635094\"><a href=\"/wiki/spaces/~557058a1ada4e4df744318a9e5882113dc327d/pages/7635094/Child+Page+1\">Child Page 1</a></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\" /></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Child Page 1</p></td><td>&nbsp;</td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Parent Page</p></td></tr><tr><td class=\"title\" data-content-id=\"7929859\"><a href=\"/wiki/spaces/~557058a1ada4e4df744318a9e5882113dc327d/pages/7929859/Child+Page+2\">Child Page 2</a></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\" /></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Child Page 2</p></td><td>&nbsp;</td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Parent Page</p></td></tr><tr><td class=\"title\" data-content-id=\"7667834\"><a href=\"/wiki/spaces/~557058a1ada4e4df744318a9e5882113dc327d/pages/7667834/Parent+Page\">Parent Page</a></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\" /></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Parent Page</p></td><td><p xmlns=\"http://www.w3.org/1999/xhtml\">Root</p></td><td>&nbsp;</td></tr></tbody></table></div><p />"
        }

        const table = parseTable(body);
        const { nodes, edges } = createEdgesAndNodes(table);
        return { nodes, edges }
        // Handle the retrieved data here
    } catch (error) {
        // Handle any errors that occurred during the fetch request
        console.error({ error });
        return { nodes: null, edges: null }
    }
}

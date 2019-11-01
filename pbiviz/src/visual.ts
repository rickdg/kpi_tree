module powerbi.extensibility.visual {

    namespace AnnotationAndLegend {
        //  Legend value
        interface lenVal {
            L1: any;
            L2: any;
            L3: any;
            L4: any;
        }

        //  Annotation value
        interface annotVal {
            R1: any;
            R2: any;
            R3: any;
        }

        //  Legend html object
        export class TreeLegend {
            x: number;
            y: number;
            values: lenVal;
            public constructor(x: number, y: number, values: lenVal) {
                this.x = x;
                this.y = y;
                this.values = values;
            }

            /**
             * Create html legend object.
             */
            public DrawLegendHTML() {
                let TableHtmlVal: string;
                let TableTag = "<table id='legend' class='legTable'>";
                let TableHeaderTag = "<thead><tr><th></th></tr></thead>";
                let bodyTag = "<tbody>";
                TableHtmlVal = "";
                TableHtmlVal = TableHtmlVal + TableTag + TableHeaderTag + bodyTag;

                TableHtmlVal = TableHtmlVal + "<tr class = 'red'>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.L1 + "</td>";
                TableHtmlVal = TableHtmlVal + "<tr/>";

                TableHtmlVal = TableHtmlVal + "<tr class = 'green'>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.L2 + "</td>";
                TableHtmlVal = TableHtmlVal + "<tr/>";

                TableHtmlVal = TableHtmlVal + "<tr class = 'yellow'>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.L3 + "</td>";
                TableHtmlVal = TableHtmlVal + "<tr/>";

                TableHtmlVal = TableHtmlVal + "<tr class = 'gray'>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.L4 + "</td>";
                TableHtmlVal = TableHtmlVal + "<tr/>";

                TableHtmlVal = TableHtmlVal + "</tbody>";
                TableHtmlVal = TableHtmlVal + "</table>";
                return TableHtmlVal;
            }
        }

        //  Annotation html object
        export class Annotation {
            values: annotVal;
            public constructor(values: annotVal) { this.values = values; }

            /**
             * Create html annotation object.
             */
            public DrawAnnotationHTML() {
                let TableHtmlVal: string;
                let TableTag = "<table  id='annotation' class='annoTable'>";
                let TableHeaderTag = "<thead><tr><th></th></tr></thead>";
                let bodyTag = "<tbody>";
                TableHtmlVal = "";
                TableHtmlVal = TableHtmlVal + TableTag + TableHeaderTag + bodyTag;

                TableHtmlVal = TableHtmlVal + "<tr>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.R1 + "</td>";
                TableHtmlVal = TableHtmlVal + "</tr>";

                TableHtmlVal = TableHtmlVal + "<tr>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.R2 + "</td>";
                TableHtmlVal = TableHtmlVal + "</tr>";

                TableHtmlVal = TableHtmlVal + "<tr>";
                TableHtmlVal = TableHtmlVal + "<td>" + this.values.R3 + "</td>";
                TableHtmlVal = TableHtmlVal + "</tr>";

                TableHtmlVal = TableHtmlVal + "</tbody>";
                TableHtmlVal = TableHtmlVal + "</table>";
                return TableHtmlVal;
            }
        }

        /**
         * Draw svg legend using html object. 
         * @param x root's x coordinate
         * @param _this update scope
         * @param _root root node
         * @param distance distance between two next level nodes
         */
        export function DrawLegend(x, _this, _root, distance) {
            //default value displayed
            let mylegVal: lenVal = {
                'L1': 'Current <= Target',
                'L2': 'Current > Target',
                'L3': 'Extendable or empty node',
                'L4': 'Target not available',
            }

            let obj = new TreeLegend(x, _root.depth * distance, mylegVal);

            if (_this.settings.Legend.enable) {
                if (!(_this.settings.Legend.L1 || _this.settings.Legend.L2 || _this.settings.Legend.L3 || _this.settings.Legend.L4))
                    _this.svgG.append("foreignObject").attr('x', x + 450).attr('y', _root.depth * distance).attr("width", 500).attr('height', 100).html(obj.DrawLegendHTML());
                else {
                    if (_this.settings.Legend.L1) mylegVal.L1 = _this.settings.Legend.L1;
                    if (_this.settings.Legend.L2) mylegVal.L2 = _this.settings.Legend.L2;
                    if (_this.settings.Legend.L3) mylegVal.L3 = _this.settings.Legend.L3;
                    if (_this.settings.Legend.L4) mylegVal.L4 = _this.settings.Legend.L4;
                    _this.svgG.append("foreignObject").attr('x', x + 450).attr('y', _root.depth * distance).attr("width", 500).attr('height', 100).html(obj.DrawLegendHTML());
                }
            } else { }
        }

        /**
         * Draw svg annotation using html object. 
         * @param x root's x coordinate
         * @param _this update scope
         * @param _root root node
         * @param distance distance between two next level nodes
         */
        export function DrawBlockAnnotation(x, _this, _root, distance) {
            //default value displayed
            let myanoVal: annotVal = { 'R1': 'Cost', 'R2': 'Time', 'R3': 'Delta' };
            let obj = new Annotation(myanoVal);
            if (!(_this.settings.BlockAnnotation.R1 || _this.settings.BlockAnnotation.R2 || _this.settings.BlockAnnotation.R3)) {
                _this.svgG.append("foreignObject").attr('x', x + 189).attr('y', _root.depth * distance + 35).attr("width", 200).attr("height", 60).html(obj.DrawAnnotationHTML());
            }
            else if (_this.settings.BlockAnnotation.R1 || _this.settings.BlockAnnotation.R2 || _this.settings.BlockAnnotation.R3) {
                if (_this.settings.BlockAnnotation.R1) myanoVal.R1 = _this.settings.BlockAnnotation.R1;
                if (_this.settings.BlockAnnotation.R2) myanoVal.R2 = _this.settings.BlockAnnotation.R2;
                if (_this.settings.BlockAnnotation.R3) myanoVal.R3 = _this.settings.BlockAnnotation.R3;
                _this.svgG.append("foreignObject").attr('x', x + 189).attr('y', _root.depth * distance + 35).attr("width", 200).attr("height", 60).html(obj.DrawAnnotationHTML());
            }
        }

    }

    namespace Print {
        let Base64 = (<any>window).Base64;

        /**
         * Set css style for all svg elements when capturing.
         * @param svg svgElement
         */
        function setCapturedCss(svg: SVGElement) {
            svg.setAttribute('style', 'height:700px;padding: 10px; display: block; min-width:99%;background: white')

            let tables = svg.getElementsByClassName('dataTable')
            for (let i = 0; i < tables.length; i++) {
                tables[i].setAttribute('style', 'font-family: Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;text-align: center;background-color: whitesmoke;border: 0.5px solid black;')
            }

            let table_ths = svg.getElementsByClassName('dataTable-th')
            for (let i = 0; i < table_ths.length; i++) {
                table_ths[i].setAttribute('style', 'padding-top: 1px;padding-bottom: 1px;border: 1px solid black;font-size: 11px;')
            }

            let table_tds = svg.getElementsByClassName('dataTable-td')
            for (let i = 0; i < table_tds.length; i++) {
                table_tds[i].setAttribute('style', 'border: 1px solid black;padding: 0px;font-size: 11px;height: 16px;width: 25%;')
            }

            let green_trs = svg.getElementsByClassName('green')
            for (let i = 0; i < green_trs.length; i++) {
                green_trs[i].setAttribute('style', 'background-color: #39a31f;border: 1px solid black;color: white;font-size: 12px')
            }

            let red_trs = svg.getElementsByClassName('red')
            for (let i = 0; i < red_trs.length; i++) {
                red_trs[i].setAttribute('style', 'background-color: #fc4949;border: 1px solid black;color: white;font-size: 12px')
            }

            let gray_trs = svg.getElementsByClassName('gray')
            for (let i = 0; i < gray_trs.length; i++) {
                gray_trs[i].setAttribute('style', 'background-color: #BFC0C2;border: 1px solid black;color: white;font-size: 12px')
            }

            let yellow_trs = svg.getElementsByClassName('yellow')
            for (let i = 0; i < yellow_trs.length; i++) {
                yellow_trs[i].setAttribute('style', 'background-color: #fcdb32;border: 1px solid black;color: white;font-size: 12px')
            }

            let node_header = svg.getElementsByClassName('boxhead')
            for (let i = 0; i < node_header.length; i++) {
                node_header[i].setAttribute('style', 'font-weight:bold;text-align: center;font-size: 13px;fill: white;text-anchor: middle;')
            }

            let annotations = svg.getElementsByClassName('annoTable')
            for (let i = 0; i < annotations.length; i++) {
                annotations[i].setAttribute('style', 'font-size:11px;font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;font-weight: bold;line-height: 15px;')
            }

            let legends = svg.getElementsByClassName('legTable')
            for (let i = 0; i < legends.length; i++) {
                legends[i].setAttribute('style', 'border-spacing: 0px;')
            }

            let drills = svg.getElementsByClassName('drillCrc')
            for (let i = 0; i < drills.length; i++) {
                drills[i].setAttribute('style', 'fill: #e8ecf2;opacity: 1;')
            }

            let prevs = svg.getElementsByClassName('prevCrc')
            for (let i = 0; i < prevs.length; i++) {
                prevs[i].setAttribute('style', 'fill: #e8ecf2;opacity: 1;')
            }

            let nexts = svg.getElementsByClassName('nextCrc')
            for (let i = 0; i < nexts.length; i++) {
                nexts[i].setAttribute('style', 'fill: #e8ecf2;opacity: 1;')
            }

            let arrows = svg.getElementsByClassName("arrow")
            for (let i = 0; i < arrows.length; i++) {
                arrows[i].setAttribute('style', 'stroke: black;stroke-width: 1.2; fill: none;')
            }

            let footer_td = svg.getElementsByClassName('footer')
            for (let i = 0; i < footer_td.length; i++) {
                footer_td[i].setAttribute('style', 'width: 50%;border: 1px solid black')
            }
        }

        /**
         * Hide buttons when capturing.
         * @param _this update scope    
         * @param _root root node
         * @param nodeHeight 
         * @param nodeWidth 
         * @param distance distance between two next level nodes 
         */
        function hideButtonsWhenCapture(_this, _root, nodeHeight, nodeWidth, distance) {
            let rootE = document.getElementById("root");
            let rootX: number;
            rootX = +rootE.getAttribute("x");
            _this.svgG.append("rect").attr("x", rootX + 275).attr("y", _root.depth * distance).attr("width", 150).attr("height", nodeHeight / 2)
                .attr("fill", "white").attr("opacity", "1")
        }

        /**
         * Convert svg element to image and save it.
         * @param _this update scope 
         * @param _root root node
         * @param nodeHeight 
         * @param nodeWidth 
         * @param distance distance between two next level nodes
         */
        export function saveImage(_this, _root, nodeHeight, nodeWidth, distance) {
            let svg = document.querySelector("svg");
            let bgColor = svg.getAttribute("style");
            console.log(bgColor);

            let svgWidth = +svg.getAttribute("width");
            let svgHeight = +svg.getAttribute("height");

            let rootX = +document.getElementById("root").getAttribute("x");
            let offset = 650;

            var captureH = svgHeight + 125;
            var captureW = Math.max(svgWidth + 25, rootX + offset);

            svg.setAttribute("height", "" + captureH);
            svg.setAttribute("width", "" + captureW);

            //  Set inline css for all elements
            setCapturedCss(svg);

            hideButtonsWhenCapture(_this, _root, nodeHeight, nodeWidth, distance);

            let img = new Image(), serializer = new XMLSerializer(), svgStr = serializer.serializeToString(svg);
            img.src = 'data:image/svg+xml;base64,' + Base64.encode(svgStr);

            let canvas = document.createElement("canvas");

            // Ratio to define real canvas size
            let ratio = 4;

            let w = captureW * ratio;
            let h = captureH * ratio;
            canvas.width = w;
            canvas.height = h;

            let ctx = canvas.getContext("2d");

            img.setAttribute("src", "data:image/svg+xml;base64," + Base64.encode(svgStr));

            //  Download image func
            img.onload = function () {
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(function (blob) {
                    window.saveAs(blob, "KPITree.jpg");
                }, 'image/jpg');
            }

            //  Refresh to default background color after capturing
            svg.setAttribute('style', 'background: rgb(230, 217, 217) transparent')
        }
    }

    namespace Filter {
        export let isFiltered = false;

        /**
         * Filter to get node in other visualizations in a report.
         * @param node selected node
         * @param condition 
         * @param _this update scope
         * @param categorical options.dataViews[0].categorical 
         */
        export function filterAPI(node, condition, _this, categorical) {
            let categories: DataViewCategoricalColumn = categorical.categories[7];
            let target: IFilterColumnTarget = {
                table: categories.source.queryName.substr(0, categories.source.queryName.indexOf('.')),
                column: categories.source.displayName
            };
            let values = node.fullPath
            let filter: IBasicFilter = new window['powerbi-models'].BasicFilter(target, "In", values);
            if (condition == "true")
                _this.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);    //  Apply filter
            else
                _this.host.applyJsonFilter(filter, "general", "filter", FilterAction.remove);   //  Remove filter      

            isFiltered = (condition == "true") ? true : false;
        }
    }

    namespace NodeHandling {
        //  Table value
        export interface DataPointItem {
            col0: any;
            col1: any;
            col2: any;
            col3: any;
        }

        //  Coordinate value for draw coonection line between nodes
        export interface Point {
            x: number;
            y: number;
        }

        //  Table value array for many rows
        export interface DataPointItems extends Array<DataPointItem> { }

        //  Table in node html object
        export class TableNode {
            x: number;
            y: number;
            header: string;
            value: DataPointItems;

            public constructor(x: number, y: number, header: string, value: DataPointItems) {
                this.x = x;
                this.y = y;
                this.header = header;
                this.value = value;
            }

            /**
             * Create html node object.
             * @param measure_list 
             * @param node_color 
             */
            public GetDrawMyNode(measure_list, node_color) {

                let TableHtmlVal: string;
                TableHtmlVal = "";
                let TableTag = "<table id='analysisData' class = 'dataTable'>";
                let TableHeaderTag = "";
                let col0Name = measure_list[0].substring(2, measure_list[0].length);
                let col1Name = measure_list[1].substring(2, measure_list[1].length);
                let col2Name = measure_list[2].substring(2, measure_list[2].length);
                let col3Name = measure_list[3].substring(2, measure_list[3].length);

                TableHeaderTag = "<thead><tr><th class = 'dataTable-th'>" + col0Name + "</th><th class = 'dataTable-th'>" + col1Name + "</th><th class = 'dataTable-th'>" + col2Name + "</th><th class = 'dataTable-th'>" + col3Name + "</th></thead>";

                let bodyTag = "<tbody>";
                TableHtmlVal = TableHtmlVal + TableTag + TableHeaderTag + bodyTag;
                this.value.forEach((element) => {
                    TableHtmlVal = TableHtmlVal + "<tr>";
                    TableHtmlVal = TableHtmlVal + "<td class = 'dataTable-td'>" + element.col0 + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td class = 'dataTable-td'>" + element.col1 + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td class = 'dataTable-td'>" + element.col2 + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td class = 'dataTable-td'>" + element.col3 + "</td>";
                    TableHtmlVal = TableHtmlVal + "</tr>";
                });

                let footer_curr_result = Utils.diffCurrencyValues(this.value[0].col0.toString().trim(), this.value[0].col3.toString().trim());
                let footer_day_result = (+(this.value[1].col3 - this.value[1].col0) || +(this.value[1].col3 - this.value[1].col0) == 0) ? +(this.value[1].col3 - this.value[1].col0).toFixed(1) + " days" : "--";

                if (node_color == 0) {
                    TableHtmlVal = TableHtmlVal + "<tr class='green'>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_curr_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_day_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "</tr>";
                }
                else if (node_color == 1) {
                    TableHtmlVal = TableHtmlVal + "<tr class='red'>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_curr_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_day_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "</tr>";
                }
                else if (node_color == 2) {
                    TableHtmlVal = TableHtmlVal + "<tr class='gray'>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_curr_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + footer_day_result + "</td>";
                    TableHtmlVal = TableHtmlVal + "</tr>";
                }
                else {
                    TableHtmlVal = TableHtmlVal + "<tr class='yellow'>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + "--" + "</td>";
                    TableHtmlVal = TableHtmlVal + "<td colspan='2' class='footer'>" + "--" + "</td>";
                    TableHtmlVal = TableHtmlVal + "</tr>";
                }

                TableHtmlVal = TableHtmlVal + "</tbody>";
                TableHtmlVal = TableHtmlVal + "</table>";
                return TableHtmlVal;
            }
        }

        /**
         * Node's constructor.
         * @param data 
         * @param parent 
         * @param index 
         * @param path full-path
         * @param depth 
         * @param path4Filter full-path use for filtering 
         */
        export function Nodex(data: string, parent, index: number, path: string, depth: number, path4Filter: string) {
            this.data = data;
            this.parent = parent;
            this.children = [];
            this.hiddenChildren = [];
            this.sums = []; // .sums[0] is reserved for count of subchildren
            this.prelim = 0;
            this.modif = 0;
            this.final = 0;
            this.shifted = -1; //!!
            this.substitution = false;
            this.fullPath = path;
            this.index = index;
            this.depth = depth;
            this.path4Filter = path4Filter;
        }

        /**
         * Render value into table in each node.
         * @param node 
         * @param attr measure
         * @param line 
         * @param maxColumns 
         * @param categorical options.dataViews[0].categorical 
         * @param realnumCateg number of category of the tree 
         */
        export function renderVal(node, attr, line, maxColumns, categorical, realnumCateg) {
            let temp = "";
            let retVal: any;
            for (let x = 0; x < maxColumns; x++) {
                for (let i = 0; i < realnumCateg; i++) {
                    if (categorical.categories[i].values[x] === null || categorical.categories[i].values[x] === "") {
                        categorical.categories[i].values[x] = "";
                    }
                }

                temp = categorical.categories[0].values[x] + "" + categorical.categories[1].values[x] + categorical.categories[2].values[x] + categorical.categories[3].values[x] + categorical.categories[4].values[x];
                if (node.fullPath === temp && attr == categorical.categories[realnumCateg + 1].values[x] && line == categorical.categories[realnumCateg].values[x]) {
                    retVal = categorical.values[0].values[x];
                    return retVal;
                }
            }
            return retVal;
        }

        /**
         * Render color for each node.
         * @param node 
         * @param attr measure
         * @param line 
         * @param maxColumns 
         * @param categorical options.dataViews[0].categorical 
         * @param realnumCateg number of category of the tree 
         */
        export function renderColor(node, attr, line, maxColumns, categorical, realnumCateg) {
            let temp = "";
            let retVal: any;
            for (let x = 0; x < maxColumns; x++) {
                for (let i = 0; i < realnumCateg; i++) {
                    if (categorical.categories[i].values[x] === null || categorical.categories[i].values[x] === "") {
                        categorical.categories[i].values[x] = "";
                    }
                }
                temp = categorical.categories[0].values[x] + "" + categorical.categories[1].values[x] + categorical.categories[2].values[x] + categorical.categories[3].values[x] + categorical.categories[4].values[x];
                if (node.fullPath === temp && attr == categorical.categories[realnumCateg + 1].values[x] && line == categorical.categories[realnumCateg].values[x])
                    retVal = categorical.values[1].values[x];

            }
            return retVal;
        }
    }

    namespace Utils {
        function log10(val) {
            return Math.round(Math.log(val) / Math.LN10);
        }

        /**
         * Abbreviate big number with different unit (K, M, B, T) .
         * @param value 
         */
        function abbreviateNumber(value) {
            let result = {
                sign: value < 0 ? "-" : "+",
                value: ""
            }
            let _value = Math.abs(value);

            let numDigit = log10(_value);

            if (numDigit < 3) {
                result.value = _value.toFixed(1);
            }
            else if (numDigit < 6) {
                result.value = (_value / Math.pow(10, 3)).toFixed(1) + "K"; //K
            }
            else if (numDigit < 9) {
                result.value = (_value / Math.pow(10, 6)).toFixed(1) + "M"; //"M"
            }
            else if (numDigit < 12) {
                result.value = (_value / Math.pow(10, 9)).toFixed(1) + "B"; //"B"
            }
            else if (numDigit < 15) {
                result.value = (_value / Math.pow(10, 15)).toFixed(1) + "T"; //"T"
            }
            else {
                result.value = _value.toFixed(1); //Too big ...
            }

            return result;
        }

        export function sort_unique(a) {
            return a.sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })
        }

        /**
         * Check if null, na, or empty values.
         * @param value 
         */
        function hasValue(value: any): boolean {
            return ((value != null) && (value.toString().trim() != ""));
        }

        /**
         * Check numeric format.
         * @param value 
         */
        export function isNumber(value: string | number): boolean {
            return (hasValue(value) && !isNaN(Number(value.toString())));
        }

        /**
         * Check numeric format for rendering.
         * @param value 
         */
        export function isNumberForRender(value: string | number): boolean {
            return ((value != null) && !isNaN(Number(value.toString())) && (value.toString().trim() != ""));
        }

        /**
         * Footer result calculation.
         * @param x1 
         * @param x2 
         */
        export function diffCurrencyValues(x1: any, x2: any): string {
            let numAbbDict = {
                "N": 1,
                "K": Math.pow(10, 3),
                "M": Math.pow(10, 6),
                "B": Math.pow(10, 9),
                "T": Math.pow(10, 12)
            }

            if (!(hasValue(x1) && hasValue(x2)) || x1 == "--" || x2 == "--") {
                return "--";
            }

            //Get currency unit
            let currency = x1.substring(0, 1);

            //Take the last character to identify the unit K, M, B or T
            //Return empty string if 
            let unit1 = isNumber(x1.substring(x1.length - 1)) ? "N" : x1.substring(x1.length - 1);
            let unit2 = isNumber(x2.substring(x2.length - 1)) ? "N" : x2.substring(x2.length - 1);

            let val1: number = (unit1 == "N") ? +x1.substring(1, x1.length) : +x1.substring(1, x1.length - 1);
            let val2: number = (unit2 == "N") ? +x2.substring(1, x2.length) : +x2.substring(1, x2.length - 1);

            //Mutiply with respective factor
            val1 = numAbbDict[unit1] * val1;
            val2 = numAbbDict[unit2] * val2;

            //Return the footer result
            let result = abbreviateNumber(val2 - val1);

            return (result.sign + currency + result.value);
        }

        /**
         * Check if null value.
         * @param value 
         */
        export function isNotNull(value: string | number): boolean {
            return ((value != null) && !(value.toString().trim() == ''));
        }

        /**
         * Copy an object.
         * @param aObject 
         */
        export function copy(aObject) {
            if (!aObject) {
                return aObject;
            }

            let v;
            let bObject = Array.isArray(aObject) ? [] : {};
            for (const k in aObject) {
                v = aObject[k];
                bObject[k] = (typeof v === "object") ? copy(v) : v;
            }

            return bObject;
        }
    }

    "use strict";
    export class Visual implements IVisual {

        private svg: d3.Selection<SVGElement>;
        private svgG: d3.Selection<SVGElement>;
        private settings: VisualSettings;
        private previousUpdateData;
        private host: IVisualHost;
        private tooltips: VisualTooltipDataItem[];
        private element;
        private flag = false;

        constructor(options: VisualConstructorOptions) {
            this.svg = d3.select(options.element).append("svg").attr("class", "svg").attr("style", "height:700px")
            options.element.style.overflow = 'auto';
            this.host = options.host;
            this.element = options.element;
        }

        public update(options: VisualUpdateOptions) {
            //check filter status to update
            if (this.flag == false) {
                if (JSON.stringify(options.dataViews) == this.previousUpdateData)
                    return
                else
                    this.previousUpdateData = JSON.stringify(options.dataViews);
            } else return

            // Clean everything
            this.svg.selectAll("g").remove();
            this.svgG = this.svg.append("g")

            // Check if data are available and declare useful variables
            let _this = this;
            let dataViews = options.dataViews;


            if (!dataViews || !dataViews[0] || !dataViews[0].categorical || !dataViews[0].categorical.categories || !dataViews[0].categorical.categories[0].source) // || !dataViews[0].categorical.values)
                return;
            let categorical = options.dataViews[0].categorical;
            let maxColumns = categorical.categories[0].values.length;
            let maxRows = categorical.categories.length;
            let valuesRows = categorical.values ? categorical.values.length : 0;
            let nodeSeparator = 30;
            let nodeWidth = 185;
            let maxWidth = nodeWidth;
            let negWidth = 0;
            let maxDepth = 1;
            let boxClips;
            let nodeHeight = 87;
            let distance = 118;
            let circleRelativePos = 95;
            let realnumCateg = categorical.categories.length - 3;
            var measure_array = Utils.copy(categorical.categories[6].values);
            let measure_list = Utils.sort_unique(measure_array);
            let node_color = 0;
            let selectedNode = new NodeHandling.Nodex(null, null, null, null, 0, "");

            // Get settings from formatting
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

            function fillSubTree(p, depth) // p is parent
            {
                if (depth >= maxRows)
                    return;
                let retval = new Array(valuesRows + 1);
                for (let i = 0; i < valuesRows + 1; i++)
                    retval[i] = 0;
                for (let i = 0; i < maxColumns; i++) {
                    let parentsFit = true;
                    let tmpNodex = p;

                    if (depth > realnumCateg - 1) // - line, measure, value ==>  number of category
                        parentsFit = false;
                    for (let j = depth; j > 0; j--) {
                        if (categorical.categories[j].values[i] === "" || categorical.categories[j].values[i] === null) {
                            parentsFit = false;
                            break;
                        }

                        if (tmpNodex.data != (categorical.categories[j - 1].values[i] === null ? "(Blank)" : categorical.categories[j - 1].values[i].toString())) {
                            parentsFit = false;
                            break;
                        }
                        tmpNodex = tmpNodex.parent;
                    }
                    if (parentsFit) {
                        let push = true;
                        for (let child of p.children) {
                            if (child.data == (categorical.categories[depth].values[i] === null ? "(Blank)" : categorical.categories[depth].values[i].toString())) {
                                push = false;
                                break;
                            }
                        }
                        if (push) {
                            let path = "";
                            let pathArr = [];
                            for (let j = 0; j <= depth; j++) {
                                path += categorical.categories[j].values[i];
                                pathArr.push("" + categorical.categories[j].values[i] + j);

                            }
                            let filterPath = pathArr.join(">");
                            // console.log(path); 

                            tmpNodex = new NodeHandling.Nodex((categorical.categories[depth].values[i] === null ? "(Blank)" : categorical.categories[depth].values[i].toString()), p, i, path, depth, filterPath);
                            if (depth == maxRows - 1) {
                                tmpNodex.sums[0] = 1;
                                retval[0] += 1;
                                for (let j = 1; j < valuesRows + 1; j++) {
                                    tmpNodex.sums[j] = parseFloat(categorical.values[j - 1].values[i].toString());
                                    retval[j] += tmpNodex.sums[j];
                                }
                            }
                            else {
                                tmpNodex.sums = fillSubTree(tmpNodex, depth + 1);
                                for (let j = 0; j < valuesRows + 1; j++)
                                    retval[j] += tmpNodex.sums[j];
                            }
                            p.children.push(tmpNodex);
                        }
                    }
                }
                return retval;
            }

            function hide(node, top) {
                if (node == null)
                    return;
                while (node.children.length > top) {
                    let tmpNodex = node.children.pop();
                    if (!tmpNodex.substitution)
                        node.hiddenChildren.unshift(tmpNodex);
                    hideAll(tmpNodex);
                }
                if (node.children.length > 0 && node.hiddenChildren.length > 0) {
                    let substNode = new NodeHandling.Nodex("+ " + node.hiddenChildren.length, node, node.index, "", 0, "");
                    substNode.substitution = true;
                    substNode.sums = [0];
                    for (let i = 0; i <= valuesRows; i++) {
                        substNode.sums[i] = 0;
                        for (let j = 0; j < node.hiddenChildren.length; j++)
                            substNode.sums[i] += node.hiddenChildren[j].sums[i];
                    }
                    node.children.push(substNode);
                }
            }

            function hideAll(node) {
                for (let i = 0; node.children.length > i; i++) {
                    hideAll(node.children[i]);
                }
                hide(node, 0);
            }

            function unhide(node, top) {
                if (node == null)
                    return;
                if (node.children.length > 0 && node.children[node.children.length - 1].substitution) {
                    node.children.pop();
                }
                if (node.children.length + node.hiddenChildren.length == top + 1) {
                    top++;
                }
                while (node.children.length < top && node.hiddenChildren.length != 0) {
                    node.children.push(node.hiddenChildren.shift());
                }
                if (node.children.length > 0 && node.hiddenChildren.length > 0) {
                    let substNode = new NodeHandling.Nodex("+ " + node.hiddenChildren.length, node, node.index, "", 0, "");
                    substNode.substitution = true;
                    substNode.sums = [0];
                    for (let i = 0; i <= valuesRows; i++) {
                        substNode.sums[i] = 0;
                        for (let j = 0; j < node.hiddenChildren.length; j++)
                            substNode.sums[i] += node.hiddenChildren[j].sums[i];
                    }
                    node.children.push(substNode);
                }
            }

            function unhideAll(node, intoDepth) {
                if (intoDepth <= 0)
                    return;
                let unhideDown = true;
                if (!_this.settings.KPITreeSettings.drillBlank)
                    unhideDown = !isLastReasonable(node, "(Blank)");
                if (!_this.settings.KPITreeSettings.drillEmpty)
                    unhideDown = unhideDown && !isLastReasonable(node, "");
                if (unhideDown) {
                    unhide(node, _this.settings.KPITreeSettings.showLimit);
                }
                for (let i = 0; node.children.length > i; i++) {
                    unhideAll(node.children[i], intoDepth - 1);
                }
            }


            function isLastReasonable(node, nonreasonable) {
                if (node.hiddenChildren.length + node.children.length == 0)
                    return true;
                else if (node.children.length > 0)
                    return false;
                else if (node.hiddenChildren.length != 1 || node.hiddenChildren[0].data != nonreasonable)
                    return false;
                else
                    return isLastReasonable(node.hiddenChildren[0], nonreasonable);
            }

            function rightmost(node, depth) {
                if (depth == 1) // i should return value of my rightmost child
                {
                    if (node.children.length > 0) {
                        let retval = node.children[node.children.length - 1].prelim;
                        let tmpNodex = node;
                        while (tmpNodex.parent != null) {
                            retval += tmpNodex.modif;
                            tmpNodex = tmpNodex.parent;
                        }
                        return retval;
                    }
                    else
                        return -1000000;
                }
                else if (node.children.length > 0) {
                    let maximum = -1000000;
                    for (let i = 0; i < node.children.length; i++) {
                        maximum = Math.max(maximum, rightmost(node.children[i], depth - 1));
                    }
                    return maximum;
                }
                else
                    return -1000000;
            }

            function leftmost(node, depth) {
                if (depth == 1) // i should return value of my leftmost child
                {
                    if (node.children.length > 0) {
                        let retval = node.children[0].prelim;
                        let tmpNodex = node;
                        while (tmpNodex.parent != null) {
                            retval += tmpNodex.modif;
                            tmpNodex = tmpNodex.parent;
                        }
                        return retval;
                    }
                    else
                        return +1000000;
                }
                else if (node.children.length > 0) {
                    let maximum = +1000000;
                    for (let i = 0; i < node.children.length; i++) {
                        maximum = Math.min(maximum, leftmost(node.children[i], depth - 1));
                    }
                    return maximum;
                }
                else
                    return +1000000;
            }

            function firstWalk(node) {
                if (node == null)
                    return;
                node.children.forEach(firstWalk);
                let shifting = false;

                if (node.parent != null) {
                    if (node.parent.children[0] == node && node.children.length != 0) {
                        node.prelim = (node.children[0].prelim + node.children[node.children.length - 1].prelim) / 2;
                    }
                    else if (node.parent.children[0] == node && node.children.length == 0) {
                        node.prelim = 0;
                    }
                    else if (node.children.length == 0) {
                        let i = 0;
                        for (; i < node.parent.children.length; i++)
                            if (node.parent.children[i] == node)
                                break;
                        if (i > 0)
                            node.prelim = node.parent.children[i - 1].prelim + nodeSeparator + nodeWidth;
                    }
                    else {
                        let i = 0;
                        for (; i < node.parent.children.length; i++)
                            if (node.parent.children[i] == node)
                                break;
                        if (i > 0)
                            node.prelim = node.parent.children[i - 1].prelim + nodeSeparator + nodeWidth;
                        node.modif = node.prelim - (node.children[0].prelim + node.children[node.children.length - 1].prelim) / 2;
                        shifting = true;
                    }
                }

                if (shifting) // i am parent
                {
                    // care that neighbors children doesnt conflict with my children
                    let shift = 0;
                    for (let r = 0; r < maxRows; r++) {
                        for (let i = 0; i < node.parent.children.length && node.parent.children[i] != node; i++) {
                            shift = Math.max(shift, rightmost(node.parent.children[i], r) - leftmost(node, r) + nodeSeparator + nodeWidth);
                        }
                    }
                    node.modif += shift;
                    node.prelim += shift;
                    node.shifted = shift;
                }
            }

            function secondWalk(node, modifs) {
                if (node == null)
                    return;
                node.final = node.prelim + modifs;
                if (node.final > maxWidth)
                    maxWidth = node.final;
                if (node.final < negWidth)
                    negWidth = node.final;
                for (let i = 0; node.children.length > i; i++) {
                    secondWalk(node.children[i], node.modif + modifs);
                }
            }

            /**
             * Highlight selected node.
             * @param node 
             */
            function highlight(node) {
                drawAll();  //  Delete previous highlight (if needed)

                _this.svgG.append("rect").attr("x", node.final - negWidth).attr("y", node.depth * distance).attr("width", nodeWidth).attr("height", nodeHeight)
                    .attr("fill", "#d9d9d9").attr("opacity", "0.7").attr("stroke", _this.settings.KPITreeFormat.lines)
                    .attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx).on("click", () => {
                        drawAll();                                              //  Delete previous highlight
                        Filter.filterAPI(node, "false", _this, categorical);    //  Remove filter
                        _this.flag = false;                                     //  Enable filter from table to tree
                    });
            }

            /**
             * Control highlighting and filtering when clicking buttons.
             * @param node 
             * @param selectedNode 
             * @param button 
             */
            function highlightOnDrill(node, selectedNode, button) {
                let arrPath = node.path4Filter.split(">");

                switch (button) {
                    //  For drilldown buttons
                    case "drill": {
                        if (selectedNode.path4Filter == node.path4Filter && Filter.isFiltered) {
                            Filter.filterAPI(selectedNode, "true", _this, categorical);
                            highlight(selectedNode);
                        } else {
                            if (!Filter.isFiltered || selectedNode.path4Filter.includes(arrPath[arrPath.length - 1])) {
                                Filter.filterAPI(selectedNode, "false", _this, categorical);
                            } else {
                                Filter.filterAPI(selectedNode, "true", _this, categorical);
                                highlight(selectedNode);
                            }
                        }
                        break;
                    }
                    //  For previous buttons
                    case "previous": {
                        let s1 = selectedNode.path4Filter;
                        let s2 = node.path4Filter;
                        Filter.filterAPI(selectedNode, "false", _this, categorical);
                        break;
                    }
                    //  For next buttons
                    case "next": {
                        Filter.filterAPI(selectedNode, "false", _this, categorical);
                        break;
                    }
                }
            }

            /**
             * Draw svg button for capturing and saving image.
             * @param x root's x coordinate
             */
            function DrawCaptureButton(x) {
                _this.svgG.append('foreignObject').attr('x', x + 360).attr('y', _root.depth * distance).attr("width", 68).attr("height", 23).html("<button>Capture</button>")
                    .on("click", function () {
                        drawAll();
                        Print.saveImage(_this, _root, nodeHeight, nodeWidth, distance);
                        Filter.filterAPI(selectedNode, "false", _this, categorical);
                        drawAll();
                    })
            }

            /**
             * Draw collapse/extend nodes button.
             * @param x root's x coordinate
             */
            function DrawButton(x) {
                var state;
                if (_root.children.length == 0)
                    state = "Extend"
                else
                    state = "Collapse"
                let ColExtButton = _this.svgG.append('foreignObject').attr('x', x + 280).attr('y', _root.depth * distance).attr("width", 68).attr("height", 23)
                    .html("<button>" + state + "</button>").on("click", function (d) {
                        if (_root.children.length == 0) {
                            unhideAll(_root, _this.settings.KPITreeSettings.defaultDrillDown);
                        } else {
                            hideAll(_root);
                        }
                        drawAll();
                        Filter.filterAPI(selectedNode, "false", _this, categorical);
                    });
            }

            function finalDraw(node, depth, nth) {
                if (node == null)
                    return;
                for (let i = 0; node.children.length > i; i++) {
                    finalDraw(node.children[i], depth + 1, nth + ";" + i);
                }

                if (depth > maxDepth)
                    maxDepth = depth;

                //If header contain order number in front, exclude the number
                if (Utils.isNumberForRender(node.data.substring(0, 1))) {
                    node.data = node.data.substring(2, node.data.length)
                }

                let box = _this.svgG.append("g").attr("class", "box").attr("style", "clip-path: url(#boxClips)").attr("isClicked", "false")
                    .on("click", function (e) {
                        this.setAttribute("isClicked", (this.getAttribute("isClicked") == "false").toString());
                        _this.flag = true; //  Disable filter from table to tree

                        //  Do filter, highlight for selectedNode
                        if (!node.data.includes("+")) {
                            Filter.filterAPI(node, this.getAttribute("isClicked"), _this, categorical);
                            highlight(node);
                            selectedNode = node;
                        }
                    })
                    .on("mouseover", function (d) {
                        let e = d;
                        let tooltipData: VisualTooltipDataItem[] = [{
                            displayName: node.data,
                            value: '',
                            header: '',
                        }]
                        for (let i = 1; i <= valuesRows; i++) {
                            tooltipData.push({
                                displayName: '',
                                value: ''
                            })
                        }
                        _this.host.tooltipService.show({
                            dataItems: tooltipData,
                            identities: [],
                            coordinates: [(d3.mouse(this)[0] - _this.element.scrollLeft), (d3.mouse(this)[1] - _this.element.scrollTop)],
                            isTouchEvent: false
                        });
                    })
                    .on("mousemove", function (d) {
                        let tooltipData: VisualTooltipDataItem[] = [{
                            displayName: node.data,
                            value: '',
                            header: '',
                        }]
                        for (let i = 1; i <= valuesRows; i++) {
                            tooltipData.push({
                                displayName: '',
                                value: ''
                            })
                        }
                        _this.host.tooltipService.move({
                            dataItems: tooltipData,
                            identities: [],
                            coordinates: [(d3.mouse(this)[0] - _this.element.scrollLeft), (d3.mouse(this)[1] - _this.element.scrollTop)],
                            isTouchEvent: false,
                        });
                    })
                    .on("mouseout", function (d) {
                        _this.host.tooltipService.hide({
                            immediately: true,
                            isTouchEvent: false
                        });
                    });

                boxClips.append("rect").attr("x", node.final - negWidth).attr("y", depth * distance).attr("class", "boxbg").attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx).attr("width", nodeWidth).attr("height", nodeHeight);

                let fullWidth = (<SVGTextElement>box.append("text").attr("x", -1000).attr("y", -1000).attr("class", "boxhead").text(node.data).node()).getComputedTextLength();
                let i = 0;
                while (fullWidth > nodeWidth) {
                    i++;
                    fullWidth = (<SVGTextElement>box.append("text").attr("x", -1000).attr("y", -1000).attr("class", "boxhead").text((node.data.substring(0, (node.data).length - i) + "...")).node()).getComputedTextLength();
                }

                box.selectAll("text").remove();

                if (_this.settings.KPITreeSettings.showMeasure) {
                    let col0Name = measure_list[0].toString();
                    let col1Name = measure_list[1].toString();
                    let col2Name = measure_list[2].toString();
                    let col3Name = measure_list[3].toString();


                    var datapoint: NodeHandling.DataPointItems = [{ col0: 0, col1: 0, col2: 0, col3: 0 },
                    { col0: 0, col1: 0, col2: 0, col3: 0 }];
                    // var unit: CurrUnit = { 'L1': 'VND', 'L2': 'VND'};


                    //Redering value of first line
                    let r0c0: any = NodeHandling.renderVal(node, col0Name, 'L1', maxColumns, categorical, realnumCateg);
                    let r0c1: any = NodeHandling.renderVal(node, col1Name, 'L1', maxColumns, categorical, realnumCateg);
                    let r0c2: any = NodeHandling.renderVal(node, col2Name, 'L1', maxColumns, categorical, realnumCateg);
                    let r0c3: any = NodeHandling.renderVal(node, col3Name, 'L1', maxColumns, categorical, realnumCateg);

                    datapoint[0].col0 = Utils.isNotNull(r0c0) ? r0c0 : "--";
                    datapoint[0].col1 = Utils.isNotNull(r0c1) ? r0c1 : "--";
                    datapoint[0].col2 = Utils.isNotNull(r0c2) ? r0c2 : "--";
                    datapoint[0].col3 = Utils.isNotNull(r0c3) ? r0c3 : "--";

                    //Redering value of second line
                    let r1c0: any = NodeHandling.renderVal(node, col0Name, 'L2', maxColumns, categorical, realnumCateg);
                    let r1c1: any = NodeHandling.renderVal(node, col1Name, 'L2', maxColumns, categorical, realnumCateg);
                    let r1c2: any = NodeHandling.renderVal(node, col2Name, 'L2', maxColumns, categorical, realnumCateg);
                    let r1c3: any = NodeHandling.renderVal(node, col3Name, 'L2', maxColumns, categorical, realnumCateg);

                    datapoint[1].col0 = Utils.isNotNull(r1c0) ? Number(r1c0).toFixed(1) : "--";
                    datapoint[1].col1 = Utils.isNotNull(r1c1) ? Number(r1c1).toFixed(1) : "--";
                    datapoint[1].col2 = Utils.isNotNull(r1c2) ? Number(r1c2).toFixed(1) : "--";
                    datapoint[1].col3 = Utils.isNotNull(r1c3) ? Number(r1c3).toFixed(1) : "--";

                    node_color = NodeHandling.renderColor(node, col0Name, 'L1', maxColumns, categorical, realnumCateg);

                    if (Utils.isNumberForRender(node_color)) {
                        if (node_color === 0) //Green
                        {
                            box.append("rect").attr("x", node.final - negWidth).attr("y", depth * distance).attr("width", nodeWidth).attr("height", nodeHeight)
                                .attr("fill", "#39a31f").attr("stroke", _this.settings.KPITreeFormat.lines).attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx);

                            box.append("text").attr("x", node.final + nodeWidth / 2 - negWidth).attr("y", depth * distance + 15).attr("class", "boxhead")
                                .text(node.data.substring(0, (node.data).length - i) + (i == 0 ? "" : "..."));
                        }
                        if (node_color === 1) //Red
                        {
                            box.append("rect").attr("x", node.final - negWidth).attr("y", depth * distance).attr("width", nodeWidth).attr("height", nodeHeight)
                                .attr("fill", "#fc4949").attr("stroke", _this.settings.KPITreeFormat.lines).attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx);

                            box.append("text").attr("x", node.final + nodeWidth / 2 - negWidth).attr("y", depth * distance + 15).attr("class", "boxhead")
                                .text(node.data.substring(0, (node.data).length - i) + (i == 0 ? "" : "..."));
                        }
                        if (node_color === 2) //Gray
                        {
                            box.append("rect").attr("x", node.final - negWidth).attr("y", depth * distance).attr("width", nodeWidth).attr("height", nodeHeight)
                                .attr("fill", "#BFC0C2").attr("stroke", _this.settings.KPITreeFormat.lines).attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx);

                            box.append("text").attr("x", node.final + nodeWidth / 2 - negWidth).attr("y", depth * distance + 15).attr("class", "boxhead")
                                .text(node.data.substring(0, (node.data).length - i) + (i == 0 ? "" : "..."));
                        }
                    } else { //yellow
                        box.append("rect").attr("x", node.final - negWidth).attr("y", depth * distance).attr("width", nodeWidth).attr("height", nodeHeight)
                            .attr("fill", "#e3cd0b").attr("opacity", "1").attr("stroke", _this.settings.KPITreeFormat.lines).attr("rx", node.substitution ? _this.settings.KPITreeFormat.Rx : _this.settings.KPITreeFormat.rx);

                        box.append("text").attr("x", node.final + nodeWidth / 2 - negWidth).attr("y", depth * distance + 15).attr("class", "boxhead")
                            .text(node.data.substring(0, (node.data).length - i) + (i == 0 ? "" : "..."));
                    }

                    var obj = new NodeHandling.TableNode(node.final - negWidth, depth * distance, "header", datapoint);

                    box.append("foreignObject").attr('x', node.final - negWidth).attr('y', depth * distance + 20).attr("width", nodeWidth).attr('height', nodeHeight - 20).html(obj.GetDrawMyNode(measure_list, node_color));
                    if (_root) {
                        box.append("rect").attr("x", _root.final - negWidth).attr("y", depth * distance).attr("id", "root")
                    }
                }

                let showDrill = true;
                if (!_this.settings.KPITreeSettings.drillBlank)
                    showDrill = !isLastReasonable(node, "(Blank)");
                if (!_this.settings.KPITreeSettings.drillEmpty)
                    showDrill = showDrill && !isLastReasonable(node, "");

                if (!node.substitution && depth < maxRows && showDrill) {
                    let prevBtn = _this.svgG.append("g").attr("class", "drillBtn")
                        .on("click", function (d) {

                            if (node.children.length == 0)
                                unhide(node, _this.settings.KPITreeSettings.showLimit);
                            else
                                hideAll(node);

                            drawAll();
                            highlightOnDrill(node, selectedNode, "drill");
                        });
                    if (node.children.length == 0 && node.hiddenChildren.length > 0) {
                        prevBtn.append("circle").attr("cx", node.final + nodeWidth / 2 - negWidth).attr("cy", depth * distance + circleRelativePos).attr("r", 8).attr("class", "drillCrc")
                        prevBtn.append("path").attr("class", "arrow").attr("d", "M " + (node.final - negWidth + nodeWidth / 2) + " " + (depth * distance + circleRelativePos) + " m -5 -4 l 5 5 l 5 -5 m -10 4 l 5 5 l 5 -5 ");
                    } else if (node.children.length == 0) { }
                    else {
                        prevBtn.append("circle").attr("cx", node.final + nodeWidth / 2 - negWidth).attr("cy", depth * distance + circleRelativePos).attr("r", 8).attr("class", "drillCrc")
                        prevBtn.append("path").attr("class", "arrow").attr("d", "M " + (node.final - negWidth + nodeWidth / 2) + " " + (depth * distance + circleRelativePos) + " m -5 4 l 5 -5 l 5 5 m -10 -4 l 5 -5 l 5 5 ");
                    }
                }

                if (node.substitution) {
                    let prevBtn = _this.svgG.append("g").attr("class", "nextBtn")
                        .on("click", function (d) {
                            unhide(node.parent, node.parent.children.length + 2);
                            drawAll();
                            highlightOnDrill(node, selectedNode, "next");
                        });
                    prevBtn.append("circle").attr("cx", node.final - negWidth + nodeWidth / 2 + 25).attr("cy", depth * distance + circleRelativePos).attr("r", 8).attr("class", "nextCrc")
                    prevBtn.append("path").attr("class", "arrow")
                        .attr("d", "M " + (node.final - negWidth + nodeWidth / 2 + 25) + " " + (depth * distance + circleRelativePos) + " m -4 -5 l 5 5 l -5 5 m 4 -10 l 5 5 l -5 5 ");
                }
                if (node.parent != null && node.parent.children.length > 2 && node.parent.children[node.parent.children.length - 1] == node) {
                    let prevBtn = _this.svgG.append("g").attr("class", "prevBtn")
                        .on("click", function (d) {
                            hide(node.parent, Math.max(1, node.parent.children.length - 4));
                            drawAll();
                            highlightOnDrill(node, selectedNode, "previous");
                        });
                    prevBtn.append("circle").attr("cx", node.final - negWidth + nodeWidth / 2 - 25).attr("cy", depth * distance + circleRelativePos).attr("r", 8).attr("class", "prevCrc")
                    prevBtn.append("path").attr("class", "arrow")
                        .attr("d", "M " + (node.final - negWidth + nodeWidth / 2 - 25) + " " + (depth * distance + circleRelativePos) + " m 4 -5 l -5 5 l 5 5 m -4 -10 l -5 5 l 5 5 ");
                }

                //Connection lines
                if (depth > 0) {
                    let P1: NodeHandling.Point = {
                        x: node.parent.final + nodeWidth / 2 - negWidth,
                        y: (depth - 1) * distance + 98
                    }
                    let P2: NodeHandling.Point = {
                        x: node.final + nodeWidth / 2 - negWidth,
                        y: depth * distance
                    }

                    let P3: NodeHandling.Point = {
                        x: P1.x,
                        y: P1.y + 10
                    }

                    let P4: NodeHandling.Point = {
                        x: P2.x,
                        y: P1.y + 10
                    }

                    _this.svgG.append("line")
                        .attr("x1", P1.x).attr("y1", P1.y)
                        .attr("x2", P3.x).attr("y2", P3.y)
                        .attr("stroke", _this.settings.KPITreeFormat.lines);

                    _this.svgG.append("line")
                        .attr("x1", P3.x).attr("y1", P3.y)
                        .attr("x2", P4.x).attr("y2", P4.y)
                        .attr("stroke", _this.settings.KPITreeFormat.lines);

                    _this.svgG.append("line")
                        .attr("x1", P4.x).attr("y1", P4.y)
                        .attr("x2", P2.x).attr("y2", P2.y)
                        .attr("stroke", _this.settings.KPITreeFormat.lines);
                }
            }

            function drawAll() {
                _this.svg.selectAll("g").remove();
                _this.svgG = _this.svg.append("g").attr("style", "display: block; margin: auto; overflow:auto;");
                boxClips = _this.svgG.append("defs").append("clipPath").attr("id", "boxClips");
                negWidth = 0;
                maxDepth = 0;
                maxWidth = nodeWidth;
                firstWalk(_root);
                secondWalk(_root, 0);
                negWidth -= 10;

                if (_root.children.length > 0)
                    _root.final = (_root.children[0].final + _root.children[_root.children.length - 1].final) / 2;
                else
                    _root.final = 0;
                finalDraw(_root, 0, "0"); //draw
                _this.svg.attr("width", maxWidth + nodeWidth + 10 - negWidth).attr("height", (maxDepth + 1) * 100 - 30);

                let rootE = document.getElementById("root");

                let rootX: number;
                rootX = +rootE.getAttribute("x");

                AnnotationAndLegend.DrawLegend(rootX, _this, _root, distance);
                AnnotationAndLegend.DrawBlockAnnotation(rootX, _this, _root, distance);
                DrawButton(rootX);
                DrawCaptureButton(rootX);
            }

            let _root = new NodeHandling.Nodex(categorical.categories[0].values[0] + "", null, 0, categorical.categories[0].values[0] + "", 0, "");
            _root.sums = fillSubTree(_root, 1);
            hideAll(_root);
            unhideAll(_root, _this.settings.KPITreeSettings.defaultDrillDown);
            drawAll();
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}
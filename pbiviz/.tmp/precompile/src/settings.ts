module powerbi.extensibility.visual.FCB64197A074475B35C21C09AB529C74  {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public KPITreeSettings: KPITreeSettings = new KPITreeSettings();
    public KPITreeFormat: KPITreeFormat = new KPITreeFormat();
    public Legend: Legend = new Legend();
    public BlockAnnotation: BlockAnnotation = new BlockAnnotation();
    public CF11: CF11 = new CF11;
  }

  export class KPITreeSettings {
    // Show measures and bars
    public showMeasure: boolean = true;
    // Drill into blank values
    public drillBlank: boolean = true;
    // Drill into empty values
    public drillEmpty: boolean = true;
    // Limit number of children
    public showLimit: number = 5;
    // Default drill-down
    public defaultDrillDown: number = 3;
  }

  export class KPITreeFormat {
    // Box background color
    public boxbg: string = "#000000";
    // Box border color
    public lines: string = "#000000";
    // Radius of data values
    public rx: number = 0;
    // Radius of substitution values
    public Rx: number = 0;
  }

  export class Legend {
    public enable: boolean = true;
    public L1: string = "Actual >= Target";
    public L2: string = "Actual < Target";
    public L3: string = "Extendable or empty node";
    public L4: string = "Target not available";
  }

  export class BlockAnnotation {
    public R1: string = "Cost";
    public R2: string = "Time";
    public R3: string = "Delta";
  }

  export class CF11 {
    public enable: boolean = true;
  }
}

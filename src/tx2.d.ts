declare type Counter = {
  inc: () => void;
  dec: () => void;
  value: () => number;
};

declare type Meter = {
  mark: () => void;
};

declare type Metric = {
  val: () => number;
  set: (val: number) => void;
};

declare module "tx2" {
  function counter(options: { name: string }): Counter;
  function meter(options: { name: string }): Meter;
  function metric(options: {
    name: string;
    samples: number;
    timeframe: number;
  }): Metric;
}

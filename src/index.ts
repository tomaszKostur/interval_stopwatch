const TICK_RATE_MS = 10;
const GAUGE_SCALE = 0.75; // if 1 represents full circle 0.75 should represent full gauge;
const CONVENTION_MULTIPLIER = 1000; // transform from inner milliseconds values to displayed seconds;

enum IntervalStopwatchState {
  idle,
  work,
  pause,
  rest,
}

// INFO: Let's have convention that all values are in milliseconds [ms]
type IntervalStopwatch = {
  work_time: number;
  work_time_set: number;
  pause_time: number;
  pause_time_set: number;
  rest_time: number;
  rest_time_set: number;
  reps_in_set: number;
  reps_in_set_set: number;
  number_of_series: number;
  number_of_series_set: number;
  state: IntervalStopwatchState;
};

function stopwatch_init(): IntervalStopwatch {
  let stopwatch: IntervalStopwatch = {
    work_time: 0,
    work_time_set: 7000,
    pause_time: 0,
    pause_time_set: 3000,
    rest_time: 0,
    rest_time_set: 180000,
    reps_in_set: 0,
    reps_in_set_set: 7,
    number_of_series: 0,
    number_of_series_set: 5,
    state: IntervalStopwatchState.idle,
  };
  return stopwatch;
}

function stopwatch_set(
  stopwatch: IntervalStopwatch,
  work_time_set: number,
  pause_time_set: number,
  rest_time_set: number,
  reps_in_set_set: number,
  number_of_series_set: number
) {
  stopwatch.work_time_set = work_time_set;
  stopwatch.pause_time_set = pause_time_set;
  stopwatch.rest_time_set = rest_time_set;
  stopwatch.reps_in_set_set = reps_in_set_set;
  stopwatch.number_of_series_set = number_of_series_set;
}

function stopwatch_reset(stopwatch: IntervalStopwatch) {
  stopwatch.work_time = 0;
  stopwatch.pause_time = 0;
  stopwatch.rest_time = 0;
  stopwatch.reps_in_set = 0;
  stopwatch.number_of_series = 0;
  stopwatch.state = IntervalStopwatchState.idle;
}

function stopwatch_tick(stopwatch: IntervalStopwatch, delay_ms: number) {
  switch (stopwatch.state) {
    case IntervalStopwatchState.idle:
      break;
    case IntervalStopwatchState.work:
      stopwatch.work_time += delay_ms;

      if (stopwatch.work_time >= stopwatch.work_time_set) {
        if (stopwatch.reps_in_set >= stopwatch.reps_in_set_set -1) {
          stopwatch.number_of_series += 1;
          stopwatch.reps_in_set += 1;
          // stopwatch.reps_in_set = 0;
          stopwatch.work_time = 0;
          stopwatch.state = IntervalStopwatchState.rest;
        } else {
          stopwatch.reps_in_set += 1;
          stopwatch.work_time = 0;
          stopwatch.state = IntervalStopwatchState.pause;
        }
      }
      break;

    case IntervalStopwatchState.pause:
      stopwatch.pause_time += delay_ms;

      if (stopwatch.pause_time >= stopwatch.pause_time_set) {
        stopwatch.pause_time = 0;
        stopwatch.state = IntervalStopwatchState.work;
      }
      break;

    case IntervalStopwatchState.rest:
      stopwatch.rest_time += delay_ms;

      if (stopwatch.rest_time >= stopwatch.rest_time_set) {
        if (stopwatch.number_of_series >= stopwatch.number_of_series_set) {
          stopwatch.pause_time = 0; // should not be needed
          stopwatch.work_time = 0;
          stopwatch.state = IntervalStopwatchState.idle;
        } else {
          stopwatch.reps_in_set = 0;
          stopwatch.rest_time = 0;
          stopwatch.pause_time = 0; // should not be needed
          stopwatch.state = IntervalStopwatchState.work;
        }
      }
      break;
  }
}

function stopwatch_start(stopwatch: IntervalStopwatch) {
  stopwatch.state = IntervalStopwatchState.work;
}

function stopwatch_stop(stopwatch: IntervalStopwatch) {
  stopwatch.state = IntervalStopwatchState.idle;
}
function stopwatch_toggle(stopwatch: IntervalStopwatch) {
  if (stopwatch.state == IntervalStopwatchState.idle) {
    stopwatch_start(stopwatch);
  } else {
    stopwatch_stop(stopwatch);
  }
}

function render_stopwatch(stopwatch: IntervalStopwatch) {
  const work_percentage = (stopwatch.work_time / stopwatch.work_time_set) * 100;
  document.getElementById("work_bar_bar")!.style.setProperty("width", `${work_percentage}%`);
  document.getElementById("work_bar_text")!.textContent = `${stopwatch.work_time / CONVENTION_MULTIPLIER}/${
    stopwatch.work_time_set / CONVENTION_MULTIPLIER
  }`;

  const pause_percentage = (stopwatch.pause_time / stopwatch.pause_time_set) * 100;
  const rest_percentage = (stopwatch.rest_time / stopwatch.rest_time_set) * 100;
  const pause_bar_bar = document.getElementById("pause_bar_bar")!;
  if (stopwatch.state === IntervalStopwatchState.rest) {
    pause_bar_bar.style.setProperty("width", `${rest_percentage}%`);
    pause_bar_bar.classList.replace("bg-yellow-900", "bg-red-600");
    document.getElementById("pause_bar_text")!.textContent = `${stopwatch.rest_time / CONVENTION_MULTIPLIER}/${
      stopwatch.rest_time_set / CONVENTION_MULTIPLIER
    }`;
  } else {
    pause_bar_bar.style.setProperty("width", `${pause_percentage}%`);
    pause_bar_bar.classList.replace("bg-red-600", "bg-yellow-900");
    document.getElementById("pause_bar_text")!.textContent = `${stopwatch.pause_time / CONVENTION_MULTIPLIER}/${
      stopwatch.pause_time_set / CONVENTION_MULTIPLIER
    }`;
  }

  const reps_percentage = (stopwatch.reps_in_set / stopwatch.reps_in_set_set) * 100 * GAUGE_SCALE;
  document.getElementById("gauge_reps_bar")!.setAttribute("stroke-dasharray", `${reps_percentage} 100`);
  document.getElementById("gauge_reps_text")!.textContent = `${stopwatch.reps_in_set}/${stopwatch.reps_in_set_set}`;

  const series_percentage = (stopwatch.number_of_series / stopwatch.number_of_series_set) * 100 * GAUGE_SCALE;
  document.getElementById("gauge_series_bar")!.setAttribute("stroke-dasharray", `${series_percentage} 100`);
  document.getElementById(
    "gauge_series_text"
  )!.textContent = `${stopwatch.number_of_series}/${stopwatch.number_of_series_set} `;
}

import { InputCounter } from "flowbite";
import type { InputCounterOptions, InputCounterInterface } from "flowbite";
import type { InstanceOptions } from "flowbite";

function bind_setting_widgets(stopwatch_instance: IntervalStopwatch) {
  bind_setting_widget_to_stopwatch("worktime", stopwatch_instance, "work_time_set", true);
  bind_setting_widget_to_stopwatch("pausetime", stopwatch_instance, "pause_time_set", true);
  bind_setting_widget_to_stopwatch("resttime", stopwatch_instance, "rest_time_set", true);
  bind_setting_widget_to_stopwatch("reps", stopwatch_instance, "reps_in_set_set", false);
  bind_setting_widget_to_stopwatch("seriesnum", stopwatch_instance, "number_of_series_set", false);
}

function bind_setting_widget_to_stopwatch(
  widget_prefix_name: string,
  stopwatch_instance: IntervalStopwatch,
  setting_name: keyof IntervalStopwatch,
  convention_multiply: boolean
) {
  const assign_value = () => {
    console.log(`input field ${widget_prefix_name} value has been incremented`);
    if (convention_multiply) {
      stopwatch_instance[setting_name] = parseInt($worktime_input.value) * CONVENTION_MULTIPLIER;
    } else {
      stopwatch_instance[setting_name] = parseInt($worktime_input.value);
    }
  };
  const $worktime_input = document.getElementById(`${widget_prefix_name}-input`) as HTMLInputElement;
  $worktime_input.addEventListener("change", assign_value);
  const $worktime_increase = document.getElementById(`increment-${widget_prefix_name}`);
  const $worktime_decrease = document.getElementById(`decrement-${widget_prefix_name}`);

  const options: InputCounterOptions = {
    minValue: 0,
    maxValue: null, // infinite

    onIncrement: assign_value,
    onDecrement: assign_value,
  };
  const instanceOptions: InstanceOptions = {
    id: `${widget_prefix_name}-input`,
    override: true,
  };
  const worktime_input = new InputCounter(
    $worktime_input,
    $worktime_increase,
    $worktime_decrease,
    options,
    instanceOptions
  );
}

function dev_main(): void {
  let stopwatch = stopwatch_init();
  // stopwatch_start(stopwatch);
  bind_setting_widgets(stopwatch);
  document.getElementById("run_button")!.addEventListener("click", () => {
    stopwatch_toggle(stopwatch);
  });
  document.getElementById("reset_button")!.addEventListener("click", () => {
    stopwatch_reset(stopwatch);
  });

  setInterval(() => {
    stopwatch_tick(stopwatch, TICK_RATE_MS);
    render_stopwatch(stopwatch);
    // console.log(stopwatch.work_time);
  }, TICK_RATE_MS);
}

dev_main();

// I think that sound for rounds may be sprinters pistol sound and boxers ring bell;

// const single_bell_path = require('./assets/single_bell.wav');
// import

const TICK_RATE_MS = 10;
const GAUGE_SCALE = 0.75; // if 1 represents full circle 0.75 should represent full gauge;
const CONVENTION_MULTIPLIER = 1000; // transform from inner milliseconds values to displayed seconds;

enum IntervalStopwatchState {
  ready,
  work,
  pause,
  rest,
  done,
}

type IntervalStopwatchAudioSettings = {
  start_stop_bell: boolean;
  bell_on_half_rest: boolean;
  bell_on_countdown_start: boolean;
};

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
  pause: boolean;
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
    state: IntervalStopwatchState.ready,
  };
  return stopwatch;
}

function stopwatch_reset(stopwatch: IntervalStopwatch) {
  stopwatch.work_time = 0;
  stopwatch.pause_time = 0;
  stopwatch.rest_time = 0;
  stopwatch.reps_in_set = 0;
  stopwatch.number_of_series = 0;
  stopwatch.state = IntervalStopwatchState.ready;
}

function stopwatch_tick(stopwatch: IntervalStopwatch, delay_ms: number) {
  // This function should be executed every time interval is calculated
  // condition for pause
  if(stopwatch.pause){
    return
  }

  switch (stopwatch.state) {
    case IntervalStopwatchState.ready:
      break;
    case IntervalStopwatchState.work:
      stopwatch.work_time += delay_ms;

      if (stopwatch.work_time >= stopwatch.work_time_set) {
        if (
          stopwatch.reps_in_set >= stopwatch.reps_in_set_set - 1 &&
          stopwatch.number_of_series >= stopwatch.number_of_series_set - 1
        ) {
          stopwatch.number_of_series += 1;
          stopwatch.reps_in_set += 1;
          stopwatch.state = IntervalStopwatchState.done;
        } else if (stopwatch.reps_in_set >= stopwatch.reps_in_set_set - 1) {
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
          // INFO: this condition should never happen.
          // TODO: consider to remove
          stopwatch.pause_time = 0; // should not be needed
          stopwatch.work_time = 0;
          stopwatch.state = IntervalStopwatchState.done;
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


function stopwatch_toggle(stopwatch: IntervalStopwatch) {
  if (stopwatch.pause || stopwatch.state === IntervalStopwatchState.ready) {
    stopwatch_start(stopwatch);
  } else {
    stopwatch_stop(stopwatch);
  }
}

function stopwatch_stop(stopwatch: IntervalStopwatch) {
  stopwatch.pause = true;
}

function stopwatch_start(stopwatch: IntervalStopwatch) {
  if (stopwatch.state === IntervalStopwatchState.ready){
    stopwatch.state = IntervalStopwatchState.work;
  }
  stopwatch.pause = false;
} 

function audio_frame_stopwatch_control(stopwatch: IntervalStopwatch, audio_settings: IntervalStopwatchAudioSettings) {
  function play_single_bell() {
    const single_bell_path = require("url:./assets/single_bell.wav");
    const audio = new Audio(single_bell_path);
    audio.play();
  }

  function play_double_bell() {
    const single_bell_path = require("url:./assets/double_bell.wav");
    const audio = new Audio(single_bell_path);
    audio.play();
  }

  function play_tripple_bell() {
    const single_bell_path = require("url:./assets/triple_bell.wav");
    const audio = new Audio(single_bell_path);
    audio.play();
  }

  function play_gun_shot() {
    const single_bell_path = require("url:./assets/gun-shots-from-a-distance.mp3");
    const audio = new Audio(single_bell_path);
    audio.play();
  }

  function play_buzzer() {
    const single_bell_path = require("url:./assets/mixkit-system-beep-buzzer.wav");
    const audio = new Audio(single_bell_path);
    audio.play();
  }

  let previous_stopwatch_state = stopwatch.state;
  function audio_frame_tick() {
    if (audio_settings.start_stop_bell) {
      // This is section for standard start stop bell
      if (previous_stopwatch_state === IntervalStopwatchState.ready && stopwatch.state === IntervalStopwatchState.work) {
        play_gun_shot();
      } else if (
        previous_stopwatch_state === IntervalStopwatchState.pause &&
        stopwatch.state === IntervalStopwatchState.work
      ) {
        play_gun_shot();
      } else if (
        previous_stopwatch_state === IntervalStopwatchState.rest &&
        stopwatch.state === IntervalStopwatchState.work
      ) {
        play_gun_shot();
      } else if (
        previous_stopwatch_state === IntervalStopwatchState.work &&
        stopwatch.state === IntervalStopwatchState.done
      ) {
        play_tripple_bell();
      } else if (
        previous_stopwatch_state === IntervalStopwatchState.work &&
        stopwatch.state === IntervalStopwatchState.pause
      ) {
        play_single_bell();
      } else if (
        previous_stopwatch_state === IntervalStopwatchState.work &&
        stopwatch.state === IntervalStopwatchState.rest
      ) {
        play_double_bell();
      }
    }
    if (audio_settings.bell_on_half_rest) {
      if (stopwatch.state === IntervalStopwatchState.rest && stopwatch.rest_time === stopwatch.rest_time_set / 2) {
        // this condition is good enough but WARNING: needs to be aligned with TICK_RATE_MS to ensure exact value
        play_double_bell();
      }
    }
    if (audio_settings.bell_on_countdown_start) {
      if (stopwatch.state === IntervalStopwatchState.rest) {
        if (
          stopwatch.rest_time === stopwatch.rest_time_set - 3 * CONVENTION_MULTIPLIER ||
          stopwatch.rest_time === stopwatch.rest_time_set - 2 * CONVENTION_MULTIPLIER ||
          stopwatch.rest_time === stopwatch.rest_time_set - 1 * CONVENTION_MULTIPLIER
        ) {
          play_buzzer();
        }
      }
    }

    previous_stopwatch_state = stopwatch.state;
  }
  return audio_frame_tick;
}

function render_stopwatch(stopwatch: IntervalStopwatch) {
  const REST_BAR_PAUSE_COLOR = "bg-yellow-300"; // WARNING: this have to be aligned to what is in HTML
  const REST_BAR_REST_COLOR = "bg-red-600";
  const work_percentage = (stopwatch.work_time / stopwatch.work_time_set) * 100;
  document.getElementById("work_bar_bar")!.style.setProperty("width", `${work_percentage}%`);
  document.getElementById("work_bar_text")!.textContent = `${(stopwatch.work_time / CONVENTION_MULTIPLIER).toFixed(
    1
  )}/${stopwatch.work_time_set / CONVENTION_MULTIPLIER}`;

  const pause_percentage = (stopwatch.pause_time / stopwatch.pause_time_set) * 100;
  const rest_percentage = (stopwatch.rest_time / stopwatch.rest_time_set) * 100;
  const pause_bar_bar = document.getElementById("pause_bar_bar")!;
  if (stopwatch.state === IntervalStopwatchState.rest) {
    pause_bar_bar.style.setProperty("width", `${rest_percentage}%`);
    pause_bar_bar.classList.replace(REST_BAR_PAUSE_COLOR, REST_BAR_REST_COLOR);
    document.getElementById("pause_bar_text")!.textContent = `${(stopwatch.rest_time / CONVENTION_MULTIPLIER).toFixed(
      1
    )}/${stopwatch.rest_time_set / CONVENTION_MULTIPLIER}`;
  } else {
    pause_bar_bar.style.setProperty("width", `${pause_percentage}%`);
    pause_bar_bar.classList.replace(REST_BAR_REST_COLOR, REST_BAR_PAUSE_COLOR);
    document.getElementById("pause_bar_text")!.textContent = `${(stopwatch.pause_time / CONVENTION_MULTIPLIER).toFixed(
      1
    )}/${stopwatch.pause_time_set / CONVENTION_MULTIPLIER}`;
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

function bind_audio_settings_widget(audio_settings: IntervalStopwatchAudioSettings) {
  const start_stop_bell_checkbox = document.getElementById("start_stop_bell_checkbox") as HTMLInputElement;
  start_stop_bell_checkbox.checked = audio_settings.start_stop_bell;
  start_stop_bell_checkbox.addEventListener("change", () => {
    audio_settings.start_stop_bell = start_stop_bell_checkbox.checked;
  });

  const countdown_bell_checkbox = document.getElementById("countdown_bell_checkbox") as HTMLInputElement;
  countdown_bell_checkbox.checked = audio_settings.bell_on_countdown_start;
  countdown_bell_checkbox.addEventListener("change", () => {
    audio_settings.bell_on_countdown_start = countdown_bell_checkbox.checked;
  });

  const half_rest_bell_checkbox = document.getElementById("half_rest_bell_checkbox") as HTMLInputElement;
  half_rest_bell_checkbox.checked = audio_settings.bell_on_half_rest;
  half_rest_bell_checkbox.addEventListener("change", () => {
    audio_settings.bell_on_half_rest = half_rest_bell_checkbox.checked;
  });
}

function main(): void {
  let stopwatch = stopwatch_init();

  bind_setting_widgets(stopwatch);
  document.getElementById("run_button")!.addEventListener("click", () => {
    stopwatch_toggle(stopwatch);
  });
  document.getElementById("reset_button")!.addEventListener("click", () => {
    stopwatch_reset(stopwatch);
  });

  const audio_settings: IntervalStopwatchAudioSettings = {
    start_stop_bell: true,
    bell_on_countdown_start: true,
    bell_on_half_rest: true,
  };
  bind_audio_settings_widget(audio_settings);
  const stopwatch_audio_tick = audio_frame_stopwatch_control(stopwatch, audio_settings);
  setInterval(() => {
    stopwatch_tick(stopwatch, TICK_RATE_MS);
    render_stopwatch(stopwatch);
    stopwatch_audio_tick();
  }, TICK_RATE_MS);
}

main();

// I think that sound for rounds may be sprinters pistol sound and boxers ring bell;

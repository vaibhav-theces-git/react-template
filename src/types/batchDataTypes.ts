export type batchDataRequestType = {
  task_type: string;
  start_date: string;
  end_date: string;
};

export type batchDataResponseType = {
  batch_name: string;
  error_message: string;
  is_critical: boolean;
  is_disabled: boolean;
  run_date: string;
  run_id: number;
  run_time: string;
  success_failure_status: string;
  task_ended_timestamp: string;
  task_started_timestamp: string;
  task_status: string;
  vbt_flag: boolean;
};

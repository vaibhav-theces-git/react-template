import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

const useGlobalRunId = createGlobalState<number>(0);

export function useRunId(initialRunId: number): {
  globalRunId: number;
  setGlobalRunId: (globalRunId: number) => void;
} {
  const [globalRunId, setRunId] = useGlobalRunId();

  const setGlobalRunId = useCallback(
    (id: number) => {
      setRunId(id);
    },
    [setRunId]
  );

  useEffect(() => {
    setGlobalRunId(initialRunId);
  }, [initialRunId, setGlobalRunId]);

  return { globalRunId, setGlobalRunId };
}

const useGlobalNotification = createGlobalState<boolean>(true);
export function useGlobalNotificationState(initialState: boolean): {
  globalNotificationState: boolean;
  setGlobalNotificationState: (globalNotificationState: boolean) => void;
} {
  const [globalNotificationState, setNotificationState] =
    useGlobalNotification();
  const setGlobalNotificationState = useCallback(
    (notificationState: boolean) => {
      setNotificationState(notificationState);
    },
    [setNotificationState]
  );
  useEffect(() => {
    setGlobalNotificationState(initialState);
  }, [initialState, setGlobalNotificationState]);
  return { globalNotificationState, setGlobalNotificationState };
}

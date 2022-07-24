import axios, { AxiosError } from "axios";
import { useContext } from "react";
import {
  MutationFunction,
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useMutation as useReactMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery as useReactQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { AuthContext } from "src/AuthContext";

const MAX_FAILURES = 2;

export function useQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, AxiosError, TData, TQueryKey>,
): UseQueryResult<TData, AxiosError> {
  const { setAuthenticated } = useContext(AuthContext);

  return useReactQuery<TQueryFnData, AxiosError, TData, TQueryKey>(
    queryKey,
    async (context: QueryFunctionContext<TQueryKey>) => {
      try {
        return await queryFn(context);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthenticated(false);
        }
        throw error;
      }
    },
    {
      retry: (failureCount: number, error: AxiosError) =>
        failureCount < MAX_FAILURES &&
        (!error.response || error.response.status >= 500),
      ...options,
    },
  );
}

export function useMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, AxiosError, TVariables, TContext>,
): UseMutationResult<TData, AxiosError, TVariables, TContext> {
  const { setAuthenticated } = useContext(AuthContext);

  return useReactMutation<TData, AxiosError, TVariables, TContext>(
    async (variables: TVariables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthenticated(false);
        }
        throw error;
      }
    },
    {
      retry: (failureCount: number, error: AxiosError) =>
        failureCount < MAX_FAILURES &&
        (!error.response || error.response.status >= 500),
      ...options,
    },
  );
}

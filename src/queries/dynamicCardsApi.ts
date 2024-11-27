import { DynamicCardRequestType } from "src/types/datacardTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const dynamicCardsSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    updateDataCardConfiguration: builder.query<void, DynamicCardRequestType>({
      query: (args) => ({
        url: `dashboard/update_cardsconfig`,
        method: "POST",
        data: args,
      }),
    }),
  }),
});

export const {
  useUpdateDataCardConfigurationQuery,
  useLazyUpdateDataCardConfigurationQuery,
} = dynamicCardsSlice;

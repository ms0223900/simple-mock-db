import { DEFAULT_DATA_LIST_AMOUNT, MAX_DATA_LIST_AMOUNT } from "@/config";

const getQueryAmount = (queryLimit: string | undefined, paramId?: string): number => {
  if(paramId) return 1;

  let amount = (queryLimit && !Number.isNaN(Number(queryLimit))) ? Number(queryLimit) : DEFAULT_DATA_LIST_AMOUNT;
  amount = (amount === -1) ? MAX_DATA_LIST_AMOUNT : amount;
  
  return amount;
};

export default getQueryAmount;
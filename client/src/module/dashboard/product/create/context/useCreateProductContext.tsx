import useTestContext from "@/hook/useTestContext";
import { CreateProductContext, ICreateProductProvide } from ".";

function useCreateProductContext() {
  return useTestContext<ICreateProductProvide>(
    CreateProductContext as React.Context<ICreateProductProvide>
  );
}

export default useCreateProductContext;

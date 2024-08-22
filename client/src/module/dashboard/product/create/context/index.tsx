import { createContext, useState } from "react";
import React from "react";
import { ImageListType } from "react-images-uploading";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { IProductReq } from "@/types/product.type";
import { useAddProductMutation } from "@/stores/service/product.service";

export interface ICreateProductProvide {
  data: IProductReq;

  activeStep: string;

  uploadImage: {
    thumbnail: ImageListType;
    listImages: ImageListType;
  };

  specs: { size: number; quantity: number }[];

  modifyTable: boolean;

  handleActiveStep: (activeTab: string) => void;

  handleSetData: (result: Partial<IProductReq>) => void;

  handleSaveStep2: (data: {
    thumbnail: ImageListType;
    listImages: ImageListType;
  }) => void;

  handleSaveStep3: (data: { size: number; quantity: number }[]) => void;

  handleModifyTable: (status: boolean) => void;

  handleReset: () => void;

  handleSubmitProduct: () => void;

  isLoading: boolean;

  isSuccess: boolean;

  isError: boolean;

  error: FetchBaseQueryError | SerializedError | undefined;
}

const CreateProductContext = createContext<ICreateProductProvide | null>(null);

function CreateProductProvide({ children }: { children: React.ReactNode }) {
  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddProductMutation();

  const [data, setData] = useState<IProductReq>({
    name: "",
    desc: "",
    brand: "",
    price: 0,
    status: "",
    thumbnail: null,
    images: null,
    specs: "",
  });

  const [uploadImage, setUploadImages] = useState<{
    thumbnail: ImageListType;
    listImages: ImageListType;
  }>({
    thumbnail: [],
    listImages: [],
  });

  const [activeStep, setActiveStep] = useState<string>("1");

  const [specs, setSpecs] = useState<{ size: number; quantity: number }[]>([
    { size: 0, quantity: 0 },
  ]);

  const [modifyTable, setModifyTable] = useState<boolean>(false);

  const handleModifyTable = (status: boolean) => {
    setModifyTable(status);
  };

  const handleSaveStep3 = (data: { size: number; quantity: number }[]) => {
    setSpecs([...data]);
  };

  const handleActiveStep = (active: string) => {
    setActiveStep(active);
  };

  const handleSaveStep2 = (data: {
    thumbnail: ImageListType;
    listImages: ImageListType;
  }) => {
    setUploadImages({ ...data });
  };

  const handleSetData = (result: Partial<IProductReq>) => {
    setData({ ...data, ...result });
  };

  const handleReset = () => {
    setData({
      name: "",
      desc: "",
      brand: "",
      price: 0,
      status: "",
      thumbnail: null,
      images: null,
      specs: "",
    });

    setActiveStep("1");

    setUploadImages({
      thumbnail: [],
      listImages: [],
    });

    setSpecs([{ size: 0, quantity: 0 }]);

    setModifyTable(false);
  };

  const handleSubmitProduct = async () => {
    const formData = new FormData();
    for (const [keys, value] of Object.entries(data)) {
      if (keys === "images") {
        for (const item of value) {
          formData.append("images", item);
        }
      } else {
        formData.append(keys, value);
      }
    }
    await addProduct(formData).unwrap();
    setActiveStep("1");
    handleReset();
  };

  return (
    <CreateProductContext.Provider
      value={{
        data,
        activeStep,
        specs,
        uploadImage,
        modifyTable,
        handleActiveStep,
        handleSetData,
        handleSaveStep2,
        handleSaveStep3,
        handleModifyTable,
        handleReset,
        handleSubmitProduct,
        isLoading,
        isSuccess,
        isError,
        error,
      }}
    >
      {children}
    </CreateProductContext.Provider>
  );
}

export { CreateProductProvide, CreateProductContext };

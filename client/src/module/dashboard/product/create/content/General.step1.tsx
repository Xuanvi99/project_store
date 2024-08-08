import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Editor } from "@tinymce/tinymce-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProductContext, ICreateProductProvide } from "../context";
import { useEffect, useState } from "react";
import useTestContext from "@/hook/useTestContext";
import { useRemoveWithImageUrlMutation } from "@/stores/service/image.service";
import { useCheckNameMutation } from "@/stores/service/product.service";
import { useGetAllCategoryQuery } from "@/stores/service/category.service";
import Field from "@/components/fields";
import { Label } from "@/components/label";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import InputRadio from "@/components/input/InputRadio";
import { Button } from "@/components/button";
import { IconChevronRight } from "@/components/icon";
import { DropdownForm } from "@/components/dropdown";

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

type ProgressFn = (percent: number) => void;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .min(8, "Tên sản phẩm ít nhất 8 ký tự"),
  brand: Yup.string().required("Vui lòng điền vào mục này."),
  desc: Yup.string().required("Vui lòng điền vào mục này."),
  price: Yup.number()
    .required("Vui lòng điền thông tin")
    .typeError("Giá sản phẩm không hợp lệ")
    .min(0, "Giá sản phẩm không hợp lệ"),
  status: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .oneOf(["active", "inactive"]),
});

type FormValues = Yup.InferType<typeof validationSchema>;

function General() {
  const { data, handleActiveStep, handleSetData } =
    useTestContext<ICreateProductProvide>(
      CreateProductContext as React.Context<ICreateProductProvide>
    );

  const [removeWithImageUrl] = useRemoveWithImageUrlMutation();
  const [checkName] = useCheckNameMutation();

  const [brandOptions, setBrandOptions] = useState<
    {
      label: string;
      value: string;
      id: string;
    }[]
  >([]);

  const { data: category, status } = useGetAllCategoryQuery();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data.name,
      brand: data.brand,
      desc: data.desc,
      price: data.price,
      status: data.status,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const validateForm = () => {
    if (
      !watch("name") ||
      !watch("brand") ||
      !watch("desc") ||
      !watch("price") ||
      !watch("status")
    ) {
      return false;
    }
    return true;
  };

  const image_upload_handler = (blobInfo: BlobInfo, progress: ProgressFn) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", "http://localhost:3000/api/image/createSingle");

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject("HTTP Error: " + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != "string") {
          reject("Invalid JSON: " + xhr.responseText);
          return;
        }

        resolve(json.location);
      };

      xhr.onerror = () => {
        reject(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
      };

      const formData = new FormData();
      formData.append("image", blobInfo.blob(), blobInfo.filename());
      formData.append("folder", "product");

      xhr.send(formData);
    });

  const handleFocusInput = (id: string) => {
    const inputSize = document.getElementById(id) as HTMLInputElement;
    if (inputSize) {
      inputSize.select();
    }
  };

  const handleBLurInput = () => {
    const price = watch().price;
    if (!price) {
      setValue(`price`, 0);
      clearErrors("price");
    }
  };

  const handleChangeName = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.value.length > 8) {
      await checkName({ name: event.currentTarget.value })
        .unwrap()
        .then(() => {
          clearErrors("name");
        })
        .catch((error) => {
          const data = error.data as { errorMessage: string };
          setError("name", { message: data.errorMessage });
        });
    }
  };

  const onSubmit = async (data: FormValues) => {
    handleSetData(data);
    handleActiveStep("2");
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (category && status === "fulfilled") {
      const data = category.data;
      const options = [];
      for (let i = 0; i < data?.length; i++) {
        options.push({
          label: data[i].name,
          value: data[i].name,
          id: `${i + 1}`,
        });
      }
      setBrandOptions([...options]);
    }
  }, [category, status]);

  return (
    <div className="mt-7">
      <div className="flex flex-col items-start gap-y-2">
        <h1 className="font-semibold">Thông tin chung</h1>
        <p className="text-sm text-gray98">Điền đầy đủ thông tin bên dưới</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-6 text-sm gap-y-6"
      >
        <div className="flex w-full gap-x-7">
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label
              htmlFor="phoneOrEmail"
              className="font-semibold text-secondary"
            >
              Tên sản phẩm<strong className="text-danger">*</strong>
            </Label>
            <InputForm
              control={control}
              type="text"
              name="name"
              id="name"
              placeholder="ví dụ: Shoes adidas"
              onChange={(event) => handleChangeName(event)}
              error={errors["name"] ? true : false}
            />
            <ErrorInput text={errors["name"]?.message} />
          </Field>
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label htmlFor="category" className="font-semibold text-secondary">
              Thương hiệu<strong className="text-danger">*</strong>
            </Label>
            <DropdownForm
              control={control}
              name="brand"
              title={data.brand || "Lựa chọn"}
              options={brandOptions}
              error={errors.brand && !watch("brand")}
              search={{
                display: true,
                place: "top",
              }}
              className={{
                option:
                  "max-h-[160px] overflow-y-scroll rounded-none text-base font-bold",
                select: "shadow-none border-1 border-grayCa rounded-md",
              }}
              onClick={(option) => {
                setValue("brand", option.value);
              }}
            />
            <ErrorInput text={errors["brand"]?.message} />
          </Field>
        </div>
        <Field variant="flex-col" className="basis-1/2 gap-y-2">
          <Label
            htmlFor="phoneOrEmail"
            className="font-semibold text-secondary"
          >
            Mô tả sản phẩm<strong className="text-danger">*</strong>
          </Label>
          <Editor
            apiKey="upnnupf3dq8wz66922756jw4v2w241nvoxv3hvhnmqhng63w"
            onEditorChange={(_, editor) => {
              setValue("desc", editor.getContent());
              if (editor.getContent() === "") {
                setError("desc", { message: "Vui lòng điền vào mục này." });
              } else {
                clearErrors("desc");
              }
            }}
            initialValue={data.desc || ""}
            init={{
              height: 350,
              width: "100%",
              menubar: false,
              plugins: [
                "advlist",
                "anchor",
                "autolink",
                "charmap",
                "code",
                "fullscreen",
                "help",
                "image",
                "link",
                "lists",
                "preview",
                "searchreplace",
                "table",
                "visualblocks",
                "accordion",
                "table",
              ],
              toolbar1:
                "undo redo  | fontsizeinput  | bold italic underline strikethrough| backcolor forecolor | align bullist numlist |  link image table | charmap",
              font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              images_file_types: "jpg,png,jpeg",
              images_upload_handler: image_upload_handler,
              init_instance_callback: (editor) => {
                const MutationObserver = window.MutationObserver;
                const observer = new MutationObserver(function (
                  mutations_list
                ) {
                  mutations_list.forEach(function (mutation) {
                    mutation.removedNodes.forEach(function (removed_node) {
                      if (removed_node.nodeName == "IMG") {
                        const node = removed_node as HTMLElement;
                        removeWithImageUrl({
                          imageUrl: node.getAttribute("src") as string,
                        });
                      }
                    });
                  });
                });
                observer.observe(editor.getBody(), {
                  subtree: true,
                  childList: true,
                });
              },
            }}
          />
          <ErrorInput text={errors["desc"]?.message} />
        </Field>
        <div className="flex w-full gap-x-7">
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label htmlFor="price" className="font-semibold text-secondary">
              Giá sản phẩm (vnđ)<strong className="text-danger">*</strong>
            </Label>
            <InputForm
              control={control}
              type="number"
              name="price"
              id="price"
              onFocus={() => handleFocusInput("price")}
              onBlur={handleBLurInput}
              onChange={() => {
                clearErrors("price");
              }}
              error={errors["price"] ? true : false}
            />
            <ErrorInput text={errors["price"]?.message} />
          </Field>
          <Field variant="flex-col" className="basis-1/2 gap-y-3">
            <Label htmlFor="" className="font-semibold text-secondary">
              Trạng thái<strong className="text-danger">*</strong>
            </Label>
            <div className="flex items-center gap-x-5">
              <span className="flex items-center gap-x-2">
                <InputRadio
                  control={control}
                  name="status"
                  id="active"
                  value="active"
                  checked={watch("status") === "active"}
                ></InputRadio>
                <label htmlFor="active">Bán</label>
              </span>
              <span className="flex items-center gap-x-2">
                <InputRadio
                  control={control}
                  name="status"
                  id="deActive"
                  value="deActive"
                  checked={watch("status") === "deActive"}
                ></InputRadio>
                <label htmlFor="deActive">Chưa bán</label>
              </span>
            </div>
          </Field>
        </div>
        <Button
          variant="default"
          type="submit"
          disabled={
            Object.keys(errors).length === 0 && validateForm() ? false : true
          }
          className="max-w-[120px] ml-auto text-sm flex"
        >
          Tiếp theo
          <IconChevronRight size={20}></IconChevronRight>
        </Button>
      </form>
    </div>
  );
}

export default General;

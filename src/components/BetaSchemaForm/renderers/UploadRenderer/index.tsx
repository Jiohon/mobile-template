import { ImageUploader } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { ImageUploaderProps } from "antd-mobile"

import "./index.less"

export interface UploadRendererProps<TValues extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"upload", ImageUploaderProps, TValues> {}

const UploadRenderer = <TValues extends SchemaFormValuesType>({
  className,
  formItemProps,
  formInstance,
  ...restProps
}: UploadRendererProps<TValues>) => {
  return (
    <ImageUploader
      className={classNames("schema-form-upload-renderer", className)}
      {...restProps}
    />
  )
}

export default UploadRenderer

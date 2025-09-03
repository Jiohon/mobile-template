import { useMemo } from "react"

import { ImageUploader } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { ImageUploaderProps } from "antd-mobile"

import "./index.less"

export interface UploadRendererProps<TValues extends SchemaFormValuesType>
  extends ExpandCompPropsType<"upload", ImageUploaderProps, TValues> {
  readOnly?: boolean
}

const UploadRenderer = <TValues extends SchemaFormValuesType>({
  className,
  formItemProps,
  formInstance,
  showUpload: showUploadProp,
  disableUpload: disableUploadProp,
  deletable: deletableProp,
  ...restProps
}: UploadRendererProps<TValues>) => {
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const showUpload = useMemo(() => {
    return readOnly ? false : showUploadProp
  }, [readOnly, showUploadProp])

  const disableUpload = useMemo(() => {
    return readOnly ? true : disableUploadProp
  }, [readOnly, disableUploadProp])

  const deletable = useMemo(() => {
    return readOnly ? false : deletableProp
  }, [readOnly, deletableProp])

  return (
    <ImageUploader
      className={classNames("schema-form-upload-renderer", className)}
      showUpload={showUpload}
      disableUpload={disableUpload}
      deletable={deletable}
      {...restProps}
    />
  )
}

export default UploadRenderer

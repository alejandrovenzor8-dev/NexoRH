'use client'

import { forwardRef, useState, useRef } from 'react'
import type { FormFileUploadProps } from './types'
import { FormField } from './FormField'
import { UploadCloudIcon, XIcon, FileIcon } from 'lucide-react'

/**
 * Componente de file upload para formularios
 * Soporta drag and drop, single y multiple files
 */
export const FormFileUpload = forwardRef<
  HTMLInputElement,
  FormFileUploadProps<any>
>(function FormFileUpload(
  {
    name,
    label,
    placeholder,
    description,
    required,
    disabled,
    isLoading,
    error,
    containerClassName,
    inputClassName = '',
    onChange,
    hint,
    accept = '*',
    multiple = false,
    maxSize = 10,
    dragAndDropText = 'Arrastra archivos aquí o haz clic para seleccionar',
    onFileSelect,
    showPreview = false,
    ...rest
  },
  ref
) {
  const hasError = !!error
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        console.warn(`${file.name} excede el tamaño máximo de ${maxSize}MB`)
        return false
      }
      return true
    })

    if (multiple) {
      setSelectedFiles((prev) => [...prev, ...validFiles])
      // Compatible con react-hook-form - pasar evento sintético
      if (typeof onChange === 'function') {
        (onChange as any)({ target: { value: validFiles } } as any)
      }
      onFileSelect?.(validFiles)
    } else {
      setSelectedFiles(validFiles.slice(0, 1))
      if (typeof onChange === 'function') {
        (onChange as any)({ target: { value: validFiles[0] || null } } as any)
      }
      onFileSelect?.(validFiles.slice(0, 1))
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    if (typeof onChange === 'function') {
      (onChange as any)({ target: { value: multiple ? newFiles : (newFiles[0] || null) } } as any)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      description={description}
      hint={hint}
      containerClassName={containerClassName}
    >
      <div className="space-y-3">
        {/* Drop zone */}
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && (ref as any)?.current?.click()}
          className={`
            p-6 rounded-lg border-2 border-dashed
            transition-all duration-200
            cursor-pointer
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
            ${hasError ? 'border-red-500 bg-red-50' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloudIcon className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">{dragAndDropText}</p>
            <p className="text-xs text-gray-500">
              Máximo {maxSize}MB {multiple ? 'por archivo' : ''}
            </p>
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={ref}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled || isLoading}
          onChange={(e) => {
            handleFiles(Array.from(e.target.files || []))
          }}
          className="hidden"
          {...rest}
        />

        {/* File list */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">
              {selectedFiles.length} archivo{selectedFiles.length !== 1 ? 's' : ''} seleccionado{selectedFiles.length !== 1 ? 's' : ''}
            </p>
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded transition-colors ml-2 flex-shrink-0"
                >
                  <XIcon className="w-4 h-4 text-gray-500 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  )
})

FormFileUpload.displayName = 'FormFileUpload'

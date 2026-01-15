'use client'

import React, { useState } from 'react'
import type { Product } from '@/payload-types'
import { validateProductBlocks, validateBlock } from '@/lib/blocks/BlockValidator'

interface BlockDebuggerProps {
  product: Product
}

/**
 * BlockDebugger - Development tool for inspecting block data and validation
 * Only renders in development mode
 */
export function BlockDebugger({ product }: BlockDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const validation = validateProductBlocks(product)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-full text-white font-medium shadow-lg transition-all
          ${validation.isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        `}
      >
        🧩 Blocks {validation.validBlocks}/{validation.totalBlocks}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-auto bg-white border-2 border-gray-300 rounded-lg shadow-xl">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Block Debugger</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="font-semibold">Product: {product.name}</h4>
              <p className="text-sm text-gray-600">
                Type: {product.type} | Status: {product.status} | Category: {product.category}
              </p>
              {product.series && (
                <p className="text-xs text-gray-500">
                  Series: {product.series}
                </p>
              )}
            </div>

            {/* Validation Summary */}
            <div className={`mb-4 p-3 rounded ${validation.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
              <h4 className="font-semibold mb-2">
                {validation.isValid ? '✅ All Valid' : '❌ Issues Found'}
              </h4>
              <p className="text-sm">
                {validation.validBlocks} of {validation.totalBlocks} blocks valid
              </p>
            </div>

            {/* Blocks List */}
            <div className="space-y-2">
              {product.pageContent?.map((block: any, index: number) => {
                const blockValidation = validateBlock(block, index)
                return (
                  <div
                    key={block.id || index}
                    className={`
                      p-2 rounded cursor-pointer transition-colors
                      ${blockValidation.isValid ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}
                      ${selectedBlock === index ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => setSelectedBlock(selectedBlock === index ? null : index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {blockValidation.isValid ? '✅' : '❌'} {block.blockType || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500">#{index}</span>
                    </div>

                    {/* Block Details (when selected) */}
                    {selectedBlock === index && (
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        {/* Block ID */}
                        {block.id && (
                          <div className="mb-2">
                            <strong>ID:</strong> {block.id}
                          </div>
                        )}

                        {/* Data Source */}
                        {block.dataSource && (
                          <div className="mb-2">
                            <strong>Data Source:</strong> {block.dataSource}
                          </div>
                        )}

                        {/* Product Link */}
                        {block.product && (
                          <div className="mb-2">
                            <strong>Product:</strong> {typeof block.product === 'string' ? block.product : '✓ Linked'}
                          </div>
                        )}

                        {/* Validation Errors */}
                        {blockValidation.errors.length > 0 && (
                          <div className="mb-2">
                            <strong className="text-red-600">Errors:</strong>
                            <ul className="list-disc list-inside text-red-600 ml-2">
                              {blockValidation.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Validation Warnings */}
                        {blockValidation.warnings.length > 0 && (
                          <div className="mb-2">
                            <strong className="text-yellow-600">Warnings:</strong>
                            <ul className="list-disc list-inside text-yellow-600 ml-2">
                              {blockValidation.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {blockValidation.suggestions.length > 0 && (
                          <div className="mb-2">
                            <strong className="text-blue-600">Suggestions:</strong>
                            <ul className="list-disc list-inside text-blue-600 ml-2">
                              {blockValidation.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Block Data Toggle */}
                        <details className="mt-2">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                            Raw Block Data
                          </summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(block, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                )
              })}

              {(!product.pageContent || product.pageContent.length === 0) && (
                <div className="p-4 text-center text-gray-500">
                  <p>No blocks found</p>
                  <p className="text-xs mt-1">Add blocks to this product in the CMS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
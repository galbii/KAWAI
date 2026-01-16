/**
 * Modal Component Usage Examples
 *
 * These examples demonstrate how to use the Modal component in different scenarios.
 */

'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Example 1: Basic centered modal
export function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Basic Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
        <p className="text-muted-foreground">
          This is a basic centered modal with default settings.
        </p>
      </Modal>
    </>
  )
}

// Example 2: Large modal with no close button
export function LargeModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="lg"
        showCloseButton={false}
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        <h2 className="text-2xl font-bold mb-4">Important Notice</h2>
        <p className="text-muted-foreground mb-4">
          This modal requires explicit user action to close.
        </p>
        <Button onClick={() => setIsOpen(false)} className="w-full">
          I Understand
        </Button>
      </Modal>
    </>
  )
}

// Example 3: Split layout modal (70% image + 30% content)
export function SplitLayoutModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Product</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        layout="split"
      >
        {/* Left side - Image (70%) */}
        <div className="relative h-full min-h-[400px] md:min-h-[600px]">
          <Image
            src="/images/piano-showcase.jpg"
            alt="Piano"
            fill
            className="object-cover"
          />
        </div>

        {/* Right side - Content (30%) */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Kawai CA99</h2>
            <p className="text-muted-foreground mb-4">
              Premium digital piano with wooden keys and Grand Feel III action.
            </p>
            <ul className="space-y-2 text-sm">
              <li>88 wooden keys</li>
              <li>Grand Feel III action</li>
              <li>SK-EX Shigeru Kawai sound</li>
            </ul>
          </div>
          <Button className="w-full mt-4">Learn More</Button>
        </div>
      </Modal>
    </>
  )
}

// Example 4: Full-width modal
export function FullWidthModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="full"
        className="max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold mb-4">Piano Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Gallery images would go here */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg"
            />
          ))}
        </div>
      </Modal>
    </>
  )
}

// Example 5: Small confirmation modal
export function ConfirmationModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Action confirmed')
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive">
        Delete Item
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="sm"
      >
        <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
        <p className="text-muted-foreground mb-4">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}
